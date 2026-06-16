# Brief Website — AI Center UB Workshop

## 1. Latar Belakang & Tujuan
Website ini dibuat sebagai media informasi dan profil resmi untuk **AI Center Universitas Brawijaya**, khususnya untuk kegiatan workshop. Website akan menampilkan informasi kegiatan, profil organisasi, dan daftar anggota/tim yang dapat diperbarui secara berkala oleh admin tanpa perlu mengubah kode program.

## 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Vite (React/Vanilla JS — disesuaikan preferensi) |
| Backend | Node.js (Express.js) |
| Database | SQLite / JSON file (ringan) atau MongoDB jika perlu skala lebih besar |
| Penyimpanan Foto | Local storage `/uploads` (atau cloud storage opsional) |
| Autentikasi Admin | Session/JWT sederhana dengan login username & password |

## 3. Struktur Halaman (Public Site)

1. **Beranda (Home)**
   - Hero section: nama "AI Center UB Workshop", tagline, banner/logo
   - Ringkasan tentang AI Center
   - Highlight kegiatan/workshop terbaru

2. **Tentang Kami (About)**
   - Deskripsi AI Center UB
   - Visi & misi

3. **Tim / Anggota (Team)**
   - Grid kartu anggota, masing-masing menampilkan:
     - Foto
     - Nama
     - Jabatan/role
     - Pesan singkat (quote/caption)
   - Data ditarik secara dinamis dari database (dikelola via dashboard admin)

4. **Kegiatan/Workshop (Activities)**
   - Daftar workshop yang pernah/akan diadakan (opsional, jika dibutuhkan ke depan)

5. **Kontak (Contact)**
   - Informasi kontak, media sosial, lokasi

## 4. Dashboard Admin (Private/Protected Route)

Diakses melalui halaman login terpisah (misal `/admin/login`), hanya bisa diakses oleh admin yang sudah login.

### Fitur Utama:
- **Login Admin** — autentikasi sederhana (username & password)
- **Kelola Anggota Tim (CRUD)**:
  - Tambah anggota baru → upload foto, isi nama, jabatan, dan pesan singkat
  - Edit data anggota (ubah foto, nama, jabatan, pesan)
  - Hapus anggota
  - Lihat daftar seluruh anggota dalam bentuk tabel/list dengan preview foto

### Form Tambah/Edit Anggota:
| Field | Tipe | Keterangan |
|---|---|---|
| Foto | File upload (image) | Disimpan ke folder `/uploads`, path disimpan di database |
| Nama | Text | Wajib diisi |
| Jabatan | Text | Misal: "Ketua", "Anggota Divisi AI", dll |
| Pesan Singkat | Textarea | Quote/motto/pesan singkat anggota |

## 5. Alur Data
1. Admin login → masuk ke dashboard.
2. Admin menambah/mengedit data anggota melalui form.
3. Backend (Express) menerima data + file foto, menyimpan foto ke folder `/uploads`, dan menyimpan data (nama, jabatan, pesan, path foto) ke database.
4. Halaman publik "Tim" mengambil data anggota dari API backend (`GET /api/members`) dan menampilkannya secara dinamis.

## 6. Struktur Folder (Contoh)

```
ai-center-ub-workshop/
├── client/                # Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Team.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       └── MemberForm.jsx
│   │   ├── components/
│   │   └── App.jsx
│   └── vite.config.js
├── server/                # Express backend
│   ├── routes/
│   │   ├── members.js
│   │   └── auth.js
│   ├── uploads/           # folder penyimpanan foto
│   ├── models/
│   ├── db.js
│   └── index.js
└── README.md
```

## 7. API Endpoint (Contoh)

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/members` | Ambil semua data anggota (public) |
| POST | `/api/admin/members` | Tambah anggota baru (admin only) |
| PUT | `/api/admin/members/:id` | Edit data anggota (admin only) |
| DELETE | `/api/admin/members/:id` | Hapus anggota (admin only) |
| POST | `/api/admin/login` | Login admin |

## 8. Catatan Tambahan
- Desain disesuaikan dengan identitas visual AI Center UB (warna, logo).
- Untuk versi awal, autentikasi admin bisa menggunakan satu akun statis (username/password di environment variable) sebelum dikembangkan ke sistem multi-user.
- Foto anggota disarankan dikompresi otomatis saat upload agar ukuran file tidak terlalu besar.

## 9. Estimasi Tahapan Pengerjaan

| Tahap | Deskripsi |
|---|---|
| 1 | Setup project Vite + Express, struktur folder |
| 2 | Pengembangan halaman publik (Home, About, Team, Contact) |
| 3 | Pengembangan API backend untuk data anggota |
| 4 | Pengembangan dashboard admin (login + CRUD anggota) |
| 5 | Integrasi upload foto & testing end-to-end |
| 6 | Styling final & deployment |