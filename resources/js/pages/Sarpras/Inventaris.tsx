import DashboardLayout from '@/layouts/DashboardLayout';
import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    Building,
    CheckCircle2,
    Coins,
    Eye,
    Filter,
    Layers,
    MapPin,
    Package,
    Search,
    ShieldAlert,
    Trash2,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

export interface AsetItem {
    id: number;
    kode_aset: string;
    nama_aset: string;
    lembaga?: string;
    kategori: string;
    lokasi: string;
    jumlah: number;
    satuan: string;
    kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
    status: 'Tersedia' | 'Tidak Tersedia' | 'Dalam Perbaikan' | 'Dihapuskan';
    tanggal_perolehan: string | null;
    nilai_perolehan: number | null;
    tanggal_pemeriksaan_terakhir: string | null;
    catatan_pemeriksaan: string | null;
    alasan_penghapusan: string | null;
    tanggal_penghapusan: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    asets: AsetItem[];
    filters: {
        tab?: string;
        search: string;
        lembaga?: string;
        kategori: string;
        lokasi: string;
        kondisi: string;
    };
    options: {
        kategori: string[];
        lokasi: string[];
        kondisi: string[];
        status: string[];
        lembaga?: string[];
        lembaga_ruangan?: Record<string, string[]>;
    };
    stats: {
        total_aset: number;
        kondisi_baik: number;
        kondisi_rusak: number;
        dihapuskan: number;
        total_nilai: number;
    };
}

