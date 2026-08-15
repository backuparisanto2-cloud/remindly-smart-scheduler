import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendMail, testSmtp, type SmtpConfig } from "./smtp.server";

export type ScheduleRow = {
  id: string;
  kind: string;
  start_date: string | null;
  end_date: string | null;
  send_time: string;
  weekdays: number[];
};

/** Convert a wall-clock date/time in a named timezone to a UTC Date. */
export function zonedToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const asUtc = Date.UTC(y!, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, 0);
  // offset of that instant in the target zone
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date(asUtc)).map((p) => [p.type, p.value]));
  const local = Date.UTC(
    Number(parts["year"]),
    Number(parts["month"]) - 1,
    Number(parts["day"]),
    Number(parts["hour"]) % 24,
    Number(parts["minute"]),
    Number(parts["second"]),
  );
  return new Date(asUtc - (local - asUtc));
}

function eachDate(start: string, end: string): string[] {
  const out: string[] = [];
  const cur = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  let guard = 0;
  while (cur <= last && guard++ < 1500) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

export function occurrencesFor(schedules: ScheduleRow[], timeZone: string): Date[] {
  const out: Date[] = [];
  for (const s of schedules) {
    const time = (s.send_time ?? "09:00").slice(0, 5);
    if (!s.start_date) continue;
    if (s.kind === "range" && s.end_date) {
      for (const day of eachDate(s.start_date, s.end_date)) {
        const dow = new Date(`${day}T00:00:00Z`).getUTCDay();
        if (!s.weekdays?.length || s.weekdays.includes(dow)) {
          out.push(zonedToUtc(day, time, timeZone));
        }
      }
    } else {
      out.push(zonedToUtc(s.start_date, time, timeZone));
    }
  }
  return out.sort((a, b) => a.getTime() - b.getTime());
}

function b64Chunks(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const raw = btoa(bin);
  return raw.replace(/(.{76})/g, "$1\r\n");
}

function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  const bytes = new TextEncoder().encode(value);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return `=?UTF-8?B?${btoa(bin)}?=`;
}

export interface BuildOptions {
  from: string;
  fromName?: string | null;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  attachments: { filename: string; mime_type: string; bytes: Uint8Array }[];
}

