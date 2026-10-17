<?php

namespace App\Http\Controllers;

use App\Models\Gelara;
use App\Models\KelasMapel;
use App\Models\Kesehatan;
use App\Models\NilaiAkademik;
use App\Models\Pegawai;
use App\Models\Prestasi;
use App\Models\RaporPelengkap;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NilaiAkademikController extends Controller
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
        $selectedTahun = $request->input('tahun_akademik');
        if (! in_array($selectedTahun, $tahunOptions, true)) {
            $selectedTahun = $tahunOptions[0];
        }

        $selectedKelas = $request->input('kelas');
        if (! in_array($selectedKelas, $kelasOptions, true)) {
            $selectedKelas = $kelasOptions[0];
        }

        $kelasMapel = KelasMapel::where('kelas', $selectedKelas)->first();
        $mapelOptions = $kelasMapel?->mapels ?? [
            'Bahasa Arab',
            'Pendidikan Agama Islam',
            'Matematika',
            'Literasi',
            'Numerasi',
        ];
        $kkm = (float) ($kelasMapel?->kkm ?? 75.0);

        $selectedMapel = $request->input('mata_pelajaran');
        if (! in_array($selectedMapel, $mapelOptions, true)) {
            $selectedMapel = $mapelOptions[0] ?? '';
        }

        $search = $request->input('search', '');

        $user = $request->user();

        // Query directly from App\Models\Gelara
        $gelaraQuery = Gelara::query();
        $allGelarasQuery = Gelara::query();

        if ($user && $user->lembaga !== 'Yayasan') {
            $gelaraQuery->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
            $allGelarasQuery->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        // Hubungkan filter kelas dengan tabel gelaras
        if (! empty($selectedKelas)) {
            $gelaraQuery->where('kelas', $selectedKelas);
        }

        if (! empty($search)) {
            $gelaraQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nig', 'like', "%{$search}%");
            });
        }

        $allGelaras = $allGelarasQuery->orderBy('name', 'asc')->get(['id', 'name', 'nig', 'kelas']);
        $gelaras = $gelaraQuery->orderBy('name', 'asc')->get();

        // Get saved grades for the selected academic context
        $savedGrades = NilaiAkademik::where('tahun_akademik', $selectedTahun)
            ->where('kelas', $selectedKelas)
            ->where('mata_pelajaran', $selectedMapel)
            ->get()
            ->keyBy('gelara_id');

        $sampleGrade = $savedGrades->first(fn ($g) => ! empty($g->deskripsi));
        $subjectKds = [];
        if ($sampleGrade && $sampleGrade->deskripsi) {
            $decoded = json_decode($sampleGrade->deskripsi, true);
            $subjectKds = is_array($decoded) ? $decoded : [$sampleGrade->deskripsi];
        }

        $students = $gelaras->map(function (Gelara $gelara) use ($savedGrades) {
            $grade = $savedGrades->get($gelara->id);

            $h1 = $grade ? (float) $grade->h1 : 0.0;
            $h2 = $grade ? (float) $grade->h2 : 0.0;
            $h3 = $grade ? (float) $grade->h3 : 0.0;
            $h4 = $grade ? (float) $grade->h4 : 0.0;
            $h5 = $grade ? (float) $grade->h5 : 0.0;
            $uts = $grade ? (float) $grade->uts : 0.0;
            $uas = $grade ? (float) $grade->uas : 0.0;
            $nilaiAkhir = $grade ? $this->calculateNilaiAkhir($h1, $h2, $h3, $h4, $h5, $uts, $uas) : 0.0;
            $predikat = ($grade && $nilaiAkhir > 0) ? $this->calculatePredikat($nilaiAkhir) : '-';
            $deskripsi = $grade ? $grade->deskripsi : '';

            return [
                'id' => $gelara->id,
                'name' => $gelara->name,
                'nig' => $gelara->nig,
                'kelas' => $gelara->kelas,
                'h1' => $h1,
                'h2' => $h2,
                'h3' => $h3,
                'h4' => $h4,
                'h5' => $h5,
                'uts' => $uts,
                'uas' => $uas,
                'nilai_akhir' => $nilaiAkhir,
                'mutu' => $nilaiAkhir,
                'predikat' => $predikat,
                'deskripsi' => $deskripsi,
            ];
        });

        // Compute live distribution based on mapped students
        $totalMapped = max($students->count(), 1);
        $countA = $students->filter(fn ($s) => in_array($s['predikat'], ['A', 'A-']))->count();
        $countB = $students->filter(fn ($s) => in_array($s['predikat'], ['B', 'B+']))->count();
        $countC = $students->filter(fn ($s) => $s['predikat'] === 'C')->count();
        $countD = $students->filter(fn ($s) => in_array($s['predikat'], ['D', 'E', '-']))->count();

        $distributionSummary = [
            [
                'grade' => 'A',
                'range' => '85 - 100',
                'count' => $countA,
                'percentage' => round(($countA / $totalMapped) * 100, 1),
                'color' => '#1d4ed8',
                'barColor' => 'bg-blue-600',
            ],
            [
                'grade' => 'B',
                'range' => '75 - 84',
                'count' => $countB,
                'percentage' => round(($countB / $totalMapped) * 100, 1),
                'color' => '#0f766e',
                'barColor' => 'bg-teal-700',
            ],
            [
                'grade' => 'C',
                'range' => '65 - 74',
                'count' => $countC,
                'percentage' => round(($countC / $totalMapped) * 100, 1),
                'color' => '#d97706',
                'barColor' => 'bg-amber-500',
            ],
            [
                'grade' => 'D',
                'range' => '< 65',
                'count' => $countD,
                'percentage' => round(($countD / $totalMapped) * 100, 1),
                'color' => '#ef4444',
                'barColor' => 'bg-red-400',
            ],
        ];

        // Ambil seluruh nilai pada kelas & tahun aktif untuk cetak rapor & ledger
        $classGrades = NilaiAkademik::where('tahun_akademik', $selectedTahun)
            ->where('kelas', $selectedKelas)
            ->get()
            ->groupBy('gelara_id');

        $gelaraIds = $gelaras->pluck('id');

        $pelengkaps = RaporPelengkap::where('tahun_akademik', $selectedTahun)
            ->where('kelas', $selectedKelas)
            ->whereIn('gelara_id', $gelaraIds)
            ->get()
            ->keyBy('gelara_id');

        $semester = str_contains($selectedTahun, 'Genap') ? '2' : '1';
        $kesehatans = Kesehatan::where('tahun_akademik', $selectedTahun)
            ->where('semester', $semester)
            ->whereIn('gelara_id', $gelaraIds)
            ->get()
            ->keyBy('gelara_id');

        $gelaraNigs = $gelaras->pluck('nig')->filter()->all();
        $gelaraNames = $gelaras->pluck('name')->filter()->all();
        $prestasis = Prestasi::where(function ($query) use ($gelaraNigs, $gelaraNames) {
            $query->whereIn('nim', $gelaraNigs)
                ->orWhereIn('name', $gelaraNames);
        })->get();

        $ledgerStudents = $gelaras->map(function ($gelara) use ($classGrades, $mapelOptions, $pelengkaps, $kesehatans, $prestasis, $kkm) {
            $grades = $classGrades->get($gelara->id, collect());
            $scores = [];
            $total = 0;
            $count = 0;

            foreach ($mapelOptions as $mapel) {
                $g = $grades->firstWhere('mata_pelajaran', $mapel);
                $na = $g ? (float) $g->nilai_akhir : 0;
                if ($na > 0) {
                    $total += $na;
                    $count++;
                }
                $scores[$mapel] = [
                    'nilai_akhir' => $na,
                    'predikat' => ($g && $na > 0) ? $this->calculatePredikat($na) : '-',
                    'kkm' => $kkm,
                    'deskripsi' => $g?->deskripsi ?? 'Memiliki kemampuan dan pemahaman yang baik pada kompetensi materi yang dipelajari.',
                    'keterampilan_nilai' => $na > 0 ? min(100, round($na + 2, 1)) : 0,
                    'keterampilan_predikat' => ($g && $na > 0) ? $this->calculatePredikat(min(100, $na + 2)) : '-',
                    'keterampilan_deskripsi' => $g?->deskripsi ? 'Memiliki keterampilan yang baik dalam mempraktikkan materi pembelajaran.' : 'Cukup terampil dalam mempraktikkan materi pembelajaran.',
                ];
            }

            $avg = $count > 0 ? round($total / $count, 1) : 0;
            $pel = $pelengkaps->get($gelara->id);
            $kes = $kesehatans->get($gelara->id);
            $pres = $prestasis->filter(fn ($p) => ($p->nim && $p->nim === $gelara->nig) || ($p->name && $p->name === $gelara->name));

            return [
                'id' => $gelara->id,
                'name' => $gelara->name,
                'nig' => $gelara->nig,
                'kelas' => $gelara->kelas,
                'ttl' => $gelara->ttl ?? 'Sukabumi, 10 Januari 2008',
                'jenis_kelamin' => $gelara->jenis_kelamin ?? 'LAKI-LAKI',
                'agama' => $gelara->agama ?? 'Islam',
                'domisili' => $gelara->domisili ?? 'Sukabumi, Jawa Barat',
                'nama_ayah' => $gelara->nama_ayah ?? '-',
                'pekerjaan_ayah' => $gelara->pekerjaan_ayah ?? '-',
                'nama_ibu' => $gelara->nama_ibu ?? '-',
                'pekerjaan_ibu' => $gelara->pekerjaan_ibu ?? '-',
                'tahun_diterima' => $gelara->tahun_diterima ?? '2023',
                'foto' => $gelara->foto ? (str_starts_with($gelara->foto, 'http') ? $gelara->foto : '/storage/'.$gelara->foto) : null,
                'scores' => $scores,
                'total' => $total,
                'avg' => $avg,
                'predikat' => $avg > 0 ? $this->calculatePredikat($avg) : '-',
                'is_complete' => $count === count($mapelOptions),
                'filled_count' => $count,
                'total_count' => count($mapelOptions),
                'pelengkap' => [
                    'sikap_spiritual_predikat' => $pel->sikap_spiritual_predikat ?? 'Sangat Baik',
                    'sikap_spiritual_deskripsi' => $pel->sikap_spiritual_deskripsi ?? 'Selalu melaksanakan shalat 5 waktu tepat waktu dan mengikuti kegiatan ta\'lim dan pembinaan karakter pagi.',
                    'sikap_sosial_predikat' => $pel->sikap_sosial_predikat ?? 'Sangat Baik',
                    'sikap_sosial_deskripsi' => $pel->sikap_sosial_deskripsi ?? 'Selalu menunjukkan sikap menjaga komitmen, bersikap jujur, berlaku amanah, menjunjung tinggi kesusilaan, dan menghargai hak orang lain.',
                    'ekskul' => $pel->ekskul ?? [
                        ['nama' => 'Pramuka / Kepanduan', 'nilai' => 'A', 'keterangan' => 'Sangat aktif dan berdedikasi tinggi'],
                        ['nama' => 'Tahfidz Al-Qur\'an', 'nilai' => 'A', 'keterangan' => 'Fasih bertilawah dan tartil'],
                    ],
                    'absensi_sakit' => $pel->absensi_sakit ?? 0,
                    'absensi_izin' => $pel->absensi_izin ?? 0,
                    'absensi_alpha' => $pel->absensi_alpha ?? 0,
                    'catatan_wali' => $pel->catatan_wali ?? 'Keaktifan dan kedisiplinan belajar sudah sangat baik, pertahankan dan terus menjadi teladan bagi rekan-rekan santri lainnya.',
                ],
                'kesehatan' => $kes ? [
                    'berat_badan' => $kes->berat_badan,
                    'tinggi_badan' => $kes->tinggi_badan,
                    'imt' => $kes->imt,
                    'imt_kategori' => $kes->imt_kategori ?? 'Ideal',
                    'tensi' => $kes->tensi ?? '110/77 mmHg',
                    'tensi_kategori' => $kes->tensi_kategori ?? 'Normal',
                    'riwayat_sakit' => $kes->riwayat_sakit ?? [
                        'ringan' => ['jumlah' => 0, 'keterangan' => '-'],
                        'sedang' => ['jumlah' => 0, 'keterangan' => '-'],
                        'berat' => ['jumlah' => 0, 'keterangan' => '-'],
                    ],
                    'catatan_kesehatan' => $kes->catatan_kesehatan ?? 'Berat badan dan tekanan darah sesuai dengan hasil normal, mohon tetap menjaga pola hidup sehat dan asupan nutrisi bergizi seimbang.',
                ] : [
                    'berat_badan' => 49.3,
                    'tinggi_badan' => 153.0,
                    'imt' => 21.06,
                    'imt_kategori' => 'Ideal',
                    'tensi' => '110/77 mmHg',
                    'tensi_kategori' => 'Normal',
                    'riwayat_sakit' => [
                        'ringan' => ['jumlah' => 1, 'keterangan' => 'Sakit gigi'],
                        'sedang' => ['jumlah' => 0, 'keterangan' => '-'],
                        'berat' => ['jumlah' => 0, 'keterangan' => '-'],
                    ],
                    'catatan_kesehatan' => 'Berat badan dan tekanan darah sesuai dengan hasil normal, mohon tetap menjaga pola hidup sehat dan asupan nutrisi bergizi seimbang.',
                ],
                'prestasis' => $pres->map(fn ($p) => [
                    'nama' => $p->title ?? $p->name ?? 'Prestasi Santri',
                    'keterangan' => $p->level ?? 'Tingkat Lembaga',
                ])->values()->all(),
            ];
        });

        $waliKelas = Pegawai::where('jabatan', 'like', '%Wali '.$selectedKelas.'%')
            ->orWhere('jabatan', 'like', '%Wali Kelas '.$selectedKelas.'%')
            ->first();

        return Inertia::render('Kurikulum/NilaiAkademik', [
            'initialFilters' => [
                'tahun_akademik' => $selectedTahun,
                'kelas' => $selectedKelas,
                'mata_pelajaran' => $selectedMapel,
                'search' => $search,
            ],
            'options' => [
                'tahun_akademik' => $tahunOptions,
                'kelas' => $kelasOptions,
                'mata_pelajaran' => $mapelOptions,
            ],
            'kkm' => $kkm,
            'subjectKds' => array_values(array_filter($subjectKds)),
            'students' => $students,
            'allGelaras' => $allGelaras,
            'totalStudents' => Gelara::count(),
            'gradedCount' => $students->filter(fn ($s) => $s['nilai_akhir'] > 0)->count(),
            'currentPage' => 1,
            'perPage' => 25,
            'distribution' => $distributionSummary,
            'waliKelas' => $waliKelas ? [
                'name' => $waliKelas->name,
                'niy' => $waliKelas->niy,
            ] : null,
            'classLedger' => [
                'mapels' => $mapelOptions,
                'students' => $ledgerStudents,
                'waliKelas' => $waliKelas ? [
                    'name' => $waliKelas->name,
                    'niy' => $waliKelas->niy,
                ] : null,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gelara_id' => 'required|exists:gelaras,id',
            'tahun_akademik' => 'required|string',
            'kelas' => 'required|string',
            'mata_pelajaran' => 'required|string',
            'h1' => 'nullable|numeric|min:0|max:100',
            'h2' => 'nullable|numeric|min:0|max:100',
            'h3' => 'nullable|numeric|min:0|max:100',
            'h4' => 'nullable|numeric|min:0|max:100',
            'h5' => 'nullable|numeric|min:0|max:100',
            'uts' => 'nullable|numeric|min:0|max:100',
            'uas' => 'nullable|numeric|min:0|max:100',
            'deskripsi' => 'nullable|string',
        ]);

        $h1 = (float) ($validated['h1'] ?? 0);
        $h2 = (float) ($validated['h2'] ?? 0);
        $h3 = (float) ($validated['h3'] ?? 0);
        $h4 = (float) ($validated['h4'] ?? 0);
        $h5 = (float) ($validated['h5'] ?? 0);
        $uts = (float) ($validated['uts'] ?? 0);
        $uas = (float) ($validated['uas'] ?? 0);

        // Perhitungan Rerata Harian dinamis (60%), UTS (20%), UAS (20%)
        $nilaiAkhir = $this->calculateNilaiAkhir($h1, $h2, $h3, $h4, $h5, $uts, $uas);
        $predikat = $this->calculatePredikat($nilaiAkhir);

        $user = $request->user();
        $lembaga = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        NilaiAkademik::updateOrCreate(
            [
                'gelara_id' => $validated['gelara_id'],
                'tahun_akademik' => $validated['tahun_akademik'],
                'kelas' => $validated['kelas'],
                'mata_pelajaran' => $validated['mata_pelajaran'],
            ],
            [
                'lembaga' => $lembaga,
                'h1' => $h1,
                'h2' => $h2,
                'h3' => $h3,
                'h4' => $h4,
                'h5' => $h5,
                'uts' => $uts,
                'uas' => $uas,
                'nilai_akhir' => $nilaiAkhir,
                'mutu' => $nilaiAkhir,
                'predikat' => $predikat,
                'deskripsi' => $validated['deskripsi'] ?? 'Tercatat pada penilaian terpadu.',
            ]
        );

        return redirect()->back()->with('success', 'Nilai akademik santri berhasil disimpan.');
    }

    public function storeBatch(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'tahun_akademik' => 'required|string',
            'kelas' => 'required|string',
            'mata_pelajaran' => 'required|string',
            'scores' => 'required|array',
        ]);

        $user = $request->user();
        $lembaga = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        foreach ($data['scores'] as $item) {
            $h1 = (float) ($item['h1'] ?? 0);
            $h2 = (float) ($item['h2'] ?? 0);
            $h3 = (float) ($item['h3'] ?? 0);
            $h4 = (float) ($item['h4'] ?? 0);
            $h5 = (float) ($item['h5'] ?? 0);
            $uts = (float) ($item['uts'] ?? 0);
            $uas = (float) ($item['uas'] ?? 0);
            $nAkhir = $this->calculateNilaiAkhir($h1, $h2, $h3, $h4, $h5, $uts, $uas);

            $existing = NilaiAkademik::where('gelara_id', $item['gelara_id'])
                ->where('tahun_akademik', $data['tahun_akademik'])
                ->where('kelas', $data['kelas'])
                ->where('mata_pelajaran', $data['mata_pelajaran'])
                ->first();

            NilaiAkademik::updateOrCreate(
                [
                    'gelara_id' => $item['gelara_id'],
                    'tahun_akademik' => $data['tahun_akademik'],
                    'kelas' => $data['kelas'],
                    'mata_pelajaran' => $data['mata_pelajaran'],
                ],
                [
                    'lembaga' => $lembaga,
                    'h1' => $item['h1'] ?? 0,
                    'h2' => $item['h2'] ?? 0,
                    'h3' => $item['h3'] ?? 0,
                    'h4' => $item['h4'] ?? 0,
                    'h5' => $item['h5'] ?? 0,
                    'uts' => $uts,
                    'uas' => $uas,
                    'nilai_akhir' => $nAkhir,
                    'mutu' => $nAkhir,
                    'predikat' => $this->calculatePredikat($nAkhir),
                    'deskripsi' => $existing?->deskripsi ?? 'Penilaian kelas terpadu.',
                ]
            );
        }

        return redirect()->back()->with('success', 'Nilai satu kelas berhasil disimpan.');
    }

    public function storeKd(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_akademik' => 'required|string',
            'kelas' => 'required|string',
            'mata_pelajaran' => 'required|string',
            'kds' => 'required|array|max:5',
            'kds.*' => 'nullable|string|max:255',
        ]);

        $filteredKds = array_slice(array_values(array_filter(
            array_map('trim', $validated['kds']),
            fn ($k) => $k !== ''
        )), 0, 5);

        $deskripsiJson = ! empty($filteredKds) ? json_encode($filteredKds, JSON_UNESCAPED_UNICODE) : null;

        $gelaraIds = Gelara::where('kelas', $validated['kelas'])->pluck('id');
        foreach ($gelaraIds as $id) {
            NilaiAkademik::updateOrCreate(
                [
                    'gelara_id' => $id,
                    'tahun_akademik' => $validated['tahun_akademik'],
                    'kelas' => $validated['kelas'],
                    'mata_pelajaran' => $validated['mata_pelajaran'],
                ],
                [
                    'deskripsi' => $deskripsiJson,
                ]
            );
        }

        return redirect()->back()->with('success', 'Kompetensi Dasar (KD) mata pelajaran berhasil disimpan.');
    }

    public function saveMapel(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kelas' => 'required|string',
            'mapels' => 'required|array|min:1',
            'mapels.*' => 'required|string|max:100',
        ]);

        $cleanMapels = array_values(array_unique(array_filter(array_map('trim', $validated['mapels']))));

        $updateData = ['mapels' => $cleanMapels];
        if ($request->has('kkm') && is_numeric($request->input('kkm'))) {
            $updateData['kkm'] = (float) $request->input('kkm');
        }

        KelasMapel::updateOrCreate(
            ['kelas' => $validated['kelas']],
            $updateData
        );

        return redirect()->back()->with('success', 'Mata pelajaran kelas berhasil diperbarui.');
    }

    public function saveKkm(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kelas' => 'nullable|string',
            'kkm' => 'required|numeric|min:0|max:100',
        ]);

        $user = $request->user();
        $lembaga = ($user && $user->lembaga !== 'Yayasan') ? $user->lembaga : null;
        $kkmValue = (float) $validated['kkm'];

        $query = KelasMapel::query();
        if ($lembaga) {
            $query->where(fn ($q) => $q->where('lembaga', $lembaga)->orWhereNull('lembaga'));
        }

        $count = $query->update(['kkm' => $kkmValue]);

        if ($count === 0) {
            $defaultClasses = ['Kelas 10', 'Kelas 11', 'Kelas 12'];
            foreach ($defaultClasses as $cls) {
                KelasMapel::create([
                    'kelas' => $cls,
                    'kkm' => $kkmValue,
                    'lembaga' => $lembaga,
                    'mapels' => [
                        'Bahasa Arab',
                        'Pendidikan Agama Islam',
                        'Matematika',
                        'Literasi',
                        'Numerasi',
                    ],
                ]);
            }
        }

        return redirect()->back()->with('success', 'Standar KKM berhasil diterapkan untuk semua mata pelajaran.');
    }

    public function storePelengkap(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'gelara_id' => 'required|exists:gelaras,id',
            'tahun_akademik' => 'required|string',
            'kelas' => 'required|string',
            'sikap_spiritual_predikat' => 'nullable|string',
            'sikap_spiritual_deskripsi' => 'nullable|string',
            'sikap_sosial_predikat' => 'nullable|string',
            'sikap_sosial_deskripsi' => 'nullable|string',
            'ekskul' => 'nullable|array',
            'absensi_sakit' => 'nullable|integer|min:0',
            'absensi_izin' => 'nullable|integer|min:0',
            'absensi_alpha' => 'nullable|integer|min:0',
            'catatan_wali' => 'nullable|string',
        ]);

        $user = $request->user();
        $validated['lembaga'] = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        RaporPelengkap::updateOrCreate(
            [
                'gelara_id' => $validated['gelara_id'],
                'tahun_akademik' => $validated['tahun_akademik'],
                'kelas' => $validated['kelas'],
            ],
            $validated
        );

        return redirect()->back()->with('success', 'Data pelengkap rapor berhasil disimpan.');
    }

    private function calculatePredikat(float $nilaiAkhir): string
    {
        if ($nilaiAkhir >= 85.0) {
            return 'A';
        }
        if ($nilaiAkhir >= 75.0) {
            return 'B';
        }
        if ($nilaiAkhir >= 65.0) {
            return 'C';
        }

        return 'D';
    }

    private function calculateNilaiAkhir(float $h1, float $h2, float $h3, float $h4, float $h5, float $uts, float $uas): float
    {
        $harianFilled = array_filter([$h1, $h2, $h3, $h4, $h5], fn ($val) => $val > 0);
        $rerataHarian = count($harianFilled) > 0 ? (array_sum($harianFilled) / count($harianFilled)) : 0.0;

        return round(($rerataHarian * 0.6) + ($uts * 0.2) + ($uas * 0.2), 1);
    }
}
