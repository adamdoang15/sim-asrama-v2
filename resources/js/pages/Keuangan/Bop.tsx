import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Building2,
    Calendar,
    Check,
    Coins,
    DollarSign,
    FileSpreadsheet,
    Filter,
    Layers,
    Pencil,
    Plus,
    Printer,
    RefreshCw,
    Sparkles,
    Trash2,
    Wallet,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

export const KATEGORI_OPTIONS = [
    'Biaya Masuk Gelara Baru',
    'Biaya Operasional Gelara',
    'Biaya Operasional Lembaga',
] as const;

export interface BopItem {
    id: number;
    tahun_ajaran: string;
    bulan: string;
    sumber_dana: 'fkdb' | 'ot';
    tipe: 'pengeluaran' | 'pemasukan';
    kategori: string;
    uraian: string;
    plan: number | string;
    aktual: number | string;
    selisih: number;
    keterangan: string | null;
}

interface MonthlyRekapData {
    plan_pemasukan: number;
    pemasukan: number;
    plan_pengeluaran: number;
    pengeluaran: number;
    saldo: number;
}

interface SisaBopRow {
    bulan: string;
    uraian: string;
    debit: number;
    kredit: number;
    saldo_bulan: number;
    saldo_kumulatif: number;
}

interface Props {
    tahunAjaran: string;
    tahunOptions: string[];
    bulan: string;
    bulanList: string[];
    activeTab: 'fkdb' | 'ot' | 'rekap' | 'sisa';
    fkdbItems: BopItem[];
    otItems: BopItem[];
    summaryBulan: {
        fkdb: {
            plan_pemasukan: number;
            aktual_pemasukan: number;
            plan_pengeluaran: number;
            aktual_pengeluaran: number;
            selisih_pengeluaran: number;
        };
        ot: {
            plan_pemasukan: number;
            aktual_pemasukan: number;
            plan_pengeluaran: number;
            aktual_pengeluaran: number;
            selisih_pengeluaran: number;
        };
    };
    rekapBop: Record<string, { fkdb: MonthlyRekapData; mandiri: MonthlyRekapData }>;
    sisaBop: SisaBopRow[];
}

