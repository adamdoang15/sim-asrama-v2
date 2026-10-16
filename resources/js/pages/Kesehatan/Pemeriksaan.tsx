import DashboardLayout from '@/layouts/DashboardLayout';
import { router } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    Calendar,
    CheckCircle2,
    ChevronDown,
    HeartPulse,
    Info,
    Scale,
    Search,
    Stethoscope,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface StudentHealth {
    id: number;
    name: string;
    nig: string;
    kelas: string;
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
    } | null;
}

interface Props {
    students: StudentHealth[];
    filters: {
        tahun_akademik: string;
        kelas: string;
        semester: string;
        search?: string;
    };
    options: {
        tahun_akademik: string[];
        kelas: string[];
    };
}

export default function Pemeriksaan({ students, filters, options }: Props) {
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun_akademik);
    const [selectedKelas, setSelectedKelas] = useState(filters.kelas);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [editingStudent, setEditingStudent] = useState<StudentHealth | null>(null);

    // Form modal state
    const [formData, setFormData] = useState({
        berat_badan: '',
        tinggi_badan: '',
        tensi: '110/77',
        tensi_kategori: 'Normal',
        ringan_jumlah: 0,
        ringan_ket: '',
        sedang_jumlah: 0,
        sedang_ket: '',
        berat_jumlah: 0,
        berat_ket: '',
        catatan_kesehatan: '',
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleFilterChange = (newFilters: { tahun_akademik?: string; kelas?: string }) => {
        const tahun = newFilters.tahun_akademik ?? selectedTahun;
        const kelas = newFilters.kelas ?? selectedKelas;

        setSelectedTahun(tahun);
        setSelectedKelas(kelas);

        router.get(
            '/kesehatan/pemeriksaan',
            { tahun_akademik: tahun, kelas },
            { preserveState: true, preserveScroll: true }
        );
    };

    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) {
            return students;
        }
        const q = searchQuery.toLowerCase();
        return students.filter(
            (s) => s.name.toLowerCase().includes(q) || s.nig.toLowerCase().includes(q)
        );
    }, [students, searchQuery]);

    // Live IMT calculation
    const calculatedImt = useMemo(() => {
        const bb = parseFloat(formData.berat_badan);
        const tb = parseFloat(formData.tinggi_badan);
        if (bb > 0 && tb > 0) {
            const tbM = tb / 100;
            const val = bb / (tbM * tbM);
            let kat = 'Ideal';
            if (val < 18.5) {
                kat = 'Kurus';
            } else if (val > 24.9 && val <= 29.9) {
                kat = 'Gemuk';
            } else if (val > 29.9) {
                kat = 'Obesitas';
            }
            return { val: val.toFixed(2), kat };
        }
        return { val: '-', kat: '-' };
    }, [formData.berat_badan, formData.tinggi_badan]);

    const openEditModal = (student: StudentHealth) => {
        setEditingStudent(student);
        const k = student.kesehatan;
        setFormData({
            berat_badan: k?.berat_badan ? String(k.berat_badan) : '',
            tinggi_badan: k?.tinggi_badan ? String(k.tinggi_badan) : '',
            tensi: k?.tensi || '110/77',
            tensi_kategori: k?.tensi_kategori || 'Normal',
            ringan_jumlah: k?.riwayat_sakit?.ringan?.jumlah || 0,
            ringan_ket: k?.riwayat_sakit?.ringan?.keterangan || '',
            sedang_jumlah: k?.riwayat_sakit?.sedang?.jumlah || 0,
            sedang_ket: k?.riwayat_sakit?.sedang?.keterangan || '',
            berat_jumlah: k?.riwayat_sakit?.berat?.jumlah || 0,
            berat_ket: k?.riwayat_sakit?.berat?.keterangan || '',
            catatan_kesehatan:
                k?.catatan_kesehatan ||
                'Berat badan dan tekanan darah sesuai dengan hasil normal, dimohon Bapak/Ibu untuk terus mengingatkan pola hidup sehat.',
        });
    };

    const handleSaveHealth = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) {
            return;
        }

        setIsSaving(true);
        router.post(
            '/kesehatan/pemeriksaan',
            {
                gelara_id: editingStudent.id,
                tahun_akademik: selectedTahun,
                semester: filters.semester,
                berat_badan: formData.berat_badan ? parseFloat(formData.berat_badan) : null,
                tinggi_badan: formData.tinggi_badan ? parseFloat(formData.tinggi_badan) : null,
                tensi: formData.tensi,
                tensi_kategori: formData.tensi_kategori,
                riwayat_sakit: {
                    ringan: {
                        jumlah: Number(formData.ringan_jumlah),
                        keterangan: formData.ringan_ket,
                    },
                    sedang: {
                        jumlah: Number(formData.sedang_jumlah),
                        keterangan: formData.sedang_ket,
                    },
                    berat: {
                        jumlah: Number(formData.berat_jumlah),
                        keterangan: formData.berat_ket,
                    },
                },
                catatan_kesehatan: formData.catatan_kesehatan,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaving(false);
                    setEditingStudent(null);
                },
                onError: () => setIsSaving(false),
            }
        );
    };

    // Stats
    const totalStudents = students.length;
    const examinedCount = students.filter((s) => s.kesehatan !== null).length;
    const idealImtCount = students.filter((s) => s.kesehatan?.imt_kategori === 'Ideal').length;
    const sickRecordCount = students.filter(
        (s) =>
            ((s.kesehatan?.riwayat_sakit?.ringan?.jumlah || 0) +
                (s.kesehatan?.riwayat_sakit?.sedang?.jumlah || 0) +
                (s.kesehatan?.riwayat_sakit?.berat?.jumlah || 0)) > 0
    ).length;

    return (
        <DashboardLayout title="Pemeriksaan Kesehatan Santri">
            <div className="space-y-6 pb-12 font-sans text-slate-800 max-w-7xl mx-auto">
                {/* Header Banner Berwarna */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <HeartPulse className="h-6 w-6 text-rose-300" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Pemeriksaan Kesehatan Santri
                                </h1>
                                <p className="text-xs text-slate-200 sm:text-sm mt-0.5">
                                    Pencatatan antropometri fisik (BB, TB, IMT, Tensi) dan riwayat kesehatan berkala
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Top Filter Bar */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Tahun Akademik & Semester
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <select
                                    value={selectedTahun}
                                    onChange={(e) => handleFilterChange({ tahun_akademik: e.target.value })}
                                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer appearance-none truncate"
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

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                Kelas
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
                                    <Users className="w-4 h-4" />
                                </div>
                                <select
                                    value={selectedKelas}
                                    onChange={(e) => handleFilterChange({ kelas: e.target.value })}
                                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer appearance-none truncate"
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
                    </div>
                </div>

                {/* 3. Summary Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Total Santri
                                </p>
                                <p className="text-xl font-extrabold text-slate-900">{totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Sudah Diperiksa
                                </p>
                                <p className="text-xl font-extrabold text-blue-600">
                                    {examinedCount} <span className="text-xs font-normal text-slate-400">/ {totalStudents}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    IMT Ideal
                                </p>
                                <p className="text-xl font-extrabold text-emerald-600">{idealImtCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Ada Riwayat Sakit
                                </p>
                                <p className="text-xl font-extrabold text-amber-600">{sickRecordCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Table Container */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-900">
                                Daftar Pemeriksaan Fisik & Riwayat Sakit
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                {selectedKelas}
                            </span>
                        </div>

                        <div className="relative min-w-[200px] sm:min-w-[240px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Search className="w-3.5 h-3.5" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari santri atau NIG..."
                                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
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
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 pl-4 pr-1 w-10 text-center">No</th>
                                    <th className="py-3.5 px-3 min-w-[150px]">Santri</th>
                                    <th className="py-3.5 px-3 text-center">Berat Badan</th>
                                    <th className="py-3.5 px-3 text-center">Tinggi Badan</th>
                                    <th className="py-3.5 px-3 text-center">IMT & Kategori</th>
                                    <th className="py-3.5 px-3 text-center">Tekanan Darah</th>
                                    <th className="py-3.5 px-3 text-center">Riwayat Sakit</th>
                                    <th className="py-3.5 pr-4 pl-2 text-center w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            Tidak ada data santri pada kelas ini.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, idx) => {
                                        const k = student.kesehatan;
                                        const totalSakit =
                                            (k?.riwayat_sakit?.ringan?.jumlah || 0) +
                                            (k?.riwayat_sakit?.sedang?.jumlah || 0) +
                                            (k?.riwayat_sakit?.berat?.jumlah || 0);

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3 pl-4 pr-1 text-center font-medium text-slate-400">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <p className="font-semibold text-slate-900">{student.name}</p>
                                                    <p className="text-[11px] font-mono text-slate-400">{student.nig}</p>
                                                </td>
                                                <td className="py-3 px-3 text-center font-medium text-slate-700">
                                                    {k?.berat_badan ? `${k.berat_badan} kg` : '-'}
                                                </td>
                                                <td className="py-3 px-3 text-center font-medium text-slate-700">
                                                    {k?.tinggi_badan ? `${k.tinggi_badan} cm` : '-'}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {k?.imt ? (
                                                        <div className="inline-flex flex-col items-center">
                                                            <span className="font-bold text-slate-800">{k.imt} kg/m²</span>
                                                            <span
                                                                className={`px-2 py-0.2 rounded-full text-[10px] font-semibold mt-0.5 ${
                                                                    k.imt_kategori === 'Ideal'
                                                                        ? 'bg-emerald-100 text-emerald-800'
                                                                        : k.imt_kategori === 'Kurus'
                                                                        ? 'bg-amber-100 text-amber-800'
                                                                        : 'bg-rose-100 text-rose-800'
                                                                }`}
                                                            >
                                                                {k.imt_kategori}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {k?.tensi ? (
                                                        <div className="inline-flex flex-col items-center">
                                                            <span className="font-medium text-slate-800">{k.tensi}</span>
                                                            <span className="text-[10px] text-slate-400">
                                                                {k.tensi_kategori || 'Normal'}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {totalSakit > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                                            {totalSakit} Kejadian
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                            Sehat (0)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 pl-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(student)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition active:scale-[0.98] cursor-pointer"
                                                    >
                                                        <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
                                                        <span>{k ? 'Edit' : 'Input'}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. Modal Input / Edit Kesehatan */}
                {editingStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                            {/* Header Modal */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                                        <HeartPulse className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                                            Data Pemeriksaan Kesehatan & Riwayat Sakit
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {editingStudent.name} &bull; {editingStudent.nig} ({selectedKelas})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingStudent(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveHealth} className="space-y-5">
                                {/* Bagian 1: Pengukuran Fisik */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                                        <Scale className="w-4 h-4 text-blue-600" />
                                        <span>1. Pengukuran Antropometri & Tensi</span>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Berat Badan (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={formData.berat_badan}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, berat_badan: e.target.value })
                                                }
                                                placeholder="Contoh: 49.3"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Tinggi Badan (cm)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={formData.tinggi_badan}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, tinggi_badan: e.target.value })
                                                }
                                                placeholder="Contoh: 153"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Indeks Massa Tubuh (IMT)
                                            </label>
                                            <div className="px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800 flex items-center justify-between">
                                                <span>{calculatedImt.val} kg/m²</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                                                    {calculatedImt.kat} (Standar 18,5 - 24,9)
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                Tekanan Darah / Tensi (mmHg)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.tensi}
                                                onChange={(e) => setFormData({ ...formData, tensi: e.target.value })}
                                                placeholder="Contoh: 110/77 mmHg"
                                                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian 2: Riwayat Sakit */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                                        <Activity className="w-4 h-4 text-amber-500" />
                                        <span>2. Data Riwayat Sakit Semester Ini</span>
                                    </h4>
                                    <div className="space-y-3">
                                        {/* Sakit Ringan */}
                                        <div className="grid grid-cols-12 gap-2.5 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="col-span-3 sm:col-span-2">
                                                <span className="text-xs font-bold text-slate-800">Ringan</span>
                                            </div>
                                            <div className="col-span-3 sm:col-span-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.ringan_jumlah}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            ringan_jumlah: parseInt(e.target.value) || 0,
                                                        })
                                                    }
                                                    placeholder="Jml"
                                                    className="w-full px-2 py-1.5 text-xs text-center bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-8">
                                                <input
                                                    type="text"
                                                    value={formData.ringan_ket}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, ringan_ket: e.target.value })
                                                    }
                                                    placeholder="Contoh: Sakit gigi bolong, flu ringan..."
                                                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Sakit Sedang */}
                                        <div className="grid grid-cols-12 gap-2.5 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="col-span-3 sm:col-span-2">
                                                <span className="text-xs font-bold text-slate-800">Sedang</span>
                                            </div>
                                            <div className="col-span-3 sm:col-span-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.sedang_jumlah}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            sedang_jumlah: parseInt(e.target.value) || 0,
                                                        })
                                                    }
                                                    placeholder="Jml"
                                                    className="w-full px-2 py-1.5 text-xs text-center bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-8">
                                                <input
                                                    type="text"
                                                    value={formData.sedang_ket}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, sedang_ket: e.target.value })
                                                    }
                                                    placeholder="Contoh: Demam tifoid, kotoran telinga kering..."
                                                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Sakit Berat */}
                                        <div className="grid grid-cols-12 gap-2.5 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="col-span-3 sm:col-span-2">
                                                <span className="text-xs font-bold text-slate-800">Berat</span>
                                            </div>
                                            <div className="col-span-3 sm:col-span-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.berat_jumlah}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            berat_jumlah: parseInt(e.target.value) || 0,
                                                        })
                                                    }
                                                    placeholder="Jml"
                                                    className="w-full px-2 py-1.5 text-xs text-center bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-8">
                                                <input
                                                    type="text"
                                                    value={formData.berat_ket}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, berat_ket: e.target.value })
                                                    }
                                                    placeholder="Contoh: Dirawat inap, operasi..."
                                                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian 3: Catatan Kesehatan */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                                        <Info className="w-4 h-4 text-blue-600" />
                                        <span>3. Catatan / Rekomendasi Kesehatan untuk Orang Tua</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.catatan_kesehatan}
                                        onChange={(e) =>
                                            setFormData({ ...formData, catatan_kesehatan: e.target.value })
                                        }
                                        placeholder="Tuliskan catatan rekomendasi kesehatan santri..."
                                        className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition leading-relaxed"
                                    />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingStudent(null)}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition cursor-pointer active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isSaving ? 'Menyimpan...' : 'Simpan Data Kesehatan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
