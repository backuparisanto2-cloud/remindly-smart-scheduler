import { s as AppShell } from "./format-DfwW21Qf.js";
import { n as emptyReminder, t as ReminderForm } from "./ReminderForm-qEonc8Zg.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/reminders/new.tsx?tsr-split=component
function NewReminder() {
	return /* @__PURE__ */ jsxs(AppShell, { children: [
		/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-semibold sm:text-3xl",
			children: "Reminder baru"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-1 mb-6 text-sm text-muted-foreground",
			children: "Tentukan isi pesan dan periode pengirimannya."
		}),
		/* @__PURE__ */ jsx(ReminderForm, { initial: emptyReminder })
	] });
}
//#endregion
export { NewReminder as component };