export default function BopPage({
    tahunAjaran,
    tahunOptions,
    bulan,
    bulanList,
    activeTab: initialTab,
    fkdbItems,
    otItems,
    summaryBulan,
    rekapBop,
    sisaBop,
}: Props) {
    const [currentTab, setCurrentTab] = useState<'fkdb' | 'ot' | 'rekap' | 'sisa'>(initialTab || 'fkdb');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BopItem | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const filteredFkdbItems = filterCategory === 'all'
        ? fkdbItems
        : fkdbItems.filter((i) => i.kategori === filterCategory);

    const filteredOtItems = filterCategory === 'all'
        ? otItems
        : otItems.filter((i) => i.kategori === filterCategory);

    const formatRupiah = (val: number | string) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num) || num === 0) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        id: null as number | null,
        tahun_ajaran: tahunAjaran,
        bulan: bulan,
        sumber_dana: 'fkdb' as 'fkdb' | 'ot',
        tipe: 'pengeluaran' as 'pengeluaran' | 'pemasukan',
        kategori: 'Biaya Operasional Gelara',
        uraian: '',
        plan: '' as string | number,
        aktual: '' as string | number,
        keterangan: '',
    });

    const handleTahunChange = (ta: string) => {
        router.get('/keuangan/bop', { tahun_ajaran: ta, bulan, tab: currentTab }, { preserveState: true });
    };

    const handleBulanChange = (bln: string) => {
        router.get('/keuangan/bop', { tahun_ajaran: tahunAjaran, bulan: bln, tab: currentTab }, { preserveState: true });
    };

    const handleOpenCreate = (sumber: 'fkdb' | 'ot') => {
        reset();
        setEditingItem(null);
        setData({
            id: null,
            tahun_ajaran: tahunAjaran,
            bulan: bulan,
            sumber_dana: sumber,
            tipe: 'pengeluaran',
            kategori: 'Biaya Operasional Gelara',
            uraian: '',
            plan: '',
            aktual: '',
            keterangan: '',
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (item: BopItem) => {
        setEditingItem(item);
        setData({
            id: item.id,
            tahun_ajaran: item.tahun_ajaran,
            bulan: item.bulan,
            sumber_dana: item.sumber_dana,
            tipe: item.tipe,
            kategori: item.kategori,
            uraian: item.uraian,
            plan: item.plan,
            aktual: item.aktual,
            keterangan: item.keterangan || '',
        });
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus pos anggaran ini?')) {
            router.delete(`/keuangan/bop/${id}`, { preserveState: true });
        }
    };

    const handleSeedTemplate = (sumber: 'fkdb' | 'ot') => {
        if (confirm(`Muat template pos standar untuk ${sumber.toUpperCase()} bulan ${bulan}? Pos yang sudah ada tidak akan diduplikasi.`)) {
            router.post('/keuangan/bop/seed-template', {
                tahun_ajaran: tahunAjaran,
                bulan: bulan,
                sumber_dana: sumber,
            }, { preserveState: true });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/keuangan/bop', {
            preserveState: true,
            onSuccess: () => {
                setModalOpen(false);
                reset();
            },
        });
    };

    // Total akumulasi sisa akhir tahun
    const totalSisaAkhir = sisaBop.length > 0 ? sisaBop[sisaBop.length - 1].saldo_kumulatif : 0;

    return (
        <DashboardLayout title="Anggaran & Realisasi BOP">
            <Head title={`Anggaran BOP - ${bulan} ${tahunAjaran}`} />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="print:hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Coins className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">
                                    Anggaran & Realisasi BOP
                                </h1>
                                <p className="text-xs text-slate-200 sm:text-sm">
                                    Pencatatan Plan & Aktual FKDB, Operasional Tetap (OT), Rekapitulasi, dan Sisa BOP
                                </p>
                            </div>
                        </div>

                        {/* Dropdown TA & Bulan */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-md">
                                <Calendar className="h-4 w-4 text-blue-100" />
                                <span className="text-xs font-medium text-blue-100">TA:</span>
                                <select
                                    value={tahunAjaran}
                                    onChange={(e) => handleTahunChange(e.target.value)}
                                    className="cursor-pointer rounded-lg bg-transparent text-xs font-bold text-white focus:outline-hidden"
                                >
                                    {tahunOptions.map((t) => (
                                        <option key={t} value={t} className="text-gray-900">
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-md">
                                <span className="text-xs font-medium text-blue-100">Bulan:</span>
                                <select
                                    value={bulan}
                                    onChange={(e) => handleBulanChange(e.target.value)}
                                    className="cursor-pointer rounded-lg bg-transparent text-xs font-bold text-white focus:outline-hidden"
                                >
                                    {bulanList.map((b) => (
                                        <option key={b} value={b} className="text-gray-900">
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-900 shadow-xs transition hover:bg-blue-50 active:scale-[0.98]"
                            >
                                <Printer className="h-4 w-4" />
                                Cetak
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* FKDB Plan */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Plan Belanja FKDB ({bulan})</span>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">FKDB</span>
                        </div>
                        <p className="mt-2 text-lg font-bold text-gray-900">
                            {formatRupiah(summaryBulan.fkdb.plan_pengeluaran)}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-500">
                            Pagu: {formatRupiah(summaryBulan.fkdb.aktual_pemasukan || summaryBulan.fkdb.plan_pemasukan)}
                        </p>
                    </div>

                    {/* FKDB Realisasi */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Aktual Belanja FKDB ({bulan})</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                summaryBulan.fkdb.selisih_pengeluaran >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                                {summaryBulan.fkdb.selisih_pengeluaran >= 0 ? 'Sisa Anggaran' : 'Over Budget'}
                            </span>
                        </div>
                        <p className="mt-2 text-lg font-bold text-gray-900">
                            {formatRupiah(summaryBulan.fkdb.aktual_pengeluaran)}
                        </p>
                        <p className={`mt-1 text-[11px] font-medium ${summaryBulan.fkdb.selisih_pengeluaran >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            Selisih: {formatRupiah(summaryBulan.fkdb.selisih_pengeluaran)}
                        </p>
                    </div>

                    {/* Mandiri Plan */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Plan Belanja OT ({bulan})</span>
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">OT Mandiri</span>
                        </div>
                        <p className="mt-2 text-lg font-bold text-gray-900">
                            {formatRupiah(summaryBulan.ot.plan_pengeluaran)}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-500">
                            Kas Masuk: {formatRupiah(summaryBulan.ot.aktual_pemasukan || summaryBulan.ot.plan_pemasukan)}
                        </p>
                    </div>

                    {/* Sisa BOP Mandiri Akumulatif */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Total Sisa BOP Mandiri</span>
                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">Kumulatif</span>
                        </div>
                        <p className={`mt-2 text-lg font-bold ${totalSisaAkhir >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {formatRupiah(totalSisaAkhir)}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-500">
                            Saldo berjalan TA {tahunAjaran}
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
                    <button
                        onClick={() => setCurrentTab('fkdb')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-[0.98] ${
                            currentTab === 'fkdb'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Building2 className="h-4 w-4" />
                        1. Dana FKDB (Bulan {bulan})
                    </button>

                    <button
                        onClick={() => setCurrentTab('ot')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-[0.98] ${
                            currentTab === 'ot'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Wallet className="h-4 w-4" />
                        2. OT Mandiri (Bulan {bulan})
                    </button>

                    <button
                        onClick={() => setCurrentTab('rekap')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-[0.98] ${
                            currentTab === 'rekap'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        3. Rekap BOP (12 Bulan)
                    </button>

                    <button
                        onClick={() => setCurrentTab('sisa')}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-[0.98] ${
                            currentTab === 'sisa'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <Layers className="h-4 w-4" />
                        4. Sisa BOP Mandiri
                    </button>
                </div>

                {/* TAB 1: DANA FKDB */}
                {currentTab === 'fkdb' && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    Rincian Plan & Realisasi Dana FKDB - Bulan {bulan} {tahunAjaran}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Catat rencana (plan) dan pengeluaran riil (aktual) untuk pos-pos belanja bersumber dana FKDB
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/70 px-2.5 py-1.5 text-xs text-gray-700 shadow-xs">
                                    <Filter className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="text-gray-500 font-medium">Filter:</span>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-hidden cursor-pointer"
                                    >
                                        <option value="all">Semua Kategori</option>
                                        {KATEGORI_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {fkdbItems.length === 0 && (
                                    <button
                                        onClick={() => handleSeedTemplate('fkdb')}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-[0.98]"
                                    >
                                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                        Muat Template Pos
                                    </button>
                                )}
                                <button
                                    onClick={() => handleOpenCreate('fkdb')}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Pos Belanja
                                </button>
                            </div>
                        </div>

                        {/* Tabel FKDB */}
                        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        <tr>
                                            <th className="py-3 px-4">No</th>
                                            <th className="py-3 px-4">Kategori</th>
                                            <th className="py-3 px-4">Uraian Belanja</th>
                                            <th className="py-3 px-4 text-center">Tipe</th>
                                            <th className="py-3 px-4 text-right">Plan (Rencana)</th>
                                            <th className="py-3 px-4 text-right">Aktual (Realisasi)</th>
                                            <th className="py-3 px-4 text-right">Selisih</th>
                                            <th className="py-3 px-4">Keterangan</th>
                                            <th className="py-3 px-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {fkdbItems.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="py-8 text-center text-gray-400">
                                                    Belum ada pos anggaran FKDB untuk bulan {bulan}. Klik "Muat Template Pos" atau "Tambah Pos Belanja".
                                                </td>
                                            </tr>
                                        ) : filteredFkdbItems.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="py-8 text-center text-gray-400">
                                                    Tidak ada pos belanja dengan kategori "{filterCategory}".
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredFkdbItems.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-gray-50/60 transition">
                                                    <td className="py-3 px-4 font-medium text-gray-400">{idx + 1}</td>
                                                    <td className="py-3 px-4 font-medium text-gray-700">{item.kategori}</td>
                                                    <td className="py-3 px-4 font-semibold text-gray-900">{item.uraian}</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                            item.tipe === 'pemasukan' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {item.tipe === 'pemasukan' ? 'Pemasukan' : 'Belanja'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-medium text-gray-700 tabular-nums">
                                                        {formatRupiah(item.plan)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-gray-900 tabular-nums">
                                                        {formatRupiah(item.aktual)}
                                                    </td>
                                                    <td className={`py-3 px-4 text-right font-semibold tabular-nums ${
                                                        item.selisih >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                        {formatRupiah(item.selisih)}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate" title={item.keterangan || ''}>
                                                        {item.keterangan || '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => handleOpenEdit(item)}
                                                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {fkdbItems.length > 0 && (
                                        <tfoot className="border-t-2 border-gray-200 bg-gray-50/80 font-bold text-gray-900">
                                            <tr>
                                                <td colSpan={4} className="py-3.5 px-4 text-right uppercase tracking-wider text-[11px]">
                                                    Total Belanja FKDB:
                                                </td>
                                                <td className="py-3.5 px-4 text-right tabular-nums">
                                                    {formatRupiah(summaryBulan.fkdb.plan_pengeluaran)}
                                                </td>
                                                <td className="py-3.5 px-4 text-right tabular-nums">
                                                    {formatRupiah(summaryBulan.fkdb.aktual_pengeluaran)}
                                                </td>
                                                <td className={`py-3.5 px-4 text-right tabular-nums ${
                                                    summaryBulan.fkdb.selisih_pengeluaran >= 0 ? 'text-emerald-700' : 'text-rose-700'
                                                }`}>
                                                    {formatRupiah(summaryBulan.fkdb.selisih_pengeluaran)}
                                                </td>
                                                <td colSpan={2}></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: DANA OT MANDIRI */}
                {currentTab === 'ot' && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    Rincian Plan & Realisasi OT Mandiri - Bulan {bulan} {tahunAjaran}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Catat pengeluaran operasional tetap dan pembiayaan mandiri lembaga asrama
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/70 px-2.5 py-1.5 text-xs text-gray-700 shadow-xs">
                                    <Filter className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="text-gray-500 font-medium">Filter:</span>
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-hidden cursor-pointer"
                                    >
                                        <option value="all">Semua Kategori</option>
                                        {KATEGORI_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {otItems.length === 0 && (
                                    <button
                                        onClick={() => handleSeedTemplate('ot')}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-[0.98]"
                                    >
                                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                        Muat Template Pos
                                    </button>
                                )}
                                <button
                                    onClick={() => handleOpenCreate('ot')}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Pos Belanja
                                </button>
                            </div>
                        </div>

                        {/* Tabel OT */}
                        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        <tr>
                                            <th className="py-3 px-4">No</th>
                                            <th className="py-3 px-4">Kategori</th>
                                            <th className="py-3 px-4">Uraian Belanja</th>
                                            <th className="py-3 px-4 text-center">Tipe</th>
                                            <th className="py-3 px-4 text-right">Plan (Rencana)</th>
                                            <th className="py-3 px-4 text-right">Aktual (Realisasi)</th>
                                            <th className="py-3 px-4 text-right">Selisih</th>
                                            <th className="py-3 px-4">Keterangan</th>
                                            <th className="py-3 px-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {otItems.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="py-8 text-center text-gray-400">
                                                    Belum ada pos anggaran OT Mandiri untuk bulan {bulan}. Klik "Muat Template Pos" atau "Tambah Pos Belanja".
                                                </td>
                                            </tr>
                                        ) : filteredOtItems.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="py-8 text-center text-gray-400">
                                                    Tidak ada pos belanja dengan kategori "{filterCategory}".
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOtItems.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-gray-50/60 transition">
                                                    <td className="py-3 px-4 font-medium text-gray-400">{idx + 1}</td>
                                                    <td className="py-3 px-4 font-medium text-gray-700">{item.kategori}</td>
                                                    <td className="py-3 px-4 font-semibold text-gray-900">{item.uraian}</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                            item.tipe === 'pemasukan' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {item.tipe === 'pemasukan' ? 'Pemasukan' : 'Belanja'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-medium text-gray-700 tabular-nums">
                                                        {formatRupiah(item.plan)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-gray-900 tabular-nums">
                                                        {formatRupiah(item.aktual)}
                                                    </td>
                                                    <td className={`py-3 px-4 text-right font-semibold tabular-nums ${
                                                        item.selisih >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                        {formatRupiah(item.selisih)}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate" title={item.keterangan || ''}>
                                                        {item.keterangan || '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => handleOpenEdit(item)}
                                                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {otItems.length > 0 && (
                                        <tfoot className="border-t-2 border-gray-200 bg-gray-50/80 font-bold text-gray-900">
                                            <tr>
                                                <td colSpan={4} className="py-3.5 px-4 text-right uppercase tracking-wider text-[11px]">
                                                    Total Belanja OT:
                                                </td>
                                                <td className="py-3.5 px-4 text-right tabular-nums">
                                                    {formatRupiah(summaryBulan.ot.plan_pengeluaran)}
                                                </td>
                                                <td className="py-3.5 px-4 text-right tabular-nums">
                                                    {formatRupiah(summaryBulan.ot.aktual_pengeluaran)}
                                                </td>
                                                <td className={`py-3.5 px-4 text-right tabular-nums ${
                                                    summaryBulan.ot.selisih_pengeluaran >= 0 ? 'text-emerald-700' : 'text-rose-700'
                                                }`}>
                                                    {formatRupiah(summaryBulan.ot.selisih_pengeluaran)}
                                                </td>
                                                <td colSpan={2}></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: REKAP BOP (12 BULAN) */}
                {currentTab === 'rekap' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                            <h3 className="text-sm font-bold text-gray-900">
                                Rekapitulasi Anggaran BOP LKP Doa Bangsa Cicantayan - TA {tahunAjaran}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Agregasi otomatis penerimaan pagu, realisasi belanja aktual, dan saldo bulanan untuk kedua sumber dana
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        <tr>
                                            <th className="py-3 px-4">Bulan</th>
                                            <th className="py-3 px-4 text-right">Pagu FKDB</th>
                                            <th className="py-3 px-4 text-right">Aktual FKDB</th>
                                            <th className="py-3 px-4 text-right">Saldo FKDB</th>
                                            <th className="py-3 px-4 text-right">Pemasukan Mandiri</th>
                                            <th className="py-3 px-4 text-right">Aktual Mandiri</th>
                                            <th className="py-3 px-4 text-right">Saldo Mandiri</th>
                                            <th className="py-3 px-4 text-right">Total Belanja (FKDB + OT)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {bulanList.map((blnName) => {
                                            const item = rekapBop[blnName];
                                            const totalBelanja = (item?.fkdb.pengeluaran || 0) + (item?.mandiri.pengeluaran || 0);
                                            const isSelected = blnName === bulan;
                                            return (
                                                <tr key={blnName} className={`transition ${isSelected ? 'bg-blue-50/50 font-medium' : 'hover:bg-gray-50/50'}`}>
                                                    <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-1.5">
                                                        {blnName}
                                                        {isSelected && <span className="rounded-full bg-blue-600 text-white text-[9px] px-1.5 py-0.2">Aktif</span>}
                                                    </td>
                                                    <td className="py-3 px-4 text-right tabular-nums text-gray-700">
                                                        {formatRupiah(item?.fkdb.pemasukan || item?.fkdb.plan_pemasukan || 0)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right tabular-nums text-gray-900 font-semibold">
                                                        {formatRupiah(item?.fkdb.pengeluaran || 0)}
                                                    </td>
                                                    <td className={`py-3 px-4 text-right tabular-nums font-semibold ${
                                                        (item?.fkdb.saldo || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                        {formatRupiah(item?.fkdb.saldo || 0)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right tabular-nums text-gray-700">
                                                        {formatRupiah(item?.mandiri.pemasukan || item?.mandiri.plan_pemasukan || 0)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right tabular-nums text-gray-900 font-semibold">
                                                        {formatRupiah(item?.mandiri.pengeluaran || 0)}
                                                    </td>
                                                    <td className={`py-3 px-4 text-right tabular-nums font-bold ${
                                                        (item?.mandiri.saldo || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                        {formatRupiah(item?.mandiri.saldo || 0)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right tabular-nums font-bold text-blue-900">
                                                        {formatRupiah(totalBelanja)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: SISA BOP (AKUMULASI SALDO MANDIRI) */}
                {currentTab === 'sisa' && (
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                            <h3 className="text-sm font-bold text-gray-900">
                                Sisa BOP Pemasukan Mandiri - Tahun Ajaran {tahunAjaran}
                            </h3>
                            <p className="text-xs text-gray-500">
                                Akumulasi saldo sisa operasional mandiri dari bulan ke bulan (Juli s/d Juni)
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                        <tr>
                                            <th className="py-3 px-4">Bulan</th>
                                            <th className="py-3 px-4">Uraian Transaksi Saldo</th>
                                            <th className="py-3 px-4 text-right">Debit (Surplus)</th>
                                            <th className="py-3 px-4 text-right">Kredit (Defisit)</th>
                                            <th className="py-3 px-4 text-right">Saldo Bersih Bulan Ini</th>
                                            <th className="py-3 px-4 text-right">Saldo Kumulatif Berjalan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sisaBop.map((row) => (
                                            <tr key={row.bulan} className="hover:bg-gray-50/60 transition">
                                                <td className="py-3 px-4 font-bold text-gray-900">{row.bulan}</td>
                                                <td className="py-3 px-4 text-gray-700">{row.uraian}</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-emerald-600 font-medium">
                                                    {row.debit > 0 ? formatRupiah(row.debit) : '-'}
                                                </td>
                                                <td className="py-3 px-4 text-right tabular-nums text-rose-600 font-medium">
                                                    {row.kredit > 0 ? formatRupiah(row.kredit) : '-'}
                                                </td>
                                                <td className={`py-3 px-4 text-right tabular-nums font-semibold ${
                                                    row.saldo_bulan >= 0 ? 'text-emerald-700' : 'text-rose-700'
                                                }`}>
                                                    {formatRupiah(row.saldo_bulan)}
                                                </td>
                                                <td className={`py-3 px-4 text-right tabular-nums font-bold ${
                                                    row.saldo_kumulatif >= 0 ? 'text-blue-900' : 'text-rose-900'
                                                }`}>
                                                    {formatRupiah(row.saldo_kumulatif)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t-2 border-gray-200 bg-gray-50/80 font-bold text-gray-900">
                                        <tr>
                                            <td colSpan={5} className="py-3.5 px-4 text-right uppercase tracking-wider text-[11px]">
                                                Total Sisa Akhir BOP Mandiri (TA {tahunAjaran}):
                                            </td>
                                            <td className={`py-3.5 px-4 text-right tabular-nums text-sm font-extrabold ${
                                                totalSisaAkhir >= 0 ? 'text-emerald-700' : 'text-rose-700'
                                            }`}>
                                                {formatRupiah(totalSisaAkhir)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form Tambah / Edit Pos Anggaran */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-base font-bold text-gray-900">
                                {editingItem ? 'Edit Pos Anggaran BOP' : 'Tambah Pos Anggaran BOP'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Sumber Dana
                                    </label>
                                    <select
                                        value={data.sumber_dana}
                                        onChange={(e) => setData('sumber_dana', e.target.value as 'fkdb' | 'ot')}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="fkdb">FKDB (Pusat / Yayasan)</option>
                                        <option value="ot">OT Mandiri (Asrama)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Tipe Pos
                                    </label>
                                    <select
                                        value={data.tipe}
                                        onChange={(e) => {
                                            const nextTipe = e.target.value as 'pengeluaran' | 'pemasukan';
                                            setData((prev) => ({
                                                ...prev,
                                                tipe: nextTipe,
                                                kategori: nextTipe === 'pemasukan'
                                                    ? 'Pemasukan'
                                                    : (KATEGORI_OPTIONS.includes(prev.kategori as any) ? prev.kategori : KATEGORI_OPTIONS[1]),
                                            }));
                                        }}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="pengeluaran">Pengeluaran / Belanja</option>
                                        <option value="pemasukan">Pemasukan / Pagu</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    >
                                        {data.tipe === 'pemasukan' ? (
                                            <option value="Pemasukan">Pemasukan</option>
                                        ) : (
                                            <>
                                                {!KATEGORI_OPTIONS.includes(data.kategori as any) && data.kategori && data.kategori !== 'Pemasukan' && (
                                                    <option value={data.kategori}>{data.kategori}</option>
                                                )}
                                                {KATEGORI_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    {errors.kategori && <span className="text-[10px] text-red-500">{errors.kategori}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Uraian Kegiatan / Belanja
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Konsumsi Gelara"
                                        value={data.uraian}
                                        onChange={(e) => setData('uraian', e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.uraian && <span className="text-[10px] text-red-500">{errors.uraian}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Plan (Rencana Anggaran)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        value={data.plan}
                                        onChange={(e) => setData('plan', e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.plan && <span className="text-[10px] text-red-500">{errors.plan}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Aktual (Realisasi Riil)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        placeholder="0"
                                        value={data.aktual}
                                        onChange={(e) => setData('aktual', e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.aktual && <span className="text-[10px] text-red-500">{errors.aktual}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Keterangan / Catatan Selisih
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Alasan selisih anggaran (misal: sisa karena gelara libur, penyesuaian harga, dll)"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                />
                                {errors.keterangan && <span className="text-[10px] text-red-500">{errors.keterangan}</span>}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Check className="h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Pos'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
