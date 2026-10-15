import DashboardLayout from '@/layouts/DashboardLayout';
import { router } from '@inertiajs/react';
import {
    Building,
    CheckCircle2,
    Coins,
    DollarSign,
    Layers,
    MapPin,
    Package,
    Plus,
    Search,
    ShoppingCart,
    Trash2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

export interface PengadaanItem {
    id: number;
    nomor_pengadaan: string;
    nama_barang: string;
    lembaga?: string;
    kategori: string;
    lokasi_tujuan: string;
    jumlah: number;
    satuan: string;
    estimasi_biaya: number | null;
    sumber_dana: string | null;
    status: string;
    tanggal_pengajuan: string;
    tanggal_diterima: string | null;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    pengadaans: PengadaanItem[];
    filters: {
        search: string;
        status: string;
        lembaga?: string;
    };
    options: {
        kategori: string[];
        lokasi: string[];
        status: string[];
        lembaga?: string[];
        lembaga_ruangan?: Record<string, string[]>;
    };
    stats: {
        total_pengadaan: number;
        diajukan: number;
        disetujui: number;
        diterima: number;
        estimasi_total: number;
    };
}

export default function Pengadaan({ pengadaans, filters, options, stats }: Props) {
    const lembagaList = options.lembaga || ['Lembaga 1', 'Lembaga 2', 'Lembaga 3'];
    const initialLembaga = filters.lembaga || lembagaList[0] || 'Lembaga 1';
    const getRoomsForLembaga = (lem: string) => options.lembaga_ruangan?.[lem] || options.lokasi || [];

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedLembaga, setSelectedLembaga] = useState(filters.lembaga || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nama_barang: '',
        lembaga: initialLembaga,
        kategori: options.kategori[0] || 'Mebel & Furnitur',
        lokasi_tujuan: getRoomsForLembaga(initialLembaga)[0] || options.lokasi[0] || '',
        jumlah: 1,
        satuan: 'Unit',
        estimasi_biaya: '',
        sumber_dana: 'Yayasan / Asrama',
        tanggal_pengajuan: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    const handleLembagaSelectInForm = (lem: string) => {
        const rooms = getRoomsForLembaga(lem);
        setFormData({
            ...formData,
            lembaga: lem,
            lokasi_tujuan: rooms[0] || '',
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/sarpras/pengadaan',
            { search: searchQuery, lembaga: selectedLembaga },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleSubmitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            '/sarpras/pengadaan',
            {
                ...formData,
                estimasi_biaya: formData.estimasi_biaya ? parseFloat(formData.estimasi_biaya) : 0,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    setFormData({
                        nama_barang: '',
                        lembaga: initialLembaga,
                        kategori: options.kategori[0] || 'Mebel & Furnitur',
                        lokasi_tujuan: getRoomsForLembaga(initialLembaga)[0] || options.lokasi[0] || '',
                        jumlah: 1,
                        satuan: 'Unit',
                        estimasi_biaya: '',
                        sumber_dana: 'Yayasan / Asrama',
                        tanggal_pengajuan: new Date().toISOString().split('T')[0],
                        keterangan: '',
                    });
                },
            }
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

    const handleDelete = (item: PengadaanItem) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus transaksi pembelian "${item.nama_barang}" (${item.nomor_pengadaan})?\nData barang terkait di inventaris aktif juga akan otomatis dibersihkan.`
            )
        ) {
            router.delete(`/sarpras/pengadaan/${item.id}`, {
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
                                <ShoppingCart className="h-6 w-6" />
                            </span>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Pengadaan & Pembelian Aset
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Catat pembelian dan belanja aset baru — otomatis langsung masuk ke Inventaris aktif
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 transition"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Catat Pengadaan Aset Baru</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Total Pembelian
                            </span>
                            <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                                <Package className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-slate-900">{stats.total_pengadaan}</p>
                        <p className="mt-1 text-xs text-slate-500">Transaksi pengadaan tercatat</p>
                    </div>

                    <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                                Total Nilai Belanja
                            </span>
                            <span className="rounded-lg bg-teal-100 p-2 text-teal-700">
                                <Coins className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-xl font-bold text-teal-900 truncate">
                            {formatCurrency(stats.estimasi_total)}
                        </p>
                        <p className="mt-1 text-xs text-teal-700">Akumulasi biaya perolehan</p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                Masuk ke Inventaris
                            </span>
                            <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                                <CheckCircle2 className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-2xl font-bold text-emerald-900">{stats.diterima}</p>
                        <p className="mt-1 text-xs text-emerald-700">Aset aktif dan tersedia</p>
                    </div>
                </div>

                {/* Table Data & Search */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-900">Riwayat Pembelian & Belanja Aset</h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                {pengadaans.length} data
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <select
                                value={selectedLembaga}
                                onChange={(e) => {
                                    setSelectedLembaga(e.target.value);
                                    router.get(
                                        '/sarpras/pengadaan',
                                        { search: searchQuery, lembaga: e.target.value },
                                        { preserveState: true, preserveScroll: true, replace: true }
                                    );
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                                <option value="">Semua Lembaga</option>
                                {lembagaList.map((lem) => (
                                    <option key={lem} value={lem}>{lem}</option>
                                ))}
                            </select>

                            <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama barang, no pengadaan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-600">
                                <tr>
                                    <th scope="col" className="px-5 py-3.5">No & Tanggal Beli</th>
                                    <th scope="col" className="px-5 py-3.5">Nama Barang & Kategori</th>
                                    <th scope="col" className="px-5 py-3.5">Lokasi Tujuan</th>
                                    <th scope="col" className="px-5 py-3.5 text-center">Jumlah</th>
                                    <th scope="col" className="px-5 py-3.5 text-right">Biaya Perolehan</th>
                                    <th scope="col" className="px-5 py-3.5">Sumber Dana</th>
                                    <th scope="col" className="px-5 py-3.5 text-center">Status</th>
                                    <th scope="col" className="px-5 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {pengadaans.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            Belum ada transaksi pembelian aset yang dicatat
                                        </td>
                                    </tr>
                                ) : (
                                    pengadaans.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                            <td className="px-5 py-4">
                                                <div className="font-mono font-semibold text-slate-900">{item.nomor_pengadaan}</div>
                                                <div className="text-xs text-slate-500">{formatDate(item.tanggal_pengajuan)}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-slate-900">{item.nama_barang}</div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <span>{item.kategori}</span>
                                                    {item.lembaga && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60">{item.lembaga}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-slate-700">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {item.lokasi_tujuan}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center font-medium text-slate-800">
                                                {item.jumlah} {item.satuan}
                                            </td>
                                            <td className="px-5 py-4 text-right font-medium text-slate-900">
                                                {formatCurrency(item.estimasi_biaya)}
                                            </td>
                                            <td className="px-5 py-4 text-slate-700">
                                                {item.sumber_dana || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>Inventaris Aktif</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 transition"
                                                    title="Hapus riwayat belanja"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span>Hapus</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Catat Pembelian Aset Baru */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">Catat Pengadaan     Aset Baru</h3>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitAdd} className="mt-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">Nama Barang / Aset</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Meja Belajar Santri 4 Seater"
                                    value={formData.nama_barang}
                                    onChange={(e) => setFormData({ ...formData, nama_barang: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">Lembaga</label>
                                    <select
                                        value={formData.lembaga}
                                        onChange={(e) => handleLembagaSelectInForm(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    >
                                        {lembagaList.map((lem) => (
                                            <option key={lem} value={lem}>{lem}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">Kategori</label>
                                    <select
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    >
                                        {options.kategori.map((k) => (
                                            <option key={k} value={k}>{k}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">Lokasi / Ruangan Tujuan ({formData.lembaga})</label>
                                <select
                                    value={formData.lokasi_tujuan}
                                    onChange={(e) => setFormData({ ...formData, lokasi_tujuan: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                >
                                    {getRoomsForLembaga(formData.lembaga).map((l) => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">Jumlah</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.jumlah}
                                        onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 1 })}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">Satuan</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Unit, Pcs, Set"
                                        value={formData.satuan}
                                        onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">Total Biaya (Rp)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={formData.estimasi_biaya}
                                        onChange={(e) => setFormData({ ...formData, estimasi_biaya: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">Sumber Dana</label>
                                    <input
                                        type="text"
                                        value={formData.sumber_dana}
                                        onChange={(e) => setFormData({ ...formData, sumber_dana: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">Tanggal Beli / Perolehan</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.tanggal_pengajuan}
                                        onChange={(e) => setFormData({ ...formData, tanggal_pengajuan: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">Keterangan / Spesifikasi</label>
                                <textarea
                                    rows={2}
                                    placeholder="Merk, tipe, toko pembelian, garansi..."
                                    value={formData.keterangan}
                                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                />
                            </div>

                            <div className="rounded-lg bg-teal-50 p-3 text-xs text-teal-800 border border-teal-100 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                                <span>Aset yang dicatat di sini akan otomatis langsung muncul di halaman <strong>Inventaris Aset</strong> dengan status <strong>Tersedia</strong> dan kondisi <strong>Baik</strong>.</span>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
                                >
                                    Simpan & Masuk Inventaris
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
