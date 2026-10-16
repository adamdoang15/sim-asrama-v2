<?php

namespace App\Http\Controllers;

use App\Models\AnggaranBop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KeuanganController extends Controller
{
    /**
     * Halaman Modul Anggaran BOP (Plan & Aktual fkdb/OT, Rekap BOP, Sisa BOP).
     */
    public function bop(Request $request): Response
    {
        $tahunAjaran = $request->input('tahun_ajaran', '2026/2027');
        $bulan = $request->input('bulan', 'Juli');
        $activeTab = $request->input('tab', 'fkdb');

        $bulanList = [
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        ];

        // Ambil semua data Anggaran BOP untuk Tahun Ajaran terpilih
        $allBop = AnggaranBop::where('tahun_ajaran', $tahunAjaran)->get();

        // Data spesifik bulan aktif
        $bulanBop = $allBop->where('bulan', $bulan);
        $fkdbItems = $bulanBop->where('sumber_dana', 'fkdb')->values();
        $otItems = $bulanBop->where('sumber_dana', 'ot')->values();

        // 1. Hitung Ringkasan Bulan Aktif
        $summaryBulan = [
            'fkdb' => [
                'plan_pemasukan' => (float) $fkdbItems->where('tipe', 'pemasukan')->sum('plan'),
                'aktual_pemasukan' => (float) $fkdbItems->where('tipe', 'pemasukan')->sum('aktual'),
                'plan_pengeluaran' => (float) $fkdbItems->where('tipe', 'pengeluaran')->sum('plan'),
                'aktual_pengeluaran' => (float) $fkdbItems->where('tipe', 'pengeluaran')->sum('aktual'),
                'selisih_pengeluaran' => (float) ($fkdbItems->where('tipe', 'pengeluaran')->sum('plan') - $fkdbItems->where('tipe', 'pengeluaran')->sum('aktual')),
            ],
            'ot' => [
                'plan_pemasukan' => (float) $otItems->where('tipe', 'pemasukan')->sum('plan'),
                'aktual_pemasukan' => (float) $otItems->where('tipe', 'pemasukan')->sum('aktual'),
                'plan_pengeluaran' => (float) $otItems->where('tipe', 'pengeluaran')->sum('plan'),
                'aktual_pengeluaran' => (float) $otItems->where('tipe', 'pengeluaran')->sum('aktual'),
                'selisih_pengeluaran' => (float) ($otItems->where('tipe', 'pengeluaran')->sum('plan') - $otItems->where('tipe', 'pengeluaran')->sum('aktual')),
            ],
        ];

        // 2. Data Rekap BOP (12 Bulan)
        $rekapBop = [];
        foreach ($bulanList as $b) {
            $mItems = $allBop->where('bulan', $b);

            $fkdbIn = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pemasukan')->sum('aktual');
            $fkdbOut = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pengeluaran')->sum('aktual');
            $fkdbPlanIn = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pemasukan')->sum('plan');
            $fkdbPlanOut = (float) $mItems->where('sumber_dana', 'fkdb')->where('tipe', 'pengeluaran')->sum('plan');

            $otIn = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pemasukan')->sum('aktual');
            $otOut = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pengeluaran')->sum('aktual');
            $otPlanIn = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pemasukan')->sum('plan');
            $otPlanOut = (float) $mItems->where('sumber_dana', 'ot')->where('tipe', 'pengeluaran')->sum('plan');

            $rekapBop[$b] = [
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

        // 3. Data Sisa BOP (Akumulasi Saldo Mandiri 12 Bulan)
        $sisaBop = [];
        $runningSaldoMandiri = 0;
        foreach ($bulanList as $b) {
            $saldoBulan = $rekapBop[$b]['mandiri']['saldo'];
            $debit = $saldoBulan > 0 ? $saldoBulan : 0;
            $kredit = $saldoBulan < 0 ? abs($saldoBulan) : 0;
            $runningSaldoMandiri += $saldoBulan;

            $sisaBop[] = [
                'bulan' => $b,
                'uraian' => 'Saldo BOP OT Mandiri '.$b,
                'debit' => $debit,
                'kredit' => $kredit,
                'saldo_bulan' => $saldoBulan,
                'saldo_kumulatif' => $runningSaldoMandiri,
            ];
        }

        return Inertia::render('Keuangan/Bop', [
            'tahunAjaran' => $tahunAjaran,
            'tahunOptions' => ['2025/2026', '2026/2027', '2027/2028'],
            'bulan' => $bulan,
            'bulanList' => $bulanList,
            'activeTab' => $activeTab,
            'fkdbItems' => $fkdbItems,
            'otItems' => $otItems,
            'summaryBulan' => $summaryBulan,
            'rekapBop' => $rekapBop,
            'sisaBop' => $sisaBop,
        ]);
    }

    /**
     * Simpan / perbarui item Anggaran BOP.
     */
    public function storeBop(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'integer'],
            'tahun_ajaran' => ['required', 'string'],
            'bulan' => ['required', 'string'],
            'sumber_dana' => ['required', 'in:fkdb,ot'],
            'tipe' => ['required', 'in:pengeluaran,pemasukan'],
            'kategori' => ['required', 'string', 'max:100'],
            'uraian' => ['required', 'string', 'max:255'],
            'plan' => ['required', 'numeric', 'min:0'],
            'aktual' => ['required', 'numeric', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        $validated['lembaga'] = $request->user()?->lembaga ?? 'LKP Doa Bangsa Cicantayan';

        if (! empty($validated['id'])) {
            $item = AnggaranBop::findOrFail($validated['id']);
            $item->update($validated);
        } else {
            AnggaranBop::create($validated);
        }

        return redirect()->back()->with('success', 'Data anggaran BOP berhasil disimpan.');
    }

    /**
     * Hapus item Anggaran BOP.
     */
    public function destroyBop(AnggaranBop $bop): RedirectResponse
    {
        $bop->delete();

        return redirect()->back()->with('success', 'Item anggaran BOP berhasil dihapus.');
    }

    /**
     * Muat Template Item Standar untuk bulan dan sumber dana terpilih.
     */
    public function seedTemplateBop(Request $request): RedirectResponse
    {
        $tahunAjaran = $request->input('tahun_ajaran', '2026/2027');
        $bulan = $request->input('bulan', 'Juli');
        $sumberDana = $request->input('sumber_dana', 'fkdb');
        $lembaga = $request->user()?->lembaga ?? 'LKP Doa Bangsa Cicantayan';

        $templates = [];
        if ($sumberDana === 'fkdb') {
            $templates = [
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
        } else {
            $templates = [
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
        }

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
            }
        }

        return redirect()->back()->with('success', 'Template pos standar berhasil dimuat.');
    }
}
