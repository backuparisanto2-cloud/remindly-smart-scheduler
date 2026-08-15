import { a as cn, i as buttonVariants, n as CardContent, r as Button, t as Card } from "./card-d1iskoGV.js";
import { C as useServerFn, a as formatDateTime, f as fetchReminders, l as fetchDashboard, m as removeReminder, s as AppShell, v as sendReminderNow, y as setReminderEnabled } from "./format-DfwW21Qf.js";
import { t as Skeleton } from "./skeleton-BQQuBwNp.js";
import * as React from "react";
import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarClock, CheckCircle2, Loader2, Paperclip, Pause, Pencil, Play, Plus, Send, Trash2, XCircle } from "lucide-react";
import { cva } from "class-variance-authority";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
//#region src/components/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region src/components/ui/alert-dialog.tsx
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [/* @__PURE__ */ jsx(AlertDialogOverlay, {}), /* @__PURE__ */ jsx(AlertDialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ jsx(Card, {
		className: "border-border/70 shadow-[var(--shadow-soft)]",
		children: /* @__PURE__ */ jsxs(CardContent, {
			className: "p-5",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: label
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 font-display text-2xl font-semibold",
					children: value
				}),
				hint ? /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				}) : null
			]
		})
	});
}
function Dashboard() {
	const router = useRouter();
	const qc = useQueryClient();
	const list = useServerFn(fetchReminders);
	const stats = useServerFn(fetchDashboard);
	const toggle = useServerFn(setReminderEnabled);
	const sendNow = useServerFn(sendReminderNow);
	const destroy = useServerFn(removeReminder);
	const reminders = useQuery({
		queryKey: ["reminders"],
		queryFn: () => list()
	});
	const dashboard = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => stats()
	});
	const refresh = () => {
		qc.invalidateQueries({ queryKey: ["reminders"] });
		qc.invalidateQueries({ queryKey: ["dashboard"] });
	};
	const [togglingId, setTogglingId] = useState(null);
	const toggleMutation = useMutation({
		mutationFn: (v) => toggle({ data: {
			id: v.id,
			enabled: v.enabled
		} }).then(() => v),
		onSuccess: (v) => {
			toast.success(v.enabled ? `“${v.title}” dilanjutkan` : `“${v.title}” dijeda`);
			refresh();
		},
		onError: (e) => toast.error(e.message),
		onSettled: () => setTogglingId(null)
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => destroy({ data: { id } }),
		onSuccess: () => {
			toast.success("Reminder dihapus");
			refresh();
			router.invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const sendMutation = useMutation({
		mutationFn: (id) => sendNow({ data: { id } }),
		onSuccess: (res) => {
			if (res.ok) toast.success("Email berhasil dikirim");
			else toast.error(res.error ?? "Gagal mengirim");
			refresh();
			qc.invalidateQueries({ queryKey: ["logs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ jsxs(AppShell, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "truncate text-2xl font-semibold sm:text-3xl",
					children: "Dasbor pengingat"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Jadwalkan email pengingat lewat server SMTP Anda sendiri."
				})]
			}), /* @__PURE__ */ jsx(Button, {
				asChild: true,
				className: "shrink-0 rounded-full",
				children: /* @__PURE__ */ jsxs(Link, {
					to: "/reminders/new",
					children: [
						/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "Reminder baru"
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(Stat, {
					label: "Total reminder",
					value: String(dashboard.data?.total ?? 0)
				}),
				/* @__PURE__ */ jsx(Stat, {
					label: "Aktif",
					value: String(dashboard.data?.active ?? 0)
				}),
				/* @__PURE__ */ jsx(Stat, {
					label: "Jadwal terdekat",
					value: dashboard.data?.nextRun ? formatDateTime(dashboard.data.nextRun) : "—"
				}),
				/* @__PURE__ */ jsx(Stat, {
					label: "50 kiriman terakhir",
					value: `${dashboard.data?.successCount ?? 0} berhasil`,
					hint: `${dashboard.data?.failedCount ?? 0} gagal`
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-8 space-y-3",
			children: [
				reminders.isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full rounded-xl" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full rounded-xl" })] }) : null,
				reminders.data?.length === 0 ? /* @__PURE__ */ jsx(Card, {
					className: "border-dashed",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "p-10 text-center",
						children: [
							/* @__PURE__ */ jsx(CalendarClock, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 font-display text-lg",
								children: "Belum ada reminder"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Buat reminder pertama dan tentukan periode tanggalnya."
							}),
							/* @__PURE__ */ jsx(Button, {
								asChild: true,
								className: "mt-5 rounded-full",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/reminders/new",
									children: "Buat reminder"
								})
							})
						]
					})
				}) : null,
				reminders.data?.map((r) => /* @__PURE__ */ jsx(Card, {
					className: "border-border/70 shadow-[var(--shadow-soft)]",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex min-w-0 flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("h2", {
											className: "truncate text-lg font-semibold",
											children: r.title
										}),
										r.enabled ? /* @__PURE__ */ jsx(Badge, {
											className: "rounded-full bg-accent text-accent-foreground",
											children: "Aktif"
										}) : /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: "rounded-full",
											children: "Nonaktif"
										}),
										r.attachment_count > 0 ? /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ jsx(Paperclip, { className: "h-3 w-3" }), r.attachment_count]
										}) : null
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 truncate text-sm text-muted-foreground",
									children: r.subject
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-2 truncate text-xs text-muted-foreground",
									children: [
										"Ke: ",
										(r.to_emails ?? []).join(", ") || "—",
										" · SMTP: ",
										r.smtp_name ?? "belum dipilih"
									]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Berikutnya: "
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: r.next_run ? `${formatDateTime(r.next_run, r.timezone ?? void 0)} (${r.timezone ?? "Asia/Jakarta"})` : "tidak ada jadwal mendatang"
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: r.enabled ? "outline" : "default",
									className: "rounded-full",
									disabled: toggleMutation.isPending && togglingId === r.id,
									onClick: () => {
										setTogglingId(r.id);
										toggleMutation.mutate({
											id: r.id,
											enabled: !r.enabled,
											title: r.title
										});
									},
									children: [toggleMutation.isPending && togglingId === r.id ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : r.enabled ? /* @__PURE__ */ jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }), r.enabled ? "Jeda" : "Lanjutkan"]
								}),
								/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "secondary",
									className: "rounded-full",
									disabled: sendMutation.isPending,
									onClick: () => sendMutation.mutate(r.id),
									children: [/* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), " Kirim"]
								}),
								/* @__PURE__ */ jsx(Button, {
									asChild: true,
									size: "sm",
									variant: "outline",
									className: "rounded-full",
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/reminders/$id",
										params: { id: r.id },
										children: [/* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }), " Edit"]
									})
								}),
								/* @__PURE__ */ jsxs(AlertDialog, { children: [/* @__PURE__ */ jsx(AlertDialogTrigger, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Button, {
										size: "sm",
										variant: "ghost",
										className: "rounded-full text-destructive hover:text-destructive",
										"aria-label": `Hapus reminder ${r.title}`,
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Hapus reminder ini?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
									"“",
									r.title,
									"” beserta jadwal dan lampirannya akan dihapus permanen. Riwayat pengiriman tetap tersimpan."
								] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Batal" }), /* @__PURE__ */ jsx(AlertDialogAction, {
									className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
									onClick: () => deleteMutation.mutate(r.id),
									children: "Hapus"
								})] })] })] })
							]
						})]
					})
				}, r.id))
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-primary" }), " Pengiriman otomatis dicek setiap menit"]
			}), /* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }), " Kegagalan tercatat di halaman Riwayat"]
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
