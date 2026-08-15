import { t as Route } from "./_id-C9PzSTuc.js";
import { C as useServerFn, d as fetchReminder, s as AppShell } from "./format-DfwW21Qf.js";
import { t as Skeleton } from "./skeleton-BQQuBwNp.js";
import { n as emptyReminder, t as ReminderForm } from "./ReminderForm-qEonc8Zg.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
//#region src/routes/reminders/$id.tsx?tsr-split=component
function EditReminder() {
	const { id } = Route.useParams();
	const load = useServerFn(fetchReminder);
	const query = useQuery({
		queryKey: ["reminder", id],
		queryFn: () => load({ data: { id } })
	});
	const data = query.data;
	return /* @__PURE__ */ jsxs(AppShell, { children: [
		/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-semibold sm:text-3xl",
			children: "Ubah reminder"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-1 mb-6 text-sm text-muted-foreground",
			children: "Perbarui isi pesan, jadwal, atau lampiran."
		}),
		query.isLoading ? /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-80 w-full rounded-xl" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-80 w-full rounded-xl" })]
		}) : !data ? /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Reminder tidak ditemukan."
		}) : /* @__PURE__ */ jsx(ReminderForm, { initial: {
			...emptyReminder,
			id: data.id,
			title: data.title ?? "",
			to_emails: (data.to_emails ?? []).join(", "),
			cc_emails: (data.cc_emails ?? []).join(", "),
			bcc_emails: (data.bcc_emails ?? []).join(", "),
			subject: data.subject ?? "",
			body: data.body ?? "",
			smtp_profile_id: data.smtp_profile_id ?? null,
			enabled: !!data.enabled,
			timezone: data.timezone ?? "Asia/Jakarta",
			schedules: (data.reminder_schedules ?? []).map((s) => ({
				kind: s.kind,
				start_date: s.start_date ?? "",
				end_date: s.end_date ?? "",
				send_time: (s.send_time ?? "08:00:00").slice(0, 5),
				weekdays: s.weekdays ?? []
			})),
			attachments: (data.reminder_attachments ?? []).map((a) => ({
				id: a.id,
				filename: a.filename,
				size_bytes: a.size_bytes
			}))
		} })
	] });
}
//#endregion
export { EditReminder as component };
