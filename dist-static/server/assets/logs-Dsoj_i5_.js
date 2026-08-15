import { n as CardContent, t as Card } from "./card-d1iskoGV.js";
import { C as useServerFn, a as formatDateTime, s as AppShell, u as fetchLogs } from "./format-DfwW21Qf.js";
import { t as Skeleton } from "./skeleton-BQQuBwNp.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
//#region src/routes/logs.tsx?tsr-split=component
function LogsPage() {
	const load = useServerFn(fetchLogs);
	const logs = useQuery({
		queryKey: ["logs"],
		queryFn: () => load()
	});
	return /* @__PURE__ */ jsxs(AppShell, { children: [
		/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-semibold sm:text-3xl",
			children: "Riwayat pengiriman"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-1 mb-6 text-sm text-muted-foreground",
			children: "200 aktivitas pengiriman terakhir."
		}),
		logs.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-40 w-full rounded-xl" }) : null,
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [(logs.data ?? []).map((l) => /* @__PURE__ */ jsx(Card, {
				className: "border-border/70",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 p-4",
					children: [l.status === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }) : /* @__PURE__ */ jsx(XCircle, { className: "mt-0.5 h-5 w-5 shrink-0 text-destructive" }), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "truncate text-sm font-medium",
								children: l.reminder_title ?? "(tanpa judul)"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									l.recipients ?? "—",
									" · ",
									formatDateTime(l.sent_at),
									" · ",
									l.trigger_source
								]
							}),
							l.error ? /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs break-words text-destructive",
								children: l.error
							}) : null
						]
					})]
				})
			}, l.id)), logs.data?.length === 0 ? /* @__PURE__ */ jsx(Card, {
				className: "border-dashed",
				children: /* @__PURE__ */ jsx(CardContent, {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Belum ada pengiriman."
				})
			}) : null]
		})
	] });
}
//#endregion
export { LogsPage as component };
