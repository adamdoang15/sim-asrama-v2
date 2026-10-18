# SIM Asrama Domain Model

Sistem Informasi Manajemen Asrama dan Lembaga Pendidikan yang mengelola santri (Gelara), pegawai, kegiatan, sarana prasarana, keuangan, dan evaluasi kurikulum akademik dalam lingkungan multi-institusi.

## Language

**Gelara**:
Santri atau peserta didik terdaftar yang tinggal dan menempuh pendidikan di asrama.
_Avoid_: Siswa, murid, santri (secara informal)

**Lembaga**:
Unit institusi pendidikan atau operasional cabang mandiri di bawah naungan yayasan (misal: LKP Doa Bangsa Cicantayan, LKP Doa Bangsa Banjarbaru).
_Avoid_: Cabang, unit kerja, sekolah, tenant

**Yayasan**:
Entitas pimpinan pusat pembina seluruh lembaga dengan hak akses pandang lintas institusi (super-tenant/cross-institution viewer).
_Avoid_: Superadmin, pusat, holding

**BelongsToLembaga**:
Modul arsitektur yang mengisolasi kepemilikan data per lembaga serta mengatur fallback multi-tenancy dan scoping query secara konsisten.
_Avoid_: TenantTrait, MultiTenantScope

**AcademicEvaluation**:
Modul domain kurikulum yang bertanggung jawab atas kalkulasi bobot nilai akhir, konversi skala predikat, distribusi ketuntasan, dan agregasi data ledger rapor.
_Avoid_: NilaiCalculator, LedgerService, ReportGenerator

**Ledger Rapor**:
Matriks kompilasi evaluasi terpadu santri mencakup nilai seluruh mata pelajaran, rekam kesehatan, capaian ekstrakurikuler, catatan sikap spiritual/sosial, dan absensi per semester.
_Avoid_: Buku Nilai, Raport, Transkrip Sementara

**AssetRegistry**:
Modul domain sarana prasarana yang mengelola siklus hidup aset fisik, penomoran kode aset/pengadaan berurut, mutasi status kondisi, serta konversi penerimaan pengadaan menjadi inventaris aktif.
_Avoid_: AssetService, SarprasManager, InventoryHelper

**ActivityTracking**:
Modul domain kedisiplinan dan absensi harian yang mengelola pembagian rentang kalender pekanan, agregasi rekapitulasi status kehadiran santri (Hadir, Izin, Sakit, Alfa), dan kompilasi runtun waktu tren aktivitas per bulan.
_Avoid_: DailyActivityService, AttendanceHelper, ActivityManager

**BudgetLedger**:
Modul domain akuntansi dan anggaran BOP yang mengelola kompilasi matriks keuangan rencana vs aktual (FKDB dan Mandiri/OT), ringkasan variansi pos operasional, akumulasi saldo berjalan tahunan (debit/kredit), serta katalog templat akun standar asrama.
_Avoid_: BopService, FinanceHelper, BudgetManager

**HealthBiometrics**:
Modul domain kesehatan klinis santri yang bertanggung jawab atas perhitungan Indeks Massa Tubuh (IMT/BMI), klasifikasi ambang batas nutrisi dan tensi, agregasi keparahan riwayat sakit, evaluasi status kohort kesehatan asrama, serta penyusunan rekam medis terpadu.
_Avoid_: HealthService, MedicalHelper, BmiCalculator
