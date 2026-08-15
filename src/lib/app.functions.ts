import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const scheduleSchema = z.object({
  kind: z.enum(["single", "range"]),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  send_time: z.string(),
  weekdays: z.array(z.number()),
});

const reminderSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().trim().min(1).max(120),
  to_emails: z.array(z.string().email()).min(1).max(50),
  cc_emails: z.array(z.string().email()).max(50),
  bcc_emails: z.array(z.string().email()).max(50),
  subject: z.string().trim().min(1).max(200),
  body: z.string().max(20000),
  smtp_profile_id: z.string().uuid().nullable(),
  enabled: z.boolean(),
  timezone: z.string().max(60),
  schedules: z.array(scheduleSchema).max(50),
});

const smtpSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  name: z.string().trim().min(1).max(80),
  host: z.string().trim().min(1).max(200),
  port: z.number().int().min(1).max(65535),
  tls: z.boolean(),
  from_email: z.string().email(),
  from_name: z.string().max(120).nullable().optional(),
  username: z.string().max(200),
  password: z.string().max(400).nullable().optional(),
  verify_cert: z.boolean(),
});

export const fetchReminders = createServerFn({ method: "GET" }).handler(async () => {
  const { listReminders } = await import("./data.server");
  return listReminders();
});

export const fetchDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const { dashboardStats } = await import("./data.server");
  return dashboardStats();
});

export const fetchReminder = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { getReminder } = await import("./data.server");
    return getReminder(data.id);
  });

export const upsertReminder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => reminderSchema.parse(d))
  .handler(async ({ data }) => {
    const { saveReminder } = await import("./data.server");
    return saveReminder(data);
  });

export const removeReminder = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { deleteReminder } = await import("./data.server");
    return deleteReminder(data.id);
  });

export const setReminderEnabled = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string; enabled: boolean }) =>
    z.object({ id: z.string().uuid(), enabled: z.boolean() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { toggleReminder } = await import("./data.server");
    return toggleReminder(data.id, data.enabled);
  });

export const sendReminderNow = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { sendReminder } = await import("./mailer.server");
    return sendReminder(data.id, { source: "manual" });
  });

export const fetchSmtpProfiles = createServerFn({ method: "GET" }).handler(async () => {
  const { listSmtpProfiles } = await import("./data.server");
  return listSmtpProfiles();
});

export const upsertSmtpProfile = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => smtpSchema.parse(d))
  .handler(async ({ data }) => {
    const { saveSmtpProfile } = await import("./data.server");
    return saveSmtpProfile(data);
  });

export const removeSmtpProfile = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { deleteSmtpProfile } = await import("./data.server");
    return deleteSmtpProfile(data.id);
  });

export const testSmtpProfile = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { runSmtpTest } = await import("./mailer.server");
    return { status: await runSmtpTest(data.id) };
  });

export const requestUploadTicket = createServerFn({ method: "POST" })
  .inputValidator((d: { reminderId: string; filename: string }) =>
    z
      .object({ reminderId: z.string().uuid(), filename: z.string().min(1).max(200) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { createUploadTicket } = await import("./data.server");
    return createUploadTicket(data.reminderId, data.filename);
  });

export const saveAttachment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        reminder_id: z.string().uuid(),
        path: z.string().min(1),
        filename: z.string().min(1).max(200),
        size_bytes: z.number().int().min(0).max(25 * 1024 * 1024),
        mime_type: z.string().max(150),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { registerAttachment } = await import("./data.server");
    return registerAttachment(data);
  });

export const deleteAttachment = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { removeAttachment } = await import("./data.server");
    return removeAttachment(data.id);
  });

export const fetchLogs = createServerFn({ method: "GET" }).handler(async () => {
  const { listLogs } = await import("./data.server");
  return listLogs(200);
});
