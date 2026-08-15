// Config khusus build STATIS untuk hosting biasa (cPanel/Apache).
// Menghasilkan SPA shell di dist/client yang bisa diunggah apa adanya.
// Backend (SMTP + cron) tetap berjalan di Lovable Cloud, data tetap di Supabase.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    spa: { enabled: true },
  },
});
