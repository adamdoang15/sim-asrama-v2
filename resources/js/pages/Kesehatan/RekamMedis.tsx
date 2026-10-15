import DashboardLayout from '@/layouts/DashboardLayout';
import { Link, router } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Clock,
    Eye,
    FileText,
    History,
    Info,
    Search,
    Stethoscope,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface MedicalHistoryItem {
    id: number;
    tahun_akademik: string;
    semester: string;
    berat_badan: number | null;
    tinggi_badan: number | null;
    imt: number | null;
    imt_kategori: string | null;
    tensi: string | null;
    tensi_kategori: string | null;
    riwayat_sakit: {
        ringan?: { jumlah: number; keterangan: string };
        sedang?: { jumlah: number; keterangan: string };
        berat?: { jumlah: number; keterangan: string };
    } | null;
    catatan_kesehatan: string | null;
    tanggal: string;
}

interface StudentRecord {
    id: number;
    name: string;
    nig: string;
    kelas: string;
    sudah_diperiksa: boolean;
    total_sakit: number;
    kesehatan: {
        id?: number;
        berat_badan: number | null;
        tinggi_badan: number | null;
        imt: number | null;
        imt_kategori: string | null;
        tensi: string | null;
        tensi_kategori: string | null;
        riwayat_sakit: {
            ringan?: { jumlah: number; keterangan: string };
            sedang?: { jumlah: number; keterangan: string };
            berat?: { jumlah: number; keterangan: string };
        };
        catatan_kesehatan: string | null;
        updated_at?: string;
    } | null;
    riwayat_pemeriksaan: MedicalHistoryItem[];
}

interface Props {
    students: StudentRecord[];
    filters: {
        tahun_akademik: string;
        kelas: string;
        search: string;
        semester: string;
    };
    options: {
        tahun_akademik: string[];
        kelas: string[];
    };
    stats: {
        total_santri: number;
        santri_sehat: number;
        perlu_perhatian: number;
        belum_diperiksa: number;
    };
}

