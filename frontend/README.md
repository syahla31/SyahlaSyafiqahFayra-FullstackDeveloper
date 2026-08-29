# IndoKerja - Full-Stack Job Portal Assessment

IndoKerja adalah aplikasi web portal lowongan kerja berbasis *Full-Stack* yang menyediakan platform interaktif bagi **Job Seeker** (pencari kerja) dan **Company** (perusahaan). 

Aplikasi ini dibangun menggunakan arsitektur modern dengan autentikasi berbasis token (JWT), otorisasi berbasis peran (Role-Based Access Control), validasi pencegahan lamaran ganda, manajemen riwayat status pelamar *real-time*, serta antarmuka yang responsif.

---

## 🚀 Tech Stack

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Authentication**: JSON Web Token (JWT) & Bcrypt (Password Hashing)

### **Frontend**
- **Framework**: React.js (TypeScript)
- **Build Tool**: Vite (v5)
- **Styling**: Tailwind CSS (v4)
- **HTTP Client**: Axios

---

## ✨ Fitur Utama

1. **Autentikasi & Otorisasi Roles**
   - Pendaftaran & Login akun khusus **Job Seeker** dan **Company**.
   - Keamanan rute API menggunakan JWT Middleware.

2. **Fitur Perusahaan (Company)**
   - Membuat dan memublikasikan lowongan pekerjaan baru.
   - Melihat daftar lowongan kerja milik perusahaan (*Lowongan Saya*).
   - Mengelola kandidat pelamar dan mengedit status kandidat secara *real-time* (`APPLIED`, `REVIEWING`, `SHORTLISTED`, `REJECTED`, `ACCEPTED`).

3. **Fitur Pencari Kerja (Job Seeker)**
   - Mencari dan melamar lowongan kerja yang tersedia.
   - Validasi sisi server & client untuk mencegah pengiriman lamaran ganda pada lowongan yang sama.
   - Memantau perubahan status lamaran melalui halaman *Riwayat Lamaran*.

---

## 🛠️ Cara Menjalankan Aplikasi Secara Lokal

### **Prasyarat Sistem**
- **Node.js** (v18 atau versi terbaru)
- **PostgreSQL** (Versi 12+ / Server PostgreSQL aktif)
- **npm** (Node Package Manager)

---

### **Langkah 1: Setup Backend**

1. Buka terminal, masuk ke folder `backend`:
   ``` 
   cd backend
   ```

2. Install seluruh dependensi paket:
    ``` 
    npm install
    ```

3. Buat file .env di dalam folder backend dan sesuaikan URL database PostgreSQL.
    ```
    DATABASE_URL="postgresql://postgres:password_kamu@localhost:5432/indokerja_db?schema=public"
    JWT_SECRET="indokerja_super_secret_key_123"
    PORT=5000
    ```

4. Jalankan migrasi database Prisma untuk membuat skema tabel di PostgreSQL:

    ```
    npx prisma migrate dev --name init
    ```

5. Jalankan server backend (mode development):

    ```
    npm run dev
    ```
    Server backend akan berjalan di http://localhost:5000.

### **Langkah 2: Setup Frontend**

1. Buka terminal baru, masuk ke folder `frontend`:
    ```
    cd frontend
    ```
2. Install seluruh dependensi paket:
    ```
    npm install
    ```

3. Pastikan konfigurasi baseURL pada file src/api/client.ts mengarah ke backend lokal:
    ```
    const api = axios.create({
      baseURL: 'http://localhost:5000/api',
    }); 
    ```
4. Jalankan server pengembangan frontend (Vite):
    ```
    npm run dev
    ```
    Frontend akan berjalan di http://localhost:5173.

## 📡 Ringkasan API Endpoint

### Auth
- POST /api/auth/register - Registrasi akun baru (JOB_SEEKER / COMPANY).
- POST /api/auth/login - Authentikasi dan pengambilan JWT Token.

### Jobs
- GET /api/jobs - Mengambil daftar seluruh lowongan pekerjaan.
- POST /api/jobs - Memublikasikan lowongan kerja baru (Khusus Company).

### Applications
- POST /api/applications/apply - Mengirimkan lamaran kerja (Khusus Job Seeker).
- GET /api/applications/my-applications - Mengambil riwayat lamaran (Khusus Job Seeker).
- GET /api/applications/company-applications - Mengambil daftar kandidat pelamar (Khusus Company).
- PUT /api/applications/:id/status - Mengubah status lamaran kandidat (Khusus Company).

## 📁 Struktur Folder Project

```text
indokerja-assessment/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Schema & Relasi Database
│   ├── src/
│   │   ├── controllers/         # Logika Bisnis Aplikasi
│   │   ├── middleware/          # Middleware JWT Auth
│   │   ├── routes/              # Routing API Express
│   │   └── index.ts             # Entry Point Express Server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/                 # Axios Interceptor Client
    │   ├── pages/               # Komponen Halaman (Auth, Dashboards)
    │   ├── App.tsx              # Main Application Routing State
    │   └── main.tsx
    └── package.json