import React, { useState, useMemo, useEffect } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Calendar,
    Users,
    BookOpen,
    Search,
    SlidersHorizontal,
    Printer,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    FileSpreadsheet,
    CheckCircle2,
    X,
    Loader2,
    Plus,
    Trash2,
    ClipboardList,
    Edit2,
} from 'lucide-react';
import {
    StudentGrade,
    GelaraOption,
    DistributionItem,
    LedgerStudentScore,
    PelengkapData,
    KesehatanData,
    LedgerStudent,
    ClassLedger,
    NilaiAkademikProps,
} from './types';
import KelolaMapelModal from './components/KelolaMapelModal';
import RaporPrintModal from './components/RaporPrintModal';
import LedgerPrintModal from './components/LedgerPrintModal';
import PelengkapRaporModal from './components/PelengkapRaporModal';

export default function NilaiAkademik({
    initialFilters = {
        tahun_akademik: 'T.A. 2026/2027 (Semester Ganjil)',
        kelas: 'Kelas 10',
        mata_pelajaran: 'Bahasa Arab',
        search: '',
    },
    options = {
        tahun_akademik: [
            'T.A. 2026/2027 (Semester Ganjil)',
            'T.A. 2026/2027 (Semester Genap)',
        ],
        kelas: ['Kelas 10', 'Kelas 11', 'Kelas 12'],
        mata_pelajaran: [
            'Bahasa Arab',
            'Pendidikan Agama Islam',
            'Matematika',
            'Literasi',
            'Numerasi',
        ],
    },
    kkm = 75.0,
    students = [],
    allGelaras = [],
    totalStudents = 0,
    gradedCount = 0,
    distribution = [],
    subjectKds = [],
    classLedger = { mapels: [], students: [] },
    waliKelas = null,
}: NilaiAkademikProps) {
    // Active filter values (derived directly from server props to prevent desync)
    const selectedTahun = initialFilters.tahun_akademik;
    const selectedKelas = initialFilters.kelas;
    const selectedMapel = initialFilters.mata_pelajaran;
    const [activeTab, setActiveTab] = useState<'nilai' | 'rapor'>('nilai');
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
    const [isKkmActive, setIsKkmActive] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // State untuk Cetak Rapor, Ledger & Pelengkap
    const [selectedRapor, setSelectedRapor] = useState<LedgerStudent | null>(
        null,
    );
    const [showLedger, setShowLedger] = useState(false);
    const [pelengkapStudent, setPelengkapStudent] =
        useState<LedgerStudent | null>(null);

    // Helpers untuk Rapor & Ledger
    const filteredLedgerStudents = useMemo(() => {
        if (!searchQuery.trim()) return classLedger.students;
        const q = searchQuery.toLowerCase();
        return classLedger.students.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.nig.toLowerCase().includes(q),
        );
    }, [classLedger.students, searchQuery]);

    const completeCount = useMemo(() => {
        return classLedger.students.filter((s) => s.is_complete).length;
    }, [classLedger.students]);

    const incompleteCount = classLedger.students.length - completeCount;

    const classOverallAvg = useMemo(() => {
        const validAvgs = classLedger.students
            .map((s) => s.avg)
            .filter((v) => v > 0);
        return validAvgs.length > 0
            ? Math.round(
                  (validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length) *
                      10,
              ) / 10
            : 0;
    }, [classLedger.students]);

    const classAvgTotal = useMemo(() => {
        const validTotals = classLedger.students
            .map((s) => s.total)
            .filter((v) => v > 0);
        return validTotals.length > 0
            ? Math.round(
                  (validTotals.reduce((a, b) => a + b, 0) /
                      validTotals.length) *
                      10,
              ) / 10
            : 0;
    }, [classLedger.students]);

    // Modals & batch state
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowScores, setRowScores] = useState<Record<number, any>>({});
    const [isKdModalOpen, setIsKdModalOpen] = useState(false);
    const [kdList, setKdList] = useState<string[]>(['']);
    const [isSavingKd, setIsSavingKd] = useState(false);

    // State untuk Kelola Mapel per Kelas
    const [isMapelModalOpen, setIsMapelModalOpen] = useState(false);

    // State untuk Atur Standar KKM
    const [isKkmModalOpen, setIsKkmModalOpen] = useState(false);
    const [inputKkm, setInputKkm] = useState<number>(kkm);
    const [isSavingKkm, setIsSavingKkm] = useState(false);

    useEffect(() => {
        setInputKkm(kkm);
    }, [kkm]);

    const handleSaveKkm = () => {
        setIsSavingKkm(true);
        router.post(
            '/kurikulum/nilai-akademik/kkm',
            {
                kkm: inputKkm,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsKkmModalOpen(false);
                    setIsSavingKkm(false);
                },
                onError: () => setIsSavingKkm(false),
            },
        );
    };

    const handleOpenKdModal = () => {
        setKdList(subjectKds && subjectKds.length > 0 ? [...subjectKds] : ['']);
        setIsKdModalOpen(true);
    };

    const handleAddKd = () => {
        if (kdList.length < 5) {
            setKdList((prev) => [...prev, '']);
        }
    };

    const handleRemoveKd = (index: number) => {
        if (kdList.length > 1) {
            setKdList((prev) => prev.filter((_, i) => i !== index));
        } else {
            setKdList(['']);
        }
    };

    const handleKdChange = (index: number, val: string) => {
        setKdList((prev) => {
            const next = [...prev];
            next[index] = val;
            return next;
        });
    };

    const handleSaveKd = () => {
        setIsSavingKd(true);
        router.post(
            '/kurikulum/nilai-akademik/kd',
            {
                tahun_akademik: selectedTahun,
                kelas: selectedKelas,
                mata_pelajaran: selectedMapel,
                kds: kdList.filter((k) => k.trim() !== ''),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingKd(false);
                    setIsKdModalOpen(false);
                },
                onError: () => {
                    setIsSavingKd(false);
                },
            },
        );
    };

    // Handle filter reload via Inertia
    const handleFilterChange = (updates: {
        tahun_akademik?: string;
        kelas?: string;
        mata_pelajaran?: string;
        search?: string;
    }) => {
        setIsEditMode(false);
        setRowScores({});

        const query = {
            tahun_akademik: updates.tahun_akademik ?? selectedTahun,
            kelas: updates.kelas ?? selectedKelas,
            mata_pelajaran: updates.mata_pelajaran ?? selectedMapel,
            search: updates.search ?? searchQuery,
        };

        router.get('/kurikulum/nilai-akademik', query, {
            preserveState: false,
            preserveScroll: true,
            replace: true,
        });
    };

    // Client-side quick filter on current loaded students
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return students;
        const q = searchQuery.toLowerCase();
        return students.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.nig.toLowerCase().includes(q),
        );
    }, [students, searchQuery]);

    // Mode input massal per kelas
    const startEditMode = () => {
        const map: Record<number, any> = {};
        students.forEach((s) => {
            map[s.id] = {
                h1: s.h1 > 0 ? s.h1 : '',
                h2: s.h2 > 0 ? s.h2 : '',
                h3: s.h3 > 0 ? s.h3 : '',
                h4: s.h4 > 0 ? s.h4 : '',
                h5: s.h5 > 0 ? s.h5 : '',
                uts: s.uts > 0 ? s.uts : '',
                uas: s.uas > 0 ? s.uas : '',
            };
        });
        setRowScores(map);
        setIsEditMode(true);
    };

    const handleSaveBatch = () => {
        setIsSaving(true);
        const scores = Object.entries(rowScores).map(([gelara_id, val]) => ({
            gelara_id: Number(gelara_id),
            h1: parseFloat(val.h1) || 0,
            h2: parseFloat(val.h2) || 0,
            h3: parseFloat(val.h3) || 0,
            h4: parseFloat(val.h4) || 0,
            h5: parseFloat(val.h5) || 0,
            uts: parseFloat(val.uts) || 0,
            uas: parseFloat(val.uas) || 0,
        }));

        router.post(
            '/kurikulum/nilai-akademik/batch',
            {
                tahun_akademik: selectedTahun,
                kelas: selectedKelas,
                mata_pelajaran: selectedMapel,
                scores,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    setIsEditMode(false);
                },
                onError: () => setIsSaving(false),
            },
        );
    };

    // Helper for predicate badges
    const getPredikatBadge = (predikat: string) => {
        switch (predikat) {
            case 'A':
                return 'bg-blue-600 text-white font-semibold shadow-xs';
            case 'A-':
                return 'bg-blue-100/90 text-blue-700 border border-blue-200 font-semibold';
            case 'B+':
                return 'bg-teal-100/90 text-teal-800 border border-teal-200 font-semibold';
            case 'B':
                return 'bg-slate-100 text-slate-700 border border-slate-200 font-medium';
            case 'C':
                return 'bg-amber-100 text-amber-800 border border-amber-200 font-medium';
            default:
                return 'bg-red-100 text-red-800 border border-red-200 font-medium';
        }
    };

    const maxBarCount = Math.max(...distribution.map((d) => d.count), 1);

    return (
        <DashboardLayout title="Manajemen Nilai Akademik Gelara">
            <div className="mx-auto max-w-7xl space-y-6 pb-12 font-sans text-slate-800">
                {/* Header Banner Berwarna */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Manajemen Nilai Akademik Gelara
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Pencatatan asesmen berkala, rekap capaian,
                                    konversi mutu, dan sinkronisasi data santri
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('nilai')}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition active:scale-[0.98] ${
                                    activeTab === 'nilai'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                                }`}
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                <span>Nilai Mata Pelajaran</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('rapor')}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition active:scale-[0.98] ${
                                    activeTab === 'rapor'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                                }`}
                            >
                                <Printer className="h-4 w-4" />
                                <span>Cetak Rapor & Ledger</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Filter Bar (Hanya tampil pada tab Nilai Mata Pelajaran) */}
                {activeTab === 'nilai' && (
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Tahun Akademik */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Tahun Akademik
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <select
                                        value={selectedTahun}
                                        onChange={(e) =>
                                            handleFilterChange({
                                                tahun_akademik: e.target.value,
                                            })
                                        }
                                        aria-label="Pilih Tahun Akademik"
                                        className="w-full cursor-pointer appearance-none truncate rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-9 pl-10 text-sm font-semibold text-slate-800 transition hover:bg-slate-100/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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

                            {/* Kelas */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Kelas
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-600">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <select
                                        value={selectedKelas}
                                        onChange={(e) =>
                                            handleFilterChange({
                                                kelas: e.target.value,
                                            })
                                        }
                                        aria-label="Pilih Kelas"
                                        className="w-full cursor-pointer appearance-none truncate rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-9 pl-10 text-sm font-semibold text-slate-800 transition hover:bg-slate-100/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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

                            {/* Mata Pelajaran */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Mata Pelajaran
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-600">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    <select
                                        value={selectedMapel}
                                        onChange={(e) =>
                                            handleFilterChange({
                                                mata_pelajaran: e.target.value,
                                            })
                                        }
                                        aria-label="Pilih Mata Pelajaran"
                                        className="w-full cursor-pointer appearance-none truncate rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pr-9 pl-10 text-sm font-semibold text-slate-800 transition hover:bg-slate-100/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                    >
                                        {options.mata_pelajaran.map((m) => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Main Two-Column Layout */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    {/* Left Column: Table & Controls */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs lg:col-span-8 xl:col-span-8 2xl:col-span-9">
                        {activeTab === 'rapor' ? (
                            <>
                                {/* Tab Rapor Header Toolbar */}
                                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center">
                                    <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-2.5">
                                        <span className="rounded-xl bg-slate-100 px-3 py-1.5 font-semibold text-slate-700">
                                            Total:{' '}
                                            <strong className="text-slate-900">
                                                {classLedger.students.length}{' '}
                                                Santri
                                            </strong>
                                        </span>
                                        <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                                            Lengkap:{' '}
                                            <strong className="text-emerald-800">
                                                {completeCount} Santri
                                            </strong>
                                        </span>
                                        {incompleteCount > 0 && (
                                            <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
                                                Belum Lengkap:{' '}
                                                <strong className="text-amber-800">
                                                    {incompleteCount} Santri
                                                </strong>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <div className="relative min-w-[200px] sm:min-w-[240px]">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <Search className="h-3.5 w-3.5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Cari santri atau NIG..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-7 pl-8 text-xs text-slate-800 transition placeholder:text-slate-400 hover:bg-slate-100/70 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSearchQuery('')
                                                    }
                                                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowLedger(true)}
                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
                                        >
                                            <FileSpreadsheet className="h-3.5 w-3.5" />
                                            <span>Cetak Ledger Kelas</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Tabel Gelara per Kelas (Rapor & Ledger Tab) */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                                <th
                                                    scope="col"
                                                    className="w-10 py-3.5 pr-1 pl-4 text-center"
                                                >
                                                    No
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="min-w-[160px] px-3 py-3.5 font-semibold text-slate-600"
                                                >
                                                    Gelara (Nama & NIG)
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-28 px-2.5 py-3.5 text-center"
                                                >
                                                    Rerata Nilai
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="min-w-[150px] px-3 py-3.5 text-center"
                                                >
                                                    Kelengkapan
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-28 px-2.5 py-3.5 text-center"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="min-w-[210px] py-3.5 pr-4 pl-2 text-center"
                                                >
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {filteredLedgerStudents.length ===
                                            0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="py-12 text-center text-slate-400"
                                                    >
                                                        Tidak ada data santri
                                                        pada kelas ini.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredLedgerStudents.map(
                                                    (student, idx) => (
                                                        <tr
                                                            key={student.id}
                                                            className="transition-colors hover:bg-blue-50/30"
                                                        >
                                                            <td className="py-3 pr-1 pl-4 text-center text-xs font-semibold text-slate-400">
                                                                {idx + 1}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="text-xs leading-snug font-semibold text-slate-900 sm:text-sm">
                                                                    {
                                                                        student.name
                                                                    }
                                                                </div>
                                                                <div className="mt-0.5 text-[11px] text-slate-500">
                                                                    <span>
                                                                        {
                                                                            student.nig
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-2.5 py-3 text-center">
                                                                {student.avg >
                                                                0 ? (
                                                                    <div className="inline-flex items-center gap-1.5">
                                                                        <span className="text-xs font-bold text-blue-600 sm:text-sm">
                                                                            {student.avg.toFixed(
                                                                                1,
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={`py-0.2 inline-block rounded px-1.5 text-[10px] font-bold ${getPredikatBadge(
                                                                                student.predikat,
                                                                            )}`}
                                                                        >
                                                                            {
                                                                                student.predikat
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-slate-300">
                                                                        -
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="mx-auto w-full max-w-[140px] space-y-1">
                                                                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                                                                        <span>
                                                                            {
                                                                                student.filled_count
                                                                            }
                                                                            /
                                                                            {
                                                                                student.total_count
                                                                            }{' '}
                                                                            Mapel
                                                                        </span>
                                                                        <span>
                                                                            {Math.round(
                                                                                (student.filled_count /
                                                                                    Math.max(
                                                                                        student.total_count,
                                                                                        1,
                                                                                    )) *
                                                                                    100,
                                                                            )}
                                                                            %
                                                                        </span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all duration-300 ${
                                                                                student.is_complete
                                                                                    ? 'bg-emerald-500'
                                                                                    : 'bg-blue-500'
                                                                            }`}
                                                                            style={{
                                                                                width: `${(student.filled_count / Math.max(student.total_count, 1)) * 100}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-2.5 py-3 text-center">
                                                                {student.is_complete ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                                                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                                        <span>
                                                                            Lengkap
                                                                        </span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                                                                        Belum
                                                                        Lengkap
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 pr-4 pl-2 text-center">
                                                                <div className="flex items-center justify-center gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setPelengkapStudent(
                                                                                student,
                                                                            )
                                                                        }
                                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-[0.98]"
                                                                        title="Input Nilai Sikap, Ekskul, Absensi & Catatan Wali"
                                                                    >
                                                                        <ClipboardList className="h-3.5 w-3.5 text-blue-600" />
                                                                        <span>
                                                                            Pelengkap
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setSelectedRapor(
                                                                                student,
                                                                            )
                                                                        }
                                                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
                                                                    >
                                                                        <Printer className="h-3.5 w-3.5" />
                                                                        <span>
                                                                            Cetak
                                                                            Rapor
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer Rapor Tab */}
                                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row">
                                    <div className="flex items-center gap-2">
                                        <span>
                                            Menampilkan{' '}
                                            <strong className="text-slate-700">
                                                {filteredLedgerStudents.length}
                                            </strong>{' '}
                                            santri di {selectedKelas}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowLedger(true)}
                                            className="inline-flex cursor-pointer items-center gap-1.5 font-bold text-blue-600 transition hover:text-blue-800"
                                        >
                                            <FileSpreadsheet className="h-3.5 w-3.5" />
                                            <span>
                                                Buka Lembar Rekap Ledger Kelas
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Tab Nilai Header Toolbar */}
                                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <div className="mr-1 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-blue-600" />
                                            <h2 className="text-base font-extrabold text-slate-900">
                                                {selectedMapel}
                                            </h2>
                                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                                                {selectedKelas}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleOpenKdModal}
                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-blue-500 hover:text-blue-600 active:scale-[0.98]"
                                        >
                                            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                                            <span>Kompetensi Dasar (KD)</span>
                                            {subjectKds &&
                                                subjectKds.length > 0 && (
                                                    <span className="py-0.2 rounded-full bg-blue-100 px-1.5 text-[10px] font-bold text-blue-700">
                                                        {subjectKds.length} KD
                                                    </span>
                                                )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsMapelModalOpen(true)
                                            }
                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-blue-500 hover:text-blue-600 active:scale-[0.98]"
                                        >
                                            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                                            <span>Kelola Mapel</span>
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="relative min-w-[200px] sm:min-w-[240px]">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <Search className="h-3.5 w-3.5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleFilterChange({
                                                            search: searchQuery,
                                                        });
                                                    }
                                                }}
                                                placeholder="Cari santri..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-7 pl-8 text-xs text-slate-800 transition placeholder:text-slate-400 hover:bg-slate-100/70 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        handleFilterChange({
                                                            search: '',
                                                        });
                                                    }}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {isEditMode ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setIsEditMode(false)
                                                    }
                                                    className="cursor-pointer rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={handleSaveBatch}
                                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    {isSaving && (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    )}
                                                    <span>
                                                        {isSaving
                                                            ? 'Menyimpan...'
                                                            : 'Simpan Semua'}
                                                    </span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={startEditMode}
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98]"
                                            >
                                                <FileSpreadsheet className="h-3.5 w-3.5" />
                                                <span>Input / Edit Nilai</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Status Pengisian & KKM Sub-bar */}
                                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-2.5 text-xs text-slate-500">
                                    <div>
                                        Status Pengisian:{' '}
                                        <strong
                                            className={
                                                gradedCount > 0
                                                    ? 'font-bold text-emerald-700'
                                                    : 'font-semibold text-slate-700'
                                            }
                                        >
                                            {gradedCount} dari{' '}
                                            {filteredStudents.length} Santri
                                            Dinilai
                                        </strong>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                        <span>
                                            Standar KKM:{' '}
                                            <strong className="font-bold text-slate-800">
                                                {kkm.toFixed(1)}
                                            </strong>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInputKkm(kkm);
                                                setIsKkmModalOpen(true);
                                            }}
                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700 transition hover:bg-blue-100 active:scale-95"
                                            title="Ubah Standar KKM untuk semua mata pelajaran"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                            <span>
                                                Atur KKM (Semua Pelajaran)
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Banner jika Belum Ada Nilai pada Mata Pelajaran Terpilih */}
                                {gradedCount === 0 &&
                                    filteredStudents.length > 0 && (
                                        <div className="mx-5 my-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 p-3 text-xs text-amber-800">
                                            <span>
                                                Belum ada nilai yang diinput
                                                untuk mata pelajaran{' '}
                                                <strong>{selectedMapel}</strong>{' '}
                                                di {selectedKelas} (
                                                {selectedTahun}).
                                            </span>
                                            <button
                                                type="button"
                                                onClick={startEditMode}
                                                className="cursor-pointer font-bold text-amber-900 underline hover:text-amber-950"
                                            >
                                                Input Nilai Sekarang
                                            </button>
                                        </div>
                                    )}

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                                <th
                                                    scope="col"
                                                    className="w-10 py-3.5 pr-1 pl-4 text-center"
                                                >
                                                    No
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="min-w-[150px] px-3 py-3.5 font-semibold text-slate-600"
                                                >
                                                    Gelara / Santri
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-12 px-2 py-3.5 text-center"
                                                >
                                                    H1
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-12 px-2 py-3.5 text-center"
                                                >
                                                    H2
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-12 px-2 py-3.5 text-center"
                                                >
                                                    H3
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-12 px-2 py-3.5 text-center"
                                                >
                                                    H4
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-12 px-2 py-3.5 text-center"
                                                >
                                                    H5
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-12 px-2 py-3.5 text-center"
                                                >
                                                    UTS
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-12 px-2 py-3.5 text-center"
                                                >
                                                    UAS
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-16 px-2.5 py-3.5 text-center"
                                                >
                                                    Akhir
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="w-14 px-2.5 py-3.5 text-center"
                                                >
                                                    Predikat
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {filteredStudents.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={11}
                                                        className="py-12 text-center text-slate-400"
                                                    >
                                                        Tidak ada santri yang
                                                        cocok dari database Data
                                                        Gelara.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredStudents.map(
                                                    (student, idx) => (
                                                        <tr
                                                            key={student.id}
                                                            className="group transition-colors hover:bg-blue-50/30"
                                                        >
                                                            {/* No */}
                                                            <td className="py-3 pr-1 pl-4 text-center text-xs font-semibold text-slate-400">
                                                                {idx + 1}
                                                            </td>

                                                            {/* Santri Info */}
                                                            <td className="px-3 py-3">
                                                                <div className="text-xs leading-snug font-semibold text-slate-900 sm:text-sm">
                                                                    {
                                                                        student.name
                                                                    }
                                                                </div>
                                                                <div className="mt-0.5 text-[11px] text-slate-500">
                                                                    <span>
                                                                        {
                                                                            student.nig
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {(() => {
                                                                const cur =
                                                                    isEditMode &&
                                                                    rowScores[
                                                                        student
                                                                            .id
                                                                    ]
                                                                        ? rowScores[
                                                                              student
                                                                                  .id
                                                                          ]
                                                                        : student;
                                                                const toNum = (
                                                                    v: any,
                                                                ) =>
                                                                    parseFloat(
                                                                        v,
                                                                    ) || 0;
                                                                const harianFilled =
                                                                    [
                                                                        cur.h1,
                                                                        cur.h2,
                                                                        cur.h3,
                                                                        cur.h4,
                                                                        cur.h5,
                                                                    ]
                                                                        .map(
                                                                            toNum,
                                                                        )
                                                                        .filter(
                                                                            (
                                                                                v,
                                                                            ) =>
                                                                                v >
                                                                                0,
                                                                        );
                                                                const rH =
                                                                    harianFilled.length >
                                                                    0
                                                                        ? harianFilled.reduce(
                                                                              (
                                                                                  a,
                                                                                  b,
                                                                              ) =>
                                                                                  a +
                                                                                  b,
                                                                              0,
                                                                          ) /
                                                                          harianFilled.length
                                                                        : 0;
                                                                const nA =
                                                                    Math.round(
                                                                        (rH *
                                                                            0.6 +
                                                                            toNum(
                                                                                cur.uts,
                                                                            ) *
                                                                                0.2 +
                                                                            toNum(
                                                                                cur.uas,
                                                                            ) *
                                                                                0.2) *
                                                                            10,
                                                                    ) / 10;
                                                                const pred =
                                                                    nA >= 85
                                                                        ? 'A'
                                                                        : nA >=
                                                                            75
                                                                          ? 'B'
                                                                          : nA >=
                                                                              65
                                                                            ? 'C'
                                                                            : 'D';

                                                                return (
                                                                    <>
                                                                        {(
                                                                            [
                                                                                'h1',
                                                                                'h2',
                                                                                'h3',
                                                                                'h4',
                                                                                'h5',
                                                                                'uts',
                                                                                'uas',
                                                                            ] as const
                                                                        ).map(
                                                                            (
                                                                                field,
                                                                            ) => (
                                                                                <td
                                                                                    key={
                                                                                        field
                                                                                    }
                                                                                    className="px-1 py-2.5 text-center"
                                                                                >
                                                                                    {isEditMode ? (
                                                                                        <input
                                                                                            type="number"
                                                                                            min="0"
                                                                                            max="100"
                                                                                            step="0.1"
                                                                                            placeholder="0"
                                                                                            value={
                                                                                                rowScores[
                                                                                                    student
                                                                                                        .id
                                                                                                ]?.[
                                                                                                    field
                                                                                                ] ??
                                                                                                ''
                                                                                            }
                                                                                            onFocus={(
                                                                                                e,
                                                                                            ) =>
                                                                                                e.target.select()
                                                                                            }
                                                                                            onChange={(
                                                                                                e,
                                                                                            ) => {
                                                                                                const raw =
                                                                                                    e
                                                                                                        .target
                                                                                                        .value;
                                                                                                setRowScores(
                                                                                                    (
                                                                                                        prev,
                                                                                                    ) => ({
                                                                                                        ...prev,
                                                                                                        [student.id]:
                                                                                                            {
                                                                                                                ...prev[
                                                                                                                    student
                                                                                                                        .id
                                                                                                                ],
                                                                                                                [field]:
                                                                                                                    raw ===
                                                                                                                    ''
                                                                                                                        ? ''
                                                                                                                        : Math.min(
                                                                                                                              100,
                                                                                                                              Math.max(
                                                                                                                                  0,
                                                                                                                                  parseFloat(
                                                                                                                                      raw,
                                                                                                                                  ) ||
                                                                                                                                      0,
                                                                                                                              ),
                                                                                                                          ),
                                                                                                            },
                                                                                                    }),
                                                                                                );
                                                                                            }}
                                                                                            className="w-12 rounded border border-slate-300 bg-white py-1 text-center text-xs font-semibold placeholder:text-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                                                        />
                                                                                    ) : (
                                                                                        <span className="text-xs font-medium text-slate-700">
                                                                                            {student[
                                                                                                field
                                                                                            ] >
                                                                                            0 ? (
                                                                                                student[
                                                                                                    field
                                                                                                ]
                                                                                            ) : (
                                                                                                <span className="text-slate-300">
                                                                                                    -
                                                                                                </span>
                                                                                            )}
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                            ),
                                                                        )}

                                                                        {/* Nilai Akhir */}
                                                                        <td className="px-2.5 py-3 text-center">
                                                                            <span className="text-xs font-bold text-blue-600">
                                                                                {nA >
                                                                                0
                                                                                    ? nA.toFixed(
                                                                                          1,
                                                                                      )
                                                                                    : '-'}
                                                                            </span>
                                                                        </td>

                                                                        {/* Predikat */}
                                                                        <td className="px-2.5 py-3 text-center">
                                                                            <span
                                                                                className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold ${getPredikatBadge(
                                                                                    pred,
                                                                                )}`}
                                                                            >
                                                                                {nA >
                                                                                0
                                                                                    ? pred
                                                                                    : '-'}
                                                                            </span>
                                                                        </td>
                                                                    </>
                                                                );
                                                            })()}
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer & Pagination */}
                                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row">
                                    <div className="flex items-center gap-2">
                                        <span>
                                            Menampilkan{' '}
                                            <strong className="text-slate-700">
                                                1 - {filteredStudents.length}
                                            </strong>{' '}
                                            dari{' '}
                                            <strong className="text-slate-700">
                                                {totalStudents}
                                            </strong>{' '}
                                            Gelara terdaftar
                                        </span>
                                        <span>•</span>
                                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Tersinkronisasi dengan Database
                                            Gelara
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            disabled={currentPage === 1}
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            aria-label="Halaman Sebelumnya"
                                            className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        {[1, 2, 3].map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className={`h-8 w-8 cursor-pointer rounded-lg text-xs font-bold transition ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white shadow-xs'
                                                        : 'text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            disabled={currentPage === 3}
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.min(3, p + 1),
                                                )
                                            }
                                            aria-label="Halaman Selanjutnya"
                                            className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Distribusi Mutu Card / Rekap Rapor Card */}
                    <div className="space-y-4 lg:col-span-4 xl:col-span-4 2xl:col-span-3">
                        {activeTab === 'rapor' ? (
                            <div className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                                <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                                    Rekap Rapor & Ledger
                                </h2>
                                <p className="text-xs leading-relaxed text-slate-500">
                                    Ringkasan kelengkapan nilai akademik dan
                                    kesiapan dokumen evaluasi santri untuk{' '}
                                    <strong>{selectedKelas}</strong> (
                                    {selectedTahun}).
                                </p>

                                <div className="space-y-2.5 pt-1">
                                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        <span className="text-xs font-semibold text-slate-600">
                                            Total Santri di Kelas
                                        </span>
                                        <span className="text-sm font-bold text-slate-900">
                                            {classLedger.students.length} Santri
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                                        <span className="text-xs font-semibold text-emerald-800">
                                            Nilai Lengkap (Siap Cetak)
                                        </span>
                                        <span className="text-sm font-bold text-emerald-800">
                                            {completeCount} Santri
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                                        <span className="text-xs font-semibold text-amber-800">
                                            Belum Lengkap
                                        </span>
                                        <span className="text-sm font-bold text-amber-800">
                                            {incompleteCount} Santri
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                                        <span className="text-xs font-semibold text-blue-800">
                                            Rerata Nilai Kelas
                                        </span>
                                        <span className="text-sm font-bold text-blue-900">
                                            {classOverallAvg > 0
                                                ? classOverallAvg.toFixed(1)
                                                : '-'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowLedger(true)}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.99]"
                                >
                                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                                    <span>Buka Ledger Rekapitulasi</span>
                                </button>

                                <div className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs text-slate-600">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                        <Printer className="h-3.5 w-3.5 text-blue-600" />
                                        <span>Petunjuk Cetak Dokumen:</span>
                                    </div>
                                    <ul className="list-inside list-disc space-y-1 pl-0.5 text-[11px] text-slate-500">
                                        <li>
                                            Cetak Rapor diformat otomatis untuk
                                            kertas <strong>A4 Portrait</strong>.
                                        </li>
                                        <li>
                                            Cetak Ledger diformat otomatis untuk
                                            kertas <strong>A4 Landscape</strong>
                                            .
                                        </li>
                                        <li>
                                            Gunakan opsi <em>Save as PDF</em>{' '}
                                            pada browser untuk mengunduh dokumen
                                            digital.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                                <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                                    Distribusi Mutu
                                </h2>

                                {/* Mini Bar Chart (Pure CSS) */}
                                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                                    <div className="flex h-28 items-end justify-between gap-3 border-b border-slate-200 px-2 pt-4">
                                        {distribution.map((item) => {
                                            const heightPercent =
                                                item.count > 0
                                                    ? Math.max(
                                                          16,
                                                          Math.round(
                                                              (item.count /
                                                                  maxBarCount) *
                                                                  100,
                                                          ),
                                                      )
                                                    : 6;

                                            return (
                                                <div
                                                    key={item.grade}
                                                    className="group flex h-full flex-1 flex-col items-center justify-end"
                                                >
                                                    <span className="mb-1 text-[11px] font-bold text-slate-600">
                                                        {item.count}
                                                    </span>
                                                    <div
                                                        style={{
                                                            height: `${heightPercent}%`,
                                                        }}
                                                        className={`w-full max-w-[36px] ${item.barColor} rounded-t-md transition-all duration-300 group-hover:brightness-95`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* X-Axis Labels */}
                                    <div className="flex justify-between gap-3 px-2 pt-2 text-[11px] font-bold text-slate-500">
                                        {distribution.map((item) => (
                                            <div
                                                key={item.grade}
                                                className="flex-1 text-center"
                                            >
                                                {item.grade}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Breakdown List */}
                                <div className="space-y-3 pt-1">
                                    {distribution.map((item) => (
                                        <div
                                            key={item.grade}
                                            className="flex items-center justify-between text-xs"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                                <span className="font-semibold text-slate-700">
                                                    Predikat {item.grade} (
                                                    {item.range})
                                                </span>
                                            </div>
                                            <div className="font-medium text-slate-600">
                                                <span className="font-bold text-slate-800">
                                                    {item.count} Gelara
                                                </span>{' '}
                                                <span className="text-slate-400">
                                                    (
                                                    {item.percentage.toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Standar Kelulusan Callout Box */}
                                <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3.5 text-xs leading-relaxed text-blue-900">
                                    <p>
                                        <strong className="font-bold text-blue-950">
                                            Standar Kelulusan:
                                        </strong>{' '}
                                        KKM minimal mata pelajaran adalah{' '}
                                        <strong className="font-semibold text-blue-950">
                                            {kkm.toFixed(2)}
                                        </strong>
                                        .
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Modal: Form Kompetensi Dasar (KD) Per Mata Pelajaran */}
                {isKdModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
                        <div className="animate-in fade-in zoom-in-95 w-full max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-150">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base leading-tight font-bold text-slate-900">
                                            Kompetensi Dasar (KD)
                                        </h3>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {selectedMapel} ({selectedKelas})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsKdModalOpen(false)}
                                    aria-label="Tutup form KD"
                                    className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Context Badge */}
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                <span className="font-semibold text-slate-800">
                                    {selectedMapel}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span>{selectedKelas}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">
                                    {selectedTahun}
                                </span>
                            </div>

                            {/* Info */}
                            <p className="text-xs leading-relaxed text-slate-500">
                                Masukkan daftar Kompetensi Dasar (KD) untuk mata
                                pelajaran ini (bisa memasukkan hingga 5 KD).
                                Pengaturan ini otomatis berlaku untuk seluruh
                                santri di kelas {selectedKelas}.
                            </p>

                            {/* List KD Inputs */}
                            <div className="max-h-[280px] space-y-2.5 overflow-y-auto pr-1">
                                {kdList.map((kd, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-12 shrink-0 rounded-lg border border-blue-100 bg-blue-50 px-1 py-2 text-center text-xs font-bold text-blue-700">
                                            KD {index + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={kd}
                                            onChange={(e) =>
                                                handleKdChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Contoh: Memahami materi KD ${index + 1}...`}
                                            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                        />
                                        {kdList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveKd(index)
                                                }
                                                title="Hapus KD ini"
                                                className="shrink-0 cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Tambah KD Button (Max 5) */}
                            {kdList.length < 5 && (
                                <button
                                    type="button"
                                    onClick={handleAddKd}
                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-blue-300 bg-blue-50/40 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-500 hover:bg-blue-50"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>
                                        Tambah Kompetensi Dasar (
                                        {5 - kdList.length} tersisa)
                                    </span>
                                </button>
                            )}

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsKdModalOpen(false)}
                                    disabled={isSavingKd}
                                    className="cursor-pointer rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveKd}
                                    disabled={isSavingKd}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSavingKd && (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    )}
                                    <span>
                                        {isSavingKd
                                            ? 'Menyimpan...'
                                            : 'Simpan KD'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal: Kelola Mata Pelajaran Kelas */}
                <KelolaMapelModal
                    isOpen={isMapelModalOpen}
                    selectedKelas={selectedKelas}
                    initialMapels={options.mata_pelajaran}
                    onClose={() => setIsMapelModalOpen(false)}
                />

                {/* Modal: Atur KKM Universal */}
                {isKkmModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
                        <div className="animate-in fade-in zoom-in-95 w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-150">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Atur Standar KKM Universal
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Berlaku untuk{' '}
                                        <strong className="font-semibold text-blue-900">
                                            semua mata pelajaran &amp; kelas
                                        </strong>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsKkmModalOpen(false)}
                                    className="cursor-pointer text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Nilai KKM Minimal (0 - 100)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    value={inputKkm}
                                    onChange={(e) =>
                                        setInputKkm(
                                            parseFloat(e.target.value) || 0,
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                                />
                                <p className="text-[11px] text-slate-400">
                                    Santri dengan nilai akhir &ge; nilai ini
                                    akan dianggap tuntas KKM.
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsKkmModalOpen(false)}
                                    className="cursor-pointer rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={isSavingKkm}
                                    onClick={handleSaveKkm}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isSavingKkm && (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    )}
                                    <span>Simpan KKM</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. Modal: Pratinjau Rapor Santri (A4 Portrait) */}
                <RaporPrintModal
                    student={selectedRapor}
                    selectedKelas={selectedKelas}
                    selectedTahun={selectedTahun}
                    classLedger={classLedger}
                    waliKelas={waliKelas}
                    onClose={() => setSelectedRapor(null)}
                />

                {/* 7b. Modal: Input Data Pelengkap Rapor */}
                <PelengkapRaporModal
                    student={pelengkapStudent}
                    selectedKelas={selectedKelas}
                    selectedTahun={selectedTahun}
                    onClose={() => setPelengkapStudent(null)}
                />

                {/* 8. Modal: Pratinjau Ledger Kelas (A4 Landscape) */}
                <LedgerPrintModal
                    isOpen={showLedger}
                    classLedger={classLedger}
                    selectedKelas={selectedKelas}
                    selectedTahun={selectedTahun}
                    waliKelas={waliKelas}
                    onClose={() => setShowLedger(false)}
                />

                {/* 9. Print CSS: Sesuai aturan Issue (multi-page A4, page-break-after, dan visibility) */}
                <style>{`
@media print {
  body * { visibility: hidden !important; }
  #print-area, #print-area * { visibility: visible !important; }
  #print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    color: black !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    z-index: 9999999 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .print-page {
    page-break-after: always !important;
    break-after: page !important;
    box-sizing: border-box !important;
    min-height: 285mm !important;
    padding: 12mm 15mm !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    background: white !important;
  }
  .print-page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
  .no-print { display: none !important; }
  @page {
    size: ${showLedger ? 'A4 landscape' : 'A4 portrait'};
    margin: ${showLedger ? '8mm' : '0'};
  }
}
`}</style>
            </div>
        </DashboardLayout>
    );
}