export default function Inventaris({ asets, filters, options, stats }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedKategori, setSelectedKategori] = useState(filters.kategori || '');
    const [selectedLokasi, setSelectedLokasi] = useState(filters.lokasi || '');
    const [selectedKondisi, setSelectedKondisi] = useState(filters.kondisi || '');

    // Detail Modal State
    const [selectedAset, setSelectedAset] = useState<AsetItem | null>(null);

    const handleFilterChange = (updates: Record<string, string>) => {
        router.get(
            '/sarpras/inventaris',
            {
                search: searchQuery,
                kategori: selectedKategori,
                lokasi: selectedLokasi,
                kondisi: selectedKondisi,
                ...updates,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange({ search: searchQuery });
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Tersedia':
                return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'Tidak Tersedia':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Dalam Perbaikan':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Dihapuskan':
                return 'bg-zinc-100 text-zinc-600 border-zinc-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const handleDeleteAset = (aset: AsetItem) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus permanen aset "${aset.nama_aset}" (${aset.kode_aset})?\nData akan dihapus dari sistem.`
            )
        ) {
            router.delete(`/sarpras/inventaris/${aset.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-teal-100 p-2 text-teal-800">
                                <Package className="h-6 w-6" />
                            </span>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Data Inventaris Aset
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Katalog dan pemantauan data seluruh aset sarana prasarana asrama.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Aset Aktif
                            </span>
                            <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                <Layers className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-slate-900">{stats.total_aset}</p>
                        <p className="mt-1 text-xs text-slate-500">Item tercatat dalam sistem</p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                Kondisi Baik
                            </span>
                            <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                                <CheckCircle2 className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-emerald-900">{stats.kondisi_baik}</p>
                        <p className="mt-1 text-xs text-emerald-700">Siap & layak digunakan</p>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                                Perlu Penanganan
                            </span>
                            <span className="rounded-lg bg-amber-100 p-2 text-amber-700">
                                <AlertTriangle className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-amber-900">{stats.kondisi_rusak}</p>
                        <p className="mt-1 text-xs text-amber-700">Rusak ringan & berat</p>
                    </div>

                    <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                                Total Nilai Aset
                            </span>
                            <span className="rounded-lg bg-teal-100 p-2 text-teal-700">
                                <Coins className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-xl font-bold text-teal-900 truncate">
                            {formatCurrency(stats.total_nilai)}
                        </p>
                        <p className="mt-1 text-xs text-teal-700">Estimasi aset aktif</p>
                    </div>
                </div>

                {/* Tabs & Filter Bar */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
                        {/* Title / Badge */}
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                                <Package className="h-4 w-4" />
                                <span>Aset Aktif</span>
                                <span className="ml-1 rounded-full bg-teal-800 px-2 py-0.5 text-xs text-teal-100">
                                    {stats.total_aset}
                                </span>
                            </div>
                        </div>

                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, kode, lokasi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                        </form>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Kategori</label>
                            <select
                                value={selectedKategori}
                                onChange={(e) => {
                                    setSelectedKategori(e.target.value);
                                    handleFilterChange({ kategori: e.target.value });
                                }}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                                <option value="">Semua Kategori</option>
                                {options.kategori.map((kat) => (
                                    <option key={kat} value={kat}>
                                        {kat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Lokasi Penempatan</label>
                            <select
                                value={selectedLokasi}
                                onChange={(e) => {
                                    setSelectedLokasi(e.target.value);
                                    handleFilterChange({ lokasi: e.target.value });
                                }}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                                <option value="">Semua Lokasi</option>
                                {options.lokasi.map((lok) => (
                                    <option key={lok} value={lok}>
                                        {lok}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Kondisi Fisik</label>
                            <select
                                value={selectedKondisi}
                                onChange={(e) => {
                                    setSelectedKondisi(e.target.value);
                                    handleFilterChange({ kondisi: e.target.value });
                                }}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                                <option value="">Semua Kondisi</option>
                                {options.kondisi.map((kon) => (
                                    <option key={kon} value={kon}>
                                        {kon}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-600">
                                <tr>
                                    <th scope="col" className="px-5 py-3.5">Kode & Nama Aset</th>
                                    <th scope="col" className="px-5 py-3.5">Kategori</th>
                                    <th scope="col" className="px-5 py-3.5">Lokasi</th>
                                    <th scope="col" className="px-5 py-3.5 text-center">Jumlah</th>
                                    <th scope="col" className="px-5 py-3.5 text-center">Kondisi</th>
                                    <th scope="col" className="px-5 py-3.5 text-center">Status</th>
                                    <th scope="col" className="px-5 py-3.5 text-right">Nilai Perolehan</th>
                                    <th scope="col" className="px-5 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {asets.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Package className="h-8 w-8 text-slate-300" />
                                                <p className="font-medium text-slate-500">Tidak ada data aset ditemukan</p>
                                                <p className="text-xs text-slate-400">
                                                    Gunakan kata kunci pencarian atau ubah filter di atas
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    asets.map((aset) => (
                                        <tr key={aset.id} className="hover:bg-slate-50/60 transition">
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-slate-900">{aset.nama_aset}</div>
                                                <div className="font-mono text-xs text-slate-500">{aset.kode_aset}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-slate-700">
                                                    <Building className="h-3.5 w-3.5 text-slate-400" />
                                                    {aset.kategori}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-slate-700">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {aset.lokasi}
                                                </span>
                                                {aset.lembaga && (
                                                    <div className="mt-1">
                                                        <span className="inline-block rounded border border-teal-200/60 bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">
                                                            {aset.lembaga}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-center font-medium text-slate-800">
                                                {aset.jumlah} {aset.satuan}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getKondisiBadge(aset.kondisi)}`}>
                                                    {aset.kondisi}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(aset.status)}`}>
                                                    {aset.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right font-medium text-slate-900">
                                                {formatCurrency(aset.nilai_perolehan)}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedAset(aset)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-teal-700 transition"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Detail</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAset(aset)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 transition"
                                                        title="Hapus Permanen Aset"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span>Hapus</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Detail Aset */}
            {selectedAset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="rounded-lg bg-teal-100 p-2 text-teal-800">
                                    <Package className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Rincian Informasi Aset</h3>
                                    <p className="text-xs text-slate-500">Kode: {selectedAset.kode_aset}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAset(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                                <div>
                                    <p className="text-xs text-slate-500">Nama Barang / Aset</p>
                                    <p className="font-semibold text-slate-900">{selectedAset.nama_aset}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Kategori</p>
                                    <p className="font-medium text-slate-800">{selectedAset.kategori}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Lokasi Penempatan</p>
                                    <p className="font-medium text-slate-800">{selectedAset.lokasi}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Kuantitas / Jumlah</p>
                                    <p className="font-medium text-slate-800">{selectedAset.jumlah} {selectedAset.satuan}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Kondisi Fisik</p>
                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-0.5 ${getKondisiBadge(selectedAset.kondisi)}`}>
                                        {selectedAset.kondisi}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Status Operasional</p>
                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-0.5 ${getStatusBadge(selectedAset.status)}`}>
                                        {selectedAset.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Nilai Perolehan</p>
                                    <p className="font-medium text-slate-900">{formatCurrency(selectedAset.nilai_perolehan)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Tanggal Perolehan</p>
                                    <p className="font-medium text-slate-800">{formatDate(selectedAset.tanggal_perolehan)}</p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pemeriksaan Berkala Terakhir</p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Tanggal Cek:</span>
                                    <span className="font-medium text-slate-800">
                                        {selectedAset.tanggal_pemeriksaan_terakhir ? formatDate(selectedAset.tanggal_pemeriksaan_terakhir) : 'Belum pernah dicek'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500">Catatan Kondisi / Temuan:</span>
                                    <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                        {selectedAset.catatan_pemeriksaan || 'Tidak ada catatan temuan.'}
                                    </p>
                                </div>
                            </div>

                            {selectedAset.status === 'Dihapuskan' && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">Informasi Penghapusan Aset</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-rose-600">Tanggal Penghapusan:</span>
                                        <span className="font-medium text-rose-900">{formatDate(selectedAset.tanggal_penghapusan)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-rose-600">Alasan Penghapusan:</span>
                                        <p className="mt-1 text-xs text-rose-900 bg-white/80 p-2.5 rounded-lg border border-rose-200">
                                            {selectedAset.alasan_penghapusan || 'Tidak disertakan alasan.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedAset(null)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
