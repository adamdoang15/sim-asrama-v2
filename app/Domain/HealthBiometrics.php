<?php

namespace App\Domain;

use App\Models\Gelara;
use App\Models\Kesehatan;
use Illuminate\Support\Collection;

class HealthBiometrics
{
    public const IMT_KURUS = 'Kurus';

    public const IMT_IDEAL = 'Ideal';

    public const IMT_GEMUK = 'Gemuk';

    public const IMT_OBESITAS = 'Obesitas';

    /**
     * Hitung nilai Indeks Massa Tubuh (IMT / BMI).
     */
    public static function calculateImt(?float $weightKg, ?float $heightCm): ?float
    {
        if (empty($weightKg) || empty($heightCm) || $heightCm <= 0) {
            return null;
        }

        $tbM = $heightCm / 100;

        return round($weightKg / ($tbM * $tbM), 2);
    }

    /**
     * Tentukan kategori IMT berdasarkan batas standar Kemenkes/WHO.
     */
    public static function classifyImt(?float $imt): ?string
    {
        if ($imt === null || $imt <= 0) {
            return null;
        }

        if ($imt < 18.5) {
            return self::IMT_KURUS;
        }

        if ($imt <= 24.9) {
            return self::IMT_IDEAL;
        }

        if ($imt <= 29.9) {
            return self::IMT_GEMUK;
        }

        return self::IMT_OBESITAS;
    }

    /**
     * Hitung total keparahan sakit santri dari riwayat sakit.
     *
     * @param  array<string, array{jumlah?: int|string, keterangan?: string}>|null  $riwayatSakit
     * @return array{ringan: int, sedang: int, berat: int, total: int, formatted: array<string, array{jumlah: int, keterangan: string}>}
     */
    public static function parseSicknessHistory(?array $riwayatSakit): array
    {
        $ringan = (int) ($riwayatSakit['ringan']['jumlah'] ?? 0);
        $sedang = (int) ($riwayatSakit['sedang']['jumlah'] ?? 0);
        $berat = (int) ($riwayatSakit['berat']['jumlah'] ?? 0);

        return [
            'ringan' => $ringan,
            'sedang' => $sedang,
            'berat' => $berat,
            'total' => $ringan + $sedang + $berat,
            'formatted' => [
                'ringan' => [
                    'jumlah' => $ringan,
                    'keterangan' => (string) ($riwayatSakit['ringan']['keterangan'] ?? ''),
                ],
                'sedang' => [
                    'jumlah' => $sedang,
                    'keterangan' => (string) ($riwayatSakit['sedang']['keterangan'] ?? ''),
                ],
                'berat' => [
                    'jumlah' => $berat,
                    'keterangan' => (string) ($riwayatSakit['berat']['keterangan'] ?? ''),
                ],
            ],
        ];
    }

    /**
     * Format struktur data pemeriksaan kesehatan untuk tampilan frontend pemeriksaan.
     *
     * @param  Collection<int, Gelara>  $gelaras
     * @param  Collection<int, Kesehatan>  $kesehatans
     * @return array<int, array<string, mixed>>
     */
    public static function mapStudentsForExamination(Collection $gelaras, Collection $kesehatans): array
    {
        return $gelaras->map(function ($g) use ($kesehatans) {
            $k = $kesehatans->get($g->id);
            $parsedSakit = self::parseSicknessHistory($k?->riwayat_sakit);

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
                    'riwayat_sakit' => $parsedSakit['formatted'],
                    'catatan_kesehatan' => $k->catatan_kesehatan,
                ] : null,
            ];
        })->values()->all();
    }

    /**
     * Format struktur data rekam medis terpadu dan riwayat klinis santri.
     *
     * @param  Collection<int, Gelara>  $gelaras
     * @param  Collection<(int|string), mixed>  $kesehatans
     * @param  Collection<(int|string), mixed>  $allHistories
     * @return array<int, array<string, mixed>>
     */
    public static function mapStudentsForMedicalRecord(
        Collection $gelaras,
        Collection $kesehatans,
        Collection $allHistories
    ): array {
        return $gelaras->map(function ($g) use ($kesehatans, $allHistories) {
            $k = $kesehatans->get($g->id);
            $historyList = $allHistories->get($g->id, collect());
            $parsedSakit = self::parseSicknessHistory($k?->riwayat_sakit);

            $sudahDiperiksa = $k !== null && ($k->berat_badan !== null || $k->tensi !== null);

            return [
                'id' => $g->id,
                'name' => $g->name,
                'nig' => $g->nig,
                'kelas' => $g->kelas,
                'sudah_diperiksa' => $sudahDiperiksa,
                'total_sakit' => $parsedSakit['total'],
                'kesehatan' => $k ? [
                    'id' => $k->id,
                    'berat_badan' => $k->berat_badan,
                    'tinggi_badan' => $k->tinggi_badan,
                    'imt' => $k->imt,
                    'imt_kategori' => $k->imt_kategori,
                    'tensi' => $k->tensi,
                    'tensi_kategori' => $k->tensi_kategori,
                    'riwayat_sakit' => $parsedSakit['formatted'],
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
        })->values()->all();
    }

    /**
     * Hitung ringkasan statistik kohort kesehatan asrama (sehat, perlu perhatian, belum diperiksa).
     *
     * @param  array<int, mixed>|Collection<int, mixed>  $students
     * @return array{total_santri: int, santri_sehat: int, perlu_perhatian: int, belum_diperiksa: int}
     */
    public static function aggregateCohortStats(array|Collection $students): array
    {
        $collection = collect($students);

        $totalSantri = $collection->count();
        $santriSehat = $collection->filter(fn ($s) => ! empty($s['sudah_diperiksa']) && ($s['total_sakit'] ?? 0) === 0)->count();
        $perluPerhatian = $collection->filter(fn ($s) => ($s['total_sakit'] ?? 0) > 0)->count();
        $belumDiperiksa = $collection->filter(fn ($s) => empty($s['sudah_diperiksa']))->count();

        return [
            'total_santri' => $totalSantri,
            'santri_sehat' => $santriSehat,
            'perlu_perhatian' => $perluPerhatian,
            'belum_diperiksa' => $belumDiperiksa,
        ];
    }

    /**
     * Simpan hasil pemeriksaan kesehatan santri dengan auto-enrichment IMT dan kategori.
     *
     * @param  array<string, mixed>  $validated
     */
    public static function recordExamination(array $validated): Kesehatan
    {
        if ((empty($validated['imt']) || $validated['imt'] == 0)
            && ! empty($validated['berat_badan'])
            && ! empty($validated['tinggi_badan'])
        ) {
            $imt = self::calculateImt((float) $validated['berat_badan'], (float) $validated['tinggi_badan']);
            $validated['imt'] = $imt;
            $validated['imt_kategori'] = self::classifyImt($imt);
        }

        return Kesehatan::updateOrCreate(
            [
                'gelara_id' => $validated['gelara_id'],
                'tahun_akademik' => $validated['tahun_akademik'],
                'semester' => $validated['semester'],
            ],
            $validated
        );
    }
}
