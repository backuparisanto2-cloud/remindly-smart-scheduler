import { t as supabase } from "./client-BnZaao0h.js";
import { n as CardContent, r as Button, s as useSession, t as Card } from "./card-d1iskoGV.js";
import { n as Input, t as Label } from "./label-DZ0DLGWF.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2, Lock, Mail } from "lucide-react";
//#region src/routes/auth.tsx?tsr-split=component
function AuthPage() {
	const navigate = useNavigate();
	const { session, ready } = useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		if (ready && session) navigate({ to: "/" });
	}, [
		ready,
		session,
		navigate
	]);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setBusy(false);
		if (error) {
			toast.error("Email atau kata sandi salah");
			return;
		}
		toast.success("Selamat datang kembali");
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center px-4 py-10",
		children: /* @__PURE__ */ jsx(Card, {
			className: "w-full max-w-md border-border/70 shadow-[var(--shadow-soft)]",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "p-6 sm:p-8",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "mb-5 grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground",
						style: { backgroundImage: "var(--gradient-primary)" },
						children: /* @__PURE__ */ jsx(Mail, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-display text-2xl font-semibold",
						children: "Masuk Admin"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Kelola pengingat email, profil SMTP, dan riwayat pengiriman."
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ jsx(Input, {
									id: "email",
									type: "email",
									autoComplete: "username",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "admin@perusahaan.co.id"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "password",
									children: "Kata sandi"
								}), /* @__PURE__ */ jsx(Input, {
									id: "password",
									type: "password",
									autoComplete: "current-password",
									required: true,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••"
								})]
							}),
							/* @__PURE__ */ jsxs(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy,
								children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), "Masuk"]
							})
						]
					})
				]
			})
		})
	});
}
//#endregion
export { AuthPage as component };
