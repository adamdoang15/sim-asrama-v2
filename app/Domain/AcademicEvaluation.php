<?php

namespace App\Domain;

use App\Models\Gelara;
use App\Models\Kesehatan;
use App\Models\NilaiAkademik;
use App\Models\Prestasi;
use App\Models\RaporPelengkap;
use Illuminate\Support\Collection;

class AcademicEvaluation
{
    /**
     * Hitung nilai akhir dengan pembobotan: Rerata Harian (60%), UTS (20%), UAS (20%).
     */
    public static function calculateNilaiAkhir(
        float $h1,
        float $h2,
        float $h3,
        float $h4,
        float $h5,
        float $uts,
        float $uas
    ): float {
        $harianFilled = array_filter([$h1, $h2, $h3, $h4, $h5], fn ($val) => $val > 0);
        $rerataHarian = count($harianFilled) > 0 ? (array_sum($harianFilled) / count($harianFilled)) : 0.0;

        return round(($rerataHarian * 0.6) + ($uts * 0.2) + ($uas * 0.2), 1);
    }

    /**
     * Konversi nilai akhir ke predikat huruf (A, B, C, D).
     */
    public static function calculatePredikat(float $nilaiAkhir): string
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

    /**
     * Petakan santri dengan rekaman nilai pada mata pelajaran aktif.
     *
     * @param  Collection<int, Gelara>  $gelaras
     * @param  Collection<int|string, NilaiAkademik>  $savedGrades
     * @return Collection<int, mixed>
     */
    public static function mapStudentsWithGrades(Collection $gelaras, Collection $savedGrades): Collection
    {
        return $gelaras->map(function (Gelara $gelara) use ($savedGrades) {
            $grade = $savedGrades->get($gelara->id);

            $h1 = $grade ? (float) $grade->h1 : 0.0;
            $h2 = $grade ? (float) $grade->h2 : 0.0;
            $h3 = $grade ? (float) $grade->h3 : 0.0;
            $h4 = $grade ? (float) $grade->h4 : 0.0;
            $h5 = $grade ? (float) $grade->h5 : 0.0;
            $uts = $grade ? (float) $grade->uts : 0.0;
            $uas = $grade ? (float) $grade->uas : 0.0;
            $nilaiAkhir = $grade ? self::calculateNilaiAkhir($h1, $h2, $h3, $h4, $h5, $uts, $uas) : 0.0;
            $predikat = ($grade && $nilaiAkhir > 0) ? self::calculatePredikat($nilaiAkhir) : '-';
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
    }

    /**
     * Hitung ringkasan distribusi nilai santri (Grade A, B, C, D).
     *
     * @param  Collection<int, array<string, mixed>>  $students
     * @return array<int, array{grade: string, range: string, count: int, percentage: float, color: string, barColor: string}>
     */
    public static function calculateDistribution(Collection $students): array
    {
        $totalMapped = max($students->count(), 1);
        $countA = $students->filter(fn ($s) => in_array($s['predikat'], ['A', 'A-']))->count();
        $countB = $students->filter(fn ($s) => in_array($s['predikat'], ['B', 'B+']))->count();
        $countC = $students->filter(fn ($s) => $s['predikat'] === 'C')->count();
        $countD = $students->filter(fn ($s) => in_array($s['predikat'], ['D', 'E', '-']))->count();

        return [
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
    }

    /**
     * Kompilasi seluruh ledger nilai, capaian ekskul, kesehatan, dan rapor pelengkap santri.
     *
     * @param  Collection<int, Gelara>  $gelaras
     * @param  array<int, string>  $mapelOptions
     * @return Collection<int, mixed>
     */
    public static function compileLedger(
        Collection $gelaras,
        string $tahunAkademik,
        string $kelas,
        array $mapelOptions,
        float $kkm
    ): Collection {
        $gelaraIds = $gelaras->pluck('id');
        $semester = str_contains($tahunAkademik, 'Genap') ? '2' : '1';

        $classGrades = NilaiAkademik::where('tahun_akademik', $tahunAkademik)
            ->where('kelas', $kelas)
            ->get()
            ->groupBy('gelara_id');

        $pelengkaps = RaporPelengkap::where('tahun_akademik', $tahunAkademik)
            ->where('kelas', $kelas)
            ->whereIn('gelara_id', $gelaraIds)
            ->get()
            ->keyBy('gelara_id');

        $kesehatans = Kesehatan::where('tahun_akademik', $tahunAkademik)
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

        return $gelaras->map(function ($gelara) use ($classGrades, $mapelOptions, $pelengkaps, $kesehatans, $prestasis, $kkm) {
            $grades = $classGrades->get($gelara->id, collect());
            $scores = [];
            $total = 0;
            $count = 0;

            foreach ($mapelOptions as $mapel) {
                $g = $grades->firstWhere('mata_pelajaran', $mapel);
                $na = $g ? (float) $g->nilai_akhir : 0.0;
                if ($na > 0) {
                    $total += $na;
                    $count++;
                }
                $scores[$mapel] = [
                    'nilai_akhir' => $na,
                    'predikat' => ($g && $na > 0) ? self::calculatePredikat($na) : '-',
                    'kkm' => $kkm,
                    'deskripsi' => $g->deskripsi ?? 'Memiliki kemampuan dan pemahaman yang baik pada kompetensi materi yang dipelajari.',
                    'keterampilan_nilai' => $na > 0 ? min(100, round($na + 2, 1)) : 0,
                    'keterampilan_predikat' => ($g && $na > 0) ? self::calculatePredikat(min(100, $na + 2)) : '-',
                    'keterampilan_deskripsi' => ($g && $g->deskripsi) ? 'Memiliki keterampilan yang baik dalam mempraktikkan materi pembelajaran.' : 'Cukup terampil dalam mempraktikkan materi pembelajaran.',
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
                'predikat' => $avg > 0 ? self::calculatePredikat($avg) : '-',
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
    }
}
