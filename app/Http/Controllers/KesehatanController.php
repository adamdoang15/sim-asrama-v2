<?php

namespace App\Http\Controllers;

use App\Domain\HealthBiometrics;
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
        $gelaras = Gelara::forUser($user)->where('kelas', $selectedKelas)->orderBy('name', 'asc')->get();

        $kesehatans = Kesehatan::where('tahun_akademik', $selectedTahun)
            ->where('semester', $semester)
            ->whereIn('gelara_id', $gelaras->pluck('id'))
            ->get()
            ->keyBy('gelara_id');

        $students = HealthBiometrics::mapStudentsForExamination($gelaras, $kesehatans);

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
        $gelaraQuery = Gelara::forUser($user);
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

        $students = HealthBiometrics::mapStudentsForMedicalRecord($gelaras, $kesehatans, $allHistories);
        $stats = HealthBiometrics::aggregateCohortStats($students);

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

        if ($request->filled('lembaga')) {
            $validated['lembaga'] = $request->input('lembaga');
        }

        HealthBiometrics::recordExamination($validated);

        return back()->with('success', 'Data pemeriksaan kesehatan berhasil disimpan.');
    }
}
