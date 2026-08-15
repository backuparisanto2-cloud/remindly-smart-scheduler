# Deploy ke Hosting Statis (cPanel) + Login Admin

Target: file hasil build diupload ke `public_html` di cPanel biasa (tanpa Node.js), data & seluruh proses email tetap di Lovable Cloud (Supabase).

## Masalah saat ini

Aplikasi sekarang memakai server functions dan route `/api/public/cron/dispatch` — keduanya butuh runtime Node/Worker. Hosting statis tidak bisa menjalankannya, jadi semua logika server harus pindah ke backend Lovable Cloud dulu sebelum bisa dideploy ke cPanel.

## Yang akan dikerjakan

### 1. Login admin (satu akun)
- Buat akun admin `arisanto@mentarisatria.net.id` dengan password yang Anda berikan (langsung aktif, tanpa verifikasi email). Sebaiknya diganti setelah login pertama.
- Halaman `/auth`: form email + password, tema putih–hijau yang sama. Tanpa link daftar.
- Seluruh halaman (dasbor, reminder, SMTP, log) hanya bisa diakses setelah login; jika belum login diarahkan ke `/auth`. Ada tombol keluar di navigasi.
- Kebijakan akses database diperketat: hanya pengguna yang sudah login yang boleh membaca/menulis reminder, profil SMTP, lampiran, dan log. Password SMTP tidak lagi bisa diakses publik.

### 2. Pindahkan proses email ke backend Lovable Cloud
- Pengiriman SMTP (koneksi TCP, TLS, lampiran, penyusunan MIME) dipindah dari server function ke fungsi backend Lovable Cloud, jadi tidak bergantung pada hosting Anda.
- Dua endpoint backend: satu untuk aksi dari browser (kirim sekarang, uji koneksi SMTP) yang memverifikasi login admin, dan satu untuk penjadwal otomatis yang dipanggil dengan kunci rahasia.
- Penjadwal tiap menit di database diarahkan ke endpoint baru tersebut, tidak lagi ke situs Anda — jadi reminder tetap terkirim walau hosting statis.
- Semua operasi data (CRUD reminder, profil SMTP, lampiran, statistik, log) dipanggil langsung dari browser ke Lovable Cloud memakai sesi login admin.

### 3. Ubah build jadi statis
- Aplikasi dibuat mode SPA (tanpa render sisi server), hasil build berupa file statis di folder `dist`.
- Tambahkan `.htaccess` agar semua URL (misal `/smtp`, `/reminders/123`) diarahkan ke `index.html`, supaya refresh halaman tidak 404 di Apache/cPanel.
- Konfigurasi Lovable Cloud (URL + kunci publik) ikut ter-bundle saat build, jadi tidak perlu file `.env` di hosting.

### 4. Panduan deploy
File `DEPLOY.md` berisi langkah singkat: jalankan build, upload isi folder hasil build ke `public_html` (termasuk `.htaccess`), lalu login sebagai admin. Termasuk catatan cara build ulang setiap ada perubahan.

## Catatan teknis

- Login: Supabase Auth email/password, satu user dibuat via Admin API; RLS diubah dari akses publik menjadi `TO authenticated`.
- SMTP di Deno Edge Function memakai `Deno.connect` / `Deno.startTls` (port 465 implicit TLS dan STARTTLS), logika MIME & penjadwalan diporting dari `src/lib/smtp.server.ts` dan `mailer.server.ts`.
- `pg_cron` diarahkan ke edge function `dispatch` memakai header rahasia; job lama yang menunjuk domain Lovable dihapus.
- `src/lib/app.functions.ts`, `data.server.ts`, `mailer.server.ts`, `smtp.server.ts`, dan `src/routes/api/*` dihapus/diganti klien Supabase sisi browser.
- Router: `ssr: false` + prerender statis, output diupload apa adanya; tidak ada Node di hosting.
- Password yang Anda kirim di chat sebaiknya diganti setelah login pertama karena sudah tercatat di riwayat percakapan.
