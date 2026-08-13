# Status Tim

Papan status kerja tim dalam satu layar — siapa mengerjakan apa, tanpa perlu
tanya-tanya lagi di WhatsApp.

- **`/`** — papan status (read-only), auto-refresh setiap 7 detik. Cocok
  dipasang di layar TV kantor.
- **`/update/<id>`** — link pribadi tiap anggota untuk mengubah status &
  deskripsi tugasnya sendiri. Tidak perlu login.

## Cara kerja

Daftar anggota tim **tetap/hardcoded** di [`src/lib/members.ts`](src/lib/members.ts)
— tidak ada fitur tambah/hapus anggota di v1 ini. Setiap anggota punya `id`
(slug) yang menjadi bagian dari link pribadinya, misalnya:

```ts
{ id: "andi", name: "Andi" }
```

akan bisa mengubah statusnya lewat `https://<domain-kamu>/update/andi`.

Untuk mengganti nama-nama anggota tim, edit langsung array `SEED_MEMBERS` di
file tersebut, lalu deploy ulang.

## Setup lokal

Butuh Node.js 20+.

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Tanpa konfigurasi apa pun, aplikasi otomatis pakai **penyimpanan in-memory**
(lihat `src/lib/store.ts`) — cukup untuk mencoba-coba di lokal, tapi datanya
akan hilang setiap kali server dev di-restart. Kalau ingin mencoba tersambung
ke database sungguhan saat development, isi `.env.local` seperti di bawah
(lihat [Database](#database)).

## Database

Data disimpan di **Redis** (via [Upstash](https://upstash.com), yang juga
tersedia sebagai integrasi resmi di Vercel Marketplace) — pilihan paling
ringan untuk data sekecil ini (< 10 baris, tanpa relasi, tanpa histori).

### Environment variables

Salin `.env.example` ke `.env.local` dan isi:

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

(Kalau instalasi Redis dari Vercel Marketplace menyuntikkan nama variabel
`KV_REST_API_URL` / `KV_REST_API_TOKEN`, aplikasi ini juga membacanya secara
otomatis — tidak perlu diganti nama.)

Jika variabel-variabel ini **tidak** diset, aplikasi otomatis fallback ke
penyimpanan in-memory (khusus untuk kebutuhan lokal, lihat bagian di atas).

### Seed data awal

Setelah environment variables terisi, jalankan sekali untuk mengisi status
awal (`Belum Mulai`, tugas kosong) untuk setiap anggota di roster:

```bash
npm run seed
```

Script ini aman dijalankan berulang kali — anggota yang sudah punya data
tidak akan ditimpa, hanya anggota baru (kalau kamu menambah nama di
`members.ts`) yang akan diisi default.

## Deploy ke Vercel

1. Push repo ini ke GitHub, lalu [import project di Vercel](https://vercel.com/new).
2. Tambahkan integrasi **Redis** dari Vercel Marketplace ke project ini
   (Project Settings → Integrations, atau Storage tab) — Vercel akan
   otomatis mengisi environment variable yang dibutuhkan.
3. Jika variabel yang disuntikkan bernama `UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN`, tidak perlu langkah tambahan. Jika namanya
   `KV_REST_API_URL` / `KV_REST_API_TOKEN`, aplikasi ini juga sudah membaca
   nama tersebut secara otomatis.
4. Deploy.
5. Jalankan seed sekali dari lokal dengan environment production (ambil
   env vars project lewat `vercel env pull .env.local`, lalu `npm run seed`),
   atau isi status pertama kali langsung lewat masing-masing link
   `/update/<id>`.
6. Bagikan link personal tiap anggota (`https://<domain>/update/<id>`) satu
   kali lewat WhatsApp/DM. Simpan `https://<domain>/` untuk dipasang di
   layar TV kantor atau dibuka siapa saja yang ingin cek status tim.

## Batasan versi pertama (disengaja, belum dibangun)

- Tidak ada fitur tambah/hapus anggota tim dari UI
- Tidak ada histori perubahan status
- Tidak ada sistem notifikasi
- Tidak ada login/password — keamanan bergantung pada link `/update/<id>`
  yang dirahasiakan antar anggota

## Struktur proyek

```
src/
  app/
    page.tsx              # papan status (server component)
    update/[id]/page.tsx  # form update per-anggota
    api/members/          # REST API dipakai oleh polling & form
  components/
    Board.tsx              # grid status + polling tiap 7 detik
    UpdateForm.tsx          # form ubah status/tugas
    StatusBadge.tsx
  lib/
    members.ts    # roster tim (hardcoded, edit di sini)
    store.ts       # abstraksi penyimpanan (Redis / in-memory)
    types.ts
scripts/
  seed.ts          # isi status awal untuk semua anggota
```
