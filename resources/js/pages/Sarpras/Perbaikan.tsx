import DashboardLayout from '@/layouts/DashboardLayout';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    Building,
    CheckCircle2,
    Clock,
    Filter,
    History,
    Layers,
    MapPin,
    Package,
    Plus,
    Search,
    ShieldAlert,
    Trash2,
    User,
    Wrench,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

export interface PerbaikanItem {
    id: number;
    aset_id: number;
    nomor_laporan: string;
    pelapor: string;
    deskripsi_kerusakan: string;
    prioritas: 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat';
    status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Ditolak';
    biaya: number | null;
    teknisi: string | null;
    tanggal_pengajuan: string;
    tanggal_selesai: string | null;
    catatan_penyelesaian: string | null;
    created_at: string;
    updated_at: string;
    aset?: {
        id: number;
        kode_aset: string;
        nama_aset: string;
        lembaga?: string;
        lokasi: string;
        kondisi: string;
        status: string;
    };
}

export interface ActiveAsetItem {
    id: number;
    kode_aset: string;
    nama_aset: string;
    lembaga?: string;
    kategori: string;
    lokasi: string;
    jumlah: number;
    satuan: string;
    kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
    status: string;
    tanggal_pemeriksaan_terakhir: string | null;
    catatan_pemeriksaan: string | null;
}

interface Props {
    perbaikans: PerbaikanItem[];
    activeAsets: ActiveAsetItem[];
    filters: {
        tab: 'pemeriksaan' | 'perbaikan';
        search: string;
        lembaga?: string;
        kondisi?: string;
        prioritas?: string;
    };
    options?: {
        lembaga?: string[];
        lembaga_ruangan?: Record<string, string[]>;
    };
    stats: {
        total_aset: number;
        perlu_perhatian: number;
        dalam_perbaikan: number;
        selesai_perbaikan: number;
        total_biaya: number;
    };
}

