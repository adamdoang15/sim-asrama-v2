import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Download,
    UserPlus,
    Search,
    RefreshCcw,
    MapPin,
    CheckCircle2,
    Eye,
    Edit2,
    Printer,
    Trash2,
    X,
    User,
    XCircle,
    UserCheck,
    Users
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { Student, StudentsPagination } from '@/components/gelara/types';
import GelaraFormModal from '@/components/gelara/GelaraFormModal';
import GelaraDetailModal from '@/components/gelara/GelaraDetailModal';

interface PageProps {
    students: StudentsPagination;
    filters?: {
        search?: string;
        gender?: string;
        angkatan?: string;
        tahun_ajaran?: string;
        per_page?: string;
    };
    angkatans?: string[];
    tahun_ajarans?: string[];
    stats?: {
        total: number;
        putra: number;
        putri: number;
    };
}

export default function DataGelara({
    students,
    filters,
    angkatans = [],
    tahun_ajarans = [],
    stats = { total: 0, putra: 0, putri: 0 }
}: PageProps) {
    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formStudent, setFormStudent] = useState<Student | null>(null);
    const [detailStudent, setDetailStudent] = useState<Student | null>(null);

    // Filter states
    const [search, setSearch] = useState(filters?.search || '');
    const [gender, setGender] = useState(filters?.gender || 'Semua');
    const [angkatan, setAngkatan] = useState(filters?.angkatan || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters?.tahun_ajaran || '');
    const [perPage, setPerPage] = useState(filters?.per_page || '25');

    // Debounced query synchronizer
    useEffect(() => {
        const timeout = setTimeout(() => {
            const query: Record<string, string> = {};
            if (search.trim()) query.search = search.trim();
            if (gender !== 'Semua') query.gender = gender;
            if (angkatan) query.angkatan = angkatan;
            if (tahunAjaran) query.tahun_ajaran = tahunAjaran;
            if (perPage !== '25') query.per_page = perPage;

            router.get('/kesekretariatan/data-gelara', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, gender, angkatan, tahunAjaran, perPage]);

    const isFilterActive = useMemo(() => {
        return Boolean(search || gender !== 'Semua' || angkatan || tahunAjaran || perPage !== '25');
    }, [search, gender, angkatan, tahunAjaran, perPage]);

    const handleReset = () => {
        setSearch('');
        setGender('Semua');
        setAngkatan('');
        setTahunAjaran('');
        setPerPage('25');
    };

    const handlePrintRow = (student: Student) => {
        setDetailStudent(student);
        setTimeout(() => window.print(), 150);
    };

    const handleDelete = (student: Student) => {
        if (confirm(`Yakin ingin menghapus data Gelara "${student.name}"? Data ini akan dihapus secara permanen.`)) {
            router.delete(`/kesekretariatan/data-gelara/${student.id}`, {
                preserveScroll: true,
            });
        }
    };

    const putraPct = stats.total > 0 ? Math.round((stats.putra / stats.total) * 100) : 0;
    const putriPct = stats.total > 0 ? Math.round((stats.putri / stats.total) * 100) : 0;

    return (
        <DashboardLayout title="Data Induk Gelara">
            <div className="space-y-6">
                {/* 1. Header Section */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                            <span>Kesekretariatan</span>
                            <span className="text-gray-300">/</span>
                            <span className="text-blue-600 font-bold">Data Gelara</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Data Induk Gelara
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Pusat inventarisasi arsip identitas, riwayat angkatan, dan biodata Gelara.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
                        >
                            <Download size={16} className="text-gray-500" />
                            <span>Ekspor Buku Induk</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setFormStudent(null);
                                setIsFormOpen(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
                        >
                            <UserPlus size={16} />
                            <span>Tambah Data Gelara</span>
                        </button>
                    </div>
                </div>

                {/* 2. Key Metrics Bar */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1e293b]">Total Terdaftar</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-xs">
                                <Users size={18} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-[28px] font-extrabold text-[#0f172a] leading-tight">{stats.total}</span>
                            <span className="text-sm font-medium text-gray-500">Gelara Aktif</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1e293b]">Gelara Putra</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 shadow-xs">
                                <User size={18} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-[28px] font-extrabold text-sky-900 leading-tight">{stats.putra}</span>
                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">{putraPct}%</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#1e293b]">Gelara Putri</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-xs">
                                <UserCheck size={18} />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-[28px] font-extrabold text-amber-900 leading-tight">{stats.putri}</span>
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">{putriPct}%</span>
                        </div>
                    </div>
                </div>

                {/* 3. Filter & Controls Toolbar */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari NIG, Nama Gelara, atau Kota Domisili..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-9 text-sm font-medium text-gray-800 placeholder-gray-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                                {search && (
                                    <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X size={15} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={angkatan}
                                    onChange={(e) => setAngkatan(e.target.value)}
                                    className="h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-sm font-semibold text-gray-700 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                                >
                                    <option value="">Semua Angkatan</option>
                                    {angkatans.map((a) => <option key={a} value={a}>Angkatan {a}</option>)}
                                </select>

                                <select
                                    value={tahunAjaran}
                                    onChange={(e) => setTahunAjaran(e.target.value)}
                                    className="h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-sm font-semibold text-gray-700 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none"
                                >
                                    <option value="">Semua Thn Masuk</option>
                                    {tahun_ajarans.map((t) => <option key={t} value={t}>Tahun {t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 lg:border-t-0 lg:pt-0">
                            <div className="flex items-center rounded-xl bg-gray-100 p-1 text-xs font-semibold">
                                {(['Semua', 'Laki-laki', 'Perempuan'] as const).map((g) => {
                                    const isActive = gender === g;
                                    const label = g === 'Semua' ? 'Semua' : g === 'Laki-laki' ? 'Putra' : 'Putri';
                                    return (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGender(g)}
                                            className={`rounded-lg px-3 py-1.5 transition-all ${isActive ? 'bg-white text-blue-600 font-bold shadow-sm' : 'text-gray-500 hover:text-gray-800'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            {isFilterActive && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 hover:text-red-600"
                                >
                                    <RefreshCcw size={13} />
                                    <span>Reset Filter</span>
                                </button>
                            )}

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span>Tampil:</span>
                                <select
                                    value={perPage}
                                    onChange={(e) => setPerPage(e.target.value)}
                                    className="rounded-lg border border-gray-200 bg-white py-1 px-2 text-xs font-bold text-gray-700 focus:outline-none"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Table Card */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full min-w-[960px] text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4">Gelara / NIG</th>
                                    <th className="px-4 py-4">Gender</th>
                                    <th className="px-4 py-4">Tempat & Tgl Lahir</th>
                                    <th className="px-4 py-4">Angkatan & Masuk</th>
                                    <th className="px-4 py-4 min-w-[240px]">Orang Tua & Domisili</th>
                                    <th className="px-4 py-4 text-center">Berkas</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.data.length > 0 ? (
                                    students.data.map((student) => {
                                        const isPutra = student.jenis_kelamin === 'Laki-laki';
                                        const isLengkap = student.status_berkas === 'Berkas Lengkap';
                                        const hasPhoto = student.foto && student.foto !== 'Belum Ada Foto';

                                        return (
                                            <tr key={student.id} className="group transition-colors hover:bg-gray-50/70">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex items-center gap-3">
                                                        {hasPhoto ? (
                                                            <img
                                                                src={`/storage/gelara/${student.foto}`}
                                                                alt={student.name}
                                                                className="h-10 w-8 rounded-lg object-cover border border-gray-200 shadow-sm shrink-0"
                                                            />
                                                        ) : (
                                                            <div
                                                                className={`flex h-10 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${isPutra
                                                                    ? 'border-sky-200 bg-sky-50 text-sky-800'
                                                                    : 'border-amber-200 bg-amber-50 text-amber-800'
                                                                    }`}
                                                            >
                                                                {student.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {student.name}
                                                            </div>
                                                            <div className="mt-0.5 text-xs text-gray-500 font-medium">
                                                                {student.nig}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 align-top">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${isPutra
                                                            ? 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20'
                                                            : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                                                            }`}
                                                    >
                                                        <span>{isPutra ? '♂' : '♀'}</span>
                                                        <span>{isPutra ? 'Putra' : 'Putri'}</span>
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4 align-top">
                                                    <div className="text-gray-700 font-medium leading-relaxed max-w-[200px] whitespace-normal text-xs">
                                                        {student.ttl || '-'}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 align-top">
                                                    <div className="font-semibold text-gray-900 text-xs">
                                                        Angkatan {student.angkatan} • {student.kelas || 'Kelas 10'}
                                                    </div>
                                                    <div className="mt-0.5 text-xs text-gray-500">
                                                        Masuk {student.tahun_diterima}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 align-top whitespace-normal">
                                                    <div className="space-y-1 leading-snug">
                                                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                                                            <span className="font-semibold text-gray-900">
                                                                {student.nama_ayah || '-'}
                                                            </span>
                                                            {student.pekerjaan_ayah && (
                                                                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 font-medium">
                                                                    {student.pekerjaan_ayah}
                                                                </span>
                                                            )}
                                                            <span className="text-gray-300">/</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {student.nama_ibu || '-'}
                                                            </span>
                                                        </div>

                                                        {student.domisili && (
                                                            <div className="flex items-start gap-1 text-xs text-gray-500">
                                                                <MapPin size={13} className="shrink-0 mt-0.5 text-gray-400" />
                                                                <span className="line-clamp-1" title={student.domisili}>
                                                                    {student.domisili}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 align-top text-center">
                                                    <div className="inline-flex flex-col items-center gap-1">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${isLengkap
                                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                                                                : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                                                                }`}
                                                        >
                                                            {isLengkap ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                            <span>{isLengkap ? 'Lengkap' : 'Belum Valid'}</span>
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {hasPhoto ? 'Ada Foto' : 'Tanpa Foto'}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 align-top text-right">
                                                    <div className="inline-flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDetailStudent(student)}
                                                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                                                            title="Lihat Detail Profil"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormStudent(student);
                                                                setIsFormOpen(true);
                                                            }}
                                                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-amber-600"
                                                            title="Edit Data"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handlePrintRow(student)}
                                                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                                            title="Cetak Formulir Biodata"
                                                        >
                                                            <Printer size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(student)}
                                                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                            title="Hapus Data Gelara"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center">
                                            <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                                    <Search size={22} />
                                                </div>
                                                <h3 className="mt-4 text-base font-bold text-gray-900">
                                                    Tidak ada data Gelara ditemukan
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Coba sesuaikan kata kunci pencarian atau opsi filter lainnya.
                                                </p>
                                                {isFilterActive && (
                                                    <button
                                                        type="button"
                                                        onClick={handleReset}
                                                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200"
                                                    >
                                                        <RefreshCcw size={13} />
                                                        <span>Reset Pencarian</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 5. Pagination Bar */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-6 py-3.5 text-sm text-gray-600 sm:flex-row">
                        <div>
                            Menampilkan{' '}
                            <span className="font-bold text-gray-900">{students.from || 0}</span> -{' '}
                            <span className="font-bold text-gray-900">{students.to || 0}</span> dari total{' '}
                            <span className="font-bold text-gray-900">{students.total}</span> data
                        </div>

                        {students.links && students.links.length > 3 && (
                            <div className="flex items-center gap-1">
                                {students.links.map((link, idx) => {
                                    if (!link.url && !link.active) {
                                        return (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 text-gray-300 font-semibold"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`rounded-lg px-3 py-1.5 font-bold transition-colors ${link.active
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'text-gray-600 hover:bg-gray-200'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <GelaraFormModal
                    isOpen={isFormOpen}
                    student={formStudent}
                    onClose={() => {
                        setIsFormOpen(false);
                        setFormStudent(null);
                    }}
                />

                <GelaraDetailModal
                    student={detailStudent}
                    onClose={() => setDetailStudent(null)}
                    onEdit={(student) => {
                        setFormStudent(student);
                        setIsFormOpen(true);
                    }}
                />
            </div>
        </DashboardLayout>
    );
}
