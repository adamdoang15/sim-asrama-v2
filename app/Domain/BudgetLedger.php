<?php

namespace App\Domain;

use App\Models\AnggaranBop;
use Illuminate\Support\Collection;

class BudgetLedger
{
    /**
     * Siklus 12 bulan tahun ajaran operasional asrama (Juli - Juni).
     */
    public const ACADEMIC_MONTHS = [
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    ];

    /**
     * Pos anggaran standar untuk sumber dana BOP FKDB.
     */
    public const FKDB_TEMPLATES = [
        ['tipe' => 'pemasukan', 'kategori' => 'Pemasukan', 'uraian' => 'Pagu Alokasi BOP FKDB Bulanan'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Masuk Gelara Baru', 'uraian' => 'Fasilitas Kamar (Kasur, Lemari, Seprai)'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Masuk Gelara Baru', 'uraian' => 'Atribut Gelara (Batik, PDH, Polo, Jahit)'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Konsumsi Gelara Asrama'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Uang Saku Gelara'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Transportasi Gelara'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Kesehatan Gelara'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Laundry Gelara'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'SPP Sekolah DB'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Bimbel Kelas X, XI & XII'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Kursus Bahasa Inggris'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Kegiatan Keasramaan & Event'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Lembaga', 'uraian' => 'Konsumsi Petugas Asrama'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Lembaga', 'uraian' => 'Insentif & Honor Petugas'],
    ];

    /**
     * Pos anggaran standar untuk sumber dana Operasional Tetap (OT) Mandiri.
     */
    public const OT_TEMPLATES = [
        ['tipe' => 'pemasukan', 'kategori' => 'Pemasukan', 'uraian' => 'Penerimaan Kas Mandiri / Operasional Tetap'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Konsumsi Tambahan Mandiri'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Uang Saku Mandiri'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Transportasi Mandiri'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Biaya Kesehatan Tambahan'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Laundry Mandiri'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Administrasi & Ujian Pembelajaran Asrama'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Gelara', 'uraian' => 'Kursus B. Inggris & Aplikasi Belajar'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Lembaga', 'uraian' => 'Listrik, Air & Utilitas Asrama'],
        ['tipe' => 'pengeluaran', 'kategori' => 'Biaya Operasional Lembaga', 'uraian' => 'Honorarium Tambahan Petugas'],
    ];

    /**
     * Hitung ringkasan rencana, aktual, dan selisih pengeluaran untuk bulan aktif.
     *
     * @param  Collection<int, mixed>  $fkdbItems
     * @param  Collection<int, mixed>  $otItems
     * @return array{fkdb: array<string, float>, ot: array<string, float>}
     */
    public static function summarizeMonthly(Collection $fkdbItems, Collection $otItems): array
    {
        return [
            'fkdb' => self::calculateSourceSummary($fkdbItems),
            'ot' => self::calculateSourceSummary($otItems),
        ];
    }

    /**
     * Hitung ringkasan agregasi untuk satu sumber dana.
     *
     * @param  Collection<int, mixed>  $items
     * @return array{plan_pemasukan: float, aktual_pemasukan: float, plan_pengeluaran: float, aktual_pengeluaran: float, selisih_pengeluaran: float}
     */
    public static function calculateSourceSummary(Collection $items): array
    {
        $planPemasukan = (float) $items->where('tipe', 'pemasukan')->sum('plan');
        $aktualPemasukan = (float) $items->where('tipe', 'pemasukan')->sum('aktual');
        $planPengeluaran = (float) $items->where('tipe', 'pengeluaran')->sum('plan');
        $aktualPengeluaran = (float) $items->where('tipe', 'pengeluaran')->sum('aktual');

        return [
            'plan_pemasukan' => $planPemasukan,
            'aktual_pemasukan' => $aktualPemasukan,
            'plan_pengeluaran' => $planPengeluaran,
            'aktual_pengeluaran' => $aktualPengeluaran,
            'selisih_pengeluaran' => (float) ($planPengeluaran - $aktualPengeluaran),
        ];
    }

