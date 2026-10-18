<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DailyActivityController;
use App\Http\Controllers\GelaraController;
use App\Http\Controllers\KalenderAkademikController;
use App\Http\Controllers\KegiatanController;
use App\Http\Controllers\KesehatanController;
use App\Http\Controllers\KeuanganController;
use App\Http\Controllers\NilaiAkademikController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\PelanggaranController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\SarprasController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckViewOnly;
use App\Models\Gelara;
use App\Models\Kegiatan;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware(['auth', CheckViewOnly::class])->group(function () {
    Route::redirect('/', '/dashboard')->name('home');
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_gelara' => Gelara::forUser($user)->count(),
                'total_petugas' => Pegawai::forUser($user)->count(),
            ],
        ]);
    })->name('dashboard');

    Route::prefix('kegelaraan')->name('kegelaraan.')->middleware('role:kegelaraan')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'kegelaraan'])->name('analytics');
        Route::get('/kalender', [KegiatanController::class, 'index'])->name('kalender');
        Route::post('/kalender', [KegiatanController::class, 'store'])->name('kalender.store');
        Route::put('/kalender/{kegiatan}', [KegiatanController::class, 'update'])->name('kalender.update');
        Route::delete('/kalender/{kegiatan}', [KegiatanController::class, 'destroy'])->name('kalender.destroy');
        Route::get('/daily-activity', [DailyActivityController::class, 'index'])->name('daily-activity');
        Route::post('/daily-activity', [DailyActivityController::class, 'store']);
        Route::get('/track-record', [PelanggaranController::class, 'index'])->name('track-record');
        Route::post('/track-record', [PelanggaranController::class, 'store'])->name('track-record.store');
        Route::put('/track-record/{id}', [PelanggaranController::class, 'update'])->name('track-record.update');
        Route::delete('/track-record/{id}', [PelanggaranController::class, 'destroy'])->name('track-record.destroy');
        Route::post('/prestasi', [PrestasiController::class, 'store'])->name('prestasi.store');
        Route::put('/prestasi/{id}', [PrestasiController::class, 'update'])->name('prestasi.update');
        Route::delete('/prestasi/{id}', [PrestasiController::class, 'destroy'])->name('prestasi.destroy');
        Route::get('/rekap', function (Request $request) {
            return Inertia::render('Kegelaraan/RekapProgram', [
                'kegiatans' => Kegiatan::forUser($request->user())->orderBy('start_date', 'desc')->get(),
            ]);
        })->name('rekap');
    });

    Route::prefix('kurikulum')->name('kurikulum.')->middleware('role:kurikulum')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'kurikulum'])->name('analytics');
        Route::get('/kalender', [KalenderAkademikController::class, 'index'])->name('kalender');
        Route::post('/kalender', [KalenderAkademikController::class, 'store'])->name('kalender.store');
        Route::put('/kalender/{kalender}', [KalenderAkademikController::class, 'update'])->name('kalender.update');
        Route::delete('/kalender/{kalender}', [KalenderAkademikController::class, 'destroy'])->name('kalender.destroy');
        Route::get('/nilai-akademik', [NilaiAkademikController::class, 'index'])->name('nilai-akademik');
        Route::post('/nilai-akademik', [NilaiAkademikController::class, 'store'])->name('nilai-akademik.store');
        Route::post('/nilai-akademik/batch', [NilaiAkademikController::class, 'storeBatch'])->name('nilai-akademik.batch');
        Route::post('/nilai-akademik/kd', [NilaiAkademikController::class, 'storeKd'])->name('nilai-akademik.kd');
        Route::post('/nilai-akademik/mapel', [NilaiAkademikController::class, 'saveMapel'])->name('nilai-akademik.mapel');
        Route::post('/nilai-akademik/kkm', [NilaiAkademikController::class, 'saveKkm'])->name('nilai-akademik.kkm');
        Route::post('/nilai-akademik/pelengkap', [NilaiAkademikController::class, 'storePelengkap'])->name('nilai-akademik.pelengkap');
    });

    Route::prefix('kesehatan')->name('kesehatan.')->middleware('role:kesehatan')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'kesehatan'])->name('analytics');
        Route::get('/pemeriksaan', [KesehatanController::class, 'index'])->name('pemeriksaan');
        Route::post('/pemeriksaan', [KesehatanController::class, 'store'])->name('pemeriksaan.store');
        Route::get('/rekam-medis', [KesehatanController::class, 'rekamMedis'])->name('rekam-medis');
    });

    Route::prefix('kesekretariatan')->name('kesekretariatan.')->middleware('role:kesekretariatan')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'kesekretariatan'])->name('analytics');
        Route::get('/data-gelara', [GelaraController::class, 'index'])->name('data-gelara');
        Route::post('/data-gelara', [GelaraController::class, 'store'])->name('data-gelara.store');
        Route::post('/data-gelara/{gelara}/update', [GelaraController::class, 'update'])->name('data-gelara.update');
        Route::delete('/data-gelara/{gelara}', [GelaraController::class, 'destroy'])->name('data-gelara.destroy');
        Route::get('/data-pegawai', [PegawaiController::class, 'index'])->name('data-pegawai');
        Route::post('/data-pegawai', [PegawaiController::class, 'store'])->name('data-pegawai.store');
        Route::post('/data-pegawai/{pegawai}/update', [PegawaiController::class, 'update'])->name('data-pegawai.update');
        Route::delete('/data-pegawai/{pegawai}', [PegawaiController::class, 'destroy'])->name('data-pegawai.destroy');
    });

    Route::prefix('sarpras')->name('sarpras.')->middleware('role:sarpras')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'sarpras'])->name('analytics');
        // 1. Inventaris, Pemeriksaan Berkala & Penghapusan
        Route::get('/inventaris', [SarprasController::class, 'inventaris'])->name('inventaris');
        Route::post('/inventaris', [SarprasController::class, 'storeAset'])->name('inventaris.store');
        Route::post('/inventaris/{aset}/update', [SarprasController::class, 'updateAset'])->name('inventaris.update');
        Route::post('/inventaris/{aset}/periksa', [SarprasController::class, 'periksaBerkala'])->name('inventaris.periksa');
        Route::post('/inventaris/{aset}/hapus', [SarprasController::class, 'hapusAset'])->name('inventaris.hapus');
        Route::delete('/inventaris/{aset}', [SarprasController::class, 'destroyAset'])->name('inventaris.destroy');

        // 2. Laporan Kerusakan & Riwayat Perbaikan
        Route::get('/perbaikan', [SarprasController::class, 'perbaikan'])->name('perbaikan');
        Route::post('/perbaikan', [SarprasController::class, 'storePerbaikan'])->name('perbaikan.store');
        Route::post('/perbaikan/{perbaikan}/update-status', [SarprasController::class, 'updateStatusPerbaikan'])->name('perbaikan.update-status');

        // 3. Pengadaan Aset
        Route::get('/pengadaan', [SarprasController::class, 'pengadaan'])->name('pengadaan');
        Route::post('/pengadaan', [SarprasController::class, 'storePengadaan'])->name('pengadaan.store');
        Route::post('/pengadaan/{pengadaan}/update-status', [SarprasController::class, 'updateStatusPengadaan'])->name('pengadaan.update-status');
        Route::post('/pengadaan/{pengadaan}/terima', [SarprasController::class, 'terimaPengadaan'])->name('pengadaan.terima');
        Route::delete('/pengadaan/{pengadaan}', [SarprasController::class, 'destroyPengadaan'])->name('pengadaan.destroy');
    });

    // Keuangan
    Route::prefix('keuangan')->name('keuangan.')->middleware('role:keuangan')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'keuangan'])->name('analytics');
        Route::get('/', function () {
            return redirect()->route('keuangan.bop');
        })->name('index');
        Route::get('/bop', [KeuanganController::class, 'bop'])->name('bop');
        Route::post('/bop', [KeuanganController::class, 'storeBop'])->name('bop.store');
        Route::delete('/bop/{bop}', [KeuanganController::class, 'destroyBop'])->name('bop.destroy');
        Route::post('/bop/seed-template', [KeuanganController::class, 'seedTemplateBop'])->name('bop.seed-template');
    });

    // Administrasi
    Route::prefix('administrasi')->name('administrasi.')->middleware('role:administrasi')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Administrasi/Index');
        })->name('index');
        Route::get('/surat', function () {
            return Inertia::render('Administrasi/SuratMenyurat');
        })->name('surat');
        Route::get('/arsip', function () {
            return Inertia::render('Administrasi/ArsipDokumen');
        })->name('arsip');
        Route::get('/absensi', function (Request $request) {
            $user = $request->user();
            $petugasList = Pegawai::forUser($user)->orderBy('name')->get(['id', 'name', 'jabatan', 'lembaga']);

            return Inertia::render('Administrasi/AbsensiPetugas', [
                'petugasList' => $petugasList,
            ]);
        })->name('absensi');
    });

    // Manajemen User (Khusus Super Admin)
    Route::prefix('admin/users')->name('admin.users.')->middleware('role:administrasi,admin')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });
});
