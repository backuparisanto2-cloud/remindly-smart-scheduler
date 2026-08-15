# Web Email Reminder (SMTP) — Putih Hijau Elegan

Aplikasi web responsif untuk membuat pengingat email otomatis: atur profil SMTP sendiri, tulis isi email, lampirkan file, dan tentukan jadwal (tanggal tunggal maupun rentang tanggal, bisa lebih dari satu) dengan jam pengiriman. Bisa jalan otomatis sesuai jadwal, dan bisa juga dikirim manual kapan saja.

## Halaman

1. **Dashboard (/)** — ringkasan: reminder aktif, jadwal terdekat, ringkasan status kirim terakhir, tabel reminder dengan aksi Kirim Sekarang / Edit / Aktif-Nonaktif.
2. **Reminder Baru & Edit (/reminders/new, /reminders/:id)** — form bertahap:
   - Detail email: judul reminder, penerima To/CC/BCC, subjek, isi pesan (teks kaya sederhana).
   - Lampiran: unggah beberapa file, tersimpan di storage, bisa dihapus.
   - Jadwal: tambah beberapa "periode" dalam satu reminder. Tiap periode bertipe **Tanggal tunggal** (satu datetime) atau **Rentang** (tanggal mulai–selesai + jam kirim + pilihan hari: tiap hari / hari kerja / hari tertentu).
   - Profil SMTP: pilih dari daftar profil.
3. **Pengaturan SMTP (/smtp)** — daftar profil SMTP dengan tampilan seperti baris-baris pengaturan (Server, Port, TLS, From, User, Password, Verifikasi sertifikat), tombol Test Connection, dan status tes terakhir.
4. **Riwayat Kirim (/logs)** — daftar semua percobaan kirim: waktu, reminder, penerima, status berhasil/gagal, pesan error, filter dan pencarian.

## Desain

Putih bersih dengan aksen hijau zamrud, tipografi elegan, kartu lembut dengan bayangan halus dan sudut membulat, tabel rapi, penuh responsif (kartu bertumpuk di mobile, tabel di desktop). Semua warna sebagai token desain di `src/styles.css`.

## Cara kerja pengiriman

- **Otomatis**: penjadwal berjalan tiap menit di server, mencari jadwal yang jatuh tempo, lalu mengirim dan mencatat hasilnya (anti-kirim-ganda).
- **Manual**: tombol "Kirim Sekarang" pada tiap reminder.

## Catatan penting

- Aplikasi terbuka tanpa login sesuai permintaan, jadi siapa pun yang punya link bisa melihat dan mengubah reminder serta profil SMTP. Kata sandi SMTP disimpan di sisi server dan tidak pernah ditampilkan kembali di layar (hanya `*****`), tetapi tetap disarankan menambahkan login nanti.
- Lingkungan server aplikasi tidak dapat membuka koneksi SMTP mentah (port 465/587) secara langsung. Agar pengiriman benar-benar lewat SMTP Anda, dibutuhkan satu relay SMTP-ke-HTTP. Saya akan membangun lapisan pengirim yang bisa ditukar: parameter SMTP tetap tersimpan dan dipakai, dan koneksi diuji saat setup. Jika relay belum tersedia saat implementasi, saya laporkan dan kita pilih relay yang dipakai.

## Rincian teknis

- Lovable Cloud (database + storage) diaktifkan.
- Tabel: `smtp_profiles` (host, port, tls, from_email, username, password, verify_cert, last_status), `reminders` (judul, penerima, subjek, body, smtp_profile_id, enabled, timezone), `reminder_schedules` (reminder_id, tipe single|range, start_at, end_at, send_time, weekdays[]), `reminder_attachments` (reminder_id, path, nama, ukuran, mime), `send_logs` (reminder_id, occurrence_at, status, error, sent_at) dengan unique (reminder_id, occurrence_at) untuk mencegah duplikat.
- GRANT eksplisit + RLS aktif; policy publik untuk tabel operasional, `smtp_profiles.password` tidak pernah di-select ke klien (akses lewat server function; klien membaca view/kolom aman saja).
- Storage bucket privat `attachments`, upload lewat signed URL.
- Server functions (`createServerFn`) untuk CRUD reminder, test SMTP, dan kirim manual; server route `/api/public/cron/dispatch` (dilindungi header rahasia) dipanggil tiap menit oleh pg_cron untuk pengiriman otomatis.
- Zod untuk validasi semua input; waktu disimpan UTC, ditampilkan Asia/Jakarta.