export function buildMime(opts: BuildOptions): string {
  const boundary = `----lvbl${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  const fromHeader = opts.fromName
    ? `${encodeHeader(opts.fromName)} <${opts.from}>`
    : opts.from;

  const htmlBody = opts.body.includes("<") ? opts.body : opts.body.replace(/\n/g, "<br />");
  const bodyBytes = new TextEncoder().encode(
    `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#12271d;line-height:1.6">${htmlBody}</div>`,
  );

  const head = [
    `From: ${fromHeader}`,
    `To: ${opts.to.join(", ")}`,
    opts.cc?.length ? `Cc: ${opts.cc.join(", ")}` : null,
    `Subject: ${encodeHeader(opts.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@reminder>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
  ]
    .filter(Boolean)
    .join("\r\n");

  const parts = [
    `--${boundary}\r\nContent-Type: text/html; charset="UTF-8"\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64Chunks(bodyBytes)}`,
  ];

  for (const att of opts.attachments) {
    parts.push(
      `--${boundary}\r\nContent-Type: ${att.mime_type}; name="${att.filename}"\r\n` +
        `Content-Disposition: attachment; filename="${att.filename}"\r\n` +
        `Content-Transfer-Encoding: base64\r\n\r\n${b64Chunks(att.bytes)}`,
    );
  }

  return `${head}\r\n\r\n${parts.join("\r\n")}\r\n--${boundary}--`;
}

export async function loadSmtp(profileId: string | null): Promise<
  SmtpConfig & { from_email: string; from_name: string | null; name: string }
> {
  if (!profileId) throw new Error("Reminder belum memilih profil SMTP");
  const { data, error } = await supabaseAdmin
    .from("smtp_profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Profil SMTP tidak ditemukan");
  return data as never;
}

export async function runSmtpTest(profileId: string) {
  const cfg = await loadSmtp(profileId);
  let status = "Succeeded";
  try {
    await testSmtp(cfg);
  } catch (e) {
    status = `Failed: ${(e as Error).message}`;
  }
  await supabaseAdmin
    .from("smtp_profiles")
    .update({ last_status: status, last_tested_at: new Date().toISOString() })
    .eq("id", profileId);
  return status;
}

async function loadAttachments(reminderId: string) {
  const { data } = await supabaseAdmin
    .from("reminder_attachments")
    .select("*")
    .eq("reminder_id", reminderId);
  const out: { filename: string; mime_type: string; bytes: Uint8Array }[] = [];
  for (const row of data ?? []) {
    const file = await supabaseAdmin.storage.from("attachments").download(row.path);
    if (file.data) {
      out.push({
        filename: row.filename,
        mime_type: row.mime_type,
        bytes: new Uint8Array(await file.data.arrayBuffer()),
      });
    }
  }
  return out;
}

export async function sendReminder(
  reminderId: string,
  opts: { occurrenceAt?: string | null; source: "manual" | "auto" },
) {
  const { data: reminder, error } = await supabaseAdmin
    .from("reminders")
    .select("*")
    .eq("id", reminderId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!reminder) throw new Error("Reminder tidak ditemukan");

  const logBase = {
    reminder_id: reminder.id,
    reminder_title: reminder.title,
    occurrence_at: opts.occurrenceAt ?? null,
    recipients: (reminder.to_emails ?? []).join(", "),
    trigger_source: opts.source,
  };

  try {
    const cfg = await loadSmtp(reminder.smtp_profile_id);
    const attachments = await loadAttachments(reminder.id);
    const raw = buildMime({
      from: cfg.from_email,
      fromName: cfg.from_name,
      to: reminder.to_emails ?? [],
      cc: reminder.cc_emails ?? [],
      subject: reminder.subject,
      body: reminder.body,
      attachments,
    });
    await sendMail(cfg, {
      from: cfg.from_email,
      to: reminder.to_emails ?? [],
      cc: reminder.cc_emails ?? [],
      bcc: reminder.bcc_emails ?? [],
      raw,
    });
    await supabaseAdmin.from("send_logs").insert({ ...logBase, status: "success" });
    return { ok: true as const };
  } catch (e) {
    const message = (e as Error).message ?? "Gagal mengirim";
    await supabaseAdmin.from("send_logs").insert({ ...logBase, status: "failed", error: message });
    return { ok: false as const, error: message };
  }
}

/** Send every schedule occurrence that has come due and has not been sent yet. */
export async function dispatchDue() {
  const now = Date.now();
  const windowStart = now - 6 * 60 * 60 * 1000; // catch up to 6 hours late
  const { data: reminders } = await supabaseAdmin
    .from("reminders")
    .select("id, timezone, reminder_schedules(*)")
    .eq("enabled", true);

  let sent = 0;
  let failed = 0;
  for (const reminder of reminders ?? []) {
    const schedules = ((reminder as never as { reminder_schedules: ScheduleRow[] })
      .reminder_schedules ?? []) as ScheduleRow[];
    const due = occurrencesFor(schedules, reminder.timezone ?? "Asia/Jakarta").filter(
      (d) => d.getTime() <= now && d.getTime() >= windowStart,
    );
    for (const occurrence of due) {
      const iso = occurrence.toISOString();
      const { data: existing } = await supabaseAdmin
        .from("send_logs")
        .select("id")
        .eq("reminder_id", reminder.id)
        .eq("occurrence_at", iso)
        .maybeSingle();
      if (existing) continue;
      const result = await sendReminder(reminder.id, { occurrenceAt: iso, source: "auto" });
      if (result.ok) sent++;
      else failed++;
    }
  }
  return { sent, failed };
}
