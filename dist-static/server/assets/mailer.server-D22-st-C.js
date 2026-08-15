import { t as occurrencesFor } from "./schedule-DiBY0Sf0.js";
import { createClient } from "@supabase/supabase-js";
//#region src/integrations/supabase/client.server.ts
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseAdminClient() {
	const SUPABASE_URL = process.env["SUPABASE_URL"];
	const SUPABASE_SERVICE_ROLE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY) },
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
	return Reflect.get(_supabaseAdmin, prop, receiver);
} });
//#endregion
//#region src/lib/smtp.server.ts
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var StreamConn = class {
	socket;
	buffer = "";
	reader;
	writer;
	constructor(socket) {
		this.socket = socket;
		this.reader = socket.readable.getReader();
		this.writer = socket.writable.getWriter();
	}
	async write(data) {
		await this.writer.write(typeof data === "string" ? encoder.encode(data) : data);
	}
	async readLine() {
		while (!this.buffer.includes("\r\n")) {
			const { value, done } = await this.reader.read();
			if (done) break;
			if (value) this.buffer += decoder.decode(value, { stream: true });
		}
		const idx = this.buffer.indexOf("\r\n");
		if (idx === -1) {
			const rest = this.buffer;
			this.buffer = "";
			return rest;
		}
		const line = this.buffer.slice(0, idx);
		this.buffer = this.buffer.slice(idx + 2);
		return line;
	}
	async startTls() {
		if (!this.socket.startTls) throw new Error("STARTTLS not supported by runtime");
		this.reader.releaseLock();
		this.writer.releaseLock();
		const secure = this.socket.startTls();
		this.socket = secure;
		this.reader = secure.readable.getReader();
		this.writer = secure.writable.getWriter();
		this.buffer = "";
	}
	async close() {
		try {
			await this.socket.close();
		} catch {}
	}
};
var NodeConn = class {
	socket;
	buffer = "";
	chunks = [];
	waiter = null;
	closed = false;
	constructor(socket) {
		this.socket = socket;
		this.bind();
	}
	bind() {
		this.socket.on("data", (chunk) => {
			this.chunks.push(chunk);
			this.waiter?.();
		});
		this.socket.on("close", () => {
			this.closed = true;
			this.waiter?.();
		});
		this.socket.on("error", () => {
			this.closed = true;
			this.waiter?.();
		});
	}
	async write(data) {
		await new Promise((resolve, reject) => {
			this.socket.write(data, (err) => err ? reject(err) : resolve());
		});
	}
	async readLine() {
		while (!this.buffer.includes("\r\n")) {
			if (this.chunks.length) {
				this.buffer += this.chunks.shift().toString("utf8");
				continue;
			}
			if (this.closed) break;
			await new Promise((resolve) => {
				this.waiter = () => {
					this.waiter = null;
					resolve();
				};
			});
		}
		const idx = this.buffer.indexOf("\r\n");
		if (idx === -1) {
			const rest = this.buffer;
			this.buffer = "";
			return rest;
		}
		const line = this.buffer.slice(0, idx);
		this.buffer = this.buffer.slice(idx + 2);
		return line;
	}
	async startTls() {
		const tls = await import("node:tls");
		const plain = this.socket;
		plain.removeAllListeners("data");
		plain.removeAllListeners("close");
		plain.removeAllListeners("error");
		this.socket = await new Promise((resolve, reject) => {
			const secure = tls.connect({
				socket: plain,
				rejectUnauthorized: this.rejectUnauthorized,
				servername: this.servername
			}, () => resolve(secure));
			secure.on("error", reject);
		});
		this.chunks = [];
		this.buffer = "";
		this.bind();
	}
	rejectUnauthorized = false;
	servername = "";
	async close() {
		try {
			this.socket.destroy();
		} catch {}
	}
};
async function openConnection(cfg) {
	const implicitTls = cfg.tls && cfg.port === 465;
	try {
		return new StreamConn((await import(
			/* @vite-ignore */
			"cloudflare:sockets"
)).connect({
			hostname: cfg.host,
			port: cfg.port
		}, {
			secureTransport: implicitTls ? "on" : cfg.tls ? "starttls" : "off",
			allowHalfOpen: false
		}));
	} catch {}
	if (implicitTls) {
		const tls = await import("node:tls");
		return new NodeConn(await new Promise((resolve, reject) => {
			const s = tls.connect({
				host: cfg.host,
				port: cfg.port,
				rejectUnauthorized: cfg.verify_cert,
				servername: cfg.host
			}, () => resolve(s));
			s.on("error", reject);
			s.setTimeout(2e4, () => reject(/* @__PURE__ */ new Error("Koneksi SMTP timeout")));
		}));
	}
	const net = await import("node:net");
	const conn = new NodeConn(await new Promise((resolve, reject) => {
		const s = net.connect({
			host: cfg.host,
			port: cfg.port
		}, () => resolve(s));
		s.on("error", reject);
		s.setTimeout(2e4, () => reject(/* @__PURE__ */ new Error("Koneksi SMTP timeout")));
	}));
	conn.rejectUnauthorized = cfg.verify_cert;
	conn.servername = cfg.host;
	return conn;
}
async function readReply(conn) {
	const lines = [];
	for (;;) {
		const line = await conn.readLine();
		if (!line) break;
		lines.push(line);
		if (line.length < 4 || line[3] !== "-") break;
	}
	const text = lines.join("\n");
	const code = Number.parseInt(text.slice(0, 3), 10);
	return {
		code: Number.isNaN(code) ? 0 : code,
		text
	};
}
async function command(conn, cmd, expect) {
	await conn.write(cmd + "\r\n");
	const { code, text } = await readReply(conn);
	if (!expect.includes(code)) throw new Error(`SMTP ${cmd.split(" ")[0]} gagal: ${text || "tidak ada balasan"}`);
	return text;
}
function b64(value) {
	const bytes = encoder.encode(value);
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin);
}
async function handshake(conn, cfg) {
	const greeting = await readReply(conn);
	if (greeting.code !== 220) throw new Error(`Server menolak koneksi: ${greeting.text}`);
	let ehlo = await command(conn, `EHLO ${cfg.host}`, [250]);
	if (cfg.tls && cfg.port !== 465 && /STARTTLS/i.test(ehlo)) {
		await command(conn, "STARTTLS", [220]);
		await conn.startTls();
		ehlo = await command(conn, `EHLO ${cfg.host}`, [250]);
	}
	if (cfg.username) if (/AUTH[ -=].*PLAIN/i.test(ehlo)) await command(conn, `AUTH PLAIN ${b64(`\u0000${cfg.username}\u0000${cfg.password}`)}`, [235]);
	else {
		await command(conn, "AUTH LOGIN", [334]);
		await command(conn, b64(cfg.username), [334]);
		await command(conn, b64(cfg.password), [235]);
	}
	return ehlo;
}
async function testSmtp(cfg) {
	const conn = await openConnection(cfg);
	try {
		await handshake(conn, cfg);
		await command(conn, "QUIT", [221, 250]);
	} finally {
		await conn.close();
	}
}
async function sendMail(cfg, msg) {
	const conn = await openConnection(cfg);
	try {
		await handshake(conn, cfg);
		await command(conn, `MAIL FROM:<${msg.from}>`, [250]);
		const rcpts = [
			...msg.to,
			...msg.cc ?? [],
			...msg.bcc ?? []
		].filter(Boolean);
		if (rcpts.length === 0) throw new Error("Tidak ada penerima");
		for (const rcpt of rcpts) await command(conn, `RCPT TO:<${rcpt}>`, [250, 251]);
		await command(conn, "DATA", [354]);
		const body = msg.raw.replace(/\r?\n/g, "\r\n").replace(/\r\n\./g, "\r\n..");
		await conn.write(body + "\r\n.\r\n");
		const done = await readReply(conn);
		if (done.code !== 250) throw new Error(`Pengiriman ditolak: ${done.text}`);
		await command(conn, "QUIT", [221, 250]);
	} finally {
		await conn.close();
	}
}
//#endregion
//#region src/lib/mailer.server.ts
function b64Chunks(bytes) {
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/(.{76})/g, "$1\r\n");
}
function encodeHeader(value) {
	if (/^[\x00-\x7F]*$/.test(value)) return value;
	const bytes = new TextEncoder().encode(value);
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return `=?UTF-8?B?${btoa(bin)}?=`;
}
function buildMime(opts) {
	const boundary = `----lvbl${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
	const fromHeader = opts.fromName ? `${encodeHeader(opts.fromName)} <${opts.from}>` : opts.from;
	const htmlBody = opts.body.includes("<") ? opts.body : opts.body.replace(/\n/g, "<br />");
	const bodyBytes = new TextEncoder().encode(`<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#12271d;line-height:1.6">${htmlBody}</div>`);
	const head = [
		`From: ${fromHeader}`,
		`To: ${opts.to.join(", ")}`,
		opts.cc?.length ? `Cc: ${opts.cc.join(", ")}` : null,
		`Subject: ${encodeHeader(opts.subject)}`,
		`Date: ${(/* @__PURE__ */ new Date()).toUTCString()}`,
		`Message-ID: <${crypto.randomUUID()}@reminder>`,
		"MIME-Version: 1.0",
		`Content-Type: multipart/mixed; boundary="${boundary}"`
	].filter(Boolean).join("\r\n");
	const parts = [`--${boundary}\r\nContent-Type: text/html; charset="UTF-8"\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64Chunks(bodyBytes)}`];
	for (const att of opts.attachments) parts.push(`--${boundary}\r\nContent-Type: ${att.mime_type}; name="${att.filename}"\r\nContent-Disposition: attachment; filename="${att.filename}"\r\nContent-Transfer-Encoding: base64\r\n\r\n${b64Chunks(att.bytes)}`);
	return `${head}\r\n\r\n${parts.join("\r\n")}\r\n--${boundary}--`;
}
async function loadSmtp(profileId) {
	if (!profileId) throw new Error("Reminder belum memilih profil SMTP");
	const { data, error } = await supabaseAdmin.from("smtp_profiles").select("*").eq("id", profileId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Profil SMTP tidak ditemukan");
	return data;
}
async function runSmtpTest(profileId) {
	const cfg = await loadSmtp(profileId);
	let status = "Succeeded";
	try {
		await testSmtp(cfg);
	} catch (e) {
		status = `Failed: ${e.message}`;
	}
	await supabaseAdmin.from("smtp_profiles").update({
		last_status: status,
		last_tested_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", profileId);
	return status;
}
async function loadAttachments(reminderId) {
	const { data } = await supabaseAdmin.from("reminder_attachments").select("*").eq("reminder_id", reminderId);
	const out = [];
	for (const row of data ?? []) {
		const file = await supabaseAdmin.storage.from("attachments").download(row.path);
		if (file.data) out.push({
			filename: row.filename,
			mime_type: row.mime_type,
			bytes: new Uint8Array(await file.data.arrayBuffer())
		});
	}
	return out;
}
async function sendReminder(reminderId, opts) {
	const { data: reminder, error } = await supabaseAdmin.from("reminders").select("*").eq("id", reminderId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!reminder) throw new Error("Reminder tidak ditemukan");
	const logBase = {
		reminder_id: reminder.id,
		reminder_title: reminder.title,
		occurrence_at: opts.occurrenceAt ?? null,
		recipients: (reminder.to_emails ?? []).join(", "),
		trigger_source: opts.source
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
			attachments
		});
		await sendMail(cfg, {
			from: cfg.from_email,
			to: reminder.to_emails ?? [],
			cc: reminder.cc_emails ?? [],
			bcc: reminder.bcc_emails ?? [],
			raw
		});
		await supabaseAdmin.from("send_logs").insert({
			...logBase,
			status: "success"
		});
		return { ok: true };
	} catch (e) {
		const message = e.message ?? "Gagal mengirim";
		await supabaseAdmin.from("send_logs").insert({
			...logBase,
			status: "failed",
			error: message
		});
		return {
			ok: false,
			error: message
		};
	}
}
/** Send every schedule occurrence that has come due and has not been sent yet. */
async function dispatchDue() {
	const now = Date.now();
	const windowStart = now - 360 * 60 * 1e3;
	const { data: reminders } = await supabaseAdmin.from("reminders").select("id, timezone, reminder_schedules(*)").eq("enabled", true);
	let sent = 0;
	let failed = 0;
	for (const reminder of reminders ?? []) {
		const due = occurrencesFor(reminder.reminder_schedules ?? [], reminder.timezone ?? "Asia/Jakarta").filter((d) => d.getTime() <= now && d.getTime() >= windowStart);
		for (const occurrence of due) {
			const iso = occurrence.toISOString();
			const { data: existing } = await supabaseAdmin.from("send_logs").select("id").eq("reminder_id", reminder.id).eq("occurrence_at", iso).maybeSingle();
			if (existing) continue;
			if ((await sendReminder(reminder.id, {
				occurrenceAt: iso,
				source: "auto"
			})).ok) sent++;
			else failed++;
		}
	}
	return {
		sent,
		failed
	};
}
//#endregion
export { dispatchDue, runSmtpTest, sendReminder };
