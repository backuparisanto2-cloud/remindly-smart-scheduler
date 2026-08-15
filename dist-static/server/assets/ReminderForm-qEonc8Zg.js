import { t as supabase } from "./client-BnZaao0h.js";
import { a as cn, n as CardContent, r as Button, t as Card } from "./card-d1iskoGV.js";
import { n as Input, t as Label } from "./label-DZ0DLGWF.js";
import { C as useServerFn, _ as saveAttachment, c as deleteAttachment, g as requestUploadTicket, i as formatBytes, n as WEEKDAYS, o as timezoneLabel, p as fetchSmtpProfiles, r as deviceTimezone, t as TIMEZONES, x as upsertReminder } from "./format-DfwW21Qf.js";
import { n as Switch, t as Separator } from "./separator-C4wd_xJg.js";
import * as React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarRange, Check, ChevronDown, ChevronUp, Loader2, Paperclip, Plus, Trash2 } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
//#region src/components/ui/textarea.tsx
var Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
//#region src/components/ui/select.tsx
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
		/* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ jsx(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
}));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
//#region src/components/ReminderForm.tsx
var emptyReminder = {
	id: null,
	title: "",
	to_emails: "",
	cc_emails: "",
	bcc_emails: "",
	subject: "",
	body: "",
	smtp_profile_id: null,
	enabled: true,
	timezone: "Asia/Jakarta",
	schedules: [{
		kind: "single",
		start_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		end_date: "",
		send_time: "08:00",
		weekdays: [
			1,
			2,
			3,
			4,
			5
		]
	}],
	attachments: []
};
var splitEmails = (value) => value.split(/[,;\s]+/).map((v) => v.trim()).filter(Boolean);
function ReminderForm({ initial }) {
	const navigate = useNavigate();
	const [form, setForm] = useState(initial);
	const tzOptions = useMemo(() => {
		const list = [...TIMEZONES];
		for (const tz of [deviceTimezone(), initial.timezone]) if (tz && !list.some((t) => t.value === tz)) list.unshift({
			value: tz,
			label: tz
		});
		return list;
	}, [initial.timezone]);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const listSmtp = useServerFn(fetchSmtpProfiles);
	const save = useServerFn(upsertReminder);
	const ticket = useServerFn(requestUploadTicket);
	const registerFile = useServerFn(saveAttachment);
	const dropFile = useServerFn(deleteAttachment);
	const smtp = useQuery({
		queryKey: ["smtp"],
		queryFn: () => listSmtp()
	});
	const set = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	const patchSchedule = (index, patch) => setForm((f) => ({
		...f,
		schedules: f.schedules.map((s, i) => i === index ? {
			...s,
			...patch
		} : s)
	}));
	async function persist() {
		const to = splitEmails(form.to_emails);
		if (!form.title.trim()) return toast.error("Judul wajib diisi"), null;
		if (!to.length) return toast.error("Minimal satu email tujuan"), null;
		if (!form.subject.trim()) return toast.error("Subjek wajib diisi"), null;
		if (!form.smtp_profile_id) return toast.error("Pilih profil SMTP"), null;
		return (await save({ data: {
			id: form.id,
			title: form.title.trim(),
			to_emails: to,
			cc_emails: splitEmails(form.cc_emails),
			bcc_emails: splitEmails(form.bcc_emails),
			subject: form.subject.trim(),
			body: form.body,
			smtp_profile_id: form.smtp_profile_id,
			enabled: form.enabled,
			timezone: form.timezone,
			schedules: form.schedules.map((s) => ({
				kind: s.kind,
				start_date: s.start_date || null,
				end_date: s.kind === "range" ? s.end_date || null : null,
				send_time: s.send_time.length === 5 ? `${s.send_time}:00` : s.send_time,
				weekdays: s.kind === "range" ? s.weekdays : []
			}))
		} })).id;
	}
	async function handleSave() {
		setSaving(true);
		try {
			if (await persist()) {
				toast.success("Reminder tersimpan");
				navigate({ to: "/" });
			}
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	}
	async function handleUpload(file) {
		setUploading(true);
		try {
			let reminderId = form.id;
			if (!reminderId) {
				reminderId = await persist();
				if (!reminderId) return;
				setForm((f) => ({
					...f,
					id: reminderId
				}));
			}
			const t = await ticket({ data: {
				reminderId,
				filename: file.name
			} });
			const up = await supabase.storage.from("attachments").uploadToSignedUrl(t.path, t.token, file);
			if (up.error) throw new Error(up.error.message);
			const row = await registerFile({ data: {
				reminder_id: reminderId,
				path: t.path,
				filename: file.name,
				size_bytes: file.size,
				mime_type: file.type || "application/octet-stream"
			} });
			setForm((f) => ({
				...f,
				attachments: [...f.attachments, {
					id: row.id,
					filename: row.filename,
					size_bytes: row.size_bytes
				}]
			}));
			toast.success("Lampiran diunggah");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setUploading(false);
		}
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ jsx(Card, {
				className: "border-border/70 shadow-[var(--shadow-soft)]",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-4 p-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "title",
								children: "Judul reminder"
							}), /* @__PURE__ */ jsx(Input, {
								id: "title",
								value: form.title,
								maxLength: 120,
								onChange: (e) => set("title", e.target.value),
								placeholder: "Pengingat laporan harian"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "to",
									children: "Kepada (pisahkan koma)"
								}), /* @__PURE__ */ jsx(Input, {
									id: "to",
									value: form.to_emails,
									onChange: (e) => set("to_emails", e.target.value),
									placeholder: "nama@perusahaan.co.id"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "cc",
									children: "CC"
								}), /* @__PURE__ */ jsx(Input, {
									id: "cc",
									value: form.cc_emails,
									onChange: (e) => set("cc_emails", e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "bcc",
								children: "BCC"
							}), /* @__PURE__ */ jsx(Input, {
								id: "bcc",
								value: form.bcc_emails,
								onChange: (e) => set("bcc_emails", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "subject",
								children: "Subjek"
							}), /* @__PURE__ */ jsx(Input, {
								id: "subject",
								value: form.subject,
								maxLength: 200,
								onChange: (e) => set("subject", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "body",
								children: "Isi pesan (mendukung HTML)"
							}), /* @__PURE__ */ jsx(Textarea, {
								id: "body",
								rows: 9,
								value: form.body,
								onChange: (e) => set("body", e.target.value),
								placeholder: "Halo, ini pengingat untuk ..."
							})]
						})
					]
				})
			}), /* @__PURE__ */ jsx(Card, {
				className: "border-border/70 shadow-[var(--shadow-soft)]",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-4 p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "flex items-center gap-2 text-lg font-semibold",
								children: [/* @__PURE__ */ jsx(CalendarRange, { className: "h-5 w-5 shrink-0 text-primary" }), " Periode pengiriman"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Tambahkan beberapa tanggal tunggal atau rentang tanggal sekaligus."
							})]
						}), /* @__PURE__ */ jsxs(Button, {
							type: "button",
							size: "sm",
							variant: "secondary",
							className: "shrink-0 rounded-full",
							onClick: () => setForm((f) => ({
								...f,
								schedules: [...f.schedules, {
									kind: "single",
									start_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
									end_date: "",
									send_time: "08:00",
									weekdays: [
										1,
										2,
										3,
										4,
										5
									]
								}]
							})),
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Periode"]
						})]
					}), form.schedules.map((s, i) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border/70 bg-secondary/40 p-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
								children: [/* @__PURE__ */ jsxs(Select, {
									value: s.kind,
									onValueChange: (v) => patchSchedule(i, { kind: v }),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "w-full sm:w-48 bg-background",
										children: /* @__PURE__ */ jsx(SelectValue, {})
									}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "single",
										children: "Tanggal tunggal"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "range",
										children: "Rentang tanggal"
									})] })]
								}), /* @__PURE__ */ jsx(Button, {
									type: "button",
									size: "icon",
									variant: "ghost",
									className: "shrink-0 text-destructive",
									onClick: () => setForm((f) => ({
										...f,
										schedules: f.schedules.filter((_, idx) => idx !== i)
									})),
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-3 grid gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx(Label, {
											className: "text-xs",
											children: s.kind === "range" ? "Tanggal mulai" : "Tanggal"
										}), /* @__PURE__ */ jsx(Input, {
											type: "date",
											className: "bg-background",
											value: s.start_date,
											onChange: (e) => patchSchedule(i, { start_date: e.target.value })
										})]
									}),
									s.kind === "range" ? /* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx(Label, {
											className: "text-xs",
											children: "Tanggal selesai"
										}), /* @__PURE__ */ jsx(Input, {
											type: "date",
											className: "bg-background",
											value: s.end_date,
											onChange: (e) => patchSchedule(i, { end_date: e.target.value })
										})]
									}) : null,
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx(Label, {
											className: "text-xs",
											children: "Jam kirim"
										}), /* @__PURE__ */ jsx(Input, {
											type: "time",
											className: "bg-background",
											value: s.send_time.slice(0, 5),
											onChange: (e) => patchSchedule(i, { send_time: e.target.value })
										})]
									})
								]
							}),
							s.kind === "range" ? /* @__PURE__ */ jsxs("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ jsx(Label, {
									className: "text-xs",
									children: "Hari aktif"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 flex flex-wrap gap-1.5",
									children: WEEKDAYS.map((d) => {
										const active = s.weekdays.includes(d.value);
										return /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => patchSchedule(i, { weekdays: active ? s.weekdays.filter((w) => w !== d.value) : [...s.weekdays, d.value].sort() }),
											className: cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent"),
											children: d.label
										}, d.value);
									})
								})]
							}) : null
						]
					}, i))]
				})
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(Card, {
					className: "border-border/70 shadow-[var(--shadow-soft)]",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "space-y-4 p-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsx(Label, { children: "Profil SMTP" }),
									/* @__PURE__ */ jsxs(Select, {
										value: form.smtp_profile_id ?? "",
										onValueChange: (v) => set("smtp_profile_id", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih server pengirim" }) }), /* @__PURE__ */ jsx(SelectContent, { children: (smtp.data ?? []).map((p) => /* @__PURE__ */ jsxs(SelectItem, {
											value: p.id,
											children: [
												p.name,
												" · ",
												p.from_email
											]
										}, p.id)) })]
									}),
									smtp.data?.length === 0 ? /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: "Belum ada profil SMTP — tambahkan di menu SMTP."
									}) : null
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ jsx(Label, {
											htmlFor: "tz",
											children: "Zona waktu"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											className: "text-xs font-medium text-primary hover:underline",
											onClick: () => set("timezone", deviceTimezone()),
											children: "Pakai zona perangkat"
										})]
									}),
									/* @__PURE__ */ jsxs(Select, {
										value: form.timezone,
										onValueChange: (v) => set("timezone", v),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											id: "tz",
											children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Pilih zona waktu" })
										}), /* @__PURE__ */ jsx(SelectContent, { children: tzOptions.map((t) => /* @__PURE__ */ jsx(SelectItem, {
											value: t.value,
											children: t.label
										}, t.value)) })]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground",
										children: [
											"Jam kirim di jadwal mengikuti waktu lokal ",
											timezoneLabel(form.timezone),
											"."
										]
									})
								]
							}),
							/* @__PURE__ */ jsx(Separator, {}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium",
										children: "Aktifkan pengiriman otomatis"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground",
										children: "Jalankan sesuai jadwal di atas."
									})]
								}), /* @__PURE__ */ jsx(Switch, {
									checked: form.enabled,
									onCheckedChange: (v) => set("enabled", v)
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(Card, {
					className: "border-border/70 shadow-[var(--shadow-soft)]",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "space-y-3 p-6",
						children: [
							/* @__PURE__ */ jsxs("h2", {
								className: "flex items-center gap-2 text-base font-semibold",
								children: [/* @__PURE__ */ jsx(Paperclip, { className: "h-4 w-4 text-primary" }), " Lampiran"]
							}),
							form.attachments.map((a) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "min-w-0 truncate text-sm",
									children: a.filename
								}), /* @__PURE__ */ jsxs("span", {
									className: "flex shrink-0 items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: formatBytes(a.size_bytes)
									}), /* @__PURE__ */ jsx(Button, {
										type: "button",
										size: "icon",
										variant: "ghost",
										className: "h-7 w-7 text-destructive",
										onClick: async () => {
											await dropFile({ data: { id: a.id } });
											setForm((f) => ({
												...f,
												attachments: f.attachments.filter((x) => x.id !== a.id)
											}));
										},
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
									})]
								})]
							}, a.id)),
							/* @__PURE__ */ jsx(Input, {
								type: "file",
								disabled: uploading,
								onChange: (e) => {
									const file = e.target.files?.[0];
									e.target.value = "";
									if (file) handleUpload(file);
								}
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: "Maksimal 25 MB per berkas. Menyimpan lampiran akan menyimpan reminder terlebih dahulu."
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs(Button, {
					onClick: handleSave,
					disabled: saving,
					className: "w-full rounded-full",
					size: "lg",
					children: [saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : null, "Simpan reminder"]
				})
			]
		})]
	});
}
//#endregion
export { emptyReminder as n, ReminderForm as t };
