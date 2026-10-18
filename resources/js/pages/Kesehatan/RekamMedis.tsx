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

export default function RekamMedis({
    students,
    filters,
    options,
    stats,
}: Props) {
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun_akademik);
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [activeStudentDetail, setActiveStudentDetail] =
        useState<StudentRecord | null>(null);
    const [modalTab, setModalTab] = useState<'current' | 'history'>('current');

    const handleFilterChange = (newFilters: {
        tahun_akademik?: string;
        kelas?: string;
    }) => {
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
            },
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
            },
        );
    };

    // Client-side instant response filtering
    const filteredStudents = useMemo(() => {
        if (!searchInput.trim()) return students;
        const q = searchInput.toLowerCase();
        return students.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.nig.toLowerCase().includes(q),
        );
    }, [students, searchInput]);

    // Separate previous records to prevent duplication of current session
    const pastHistories = useMemo(() => {
        if (!activeStudentDetail) return [];
        const currentKesehatanId = activeStudentDetail.kesehatan?.id;
        return activeStudentDetail.riwayat_pemeriksaan.filter(
            (hist) => hist.id !== currentKesehatanId,
        );
    }, [activeStudentDetail]);

    const openStudentDetail = (student: StudentRecord) => {
        setActiveStudentDetail(student);
        setModalTab('current');
    };

    const getImtBadge = (kategori: string | null) => {
        if (!kategori) return <span className="text-xs text-slate-400">-</span>;
        switch (kategori.toLowerCase()) {
            case 'ideal':
                return (
                    <span className="inline-flex items-center rounded-md border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Ideal
                    </span>
                );
            case 'kurus':
                return (
                    <span className="inline-flex items-center rounded-md border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Kurus
                    </span>
                );
            case 'gemuk':
                return (
                    <span className="inline-flex items-center rounded-md border border-orange-200/80 bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">
                        Gemuk
                    </span>
                );
            case 'obesitas':
                return (
                    <span className="inline-flex items-center rounded-md border border-rose-200/80 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                        Obesitas
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {kategori}
                    </span>
                );
        }
    };

    const getTensiBadge = (kategori: string | null) => {
        if (!kategori) return <span className="text-xs text-slate-400">-</span>;
        const katLower = kategori.toLowerCase();
        if (katLower.includes('normal')) {
            return (
                <span className="inline-flex items-center rounded-md border border-sky-200/80 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700">
                    {kategori}
                </span>
            );
        }
        if (katLower.includes('hiper') || katLower.includes('tinggi')) {
            return (
                <span className="inline-flex items-center rounded-md border border-rose-200/80 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                    {kategori}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-md border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {kategori}
            </span>
        );
    };

    return (
        <DashboardLayout title="Rekam Medis Santri">
            <div className="mx-auto max-w-7xl space-y-6 pb-12 font-sans text-slate-800">
                {/* Header Banner Berwarna */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Rekam Medis Santri
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Rekapitulasi riwayat kesehatan, antropometri
                                    fisik, dan pemantauan medis Poskestren
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href="/kesehatan/pemeriksaan"
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-teal-500 active:scale-[0.98]"
                            >
                                <Stethoscope className="h-4 w-4" />
                                <span>Pemeriksaan Kesehatan Berkala</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filter & Pencarian Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5">
                    <div className="grid grid-cols-1 items-end gap-3 sm:gap-4 md:grid-cols-12">
                        <div className="space-y-1.5 md:col-span-4">
                            <label className="text-xs font-semibold text-slate-600">
                                Tahun Akademik & Semester
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <select
                                    value={selectedTahun}
                                    onChange={(e) =>
                                        handleFilterChange({
                                            tahun_akademik: e.target.value,
                                        })
                                    }
                                    className="w-full cursor-pointer appearance-none truncate rounded-xl border border-slate-200 bg-slate-50/80 py-2 pr-9 pl-10 text-sm font-medium text-slate-800 transition hover:bg-slate-100/70 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                >
                                    {options.tahun_akademik.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-3">
                            <label className="text-xs font-semibold text-slate-600">
                                Tingkat Kelas
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <Users className="h-4 w-4" />
                                </div>
                                <select
                                    value={selectedKelas}
                                    onChange={(e) =>
                                        handleFilterChange({
                                            kelas: e.target.value,
                                        })
                                    }
                                    className="w-full cursor-pointer appearance-none truncate rounded-xl border border-slate-200 bg-slate-50/80 py-2 pr-9 pl-10 text-sm font-medium text-slate-800 transition hover:bg-slate-100/70 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                >
                                    {options.kelas.map((k) => (
                                        <option key={k} value={k}>
                                            {k}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-5">
                            <label className="text-xs font-semibold text-slate-600">
                                Cari Santri
                            </label>
                            <form
                                onSubmit={handleSearchSubmit}
                                className="relative"
                            >
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <Search className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) =>
                                        setSearchInput(e.target.value)
                                    }
                                    placeholder="Cari nama santri atau NIG..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pr-9 pl-10 text-sm text-slate-800 placeholder-slate-400 transition hover:bg-slate-100/70 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchInput('');
                                            router.get(
                                                '/kesehatan/rekam-medis',
                                                {
                                                    tahun_akademik:
                                                        selectedTahun,
                                                    kelas: selectedKelas,
                                                },
                                                {
                                                    preserveState: true,
                                                    replace: true,
                                                },
                                            );
                                        }}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* 4. Tabel Rekam Medis Santri */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-teal-600" />
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
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500">
                                    <th className="w-12 px-4 py-3 text-center">
                                        No
                                    </th>
                                    <th className="px-4 py-3">Santri</th>
                                    <th className="px-4 py-3">Kelas</th>
                                    <th className="px-4 py-3">
                                        Antropometri (BB / TB / IMT)
                                    </th>
                                    <th className="px-4 py-3">Tekanan Darah</th>
                                    <th className="px-4 py-3">Riwayat Sakit</th>
                                    <th className="px-4 py-3 text-center">
                                        Status Medis
                                    </th>
                                    <th className="w-36 px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-12 text-center text-slate-500"
                                        >
                                            <div className="mx-auto max-w-sm space-y-3">
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                    <Info className="h-6 w-6" />
                                                </div>
                                                <p className="font-semibold text-slate-800">
                                                    Tidak ada data rekam medis
                                                    ditemukan
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Coba ubah kata kunci
                                                    pencarian atau ganti filter
                                                    kelas di atas.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, idx) => {
                                        const k = student.kesehatan;
                                        const sakitRingan =
                                            k?.riwayat_sakit?.ringan?.jumlah ||
                                            0;
                                        const sakitSedang =
                                            k?.riwayat_sakit?.sedang?.jumlah ||
                                            0;
                                        const sakitBerat =
                                            k?.riwayat_sakit?.berat?.jumlah ||
                                            0;
                                        const totalSakit =
                                            sakitRingan +
                                            sakitSedang +
                                            sakitBerat;
                                        const isExamined =
                                            student.sudah_diperiksa;

                                        return (
                                            <tr
                                                key={student.id}
                                                className="group transition-colors hover:bg-slate-50/70"
                                            >
                                                <td className="px-4 py-3.5 text-center text-xs font-semibold text-slate-400">
                                                    {idx + 1}
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <div className="font-semibold text-slate-900 transition-colors group-hover:text-teal-700">
                                                        {student.name}
                                                    </div>
                                                    <div className="font-mono text-xs text-slate-400">
                                                        NIG: {student.nig}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                                        {student.kelas}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    {k &&
                                                    (k.berat_badan ||
                                                        k.tinggi_badan) ? (
                                                        <div className="space-y-0.5">
                                                            <div className="text-xs font-medium text-slate-800 tabular-nums">
                                                                <span className="font-semibold">
                                                                    {k.berat_badan ??
                                                                        '-'}
                                                                </span>{' '}
                                                                kg /{' '}
                                                                <span className="font-semibold">
                                                                    {k.tinggi_badan ??
                                                                        '-'}
                                                                </span>{' '}
                                                                cm
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-mono text-[11px] text-slate-500">
                                                                    IMT{' '}
                                                                    {k.imt ??
                                                                        '-'}
                                                                </span>
                                                                {getImtBadge(
                                                                    k.imt_kategori,
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum ditimbang
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    {k?.tensi ? (
                                                        <div className="space-y-0.5">
                                                            <div className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                                                                {k.tensi}{' '}
                                                                <span className="text-[10px] font-normal text-slate-500">
                                                                    mmHg
                                                                </span>
                                                            </div>
                                                            <div>
                                                                {getTensiBadge(
                                                                    k.tensi_kategori,
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum tensi
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    {totalSakit > 0 ? (
                                                        <div className="space-y-0.5">
                                                            <span className="inline-flex items-center gap-1 rounded-md border border-rose-200/80 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                                                                <AlertCircle className="h-3 w-3 text-rose-500" />
                                                                {totalSakit}{' '}
                                                                kali sakit
                                                            </span>
                                                        </div>
                                                    ) : isExamined ? (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                            Nihil (Sehat)
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Belum ada data
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3.5 text-center">
                                                    {!isExamined ? (
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                            Belum Diperiksa
                                                        </span>
                                                    ) : totalSakit > 0 ? (
                                                        <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                                                            Perlu Perhatian
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                                                            Sehat Prima
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3.5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openStudentDetail(
                                                                    student,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                                                            title="Lihat riwayat lengkap rekam medis"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                                                            <span>Detail</span>
                                                        </button>

                                                        <Link
                                                            href={`/kesehatan/pemeriksaan?kelas=${encodeURIComponent(student.kelas)}&search=${encodeURIComponent(student.nig)}`}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100"
                                                            title="Input / Perbarui pemeriksaan kesehatan"
                                                        >
                                                            <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
                        <div className="animate-in fade-in zoom-in-95 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-150">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 font-bold text-teal-700">
                                        {activeStudentDetail.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="truncate text-base leading-tight font-bold text-slate-900">
                                            {activeStudentDetail.name}
                                        </h3>
                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                            NIG:{' '}
                                            <span className="font-mono">
                                                {activeStudentDetail.nig}
                                            </span>{' '}
                                            • {activeStudentDetail.kelas}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveStudentDetail(null)}
                                    className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Tab Bar: Memisahkan Pemeriksaan Terkini & Riwayat Lampau agar TIDAK terjadi pengulangan */}
                            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/40 px-6 pt-3 pb-0">
                                <button
                                    type="button"
                                    onClick={() => setModalTab('current')}
                                    className={`flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-all ${
                                        modalTab === 'current'
                                            ? 'border-teal-600 text-teal-700'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <Activity className="h-3.5 w-3.5" />
                                    <span>
                                        Pemeriksaan Terkini ({selectedTahun})
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalTab('history')}
                                    className={`flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-xs font-semibold transition-all ${
                                        modalTab === 'history'
                                            ? 'border-teal-600 text-teal-700'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    <History className="h-3.5 w-3.5" />
                                    <span>Riwayat Lampau</span>
                                    <span className="py-0.2 rounded-full bg-slate-200/80 px-1.5 text-[10px] font-bold text-slate-700">
                                        {pastHistories.length}
                                    </span>
                                </button>
                            </div>

                            {/* Modal Content with overflow-x-hidden to prevent horizontal scrolling */}
                            <div className="max-h-[70vh] space-y-5 overflow-x-hidden overflow-y-auto p-6">
                                {modalTab === 'current' ? (
                                    activeStudentDetail.kesehatan ? (
                                        <div className="space-y-4">
                                            {/* Subhead Info */}
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-1 text-xs text-slate-500">
                                                <span>
                                                    Data Pemeriksaan Poskestren
                                                    Semester Ini
                                                </span>
                                                {activeStudentDetail.kesehatan
                                                    .updated_at && (
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        Diperbarui:{' '}
                                                        {
                                                            activeStudentDetail
                                                                .kesehatan
                                                                .updated_at
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* Grid Metrik Fisik */}
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
                                                    <span className="block text-[11px] font-medium text-slate-500">
                                                        Berat Badan
                                                    </span>
                                                    <div className="mt-0.5 text-base font-bold text-slate-800 tabular-nums">
                                                        {activeStudentDetail
                                                            .kesehatan
                                                            .berat_badan ??
                                                            '-'}{' '}
                                                        <span className="text-xs font-normal text-slate-500">
                                                            kg
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
                                                    <span className="block text-[11px] font-medium text-slate-500">
                                                        Tinggi Badan
                                                    </span>
                                                    <div className="mt-0.5 text-base font-bold text-slate-800 tabular-nums">
                                                        {activeStudentDetail
                                                            .kesehatan
                                                            .tinggi_badan ??
                                                            '-'}{' '}
                                                        <span className="text-xs font-normal text-slate-500">
                                                            cm
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
                                                    <span className="block text-[11px] font-medium text-slate-500">
                                                        Indeks Massa Tubuh
                                                    </span>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-base font-bold text-slate-800">
                                                        <span className="tabular-nums">
                                                            {activeStudentDetail
                                                                .kesehatan
                                                                .imt ?? '-'}
                                                        </span>
                                                        {getImtBadge(
                                                            activeStudentDetail
                                                                .kesehatan
                                                                .imt_kategori,
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
                                                    <span className="block text-[11px] font-medium text-slate-500">
                                                        Tekanan Darah
                                                    </span>
                                                    <div className="mt-0.5 font-mono text-base font-bold text-slate-800 tabular-nums">
                                                        {activeStudentDetail
                                                            .kesehatan.tensi ??
                                                            '-'}
                                                    </div>
                                                    <div className="mt-1">
                                                        {getTensiBadge(
                                                            activeStudentDetail
                                                                .kesehatan
                                                                .tensi_kategori,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rincian Riwayat Sakit */}
                                            <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
                                                <span className="block text-xs font-bold text-slate-700">
                                                    Rincian Keluhan & Riwayat
                                                    Sakit
                                                </span>
                                                <div className="grid grid-cols-1 gap-2.5 text-xs sm:grid-cols-3">
                                                    <div className="rounded-lg border border-slate-200/70 bg-white p-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-slate-500">
                                                                Sakit Ringan
                                                            </span>
                                                            <span className="font-bold text-slate-800">
                                                                {activeStudentDetail
                                                                    .kesehatan
                                                                    .riwayat_sakit
                                                                    ?.ringan
                                                                    ?.jumlah ||
                                                                    0}
                                                                x
                                                            </span>
                                                        </div>
                                                        <p className="mt-1.5 text-[11px] leading-relaxed break-words text-slate-600">
                                                            {activeStudentDetail
                                                                .kesehatan
                                                                .riwayat_sakit
                                                                ?.ringan
                                                                ?.keterangan || (
                                                                <span className="text-slate-400 italic">
                                                                    Tidak ada
                                                                    keluhan
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-lg border border-slate-200/70 bg-white p-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-amber-600">
                                                                Sakit Sedang
                                                            </span>
                                                            <span className="font-bold text-amber-700">
                                                                {activeStudentDetail
                                                                    .kesehatan
                                                                    .riwayat_sakit
                                                                    ?.sedang
                                                                    ?.jumlah ||
                                                                    0}
                                                                x
                                                            </span>
                                                        </div>
                                                        <p className="mt-1.5 text-[11px] leading-relaxed break-words text-slate-600">
                                                            {activeStudentDetail
                                                                .kesehatan
                                                                .riwayat_sakit
                                                                ?.sedang
                                                                ?.keterangan || (
                                                                <span className="text-slate-400 italic">
                                                                    Tidak ada
                                                                    keluhan
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-lg border border-slate-200/70 bg-white p-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-rose-600">
                                                                Sakit Berat
                                                            </span>
                                                            <span className="font-bold text-rose-700">
                                                                {activeStudentDetail
                                                                    .kesehatan
                                                                    .riwayat_sakit
                                                                    ?.berat
                                                                    ?.jumlah ||
                                                                    0}
                                                                x
                                                            </span>
                                                        </div>
                                                        <p className="mt-1.5 text-[11px] leading-relaxed break-words text-slate-600">
                                                            {activeStudentDetail
                                                                .kesehatan
                                                                .riwayat_sakit
                                                                ?.berat
                                                                ?.keterangan || (
                                                                <span className="text-slate-400 italic">
                                                                    Tidak ada
                                                                    keluhan
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Catatan Medis & Rekomendasi Dokter */}
                                            {activeStudentDetail.kesehatan
                                                .catatan_kesehatan && (
                                                <div className="rounded-xl border border-teal-200/70 bg-teal-50/60 p-4">
                                                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-teal-800">
                                                        <Info className="h-4 w-4 shrink-0 text-teal-600" />
                                                        Catatan Medis &
                                                        Rekomendasi Dokter /
                                                        Petugas
                                                    </span>
                                                    <p className="text-xs leading-relaxed break-words text-teal-950">
                                                        {
                                                            activeStudentDetail
                                                                .kesehatan
                                                                .catatan_kesehatan
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Pintasan ke Riwayat Lampau jika ada */}
                                            {pastHistories.length > 0 && (
                                                <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                                                    <span>
                                                        Santri ini memiliki{' '}
                                                        {pastHistories.length}{' '}
                                                        data riwayat semester
                                                        lampau.
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setModalTab(
                                                                'history',
                                                            )
                                                        }
                                                        className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                                                    >
                                                        Lihat Riwayat Lampau
                                                        &rarr;
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
                                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/60 text-slate-500">
                                                <Stethoscope className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Belum Ada Pemeriksaan
                                                    Semester Ini
                                                </p>
                                                <p className="mx-auto max-w-sm text-xs text-slate-500">
                                                    Belum ada data antropometri
                                                    fisik maupun riwayat sakit
                                                    yang tercatat untuk{' '}
                                                    {selectedTahun}.
                                                </p>
                                            </div>
                                            <Link
                                                href={`/kesehatan/pemeriksaan?kelas=${encodeURIComponent(activeStudentDetail.kelas)}&search=${encodeURIComponent(activeStudentDetail.nig)}`}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                                            >
                                                <Stethoscope className="h-3.5 w-3.5" />
                                                Input Pemeriksaan Sekarang
                                            </Link>
                                        </div>
                                    )
                                ) : /* Tab Riwayat Lampau */
                                pastHistories.length === 0 ? (
                                    <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/60 text-slate-400">
                                            <History className="h-5 w-5" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Tidak Ada Riwayat Semester Lampau
                                        </p>
                                        <p className="mx-auto max-w-xs text-xs text-slate-500">
                                            Santri ini baru memiliki catatan
                                            pemeriksaan pada semester aktif saat
                                            ini.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pastHistories.map((hist) => {
                                            const totalSakitPast =
                                                (hist.riwayat_sakit?.ringan
                                                    ?.jumlah || 0) +
                                                (hist.riwayat_sakit?.sedang
                                                    ?.jumlah || 0) +
                                                (hist.riwayat_sakit?.berat
                                                    ?.jumlah || 0);

                                            return (
                                                <div
                                                    key={hist.id}
                                                    className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4"
                                                >
                                                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {
                                                                    hist.tahun_akademik
                                                                }{' '}
                                                                (Semester{' '}
                                                                {hist.semester})
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] font-medium text-slate-400">
                                                            Tercatat:{' '}
                                                            {hist.tanggal}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2.5 py-0.5 text-xs sm:grid-cols-4">
                                                        <div className="rounded-lg border border-slate-200/70 bg-white p-2.5">
                                                            <span className="block text-[10px] font-medium text-slate-400">
                                                                BB & TB
                                                            </span>
                                                            <span className="font-bold text-slate-800 tabular-nums">
                                                                {hist.berat_badan ??
                                                                    '-'}{' '}
                                                                kg /{' '}
                                                                {hist.tinggi_badan ??
                                                                    '-'}{' '}
                                                                cm
                                                            </span>
                                                        </div>
                                                        <div className="rounded-lg border border-slate-200/70 bg-white p-2.5">
                                                            <span className="block text-[10px] font-medium text-slate-400">
                                                                IMT
                                                            </span>
                                                            <span className="font-bold text-slate-800 tabular-nums">
                                                                {hist.imt ??
                                                                    '-'}{' '}
                                                                {hist.imt_kategori
                                                                    ? `(${hist.imt_kategori})`
                                                                    : ''}
                                                            </span>
                                                        </div>
                                                        <div className="rounded-lg border border-slate-200/70 bg-white p-2.5">
                                                            <span className="block text-[10px] font-medium text-slate-400">
                                                                Tensi Darah
                                                            </span>
                                                            <span className="font-mono font-bold text-slate-800 tabular-nums">
                                                                {hist.tensi ??
                                                                    '-'}
                                                            </span>
                                                        </div>
                                                        <div className="rounded-lg border border-slate-200/70 bg-white p-2.5">
                                                            <span className="block text-[10px] font-medium text-slate-400">
                                                                Riwayat Sakit
                                                            </span>
                                                            <span
                                                                className={`font-bold ${totalSakitPast > 0 ? 'text-rose-600' : 'text-emerald-700'}`}
                                                            >
                                                                {totalSakitPast >
                                                                0
                                                                    ? `${totalSakitPast} kali sakit`
                                                                    : 'Nihil (Sehat)'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {hist.catatan_kesehatan && (
                                                        <div className="rounded-lg border-t border-slate-200/60 bg-white/60 p-2.5 pt-2 text-xs text-slate-600">
                                                            <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                                Catatan Petugas
                                                                / Dokter:
                                                            </span>
                                                            <p className="leading-relaxed break-words italic">
                                                                &ldquo;
                                                                {
                                                                    hist.catatan_kesehatan
                                                                }
                                                                &rdquo;
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveStudentDetail(null)}
                                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200/70"
                                >
                                    Tutup
                                </button>

                                <Link
                                    href={`/kesehatan/pemeriksaan?kelas=${encodeURIComponent(activeStudentDetail.kelas)}&search=${encodeURIComponent(activeStudentDetail.nig)}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                                >
                                    <Stethoscope className="h-3.5 w-3.5" />
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
