import { t as Route$9 } from "./_id-C9PzSTuc.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { createClient } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-kfvMaHe7.css";
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Reminder Mail — Penjadwal Email SMTP" },
			{
				name: "description",
				content: "Aplikasi pengingat email terjadwal dengan server SMTP sendiri, multi periode tanggal, dan lampiran."
			},
			{
				property: "og:title",
				content: "Reminder Mail — Penjadwal Email SMTP"
			},
			{
				property: "og:description",
				content: "Pengingat email terjadwal dengan SMTP sendiri, multi periode tanggal, dan lampiran."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$4 = () => import("./routes-DdYZr4lK.js");
var Route$7 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Reminder Mail — Penjadwal Email SMTP Otomatis" },
		{
			name: "description",
			content: "Kelola pengingat email otomatis lewat server SMTP sendiri: multi periode tanggal, jam kirim, lampiran, dan riwayat pengiriman."
		},
		{
			property: "og:title",
			content: "Reminder Mail — Penjadwal Email SMTP Otomatis"
		},
		{
			property: "og:description",
			content: "Jadwalkan email pengingat dengan SMTP sendiri, multi periode tanggal dan lampiran."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$3 = () => import("./auth-DMfXucFh.js");
var Route$6 = createFileRoute("/auth")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Masuk Admin — Reminder Mail" },
		{
			name: "description",
			content: "Halaman masuk administrator untuk mengelola pengingat email terjadwal, profil SMTP, dan riwayat pengiriman."
		},
		{
			property: "og:title",
			content: "Masuk Admin — Reminder Mail"
		},
		{
			property: "og:description",
			content: "Masuk untuk mengelola pengingat email terjadwal dan profil SMTP."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/logs.tsx
var $$splitComponentImporter$2 = () => import("./logs-Dsoj_i5_.js");
var Route$5 = createFileRoute("/logs")({
	head: () => ({ meta: [
		{ title: "Riwayat Pengiriman Email — Reminder Mail" },
		{
			name: "description",
			content: "Pantau riwayat pengiriman email pengingat: status berhasil atau gagal, penerima, waktu kirim, dan pesan error SMTP."
		},
		{
			property: "og:title",
			content: "Riwayat Pengiriman Email — Reminder Mail"
		},
		{
			property: "og:description",
			content: "Lihat status pengiriman email pengingat beserta pesan kesalahan SMTP."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/smtp.tsx
var $$splitComponentImporter$1 = () => import("./smtp-G6zkIRAS.js");
var Route$4 = createFileRoute("/smtp")({
	head: () => ({ meta: [
		{ title: "Pengaturan Server SMTP — Reminder Mail" },
		{
			name: "description",
			content: "Kelola profil server SMTP: host, port, TLS, alamat pengirim, dan kredensial untuk pengiriman email pengingat."
		},
		{
			property: "og:title",
			content: "Pengaturan Server SMTP — Reminder Mail"
		},
		{
			property: "og:description",
			content: "Simpan dan uji koneksi profil SMTP untuk pengiriman email pengingat."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/reminders/new.tsx
var $$splitComponentImporter = () => import("./new-qJh7l-4G.js");
var Route$3 = createFileRoute("/reminders/new")({
	head: () => ({ meta: [
		{ title: "Buat Reminder Email Baru — Reminder Mail" },
		{
			name: "description",
			content: "Buat pengingat email baru: tentukan penerima, subjek, isi pesan, periode tanggal, jam kirim, dan lampiran."
		},
		{
			property: "og:title",
			content: "Buat Reminder Email Baru — Reminder Mail"
		},
		{
			property: "og:description",
			content: "Atur penerima, periode tanggal, jam kirim, dan lampiran untuk pengingat email."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routes/api/public/cron/dispatch.ts
async function run() {
	const { dispatchDue } = await import("./mailer.server-D22-st-C.js");
	const result = await dispatchDue();
	return Response.json({
		ok: true,
		...result
	});
}
var Route$2 = createFileRoute("/api/public/cron/dispatch")({ server: { handlers: { POST: async ({ request }) => {
	const key = request.headers.get("apikey") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
	const expected = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "";
	if (!expected || key !== expected) return new Response("Unauthorized", { status: 401 });
	return run();
} } } });
//#endregion
//#region src/lib/mail-api.server.ts
function corsHeaders() {
	return {
		"access-control-allow-origin": "*",
		"access-control-allow-headers": "authorization, content-type",
		"access-control-allow-methods": "POST, OPTIONS",
		"cache-control": "no-store"
	};
}
/** Validate the caller's Supabase access token; returns the user id or null. */
async function requireUser(request) {
	const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
	if (!token) return null;
	const url = process.env["SUPABASE_URL"];
	const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
	if (!url || !key) return null;
	const { data, error } = await createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const h = new Headers(init?.headers);
			h.set("apikey", key);
			return fetch(input, {
				...init,
				headers: h
			});
		} }
	}).auth.getUser(token);
	if (error || !data.user) return null;
	return data.user.id;
}
//#endregion
//#region src/routes/api/public/mail/send.ts
var Route$1 = createFileRoute("/api/public/mail/send")({ server: { handlers: {
	OPTIONS: async () => new Response(null, {
		status: 204,
		headers: corsHeaders()
	}),
	POST: async ({ request }) => {
		if (!await requireUser(request)) return Response.json({ error: "Unauthorized" }, {
			status: 401,
			headers: corsHeaders()
		});
		const body = await request.json().catch(() => ({}));
		if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id)) return Response.json({ error: "id tidak valid" }, {
			status: 400,
			headers: corsHeaders()
		});
		const { sendReminder } = await import("./mailer.server-D22-st-C.js");
		const result = await sendReminder(body.id, { source: "manual" });
		return Response.json(result, { headers: corsHeaders() });
	}
} } });
//#endregion
//#region src/routes/api/public/mail/test.ts
var Route = createFileRoute("/api/public/mail/test")({ server: { handlers: {
	OPTIONS: async () => new Response(null, {
		status: 204,
		headers: corsHeaders()
	}),
	POST: async ({ request }) => {
		if (!await requireUser(request)) return Response.json({ error: "Unauthorized" }, {
			status: 401,
			headers: corsHeaders()
		});
		const body = await request.json().catch(() => ({}));
		if (!body.id || !/^[0-9a-f-]{36}$/i.test(body.id)) return Response.json({ error: "id tidak valid" }, {
			status: 400,
			headers: corsHeaders()
		});
		const { runSmtpTest } = await import("./mailer.server-D22-st-C.js");
		return Response.json({ status: await runSmtpTest(body.id) }, { headers: corsHeaders() });
	}
} } });
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AuthRoute: Route$6.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$8
	}),
	LogsRoute: Route$5.update({
		id: "/logs",
		path: "/logs",
		getParentRoute: () => Route$8
	}),
	SmtpRoute: Route$4.update({
		id: "/smtp",
		path: "/smtp",
		getParentRoute: () => Route$8
	}),
	RemindersIdRoute: Route$9.update({
		id: "/reminders/$id",
		path: "/reminders/$id",
		getParentRoute: () => Route$8
	}),
	RemindersNewRoute: Route$3.update({
		id: "/reminders/new",
		path: "/reminders/new",
		getParentRoute: () => Route$8
	}),
	ApiPublicCronDispatchRoute: Route$2.update({
		id: "/api/public/cron/dispatch",
		path: "/api/public/cron/dispatch",
		getParentRoute: () => Route$8
	}),
	ApiPublicMailSendRoute: Route$1.update({
		id: "/api/public/mail/send",
		path: "/api/public/mail/send",
		getParentRoute: () => Route$8
	}),
	ApiPublicMailTestRoute: Route.update({
		id: "/api/public/mail/test",
		path: "/api/public/mail/test",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
