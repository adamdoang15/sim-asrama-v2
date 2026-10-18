import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    RotateCcw,
    Save,
    Search,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

export type StatusPresensi = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface PetugasData {
    id: number;
    name: string;
    jabatan?: string;
    lembaga?: string;
}

export interface PresensiRecord {
    petugas_id: number;
    nama: string;
    jabatan: string;
    status: StatusPresensi;
    jam_masuk: string;
    keterangan: string;
}

interface Props {
    petugasList?: PetugasData[];
}

const DEFAULT_FALLBACK_PETUGAS: PetugasData[] = [
    { id: 1, name: 'Ust. Ahmad Fauzan, S.Pd.I', jabatan: 'Kepala Asrama' },
    { id: 2, name: 'Ust. M. Ridwan Ramdani', jabatan: 'Pembina Kedisiplinan' },
    { id: 3, name: 'Usth. Siti Maryam, S.Pd', jabatan: 'Pengasuh Putri' },
    {
        id: 4,
        name: 'Bpk. Hendra Gunawan',
        jabatan: 'Petugas Keamanan (Satpam)',
    },
    { id: 5, name: 'Ibu Eni Rohaeni', jabatan: 'Pengelola Dapur & Gizi' },
    {
        id: 6,
        name: 'Bpk. Deden Supriatna',
        jabatan: 'Petugas Sarana & Kebersihan',
    },
];

