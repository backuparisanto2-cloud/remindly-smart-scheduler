import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { occurrencesFor, type ScheduleRow } from "./mailer.server";

export type SmtpInput = {
  id?: string | null;
  name: string;
  host: string;
  port: number;
  tls: boolean;
  from_email: string;
  from_name?: string | null;
  username: string;
  password?: string | null;
  verify_cert: boolean;
};

export type ReminderInput = {
  id?: string | null;
  title: string;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  subject: string;
  body: string;
  smtp_profile_id: string | null;
  enabled: boolean;
  timezone: string;
  schedules: {
    kind: "single" | "range";
    start_date: string | null;
    end_date: string | null;
    send_time: string;
    weekdays: number[];
  }[];
};

const SMTP_PUBLIC_COLUMNS =
  "id, name, host, port, tls, from_email, from_name, username, verify_cert, last_status, last_tested_at, created_at";

export async function listSmtpProfiles() {
  const { data, error } = await supabaseAdmin
    .from("smtp_profiles")
    .select(SMTP_PUBLIC_COLUMNS)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveSmtpProfile(input: SmtpInput) {
  const payload: Record<string, unknown> = {
    name: input.name,
    host: input.host,
    port: input.port,
    tls: input.tls,
    from_email: input.from_email,
    from_name: input.from_name ?? null,
    username: input.username,
    verify_cert: input.verify_cert,
  };
  if (input.password) payload["password"] = input.password;

  if (input.id) {
    const { error } = await supabaseAdmin.from("smtp_profiles").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { id: input.id };
  }
  const { data, error } = await supabaseAdmin
    .from("smtp_profiles")
    .insert({ ...payload, password: input.password ?? "" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function deleteSmtpProfile(id: string) {
  const { error } = await supabaseAdmin.from("smtp_profiles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function listReminders() {
  const { data, error } = await supabaseAdmin
    .from("reminders")
    .select("*, reminder_schedules(*), reminder_attachments(id, filename), smtp_profiles(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  const now = Date.now();
  return (data ?? []).map((reminder) => {
    const schedules = (reminder.reminder_schedules ?? []) as ScheduleRow[];
    const upcoming = occurrencesFor(schedules, reminder.timezone ?? "Asia/Jakarta").find(
      (d) => d.getTime() > now,
    );
    return {
      ...reminder,
      next_run: upcoming ? upcoming.toISOString() : null,
      schedule_count: schedules.length,
      attachment_count: (reminder.reminder_attachments ?? []).length,
      smtp_name: (reminder.smtp_profiles as { name: string } | null)?.name ?? null,
    };
  });
}

export async function getReminder(id: string) {
  const { data, error } = await supabaseAdmin
    .from("reminders")
    .select("*, reminder_schedules(*), reminder_attachments(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function saveReminder(input: ReminderInput) {
  const payload = {
    title: input.title,
    to_emails: input.to_emails,
    cc_emails: input.cc_emails,
    bcc_emails: input.bcc_emails,
    subject: input.subject,
    body: input.body,
    smtp_profile_id: input.smtp_profile_id,
    enabled: input.enabled,
    timezone: input.timezone,
  };

  let reminderId = input.id ?? null;
  if (reminderId) {
    const { error } = await supabaseAdmin.from("reminders").update(payload).eq("id", reminderId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabaseAdmin
      .from("reminders")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    reminderId = data.id;
  }

  await supabaseAdmin.from("reminder_schedules").delete().eq("reminder_id", reminderId!);
  if (input.schedules.length) {
    const { error } = await supabaseAdmin.from("reminder_schedules").insert(
      input.schedules.map((s) => ({
        reminder_id: reminderId,
        kind: s.kind,
        start_date: s.start_date,
        end_date: s.kind === "range" ? s.end_date : null,
        send_time: s.send_time,
        weekdays: s.weekdays,
      })),
    );
    if (error) throw new Error(error.message);
  }
  return { id: reminderId! };
}

export async function deleteReminder(id: string) {
  const { data: files } = await supabaseAdmin
    .from("reminder_attachments")
    .select("path")
    .eq("reminder_id", id);
  if (files?.length) {
    await supabaseAdmin.storage.from("attachments").remove(files.map((f) => f.path));
  }
  const { error } = await supabaseAdmin.from("reminders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function toggleReminder(id: string, enabled: boolean) {
  const { error } = await supabaseAdmin.from("reminders").update({ enabled }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function createUploadTicket(reminderId: string, filename: string) {
  const safe = filename.replace(/[^\w.\- ]+/g, "_");
  const path = `${reminderId}/${crypto.randomUUID()}-${safe}`;
  const { data, error } = await supabaseAdmin.storage
    .from("attachments")
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  return { path, token: data.token };
}

export async function registerAttachment(input: {
  reminder_id: string;
  path: string;
  filename: string;
  size_bytes: number;
  mime_type: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("reminder_attachments")
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function removeAttachment(id: string) {
  const { data } = await supabaseAdmin
    .from("reminder_attachments")
    .select("path")
    .eq("id", id)
    .maybeSingle();
  if (data?.path) await supabaseAdmin.storage.from("attachments").remove([data.path]);
  const { error } = await supabaseAdmin.from("reminder_attachments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function listLogs(limit = 200) {
  const { data, error } = await supabaseAdmin
    .from("send_logs")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function dashboardStats() {
  const reminders = await listReminders();
  const logs = await listLogs(50);
  return {
    total: reminders.length,
    active: reminders.filter((r) => r.enabled).length,
    nextRun:
      reminders
        .map((r) => r.next_run)
        .filter(Boolean)
        .sort()[0] ?? null,
    successCount: logs.filter((l) => l.status === "success").length,
    failedCount: logs.filter((l) => l.status === "failed").length,
  };
}
