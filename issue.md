# Issue: Pengaturan KKM Universal untuk Semua Mata Pelajaran dan Tampilkan di Analytics Kurikulum

## 1. Latar Belakang & Masalah
1. Saat ini, pengaturan KKM masih terkesan diatur per pelajaran/per kelas secara terpisah di modal kelola pelajaran. Guru/petugas kurikulum menginginkan standar KKM dapat diatur **satu kali untuk semua mata pelajaran sekaligus** agar seragam dan praktis.
2. Di halaman Analytics Kurikulum (`/kurikulum/analytics`), standar KKM yang aktif belum ditampilkan secara menonjol sebagai informasi acuan bagi evaluator/pimpinan lembaga.

---

## 2. Pendekatan Solusi (Prinsip Ponytail - Sederhana & Praktis)
- **Tanpa Migration/Tabel Baru**: Tetap manfaatkan kolom `kkm` yang sudah ada di tabel `kelas_mapels`. Saat guru menyimpan KKM baru, sistem langsung mengupdate nilai `kkm` tersebut ke **semua baris kelas dan mata pelajaran** di lembaga terkait.
- **Backend Controller (`NilaiAkademikController.php` & `AnalyticsController.php`)**:
  - Di `NilaiAkademikController::saveKkm`, lakukan update menyeluruh ke semua record `KelasMapel` milik lembaga pengguna.
  - Di `AnalyticsController::kurikulum`, kirimkan nilai standar KKM universal tersebut ke frontend.
- **Frontend Nilai Akademik (`NilaiAkademik.tsx` & `KelolaMapelModal.tsx`)**:
  - Modal "Atur KKM" di halaman Nilai Akademik ditegaskan sebagai pengaturan KKM Universal (berlaku untuk semua mata pelajaran dan kelas).
  - Hilangkan redundansi input KKM di dalam `KelolaMapelModal` agar guru tidak bingung mengira KKM diatur per mata pelajaran.
- **Frontend Analytics (`Kurikulum/Analytics.tsx`)**:
  - Tampilkan penanda/badge informasi Standar KKM Kurikulum yang jelas di header banner (misal: *"Standar KKM: 75.0 (Semua Pelajaran)"*) agar langsung terlihat saat membuka halaman analytics.

---

## 3. File yang Perlu Diubah

1. **Backend Controller**:
   - `app/Http/Controllers/NilaiAkademikController.php` (method `saveKkm` & query KKM di `index`)
   - `app/Http/Controllers/AnalyticsController.php` (method `kurikulum`)
2. **Frontend Views**:
   - `resources/js/pages/Kurikulum/NilaiAkademik.tsx` (modal KKM universal)
   - `resources/js/pages/Kurikulum/components/KelolaMapelModal.tsx` (rapikan agar fokus kelola list mapel)
   - `resources/js/pages/Kurikulum/Analytics.tsx` (tampilkan badge standar KKM di header/banner)

---

## 4. Panduan Pengerjaan untuk Junior Programmer / AI Model

1. **Update `NilaiAkademikController.php`**:
   - Di method `saveKkm`:
     ```php
     public function saveKkm(Request $request): RedirectResponse
     {
         $validated = $request->validate([
             'kkm' => 'required|numeric|min:0|max:100',
         ]);

         $user = $request->user();
         $lembaga = ($user && $user->lembaga !== 'Yayasan') ? $user->lembaga : null;

         $query = KelasMapel::query();
         if ($lembaga) {
             $query->where('lembaga', $lembaga)->orWhereNull('lembaga');
         }

         // Update semua record kelas_mapels agar KKM seragam untuk semua mapel
         $query->update(['kkm' => (float) $validated['kkm']]);

         return redirect()->back()->with('success', 'Standar KKM berhasil diterapkan untuk semua mata pelajaran.');
     }
     ```

2. **Update `AnalyticsController.php`**:
   - Di method `kurikulum`, pastikan mengambil nilai KKM universal:
     ```php
     $kkm = round((float) ((clone $mapelQuery)->value('kkm') ?? 75.0), 1);
     ```
   - Kirimkan prop `'kkm' => $kkm` ke Inertia view `Kurikulum/Analytics`.

3. **Update `NilaiAkademik.tsx` & `KelolaMapelModal.tsx`**:
   - Pada modal "Atur Standar KKM" di `NilaiAkademik.tsx`:
     - Ubah judul menjadi: *"Atur Standar KKM Universal"*
     - Keterangan: *"Nilai KKM ini akan langsung diterapkan untuk seluruh mata pelajaran dan tingkatan kelas."*
     - Saat memanggil `router.post('/kurikulum/nilai-akademik/kkm', ...)`, cukup kirim `{ kkm: inputKkm }`.
   - Di `KelolaMapelModal.tsx`, hilangkan input KKM terpisah agar pengaturan KKM terpusat di satu tombol "Atur KKM".

4. **Update `Kurikulum/Analytics.tsx`**:
   - Tampilkan badge Standar KKM yang menonjol di Header Banner (di samping judul halaman):
     ```tsx
     <div className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white border border-white/20">
         <span>Standar KKM: {kkm} (Semua Pelajaran)</span>
     </div>
     ```

---

## 5. Kriteria Penerimaan (Definition of Done)
- [x] Menyimpan KKM satu kali langsung mengupdate nilai KKM ke semua mata pelajaran/kelas di database.
- [x] Modal KKM secara jelas menginformasikan bahwa nilai KKM berlaku universal untuk semua mata pelajaran.
- [x] Halaman Analytics Kurikulum menampilkan informasi Standar KKM yang aktif secara jelas dan menonjol.
- [x] Perhitungan ketuntasan belajar di Analytics dan Nilai Akademik otomatis menggunakan nilai KKM universal tersebut.
- [x] Seluruh test fitur (`vendor/bin/pest`) dan build frontend (`npm run build`) berjalan sukses tanpa error.
