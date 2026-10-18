import React, { useState, useRef } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AlertTriangle,
    Trophy,
    Download,
    RefreshCcw,
    Search,
    ChevronDown,
    Check,
    Eye,
    Printer,
    Bot,
    CheckCircle,
    Paperclip,
    X,
    Save,
    Edit,
    Trash2,
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

export default function TrackRecord({
    pelanggarans = [],
    prestasis = [],
    gelaras = [],
}: {
    pelanggarans?: any[];
    prestasis?: any[];
    gelaras?: any[];
}) {
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const handleDeletePelanggaran = (id: number) => {
        if (
            window.confirm(
                'Apakah Anda yakin ingin menghapus data pelanggaran ini?',
            )
        ) {
            router.delete(`/kegelaraan/track-record/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            id: null as number | null,
            name: '',
            nim: '',
            room: '',
            category: 'Sedang',
            type: 'info',
            descTitle: '',
            descSub: '',
            attachment: null as File | null,
            _method: 'post',
        });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (record: any) => {
        clearErrors();
        setData({
            id: record.id,
            name: record.name,
            nim: record.nim || '',
            room: record.room || '',
            category: record.category || 'Sedang',
            type: record.type || 'info',
            descTitle: record.descTitle || '',
            descSub: record.descSub || '',
            attachment: null,
            _method: 'put',
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        };

        if (data.id) {
            post('/kegelaraan/track-record/' + data.id, options);
        } else {
            post('/kegelaraan/track-record', options);
        }
    };

    const [isPrestasiModalOpen, setIsPrestasiModalOpen] = useState(false);
    const {
        data: prestasiData,
        setData: setPrestasiData,
        post: postPrestasi,
        put: putPrestasi,
        processing: processingPrestasi,
        errors: errorsPrestasi,
        reset: resetPrestasi,
        clearErrors: clearErrorsPrestasi,
    } = useForm({
        id: null as number | null,
        name: '',
        nim: '',
        title: '',
        level: '',
        attachment: null as File | null,
        _method: 'post',
    });

    const openPrestasiModal = () => {
        resetPrestasi();
        clearErrorsPrestasi();
        setIsPrestasiModalOpen(true);
    };

    const openEditPrestasiModal = (record: any) => {
        clearErrorsPrestasi();
        setPrestasiData({
            id: record.id,
            name: record.name,
            nim: record.nim || '',
            title: record.title || '',
            level: record.level || '',
            attachment: null,
            _method: 'put',
        });
        setIsPrestasiModalOpen(true);
    };

    const handlePrestasiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsPrestasiModalOpen(false);
                resetPrestasi();
            },
        };

        if (prestasiData.id) {
            postPrestasi('/kegelaraan/prestasi/' + prestasiData.id, options);
        } else {
            postPrestasi('/kegelaraan/prestasi', options);
        }
    };

    const handleDeletePrestasi = (id: number) => {
        if (
            window.confirm(
                'Apakah Anda yakin ingin menghapus data prestasi ini?',
            )
        ) {
            router.delete(`/kegelaraan/prestasi/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const [activeTab, setActiveTab] = useState(
        'Daftar Rekam Jejak Pelanggaran',
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const filteredPelanggarans = pelanggarans.filter((p: any) => {
        const matchesSearch =
            (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.nim || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.descTitle || '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesCategory =
            filterCategory === '' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredPrestasis = prestasis.filter((p: any) => {
        const matchesSearch =
            (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.nim || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <DashboardLayout title="Track Record">
            <div className="mx-auto max-w-[1400px] pb-10 font-sans text-slate-800">
                {/* Header Banner Berwarna */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Track Record Kedisiplinan & Prestasi
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Rekam jejak, akumulasi pelanggaran tata
                                    tertib, serta catatan prestasi Gelara
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-900 shadow-xs transition hover:bg-blue-50 active:scale-[0.98]"
                            >
                                <Download className="h-4 w-4" />
                                <span>Ekspor Rekap</span>
                            </button>
                            <button
                                type="button"
                                onClick={openPrestasiModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 active:scale-[0.98]"
                            >
                                <Trophy className="h-4 w-4" />
                                <span>Tambah Prestasi</span>
                            </button>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-red-500 active:scale-[0.98]"
                            >
                                <AlertTriangle className="h-4 w-4" />
                                <span>Catat Pelanggaran</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Banner Sinkronisasi */}
                <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 md:flex-row md:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                            <Check size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-slate-800">
                                    Integrasi Otomatis Daily Activity Aktif
                                </h3>
                                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
                                    ● Sinkron
                                </span>
                            </div>
                            <p className="max-w-3xl text-xs leading-relaxed text-slate-500">
                                Pelanggaran Kategori <b>Sedang</b> terakumulasi
                                langsung dari status <i>Alfa (A)</i> pada
                                presensi. Pelanggaran{' '}
                                <b>Berat, Sangat Berat,</b> dan <b>Prestasi</b>{' '}
                                diverifikasi manual oleh bidang kegelaraan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col items-start gap-6 xl:flex-row">
                    {/* Left Data Section */}
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        {/* Tabs & Controls Container */}
                        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                            <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
                                <button
                                    onClick={() =>
                                        setActiveTab(
                                            'Daftar Rekam Jejak Pelanggaran',
                                        )
                                    }
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${activeTab === 'Daftar Rekam Jejak Pelanggaran' ? 'bg-slate-50 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <AlertTriangle size={16} /> Daftar Rekam
                                    Jejak Pelanggaran{' '}
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === 'Daftar Rekam Jejak Pelanggaran' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}
                                    >
                                        {pelanggarans.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        setActiveTab('Rekam Jejak Prestasi')
                                    }
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${activeTab === 'Rekam Jejak Prestasi' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    Rekam Jejak Prestasi{' '}
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === 'Rekam Jejak Prestasi' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}
                                    >
                                        {prestasis.length}
                                    </span>
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 px-4 pb-2 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari nama Gelara, NIM, catatan..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm font-medium transition-colors focus:border-blue-500 focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <select
                                    value={filterCategory}
                                    onChange={(e) =>
                                        setFilterCategory(e.target.value)
                                    }
                                    className="min-w-[200px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-white focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">
                                        Semua Tingkat Pelanggaran
                                    </option>
                                    <option value="Sedang">Sedang</option>
                                    <option value="Berat">Berat</option>
                                    <option value="Sangat Berat">
                                        Sangat Berat
                                    </option>
                                </select>
                                <select className="min-w-[140px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-white focus:border-blue-500 focus:outline-none">
                                    <option value="">T.A. 2026/2027</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div
                                ref={tableScrollRef}
                                className="custom-scrollbar overflow-x-auto pb-2"
                            >
                                {activeTab ===
                                'Daftar Rekam Jejak Pelanggaran' ? (
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                            <tr>
                                                <th className="w-12 px-5 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-slate-300 text-blue-600"
                                                    />
                                                </th>
                                                <th className="w-40 px-4 py-4">
                                                    Tanggal & Waktu
                                                </th>
                                                <th className="px-4 py-4">
                                                    Nama Gelara
                                                </th>
                                                <th className="px-4 py-4 text-center">
                                                    Kategori
                                                </th>
                                                <th className="px-4 py-4">
                                                    Kronologi
                                                </th>
                                                <th className="px-4 py-4">
                                                    Petugas
                                                </th>
                                                <th className="px-4 py-4 text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredPelanggarans.length ===
                                            0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="px-4 py-8 text-center text-sm text-slate-500"
                                                    >
                                                        Tidak ada data
                                                        pelanggaran ditemukan.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredPelanggarans.map(
                                                    (v: any) => (
                                                        <tr
                                                            key={v.id}
                                                            className="transition-colors hover:bg-slate-50"
                                                        >
                                                            <td className="px-5 py-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-slate-300 text-blue-600"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="font-bold text-slate-800">
                                                                    {v.date}
                                                                </div>
                                                                <div className="text-xs text-slate-400">
                                                                    {v.time}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div
                                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                                            v.type ===
                                                                            'danger'
                                                                                ? 'bg-red-100 text-red-600'
                                                                                : v.type ===
                                                                                    'warning'
                                                                                  ? 'bg-blue-100 text-blue-600'
                                                                                  : 'bg-indigo-100 text-indigo-600'
                                                                        }`}
                                                                    >
                                                                        {v.name
                                                                            .split(
                                                                                ' ',
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    n: string,
                                                                                ) =>
                                                                                    n[0],
                                                                            )
                                                                            .join(
                                                                                '',
                                                                            )
                                                                            .substring(
                                                                                0,
                                                                                2,
                                                                            )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-800">
                                                                            {
                                                                                v.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-slate-500">
                                                                            {
                                                                                v.nim
                                                                            }{' '}
                                                                            {v.room
                                                                                ? `• ${v.room}`
                                                                                : ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="flex justify-center">
                                                                    <div
                                                                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${
                                                                            v.type ===
                                                                            'danger'
                                                                                ? 'bg-red-700 text-white shadow-sm'
                                                                                : v.type ===
                                                                                    'warning'
                                                                                  ? 'border border-red-100 bg-red-50 text-red-600'
                                                                                  : 'border border-blue-100 bg-blue-50 text-blue-600'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            v.category
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="font-bold text-slate-800">
                                                                    {
                                                                        v.descTitle
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-slate-400">
                                                                    {v.descSub}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                {v.isSystem ? (
                                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                                                                        <Bot
                                                                            size={
                                                                                14
                                                                            }
                                                                        />{' '}
                                                                        {
                                                                            v.petugas
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-xs font-medium text-slate-700">
                                                                        {
                                                                            v.petugas
                                                                        }
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-center justify-center gap-3 text-slate-500">
                                                                    <button
                                                                        onClick={() =>
                                                                            openEditModal(
                                                                                v,
                                                                            )
                                                                        }
                                                                        className="transition-colors hover:text-amber-500"
                                                                        title="Edit Data"
                                                                    >
                                                                        <Edit
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
                                                                    {v.attachment && (
                                                                        <a
                                                                            href={`/storage/${v.attachment}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="transition-colors hover:text-emerald-600"
                                                                            title="Lihat Lampiran"
                                                                        >
                                                                            <Paperclip
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </a>
                                                                    )}
                                                                    {v.isSystem ? (
                                                                        <button
                                                                            className="transition-colors hover:text-emerald-600"
                                                                            title="Verifikasi Sistem"
                                                                        >
                                                                            <CheckCircle
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </button>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                className="transition-colors hover:text-blue-600"
                                                                                title="Cetak Surat"
                                                                            >
                                                                                <Printer
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                />
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDeletePelanggaran(
                                                                                        v.id,
                                                                                    )
                                                                                }
                                                                                className="transition-colors hover:text-red-600"
                                                                                title="Hapus Data"
                                                                            >
                                                                                <Trash2
                                                                                    size={
                                                                                        18
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                            <tr>
                                                <th className="w-12 px-5 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-slate-300 text-teal-600"
                                                    />
                                                </th>
                                                <th className="w-40 px-4 py-4">
                                                    Tanggal
                                                </th>
                                                <th className="px-4 py-4">
                                                    Nama Gelara
                                                </th>
                                                <th className="px-4 py-4">
                                                    Nama Prestasi
                                                </th>
                                                <th className="px-4 py-4">
                                                    Tingkat
                                                </th>
                                                <th className="px-4 py-4 text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredPrestasis.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="px-4 py-8 text-center text-sm text-slate-500"
                                                    >
                                                        Tidak ada data prestasi
                                                        ditemukan.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredPrestasis.map(
                                                    (a: any) => (
                                                        <tr
                                                            key={a.id}
                                                            className="transition-colors hover:bg-slate-50"
                                                        >
                                                            <td className="px-5 py-4 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-slate-300 text-teal-600"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="font-bold text-slate-800">
                                                                    {a.date}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                                                                        {a.name
                                                                            .split(
                                                                                ' ',
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    n: string,
                                                                                ) =>
                                                                                    n[0],
                                                                            )
                                                                            .join(
                                                                                '',
                                                                            )
                                                                            .substring(
                                                                                0,
                                                                                2,
                                                                            )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-800">
                                                                            {
                                                                                a.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-slate-500">
                                                                            {
                                                                                a.nim
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="font-bold text-slate-800">
                                                                    {a.title}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="text-xs font-medium text-slate-700">
                                                                    {a.level}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="flex items-center justify-center gap-3 text-slate-500">
                                                                    <button
                                                                        onClick={() =>
                                                                            openEditPrestasiModal(
                                                                                a,
                                                                            )
                                                                        }
                                                                        className="transition-colors hover:text-amber-500"
                                                                        title="Edit Data"
                                                                    >
                                                                        <Edit
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
                                                                    {a.attachment && (
                                                                        <a
                                                                            href={`/storage/${a.attachment}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="transition-colors hover:text-emerald-600"
                                                                            title="Lihat Lampiran"
                                                                        >
                                                                            <Paperclip
                                                                                size={
                                                                                    18
                                                                                }
                                                                            />
                                                                        </a>
                                                                    )}
                                                                    <button
                                                                        className="transition-colors hover:text-teal-600"
                                                                        title="Cetak Sertifikat"
                                                                    >
                                                                        <Printer
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDeletePrestasi(
                                                                                a.id,
                                                                            )
                                                                        }
                                                                        className="transition-colors hover:text-red-600"
                                                                        title="Hapus Data"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Pagination */}
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 p-4 text-xs sm:flex-row">
                                <div className="font-medium text-slate-500">
                                    Menampilkan{' '}
                                    <b className="text-slate-700">
                                        {activeTab ===
                                        'Daftar Rekam Jejak Pelanggaran'
                                            ? filteredPelanggarans.length
                                            : filteredPrestasis.length}
                                    </b>{' '}
                                    dari{' '}
                                    <b className="text-slate-700">
                                        {activeTab ===
                                        'Daftar Rekam Jejak Pelanggaran'
                                            ? pelanggarans.length
                                            : prestasis.length}
                                    </b>{' '}
                                    rekam jejak
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="rounded-lg px-3 py-1.5 font-medium text-slate-500 transition-colors hover:bg-slate-200">
                                        Sebelumnya
                                    </button>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 font-bold text-white shadow-sm">
                                        1
                                    </button>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-slate-600 transition-colors hover:bg-slate-200">
                                        2
                                    </button>
                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-slate-600 transition-colors hover:bg-slate-200">
                                        3
                                    </button>
                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-500 transition-colors hover:bg-slate-200">
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="flex w-full shrink-0 flex-col gap-4 xl:w-[320px]">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
                                        <Trophy size={20} />
                                    </div>
                                    <h3 className="leading-tight font-extrabold text-slate-800">
                                        Prestasi Gelara
                                        <br />
                                        Terbaru
                                    </h3>
                                </div>
                                <a
                                    href="#"
                                    className="text-right text-xs leading-tight font-bold text-blue-600 hover:text-blue-700"
                                >
                                    Lihat
                                    <br />
                                    Semua
                                </a>
                            </div>

                            <div className="space-y-4">
                                {prestasis.map((a: any, i: number) => (
                                    <div
                                        key={i}
                                        className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-sm"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">
                                                    {a.name
                                                        .split(' ')
                                                        .map(
                                                            (n: string) => n[0],
                                                        )
                                                        .join('')
                                                        .substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">
                                                        {a.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="mb-1 text-sm leading-tight font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                                                {a.title}
                                            </div>
                                            <div className="text-[10px] font-medium text-slate-500">
                                                {a.level}
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-medium text-slate-400">
                                            {a.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Pelanggaran */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                            <h3 className="font-extrabold text-slate-800">
                                {data.id
                                    ? 'Edit Pelanggaran'
                                    : 'Catat Pelanggaran'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="custom-scrollbar overflow-y-auto p-6">
                            <form
                                id="pelanggaranForm"
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Nama Gelara{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.name}
                                        onChange={(e) => {
                                            const selectedName = e.target.value;
                                            const selectedGelara = gelaras.find(
                                                (g) => g.name === selectedName,
                                            );
                                            setData((data) => ({
                                                ...data,
                                                name: selectedName,
                                                nim: selectedGelara
                                                    ? selectedGelara.nig || ''
                                                    : '',
                                            }));
                                        }}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Gelara --
                                        </option>
                                        {gelaras.map((g) => (
                                            <option key={g.id} value={g.name}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.name && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        NIG
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nim}
                                        onChange={(e) =>
                                            setData('nim', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="NIG"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Kategori Pelanggaran{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.category}
                                            onChange={(e) =>
                                                setData(
                                                    'category',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="Sedang">
                                                Sedang
                                            </option>
                                            <option value="Berat">Berat</option>
                                            <option value="Sangat Berat">
                                                Sangat Berat
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Tingkat Peringatan{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) =>
                                                setData('type', e.target.value)
                                            }
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="info">
                                                Peringatan Biasa
                                            </option>
                                            <option value="warning">
                                                Peringatan Keras
                                            </option>
                                            <option value="danger">
                                                Tindakan Tegas
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Pelanggaran{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.descTitle}
                                        onChange={(e) =>
                                            setData('descTitle', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Ringkasan Kasus"
                                        required
                                    />
                                    {errors.descTitle && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.descTitle}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Kronologi / Deskripsi
                                    </label>
                                    <textarea
                                        value={data.descSub}
                                        onChange={(e) =>
                                            setData('descSub', e.target.value)
                                        }
                                        className="h-24 w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Keterangan lengkap kronologi..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Lampiran (PDF, Maks 2MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) =>
                                            setData(
                                                'attachment',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-colors outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.attachment && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.attachment}
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    form="pelanggaranForm"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {data.id ? 'Simpan Perubahan' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tambah Prestasi */}
            {isPrestasiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                            <h3 className="font-extrabold text-slate-800">
                                {prestasiData.id
                                    ? 'Edit Prestasi'
                                    : 'Tambah Prestasi'}
                            </h3>
                            <button
                                onClick={() => setIsPrestasiModalOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="custom-scrollbar overflow-y-auto p-6">
                            <form
                                id="prestasiForm"
                                onSubmit={handlePrestasiSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Nama Gelara{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={prestasiData.name}
                                        onChange={(e) => {
                                            const selectedName = e.target.value;
                                            const selectedGelara = gelaras.find(
                                                (g) => g.name === selectedName,
                                            );
                                            setPrestasiData((data) => ({
                                                ...data,
                                                name: selectedName,
                                                nim: selectedGelara
                                                    ? selectedGelara.nig || ''
                                                    : '',
                                            }));
                                        }}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">
                                            -- Pilih Gelara --
                                        </option>
                                        {gelaras.map((g) => (
                                            <option key={g.id} value={g.name}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errorsPrestasi.name && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errorsPrestasi.name}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        NIG
                                    </label>
                                    <input
                                        type="text"
                                        value={prestasiData.nim}
                                        onChange={(e) =>
                                            setPrestasiData(
                                                'nim',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="NIG"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Nama Prestasi{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={prestasiData.title}
                                        onChange={(e) =>
                                            setPrestasiData(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Contoh: Juara 1 MTQ"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Tingkat{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={prestasiData.level}
                                        onChange={(e) =>
                                            setPrestasiData(
                                                'level',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Contoh: Nasional"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Lampiran (PDF, Maks 2MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) =>
                                            setPrestasiData(
                                                'attachment',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm transition-colors outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errorsPrestasi.attachment && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errorsPrestasi.attachment}
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsPrestasiModalOpen(false)
                                    }
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    form="prestasiForm"
                                    disabled={processingPrestasi}
                                    className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {prestasiData.id
                                        ? 'Simpan Perubahan'
                                        : 'Simpan Prestasi'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
