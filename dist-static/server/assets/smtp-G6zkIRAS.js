import { n as CardContent, r as Button, t as Card } from "./card-d1iskoGV.js";
import { n as Input, t as Label } from "./label-DZ0DLGWF.js";
import { C as useServerFn, S as upsertSmtpProfile, a as formatDateTime, b as testSmtpProfile, h as removeSmtpProfile, p as fetchSmtpProfiles, s as AppShell } from "./format-DfwW21Qf.js";
import { n as Switch, t as Separator } from "./separator-C4wd_xJg.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Plus, Server, Trash2, XCircle } from "lucide-react";
//#region src/routes/smtp.tsx?tsr-split=component
var emptyDraft = {
	id: null,
	name: "",
	host: "",
	port: 465,
	tls: true,
	from_email: "",
	from_name: "",
	username: "",
	password: "",
	verify_cert: true
};
function SmtpPage() {
	const qc = useQueryClient();
	const list = useServerFn(fetchSmtpProfiles);
	const save = useServerFn(upsertSmtpProfile);
	const destroy = useServerFn(removeSmtpProfile);
	const test = useServerFn(testSmtpProfile);
	const [draft, setDraft] = useState(emptyDraft);
	const [busy, setBusy] = useState(false);
	const [testing, setTesting] = useState(null);
	const profiles = useQuery({
		queryKey: ["smtp"],
		queryFn: () => list()
	});
	const set = (k, v) => setDraft((d) => ({
		...d,
		[k]: v
	}));
	async function submit() {
		setBusy(true);
		try {
			await save({ data: {
				id: draft.id,
				name: draft.name.trim(),
				host: draft.host.trim(),
				port: Number(draft.port),
				tls: draft.tls,
				from_email: draft.from_email.trim(),
				from_name: draft.from_name.trim() || null,
				username: draft.username.trim(),
				password: draft.password || null,
				verify_cert: draft.verify_cert
			} });
			toast.success("Profil SMTP tersimpan");
			setDraft(emptyDraft);
			qc.invalidateQueries({ queryKey: ["smtp"] });
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ jsxs(AppShell, { children: [
		/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-semibold sm:text-3xl",
			children: "Server SMTP"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-1 mb-6 text-sm text-muted-foreground",
			children: "Kredensial disimpan di server dan tidak pernah dikirim kembali ke browser."
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ jsx(Card, {
				className: "border-border/70 shadow-[var(--shadow-soft)]",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-4 p-6",
					children: [
						/* @__PURE__ */ jsxs("h2", {
							className: "flex items-center gap-2 text-lg font-semibold",
							children: [/* @__PURE__ */ jsx(Server, { className: "h-5 w-5 shrink-0 text-primary" }), draft.id ? "Ubah profil" : "Profil baru"]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "name",
								children: "Nama profil"
							}), /* @__PURE__ */ jsx(Input, {
								id: "name",
								value: draft.name,
								onChange: (e) => set("name", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "host",
									children: "Server"
								}), /* @__PURE__ */ jsx(Input, {
									id: "host",
									placeholder: "webmail.contoh.co.id",
									value: draft.host,
									onChange: (e) => set("host", e.target.value)
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "port",
									children: "Port"
								}), /* @__PURE__ */ jsx(Input, {
									id: "port",
									type: "number",
									value: draft.port,
									onChange: (e) => set("port", Number(e.target.value))
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "from",
									children: "Email pengirim"
								}), /* @__PURE__ */ jsx(Input, {
									id: "from",
									type: "email",
									value: draft.from_email,
									onChange: (e) => set("from_email", e.target.value)
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "fromname",
									children: "Nama pengirim"
								}), /* @__PURE__ */ jsx(Input, {
									id: "fromname",
									value: draft.from_name,
									onChange: (e) => set("from_name", e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "user",
									children: "Username"
								}), /* @__PURE__ */ jsx(Input, {
									id: "user",
									value: draft.username,
									onChange: (e) => set("username", e.target.value)
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "pass",
									children: "Password"
								}), /* @__PURE__ */ jsx(Input, {
									id: "pass",
									type: "password",
									placeholder: draft.id ? "Biarkan kosong jika tidak diubah" : "",
									value: draft.password,
									onChange: (e) => set("password", e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ jsx(Separator, {}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium",
									children: "Gunakan TLS"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Port 465 memakai TLS langsung, port 587 memakai STARTTLS."
								})]
							}), /* @__PURE__ */ jsx(Switch, {
								checked: draft.tls,
								onCheckedChange: (v) => set("tls", v)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium",
									children: "Verifikasi sertifikat"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground",
									children: "Matikan bila server memakai self-signed."
								})]
							}), /* @__PURE__ */ jsx(Switch, {
								checked: draft.verify_cert,
								onCheckedChange: (v) => set("verify_cert", v)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsxs(Button, {
								onClick: submit,
								disabled: busy,
								className: "rounded-full",
								children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "Simpan profil"]
							}), draft.id ? /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								className: "rounded-full",
								onClick: () => setDraft(emptyDraft),
								children: "Batal"
							}) : null]
						})
					]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [(profiles.data ?? []).map((p) => /* @__PURE__ */ jsx(Card, {
					className: "border-border/70 shadow-[var(--shadow-soft)]",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "truncate font-medium",
									children: p.name
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										p.host,
										":",
										p.port,
										" · ",
										p.tls ? "TLS" : "tanpa TLS",
										" · ",
										p.from_email
									]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-1 flex items-center gap-1 text-xs",
									children: [p.last_status === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-primary" }) : p.last_status ? /* @__PURE__ */ jsx(XCircle, { className: "h-3.5 w-3.5 text-destructive" }) : null, /* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: p.last_status ? `${p.last_status} · ${formatDateTime(p.last_tested_at)}` : "belum diuji"
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex shrink-0 flex-wrap gap-2",
							children: [
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "secondary",
									className: "rounded-full",
									disabled: testing === p.id,
									onClick: async () => {
										setTesting(p.id);
										try {
											const res = await test({ data: { id: p.id } });
											if (res.status === "success") toast.success("Koneksi SMTP berhasil");
											else toast.error(`Uji gagal: ${res.status}`);
										} catch (e) {
											toast.error(e.message);
										} finally {
											setTesting(null);
											qc.invalidateQueries({ queryKey: ["smtp"] });
										}
									},
									children: [testing === p.id ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : null, " Uji"]
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "outline",
									className: "rounded-full",
									onClick: () => setDraft({
										id: p.id,
										name: p.name,
										host: p.host,
										port: p.port,
										tls: p.tls,
										from_email: p.from_email,
										from_name: p.from_name ?? "",
										username: p.username,
										password: "",
										verify_cert: p.verify_cert
									}),
									children: "Ubah"
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									className: "rounded-full text-destructive",
									onClick: async () => {
										if (!confirm(`Hapus profil "${p.name}"?`)) return;
										await destroy({ data: { id: p.id } });
										qc.invalidateQueries({ queryKey: ["smtp"] });
									},
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
								})
							]
						})]
					})
				}, p.id)), profiles.data?.length === 0 ? /* @__PURE__ */ jsx(Card, {
					className: "border-dashed",
					children: /* @__PURE__ */ jsx(CardContent, {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "Belum ada profil SMTP."
					})
				}) : null]
			})]
		})
	] });
}
//#endregion
export { SmtpPage as component };
