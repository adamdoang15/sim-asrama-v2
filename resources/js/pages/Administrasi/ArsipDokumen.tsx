import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    Archive,
    Calendar,
    CheckCircle2,
    FileCheck,
    FileText,
    Filter,
    FolderKanban,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';

export type KategoriArsip =
    | 'Legalitas & Perizinan'
    | 'SK & Surat Tugas'
    | 'MoU & Kerjasama'
    | 'SOP & Pedoman'
    | 'Lainnya';

export interface ArsipItem {
    id: number;
    nama_dokumen: string;
    kategori: KategoriArsip;
    tanggal_dokumen: string;
    keterangan: string;
    file_nama?: string | null;
    file_url?: string | null;
}

const KATEGORI_OPTIONS: KategoriArsip[] = [
    'Legalitas & Perizinan',
    'SK & Surat Tugas',
    'MoU & Kerjasama',
    'SOP & Pedoman',
    'Lainnya',
];

export default function ArsipDokumen() {
    const [arsipList, setArsipList] = useState<ArsipItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKategori, setFilterKategori] = useState<string>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    // Hidden input ref for row-level document upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingItemId, setUploadingItemId] = useState<number | null>(null);

    // Form modal state
    const [formData, setFormData] = useState<{
        nama_dokumen: string;
        kategori: KategoriArsip;
        tanggal_dokumen: string;
        keterangan: string;
        file_nama?: string | null;
    }>({
        nama_dokumen: '',
        kategori: 'SK & Surat Tugas',
        tanggal_dokumen: new Date().toISOString().split('T')[0],
        keterangan: '',
        file_nama: null,
    });

    const triggerNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3500);
    };

    // Filtered items based on search and category
    const filteredItems = useMemo(() => {
        return arsipList.filter((item) => {
            if (filterKategori !== 'all' && item.kategori !== filterKategori) return false;
            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            return (
                item.nama_dokumen.toLowerCase().includes(q) ||
                item.keterangan.toLowerCase().includes(q) ||
                item.kategori.toLowerCase().includes(q)
            );
        });
    }, [arsipList, searchQuery, filterKategori]);

    const handleOpenCreate = () => {
        setFormData({
            nama_dokumen: '',
            kategori: 'SK & Surat Tugas',
            tanggal_dokumen: new Date().toISOString().split('T')[0],
            keterangan: '',
            file_nama: null,
        });
        setIsFormOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nama_dokumen) {
            alert('Mohon isi nama dokumen.');
            return;
        }

        const newItem: ArsipItem = {
            id: Date.now(),
            nama_dokumen: formData.nama_dokumen.trim(),
            kategori: formData.kategori,
            tanggal_dokumen: formData.tanggal_dokumen,
            keterangan: formData.keterangan.trim(),
            file_nama: formData.file_nama || null,
            file_url: formData.file_nama ? '#' : null,
        };

        setArsipList((prev) => [newItem, ...prev]);
        setIsFormOpen(false);
        triggerNotification(`Arsip "${newItem.nama_dokumen}" berhasil disimpan.`);
    };

    const handleDelete = (id: number) => {
        const item = arsipList.find((a) => a.id === id);
        if (!item) return;

        if (confirm(`Hapus arsip dokumen "${item.nama_dokumen}"?`)) {
            setArsipList((prev) => prev.filter((a) => a.id !== id));
            triggerNotification(`Arsip "${item.nama_dokumen}" berhasil dihapus.`);
        }
    };

    const handleTriggerRowUpload = (id: number) => {
        setUploadingItemId(id);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handleRowFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingItemId !== null) {
            setArsipList((prev) =>
                prev.map((item) =>
                    item.id === uploadingItemId
                        ? {
                              ...item,
                              file_nama: file.name,
                              file_url: URL.createObjectURL(file),
                          }
                        : item
                )
            );
            triggerNotification(`Dokumen "${file.name}" berhasil diunggah.`);
        }
        setUploadingItemId(null);
    };

    const getKategoriBadgeClass = (kategori: KategoriArsip) => {
        switch (kategori) {
            case 'Legalitas & Perizinan':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'SK & Surat Tugas':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'MoU & Kerjasama':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'SOP & Pedoman':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <DashboardLayout title="Modul Administrasi">
            <Head title="Arsip Dokumen - Administrasi" />

            {/* Hidden File Input for Row Upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleRowFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />

            <div className="space-y-5">
                {/* Notification */}
                {notification && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{notification}</span>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="rounded-md p-1 text-emerald-600 hover:bg-emerald-100"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                )}

                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Archive className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">Arsip Dokumen Lembaga</h1>
                                <p className="text-xs text-slate-300">
                                    Penyimpanan berkas legalitas, SK pengangkatan, MoU kerjasama, dan pedoman SOP asrama.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-blue-200">
                                <FolderKanban className="h-3.5 w-3.5" />
                                <span>{arsipList.length} Berkas Tersimpan</span>
                            </div>

                            <button
                                onClick={handleOpenCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Unggah Arsip Baru</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama berkas, nomor SK, atau kata kunci..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-8 text-xs text-gray-800 placeholder-gray-400 shadow-xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-xs">
                            <Filter className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <select
                                value={filterKategori}
                                onChange={(e) => setFilterKategori(e.target.value)}
                                className="bg-transparent text-xs font-medium text-gray-700 focus:outline-hidden cursor-pointer"
                            >
                                <option value="all">Semua Kategori</option>
                                {KATEGORI_OPTIONS.map((kat) => (
                                    <option key={kat} value={kat}>
                                        {kat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {(searchQuery || filterKategori !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterKategori('all');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-xs hover:bg-gray-50 self-start sm:self-auto"
                        >
                            <RotateCcw className="h-3 w-3" />
                            <span>Reset Filter</span>
                        </button>
                    )}
                </div>

                {/* Table: 6 Columns (No, Nama Dokumen, Kategori, Tanggal Dokumen, Keterangan, Aksi) */}
                <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                                    <th className="py-3.5 px-4">Nama Dokumen</th>
                                    <th className="py-3.5 px-4 w-48">Kategori Arsip</th>
                                    <th className="py-3.5 px-4 w-36">Tanggal Dokumen</th>
                                    <th className="py-3.5 px-4">Keterangan</th>
                                    <th className="py-3.5 px-4 text-center w-48">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Archive className="h-8 w-8 text-gray-300" />
                                                <p className="text-xs font-semibold text-gray-600">
                                                    {arsipList.length === 0
                                                        ? 'Belum ada arsip dokumen yang disimpan'
                                                        : 'Tidak ada dokumen yang sesuai dengan filter'}
                                                </p>
                                                <p className="text-[11px] text-gray-400">
                                                    {arsipList.length === 0
                                                        ? 'Klik tombol "Unggah Arsip Baru" untuk menambahkan berkas resmi lembaga.'
                                                        : 'Coba ubah kata kunci pencarian atau pilih kategori lain.'}
                                                </p>
                                                {arsipList.length === 0 ? (
                                                    <button
                                                        onClick={handleOpenCreate}
                                                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        <span>Unggah Dokumen Sekarang</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setSearchQuery('');
                                                            setFilterKategori('all');
                                                        }}
                                                        className="mt-2 inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition"
                                                    >
                                                        Bersihkan Filter
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-gray-50/60 transition">
                                            <td className="py-3.5 px-4 text-center font-medium text-gray-400">
                                                {idx + 1}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                                                    <span className="font-semibold text-gray-900 block">
                                                        {item.nama_dokumen}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getKategoriBadgeClass(
                                                        item.kategori
                                                    )}`}
                                                >
                                                    {item.kategori}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-gray-700">
                                                    <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                    <span className="font-medium tabular-nums">{item.tanggal_dokumen}</span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p className="font-medium text-gray-600 line-clamp-2 max-w-sm" title={item.keterangan}>
                                                    {item.keterangan || '-'}
                                                </p>
                                            </td>

                                            <td className="py-3.5 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {item.file_nama ? (
                                                        <div className="flex items-center gap-1">
                                                            <a
                                                                href={item.file_url || '#'}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                                                                title={`Buka file: ${item.file_nama}`}
                                                            >
                                                                <FileCheck className="h-3.5 w-3.5" />
                                                                <span className="max-w-[80px] truncate">{item.file_nama}</span>
                                                            </a>
                                                            <button
                                                                onClick={() => handleTriggerRowUpload(item.id)}
                                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                                                                title="Ganti Berkas Dokumen"
                                                            >
                                                                <Upload className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleTriggerRowUpload(item.id)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition active:scale-[0.98]"
                                                            title="Unggah berkas dokumen"
                                                        >
                                                            <Upload className="h-3.5 w-3.5" />
                                                            <span>Upload Dokumen</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus Dokumen"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
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

            {/* Modal Unggah Arsip Baru */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/80">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                    <Archive className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Unggah Arsip Dokumen Baru</h3>
                                    <p className="text-[11px] text-gray-500">
                                        Catat berkas dokumen resmi ke dalam lemari arsip digital.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Nama / Judul Dokumen <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: SK Pengangkatan Pembina Asrama 2026"
                                    value={formData.nama_dokumen}
                                    onChange={(e) => setFormData({ ...formData, nama_dokumen: e.target.value })}
                                    required
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Kategori Dokumen <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.kategori}
                                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriArsip })}
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    >
                                        {KATEGORI_OPTIONS.map((kat) => (
                                            <option key={kat} value={kat}>
                                                {kat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Tanggal Dokumen <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.tanggal_dokumen}
                                        onChange={(e) => setFormData({ ...formData, tanggal_dokumen: e.target.value })}
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Keterangan / Catatan Dokumen
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Nomor SK, pihak yang bertandatangan, atau catatan masa berlaku berkas..."
                                    value={formData.keterangan}
                                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Berkas Dokumen <span className="text-gray-400 font-normal">(PDF, DOC, Gambar)</span>
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setFormData({
                                            ...formData,
                                            file_nama: file ? file.name : null,
                                        });
                                    }}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98]"
                                >
                                    Simpan Arsip
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
