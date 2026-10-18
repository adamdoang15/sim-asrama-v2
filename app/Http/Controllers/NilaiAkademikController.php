<?php

namespace App\Http\Controllers;

use App\Domain\AcademicEvaluation;
use App\Models\Gelara;
use App\Models\KelasMapel;
use App\Models\NilaiAkademik;
use App\Models\Pegawai;
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
        $mapelOptions = $kelasMapel->mapels ?? [
            'Bahasa Arab',
            'Pendidikan Agama Islam',
            'Matematika',
            'Literasi',
            'Numerasi',
        ];
        $kkm = (float) ($kelasMapel->kkm ?? 75.0);

        $selectedMapel = $request->input('mata_pelajaran');
        if (! in_array($selectedMapel, $mapelOptions, true)) {
            $selectedMapel = $mapelOptions[0] ?? '';
        }

        $search = $request->input('search', '');
        $user = $request->user();

        // Query directly from App\Models\Gelara
        $gelaraQuery = Gelara::forUser($user);
        $allGelarasQuery = Gelara::forUser($user);

        // Hubungkan filter kelas dengan tabel gelaras
        $gelaraQuery->where('kelas', $selectedKelas);

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

        $students = AcademicEvaluation::mapStudentsWithGrades($gelaras, $savedGrades);
        $distributionSummary = AcademicEvaluation::calculateDistribution($students);
        $ledgerStudents = AcademicEvaluation::compileLedger($gelaras, $selectedTahun, $selectedKelas, $mapelOptions, $kkm);

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
        $nilaiAkhir = AcademicEvaluation::calculateNilaiAkhir($h1, $h2, $h3, $h4, $h5, $uts, $uas);
        $predikat = AcademicEvaluation::calculatePredikat($nilaiAkhir);
        $lembaga = NilaiAkademik::resolveLembagaForUser($request->user(), $request->input('lembaga'));

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

        $lembaga = NilaiAkademik::resolveLembagaForUser($request->user(), $request->input('lembaga'));

        foreach ($data['scores'] as $item) {
            $h1 = (float) ($item['h1'] ?? 0);
            $h2 = (float) ($item['h2'] ?? 0);
            $h3 = (float) ($item['h3'] ?? 0);
            $h4 = (float) ($item['h4'] ?? 0);
            $h5 = (float) ($item['h5'] ?? 0);
            $uts = (float) ($item['uts'] ?? 0);
            $uas = (float) ($item['uas'] ?? 0);
            $nAkhir = AcademicEvaluation::calculateNilaiAkhir($h1, $h2, $h3, $h4, $h5, $uts, $uas);

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
                    'predikat' => AcademicEvaluation::calculatePredikat($nAkhir),
                    'deskripsi' => $existing->deskripsi ?? 'Penilaian kelas terpadu.',
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

        $kkmValue = (float) $validated['kkm'];
        $query = KelasMapel::forUser($request->user());
        $count = $query->update(['kkm' => $kkmValue]);

        if ($count === 0) {
            $defaultClasses = ['Kelas 10', 'Kelas 11', 'Kelas 12'];
            $lembaga = KelasMapel::resolveLembagaForUser($request->user());
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

        $validated['lembaga'] = RaporPelengkap::resolveLembagaForUser($request->user(), $request->input('lembaga'));

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
}
