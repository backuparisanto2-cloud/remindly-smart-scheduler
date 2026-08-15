import { t as occurrencesFor } from "./schedule-DiBY0Sf0.js";
import { t as supabase } from "./client-BnZaao0h.js";
import { a as cn, o as signOut, r as Button, s as useSession } from "./card-d1iskoGV.js";
import { useEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CalendarClock, History, LogOut, Mail, Server } from "lucide-react";
//#region src/lib/backend.ts
/**
* SMTP delivery needs raw TCP sockets, so it stays on the Lovable Cloud backend
* even when the UI is hosted as static files on ordinary web hosting.
*
* Set VITE_BACKEND_URL at build time to point at your own backend URL; when it
* is absent the app uses the published Lovable URL (same origin while running
* inside Lovable).
*/
var FALLBACK_BACKEND = "https://remindly-smart-scheduler.lovable.app";
function backendUrl() {
	const configured = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "sb_publishable_WSPi3tIsdu4nFJhjNS-wRQ_XUJERfUi",
		"VITE_SUPABASE_PROJECT_ID": "sphkfdwlovdnbtpeqfhz",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_WSPi3tIsdu4nFJhjNS-wRQ_XUJERfUi",
		"VITE_SUPABASE_URL": "https://sphkfdwlovdnbtpeqfhz.supabase.co"
	}["VITE_BACKEND_URL"];
	if (configured) return configured.replace(/\/$/, "");
	if (typeof window !== "undefined" && window.location.hostname.endsWith("lovable.app")) return window.location.origin;
	return FALLBACK_BACKEND;
}
async function callBackend(path, body) {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	if (!token) throw new Error("Sesi login berakhir, silakan masuk kembali.");
	const res = await fetch(`${backendUrl()}${path}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify(body)
	});
	const json = await res.json().catch(() => ({}));
	if (!res.ok) throw new Error(json.error ?? `Backend error ${res.status}`);
	return json;
}
//#endregion
//#region src/lib/app.functions.ts
/**
* Data layer for the static (SPA) build.
*
* All reads/writes go straight from the browser to Lovable Cloud using the
* signed-in admin session (RLS: authenticated only). Only SMTP delivery runs on
* the backend, because it needs raw TCP sockets — see src/lib/backend.ts.
*/
/** Identity helper so page components keep the same call style as before. */
function useServerFn(fn) {
	return fn;
}
var SMTP_PUBLIC_COLUMNS = "id, name, host, port, tls, from_email, from_name, username, verify_cert, last_status, last_tested_at, created_at";
function unwrap(res) {
	if (res.error) throw new Error(res.error.message);
	return res.data;
}
async function fetchReminders() {
	const data = unwrap(await supabase.from("reminders").select("*, reminder_schedules(*), reminder_attachments(id, filename), smtp_profiles(name)").order("created_at", { ascending: false }));
	const now = Date.now();
	return (data ?? []).map((reminder) => {
		const schedules = reminder.reminder_schedules ?? [];
		const upcoming = occurrencesFor(schedules, reminder.timezone ?? "Asia/Jakarta").find((d) => d.getTime() > now);
		return {
			...reminder,
			next_run: upcoming ? upcoming.toISOString() : null,
			schedule_count: schedules.length,
			attachment_count: (reminder.reminder_attachments ?? []).length,
			smtp_name: reminder.smtp_profiles?.name ?? null
		};
	});
}
async function fetchLogs(limit = 200) {
	return unwrap(await supabase.from("send_logs").select("*").order("sent_at", { ascending: false }).limit(limit)) ?? [];
}
async function fetchDashboard() {
	const reminders = await fetchReminders();
	const logs = await fetchLogs(50);
	return {
		total: reminders.length,
		active: reminders.filter((r) => r.enabled).length,
		nextRun: reminders.map((r) => r.next_run).filter(Boolean).sort()[0] ?? null,
		successCount: logs.filter((l) => l.status === "success").length,
		failedCount: logs.filter((l) => l.status === "failed").length
	};
}
async function fetchReminder({ data }) {
	return unwrap(await supabase.from("reminders").select("*, reminder_schedules(*), reminder_attachments(*)").eq("id", data.id).maybeSingle());
}
async function upsertReminder({ data: input }) {
	const payload = {
		title: input.title,
		to_emails: input.to_emails,
		cc_emails: input.cc_emails,
		bcc_emails: input.bcc_emails,
		subject: input.subject,
		body: input.body,
		smtp_profile_id: input.smtp_profile_id,
		enabled: input.enabled,
		timezone: input.timezone
	};
	let reminderId = input.id ?? null;
	if (reminderId) unwrap(await supabase.from("reminders").update(payload).eq("id", reminderId).select("id"));
	else reminderId = unwrap(await supabase.from("reminders").insert(payload).select("id").single()).id;
	unwrap(await supabase.from("reminder_schedules").delete().eq("reminder_id", reminderId).select("id"));
	if (input.schedules.length) unwrap(await supabase.from("reminder_schedules").insert(input.schedules.map((s) => ({
		reminder_id: reminderId,
		kind: s.kind,
		start_date: s.start_date,
		end_date: s.kind === "range" ? s.end_date : null,
		send_time: s.send_time,
		weekdays: s.weekdays
	}))).select("id"));
	return { id: reminderId };
}
async function removeReminder({ data }) {
	const files = unwrap(await supabase.from("reminder_attachments").select("path").eq("reminder_id", data.id));
	if (files?.length) await supabase.storage.from("attachments").remove(files.map((f) => f.path));
	unwrap(await supabase.from("reminders").delete().eq("id", data.id).select("id"));
	return { ok: true };
}
async function setReminderEnabled({ data }) {
	unwrap(await supabase.from("reminders").update({ enabled: data.enabled }).eq("id", data.id).select("id"));
	return { ok: true };
}
async function fetchSmtpProfiles() {
	return unwrap(await supabase.from("smtp_profiles").select(SMTP_PUBLIC_COLUMNS).order("created_at", { ascending: true })) ?? [];
}
async function upsertSmtpProfile({ data: input }) {
	const payload = {
		name: input.name,
		host: input.host,
		port: input.port,
		tls: input.tls,
		from_email: input.from_email,
		from_name: input.from_name ?? null,
		username: input.username,
		verify_cert: input.verify_cert,
		...input.password ? { password: input.password } : {}
	};
	if (input.id) {
		unwrap(await supabase.from("smtp_profiles").update(payload).eq("id", input.id).select("id"));
		return { id: input.id };
	}
	return { id: unwrap(await supabase.from("smtp_profiles").insert({
		...payload,
		password: input.password ?? ""
	}).select("id").single()).id };
}
async function removeSmtpProfile({ data }) {
	unwrap(await supabase.from("smtp_profiles").delete().eq("id", data.id).select("id"));
	return { ok: true };
}
async function requestUploadTicket({ data }) {
	const safe = data.filename.replace(/[^\w.\- ]+/g, "_");
	const path = `${data.reminderId}/${crypto.randomUUID()}-${safe}`;
	const res = await supabase.storage.from("attachments").createSignedUploadUrl(path);
	if (res.error) throw new Error(res.error.message);
	return {
		path,
		token: res.data.token
	};
}
async function saveAttachment({ data }) {
	return unwrap(await supabase.from("reminder_attachments").insert(data).select("*").single());
}
async function deleteAttachment({ data }) {
	const row = unwrap(await supabase.from("reminder_attachments").select("path").eq("id", data.id).maybeSingle());
	if (row?.path) await supabase.storage.from("attachments").remove([row.path]);
	unwrap(await supabase.from("reminder_attachments").delete().eq("id", data.id).select("id"));
	return { ok: true };
}
async function sendReminderNow({ data }) {
	return callBackend("/api/public/mail/send", { id: data.id });
}
async function testSmtpProfile({ data }) {
	return callBackend("/api/public/mail/test", { id: data.id });
}
//#endregion
//#region src/components/AppShell.tsx
var NAV = [
	{
		to: "/",
		label: "Dasbor",
		icon: CalendarClock
	},
	{
		to: "/smtp",
		label: "SMTP",
		icon: Server
	},
	{
		to: "/logs",
		label: "Riwayat",
		icon: History
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const { session, ready } = useSession();
	useEffect(() => {
		if (ready && !session) navigate({ to: "/auth" });
	}, [
		ready,
		session,
		navigate
	]);
	if (!ready || !session) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground",
		children: "Memuat…"
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between sm:px-6",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-primary-foreground",
								style: { backgroundImage: "var(--gradient-primary)" },
								children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsxs("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "block truncate font-display text-lg leading-tight font-semibold",
									children: "Reminder Mail"
								}), /* @__PURE__ */ jsx("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: "Penjadwal email SMTP"
								})]
							})]
						}),
						/* @__PURE__ */ jsx("nav", {
							className: "flex items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 shadow-[var(--shadow-soft)]",
							children: NAV.map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
								return /* @__PURE__ */ jsxs(Link, {
									to: item.to,
									className: cn("flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"),
									children: [/* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: item.label
									})]
								}, item.to);
							})
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							className: "col-span-2 justify-self-end text-muted-foreground sm:col-auto",
							onClick: async () => {
								await signOut();
								navigate({ to: "/auth" });
							},
							children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "Keluar"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("main", {
				className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
				children
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "mx-auto max-w-6xl px-4 pb-10 text-xs text-muted-foreground sm:px-6",
				children: "Pengingat email terjadwal · zona waktu Asia/Jakarta"
			})
		]
	});
}
//#endregion
//#region src/lib/format.ts
var TZ = "Asia/Jakarta";
var TIMEZONES = [
	{
		value: "Asia/Jakarta",
		label: "WIB — Jakarta (UTC+7)"
	},
	{
		value: "Asia/Makassar",
		label: "WITA — Makassar (UTC+8)"
	},
	{
		value: "Asia/Jayapura",
		label: "WIT — Jayapura (UTC+9)"
	},
	{
		value: "Asia/Singapore",
		label: "Singapura (UTC+8)"
	},
	{
		value: "Asia/Kuala_Lumpur",
		label: "Kuala Lumpur (UTC+8)"
	},
	{
		value: "Asia/Bangkok",
		label: "Bangkok (UTC+7)"
	},
	{
		value: "Asia/Tokyo",
		label: "Tokyo (UTC+9)"
	},
	{
		value: "Asia/Shanghai",
		label: "Shanghai (UTC+8)"
	},
	{
		value: "Asia/Dubai",
		label: "Dubai (UTC+4)"
	},
	{
		value: "Europe/London",
		label: "London (UTC+0/+1)"
	},
	{
		value: "Europe/Amsterdam",
		label: "Amsterdam (UTC+1/+2)"
	},
	{
		value: "America/New_York",
		label: "New York (UTC-5/-4)"
	},
	{
		value: "America/Los_Angeles",
		label: "Los Angeles (UTC-8/-7)"
	},
	{
		value: "Australia/Sydney",
		label: "Sydney (UTC+10/+11)"
	},
	{
		value: "UTC",
		label: "UTC"
	}
];
function deviceTimezone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
	} catch {
		return TZ;
	}
}
function timezoneLabel(tz) {
	return TIMEZONES.find((t) => t.value === tz)?.label ?? tz;
}
function formatDateTime(value, timeZone = TZ) {
	if (!value) return "—";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("id-ID", {
		timeZone,
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	}).format(date);
}
function formatBytes(bytes) {
	if (!bytes) return "0 B";
	const units = [
		"B",
		"KB",
		"MB",
		"GB"
	];
	const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
var WEEKDAYS = [
	{
		value: 0,
		label: "Min"
	},
	{
		value: 1,
		label: "Sen"
	},
	{
		value: 2,
		label: "Sel"
	},
	{
		value: 3,
		label: "Rab"
	},
	{
		value: 4,
		label: "Kam"
	},
	{
		value: 5,
		label: "Jum"
	},
	{
		value: 6,
		label: "Sab"
	}
];
//#endregion
export { useServerFn as C, upsertSmtpProfile as S, saveAttachment as _, formatDateTime as a, testSmtpProfile as b, deleteAttachment as c, fetchReminder as d, fetchReminders as f, requestUploadTicket as g, removeSmtpProfile as h, formatBytes as i, fetchDashboard as l, removeReminder as m, WEEKDAYS as n, timezoneLabel as o, fetchSmtpProfiles as p, deviceTimezone as r, AppShell as s, TIMEZONES as t, fetchLogs as u, sendReminderNow as v, upsertReminder as x, setReminderEnabled as y };
