import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/reminders/$id.tsx
var $$splitComponentImporter = () => import("./_id-CGdYB1Jh.js");
var Route = createFileRoute("/reminders/$id")({
	head: () => ({ meta: [
		{ title: "Ubah Reminder Email — Reminder Mail" },
		{
			name: "description",
			content: "Perbarui penerima, isi pesan, periode tanggal, jam kirim, dan lampiran pada pengingat email terjadwal."
		},
		{
			property: "og:title",
			content: "Ubah Reminder Email — Reminder Mail"
		},
		{
			property: "og:description",
			content: "Perbarui jadwal, penerima, dan lampiran pengingat email Anda."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
