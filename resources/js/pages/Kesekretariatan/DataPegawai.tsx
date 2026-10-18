import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Download,
    UserPlus,
    Search,
    ChevronDown,
    RefreshCcw,
    Eye,
    Edit2,
    Trash2,
    Users,
    UserCheck,
    Contact,
    Briefcase,
    X,
    Save,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { Link, usePage, useForm, router } from '@inertiajs/react';

export default function DataPegawai({
    employees,
    stats,
    jabatans,
    filters,
}: {
    employees: any;
    stats: any;
    jabatans?: any[];
    filters?: any;
}) {
    const { url } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [detailModalPegawai, setDetailModalPegawai] = useState<any | null>(
        null,
    );

    const [search, setSearch] = useState(filters?.search || '');
    const [jabatan, setJabatan] = useState(filters?.jabatan || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [gender, setGender] = useState(filters?.gender || 'Semua');

    useEffect(() => {
        const timeout = setTimeout(() => {
            const query: any = {};
            if (search) query.search = search;
            if (jabatan) query.jabatan = jabatan;
            if (status) query.status = status;
            if (gender !== 'Semua') query.gender = gender;

            router.get('/kesekretariatan/data-pegawai', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, jabatan, status, gender]);

    const handleReset = () => {
        setSearch('');
        setJabatan('');
        setStatus('');
        setGender('Semua');
    };

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            niy: '',
            jenis_kelamin: 'Laki-laki',
            ttl: '',
            status_pegawai: 'Pegawai Tetap Yayasan',
            jabatan: '',
            tahun_masuk: '',
            foto: null as any,
            hapus_foto: false,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = editingId
            ? `/kesekretariatan/data-pegawai/${editingId}/update`
            : '/kesekretariatan/data-pegawai';

        post(endpoint, {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                setEditingId(null);
            },
        });
    };

    const handleDelete = (pegawai: any) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus data pegawai "${pegawai.name}"? Data yang dihapus tidak dapat dikembalikan.`,
            )
        ) {
            router.delete(`/kesekretariatan/data-pegawai/${pegawai.id}`, {
                preserveScroll: true,
            });
        }
    };

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setData('hapus_foto', false);
        setIsModalOpen(true);
    };

    const openEditModal = (pegawai: any) => {
        clearErrors();
        setEditingId(pegawai.id);
        setData({
            name: pegawai.name || '',
            niy: pegawai.niy || '',
            jenis_kelamin: pegawai.jenis_kelamin || 'Laki-laki',
            ttl: pegawai.ttl || '',
            status_pegawai: pegawai.status_pegawai || 'Pegawai Tetap Yayasan',
            jabatan: pegawai.jabatan || '',
            tahun_masuk: pegawai.tahun_masuk || '',
            foto: null as any,
            hapus_foto: false,
        });
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout title="Data Pegawai">
            <div className="mx-auto max-w-[1400px] pb-10 font-sans text-slate-800">
                {/* Header Banner Berwarna */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Data Pegawai & Staf
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Pengelolaan data induk pendidik dan staf
                                    kependidikan Asrama
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
                                <span>Ekspor Data Pegawai</span>
                            </button>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>Tambah Pegawai Baru</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200/80 bg-white p-3 shadow-xs md:flex-row md:items-center">
                    <div className="relative flex-1 md:max-w-md">
                        <Search
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                            size={16}
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Cari berdasarkan NIY, Nama Pegawai..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={jabatan}
                            onChange={(e) => setJabatan(e.target.value)}
                            className="min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Semua Jabatan / Bidang</option>
                            {jabatans?.map((j) => (
                                <option key={j} value={j}>
                                    {j}
                                </option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="min-w-[140px] appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="Pegawai Tetap Yayasan">
                                Pegawai Tetap Yayasan
                            </option>
                            <option value="Kontrak Kerja">Kontrak Kerja</option>
                        </select>
                        <button
                            onClick={handleReset}
                            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            title="Reset Filter"
                        >
                            <RefreshCcw size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1 text-xs font-bold md:ml-auto">
                        <button
                            onClick={() => setGender('Semua')}
                            className={`rounded-lg px-3 py-1.5 transition-colors ${gender === 'Semua' ? 'border border-slate-200 bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setGender('Laki-laki')}
                            className={`rounded-lg px-3 py-1.5 transition-colors ${gender === 'Laki-laki' ? 'border border-slate-200 bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                        >
                            Laki-laki (L)
                        </button>
                        <button
                            onClick={() => setGender('Perempuan')}
                            className={`rounded-lg px-3 py-1.5 transition-colors ${gender === 'Perempuan' ? 'border border-slate-200 bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                        >
                            Perempuan (P)
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="custom-scrollbar overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left text-sm whitespace-nowrap">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                                <tr>
                                    <th className="w-72 px-5 py-4">
                                        Nama Pegawai
                                    </th>
                                    <th className="w-40 px-4 py-4">
                                        Nomor Induk Yayasan (NIY)
                                    </th>
                                    <th className="w-32 px-4 py-4">
                                        Jenis Kelamin
                                    </th>
                                    <th className="w-48 px-4 py-4">
                                        Tempat, Tanggal Lahir
                                    </th>
                                    <th className="min-w-[200px] px-4 py-4">
                                        Jabatan
                                    </th>
                                    <th className="px-5 py-4 text-center">
                                        Status Berkas
                                    </th>
                                    <th className="w-28 px-5 py-4 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {employees.data?.map((emp: any) => {
                                    const isL =
                                        emp.jenis_kelamin === 'Laki-laki';
                                    const statusColor =
                                        emp.status_pegawai ===
                                        'Pegawai Tetap Yayasan'
                                            ? 'emerald'
                                            : 'amber';
                                    return (
                                        <tr
                                            key={emp.id}
                                            className="group transition-colors hover:bg-slate-50/50"
                                        >
                                            <td className="px-5 py-5 align-top">
                                                <div className="flex items-center gap-3.5">
                                                    {emp.foto &&
                                                    emp.foto !==
                                                        'Belum Ada Foto' ? (
                                                        <img
                                                            src={`/storage/pegawai/${emp.foto}`}
                                                            alt={emp.name}
                                                            className="mt-0.5 h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-100/50 bg-blue-50/80 text-blue-600 shadow-[0_2px_10px_-3px_rgba(37,99,235,0.3)]">
                                                            <UserCheck
                                                                size={20}
                                                                strokeWidth={
                                                                    2.5
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-[13px] leading-tight font-extrabold text-slate-800">
                                                            {emp.name}
                                                        </div>
                                                        <div className="mt-1.5 flex items-center gap-1.5">
                                                            <div
                                                                className={`h-1.5 w-1.5 rounded-full bg-${statusColor}-500`}
                                                            ></div>
                                                            <div className="text-[10px] font-bold text-slate-500">
                                                                {
                                                                    emp.status_pegawai
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top">
                                                <div className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-extrabold text-slate-600">
                                                    {emp.niy || '-'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top">
                                                <div
                                                    className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10px] font-bold ${isL ? 'border-blue-100 bg-blue-50 text-blue-600' : 'border-amber-100 bg-amber-50 text-amber-600'}`}
                                                >
                                                    <span className="-mt-0.5 text-lg leading-none">
                                                        {isL ? '♂' : '♀'}
                                                    </span>{' '}
                                                    {emp.jenis_kelamin}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top">
                                                <div className="text-xs leading-tight font-bold text-slate-700">
                                                    {emp.ttl?.split(', ')[0] ||
                                                        ''}
                                                    <br />
                                                    <span className="mt-1 block font-medium text-slate-500">
                                                        {emp.ttl?.split(
                                                            ', ',
                                                        )[1] || ''}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top whitespace-normal">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {emp.jabatan
                                                        ?.split(',')
                                                        .map((j: string) =>
                                                            j.trim(),
                                                        )
                                                        .filter(Boolean)
                                                        .map(
                                                            (
                                                                j: string,
                                                                idx: number,
                                                            ) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${
                                                                        j
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                'wali kelas',
                                                                            )
                                                                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                                            : 'border-slate-200 bg-slate-100 text-slate-700'
                                                                    }`}
                                                                >
                                                                    {j}
                                                                </span>
                                                            ),
                                                        )}
                                                </div>
                                                {emp.tahun_masuk && (
                                                    <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                                                        Mulai {emp.tahun_masuk}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-5 text-center align-top">
                                                <div className="flex flex-col items-center justify-start gap-2">
                                                    <div
                                                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${emp.status_berkas === 'Berkas Lengkap' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20 ring-inset' : 'bg-rose-50 text-rose-600 ring-1 ring-rose-600/20 ring-inset'}`}
                                                    >
                                                        {emp.status_berkas ===
                                                        'Berkas Lengkap' ? (
                                                            <CheckCircle2
                                                                size={12}
                                                            />
                                                        ) : (
                                                            <XCircle
                                                                size={12}
                                                            />
                                                        )}{' '}
                                                        {emp.status_berkas}
                                                    </div>
                                                    <div className="text-[10px] font-medium text-slate-400">
                                                        {emp.foto &&
                                                        emp.foto !==
                                                            'Belum Ada Foto'
                                                            ? 'Ada Foto'
                                                            : 'Tanpa Foto'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 align-top">
                                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                                    <button
                                                        onClick={() =>
                                                            setDetailModalPegawai(
                                                                emp,
                                                            )
                                                        }
                                                        className="rounded p-1.5 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                        title="Detail"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(emp)
                                                        }
                                                        className="rounded p-1.5 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(emp)
                                                        }
                                                        className="rounded-lg p-1.5 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                                                        title="Hapus Pegawai"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 p-4 text-xs sm:flex-row">
                        <div className="font-medium text-slate-500">
                            Menampilkan{' '}
                            <b className="text-slate-700">
                                {employees.from || 0} - {employees.to || 0}
                            </b>{' '}
                            dari{' '}
                            <b className="text-slate-700">{employees.total}</b>{' '}
                            Pegawai Terdaftar
                            <span className="mx-2">•</span>
                            Halaman {employees.current_page} dari{' '}
                            {employees.last_page}
                        </div>
                        <div className="flex items-center gap-1">
                            <Link
                                href={employees.first_page_url || '#'}
                                className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${employees.current_page === 1 ? 'pointer-events-none text-slate-300' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                {'|<'}
                            </Link>
                            {employees.links?.map(
                                (link: any, index: number) => {
                                    if (
                                        index === 0 ||
                                        index === employees.links.length - 1
                                    ) {
                                        const isPrev = index === 0;
                                        const label = isPrev ? '<' : '>';
                                        return link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className="flex h-8 w-8 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-200"
                                                dangerouslySetInnerHTML={{
                                                    __html: label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="flex h-8 w-8 items-center justify-center rounded text-slate-300"
                                                dangerouslySetInnerHTML={{
                                                    __html: label,
                                                }}
                                            />
                                        );
                                    }
                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`flex h-8 min-w-8 items-center justify-center rounded px-2 transition-colors ${link.active ? 'bg-blue-700 font-bold text-white shadow-sm' : 'font-bold text-slate-600 hover:bg-slate-200'}`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="flex h-8 min-w-8 items-center justify-center rounded px-2 text-slate-400"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                },
                            )}
                            <Link
                                href={employees.last_page_url || '#'}
                                className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${employees.current_page === employees.last_page ? 'pointer-events-none text-slate-300' : 'text-slate-500 hover:bg-slate-200'}`}
                            >
                                {'>|'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Pegawai */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-800">
                                    {editingId
                                        ? 'Edit Data Pegawai'
                                        : 'Tambah Pegawai Baru'}
                                </h3>
                                <p className="text-xs font-medium text-slate-500">
                                    Lengkapi formulir di bawah ini untuk{' '}
                                    {editingId ? 'memperbarui' : 'menambahkan'}{' '}
                                    data pegawai.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="custom-scrollbar overflow-y-auto p-6">
                            <form
                                id="pegawaiForm"
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Nama Lengkap & Gelar{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${errors.name ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="Contoh: Hendi Suhendi, S.Pd"
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-xs font-medium text-red-500">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Nomor Induk Yayasan (NIY)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.niy}
                                            onChange={(e) =>
                                                setData('niy', e.target.value)
                                            }
                                            className={`w-full rounded-xl border px-4 py-2.5 font-mono text-sm transition-colors focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${errors.niy ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                            placeholder="Contoh: NIY-2026-0001"
                                        />
                                        {errors.niy && (
                                            <div className="mt-1 text-xs font-medium text-red-500">
                                                {errors.niy}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Jenis Kelamin{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="jk"
                                                    className="peer sr-only"
                                                    checked={
                                                        data.jenis_kelamin ===
                                                        'Laki-laki'
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            'jenis_kelamin',
                                                            'Laki-laki',
                                                        )
                                                    }
                                                />
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:font-bold peer-checked:text-blue-700">
                                                    Laki-laki
                                                </div>
                                            </label>
                                            <label className="flex-1 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="jk"
                                                    className="peer sr-only"
                                                    checked={
                                                        data.jenis_kelamin ===
                                                        'Perempuan'
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            'jenis_kelamin',
                                                            'Perempuan',
                                                        )
                                                    }
                                                />
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:font-bold peer-checked:text-blue-700">
                                                    Perempuan
                                                </div>
                                            </label>
                                        </div>
                                        {errors.jenis_kelamin && (
                                            <div className="mt-1 text-xs font-medium text-red-500">
                                                {errors.jenis_kelamin}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Tempat, Tanggal Lahir{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.ttl}
                                        onChange={(e) =>
                                            setData('ttl', e.target.value)
                                        }
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${errors.ttl ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="Contoh: Sukabumi, 14 Mei 1988"
                                    />
                                    {errors.ttl && (
                                        <div className="mt-1 text-xs font-medium text-red-500">
                                            {errors.ttl}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Status Kepegawaian{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.status_pegawai}
                                            onChange={(e) =>
                                                setData(
                                                    'status_pegawai',
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full appearance-none rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${errors.status_pegawai ? 'border-red-300 bg-red-50 text-red-700 focus:border-red-500' : 'border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-500 focus:bg-white'}`}
                                        >
                                            <option value="Pegawai Tetap Yayasan">
                                                Pegawai Tetap Yayasan
                                            </option>
                                            <option value="Kontrak Kerja">
                                                Kontrak Kerja
                                            </option>
                                        </select>
                                        {errors.status_pegawai && (
                                            <div className="mt-1 text-xs font-medium text-red-500">
                                                {errors.status_pegawai}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Jabatan / Posisi{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.jabatan}
                                            onChange={(e) =>
                                                setData(
                                                    'jabatan',
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${errors.jabatan ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                            placeholder="Contoh: Guru, Wali Kelas 10"
                                        />
                                        {/* Shortcut Tambah Jabatan */}
                                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                            <span className="text-[11px] font-semibold text-slate-400">
                                                Pilihan Cepat:
                                            </span>
                                            {[
                                                'Wali Kelas 10',
                                                'Wali Kelas 11',
                                                'Wali Kelas 12',
                                            ].map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => {
                                                        const current =
                                                            data.jabatan
                                                                ? data.jabatan
                                                                      .split(
                                                                          ',',
                                                                      )
                                                                      .map(
                                                                          (
                                                                              s: string,
                                                                          ) =>
                                                                              s.trim(),
                                                                      )
                                                                      .filter(
                                                                          Boolean,
                                                                      )
                                                                : [];
                                                        if (
                                                            !current.includes(
                                                                preset,
                                                            )
                                                        ) {
                                                            setData(
                                                                'jabatan',
                                                                [
                                                                    ...current,
                                                                    preset,
                                                                ].join(', '),
                                                            );
                                                        }
                                                    }}
                                                    className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.98]"
                                                >
                                                    +{preset}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.jabatan && (
                                            <div className="mt-1 text-xs font-medium text-red-500">
                                                {errors.jabatan}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Tahun Masuk{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tahun_masuk}
                                        onChange={(e) =>
                                            setData(
                                                'tahun_masuk',
                                                e.target.value,
                                            )
                                        }
                                        className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${errors.tahun_masuk ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="Contoh: 2023"
                                        maxLength={4}
                                    />
                                    {errors.tahun_masuk && (
                                        <div className="mt-1 text-xs font-medium text-red-500">
                                            {errors.tahun_masuk}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Foto Pegawai (Opsional, Rasio 2:3)
                                    </label>

                                    {!data.foto ? (
                                        <>
                                            {editingId !== null && (
                                                <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm font-bold text-red-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            data.hapus_foto
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'hapus_foto',
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="rounded border-red-300 text-red-600 focus:ring-red-500"
                                                    />
                                                    Hapus foto saat ini
                                                </label>
                                            )}
                                            <input
                                                key="no-file"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setData(
                                                        'foto',
                                                        e.target.files
                                                            ? e.target.files[0]
                                                            : null,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm transition-colors outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="relative inline-block rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                                            <img
                                                src={URL.createObjectURL(
                                                    data.foto,
                                                )}
                                                alt="Preview"
                                                className="h-32 w-24 rounded-lg border border-slate-100 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData('foto', null)
                                                }
                                                className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 hover:bg-red-600"
                                                title="Batal pilih foto"
                                            >
                                                <X size={14} strokeWidth={3} />
                                            </button>
                                        </div>
                                    )}

                                    {errors.foto && (
                                        <span className="mt-1 block text-xs font-medium text-red-500">
                                            {errors.foto}
                                        </span>
                                    )}
                                    <p className="mt-1.5 text-[10px] font-medium text-slate-500">
                                        Sistem akan otomatis mengkompres dan
                                        memotong foto menjadi ukuran 2x3 (rasio
                                        2:3).
                                    </p>
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="pegawaiForm"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={16} />{' '}
                                {processing ? 'Menyimpan...' : 'Simpan Pegawai'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailModalPegawai && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setDetailModalPegawai(null)}
                    ></div>
                    <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* Header Banner */}
                        <div className="relative h-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
                            <button
                                onClick={() => setDetailModalPegawai(null)}
                                className="absolute top-4 right-4 rounded-full bg-black/10 p-2 text-white/70 backdrop-blur-md transition-all hover:bg-black/30 hover:text-white"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="relative px-7 pb-7">
                            {/* Overlapping Avatar */}
                            <div className="absolute -top-16 left-7">
                                {detailModalPegawai.foto &&
                                detailModalPegawai.foto !== 'Belum Ada Foto' &&
                                !detailModalPegawai.foto.includes(
                                    'Belum Ada Foto',
                                ) ? (
                                    <img
                                        src={`/storage/pegawai/${detailModalPegawai.foto}`}
                                        alt={detailModalPegawai.name}
                                        className="h-28 w-28 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-slate-100 to-slate-200 text-4xl font-black text-slate-400 shadow-lg">
                                        <UserCheck size={48} />
                                    </div>
                                )}
                            </div>

                            <div className="ml-32 h-20 pt-2">
                                <h3 className="truncate text-xl leading-tight font-extrabold text-slate-800">
                                    {detailModalPegawai.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-slate-500">
                                        {detailModalPegawai.niy || '-'}
                                    </span>
                                    <div
                                        className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-bold ${detailModalPegawai.jenis_kelamin === 'Laki-laki' ? 'border-blue-100 bg-blue-50 text-blue-600' : 'border-amber-100 bg-amber-50 text-amber-600'}`}
                                    >
                                        <span className="-mt-px text-sm leading-none">
                                            {detailModalPegawai.jenis_kelamin ===
                                            'Laki-laki'
                                                ? '♂'
                                                : '♀'}
                                        </span>{' '}
                                        {detailModalPegawai.jenis_kelamin ===
                                        'Laki-laki'
                                            ? 'L'
                                            : 'P'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Tempat, Tgl Lahir
                                        </div>
                                        <div className="text-sm leading-tight font-bold text-slate-700">
                                            {detailModalPegawai.ttl}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Tahun Masuk
                                        </div>
                                        <div className="text-sm leading-tight font-bold text-slate-700">
                                            {detailModalPegawai.tahun_masuk ||
                                                '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Status Kepegawaian
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-relaxed font-bold text-slate-700">
                                        {detailModalPegawai.status_pegawai}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <div className="mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Jabatan / Posisi
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        {detailModalPegawai.jabatan
                                            ?.split(',')
                                            .map((j: string) => j.trim())
                                            .filter(Boolean)
                                            .map((j: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className={`rounded-lg border px-2.5 py-1 text-xs font-bold shadow-xs ${
                                                        j
                                                            .toLowerCase()
                                                            .includes(
                                                                'wali kelas',
                                                            )
                                                            ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                            : 'border-slate-200 bg-white text-slate-700'
                                                    }`}
                                                >
                                                    {j}
                                                </span>
                                            )) || (
                                            <span className="text-xs text-slate-400">
                                                -
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