export default function AbsensiPetugas({ petugasList = [] }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [notification, setNotification] = useState<string | null>(null);

    // Initial base staff list: from props or fallback if database is empty
    const activePetugas: PetugasData[] = useMemo(() => {
        return petugasList && petugasList.length > 0
            ? petugasList
            : DEFAULT_FALLBACK_PETUGAS;
    }, [petugasList]);

    // Attendance records state per staff member
    const [attendanceMap, setAttendanceMap] = useState<
        Record<number, PresensiRecord>
    >(() => {
        const initialMap: Record<number, PresensiRecord> = {};
        activePetugas.forEach((p) => {
            initialMap[p.id] = {
                petugas_id: p.id,
                nama: p.name,
                jabatan: p.jabatan || 'Staf Asrama',
                status: 'Hadir',
                jam_masuk: '07:00',
                keterangan: '',
            };
        });
        return initialMap;
    });

    const triggerNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3500);
    };

    // Filter staff rows
    const filteredPetugas = useMemo(() => {
        if (!searchQuery.trim()) return activePetugas;
        const q = searchQuery.toLowerCase();
        return activePetugas.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.jabatan && p.jabatan.toLowerCase().includes(q)),
        );
    }, [activePetugas, searchQuery]);

    // Real-time calculated attendance counts
    const counts = useMemo(() => {
        let hadir = 0;
        let izin = 0;
        let sakit = 0;
        let alpa = 0;

        Object.values(attendanceMap).forEach((rec) => {
            if (rec.status === 'Hadir') hadir++;
            else if (rec.status === 'Izin') izin++;
            else if (rec.status === 'Sakit') sakit++;
            else if (rec.status === 'Alpa') alpa++;
        });

        return { hadir, izin, sakit, alpa, total: activePetugas.length };
    }, [attendanceMap, activePetugas]);

    const handleStatusChange = (petugasId: number, status: StatusPresensi) => {
        setAttendanceMap((prev) => ({
            ...prev,
            [petugasId]: {
                ...prev[petugasId],
                status,
                jam_masuk:
                    status === 'Hadir'
                        ? prev[petugasId]?.jam_masuk || '07:00'
                        : '-',
            },
        }));
    };

    const handleKeteranganChange = (petugasId: number, val: string) => {
        setAttendanceMap((prev) => ({
            ...prev,
            [petugasId]: {
                ...prev[petugasId],
                keterangan: val,
            },
        }));
    };

    const handleMarkAllPresent = () => {
        setAttendanceMap((prev) => {
            const updated = { ...prev };
            activePetugas.forEach((p) => {
                updated[p.id] = {
                    ...updated[p.id],
                    status: 'Hadir',
                    jam_masuk: '07:00',
                };
            });
            return updated;
        });
        triggerNotification('Seluruh petugas telah ditandai Hadir.');
    };

    const handleSavePresensi = () => {
        triggerNotification(
            `Data presensi tanggal ${selectedDate} berhasil disimpan.`,
        );
    };

    return (
        <DashboardLayout title="Modul Administrasi">
            <Head title="Absensi Petugas - Administrasi" />

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
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight">
                                    Presensi Petugas Asrama
                                </h1>
                                <p className="text-xs text-slate-300">
                                    Pencatatan daftar hadir harian pengasuh,
                                    pembina santri, dan petugas operasional
                                    asrama.
                                </p>
                            </div>
                        </div>

                        {/* Date and Bulk Action Controls */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white">
                                <Calendar className="h-3.5 w-3.5 text-blue-200" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                    className="cursor-pointer bg-transparent text-xs font-semibold text-white focus:outline-hidden"
                                />
                            </div>

                            <button
                                onClick={handleMarkAllPresent}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <Check className="h-4 w-4" />
                                <span>Tandai Semua Hadir</span>
                            </button>

                            <button
                                onClick={handleSavePresensi}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-emerald-500 active:scale-[0.98]"
                            >
                                <Save className="h-4 w-4" />
                                <span>Simpan Presensi</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <span className="text-xs font-semibold text-gray-500">
                            Total Petugas
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-gray-900 tabular-nums">
                                {counts.total}
                            </span>
                            <span className="text-[11px] text-gray-400">
                                orang
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-emerald-800">
                            Hadir
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                                {counts.hadir}
                            </span>
                            <span className="text-[11px] text-emerald-600">
                                petugas
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-blue-800">
                            Izin / Sakit
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-blue-700 tabular-nums">
                                {counts.izin + counts.sakit}
                            </span>
                            <span className="text-[11px] text-blue-600">
                                petugas
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 shadow-xs">
                        <span className="text-xs font-semibold text-rose-800">
                            Alpa / Tanpa Keterangan
                        </span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-rose-700 tabular-nums">
                                {counts.alpa}
                            </span>
                            <span className="text-[11px] text-rose-600">
                                petugas
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama petugas atau jabatan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-8 pl-9 text-xs text-gray-800 placeholder-gray-400 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                <tr>
                                    <th className="w-12 px-4 py-3.5 text-center">
                                        No
                                    </th>
                                    <th className="w-64 px-4 py-3.5">
                                        Nama Petugas
                                    </th>
                                    <th className="w-48 px-4 py-3.5">
                                        Jabatan / Tugas
                                    </th>
                                    <th className="w-72 px-4 py-3.5 text-center">
                                        Status Kehadiran
                                    </th>
                                    <th className="px-4 py-3.5">
                                        Keterangan / Catatan
                                    </th>
                                    <th className="w-28 px-4 py-3.5 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPetugas.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-12 text-center text-gray-400"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Users className="h-8 w-8 text-gray-300" />
                                                <p className="text-xs font-semibold text-gray-600">
                                                    Tidak ada nama petugas yang
                                                    cocok
                                                </p>
                                                {searchQuery && (
                                                    <button
                                                        onClick={() =>
                                                            setSearchQuery('')
                                                        }
                                                        className="mt-1 text-[11px] text-blue-600 hover:underline"
                                                    >
                                                        Bersihkan Pencarian
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPetugas.map((petugas, idx) => {
                                        const record = attendanceMap[
                                            petugas.id
                                        ] || {
                                            petugas_id: petugas.id,
                                            nama: petugas.name,
                                            jabatan:
                                                petugas.jabatan ||
                                                'Staf Asrama',
                                            status: 'Hadir' as StatusPresensi,
                                            jam_masuk: '07:00',
                                            keterangan: '',
                                        };

                                        return (
                                            <tr
                                                key={petugas.id}
                                                className="transition hover:bg-gray-50/60"
                                            >
                                                <td className="px-4 py-3.5 text-center font-medium text-gray-400">
                                                    {idx + 1}
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                            {petugas.name.charAt(
                                                                0,
                                                            )}
                                                        </div>
                                                        <span className="block truncate font-semibold text-gray-900">
                                                            {petugas.name}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3.5">
                                                    <span className="block truncate font-medium text-gray-700">
                                                        {petugas.jabatan ||
                                                            'Staf Operasional'}
                                                    </span>
                                                </td>

                                                {/* Status Selector Pills */}
                                                <td className="px-4 py-3.5 text-center">
                                                    <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1">
                                                        {(
                                                            [
                                                                'Hadir',
                                                                'Izin',
                                                                'Sakit',
                                                                'Alpa',
                                                            ] as StatusPresensi[]
                                                        ).map((st) => {
                                                            const isSelected =
                                                                record.status ===
                                                                st;
                                                            let activeClass =
                                                                '';
                                                            if (isSelected) {
                                                                if (
                                                                    st ===
                                                                    'Hadir'
                                                                )
                                                                    activeClass =
                                                                        'bg-emerald-600 text-white shadow-xs';
                                                                else if (
                                                                    st ===
                                                                    'Izin'
                                                                )
                                                                    activeClass =
                                                                        'bg-blue-600 text-white shadow-xs';
                                                                else if (
                                                                    st ===
                                                                    'Sakit'
                                                                )
                                                                    activeClass =
                                                                        'bg-amber-600 text-white shadow-xs';
                                                                else if (
                                                                    st ===
                                                                    'Alpa'
                                                                )
                                                                    activeClass =
                                                                        'bg-rose-600 text-white shadow-xs';
                                                            } else {
                                                                activeClass =
                                                                    'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60';
                                                            }

                                                            return (
                                                                <button
                                                                    key={st}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            petugas.id,
                                                                            st,
                                                                        )
                                                                    }
                                                                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition active:scale-[0.96] ${activeClass}`}
                                                                >
                                                                    {st}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </td>

                                                {/* Notes / Reason input */}
                                                <td className="px-4 py-3.5">
                                                    <input
                                                        type="text"
                                                        placeholder={
                                                            record.status ===
                                                            'Hadir'
                                                                ? 'Jam kedatangan / catatan tugas...'
                                                                : 'Alasan tidak hadir / izin...'
                                                        }
                                                        value={
                                                            record.keterangan ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handleKeteranganChange(
                                                                petugas.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                                                    />
                                                </td>

                                                {/* Action */}
                                                <td className="px-4 py-3.5 text-center">
                                                    <button
                                                        onClick={() =>
                                                            triggerNotification(
                                                                `Presensi ${petugas.name} disimpan.`,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-xs hover:bg-gray-50 active:scale-[0.98]"
                                                        title="Simpan baris"
                                                    >
                                                        <Save className="h-3 w-3 text-gray-500" />
                                                        <span>Simpan</span>
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
            </div>
        </DashboardLayout>
    );
}
