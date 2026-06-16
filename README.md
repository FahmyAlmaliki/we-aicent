# AI Center UB Workshop

Website profil dan workshop untuk AI Center Universitas Brawijaya dengan:

- Frontend `React + Vite`
- Backend `Express`
- Penyimpanan data anggota `JSON`
- Upload foto lokal ke `server/uploads`
- Login admin sederhana berbasis `JWT`

## Menjalankan project

1. Install dependency:

```bash
npm install
```

2. Salin environment:

```bash
copy .env.example .env
```

3. Jalankan development server:

```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173` dan backend di `http://localhost:5000`.

## Akun admin default

- Username: `admin`
- Password: `password123`

Jika file `.env` belum dibuat, backend tetap memakai default ini. Silakan ganti melalui file `.env`.
