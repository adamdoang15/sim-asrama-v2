<?php

namespace App\Http\Controllers;

use App\Models\AnggaranBop;
use App\Models\Aset;
use App\Models\DailyActivity;
use App\Models\Gelara;
use App\Models\KalenderAkademik;
use App\Models\Kegiatan;
use App\Models\KelasMapel;
use App\Models\Kesehatan;
use App\Models\NilaiAkademik;
use App\Models\Pegawai;
use App\Models\Pelanggaran;
use App\Models\PengadaanAset;
use App\Models\PerbaikanAset;
use App\Models\Prestasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function kesekretariatan(Request $request): Response
    {
        $user = $request->user();
        $gelaraQuery = Gelara::forUser($user);
        $pegawaiQuery = Pegawai::forUser($user);

        $totalGelara = (clone $gelaraQuery)->count();
        $totalPegawai = (clone $pegawaiQuery)->count();
        $pegawaiTetap = (clone $pegawaiQuery)->where('status_pegawai', 'like', '%Tetap%')->count();
        $berkasLengkap = (clone $gelaraQuery)->whereNotNull('nig')->count();

        // Chart 1: Gender Distribution
        $laki = (clone $gelaraQuery)->where('jenis_kelamin', 'Laki-laki')->count();
        $perempuan = (clone $gelaraQuery)->where('jenis_kelamin', 'Perempuan')->count();
        $genderData = [
            ['name' => 'Putra (Laki-laki)', 'value' => $laki],
            ['name' => 'Putri (Perempuan)', 'value' => $perempuan],
        ];

        // Chart 2: Santri per Angkatan
        $angkatanCounts = (clone $gelaraQuery)
            ->selectRaw('angkatan, count(*) as count')
            ->whereNotNull('angkatan')
            ->groupBy('angkatan')
            ->orderBy('angkatan')
            ->limit(6)
            ->pluck('count', 'angkatan')
            ->toArray();

        $angkatanData = [];
        foreach ($angkatanCounts as $angkatan => $count) {
            $angkatanData[] = [
                'name' => 'Angkatan '.$angkatan,
                'value' => (int) $count,
            ];
        }
        if (empty($angkatanData)) {
            $angkatanData = [['name' => 'Aktif', 'value' => $totalGelara]];
        }

        // Recent Santri
        $recentData = (clone $gelaraQuery)->latest('id')->limit(5)->get(['id', 'name', 'nig', 'kelas', 'angkatan', 'created_at']);

        return Inertia::render('Kesekretariatan/Analytics', [
            'stats' => [
                'total_gelara' => $totalGelara,
                'total_pegawai' => $totalPegawai,
                'pegawai_tetap' => $pegawaiTetap,
                'berkas_lengkap' => $berkasLengkap,
            ],
            'genderData' => $genderData,
            'angkatanData' => $angkatanData,
            'recentData' => $recentData,
        ]);
    }

    public function kegelaraan(Request $request): Response
    {
        $user = $request->user();
        $kegiatanQuery = Kegiatan::forUser($user);
        $dailyQuery = DailyActivity::forUser($user);
        $pelanggaranQuery = Pelanggaran::forUser($user);
        $prestasiQuery = Prestasi::forUser($user);

        $totalKegiatan = (clone $kegiatanQuery)->count();
        $kegiatanSelesai = (clone $kegiatanQuery)->where('is_completed', true)->count();
        $totalDaily = (clone $dailyQuery)->count();
        $totalPelanggaran = (clone $pelanggaranQuery)->count();
        $totalPrestasi = (clone $prestasiQuery)->count();

        // Chart 1: Kategori Kegiatan
        $kategoriCounts = (clone $kegiatanQuery)
            ->selectRaw('type, count(*) as count')
            ->whereNotNull('type')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        $kategoriData = [];
        foreach ($kategoriCounts as $kat => $val) {
            $kategoriData[] = ['name' => ucfirst($kat), 'value' => (int) $val];
        }
        if (empty($kategoriData)) {
            $kategoriData = [
                ['name' => 'Terlaksana', 'value' => $kegiatanSelesai],
                ['name' => 'Terjadwal', 'value' => max(0, $totalKegiatan - $kegiatanSelesai)],
            ];
        }

        // Chart 2: Disiplin Santri (Pelanggaran vs Prestasi)
        $disciplineData = [
            ['name' => 'Catatan Pelanggaran', 'value' => $totalPelanggaran],
            ['name' => 'Pencapaian Prestasi', 'value' => $totalPrestasi],
        ];

        $recentKegiatan = (clone $kegiatanQuery)->orderBy('start_date', 'desc')->limit(5)->get();

        return Inertia::render('Kegelaraan/Analytics', [
            'stats' => [
                'total_kegiatan' => $totalKegiatan,
                'kegiatan_selesai' => $kegiatanSelesai,
                'total_daily' => $totalDaily,
                'total_prestasi' => $totalPrestasi,
            ],
            'kategoriData' => $kategoriData,
            'disciplineData' => $disciplineData,
            'recentKegiatan' => $recentKegiatan,
        ]);
    }

    public function kurikulum(Request $request): Response
    {
        $user = $request->user();
        $kalenderQuery = KalenderAkademik::forUser($user);
        $nilaiQuery = NilaiAkademik::forUser($user);
        $mapelQuery = KelasMapel::forUser($user);

        $totalAgenda = (clone $kalenderQuery)->count();
        $totalMapel = (clone $mapelQuery)->count();
        $totalNilai = (clone $nilaiQuery)->count();

        // Hitung ketuntasan (KKM dinamis dari KelasMapel, fallback 75)
        $avgKkm = round((float) ((clone $mapelQuery)->avg('kkm') ?: 75.0), 1);
        $tuntas = (clone $nilaiQuery)->where('nilai_akhir', '>=', $avgKkm)->count();
        $belumTuntas = (clone $nilaiQuery)->where('nilai_akhir', '<', $avgKkm)->count();

        $ketuntasanData = $totalNilai > 0 ? [
            ['name' => "Tuntas KKM (>={$avgKkm})", 'value' => max(0, $tuntas)],
            ['name' => "Perlu Remedial (<{$avgKkm})", 'value' => max(0, $belumTuntas)],
        ] : [];

        // Rata-rata per mapel
        $mapelAverages = (clone $nilaiQuery)
            ->selectRaw('mata_pelajaran, avg(nilai_akhir) as rata_rata')
            ->whereNotNull('mata_pelajaran')
            ->groupBy('mata_pelajaran')
            ->limit(6)
            ->pluck('rata_rata', 'mata_pelajaran')
            ->toArray();

        $mapelData = [];
        foreach ($mapelAverages as $mapel => $avg) {
            $mapelData[] = [
                'name' => $mapel,
                'value' => round((float) $avg, 1),
            ];
        }

        $recentNilai = (clone $nilaiQuery)
            ->with(['gelara:id,name,nig,kelas'])
            ->latest('updated_at')
            ->limit(7)
            ->get();

        return Inertia::render('Kurikulum/Analytics', [
            'stats' => [
                'total_agenda' => $totalAgenda,
                'total_mapel' => $totalMapel,
                'total_nilai' => $totalNilai,
                'persen_tuntas' => $totalNilai > 0 ? round(($tuntas / $totalNilai) * 100) : 0,
            ],
            'kkm' => $avgKkm,
            'ketuntasanData' => $ketuntasanData,
            'mapelData' => $mapelData,
            'recentNilai' => $recentNilai,
        ]);
    }

    public function kesehatan(Request $request): Response
    {
        $kesehatanQuery = Kesehatan::forUser($request->user());

        $totalPemeriksaan = (clone $kesehatanQuery)->count();
        $imtNormal = (clone $kesehatanQuery)->where('imt_kategori', 'like', '%Normal%')->count();
        $tensiNormal = (clone $kesehatanQuery)->where('tensi_kategori', 'like', '%Normal%')->count();

        // Chart 1: Distribusi IMT
        $imtCounts = (clone $kesehatanQuery)
            ->selectRaw('imt_kategori, count(*) as count')
            ->whereNotNull('imt_kategori')
            ->groupBy('imt_kategori')
            ->pluck('count', 'imt_kategori')
            ->toArray();

        $imtData = [];
        foreach ($imtCounts as $kategori => $cnt) {
            $imtData[] = ['name' => $kategori, 'value' => (int) $cnt];
        }
        if (empty($imtData)) {
            $imtData = [
                ['name' => 'Gizi Baik / Normal', 'value' => max(1, $imtNormal)],
                ['name' => 'Perhatian Khusus', 'value' => 0],
            ];
        }

        // Chart 2: Distribusi Tekanan Darah
        $tensiCounts = (clone $kesehatanQuery)
            ->selectRaw('tensi_kategori, count(*) as count')
            ->whereNotNull('tensi_kategori')
            ->groupBy('tensi_kategori')
            ->pluck('count', 'tensi_kategori')
            ->toArray();

        $tensiData = [];
        foreach ($tensiCounts as $tensi => $cnt) {
            $tensiData[] = ['name' => $tensi, 'value' => (int) $cnt];
        }
        if (empty($tensiData)) {
            $tensiData = [
                ['name' => 'Tensi Normal', 'value' => max(1, $tensiNormal)],
                ['name' => 'Hipotensi / Rendah', 'value' => 0],
                ['name' => 'Hipertensi / Tinggi', 'value' => 0],
            ];
        }

        $recentPemeriksaan = (clone $kesehatanQuery)->with('gelara')->latest('id')->limit(5)->get();

        return Inertia::render('Kesehatan/Analytics', [
            'stats' => [
                'total_pemeriksaan' => $totalPemeriksaan,
                'imt_normal' => $imtNormal,
                'tensi_normal' => $tensiNormal,
                'persen_sehat' => $totalPemeriksaan > 0 ? round(($imtNormal / $totalPemeriksaan) * 100) : 100,
            ],
            'imtData' => $imtData,
            'tensiData' => $tensiData,
            'recentPemeriksaan' => $recentPemeriksaan,
        ]);
    }

    public function sarpras(Request $request): Response
    {
        $user = $request->user();
        $asetQuery = Aset::forUser($user);
        $perbaikanQuery = PerbaikanAset::whereHas('aset', fn ($qa) => $qa->forUser($user));
        $pengadaanQuery = PengadaanAset::forUser($user);

        $totalAset = (clone $asetQuery)->count();
        $asetBaik = (clone $asetQuery)->where('kondisi', 'Baik')->count();
        $asetRusak = (clone $asetQuery)->where('kondisi', 'like', '%Rusak%')->count();
        $perbaikanAktif = (clone $perbaikanQuery)->where('status', '!=', 'Selesai')->count();
        $pengadaanAktif = (clone $pengadaanQuery)->where('status', '!=', 'Selesai')->count();

        // Chart 1: Kondisi Aset
        $kondisiCounts = (clone $asetQuery)
            ->selectRaw('kondisi, count(*) as count')
            ->whereNotNull('kondisi')
            ->groupBy('kondisi')
            ->pluck('count', 'kondisi')
            ->toArray();

        $kondisiData = [];
        foreach ($kondisiCounts as $kondisi => $cnt) {
            $kondisiData[] = ['name' => $kondisi, 'value' => (int) $cnt];
        }
        if (empty($kondisiData)) {
            $kondisiData = [
                ['name' => 'Kondisi Baik', 'value' => max(1, $asetBaik)],
                ['name' => 'Perlu Perbaikan', 'value' => max(0, $asetRusak)],
            ];
        }

        // Chart 2: Status Perbaikan Aset
        $statusPerbaikanCounts = (clone $perbaikanQuery)
            ->selectRaw('status, count(*) as count')
            ->whereNotNull('status')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $statusPerbaikanData = [];
        foreach ($statusPerbaikanCounts as $status => $cnt) {
            $statusPerbaikanData[] = ['name' => $status, 'value' => (int) $cnt];
        }
        if (empty($statusPerbaikanData)) {
            $statusPerbaikanData = [
                ['name' => 'Selesai Dikerjakan', 'value' => 0],
                ['name' => 'Dalam Pengerjaan', 'value' => $perbaikanAktif],
            ];
        }

        $recentPerbaikan = (clone $perbaikanQuery)->with('aset')->latest('id')->limit(5)->get();

        return Inertia::render('Sarpras/Analytics', [
            'stats' => [
                'total_aset' => $totalAset,
                'aset_baik' => $asetBaik,
                'perbaikan_aktif' => $perbaikanAktif,
                'pengadaan_aktif' => $pengadaanAktif,
            ],
            'kondisiData' => $kondisiData,
            'statusPerbaikanData' => $statusPerbaikanData,
            'recentPerbaikan' => $recentPerbaikan,
        ]);
    }

    public function keuangan(Request $request): Response
    {
        $user = $request->user();
        $bopQuery = AnggaranBop::forUser($user);

        $totalPlan = (float) (clone $bopQuery)->sum('plan');
        $totalAktual = (float) (clone $bopQuery)->sum('aktual');
        $sisaSaldo = $totalPlan - $totalAktual;
        $persenSerapan = $totalPlan > 0 ? round(($totalAktual / $totalPlan) * 100, 1) : 0;

        // Chart 1: Pagu Anggaran per Pos Kategori
        $kategoriPlans = (clone $bopQuery)
            ->selectRaw('kategori, sum(plan) as total_plan')
            ->whereNotNull('kategori')
            ->groupBy('kategori')
            ->pluck('total_plan', 'kategori')
            ->toArray();

        $posBelanjaData = [];
        foreach ($kategoriPlans as $kat => $val) {
            $posBelanjaData[] = ['name' => $kat, 'value' => (float) $val];
        }
        if (empty($posBelanjaData)) {
            $posBelanjaData = [
                ['name' => 'Operasional Asrama', 'value' => $totalPlan > 0 ? $totalPlan : 10000000],
            ];
        }

        // Chart 2: Perbandingan Rencana vs Realisasi
        $realisasiData = [
            ['name' => 'Pagu Rencana (Plan)', 'value' => $totalPlan],
            ['name' => 'Realisasi (Aktual)', 'value' => $totalAktual],
        ];

        $recentAnggaran = (clone $bopQuery)->latest('id')->limit(5)->get();

        return Inertia::render('Keuangan/Analytics', [
            'stats' => [
                'total_plan' => $totalPlan,
                'total_aktual' => $totalAktual,
                'sisa_saldo' => $sisaSaldo,
                'persen_serapan' => $persenSerapan,
            ],
            'posBelanjaData' => $posBelanjaData,
            'realisasiData' => $realisasiData,
            'recentAnggaran' => $recentAnggaran,
        ]);
    }
}
