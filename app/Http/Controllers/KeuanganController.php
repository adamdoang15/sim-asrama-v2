<?php

namespace App\Http\Controllers;

use App\Domain\BudgetLedger;
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
        $bulanList = BudgetLedger::ACADEMIC_MONTHS;

        // Ambil semua data Anggaran BOP untuk Tahun Ajaran terpilih
        $allBop = AnggaranBop::forUser($request->user())->where('tahun_ajaran', $tahunAjaran)->get();

        // Data spesifik bulan aktif
        $bulanBop = $allBop->where('bulan', $bulan);
        $fkdbItems = $bulanBop->where('sumber_dana', 'fkdb')->values();
        $otItems = $bulanBop->where('sumber_dana', 'ot')->values();

        // 1. Ringkasan Bulan Aktif
        $summaryBulan = BudgetLedger::summarizeMonthly($fkdbItems, $otItems);

        // 2. Data Rekap BOP (12 Bulan)
        $rekapBop = BudgetLedger::compileAnnualSchedule($allBop, $bulanList);

        // 3. Data Sisa BOP (Akumulasi Saldo Mandiri 12 Bulan)
        $sisaBop = BudgetLedger::calculateCumulativeBalance($rekapBop, $bulanList);

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

        $validated['lembaga'] = AnggaranBop::resolveLembagaForUser($request->user());

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
        $lembaga = AnggaranBop::resolveLembagaForUser($request->user());

        BudgetLedger::seedDefaultTemplate($tahunAjaran, $bulan, $sumberDana, $lembaga);

        return redirect()->back()->with('success', 'Template pos standar berhasil dimuat.');
    }
}
