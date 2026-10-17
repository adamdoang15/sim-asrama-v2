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
    const [selectedRapor, setSelectedRapor] = useState<LedgerStudent | null>(null);
    const [showLedger, setShowLedger] = useState(false);
    const [pelengkapStudent, setPelengkapStudent] = useState<LedgerStudent | null>(null);

    // Helpers untuk Rapor & Ledger
    const filteredLedgerStudents = useMemo(() => {
        if (!searchQuery.trim()) return classLedger.students;
        const q = searchQuery.toLowerCase();
        return classLedger.students.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.nig.toLowerCase().includes(q)
        );
    }, [classLedger.students, searchQuery]);

    const completeCount = useMemo(() => {
        return classLedger.students.filter((s) => s.is_complete).length;
    }, [classLedger.students]);

    const incompleteCount = classLedger.students.length - completeCount;

    const classOverallAvg = useMemo(() => {
        const validAvgs = classLedger.students.map((s) => s.avg).filter((v) => v > 0);
        return validAvgs.length > 0
            ? Math.round((validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length) * 10) / 10
            : 0;
    }, [classLedger.students]);

    const classAvgTotal = useMemo(() => {
        const validTotals = classLedger.students.map((s) => s.total).filter((v) => v > 0);
        return validTotals.length > 0
            ? Math.round((validTotals.reduce((a, b) => a + b, 0) / validTotals.length) * 10) / 10
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
            }
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
            }
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
            search: updates.search ?? searchQuery
        };

        router.get('/kurikulum/nilai-akademik', query, {
            preserveState: false,
            preserveScroll: true,
            replace: true
        });
    };

    // Client-side quick filter on current loaded students
    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return students;
        const q = searchQuery.toLowerCase();
        return students.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.nig.toLowerCase().includes(q)
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

        router.post('/kurikulum/nilai-akademik/batch', {
            tahun_akademik: selectedTahun,
            kelas: selectedKelas,
            mata_pelajaran: selectedMapel,
            scores,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setIsEditMode(false);
            },
            onError: () => setIsSaving(false),
        });
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
            <div className="space-y-6 pb-12 font-sans text-slate-800 max-w-7xl mx-auto">
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
                                <p className="text-xs text-slate-200 sm:text-sm mt-0.5">
                                    Pencatatan asesmen berkala, rekap capaian, konversi mutu, dan sinkronisasi data santri
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab('nilai')}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-[0.98] cursor-pointer ${activeTab === 'nilai'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                                    }`}
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>Nilai Mata Pelajaran</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('rapor')}
                                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-[0.98] cursor-pointer ${activeTab === 'rapor'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                                    }`}
                            >
                                <Printer className="w-4 h-4" />
                                <span>Cetak Rapor & Ledger</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Filter Bar (Hanya tampil pada tab Nilai Mata Pelajaran) */}
                {activeTab === 'nilai' && (
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Tahun Akademik */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Tahun Akademik
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={selectedTahun}
                                        onChange={(e) => handleFilterChange({ tahun_akademik: e.target.value })}
                                        aria-label="Pilih Tahun Akademik"
                                        className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none truncate"
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

                            {/* Kelas */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Kelas
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={selectedKelas}
                                        onChange={(e) => handleFilterChange({ kelas: e.target.value })}
                                        aria-label="Pilih Kelas"
                                        className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none truncate"
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

                            {/* Mata Pelajaran */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Mata Pelajaran
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={selectedMapel}
                                        onChange={(e) => handleFilterChange({ mata_pelajaran: e.target.value })}
                                        aria-label="Pilih Mata Pelajaran"
                                        className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer appearance-none truncate"
                                    >
                                        {options.mata_pelajaran.map((m) => (
                                            <option key={m} value={m}>
                                                {m}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. Main Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Table & Controls */}
                    <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                        {activeTab === 'rapor' ? (
                            <>
                                {/* Tab Rapor Header Toolbar */}
                                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs">
                                        <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700">
                                            Total: <strong className="text-slate-900">{classLedger.students.length} Santri</strong>
                                        </span>
                                        <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 font-semibold text-emerald-700">
                                            Lengkap: <strong className="text-emerald-800">{completeCount} Santri</strong>
                                        </span>
                                        {incompleteCount > 0 && (
                                            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-semibold text-amber-700">
                                                Belum Lengkap: <strong className="text-amber-800">{incompleteCount} Santri</strong>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <div className="relative min-w-[200px] sm:min-w-[240px]">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <Search className="w-3.5 h-3.5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Cari santri atau NIG..."
                                                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowLedger(true)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition active:scale-[0.98] cursor-pointer"
                                        >
                                            <FileSpreadsheet className="w-3.5 h-3.5" />
                                            <span>Cetak Ledger Kelas</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Tabel Gelara per Kelas (Rapor & Ledger Tab) */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                <th scope="col" className="py-3.5 pl-4 pr-1 w-10 text-center">
                                                    No
                                                </th>
                                                <th scope="col" className="py-3.5 px-3 font-semibold text-slate-600 min-w-[160px]">
                                                    Gelara (Nama & NIG)
                                                </th>
                                                <th scope="col" className="py-3.5 px-2.5 text-center w-28">
                                                    Rerata Nilai
                                                </th>
                                                <th scope="col" className="py-3.5 px-3 text-center min-w-[150px]">
                                                    Kelengkapan
                                                </th>
                                                <th scope="col" className="py-3.5 px-2.5 text-center w-28">
                                                    Status
                                                </th>
                                                <th scope="col" className="py-3.5 pr-4 pl-2 text-center min-w-[210px]">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {filteredLedgerStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                                        Tidak ada data santri pada kelas ini.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredLedgerStudents.map((student, idx) => (
                                                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                                                        <td className="py-3 pl-4 pr-1 text-center text-xs font-semibold text-slate-400">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <div className="font-semibold text-slate-900 leading-snug text-xs sm:text-sm">
                                                                {student.name}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 mt-0.5">
                                                                <span>{student.nig}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-2.5 text-center">
                                                            {student.avg > 0 ? (
                                                                <div className="inline-flex items-center gap-1.5">
                                                                    <span className="font-bold text-blue-600 text-xs sm:text-sm">
                                                                        {student.avg.toFixed(1)}
                                                                    </span>
                                                                    <span
                                                                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${getPredikatBadge(
                                                                            student.predikat
                                                                        )}`}
                                                                    >
                                                                        {student.predikat}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-slate-300">-</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <div className="w-full max-w-[140px] mx-auto space-y-1">
                                                                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                                                                    <span>{student.filled_count}/{student.total_count} Mapel</span>
                                                                    <span>{Math.round((student.filled_count / Math.max(student.total_count, 1)) * 100)}%</span>
                                                                </div>
                                                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all duration-300 ${student.is_complete ? 'bg-emerald-500' : 'bg-blue-500'
                                                                            }`}
                                                                        style={{ width: `${(student.filled_count / Math.max(student.total_count, 1)) * 100}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-2.5 text-center">
                                                            {student.is_complete ? (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                                    <span>Lengkap</span>
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                                    Belum Lengkap
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 pr-4 pl-2 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPelengkapStudent(student)}
                                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs transition cursor-pointer shadow-2xs active:scale-[0.98]"
                                                                    title="Input Nilai Sikap, Ekskul, Absensi & Catatan Wali"
                                                                >
                                                                    <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                                                                    <span>Pelengkap</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedRapor(student)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs active:scale-[0.98]"
                                                                >
                                                                    <Printer className="w-3.5 h-3.5" />
                                                                    <span>Cetak Rapor</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer Rapor Tab */}
                                <div className="px-5 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <span>
                                            Menampilkan <strong className="text-slate-700">{filteredLedgerStudents.length}</strong> santri di {selectedKelas}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowLedger(true)}
                                            className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                                        >
                                            <FileSpreadsheet className="w-3.5 h-3.5" />
                                            <span>Buka Lembar Rekap Ledger Kelas</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Tab Nilai Header Toolbar */}
                                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <div className="flex items-center gap-2 mr-1">
                                            <BookOpen className="w-5 h-5 text-blue-600" />
                                            <h2 className="text-base font-extrabold text-slate-900">{selectedMapel}</h2>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                {selectedKelas}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleOpenKdModal}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold text-xs shadow-2xs transition active:scale-[0.98] cursor-pointer"
                                        >
                                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Kompetensi Dasar (KD)</span>
                                            {subjectKds && subjectKds.length > 0 && (
                                                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
                                                    {subjectKds.length} KD
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsMapelModalOpen(true)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-semibold text-xs shadow-2xs transition active:scale-[0.98] cursor-pointer"
                                        >
                                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                            <span>Kelola Mapel</span>
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="relative min-w-[200px] sm:min-w-[240px]">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                <Search className="w-3.5 h-3.5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleFilterChange({ search: searchQuery });
                                                    }
                                                }}
                                                placeholder="Cari santri..."
                                                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        handleFilterChange({ search: '' });
                                                    }}
                                                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {isEditMode ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditMode(false)}
                                                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={handleSaveBatch}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
                                                >
                                                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua'}</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={startEditMode}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition active:scale-[0.98] cursor-pointer"
                                            >
                                                <FileSpreadsheet className="w-3.5 h-3.5" />
                                                <span>Input / Edit Nilai</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Status Pengisian & KKM Sub-bar */}
                                <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <div>
                                        Status Pengisian:{' '}
                                        <strong className={gradedCount > 0 ? 'text-emerald-700 font-bold' : 'text-slate-700 font-semibold'}>
                                            {gradedCount} dari {filteredStudents.length} Santri Dinilai
                                        </strong>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                        <span>
                                            Standar KKM: <strong className="font-bold text-slate-800">{kkm.toFixed(1)}</strong>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInputKkm(kkm);
                                                setIsKkmModalOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition cursor-pointer active:scale-95"
                                            title="Ubah Standar KKM untuk semua mata pelajaran"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                            <span>Atur KKM (Semua Pelajaran)</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Banner jika Belum Ada Nilai pada Mata Pelajaran Terpilih */}
                                {gradedCount === 0 && filteredStudents.length > 0 && (
                                    <div className="mx-5 my-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex flex-wrap items-center justify-between gap-2">
                                        <span>
                                            Belum ada nilai yang diinput untuk mata pelajaran <strong>{selectedMapel}</strong> di {selectedKelas} ({selectedTahun}).
                                        </span>
                                        <button
                                            type="button"
                                            onClick={startEditMode}
                                            className="font-bold underline text-amber-900 hover:text-amber-950 cursor-pointer"
                                        >
                                            Input Nilai Sekarang
                                        </button>
                                    </div>
                                )}

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                <th scope="col" className="py-3.5 pl-4 pr-1 w-10 text-center">
                                                    No
                                                </th>
                                                <th scope="col" className="py-3.5 px-3 font-semibold text-slate-600 min-w-[150px]">
                                                    Gelara / Santri
                                                </th>
                                                <th scope="col" className="py-3.5 px-2 text-center w-12">
                                                    H1
                                                </th>
                                                <th scope="col" className="py-3.5 px-2 text-center w-12">
                                                    H2
                                                </th>
                                                <th scope="col" className="py-3.5 px-2 text-center w-12">
                                                    H3
                                                </th>
                                                <th scope="col" className="py-3.5 px-2 text-center w-12">
                                                    H4
                                                </th>
                                                <th scope="col" className="py-3.5 px-2 text-center w-12">
                                                    H5
                                                </th>
                                                <th scope="col" className="py-3.5 px-2 text-center w-12">
                                                    UTS
                                                </th>
                                                <th scope="col" className="py-3.5 px-2 text-center w-12">
                                                    UAS
                                                </th>
                                                <th scope="col" className="py-3.5 px-2.5 text-center w-16">
                                                    Akhir
                                                </th>
                                                <th scope="col" className="py-3.5 px-2.5 text-center w-14">
                                                    Predikat
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-sm">
                                            {filteredStudents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={11} className="py-12 text-center text-slate-400">
                                                        Tidak ada santri yang cocok dari database Data Gelara.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredStudents.map((student, idx) => (
                                                    <tr
                                                        key={student.id}
                                                        className="hover:bg-blue-50/30 transition-colors group"
                                                    >
                                                        {/* No */}
                                                        <td className="py-3 pl-4 pr-1 text-center text-xs font-semibold text-slate-400">
                                                            {idx + 1}
                                                        </td>

                                                        {/* Santri Info */}
                                                        <td className="py-3 px-3">
                                                            <div className="font-semibold text-slate-900 leading-snug text-xs sm:text-sm">
                                                                {student.name}
                                                            </div>
                                                            <div className="text-[11px] text-slate-500 mt-0.5">
                                                                <span>{student.nig}</span>
                                                            </div>
                                                        </td>

                                                        {(() => {
                                                            const cur = isEditMode && rowScores[student.id] ? rowScores[student.id] : student;
                                                            const toNum = (v: any) => (parseFloat(v) || 0);
                                                            const harianFilled = [cur.h1, cur.h2, cur.h3, cur.h4, cur.h5]
                                                                .map(toNum)
                                                                .filter((v) => v > 0);
                                                            const rH = harianFilled.length > 0
                                                                ? harianFilled.reduce((a, b) => a + b, 0) / harianFilled.length
                                                                : 0;
                                                            const nA = Math.round(((rH * 0.6) + (toNum(cur.uts) * 0.2) + (toNum(cur.uas) * 0.2)) * 10) / 10;
                                                            const pred = nA >= 85 ? 'A' : nA >= 75 ? 'B' : nA >= 65 ? 'C' : 'D';

                                                            return (
                                                                <>
                                                                    {(['h1', 'h2', 'h3', 'h4', 'h5', 'uts', 'uas'] as const).map((field) => (
                                                                        <td key={field} className="py-2.5 px-1 text-center">
                                                                            {isEditMode ? (
                                                                                <input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    max="100"
                                                                                    step="0.1"
                                                                                    placeholder="0"
                                                                                    value={rowScores[student.id]?.[field] ?? ''}
                                                                                    onFocus={(e) => e.target.select()}
                                                                                    onChange={(e) => {
                                                                                        const raw = e.target.value;
                                                                                        setRowScores((prev) => ({
                                                                                            ...prev,
                                                                                            [student.id]: {
                                                                                                ...prev[student.id],
                                                                                                [field]: raw === '' ? '' : Math.min(100, Math.max(0, parseFloat(raw) || 0)),
                                                                                            },
                                                                                        }));
                                                                                    }}
                                                                                    className="w-12 text-center py-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-300"
                                                                                />
                                                                            ) : (
                                                                                <span className="text-xs font-medium text-slate-700">
                                                                                    {student[field] > 0 ? student[field] : <span className="text-slate-300">-</span>}
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    ))}

                                                                    {/* Nilai Akhir */}
                                                                    <td className="py-3 px-2.5 text-center">
                                                                        <span className="text-xs font-bold text-blue-600">
                                                                            {nA > 0 ? nA.toFixed(1) : '-'}
                                                                        </span>
                                                                    </td>

                                                                    {/* Predikat */}
                                                                    <td className="py-3 px-2.5 text-center">
                                                                        <span
                                                                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${getPredikatBadge(
                                                                                pred
                                                                            )}`}
                                                                        >
                                                                            {nA > 0 ? pred : '-'}
                                                                        </span>
                                                                    </td>
                                                                </>
                                                            );
                                                        })()}

                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer & Pagination */}
                                <div className="px-5 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <span>
                                            Menampilkan <strong className="text-slate-700">1 - {filteredStudents.length}</strong> dari{' '}
                                            <strong className="text-slate-700">{totalStudents}</strong> Gelara terdaftar
                                        </span>
                                        <span>•</span>
                                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Tersinkronisasi dengan Database Gelara
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            aria-label="Halaman Sebelumnya"
                                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        {[1, 2, 3].map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${currentPage === page
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
                                            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                                            aria-label="Halaman Selanjutnya"
                                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Distribusi Mutu Card / Rekap Rapor Card */}
                    <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-4">
                        {activeTab === 'rapor' ? (
                            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
                                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                                    Rekap Rapor & Ledger
                                </h2>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Ringkasan kelengkapan nilai akademik dan kesiapan dokumen evaluasi santri untuk <strong>{selectedKelas}</strong> ({selectedTahun}).
                                </p>

                                <div className="space-y-2.5 pt-1">
                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-600">Total Santri di Kelas</span>
                                        <span className="text-sm font-bold text-slate-900">{classLedger.students.length} Santri</span>
                                    </div>
                                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
                                        <span className="text-xs font-semibold text-emerald-800">Nilai Lengkap (Siap Cetak)</span>
                                        <span className="text-sm font-bold text-emerald-800">{completeCount} Santri</span>
                                    </div>
                                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex items-center justify-between">
                                        <span className="text-xs font-semibold text-amber-800">Belum Lengkap</span>
                                        <span className="text-sm font-bold text-amber-800">{incompleteCount} Santri</span>
                                    </div>
                                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
                                        <span className="text-xs font-semibold text-blue-800">Rerata Nilai Kelas</span>
                                        <span className="text-sm font-bold text-blue-900">{classOverallAvg > 0 ? classOverallAvg.toFixed(1) : '-'}</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowLedger(true)}
                                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                                    <span>Buka Ledger Rekapitulasi</span>
                                </button>

                                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-600 space-y-1.5">
                                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                        <Printer className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Petunjuk Cetak Dokumen:</span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 pl-0.5">
                                        <li>Cetak Rapor diformat otomatis untuk kertas <strong>A4 Portrait</strong>.</li>
                                        <li>Cetak Ledger diformat otomatis untuk kertas <strong>A4 Landscape</strong>.</li>
                                        <li>Gunakan opsi <em>Save as PDF</em> pada browser untuk mengunduh dokumen digital.</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
                                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                                    Distribusi Mutu
                                </h2>

                                {/* Mini Bar Chart (Pure CSS) */}
                                <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4">
                                    <div className="h-28 flex items-end justify-between gap-3 px-2 pt-4 border-b border-slate-200">
                                        {distribution.map((item) => {
                                            const heightPercent =
                                                item.count > 0
                                                    ? Math.max(16, Math.round((item.count / maxBarCount) * 100))
                                                    : 6;

                                            return (
                                                <div
                                                    key={item.grade}
                                                    className="flex-1 flex flex-col items-center justify-end h-full group"
                                                >
                                                    <span className="text-[11px] font-bold text-slate-600 mb-1">
                                                        {item.count}
                                                    </span>
                                                    <div
                                                        style={{ height: `${heightPercent}%` }}
                                                        className={`w-full max-w-[36px] ${item.barColor} rounded-t-md transition-all duration-300 group-hover:brightness-95`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* X-Axis Labels */}
                                    <div className="flex justify-between gap-3 px-2 pt-2 text-[11px] font-bold text-slate-500">
                                        {distribution.map((item) => (
                                            <div key={item.grade} className="flex-1 text-center">
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
                                                    className="w-2.5 h-2.5 rounded-full inline-block"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="font-semibold text-slate-700">
                                                    Predikat {item.grade} ({item.range})
                                                </span>
                                            </div>
                                            <div className="text-slate-600 font-medium">
                                                <span className="font-bold text-slate-800">{item.count} Gelara</span>{' '}
                                                <span className="text-slate-400">({item.percentage.toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Standar Kelulusan Callout Box */}
                                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-900 leading-relaxed">
                                    <p>
                                        <strong className="font-bold text-blue-950">Standar Kelulusan:</strong>{' '}
                                        KKM minimal mata pelajaran adalah{' '}
                                        <strong className="text-blue-950 font-semibold">{kkm.toFixed(2)}</strong>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>



                {/* 6. Modal: Form Kompetensi Dasar (KD) Per Mata Pelajaran */}
                {isKdModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                                            Kompetensi Dasar (KD)
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {selectedMapel} ({selectedKelas})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsKdModalOpen(false)}
                                    aria-label="Tutup form KD"
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Context Badge */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-slate-600">
                                <span className="font-semibold text-slate-800">{selectedMapel}</span>
                                <span className="text-slate-400">•</span>
                                <span>{selectedKelas}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">{selectedTahun}</span>
                            </div>

                            {/* Info */}
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Masukkan daftar Kompetensi Dasar (KD) untuk mata pelajaran ini (bisa memasukkan hingga 5 KD). Pengaturan ini otomatis berlaku untuk seluruh santri di kelas {selectedKelas}.
                            </p>

                            {/* List KD Inputs */}
                            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                                {kdList.map((kd, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-12 text-center py-2 px-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 shrink-0">
                                            KD {index + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={kd}
                                            onChange={(e) => handleKdChange(index, e.target.value)}
                                            placeholder={`Contoh: Memahami materi KD ${index + 1}...`}
                                            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-slate-300"
                                        />
                                        {kdList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveKd(index)}
                                                title="Hapus KD ini"
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                                    className="w-full py-2 border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 rounded-xl text-xs font-semibold text-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Kompetensi Dasar ({5 - kdList.length} tersisa)</span>
                                </button>
                            )}

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsKdModalOpen(false)}
                                    disabled={isSavingKd}
                                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveKd}
                                    disabled={isSavingKd}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition cursor-pointer disabled:opacity-50"
                                >
                                    {isSavingKd && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{isSavingKd ? 'Menyimpan...' : 'Simpan KD'}</span>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Atur Standar KKM Universal</h3>
                                    <p className="text-xs text-slate-500">
                                        Berlaku untuk <strong className="text-blue-900 font-semibold">semua mata pelajaran &amp; kelas</strong>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsKkmModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
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
                                    onChange={(e) => setInputKkm(parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center"
                                />
                                <p className="text-[11px] text-slate-400">
                                    Santri dengan nilai akhir &ge; nilai ini akan dianggap tuntas KKM.
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsKkmModalOpen(false)}
                                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={isSavingKkm}
                                    onClick={handleSaveKkm}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                                >
                                    {isSavingKkm && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
