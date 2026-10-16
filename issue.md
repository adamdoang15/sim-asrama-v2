# Issue: Standarisasi Header Banner Berwarna pada Seluruh Halaman Modul

## 📌 Informasi Tugas
- **Target File:** Halaman yang saat ini masih menggunakan header polos/putih:
  - `resources/js/pages/Kurikulum/KalenderAkademik.tsx` (contoh pada gambar 2)
  - `resources/js/pages/Kurikulum/NilaiAkademik.tsx`
  - `resources/js/pages/Kesekretariatan/DataGelara.tsx`
  - `resources/js/pages/Kesekretariatan/DataPegawai.tsx`
  - `resources/js/pages/Kegelaraan/Kalender.tsx`
  - `resources/js/pages/Kegelaraan/DailyActivity.tsx`
  - `resources/js/pages/Kegelaraan/TrackRecord.tsx`
  - `resources/js/pages/Kegelaraan/RekapProgram.tsx`
  - `resources/js/pages/Kesehatan/Pemeriksaan.tsx`
  - `resources/js/pages/Kesehatan/RekamMedis.tsx`
  - `resources/js/pages/Sarpras/Inventaris.tsx`
  - `resources/js/pages/Sarpras/Perbaikan.tsx`
  - `resources/js/pages/Sarpras/Pengadaan.tsx`
  - `resources/js/pages/Admin/Users/Index.tsx`
- **File Referensi Desain yang Sudah Benar:**
  - `resources/js/pages/Keuangan/Bop.tsx` (contoh banner pada gambar 1)
  - `resources/js/pages/Administrasi/Index.tsx`
- **Tingkat Prioritas:** Medium / Visual Consistency
- **Prinsip Utama (/ponytail):** Gunakan satu template banner Tailwind yang seragam, ganti struktur header lama tanpa mengubah logika state, filter data, maupun tombol aksi.

---

## 🔍 Latar Belakang & Masalah
Saat ini terjadi perbedaan mencolok pada bagian atas (header) halaman:
1. **Halaman Berwarna (Gambar 1 - Sudah Benar):** Modul Keuangan (`Bop.tsx`) dan Administrasi telah menggunakan **banner kartu berwarna gradasi navy (`bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900`)** yang modern, berkarakter, dan rapi.
2. **Halaman Polos (Gambar 2 - Masih Beda):** Halaman seperti `KalenderAkademik.tsx`, `DataGelara.tsx`, `Sarpras`, dll. masih memakai header teks hitam di atas latar belakang putih polos.
3. **Kebutuhan Pengguna:** Samakan semua halaman dengan desain **banner berwarna** seperti gambar 1 agar tampilan proyek konsisten di seluruh modul.

---

## 🎯 Template Acuan Header Banner (Design Reference)

Setiap halaman yang belum menggunakan banner wajib mengganti header lamanya dengan struktur template berikut:

```tsx
{/* Header Banner Berwarna */}
<div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Sisi Kiri: Icon, Judul & Keterangan */}
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                    {/* Judul Halaman */}
                </h1>
                <p className="text-xs text-slate-200 sm:text-sm">
                    {/* Deskripsi Singkat Halaman */}
                </p>
            </div>
        </div>

        {/* Sisi Kanan: Kontrol Filter & Tombol Aksi */}
        <div className="flex flex-wrap items-center gap-2">
            {/* Filter Dropdown (jika ada) - gunakan style semi-transparan / glassmorphism */}
            {/* Tombol Aksi Utama / Tambah Data - gunakan tombol putih atau biru kontras */}
            {/* Contoh tombol putih kontras di atas banner gelap: */}
            {/* className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xs hover:bg-slate-50 transition active:scale-[0.98]" */}
        </div>
    </div>
</div>
```

### Panduan Penyesuaian Elemen Sisi Kanan Banner:
1. **Dropdown / Selector Filter:**
   - Bungkus dalam container semi-transparan: `rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-md text-white text-xs font-medium`.
   - Option dropdown tetap diberi warna teks gelap: `<option className="text-gray-900">`.
2. **Tombol Aksi (CTA):**
   - Tombol utama di dalam banner gelap dapat menggunakan:
     - **Pilihan 1 (Tombol Putih Kontras):** `inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-xs hover:bg-slate-50 active:scale-[0.98]` (seperti tombol "Cetak" pada gambar 1).
     - **Pilihan 2 (Tombol Biru Primer):** `inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 active:scale-[0.98]`.

---

## 🚫 Yang TIDAK Perlu Dilakukan (Anti Over-engineering)
- **Jangan** menghapus tombol fungsi, dropdown filter, atau modal yang sudah ada di header lama. Pindahkan elemen tersebut ke container sisi kanan banner (`flex items-center gap-2`).
- **Jangan** mengubah variabel state (`useState`), fungsi handler submit, atau routing Inertia.
- **Jangan** mengubah backend PHP, route, controller, maupun query database.
- **Jangan** mengubah bagian konten/tabel di bawah banner header.

---

## ✅ Kriteria Selesai (Acceptance Criteria)
- [x] Halaman `KalenderAkademik.tsx` telah menggunakan header banner berwarna navy (`from-blue-900 via-indigo-900 to-slate-900`) menggantikan header polos.
- [x] Halaman `NilaiAkademik.tsx` telah menggunakan header banner berwarna navy.
- [x] Halaman `DataGelara.tsx` dan `DataPegawai.tsx` telah menggunakan header banner berwarna navy.
- [x] Halaman `Kalender.tsx`, `DailyActivity.tsx`, `TrackRecord.tsx`, dan `RekapProgram.tsx` telah menggunakan header banner berwarna navy.
- [x] Halaman `Pemeriksaan.tsx` dan `RekamMedis.tsx` telah menggunakan header banner berwarna navy.
- [x] Halaman `Inventaris.tsx`, `Perbaikan.tsx`, dan `Pengadaan.tsx` telah menggunakan header banner berwarna navy.
- [x] Halaman `Admin/Users/Index.tsx` telah menggunakan header banner berwarna navy.
- [x] Seluruh tombol aksi dan filter yang sebelumnya ada di header lama tetap berfungsi normal di dalam banner.
- [x] Build proyek (`npm run build`) berjalan sukses tanpa error.