    /**
     * Kompilasi matriks rekapitulasi BOP tahunan (12 bulan) per sumber dana.
     *
     * @param  Collection<int, mixed>  $allYearItems
     * @param  array<int, string>|null  $months
     * @return array<string, array{fkdb: array<string, float>, mandiri: array<string, float>}>
     */
    public static function compileAnnualSchedule(Collection $allYearItems, ?array $months = null): array
    {
        $months = $months ?? self::ACADEMIC_MONTHS;
        $rekapBop = [];

        foreach ($months as $bulan) {
            $mItems = $allYearItems->where('bulan', $bulan);

            $fkdbIn = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pemasukan')->sum('aktual');
            $fkdbOut = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pengeluaran')->sum('aktual');
            $fkdbPlanIn = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pemasukan')->sum('plan');
            $fkdbPlanOut = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pengeluaran')->sum('plan');

            $otIn = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pemasukan')->sum('aktual');
            $otOut = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pengeluaran')->sum('aktual');
            $otPlanIn = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pemasukan')->sum('plan');
            $otPlanOut = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pengeluaran')->sum('plan');

            $rekapBop[$bulan] = [
                'fkdb' => [
                    'plan_pemasukan' => $fkdbPlanIn,
                    'pemasukan' => $fkdbIn,
                    'plan_pengeluaran' => $fkdbPlanOut,
                    'pengeluaran' => $fkdbOut,
                    'saldo' => $fkdbIn - $fkdbOut,
                ],
                'mandiri' => [
                    'plan_pemasukan' => $otPlanIn,
                    'pemasukan' => $otIn,
                    'plan_pengeluaran' => $otPlanOut,
                    'pengeluaran' => $otOut,
                    'saldo' => $otIn - $otOut,
                ],
            ];
        }

        return $rekapBop;
    }

    /**
     * Hitung akumulasi saldo berjalan mandiri tahunan (debit/kredit & saldo kumulatif).
     *
     * @param  array<string, array{mandiri: array{saldo: float}}>  $rekapBop
     * @param  array<int, string>|null  $months
     * @return array<int, array{bulan: string, uraian: string, debit: float, kredit: float, saldo_bulan: float, saldo_kumulatif: float}>
     */
    public static function calculateCumulativeBalance(array $rekapBop, ?array $months = null): array
    {
        $months = $months ?? self::ACADEMIC_MONTHS;
        $sisaBop = [];
        $runningSaldoMandiri = 0.0;

        foreach ($months as $bulan) {
            $saldoBulan = (float) ($rekapBop[$bulan]['mandiri']['saldo'] ?? 0.0);
            $debit = $saldoBulan > 0 ? $saldoBulan : 0.0;
            $kredit = $saldoBulan < 0 ? abs($saldoBulan) : 0.0;
            $runningSaldoMandiri += $saldoBulan;

            $sisaBop[] = [
                'bulan' => $bulan,
                'uraian' => 'Saldo BOP OT Mandiri '.$bulan,
                'debit' => $debit,
                'kredit' => $kredit,
                'saldo_bulan' => $saldoBulan,
                'saldo_kumulatif' => $runningSaldoMandiri,
            ];
        }

        return $sisaBop;
    }

    /**
     * Ambil katalog daftar pos baku berdasarkan sumber dana.
     *
     * @return array<int, array{tipe: string, kategori: string, uraian: string}>
     */
    public static function getTemplateCatalog(string $sumberDana): array
    {
        return $sumberDana === 'fkdb' ? self::FKDB_TEMPLATES : self::OT_TEMPLATES;
    }

    /**
     * Semai pos template standar secara idempoten untuk tahun ajaran, bulan, dan sumber dana terpilih.
     */
    public static function seedDefaultTemplate(
        string $tahunAjaran,
        string $bulan,
        string $sumberDana,
        string $lembaga
    ): int {
        $templates = self::getTemplateCatalog($sumberDana);
        $inserted = 0;

        foreach ($templates as $tpl) {
            $exists = AnggaranBop::where('tahun_ajaran', $tahunAjaran)
                ->where('bulan', $bulan)
                ->where('sumber_dana', $sumberDana)
                ->where('uraian', $tpl['uraian'])
                ->exists();

            if (! $exists) {
                AnggaranBop::create([
                    'tahun_ajaran' => $tahunAjaran,
                    'bulan' => $bulan,
                    'sumber_dana' => $sumberDana,
                    'tipe' => $tpl['tipe'],
                    'kategori' => $tpl['kategori'],
                    'uraian' => $tpl['uraian'],
                    'plan' => 0,
                    'aktual' => 0,
                    'keterangan' => 'Template standar',
                    'lembaga' => $lembaga,
                ]);
                $inserted++;
            }
        }

        return $inserted;
    }
}
