import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    FileCheck,
    FileText,
    Mail,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';

export interface SuratItem {
    id: number;
    no_surat: string;
    tanggal_diterima: string;
    asal_pengirim: string;
    perihal: string;
    file_dokumen?: string | null;
    file_url?: string | null;
}

export default function SuratMenyurat() {
    const [suratList, setSuratList] = useState<SuratItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    // Hidden input ref for row-level document upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingItemId, setUploadingItemId] = useState<number | null>(null);

    // Form modal state
    const [formData, setFormData] = useState<{
        no_surat: string;
        tanggal_diterima: string;
        asal_pengirim: string;
        perihal: string;
        file_dokumen?: string | null;
    }>({
        no_surat: '',
        tanggal_diterima: new Date().toISOString().split('T')[0],
        asal_pengirim: '',
        perihal: '',
        file_dokumen: null,
    });

    const triggerNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3500);
    };

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return suratList;
        const q = searchQuery.toLowerCase();
        return suratList.filter(
            (item) =>
                item.no_surat.toLowerCase().includes(q) ||
                item.asal_pengirim.toLowerCase().includes(q) ||
                item.perihal.toLowerCase().includes(q),
        );
    }, [suratList, searchQuery]);

    const handleOpenCreate = () => {
        setFormData({
            no_surat: '',
            tanggal_diterima: new Date().toISOString().split('T')[0],
            asal_pengirim: '',
            perihal: '',
            file_dokumen: null,
        });
        setIsFormOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !formData.no_surat ||
            !formData.asal_pengirim ||
            !formData.perihal
        ) {
            alert('Mohon lengkapi No Surat, Asal Pengirim, dan Perihal.');
            return;
        }

        const newItem: SuratItem = {
            id: Date.now(),
            no_surat: formData.no_surat.trim(),
            tanggal_diterima: formData.tanggal_diterima,
            asal_pengirim: formData.asal_pengirim.trim(),
            perihal: formData.perihal.trim(),
            file_dokumen: formData.file_dokumen || null,
            file_url: formData.file_dokumen ? '#' : null,
        };

        setSuratList((prev) => [newItem, ...prev]);
        setIsFormOpen(false);
        triggerNotification(`Surat "${newItem.no_surat}" berhasil dicatat.`);
    };

    const handleDelete = (id: number) => {
        const item = suratList.find((s) => s.id === id);
        if (!item) return;

        if (
            confirm(
                `Hapus surat "${item.no_surat}" dari ${item.asal_pengirim}?`,
            )
        ) {
            setSuratList((prev) => prev.filter((s) => s.id !== id));
            triggerNotification(`Surat "${item.no_surat}" berhasil dihapus.`);
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
            setSuratList((prev) =>
                prev.map((item) =>
                    item.id === uploadingItemId
                        ? {
                              ...item,
                              file_dokumen: file.name,
                              file_url: URL.createObjectURL(file),
                          }
                        : item,
                ),
            );
            triggerNotification(`Dokumen "${file.name}" berhasil diunggah.`);
        }
        setUploadingItemId(null);
    };

    return (
        <DashboardLayout title="Modul Administrasi">
            <Head title="Surat Menyurat - Administrasi" />

            {/* Hidden File Input for Row Upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleRowFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            <div className="space-y-5">
                {/* Notification */}
                {notification && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xs">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
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
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">
                                    Agenda Surat Masuk
                                </h1>
                                <p className="text-xs text-slate-300">
                                    Pencatatan surat masuk lembaga dan
                                    pengarsipan berkas dokumen resmi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-blue-200 sm:flex">
                                <FileText className="h-3.5 w-3.5" />
                                <span>Total: {suratList.length} surat</span>
                            </div>

                            <button
                                onClick={handleOpenCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Surat</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan No Surat, Asal Pengirim, atau Perihal..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-8 pl-9 text-xs text-gray-800 placeholder-gray-400 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-xs hover:bg-gray-50 sm:self-auto"
                        >
                            <RotateCcw className="h-3 w-3" />
                            <span>Reset Pencarian</span>
                        </button>
                    )}
                </div>

                {/* Table: 6 Columns (No, No Surat, Tanggal Diterima, Asal Pengirim, Perihal, Aksi) */}
                <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                <tr>
                                    <th className="w-12 px-4 py-3.5 text-center">
                                        No
                                    </th>
                                    <th className="w-52 px-4 py-3.5">
                                        No Surat
                                    </th>
                                    <th className="w-36 px-4 py-3.5">
                                        Tanggal Diterima
                                    </th>
                                    <th className="w-56 px-4 py-3.5">
                                        Asal Pengirim
                                    </th>
                                    <th className="px-4 py-3.5">Perihal</th>
                                    <th className="w-48 px-4 py-3.5 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-12 text-center text-gray-400"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Mail className="h-8 w-8 text-gray-300" />
                                                <p className="text-xs font-semibold text-gray-600">
                                                    {suratList.length === 0
                                                        ? 'Belum ada agenda surat masuk yang dicatat'
                                                        : 'Tidak ada data surat yang cocok dengan pencarian'}
                                                </p>
                                                <p className="text-[11px] text-gray-400">
                                                    {suratList.length === 0
                                                        ? 'Klik tombol "Tambah Surat" di atas untuk mencatat surat masuk baru.'
                                                        : `Coba gunakan kata kunci lain atau bersihkan pencarian "${searchQuery}".`}
                                                </p>
                                                {suratList.length === 0 ? (
                                                    <button
                                                        onClick={
                                                            handleOpenCreate
                                                        }
                                                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        <span>
                                                            Tambah Surat
                                                            Sekarang
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            setSearchQuery('')
                                                        }
                                                        className="mt-2 inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
                                                    >
                                                        Bersihkan Pencarian
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-gray-50/60"
                                        >
                                            <td className="px-4 py-3.5 text-center font-medium text-gray-400">
                                                {idx + 1}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <span className="block font-mono text-xs font-bold text-gray-900">
                                                    {item.no_surat}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-gray-700">
                                                    <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                                    <span className="font-medium tabular-nums">
                                                        {item.tanggal_diterima}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <span
                                                    className="block max-w-xs truncate font-semibold text-gray-900"
                                                    title={item.asal_pengirim}
                                                >
                                                    {item.asal_pengirim}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <p
                                                    className="line-clamp-2 max-w-md font-medium text-gray-800"
                                                    title={item.perihal}
                                                >
                                                    {item.perihal}
                                                </p>
                                            </td>

                                            <td className="px-4 py-3.5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Upload Dokumen Action */}
                                                    {item.file_dokumen ? (
                                                        <div className="flex items-center gap-1">
                                                            <a
                                                                href={
                                                                    item.file_url ||
                                                                    '#'
                                                                }
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                                                title={`Lihat file: ${item.file_dokumen}`}
                                                            >
                                                                <FileCheck className="h-3.5 w-3.5" />
                                                                <span className="max-w-[80px] truncate">
                                                                    {
                                                                        item.file_dokumen
                                                                    }
                                                                </span>
                                                            </a>
                                                            <button
                                                                onClick={() =>
                                                                    handleTriggerRowUpload(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                                                                title="Ganti Dokumen"
                                                            >
                                                                <Upload className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleTriggerRowUpload(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100 active:scale-[0.98]"
                                                            title="Unggah berkas dokumen surat"
                                                        >
                                                            <Upload className="h-3.5 w-3.5" />
                                                            <span>
                                                                Upload Dokumen
                                                            </span>
                                                        </button>
                                                    )}

                                                    {/* Hapus Action */}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus Surat"
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

            {/* Modal Tambah Surat */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Catat Surat Masuk
                                    </h3>
                                    <p className="text-[11px] text-gray-500">
                                        Masukkan data pokok surat masuk ke dalam
                                        buku agenda.
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

                        {/* Modal Body */}
                        <form
                            onSubmit={handleFormSubmit}
                            className="space-y-4 p-6"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    No Surat{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: 421.3/089/Disdik-Kab/II/2026"
                                    value={formData.no_surat}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            no_surat: e.target.value,
                                        })
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                                        Tanggal Diterima{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.tanggal_diterima}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tanggal_diterima:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                                        Asal Pengirim{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Dinas Pendidikan"
                                        value={formData.asal_pengirim}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                asal_pengirim: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    Perihal{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Tuliskan pokok atau perihal surat..."
                                    value={formData.perihal}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            perihal: e.target.value,
                                        })
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700">
                                    Dokumen / Lampiran{' '}
                                    <span className="font-normal text-gray-400">
                                        (opsional)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setFormData({
                                            ...formData,
                                            file_dokumen: file
                                                ? file.name
                                                : null,
                                        });
                                    }}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-2 text-xs text-gray-800 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
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
                                    Simpan Surat
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