export default function Perbaikan({
    perbaikans,
    activeAsets,
    filters,
    options,
    stats,
}: Props) {
    const activeTab = filters.tab || 'pemeriksaan';
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedLembaga, setSelectedLembaga] = useState(
        filters.lembaga || '',
    );
    const [selectedKondisi, setSelectedKondisi] = useState(
        filters.kondisi || '',
    );
    const [selectedPrioritas, setSelectedPrioritas] = useState(
        filters.prioritas || '',
    );

    // Modal Catat Pemeriksaan
    const [isPeriksaModalOpen, setIsPeriksaModalOpen] = useState(false);
    const [selectedPeriksaAset, setSelectedPeriksaAset] =
        useState<ActiveAsetItem | null>(null);
    const [periksaForm, setPeriksaForm] = useState({
        aset_id: '',
        kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
        status: 'Tersedia' as
            | 'Tersedia'
            | 'Tidak Tersedia'
            | 'Dalam Perbaikan'
            | 'Dihapuskan',
        catatan_pemeriksaan: '',
        tanggal_pemeriksaan_terakhir: new Date().toISOString().split('T')[0],
    });

    // Modal Afkir / Hapus Aset
    const [isHapusModalOpen, setIsHapusModalOpen] = useState(false);
    const [hapusTarget, setHapusTarget] = useState<ActiveAsetItem | null>(null);
    const [hapusForm, setHapusForm] = useState({
        alasan_penghapusan: '',
        tanggal_penghapusan: new Date().toISOString().split('T')[0],
    });

    // Modal Catat Perbaikan Baru
    const [isPerbaikanModalOpen, setIsPerbaikanModalOpen] = useState(false);
    const [perbaikanForm, setPerbaikanForm] = useState({
        aset_id: '',
        pelapor: 'Petugas Sarpras',
        prioritas: 'Sedang' as 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat',
        deskripsi_kerusakan: '',
        tanggal_pengajuan: new Date().toISOString().split('T')[0],
    });

    // Modal Selesaikan Perbaikan
    const [isSelesaiModalOpen, setIsSelesaiModalOpen] = useState(false);
    const [selectedPerbaikan, setSelectedPerbaikan] =
        useState<PerbaikanItem | null>(null);
    const [selesaiForm, setSelesaiForm] = useState({
        teknisi: '',
        biaya: '',
        catatan_penyelesaian: '',
        tanggal_selesai: new Date().toISOString().split('T')[0],
    });

    const handleTabChange = (tab: 'pemeriksaan' | 'perbaikan') => {
        router.get(
            '/sarpras/perbaikan',
            {
                tab,
                search: searchQuery,
                lembaga: selectedLembaga,
                kondisi: selectedKondisi,
                prioritas: selectedPrioritas,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/sarpras/perbaikan',
            {
                tab: activeTab,
                search: searchQuery,
                lembaga: selectedLembaga,
                kondisi: selectedKondisi,
                prioritas: selectedPrioritas,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleKondisiFilter = (kondisi: string) => {
        setSelectedKondisi(kondisi);
        router.get(
            '/sarpras/perbaikan',
            {
                tab: activeTab,
                search: searchQuery,
                lembaga: selectedLembaga,
                kondisi,
                prioritas: selectedPrioritas,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handlePrioritasFilter = (prioritas: string) => {
        setSelectedPrioritas(prioritas);
        router.get(
            '/sarpras/perbaikan',
            {
                tab: activeTab,
                search: searchQuery,
                lembaga: selectedLembaga,
                kondisi: selectedKondisi,
                prioritas,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    // Submit Pemeriksaan
    const handleSubmitPeriksa = (e: React.FormEvent) => {
        e.preventDefault();
        const targetId = selectedPeriksaAset
            ? selectedPeriksaAset.id
            : periksaForm.aset_id;
        if (!targetId) return;

        router.post(
            `/sarpras/inventaris/${targetId}/periksa`,
            {
                kondisi: periksaForm.kondisi,
                status: periksaForm.status,
                catatan_pemeriksaan: periksaForm.catatan_pemeriksaan,
                tanggal_pemeriksaan_terakhir:
                    periksaForm.tanggal_pemeriksaan_terakhir,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsPeriksaModalOpen(false);
                    setSelectedPeriksaAset(null);
                    setPeriksaForm({
                        aset_id: '',
                        kondisi: 'Baik',
                        status: 'Tersedia',
                        catatan_pemeriksaan: '',
                        tanggal_pemeriksaan_terakhir: new Date()
                            .toISOString()
                            .split('T')[0],
                    });
                },
            },
        );
    };

    // Submit Hapus / Afkir Aset
    const handleSubmitHapus = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hapusTarget) return;

        router.post(`/sarpras/inventaris/${hapusTarget.id}/hapus`, hapusForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsHapusModalOpen(false);
                setHapusTarget(null);
                setHapusForm({
                    alasan_penghapusan: '',
                    tanggal_penghapusan: new Date().toISOString().split('T')[0],
                });
            },
        });
    };

    // Submit Perbaikan Baru
    const handleSubmitPerbaikan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!perbaikanForm.aset_id) return;

        router.post('/sarpras/perbaikan', perbaikanForm, {
            preserveScroll: true,
            onSuccess: () => {
                setIsPerbaikanModalOpen(false);
                setPerbaikanForm({
                    aset_id: '',
                    pelapor: 'Petugas Sarpras',
                    prioritas: 'Sedang',
                    deskripsi_kerusakan: '',
                    tanggal_pengajuan: new Date().toISOString().split('T')[0],
                });
            },
        });
    };

    // Submit Selesaikan Perbaikan
    const handleSubmitSelesai = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPerbaikan) return;

        router.post(
            `/sarpras/perbaikan/${selectedPerbaikan.id}/update-status`,
            {
                status: 'Selesai',
                teknisi: selesaiForm.teknisi,
                biaya: selesaiForm.biaya ? parseFloat(selesaiForm.biaya) : 0,
                catatan_penyelesaian: selesaiForm.catatan_penyelesaian,
                tanggal_selesai: selesaiForm.tanggal_selesai,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSelesaiModalOpen(false);
                    setSelectedPerbaikan(null);
                    setSelesaiForm({
                        teknisi: '',
                        biaya: '',
                        catatan_penyelesaian: '',
                        tanggal_selesai: new Date().toISOString().split('T')[0],
                    });
                },
            },
        );
    };

    const formatCurrency = (val: number | null) => {
        if (!val) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const formatDate = (val: string | null | undefined) => {
        if (!val) return '-';
        try {
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }).format(d);
        } catch {
            return val;
        }
    };

    const getKondisiBadge = (kondisi: string) => {
        switch (kondisi) {
            case 'Baik':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Rusak Ringan':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Rusak Berat':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getPrioritasBadge = (prioritas: string) => {
        switch (prioritas) {
            case 'Darurat':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Tinggi':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Sedang':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Banner Berwarna */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Wrench className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Pemeriksaan & Perbaikan Aset
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Pusat monitoring kondisi fisik berkala,
                                    penanganan perbaikan, dan afkir aset
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {activeTab === 'pemeriksaan' ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const firstAset = activeAsets[0];
                                        setSelectedPeriksaAset(null);
                                        setPeriksaForm({
                                            aset_id:
                                                firstAset?.id?.toString() || '',
                                            kondisi:
                                                firstAset?.kondisi || 'Baik',
                                            status:
                                                (firstAset?.status as any) ||
                                                'Tersedia',
                                            catatan_pemeriksaan: '',
                                            tanggal_pemeriksaan_terakhir:
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0],
                                        });
                                        setIsPeriksaModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98]"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Catat Pemeriksaan</span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPerbaikanForm({
                                            aset_id:
                                                activeAsets[0]?.id?.toString() ||
                                                '',
                                            pelapor: 'Petugas Sarpras',
                                            prioritas: 'Sedang',
                                            deskripsi_kerusakan: '',
                                            tanggal_pengajuan: new Date()
                                                .toISOString()
                                                .split('T')[0],
                                        });
                                        setIsPerbaikanModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98]"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Catat Perbaikan Baru</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs & Search Filter */}
                <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Tabs */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleTabChange('pemeriksaan')}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                    activeTab === 'pemeriksaan'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>1. Pemeriksaan Berkala</span>
                                <span
                                    className={`ml-1 rounded-full px-2 py-0.5 text-xs ${activeTab === 'pemeriksaan' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}
                                >
                                    {activeAsets.length}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTabChange('perbaikan')}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                    activeTab === 'perbaikan'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <Wrench className="h-4 w-4" />
                                <span>2. Perbaikan & Perawatan</span>
                                <span
                                    className={`ml-1 rounded-full px-2 py-0.5 text-xs ${activeTab === 'perbaikan' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}
                                >
                                    {perbaikans.length}
                                </span>
                            </button>
                        </div>

                        {/* Search and Lembaga bar */}
                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={selectedLembaga}
                                onChange={(e) => {
                                    setSelectedLembaga(e.target.value);
                                    router.get(
                                        '/sarpras/perbaikan',
                                        {
                                            tab: activeTab,
                                            search: searchQuery,
                                            lembaga: e.target.value,
                                            kondisi: selectedKondisi,
                                            prioritas: selectedPrioritas,
                                        },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                        },
                                    );
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            >
                                <option value="">Semua Lembaga</option>
                                {(
                                    options?.lembaga || [
                                        'Lembaga 1',
                                        'Lembaga 2',
                                        'Lembaga 3',
                                    ]
                                ).map((lem) => (
                                    <option key={lem} value={lem}>
                                        {lem}
                                    </option>
                                ))}
                            </select>

                            <form
                                onSubmit={handleSearch}
                                className="relative w-full sm:w-64"
                            >
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={
                                        activeTab === 'pemeriksaan'
                                            ? 'Cari nama aset, kode, lokasi...'
                                            : 'Cari no laporan, aset...'
                                    }
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm placeholder-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Filter specific to tab */}
                    {activeTab === 'pemeriksaan' ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-slate-500">
                                Filter Kondisi:
                            </span>
                            <div className="flex gap-2">
                                {[
                                    '',
                                    'Baik',
                                    'Rusak Ringan',
                                    'Rusak Berat',
                                ].map((k) => (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => handleKondisiFilter(k)}
                                        className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                                            selectedKondisi === k
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {k === '' ? 'Semua Kondisi' : k}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-slate-500">
                                Filter Prioritas:
                            </span>
                            <div className="flex gap-2">
                                {[
                                    '',
                                    'Darurat',
                                    'Tinggi',
                                    'Sedang',
                                    'Rendah',
                                ].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => handlePrioritasFilter(p)}
                                        className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                                            selectedPrioritas === p
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {p === '' ? 'Semua Prioritas' : p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* TAB 1: Tabel Pemeriksaan Berkala */}
                {activeTab === 'pemeriksaan' && (
                    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            Kode & Nama Aset
                                        </th>
                                        <th scope="col" className="px-5 py-3.5">
                                            Kategori & Lokasi
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5 text-center"
                                        >
                                            Kondisi Fisik
                                        </th>
                                        <th scope="col" className="px-5 py-3.5">
                                            Pemeriksaan Terakhir
                                        </th>
                                        <th scope="col" className="px-5 py-3.5">
                                            Catatan Temuan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5 text-center"
                                        >
                                            Aksi Petugas
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {activeAsets.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-12 text-center text-slate-400"
                                            >
                                                Tidak ada data aset untuk
                                                diperiksa
                                            </td>
                                        </tr>
                                    ) : (
                                        activeAsets.map((aset) => (
                                            <tr
                                                key={aset.id}
                                                className="transition hover:bg-slate-50/60"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900">
                                                        {aset.nama_aset}
                                                    </div>
                                                    <div className="font-mono text-xs text-slate-500">
                                                        {aset.kode_aset}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="text-slate-800">
                                                        {aset.kategori}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>
                                                            {aset.lokasi}
                                                        </span>
                                                        {aset.lembaga && (
                                                            <span className="rounded border border-teal-200/60 bg-teal-50 px-1.5 py-0.5 font-semibold text-teal-700">
                                                                {aset.lembaga}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getKondisiBadge(aset.kondisi)}`}
                                                    >
                                                        {aset.kondisi}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-slate-700">
                                                    {aset.tanggal_pemeriksaan_terakhir ? (
                                                        formatDate(
                                                            aset.tanggal_pemeriksaan_terakhir,
                                                        )
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum pernah dicek
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="max-w-xs truncate px-5 py-4 text-xs text-slate-600">
                                                    {aset.catatan_pemeriksaan ||
                                                        '-'}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedPeriksaAset(
                                                                    aset,
                                                                );
                                                                setPeriksaForm({
                                                                    aset_id:
                                                                        aset.id.toString(),
                                                                    kondisi:
                                                                        aset.kondisi,
                                                                    status:
                                                                        (aset.status as any) ||
                                                                        'Tersedia',
                                                                    catatan_pemeriksaan:
                                                                        aset.catatan_pemeriksaan ||
                                                                        '',
                                                                    tanggal_pemeriksaan_terakhir:
                                                                        new Date()
                                                                            .toISOString()
                                                                            .split(
                                                                                'T',
                                                                            )[0],
                                                                });
                                                                setIsPeriksaModalOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 transition hover:bg-teal-100"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            <span>
                                                                Update Kondisi
                                                            </span>
                                                        </button>

                                                        {aset.kondisi ===
                                                            'Rusak Berat' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setHapusTarget(
                                                                        aset,
                                                                    );
                                                                    setHapusForm(
                                                                        {
                                                                            alasan_penghapusan:
                                                                                'Rusak berat dan tidak dapat diperbaiki.',
                                                                            tanggal_penghapusan:
                                                                                new Date()
                                                                                    .toISOString()
                                                                                    .split(
                                                                                        'T',
                                                                                    )[0],
                                                                        },
                                                                    );
                                                                    setIsHapusModalOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                                                                title="Afkir / Hapus Aset"
                                                            >
                                                                <Archive className="h-3.5 w-3.5" />
                                                                <span>
                                                                    Afkir
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: Tabel Perbaikan & Perawatan */}
                {activeTab === 'perbaikan' && (
                    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5">
                                            No Tiket & Tanggal
                                        </th>
                                        <th scope="col" className="px-5 py-3.5">
                                            Aset Terkait
                                        </th>
                                        <th scope="col" className="px-5 py-3.5">
                                            Deskripsi Masalah
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5 text-center"
                                        >
                                            Prioritas
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5 text-center"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5 text-right"
                                        >
                                            Biaya
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3.5 text-center"
                                        >
                                            Tindakan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {perbaikans.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-12 text-center text-slate-400"
                                            >
                                                Tidak ada riwayat atau laporan
                                                perbaikan
                                            </td>
                                        </tr>
                                    ) : (
                                        perbaikans.map((pbk) => (
                                            <tr
                                                key={pbk.id}
                                                className="transition hover:bg-slate-50/60"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-mono font-semibold text-slate-900">
                                                        {pbk.nomor_laporan}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {formatDate(
                                                            pbk.tanggal_pengajuan,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900">
                                                        {pbk.aset?.nama_aset ||
                                                            'Aset #' +
                                                                pbk.aset_id}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {pbk.aset?.lokasi ||
                                                            '-'}
                                                    </div>
                                                </td>
                                                <td className="max-w-xs px-5 py-4">
                                                    <p className="text-xs text-slate-700">
                                                        {
                                                            pbk.deskripsi_kerusakan
                                                        }
                                                    </p>
                                                    {pbk.teknisi && (
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Teknisi:{' '}
                                                            {pbk.teknisi}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getPrioritasBadge(pbk.prioritas)}`}
                                                    >
                                                        {pbk.prioritas}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                            pbk.status ===
                                                            'Selesai'
                                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                : pbk.status ===
                                                                    'Diproses'
                                                                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                                  : 'border-amber-200 bg-amber-50 text-amber-700'
                                                        }`}
                                                    >
                                                        {pbk.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right font-medium text-slate-900">
                                                    {pbk.biaya
                                                        ? formatCurrency(
                                                              pbk.biaya,
                                                          )
                                                        : '-'}
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    {pbk.status !== 'Selesai' &&
                                                    pbk.status !== 'Ditolak' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedPerbaikan(
                                                                    pbk,
                                                                );
                                                                setSelesaiForm({
                                                                    teknisi:
                                                                        pbk.teknisi ||
                                                                        '',
                                                                    biaya:
                                                                        pbk.biaya?.toString() ||
                                                                        '',
                                                                    catatan_penyelesaian:
                                                                        pbk.catatan_penyelesaian ||
                                                                        '',
                                                                    tanggal_selesai:
                                                                        new Date()
                                                                            .toISOString()
                                                                            .split(
                                                                                'T',
                                                                            )[0],
                                                                });
                                                                setIsSelesaiModalOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            <span>
                                                                Selesaikan
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Selesai (
                                                            {formatDate(
                                                                pbk.tanggal_selesai,
                                                            )}
                                                            )
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal 1: Catat Pemeriksaan */}
            {isPeriksaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">
                                Catat Pemeriksaan Kondisi Fisik
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsPeriksaModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmitPeriksa}
                            className="mt-4 space-y-4"
                        >
                            {!selectedPeriksaAset && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Pilih Aset
                                    </label>
                                    <select
                                        required
                                        value={periksaForm.aset_id}
                                        onChange={(e) => {
                                            const selected = activeAsets.find(
                                                (a) =>
                                                    a.id.toString() ===
                                                    e.target.value,
                                            );
                                            setPeriksaForm({
                                                ...periksaForm,
                                                aset_id: e.target.value,
                                                kondisi:
                                                    selected?.kondisi || 'Baik',
                                                status:
                                                    (selected?.status as any) ||
                                                    'Tersedia',
                                            });
                                        }}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                    >
                                        <option value="">
                                            -- Pilih Aset --
                                        </option>
                                        {activeAsets.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.nama_aset} ({a.kode_aset}) -{' '}
                                                {a.lokasi}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedPeriksaAset && (
                                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                                    <p className="font-semibold text-slate-900">
                                        {selectedPeriksaAset.nama_aset}
                                    </p>
                                    <p>
                                        Kode: {selectedPeriksaAset.kode_aset} |
                                        Lokasi: {selectedPeriksaAset.lokasi}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Kondisi Hasil Cek
                                    </label>
                                    <select
                                        value={periksaForm.kondisi}
                                        onChange={(e) =>
                                            setPeriksaForm({
                                                ...periksaForm,
                                                kondisi: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                    >
                                        <option value="Baik">
                                            Baik (Layak Pakai)
                                        </option>
                                        <option value="Rusak Ringan">
                                            Rusak Ringan (Bisa Digunakan / Perlu
                                            Servis)
                                        </option>
                                        <option value="Rusak Berat">
                                            Rusak Berat (Tidak Berfungsi / Perlu
                                            Afkir)
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Status Operasional
                                    </label>
                                    <select
                                        value={periksaForm.status}
                                        onChange={(e) =>
                                            setPeriksaForm({
                                                ...periksaForm,
                                                status: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                    >
                                        <option value="Tersedia">
                                            Tersedia
                                        </option>
                                        <option value="Tidak Tersedia">
                                            Tidak Tersedia
                                        </option>
                                        <option value="Dalam Perbaikan">
                                            Dalam Perbaikan
                                        </option>
                                        <option value="Dihapuskan">
                                            Dihapuskan (Afkir)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Tanggal Pemeriksaan
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={
                                        periksaForm.tanggal_pemeriksaan_terakhir
                                    }
                                    onChange={(e) =>
                                        setPeriksaForm({
                                            ...periksaForm,
                                            tanggal_pemeriksaan_terakhir:
                                                e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Catatan Temuan / Keterangan
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Contoh: Baut pegangan longgar, layar berkedip..."
                                    value={periksaForm.catatan_pemeriksaan}
                                    onChange={(e) =>
                                        setPeriksaForm({
                                            ...periksaForm,
                                            catatan_pemeriksaan: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPeriksaModalOpen(false)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
                                >
                                    Simpan Pemeriksaan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Catat Perbaikan Baru */}
            {isPerbaikanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">
                                Catat Penanganan Perbaikan
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsPerbaikanModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmitPerbaikan}
                            className="mt-4 space-y-4"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Pilih Aset yang Bermasalah
                                </label>
                                <select
                                    required
                                    value={perbaikanForm.aset_id}
                                    onChange={(e) =>
                                        setPerbaikanForm({
                                            ...perbaikanForm,
                                            aset_id: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="">-- Pilih Aset --</option>
                                    {activeAsets.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.nama_aset} ({a.kode_aset}) -{' '}
                                            {a.lokasi} [{a.kondisi}]
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Tingkat Prioritas
                                    </label>
                                    <select
                                        value={perbaikanForm.prioritas}
                                        onChange={(e) =>
                                            setPerbaikanForm({
                                                ...perbaikanForm,
                                                prioritas: e.target
                                                    .value as any,
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                    >
                                        <option value="Rendah">Rendah</option>
                                        <option value="Sedang">Sedang</option>
                                        <option value="Tinggi">Tinggi</option>
                                        <option value="Darurat">Darurat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={perbaikanForm.tanggal_pengajuan}
                                        onChange={(e) =>
                                            setPerbaikanForm({
                                                ...perbaikanForm,
                                                tanggal_pengajuan:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Pelapor / Penanggung Jawab
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={perbaikanForm.pelapor}
                                    onChange={(e) =>
                                        setPerbaikanForm({
                                            ...perbaikanForm,
                                            pelapor: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Deskripsi Kerusakan & Rencana Servis
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Jelaskan kendala dan suku cadang / penanganan yang diperlukan..."
                                    value={perbaikanForm.deskripsi_kerusakan}
                                    onChange={(e) =>
                                        setPerbaikanForm({
                                            ...perbaikanForm,
                                            deskripsi_kerusakan: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsPerbaikanModalOpen(false)
                                    }
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
                                >
                                    Simpan Perbaikan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 3: Selesaikan Perbaikan */}
            {isSelesaiModalOpen && selectedPerbaikan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">
                                Selesaikan Perbaikan Aset
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsSelesaiModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmitSelesai}
                            className="mt-4 space-y-4"
                        >
                            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                                <p className="font-semibold text-slate-900">
                                    {selectedPerbaikan.aset?.nama_aset}
                                </p>
                                <p>
                                    No Tiket: {selectedPerbaikan.nomor_laporan}
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Teknisi / Bengkel Servis
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Teknisi Listrik Internal / CV Mandiri Jaya"
                                    value={selesaiForm.teknisi}
                                    onChange={(e) =>
                                        setSelesaiForm({
                                            ...selesaiForm,
                                            teknisi: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Biaya Riil Perbaikan (Rp)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={selesaiForm.biaya}
                                    onChange={(e) =>
                                        setSelesaiForm({
                                            ...selesaiForm,
                                            biaya: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Tanggal Selesai
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={selesaiForm.tanggal_selesai}
                                    onChange={(e) =>
                                        setSelesaiForm({
                                            ...selesaiForm,
                                            tanggal_selesai: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Catatan Penyelesaian
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Komponen yang diganti, garansi, dll..."
                                    value={selesaiForm.catatan_penyelesaian}
                                    onChange={(e) =>
                                        setSelesaiForm({
                                            ...selesaiForm,
                                            catatan_penyelesaian:
                                                e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <p className="rounded-lg border border-emerald-100 bg-emerald-50 p-2.5 text-xs text-emerald-700">
                                Menyimpan status Selesai akan otomatis
                                memulihkan kondisi aset menjadi{' '}
                                <strong>Baik</strong> dan status{' '}
                                <strong>Tersedia</strong> di inventaris aktif.
                            </p>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsSelesaiModalOpen(false)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
                                >
                                    Selesaikan Perbaikan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 4: Afkir / Hapus Aset */}
            {isHapusModalOpen && hapusTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                            <h3 className="text-lg font-bold text-rose-900">
                                Afkir / Hapus Aset dari Inventaris
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsHapusModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmitHapus}
                            className="mt-4 space-y-4"
                        >
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                                <p className="font-semibold">
                                    {hapusTarget.nama_aset} (
                                    {hapusTarget.kode_aset})
                                </p>
                                <p className="mt-0.5">
                                    Aset akan dipindahkan ke tab Arsip
                                    Dihapuskan dan tidak lagi aktif digunakan.
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Tanggal Penghapusan
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={hapusForm.tanggal_penghapusan}
                                    onChange={(e) =>
                                        setHapusForm({
                                            ...hapusForm,
                                            tanggal_penghapusan: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Alasan Penghapusan / Afkir
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={hapusForm.alasan_penghapusan}
                                    onChange={(e) =>
                                        setHapusForm({
                                            ...hapusForm,
                                            alasan_penghapusan: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsHapusModalOpen(false)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-800"
                                >
                                    Konfirmasi Hapus / Afkir
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
