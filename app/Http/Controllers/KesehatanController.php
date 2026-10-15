<?php

namespace App\Http\Controllers;

use App\Models\Gelara;
use App\Models\Kesehatan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KesehatanController extends Controller
{
    public function index(Request $request): Response
    {
        $tahunOptions = [
            'T.A. 2026/2027 (Semester Ganjil)',
            'T.A. 2026/2027 (Semester Genap)',
        ];
        $kelasOptions = [
            'Kelas 10',
            'Kelas 11',
            'Kelas 12',
        ];

        $selectedTahun = $request->input('tahun_akademik', $tahunOptions[0]);
        if (! in_array($selectedTahun, $tahunOptions, true)) {
            $selectedTahun = $tahunOptions[0];
        }

        $selectedKelas = $request->input('kelas', $kelasOptions[0]);
        if (! in_array($selectedKelas, $kelasOptions, true)) {
            $selectedKelas = $kelasOptions[0];
        }

        $semester = str_contains($selectedTahun, 'Genap') ? '2' : '1';

        $user = $request->user();
        $gelaraQuery = Gelara::where('kelas', $selectedKelas);
        if ($user && $user->lembaga !== 'Yayasan') {
            $gelaraQuery->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }
        $gelaras = $gelaraQuery->orderBy('name', 'asc')->get();

        $kesehatans = Kesehatan::where('tahun_akademik', $selectedTahun)
            ->where('semester', $semester)
            ->whereIn('gelara_id', $gelaras->pluck('id'))
            ->get()
            ->keyBy('gelara_id');

        $students = $gelaras->map(function ($g) use ($kesehatans) {
            $k = $kesehatans->get($g->id);

            return [
                'id' => $g->id,
                'name' => $g->name,
                'nig' => $g->nig,
                'kelas' => $g->kelas,
                'kesehatan' => $k ? [
                    'id' => $k->id,
                    'berat_badan' => $k->berat_badan,
                    'tinggi_badan' => $k->tinggi_badan,
                    'imt' => $k->imt,
                    'imt_kategori' => $k->imt_kategori,
                    'tensi' => $k->tensi,
                    'tensi_kategori' => $k->tensi_kategori,
                    'riwayat_sakit' => $k->riwayat_sakit ?? [
                        'ringan' => ['jumlah' => 0, 'keterangan' => ''],
                        'sedang' => ['jumlah' => 0, 'keterangan' => ''],
                        'berat' => ['jumlah' => 0, 'keterangan' => ''],
                    ],
                    'catatan_kesehatan' => $k->catatan_kesehatan,
                ] : null,
            ];
        });

        return Inertia::render('Kesehatan/Pemeriksaan', [
            'students' => $students,
            'filters' => [
                'tahun_akademik' => $selectedTahun,
                'kelas' => $selectedKelas,
                'semester' => $semester,
                'search' => trim((string) $request->input('search', '')),
            ],
            'options' => [
                'tahun_akademik' => $tahunOptions,
                'kelas' => $kelasOptions,
            ],
        ]);
    }

    public function rekamMedis(Request $request): Response
    {
        $tahunOptions = [
            'T.A. 2026/2027 (Semester Ganjil)',
            'T.A. 2026/2027 (Semester Genap)',
        ];
        $kelasOptions = [
            'Semua',
            'Kelas 10',
            'Kelas 11',
            'Kelas 12',
        ];

        $selectedTahun = $request->input('tahun_akademik', $tahunOptions[0]);
        if (! in_array($selectedTahun, $tahunOptions, true)) {
            $selectedTahun = $tahunOptions[0];
        }

        $selectedKelas = $request->input('kelas', 'Semua');
        if (! in_array($selectedKelas, $kelasOptions, true)) {
            $selectedKelas = 'Semua';
        }

        $search = trim((string) $request->input('search', ''));
        $semester = str_contains($selectedTahun, 'Genap') ? '2' : '1';

        $user = $request->user();
        $gelaraQuery = Gelara::query();
        if ($user && $user->lembaga !== 'Yayasan') {
            $gelaraQuery->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }
        if ($selectedKelas !== 'Semua') {
            $gelaraQuery->where('kelas', $selectedKelas);
        }
        if ($search !== '') {
            $gelaraQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nig', 'like', "%{$search}%");
            });
        }

        $gelaras = $gelaraQuery->orderBy('kelas', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        $allGelaraIds = $gelaras->pluck('id');

        $kesehatans = Kesehatan::where('tahun_akademik', $selectedTahun)
            ->where('semester', $semester)
            ->whereIn('gelara_id', $allGelaraIds)
            ->get()
            ->keyBy('gelara_id');

        $allHistories = Kesehatan::whereIn('gelara_id', $allGelaraIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('gelara_id');

        $students = $gelaras->map(function ($g) use ($kesehatans, $allHistories) {
            $k = $kesehatans->get($g->id);
            $historyList = $allHistories->get($g->id, collect());

            $ringanCount = (int) ($k?->riwayat_sakit['ringan']['jumlah'] ?? 0);
            $sedangCount = (int) ($k?->riwayat_sakit['sedang']['jumlah'] ?? 0);
            $beratCount = (int) ($k?->riwayat_sakit['berat']['jumlah'] ?? 0);
            $totalSakit = $ringanCount + $sedangCount + $beratCount;

            $sudahDiperiksa = $k !== null && ($k->berat_badan !== null || $k->tensi !== null);

            return [
                'id' => $g->id,
                'name' => $g->name,
                'nig' => $g->nig,
                'kelas' => $g->kelas,
                'sudah_diperiksa' => $sudahDiperiksa,
                'total_sakit' => $totalSakit,
                'kesehatan' => $k ? [
                    'id' => $k->id,
                    'berat_badan' => $k->berat_badan,
                    'tinggi_badan' => $k->tinggi_badan,
                    'imt' => $k->imt,
                    'imt_kategori' => $k->imt_kategori,
                    'tensi' => $k->tensi,
                    'tensi_kategori' => $k->tensi_kategori,
                    'riwayat_sakit' => $k->riwayat_sakit ?? [
                        'ringan' => ['jumlah' => 0, 'keterangan' => ''],
                        'sedang' => ['jumlah' => 0, 'keterangan' => ''],
                        'berat' => ['jumlah' => 0, 'keterangan' => ''],
                    ],
                    'catatan_kesehatan' => $k->catatan_kesehatan,
                    'updated_at' => $k->updated_at?->timezone('Asia/Jakarta')->format('d M Y, H:i').' WIB',
                ] : null,
                'riwayat_pemeriksaan' => $historyList->map(function ($h) {
                    return [
                        'id' => $h->id,
                        'tahun_akademik' => $h->tahun_akademik,
                        'semester' => $h->semester,
                        'berat_badan' => $h->berat_badan,
                        'tinggi_badan' => $h->tinggi_badan,
                        'imt' => $h->imt,
                        'imt_kategori' => $h->imt_kategori,
                        'tensi' => $h->tensi,
                        'tensi_kategori' => $h->tensi_kategori,
                        'riwayat_sakit' => $h->riwayat_sakit,
                        'catatan_kesehatan' => $h->catatan_kesehatan,
                        'tanggal' => $h->updated_at?->timezone('Asia/Jakarta')->format('d/m/Y') ?? '-',
                    ];
                })->values()->all(),
            ];
        });

        $totalSantri = $students->count();
        $santriSehat = $students->filter(fn ($s) => $s['sudah_diperiksa'] && $s['total_sakit'] === 0)->count();
        $perluPerhatian = $students->filter(fn ($s) => $s['total_sakit'] > 0)->count();
        $belumDiperiksa = $students->filter(fn ($s) => ! $s['sudah_diperiksa'])->count();

        $stats = [
            'total_santri' => $totalSantri,
            'santri_sehat' => $santriSehat,
            'perlu_perhatian' => $perluPerhatian,
            'belum_diperiksa' => $belumDiperiksa,
        ];

        return Inertia::render('Kesehatan/RekamMedis', [
            'students' => $students,
            'filters' => [
                'tahun_akademik' => $selectedTahun,
                'kelas' => $selectedKelas,
                'search' => $search,
                'semester' => $semester,
            ],
            'options' => [
                'tahun_akademik' => $tahunOptions,
                'kelas' => $kelasOptions,
            ],
            'stats' => $stats,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gelara_id' => 'required|exists:gelaras,id',
            'tahun_akademik' => 'required|string',
            'semester' => 'required|string',
            'berat_badan' => 'nullable|numeric|min:10|max:200',
            'tinggi_badan' => 'nullable|numeric|min:50|max:250',
            'imt' => 'nullable|numeric',
            'imt_kategori' => 'nullable|string',
            'tensi' => 'nullable|string',
            'tensi_kategori' => 'nullable|string',
            'riwayat_sakit' => 'nullable|array',
            'catatan_kesehatan' => 'nullable|string',
        ]);

        // Auto hitung IMT jika belum ada dan TB/BB valid
        if ((empty($validated['imt']) || $validated['imt'] == 0) && ! empty($validated['berat_badan']) && ! empty($validated['tinggi_badan'])) {
            $tbM = $validated['tinggi_badan'] / 100;
            $imt = round($validated['berat_badan'] / ($tbM * $tbM), 2);
            $validated['imt'] = $imt;
            if ($imt < 18.5) {
                $validated['imt_kategori'] = 'Kurus';
            } elseif ($imt <= 24.9) {
                $validated['imt_kategori'] = 'Ideal';
            } elseif ($imt <= 29.9) {
                $validated['imt_kategori'] = 'Gemuk';
            } else {
                $validated['imt_kategori'] = 'Obesitas';
            }
        }

        $user = $request->user();
        $validated['lembaga'] = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        Kesehatan::updateOrCreate(
            [
                'gelara_id' => $validated['gelara_id'],
                'tahun_akademik' => $validated['tahun_akademik'],
                'semester' => $validated['semester'],
            ],
            $validated
        );

        return back()->with('success', 'Data pemeriksaan kesehatan berhasil disimpan.');
    }
}