export default function RekamMedis({ students, filters, options, stats }: Props) {
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun_akademik);
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [activeStudentDetail, setActiveStudentDetail] = useState<StudentRecord | null>(null);
    const [modalTab, setModalTab] = useState<'current' | 'history'>('current');

    const handleFilterChange = (newFilters: { tahun_akademik?: string; kelas?: string }) => {
        const tahun = newFilters.tahun_akademik ?? selectedTahun;
        const kelas = newFilters.kelas ?? selectedKelas;

        setSelectedTahun(tahun);
        setSelectedKelas(kelas);

        router.get(
            '/kesehatan/rekam-medis',
            {
                tahun_akademik: tahun,
                kelas,
                search: searchInput.trim() || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/kesehatan/rekam-medis',
            {
                tahun_akademik: selectedTahun,
                kelas: selectedKelas,
                search: searchInput.trim() || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    // Client-side instant response filtering
    const filteredStudents = useMemo(() => {
        if (!searchInput.trim()) return students;
        const q = searchInput.toLowerCase();
        return students.filter(
            (s) => s.name.toLowerCase().includes(q) || s.nig.toLowerCase().includes(q)
        );
    }, [students, searchInput]);

    // Separate previous records to prevent duplication of current session
    const pastHistories = useMemo(() => {
        if (!activeStudentDetail) return [];
        const currentKesehatanId = activeStudentDetail.kesehatan?.id;
        return activeStudentDetail.riwayat_pemeriksaan.filter(
            (hist) => hist.id !== currentKesehatanId
        );
    }, [activeStudentDetail]);

    const openStudentDetail = (student: StudentRecord) => {
        setActiveStudentDetail(student);
        setModalTab('current');
    };

    const getImtBadge = (kategori: string | null) => {
        if (!kategori) return <span className="text-slate-400 text-xs">-</span>;
        switch (kategori.toLowerCase()) {
            case 'ideal':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        Ideal
                    </span>
                );
            case 'kurus':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                        Kurus
                    </span>
                );
            case 'gemuk':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/80">
                        Gemuk
                    </span>
                );
            case 'obesitas':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                        Obesitas
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {kategori}
                    </span>
                );
        }
    };

    const getTensiBadge = (kategori: string | null) => {
        if (!kategori) return <span className="text-slate-400 text-xs">-</span>;
        const katLower = kategori.toLowerCase();
        if (katLower.includes('normal')) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
                    {kategori}
                </span>
            );
        }
        if (katLower.includes('hiper') || katLower.includes('tinggi')) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                    {kategori}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                {kategori}
            </span>
        );
    };

    return (
        <DashboardLayout title="Rekam Medis Santri">
            <div className="space-y-6 pb-12 font-sans text-slate-800 max-w-7xl mx-auto">
                {/* 1. Header & Quick Actions */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Rekam Medis Santri
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Rekapitulasi riwayat kesehatan, antropometri fisik, dan pemantauan medis Poskestren.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/kesehatan/pemeriksaan"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        >
                            <Stethoscope className="w-4 h-4" />
                            <span>Pemeriksaan Kesehatan Berkala</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Ringkasan Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Total Santri</span>
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {stats.total_santri}
                            </span>
                            <span className="text-xs text-slate-500">santri terdaftar</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-700">Santri Sehat</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                                {stats.santri_sehat}
                            </span>
                            <span className="text-xs text-slate-500">tanpa keluhan sakit</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-rose-700">Perlu Perhatian</span>
                            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                                {stats.perlu_perhatian}
                            </span>
                            <span className="text-xs text-slate-500">ada riwayat sakit</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-blue-700">Sudah Diperiksa</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                                {stats.total_santri - stats.belum_diperiksa}
                            </span>
                            <span className="text-xs text-slate-500">
                                / {stats.total_santri} santri
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Filter & Pencarian Bar */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
                        <div className="md:col-span-4 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">
                                Tahun Akademik & Semester
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <select
                                    value={selectedTahun}
                                    onChange={(e) => handleFilterChange({ tahun_akademik: e.target.value })}
                                    className="w-full pl-10 pr-9 py-2 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer appearance-none truncate"
                                >
                                    {options.tahun_akademik.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">
                                Tingkat Kelas
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Users className="w-4 h-4" />
                                </div>
                                <select
                                    value={selectedKelas}
                                    onChange={(e) => handleFilterChange({ kelas: e.target.value })}
                                    className="w-full pl-10 pr-9 py-2 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer appearance-none truncate"
                                >
                                    {options.kelas.map((k) => (
                                        <option key={k} value={k}>
                                            {k}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-5 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">
                                Cari Santri
                            </label>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Cari nama santri atau NIG..."
                                    className="w-full pl-10 pr-9 py-2 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchInput('');
                                            router.get(
                                                '/kesehatan/rekam-medis',
                                                { tahun_akademik: selectedTahun, kelas: selectedKelas },
                                                { preserveState: true, replace: true }
                                            );
                                        }}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* 4. Tabel Rekam Medis Santri */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-teal-600" />
                            <h2 className="text-sm font-bold text-slate-900">
                                Daftar Rekam Medis Santri
                            </h2>
                            <span className="text-xs font-medium text-slate-400">
                                ({filteredStudents.length} santri)
                            </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                            {selectedTahun}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 border-b border-slate-100">
                                    <th className="py-3 px-4 w-12 text-center">No</th>
                                    <th className="py-3 px-4">Santri</th>
                                    <th className="py-3 px-4">Kelas</th>
                                    <th className="py-3 px-4">Antropometri (BB / TB / IMT)</th>
                                    <th className="py-3 px-4">Tekanan Darah</th>
                                    <th className="py-3 px-4">Riwayat Sakit</th>
                                    <th className="py-3 px-4 text-center">Status Medis</th>
                                    <th className="py-3 px-4 text-center w-36">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-500">
                                            <div className="max-w-sm mx-auto space-y-3">
                                                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <Info className="w-6 h-6" />
                                                </div>
                                                <p className="font-semibold text-slate-800">
                                                    Tidak ada data rekam medis ditemukan
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Coba ubah kata kunci pencarian atau ganti filter kelas di atas.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, idx) => {
                                        const k = student.kesehatan;
                                        const sakitRingan = k?.riwayat_sakit?.ringan?.jumlah || 0;
                                        const sakitSedang = k?.riwayat_sakit?.sedang?.jumlah || 0;
                                        const sakitBerat = k?.riwayat_sakit?.berat?.jumlah || 0;
                                        const totalSakit = sakitRingan + sakitSedang + sakitBerat;
                                        const isExamined = student.sudah_diperiksa;

                                        return (
                                            <tr
                                                key={student.id}
                                                className="hover:bg-slate-50/70 transition-colors group"
                                            >
                                                <td className="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">
                                                    {idx + 1}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs font-mono text-slate-400">
                                                        NIG: {student.nig}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                                                        {student.kelas}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {k && (k.berat_badan || k.tinggi_badan) ? (
                                                        <div className="space-y-0.5">
                                                            <div className="text-xs font-medium text-slate-800 tabular-nums">
                                                                <span className="font-semibold">{k.berat_badan ?? '-'}</span> kg /{' '}
                                                                <span className="font-semibold">{k.tinggi_badan ?? '-'}</span> cm
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[11px] text-slate-500 font-mono">
                                                                    IMT {k.imt ?? '-'}
                                                                </span>
                                                                {getImtBadge(k.imt_kategori)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum ditimbang
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {k?.tensi ? (
                                                        <div className="space-y-0.5">
                                                            <div className="text-xs font-semibold text-slate-800 font-mono tabular-nums">
                                                                {k.tensi} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
                                                            </div>
                                                            <div>{getTensiBadge(k.tensi_kategori)}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum tensi
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {totalSakit > 0 ? (
                                                        <div className="space-y-0.5">
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
                                                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                                                {totalSakit} kali sakit
                                                            </span>
                                                        </div>
                                                    ) : isExamined ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                            Nihil (Sehat)
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum ada data
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-center">
                                                    {!isExamined ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                            Belum Diperiksa
                                                        </span>
                                                    ) : totalSakit > 0 ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                                                            Perlu Perhatian
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                            Sehat Prima
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openStudentDetail(student)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                                            title="Lihat riwayat lengkap rekam medis"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                                                            <span>Detail</span>
                                                        </button>

                                                        <Link
                                                            href={`/kesehatan/pemeriksaan?kelas=${encodeURIComponent(student.kelas)}&search=${encodeURIComponent(student.nig)}`}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                                                            title="Input / Perbarui pemeriksaan kesehatan"
                                                        >
                                                            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                                                            <span>Periksa</span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. Modal Detail Rekam Medis Santri */}
                {activeStudentDetail && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                                        {activeStudentDetail.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-bold text-slate-900 leading-tight truncate">
                                            {activeStudentDetail.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            NIG: <span className="font-mono">{activeStudentDetail.nig}</span> • {activeStudentDetail.kelas}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveStudentDetail(null)}
                                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors shrink-0 ml-2"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tab Bar: Memisahkan Pemeriksaan Terkini & Riwayat Lampau agar TIDAK terjadi pengulangan */}
                            <div className="px-6 pt-3 pb-0 border-b border-slate-100 flex items-center gap-2 bg-slate-50/40">
                                <button
                                    type="button"
                                    onClick={() => setModalTab('current')}
                                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${modalTab === 'current'
                                            ? 'border-teal-600 text-teal-700'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>Pemeriksaan Terkini ({selectedTahun})</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalTab('history')}
                                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${modalTab === 'history'
                                            ? 'border-teal-600 text-teal-700'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <History className="w-3.5 h-3.5" />
                                    <span>Riwayat Lampau</span>
                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200/80 text-slate-700">
                                        {pastHistories.length}
                                    </span>
                                </button>
                            </div>

                            {/* Modal Content with overflow-x-hidden to prevent horizontal scrolling */}
                            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto overflow-x-hidden">
                                {modalTab === 'current' ? (
                                    activeStudentDetail.kesehatan ? (
                                        <div className="space-y-4">
                                            {/* Subhead Info */}
                                            <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                                                <span>Data Pemeriksaan Poskestren Semester Ini</span>
                                                {activeStudentDetail.kesehatan.updated_at && (
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        Diperbarui: {activeStudentDetail.kesehatan.updated_at}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Grid Metrik Fisik */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                                    <span className="text-[11px] font-medium text-slate-500 block">Berat Badan</span>
                                                    <div className="text-base font-bold text-slate-800 mt-0.5 tabular-nums">
                                                        {activeStudentDetail.kesehatan.berat_badan ?? '-'} <span className="text-xs font-normal text-slate-500">kg</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                                    <span className="text-[11px] font-medium text-slate-500 block">Tinggi Badan</span>
                                                    <div className="text-base font-bold text-slate-800 mt-0.5 tabular-nums">
                                                        {activeStudentDetail.kesehatan.tinggi_badan ?? '-'} <span className="text-xs font-normal text-slate-500">cm</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                                    <span className="text-[11px] font-medium text-slate-500 block">Indeks Massa Tubuh</span>
                                                    <div className="text-base font-bold text-slate-800 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                        <span className="tabular-nums">{activeStudentDetail.kesehatan.imt ?? '-'}</span>
                                                        {getImtBadge(activeStudentDetail.kesehatan.imt_kategori)}
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                                                    <span className="text-[11px] font-medium text-slate-500 block">Tekanan Darah</span>
                                                    <div className="text-base font-bold text-slate-800 mt-0.5 font-mono tabular-nums">
                                                        {activeStudentDetail.kesehatan.tensi ?? '-'}
                                                    </div>
                                                    <div className="mt-1">{getTensiBadge(activeStudentDetail.kesehatan.tensi_kategori)}</div>
                                                </div>
                                            </div>

                                            {/* Rincian Riwayat Sakit */}
                                            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                                                <span className="text-xs font-bold text-slate-700 block">
                                                    Rincian Keluhan & Riwayat Sakit
                                                </span>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                                                    <div className="p-3 bg-white rounded-lg border border-slate-200/70">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-slate-500 font-medium">Sakit Ringan</span>
                                                            <span className="font-bold text-slate-800">
                                                                {activeStudentDetail.kesehatan.riwayat_sakit?.ringan?.jumlah || 0}x
                                                            </span>
                                                        </div>
                                                        <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed break-words">
                                                            {activeStudentDetail.kesehatan.riwayat_sakit?.ringan?.keterangan || (
                                                                <span className="text-slate-400 italic">Tidak ada keluhan</span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="p-3 bg-white rounded-lg border border-slate-200/70">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-amber-600 font-medium">Sakit Sedang</span>
                                                            <span className="font-bold text-amber-700">
                                                                {activeStudentDetail.kesehatan.riwayat_sakit?.sedang?.jumlah || 0}x
                                                            </span>
                                                        </div>
                                                        <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed break-words">
                                                            {activeStudentDetail.kesehatan.riwayat_sakit?.sedang?.keterangan || (
                                                                <span className="text-slate-400 italic">Tidak ada keluhan</span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="p-3 bg-white rounded-lg border border-slate-200/70">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-rose-600 font-medium">Sakit Berat</span>
                                                            <span className="font-bold text-rose-700">
                                                                {activeStudentDetail.kesehatan.riwayat_sakit?.berat?.jumlah || 0}x
                                                            </span>
                                                        </div>
                                                        <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed break-words">
                                                            {activeStudentDetail.kesehatan.riwayat_sakit?.berat?.keterangan || (
                                                                <span className="text-slate-400 italic">Tidak ada keluhan</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Catatan Medis & Rekomendasi Dokter */}
                                            {activeStudentDetail.kesehatan.catatan_kesehatan && (
                                                <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200/70">
                                                    <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5 mb-1.5">
                                                        <Info className="w-4 h-4 text-teal-600 shrink-0" />
                                                        Catatan Medis & Rekomendasi Dokter / Petugas
                                                    </span>
                                                    <p className="text-xs text-teal-950 leading-relaxed break-words">
                                                        {activeStudentDetail.kesehatan.catatan_kesehatan}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Pintasan ke Riwayat Lampau jika ada */}
                                            {pastHistories.length > 0 && (
                                                <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                                                    <span>Santri ini memiliki {pastHistories.length} data riwayat semester lampau.</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setModalTab('history')}
                                                        className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                                                    >
                                                        Lihat Riwayat Lampau &rarr;
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
                                            <div className="w-10 h-10 mx-auto rounded-full bg-slate-200/60 flex items-center justify-center text-slate-500">
                                                <Stethoscope className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold text-sm text-slate-800">
                                                    Belum Ada Pemeriksaan Semester Ini
                                                </p>
                                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                                    Belum ada data antropometri fisik maupun riwayat sakit yang tercatat untuk {selectedTahun}.
                                                </p>
                                            </div>
                                            <Link
                                                href={`/kesehatan/pemeriksaan?kelas=${encodeURIComponent(activeStudentDetail.kelas)}&search=${encodeURIComponent(activeStudentDetail.nig)}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition"
                                            >
                                                <Stethoscope className="w-3.5 h-3.5" />
                                                Input Pemeriksaan Sekarang
                                            </Link>
                                        </div>
                                    )
                                ) : (
                                    /* Tab Riwayat Lampau */
                                    pastHistories.length === 0 ? (
                                        <div className="p-8 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                                            <div className="w-10 h-10 mx-auto rounded-full bg-slate-200/60 flex items-center justify-center text-slate-400">
                                                <History className="w-5 h-5" />
                                            </div>
                                            <p className="font-semibold text-sm text-slate-800">
                                                Tidak Ada Riwayat Semester Lampau
                                            </p>
                                            <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                                Santri ini baru memiliki catatan pemeriksaan pada semester aktif saat ini.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pastHistories.map((hist) => {
                                                const totalSakitPast =
                                                    (hist.riwayat_sakit?.ringan?.jumlah || 0) +
                                                    (hist.riwayat_sakit?.sedang?.jumlah || 0) +
                                                    (hist.riwayat_sakit?.berat?.jumlah || 0);

                                                return (
                                                    <div
                                                        key={hist.id}
                                                        className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3"
                                                    >
                                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-900 text-xs">
                                                                    {hist.tahun_akademik} (Semester {hist.semester})
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] font-medium text-slate-400">
                                                                Tercatat: {hist.tanggal}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs py-0.5">
                                                            <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                                                                <span className="text-slate-400 text-[10px] block font-medium">BB & TB</span>
                                                                <span className="font-bold text-slate-800 tabular-nums">
                                                                    {hist.berat_badan ?? '-'} kg / {hist.tinggi_badan ?? '-'} cm
                                                                </span>
                                                            </div>
                                                            <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                                                                <span className="text-slate-400 text-[10px] block font-medium">IMT</span>
                                                                <span className="font-bold text-slate-800 tabular-nums">
                                                                    {hist.imt ?? '-'} {hist.imt_kategori ? `(${hist.imt_kategori})` : ''}
                                                                </span>
                                                            </div>
                                                            <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                                                                <span className="text-slate-400 text-[10px] block font-medium">Tensi Darah</span>
                                                                <span className="font-bold text-slate-800 font-mono tabular-nums">
                                                                    {hist.tensi ?? '-'}
                                                                </span>
                                                            </div>
                                                            <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                                                                <span className="text-slate-400 text-[10px] block font-medium">Riwayat Sakit</span>
                                                                <span className={`font-bold ${totalSakitPast > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                                                    {totalSakitPast > 0 ? `${totalSakitPast} kali sakit` : 'Nihil (Sehat)'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {hist.catatan_kesehatan && (
                                                            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 bg-white/60 p-2.5 rounded-lg">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                                                    Catatan Petugas / Dokter:
                                                                </span>
                                                                <p className="leading-relaxed break-words italic">
                                                                    &ldquo;{hist.catatan_kesehatan}&rdquo;
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
                                <button
                                    type="button"
                                    onClick={() => setActiveStudentDetail(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition"
                                >
                                    Tutup
                                </button>

                                <Link
                                    href={`/kesehatan/pemeriksaan?kelas=${encodeURIComponent(activeStudentDetail.kelas)}&search=${encodeURIComponent(activeStudentDetail.nig)}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition"
                                >
                                    <Stethoscope className="w-3.5 h-3.5" />
                                    Update Pemeriksaan Fisik
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
