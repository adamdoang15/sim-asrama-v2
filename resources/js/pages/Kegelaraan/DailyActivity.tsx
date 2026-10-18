import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    CheckCheck,
    Download,
    Save,
    Calendar,
    Clock,
    GraduationCap,
    Search,
    Send,
    Info,
    X,
} from 'lucide-react';

export default function DailyActivity({
    gelaras = [],
    activitiesData = {},
    rekapData = {},
    trendData = [],
    weekLabel = 'minggu 5 (28 sep - 30 sep 2026)',
    monthLabel = 'september 2026',
    date,
    selectedMonth,
    selectedWeek,
    availableWeeks = [],
    initialTab = 'Lembar Kerja Presensi',
}: any) {
    const handleUpdate = (studentId: number, status: string, note: string) => {
        const existing = activitiesData[studentId]?.activities || {};
        const isOldArray = Array.isArray(existing);
        let newActivities: any = isOldArray ? {} : { ...existing };

        newActivities[selectedActivity] = { status, note };

        router.post(
            '/kegelaraan/daily-activity',
            {
                gelara_id: studentId,
                date: selectedDate,
                activities: newActivities,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const handleMarkAllPresent = () => {
        const bulkData = gelaras.map((g: any) => {
            const existing = activitiesData[g.id]?.activities || {};
            const isOldArray = Array.isArray(existing);
            let newActivities: any = isOldArray ? {} : { ...existing };
            newActivities[selectedActivity] = { status: 'H', note: '' };
            return { gelara_id: g.id, activities: newActivities };
        });

        router.post(
            '/kegelaraan/daily-activity',
            {
                date: selectedDate,
                bulk_data: bulkData,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const [activeTab, setActiveTab] = useState(
        initialTab || 'Lembar Kerja Presensi',
    );
    const tabs = ['Lembar Kerja Presensi', 'Rekap Akumulasi', 'Tren'];

    const [selectedDate, setSelectedDate] = useState(
        date || new Date().toISOString().split('T')[0],
    );
    const [selectedActivity, setSelectedActivity] = useState('Bangun tidur');
    const [rekapSearch, setRekapSearch] = useState('');
    const [lembarSearch, setLembarSearch] = useState('');
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [detailStudentRekap, setDetailStudentRekap] = useState<any>(null);

    const calcPct = (count: number, total: number) => {
        if (!total || total === 0) return '0%';
        const val = (count / total) * 100;
        return `${Number.isInteger(val) ? val : val.toFixed(1)}%`;
    };

    const modalStats = detailStudentRekap?.stats || {};
    const totalModalW =
        (modalStats.hadir_minggu || 0) +
        (modalStats.izin_minggu || 0) +
        (modalStats.sakit_minggu || 0) +
        (modalStats.a_minggu || 0);
    const totalModalM =
        (modalStats.hadir_bulan || 0) +
        (modalStats.izin_bulan || 0) +
        (modalStats.sakit_bulan || 0) +
        (modalStats.a_bulan || 0);

    const [rekapMonth, setRekapMonth] = useState(
        selectedMonth ||
            (date
                ? date.substring(0, 7)
                : new Date().toISOString().slice(0, 7)),
    );
    const [rekapWeek, setRekapWeek] = useState(selectedWeek || 1);
    const [trendGranularity, setTrendGranularity] = useState<
        'Harian' | 'Mingguan' | 'Bulanan'
    >('Harian');
    const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(
        null,
    );

    useEffect(() => {
        if (selectedMonth) setRekapMonth(selectedMonth);
    }, [selectedMonth]);

    useEffect(() => {
        if (selectedWeek) setRekapWeek(selectedWeek);
    }, [selectedWeek]);

    const handleMonthChange = (newMonth: string) => {
        setRekapMonth(newMonth);
        setRekapWeek(1);
        router.get(
            '/kegelaraan/daily-activity',
            {
                tab: 'Rekap Akumulasi',
                month: newMonth,
                week: 1,
                date: selectedDate,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleWeekChange = (newWeek: number) => {
        setRekapWeek(newWeek);
        router.get(
            '/kegelaraan/daily-activity',
            {
                tab: 'Rekap Akumulasi',
                month: rekapMonth,
                week: newWeek,
                date: selectedDate,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const activities = [
        'Bangun tidur',
        'Mandi pagi',
        'Sholat subuh',
        'TC',
        'Piket',
        'Berangkat sekolah',
        'Sholat dzuhur',
        'Sholat ashar',
        'Sholat maghrib',
        'Sholat isya',
        'KBM',
        'Apel malam',
        'Pengumpulan hp',
        'Mandi sore',
        'Pulang sekolah',
        'Olahraga',
        'Nonton bareng',
        'Zoom viconnas',
        'Pengajian',
        'Koordinasi bulanan',
        'Opsih',
    ];

    const dateObj = new Date(selectedDate);
    const month = dateObj.getMonth();
    const isGanjil = month >= 6;
    const yearStart = isGanjil
        ? dateObj.getFullYear()
        : dateObj.getFullYear() - 1;
    const semesterText = `T.A. ${yearStart}/${yearStart + 1} (Semester ${isGanjil ? 'Ganjil' : 'Genap'})`;

    const totalGelara = gelaras.length;
    let totalH = 0,
        totalS = 0,
        totalI = 0,
        totalA = 0;
    gelaras.forEach((g: any) => {
        const act = activitiesData[g.id]?.activities || {};
        const st = Array.isArray(act)
            ? act.includes(selectedActivity)
                ? 'H'
                : '-'
            : act[selectedActivity]?.status || '-';
        if (st === 'H') totalH++;
        if (st === 'S') totalS++;
        if (st === 'I') totalI++;
        if (st === 'A') totalA++;
    });
    const pct =
        totalGelara > 0
            ? (
                  ((totalH + totalS + totalI + totalA) / totalGelara) *
                  100
              ).toFixed(1)
            : '0.0';

    return (
        <DashboardLayout title="Daily Activity">
            <div className="pb-10 font-sans text-slate-800">
                {/* Header Banner Berwarna */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Daily Activity Gelara
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Lembar presensi, monitoring aktivitas harian
                                    santri, dan rekapitulasi mentor
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {monthLabel && (
                                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                                    <Calendar className="h-4 w-4 text-blue-200" />
                                    <span className="capitalize">
                                        {monthLabel}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs & Search */}
                <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row">
                    <div className="flex flex-wrap gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                                    activeTab === tab
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    {activeTab === 'Lembar Kerja Presensi' && (
                        <div className="relative w-full md:w-64">
                            <Search
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                size={15}
                            />
                            <input
                                type="text"
                                placeholder="Cari nama gelara..."
                                value={lembarSearch}
                                onChange={(e) =>
                                    setLembarSearch(e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-7 pl-9 text-xs font-medium text-slate-700 placeholder-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                            {lembarSearch && (
                                <button
                                    type="button"
                                    onClick={() => setLembarSearch('')}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Filters & Stats (Hanya ditampilkan pada Lembar Kerja Presensi) */}
                {activeTab === 'Lembar Kerja Presensi' && (
                    <>
                        {/* Filters */}
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                                    <GraduationCap size={20} />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Tahun Akademik
                                    </label>
                                    <select
                                        value={semesterText}
                                        disabled
                                        className="w-full cursor-pointer appearance-none bg-transparent text-sm font-bold text-slate-800 outline-none"
                                    >
                                        <option value={semesterText}>
                                            {semesterText}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="rounded-lg bg-slate-50 p-2 text-blue-500">
                                    <Clock size={20} />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Kegiatan
                                    </label>
                                    <select
                                        value={selectedActivity}
                                        onChange={(e) =>
                                            setSelectedActivity(e.target.value)
                                        }
                                        className="w-full cursor-pointer bg-transparent text-sm font-bold text-slate-800 outline-none"
                                    >
                                        {activities.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="rounded-lg bg-slate-50 p-2 text-blue-500">
                                    <Calendar size={20} />
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Tanggal Lembar Kerja
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value);
                                            router.get(
                                                '/kegelaraan/daily-activity',
                                                {
                                                    date: e.target.value,
                                                    tab: 'Lembar Kerja Presensi',
                                                },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                        className="w-full cursor-pointer bg-transparent text-sm font-bold text-slate-800 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-6">
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        Total Gelara
                                    </span>
                                </div>
                                <div className="text-3xl font-extrabold text-slate-800">
                                    {totalGelara}{' '}
                                    <span className="text-sm font-medium text-slate-500">
                                        Gelara
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2 flex flex-col justify-between rounded-xl border border-b-4 border-slate-200 border-b-emerald-500 bg-white p-4 shadow-sm md:col-span-1">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                                        Hadir
                                    </span>
                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-xs font-bold text-emerald-600">
                                        H
                                    </span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="text-3xl font-extrabold text-emerald-600">
                                        {totalH}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                                        Izin (I)
                                    </span>
                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-600">
                                        I
                                    </span>
                                </div>
                                <div className="mb-1 text-3xl font-extrabold text-blue-600">
                                    {totalI}
                                </div>
                            </div>
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-amber-500 uppercase">
                                        Sakit (S)
                                    </span>
                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-100 text-xs font-bold text-amber-600">
                                        S
                                    </span>
                                </div>
                                <div className="text-3xl font-extrabold text-amber-500">
                                    {totalS}
                                </div>
                            </div>
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-red-500 uppercase">
                                        Alfa (A)
                                    </span>
                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-red-100 text-xs font-bold text-red-600">
                                        A
                                    </span>
                                </div>
                                <div className="text-3xl font-extrabold text-red-500">
                                    {totalA}
                                </div>
                            </div>
                            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-blue-50/50 bg-white p-4 shadow-sm">
                                <div className="mb-2 text-[10px] font-bold text-blue-800 uppercase">
                                    Keterlaksanaan
                                </div>
                                <div className="text-4xl font-extrabold tracking-tight text-blue-700">
                                    {pct}%
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex flex-col items-start gap-6 xl:flex-row">
                    {/* Main Table Area */}
                    {activeTab === 'Lembar Kerja Presensi' && (
                        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                            {/* Card Header */}
                            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl border border-blue-100/80 bg-blue-50 p-2 text-blue-600 shadow-2xs">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm leading-tight font-bold text-slate-800 sm:text-base">
                                            Lembar Presensi: {selectedActivity}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-slate-500 capitalize">
                                            {dateObj.toLocaleDateString(
                                                'id-ID',
                                                {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                },
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleMarkAllPresent}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-2xs transition-all hover:bg-emerald-100/80 active:scale-[0.98]"
                                >
                                    <CheckCheck
                                        size={14}
                                        className="text-emerald-600"
                                    />
                                    <span>Tandai Semua Hadir</span>
                                </button>
                            </div>

                            {/* Table */}
                            <div className="custom-scrollbar overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                                        <tr>
                                            <th className="w-12 px-4 py-3.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        gelaras.length > 0 &&
                                                        selectedRowIds.length ===
                                                            gelaras.length
                                                    }
                                                    onChange={() => {
                                                        if (
                                                            selectedRowIds.length ===
                                                            gelaras.length
                                                        ) {
                                                            setSelectedRowIds(
                                                                [],
                                                            );
                                                        } else {
                                                            setSelectedRowIds(
                                                                gelaras.map(
                                                                    (g: any) =>
                                                                        g.id,
                                                                ),
                                                            );
                                                        }
                                                    }}
                                                    className="cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="w-12 px-3 py-3.5 text-center font-medium text-slate-400">
                                                No
                                            </th>
                                            <th className="px-4 py-3.5 text-left">
                                                Nama Gelara & Identitas
                                            </th>
                                            <th className="w-44 px-4 py-3.5 text-center">
                                                Status Presensi
                                            </th>
                                            <th className="px-4 py-3.5 text-left">
                                                Catatan / Keterangan Mentor
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {gelaras
                                            .filter((student: any) =>
                                                (student.name || '')
                                                    .toLowerCase()
                                                    .includes(
                                                        lembarSearch.toLowerCase(),
                                                    ),
                                            )
                                            .map((student: any, i: number) => {
                                                const gelaraData =
                                                    activitiesData[student.id]
                                                        ?.activities || {};
                                                const isOldArray =
                                                    Array.isArray(gelaraData);
                                                const activityInfo = isOldArray
                                                    ? gelaraData.includes(
                                                          selectedActivity,
                                                      )
                                                        ? {
                                                              status: 'H',
                                                              note: '',
                                                          }
                                                        : {
                                                              status: '-',
                                                              note: '',
                                                          }
                                                    : gelaraData[
                                                          selectedActivity
                                                      ] || {
                                                          status: '-',
                                                          note: '',
                                                      };

                                                const isRowSelected =
                                                    selectedRowIds.includes(
                                                        student.id,
                                                    );

                                                return (
                                                    <tr
                                                        key={student.id}
                                                        className="group bg-white transition-colors hover:bg-slate-50/70"
                                                    >
                                                        <td className="px-4 py-3.5 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    isRowSelected
                                                                }
                                                                onChange={() => {
                                                                    if (
                                                                        isRowSelected
                                                                    ) {
                                                                        setSelectedRowIds(
                                                                            selectedRowIds.filter(
                                                                                (
                                                                                    id: number,
                                                                                ) =>
                                                                                    id !==
                                                                                    student.id,
                                                                            ),
                                                                        );
                                                                    } else {
                                                                        setSelectedRowIds(
                                                                            [
                                                                                ...selectedRowIds,
                                                                                student.id,
                                                                            ],
                                                                        );
                                                                    }
                                                                }}
                                                                className="cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3.5 text-center text-xs font-medium text-slate-400">
                                                            {(i + 1)
                                                                .toString()
                                                                .padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-100 bg-blue-50 text-xs font-bold text-blue-600">
                                                                    <span>
                                                                        {(
                                                                            student.name ||
                                                                            'G'
                                                                        )
                                                                            .substring(
                                                                                0,
                                                                                2,
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                    {student.foto && (
                                                                        <img
                                                                            src={`/storage/${student.foto}`}
                                                                            alt=""
                                                                            className="absolute inset-0 h-full w-full object-cover"
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                (
                                                                                    e.target as HTMLElement
                                                                                ).style.display =
                                                                                    'none';
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-semibold text-slate-800">
                                                                        {
                                                                            student.name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="mx-auto flex w-fit items-center justify-center gap-1 rounded-full border border-slate-200/60 bg-slate-100/90 p-1 shadow-2xs">
                                                                {[
                                                                    {
                                                                        key: 'H',
                                                                        label: 'Hadir',
                                                                        bg: 'bg-emerald-500 text-white shadow-2xs',
                                                                    },
                                                                    {
                                                                        key: 'S',
                                                                        label: 'Sakit',
                                                                        bg: 'bg-amber-500 text-white shadow-2xs',
                                                                    },
                                                                    {
                                                                        key: 'I',
                                                                        label: 'Izin',
                                                                        bg: 'bg-blue-500 text-white shadow-2xs',
                                                                    },
                                                                    {
                                                                        key: 'A',
                                                                        label: 'Alfa',
                                                                        bg: 'bg-rose-500 text-white shadow-2xs',
                                                                    },
                                                                ].map((st) => (
                                                                    <button
                                                                        key={
                                                                            st.key
                                                                        }
                                                                        type="button"
                                                                        title={
                                                                            st.label
                                                                        }
                                                                        onClick={() =>
                                                                            handleUpdate(
                                                                                student.id,
                                                                                st.key,
                                                                                activityInfo.note,
                                                                            )
                                                                        }
                                                                        className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                                                                            activityInfo.status ===
                                                                            st.key
                                                                                ? `${st.bg} scale-105`
                                                                                : 'text-slate-400 hover:bg-white/80 hover:text-slate-700'
                                                                        }`}
                                                                    >
                                                                        {st.key}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <input
                                                                type="text"
                                                                defaultValue={
                                                                    activityInfo.note
                                                                }
                                                                onBlur={(e) =>
                                                                    handleUpdate(
                                                                        student.id,
                                                                        activityInfo.status,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="h-8 w-full rounded-lg border border-slate-200/70 bg-slate-50/50 px-3 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all hover:border-slate-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                                                placeholder="Tambahkan catatan keterangan..."
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Footer */}
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white p-4 text-xs sm:flex-row">
                                <div className="font-medium text-slate-500">
                                    Menampilkan {gelaras.length} Gelara
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 font-medium text-slate-500">
                                        <span>Baris:</span>
                                        <select className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700 outline-none">
                                            <option>
                                                10 Baris per halaman
                                            </option>
                                            <option>
                                                25 Baris per halaman
                                            </option>
                                            <option>
                                                50 Baris per halaman
                                            </option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-700">
                                            {'<'}
                                        </button>
                                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-xs">
                                            1
                                        </button>
                                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-700">
                                            {'>'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Rekap Akumulasi' && (
                        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                            {/* Card Header & Controls */}
                            <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/60 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h2 className="text-lg font-bold tracking-tight whitespace-nowrap text-slate-800 sm:text-xl">
                                            Rekap Akumulasi Presensi
                                        </h2>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                            Sinkron Otomatis
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Persentase kehadiran mingguan & bulanan
                                        serta catatan akumulasi alfa Gelara
                                    </p>
                                </div>

                                {/* Toolbar: Bulan, Minggu & Search */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Filter Bulan */}
                                    <div className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-2xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 hover:border-slate-300">
                                        <Calendar
                                            size={14}
                                            className="shrink-0 text-blue-500"
                                        />
                                        <span className="text-[11px] font-medium text-slate-400">
                                            Bulan:
                                        </span>
                                        <input
                                            type="month"
                                            value={rekapMonth}
                                            onChange={(e) =>
                                                handleMonthChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="cursor-pointer bg-transparent text-xs font-bold text-slate-700 outline-none"
                                        />
                                    </div>

                                    {/* Filter Minggu */}
                                    <div className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-2xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 hover:border-slate-300">
                                        <Clock
                                            size={14}
                                            className="shrink-0 text-blue-500"
                                        />
                                        <span className="text-[11px] font-medium text-slate-400">
                                            Minggu:
                                        </span>
                                        <select
                                            value={rekapWeek}
                                            onChange={(e) =>
                                                handleWeekChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="cursor-pointer bg-transparent pr-1 text-xs font-bold text-slate-700 outline-none"
                                        >
                                            {availableWeeks.map((w: any) => (
                                                <option
                                                    key={w.week}
                                                    value={w.week}
                                                >
                                                    Minggu {w.week} (
                                                    {w.start_label} -{' '}
                                                    {w.end_label})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Cari Nama */}
                                    <div className="relative w-full sm:w-56">
                                        <Search
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                            size={14}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cari nama gelara..."
                                            value={rekapSearch}
                                            onChange={(e) =>
                                                setRekapSearch(e.target.value)
                                            }
                                            className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-7 pl-8 text-xs font-medium text-slate-700 placeholder-slate-400 shadow-2xs transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                        />
                                        {rekapSearch && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setRekapSearch('')
                                                }
                                                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                                            >
                                                <X size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="custom-scrollbar overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                                        <tr>
                                            <th className="w-12 px-4 py-3.5 text-center font-medium text-slate-400">
                                                No
                                            </th>
                                            <th className="px-5 py-3.5 text-left">
                                                Nama Gelara
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                <div>Progress Mingguan</div>
                                                <div className="text-[11px] font-normal text-slate-400 capitalize">
                                                    {weekLabel}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                <div>Progress Bulanan</div>
                                                <div className="text-[11px] font-normal text-slate-400 capitalize">
                                                    {monthLabel}
                                                </div>
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                Alfa Minggu
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                Alfa Bulan
                                            </th>
                                            <th className="w-24 px-4 py-3.5 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {gelaras
                                            .filter((student: any) =>
                                                (student.name || '')
                                                    .toLowerCase()
                                                    .includes(
                                                        rekapSearch.toLowerCase(),
                                                    ),
                                            )
                                            .map((student: any, i: number) => {
                                                const stats = rekapData[
                                                    student.id
                                                ] || {
                                                    progress_mingguan: null,
                                                    progress_bulanan: null,
                                                    a_minggu: 0,
                                                    a_bulan: 0,
                                                    hadir_minggu: 0,
                                                    izin_minggu: 0,
                                                    sakit_minggu: 0,
                                                    hadir_bulan: 0,
                                                    izin_bulan: 0,
                                                    sakit_bulan: 0,
                                                };
                                                const pm =
                                                    stats.progress_mingguan;
                                                const pb =
                                                    stats.progress_bulanan;
                                                const am = stats.a_minggu;
                                                const ab = stats.a_bulan;

                                                const renderProgress = (
                                                    val: number | null,
                                                ) => {
                                                    if (
                                                        val === null ||
                                                        val === undefined
                                                    ) {
                                                        return (
                                                            <span className="inline-flex min-w-[56px] items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-400">
                                                                -
                                                            </span>
                                                        );
                                                    }
                                                    let colorClasses =
                                                        'bg-emerald-50 text-emerald-700 border-emerald-200/80';
                                                    if (val < 70) {
                                                        colorClasses =
                                                            'bg-rose-50 text-rose-700 border-rose-200/80';
                                                    } else if (val < 85) {
                                                        colorClasses =
                                                            'bg-amber-50 text-amber-700 border-amber-200/80';
                                                    }
                                                    return (
                                                        <span
                                                            className={`inline-flex min-w-[56px] items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold ${colorClasses}`}
                                                        >
                                                            {val}%
                                                        </span>
                                                    );
                                                };

                                                return (
                                                    <tr
                                                        key={student.id}
                                                        className="group bg-white transition-colors hover:bg-slate-50/70"
                                                    >
                                                        <td className="px-4 py-3.5 text-center text-xs font-medium text-slate-400">
                                                            {i + 1}
                                                        </td>
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-100 bg-blue-50 text-xs font-bold text-blue-600">
                                                                    <span>
                                                                        {(
                                                                            student.name ||
                                                                            'G'
                                                                        )
                                                                            .substring(
                                                                                0,
                                                                                2,
                                                                            )
                                                                            .toUpperCase()}
                                                                    </span>
                                                                    {student.foto && (
                                                                        <img
                                                                            src={`/storage/${student.foto}`}
                                                                            alt=""
                                                                            className="absolute inset-0 h-full w-full object-cover"
                                                                            onError={(
                                                                                e,
                                                                            ) => {
                                                                                (
                                                                                    e.target as HTMLElement
                                                                                ).style.display =
                                                                                    'none';
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="text-sm font-semibold text-slate-800">
                                                                    {
                                                                        student.name
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            {renderProgress(pm)}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            {renderProgress(pb)}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            {am > 0 ? (
                                                                <span className="inline-flex min-w-[22px] items-center justify-center rounded-full border border-rose-200/80 bg-rose-50 px-1.5 py-0.5 text-xs font-bold text-rose-600">
                                                                    {am}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs font-medium text-slate-400">
                                                                    0
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            {ab > 0 ? (
                                                                <span className="inline-flex min-w-[22px] items-center justify-center rounded-full border border-rose-200/80 bg-rose-50 px-1.5 py-0.5 text-xs font-bold text-rose-600">
                                                                    {ab}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs font-medium text-slate-400">
                                                                    0
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDetailStudentRekap(
                                                                        {
                                                                            student,
                                                                            stats,
                                                                        },
                                                                    )
                                                                }
                                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                                                            >
                                                                <Info
                                                                    size={13}
                                                                    className="text-slate-400"
                                                                />
                                                                <span>
                                                                    Detail
                                                                </span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Detail Modal for Rekap Akumulasi */}
                            {detailStudentRekap && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
                                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-100 bg-blue-50 text-sm font-bold text-blue-600">
                                                    <span>
                                                        {(
                                                            detailStudentRekap
                                                                .student.name ||
                                                            'G'
                                                        )
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </span>
                                                    {detailStudentRekap.student
                                                        .foto && (
                                                        <img
                                                            src={`/storage/${detailStudentRekap.student.foto}`}
                                                            alt=""
                                                            className="absolute inset-0 h-full w-full object-cover"
                                                            onError={(e) => {
                                                                (
                                                                    e.target as HTMLElement
                                                                ).style.display =
                                                                    'none';
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">
                                                        {
                                                            detailStudentRekap
                                                                .student.name
                                                        }
                                                    </h3>
                                                    <p className="text-xs text-slate-500">
                                                        Rincian Akumulasi
                                                        Presensi
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDetailStudentRekap(null)
                                                }
                                                className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-3 text-xs">
                                            {/* Rincian Mingguan */}
                                            <div className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                                                <div className="flex items-center justify-between font-bold text-slate-700">
                                                    <span className="capitalize">
                                                        Progress Mingguan (
                                                        {weekLabel})
                                                    </span>
                                                    <span className="text-sm font-extrabold text-emerald-700">
                                                        {detailStudentRekap
                                                            .stats
                                                            .progress_mingguan !==
                                                            null &&
                                                        detailStudentRekap.stats
                                                            .progress_mingguan !==
                                                            undefined
                                                            ? `${detailStudentRekap.stats.progress_mingguan}%`
                                                            : '-'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Hadir
                                                        </span>
                                                        <span className="text-sm font-bold text-emerald-600">
                                                            {calcPct(
                                                                modalStats.hadir_minggu ||
                                                                    0,
                                                                totalModalW,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Izin
                                                        </span>
                                                        <span className="text-sm font-bold text-blue-600">
                                                            {calcPct(
                                                                modalStats.izin_minggu ||
                                                                    0,
                                                                totalModalW,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Sakit
                                                        </span>
                                                        <span className="text-sm font-bold text-amber-600">
                                                            {calcPct(
                                                                modalStats.sakit_minggu ||
                                                                    0,
                                                                totalModalW,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Alfa
                                                        </span>
                                                        <span className="text-sm font-bold text-rose-600">
                                                            {calcPct(
                                                                modalStats.a_minggu ||
                                                                    0,
                                                                totalModalW,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rincian Bulanan */}
                                            <div className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                                                <div className="flex items-center justify-between font-bold text-slate-700">
                                                    <span className="capitalize">
                                                        Progress Bulanan (
                                                        {monthLabel})
                                                    </span>
                                                    <span className="text-sm font-extrabold text-emerald-700">
                                                        {detailStudentRekap
                                                            .stats
                                                            .progress_bulanan !==
                                                            null &&
                                                        detailStudentRekap.stats
                                                            .progress_bulanan !==
                                                            undefined
                                                            ? `${detailStudentRekap.stats.progress_bulanan}%`
                                                            : '-'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Hadir
                                                        </span>
                                                        <span className="text-sm font-bold text-emerald-600">
                                                            {calcPct(
                                                                modalStats.hadir_bulan ||
                                                                    0,
                                                                totalModalM,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Izin
                                                        </span>
                                                        <span className="text-sm font-bold text-blue-600">
                                                            {calcPct(
                                                                modalStats.izin_bulan ||
                                                                    0,
                                                                totalModalM,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Sakit
                                                        </span>
                                                        <span className="text-sm font-bold text-amber-600">
                                                            {calcPct(
                                                                modalStats.sakit_bulan ||
                                                                    0,
                                                                totalModalM,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="border-slate-150 rounded-lg border bg-white p-2 shadow-2xs">
                                                        <span className="mb-0.5 block text-[10px] font-semibold text-slate-400">
                                                            Alfa
                                                        </span>
                                                        <span className="text-sm font-bold text-rose-600">
                                                            {calcPct(
                                                                modalStats.a_bulan ||
                                                                    0,
                                                                totalModalM,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDetailStudentRekap(null)
                                                }
                                                className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                            >
                                                Tutup
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'Tren' &&
                        (() => {
                            const activePoint =
                                hoveredTrendIndex !== null &&
                                trendData[hoveredTrendIndex]
                                    ? trendData[hoveredTrendIndex]
                                    : trendData[trendData.length - 1] || null;

                            const svgWidth = 1000;
                            const svgHeight = 280;
                            const padX = 50;
                            const padTop = 30;
                            const padBottom = 45;
                            const plotW = svgWidth - padX * 2;
                            const plotH = svgHeight - padTop - padBottom;

                            const getX = (idx: number) => {
                                if (trendData.length <= 1)
                                    return padX + plotW / 2;
                                return (
                                    padX +
                                    (idx / (trendData.length - 1)) * plotW
                                );
                            };
                            const getY = (val: number) => {
                                const clamped = Math.max(
                                    0,
                                    Math.min(100, val || 0),
                                );
                                return (
                                    svgHeight -
                                    padBottom -
                                    (clamped / 100) * plotH
                                );
                            };

                            const hadirPoints = trendData
                                .map(
                                    (d: any, i: number) =>
                                        `${getX(i)},${getY(d.hadir)}`,
                                )
                                .join(' ');
                            const hadirAreaPath =
                                trendData.length > 0
                                    ? `M ${getX(0)} ${svgHeight - padBottom} L ${trendData.map((d: any, i: number) => `${getX(i)} ${getY(d.hadir)}`).join(' L ')} L ${getX(trendData.length - 1)} ${svgHeight - padBottom} Z`
                                    : '';
                            const izinPoints = trendData
                                .map(
                                    (d: any, i: number) =>
                                        `${getX(i)},${getY(d.izin)}`,
                                )
                                .join(' ');
                            const sakitPoints = trendData
                                .map(
                                    (d: any, i: number) =>
                                        `${getX(i)},${getY(d.sakit)}`,
                                )
                                .join(' ');
                            const alfaPoints = trendData
                                .map(
                                    (d: any, i: number) =>
                                        `${getX(i)},${getY(d.alfa)}`,
                                )
                                .join(' ');

                            return (
                                <div className="flex min-w-0 flex-1 flex-col gap-6 pb-6">
                                    {/* Header */}
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div>
                                            <div className="mb-1.5 flex flex-wrap items-center gap-3">
                                                <h2 className="text-xl font-extrabold tracking-tight text-slate-800">
                                                    Tren Dinamika Kepatuhan
                                                    Presensi Gelara
                                                </h2>
                                                <span className="rounded-full border border-blue-200/60 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 capitalize">
                                                    {monthLabel}
                                                </span>
                                            </div>
                                            <p className="max-w-2xl text-xs leading-relaxed text-slate-500">
                                                Visualisasi fluktuasi kepatuhan
                                                presensi harian seluruh Gelara
                                                berdasarkan status Hadir, Izin,
                                                Sakit, dan Alfa sepanjang
                                                periode aktif.
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center rounded-xl border border-slate-200/60 bg-slate-100/80 p-1 shadow-2xs">
                                            {(
                                                [
                                                    'Harian',
                                                    'Mingguan',
                                                    'Bulanan',
                                                ] as const
                                            ).map((gran) => (
                                                <button
                                                    key={gran}
                                                    type="button"
                                                    onClick={() =>
                                                        setTrendGranularity(
                                                            gran,
                                                        )
                                                    }
                                                    className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                                                        trendGranularity ===
                                                        gran
                                                            ? 'bg-white text-blue-600 shadow-2xs'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                                >
                                                    {gran}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chart Card */}
                                    <div className="relative flex min-h-[460px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                                        {trendData.length === 0 ? (
                                            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-500 shadow-2xs">
                                                    <Calendar size={26} />
                                                </div>
                                                <h3 className="mb-1 text-base font-bold text-slate-800">
                                                    Belum Ada Data Presensi di
                                                    Periode Ini
                                                </h3>
                                                <p className="max-w-md text-xs text-slate-500">
                                                    Data tren akan otomatis
                                                    divisualisasikan setelah
                                                    mentor mengisi presensi
                                                    harian Gelara pada tab
                                                    Lembar Kerja Presensi.
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Floating Tooltip Banner */}
                                                {activePoint && (
                                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 p-3 text-xs text-white shadow-md">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-white">
                                                                {
                                                                    activePoint.label
                                                                }
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">
                                                                (
                                                                {
                                                                    activePoint.total
                                                                }{' '}
                                                                kegiatan terisi)
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                                                            <span className="flex items-center gap-1.5 text-emerald-400">
                                                                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                                                Hadir:{' '}
                                                                {
                                                                    activePoint.hadir
                                                                }
                                                                %
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-blue-400">
                                                                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                                                                Izin:{' '}
                                                                {
                                                                    activePoint.izin
                                                                }
                                                                %
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-amber-400">
                                                                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                                                                Sakit:{' '}
                                                                {
                                                                    activePoint.sakit
                                                                }
                                                                %
                                                            </span>
                                                            <span className="flex items-center gap-1.5 text-rose-400">
                                                                <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                                                                Alfa:{' '}
                                                                {
                                                                    activePoint.alfa
                                                                }
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Target 85% Reference Banner */}
                                                <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-bold text-slate-400">
                                                    <span className="text-slate-400">
                                                        Grafik Kepatuhan (%)
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-emerald-600">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                        Garis Target Kepatuhan:
                                                        85%
                                                    </span>
                                                </div>

                                                {/* SVG Chart */}
                                                <div className="relative h-[300px] w-full overflow-hidden">
                                                    <svg
                                                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                                        className="h-full w-full overflow-visible"
                                                        preserveAspectRatio="none"
                                                    >
                                                        <defs>
                                                            <linearGradient
                                                                id="hadirAreaGrad"
                                                                x1="0"
                                                                y1="0"
                                                                x2="0"
                                                                y2="1"
                                                            >
                                                                <stop
                                                                    offset="0%"
                                                                    stopColor="#10b981"
                                                                    stopOpacity="0.25"
                                                                />
                                                                <stop
                                                                    offset="100%"
                                                                    stopColor="#10b981"
                                                                    stopOpacity="0.0"
                                                                />
                                                            </linearGradient>
                                                        </defs>

                                                        {/* Horizontal grid lines */}
                                                        {[
                                                            0, 25, 50, 75, 100,
                                                        ].map((val) => (
                                                            <g key={val}>
                                                                <line
                                                                    x1={padX}
                                                                    y1={getY(
                                                                        val,
                                                                    )}
                                                                    x2={
                                                                        svgWidth -
                                                                        padX
                                                                    }
                                                                    y2={getY(
                                                                        val,
                                                                    )}
                                                                    stroke="#f1f5f9"
                                                                    strokeWidth="1.5"
                                                                />
                                                                <text
                                                                    x={padX - 8}
                                                                    y={
                                                                        getY(
                                                                            val,
                                                                        ) + 4
                                                                    }
                                                                    textAnchor="end"
                                                                    className="fill-slate-400 text-[10px] font-semibold"
                                                                >
                                                                    {val}%
                                                                </text>
                                                            </g>
                                                        ))}

                                                        {/* Target 85% line */}
                                                        <line
                                                            x1={padX}
                                                            y1={getY(85)}
                                                            x2={svgWidth - padX}
                                                            y2={getY(85)}
                                                            stroke="#10b981"
                                                            strokeWidth="1.5"
                                                            strokeDasharray="4 4"
                                                            opacity="0.7"
                                                        />

                                                        {/* Hadir area fill */}
                                                        {hadirAreaPath && (
                                                            <path
                                                                d={
                                                                    hadirAreaPath
                                                                }
                                                                fill="url(#hadirAreaGrad)"
                                                            />
                                                        )}

                                                        {/* Polylines for Hadir, Izin, Sakit, Alfa */}
                                                        {hadirPoints && (
                                                            <polyline
                                                                points={
                                                                    hadirPoints
                                                                }
                                                                fill="none"
                                                                stroke="#10b981"
                                                                strokeWidth="3"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        )}
                                                        {izinPoints && (
                                                            <polyline
                                                                points={
                                                                    izinPoints
                                                                }
                                                                fill="none"
                                                                stroke="#3b82f6"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeDasharray="3 3"
                                                            />
                                                        )}
                                                        {sakitPoints && (
                                                            <polyline
                                                                points={
                                                                    sakitPoints
                                                                }
                                                                fill="none"
                                                                stroke="#f59e0b"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeDasharray="3 3"
                                                            />
                                                        )}
                                                        {alfaPoints && (
                                                            <polyline
                                                                points={
                                                                    alfaPoints
                                                                }
                                                                fill="none"
                                                                stroke="#ef4444"
                                                                strokeWidth="2.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        )}

                                                        {/* Data Circles & Hover Targets */}
                                                        {trendData.map(
                                                            (
                                                                d: any,
                                                                idx: number,
                                                            ) => {
                                                                const cx =
                                                                    getX(idx);
                                                                const cyHadir =
                                                                    getY(
                                                                        d.hadir,
                                                                    );
                                                                const isHovered =
                                                                    hoveredTrendIndex ===
                                                                    idx;

                                                                return (
                                                                    <g
                                                                        key={
                                                                            d.date
                                                                        }
                                                                        className="cursor-pointer transition-all"
                                                                        onMouseEnter={() =>
                                                                            setHoveredTrendIndex(
                                                                                idx,
                                                                            )
                                                                        }
                                                                    >
                                                                        {/* Transparent wide hover hitbox */}
                                                                        <rect
                                                                            x={
                                                                                cx -
                                                                                15
                                                                            }
                                                                            y={
                                                                                padTop
                                                                            }
                                                                            width={
                                                                                30
                                                                            }
                                                                            height={
                                                                                plotH
                                                                            }
                                                                            fill="transparent"
                                                                        />

                                                                        {/* Hover indicator line */}
                                                                        {isHovered && (
                                                                            <line
                                                                                x1={
                                                                                    cx
                                                                                }
                                                                                y1={
                                                                                    padTop
                                                                                }
                                                                                x2={
                                                                                    cx
                                                                                }
                                                                                y2={
                                                                                    svgHeight -
                                                                                    padBottom
                                                                                }
                                                                                stroke="#94a3b8"
                                                                                strokeWidth="1"
                                                                                strokeDasharray="2 2"
                                                                            />
                                                                        )}

                                                                        {/* Hadir Circle */}
                                                                        <circle
                                                                            cx={
                                                                                cx
                                                                            }
                                                                            cy={
                                                                                cyHadir
                                                                            }
                                                                            r={
                                                                                isHovered
                                                                                    ? 6
                                                                                    : 4
                                                                            }
                                                                            fill={
                                                                                isHovered
                                                                                    ? '#10b981'
                                                                                    : '#ffffff'
                                                                            }
                                                                            stroke="#10b981"
                                                                            strokeWidth={
                                                                                isHovered
                                                                                    ? 3
                                                                                    : 2
                                                                            }
                                                                        />

                                                                        {/* X Axis Date Label */}
                                                                        <text
                                                                            x={
                                                                                cx
                                                                            }
                                                                            y={
                                                                                svgHeight -
                                                                                15
                                                                            }
                                                                            textAnchor="middle"
                                                                            className={`text-[10px] transition-colors ${
                                                                                isHovered
                                                                                    ? 'fill-emerald-600 font-extrabold'
                                                                                    : 'fill-slate-400 font-medium'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                d.label
                                                                            }
                                                                        </text>
                                                                    </g>
                                                                );
                                                            },
                                                        )}
                                                    </svg>
                                                </div>
                                            </>
                                        )}

                                        {/* Legend Bar */}
                                        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-2xs">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                                Hadir (%)
                                            </div>
                                            <div className="flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
                                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                Izin (%)
                                            </div>
                                            <div className="flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-700 shadow-2xs">
                                                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                                                Sakit (%)
                                            </div>
                                            <div className="flex items-center gap-2 rounded-full border border-rose-200/60 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 shadow-2xs">
                                                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                                                Alfa (%)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                    {/* Right Sidebar Widgets */}
                    {activeTab === 'Lembar Kerja Presensi' && (
                        <div className="flex w-full shrink-0 flex-col gap-6 xl:w-72">
                            {/* Formula Presensi */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Formula Presensi
                                </h3>
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="text-lg leading-tight font-extrabold text-slate-800">
                                        Rekap
                                        <br />
                                        Periode
                                    </div>
                                    <div className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                        Tinggi
                                    </div>
                                </div>
                                <div className="space-y-4 text-xs font-medium">
                                    <div>
                                        <div className="mb-1 flex justify-between text-slate-600">
                                            <span>
                                                Rekap Harian (
                                                {dateObj.toLocaleDateString(
                                                    'id-ID',
                                                    {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    },
                                                )}
                                                )
                                            </span>
                                            <span className="font-bold text-blue-600">
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-blue-600"
                                                style={{ width: `${pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex justify-between text-slate-600">
                                            <span>
                                                Rekap Mingguan (Pekan ke-
                                                {Math.ceil(
                                                    dateObj.getDate() / 7,
                                                )}{' '}
                                                {dateObj.toLocaleDateString(
                                                    'id-ID',
                                                    { month: 'long' },
                                                )}
                                                )
                                            </span>
                                            <span className="font-bold text-emerald-600">
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-emerald-500"
                                                style={{ width: `${pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex justify-between text-slate-600">
                                            <span>
                                                Rekap Bulanan (
                                                {dateObj.toLocaleDateString(
                                                    'id-ID',
                                                    {
                                                        month: 'long',
                                                        year: 'numeric',
                                                    },
                                                )}
                                                )
                                            </span>
                                            <span className="font-bold text-slate-800">
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-slate-800"
                                                style={{ width: `${pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[10px] text-slate-500">
                                    <div className="flex shrink-0 flex-col gap-1">
                                        <span className="font-bold">
                                            Formula SKPI:
                                        </span>
                                        <span className="font-bold text-emerald-600">
                                            Target ≥ 90.0%
                                        </span>
                                    </div>
                                    <div>
                                        Presensi = [Hadir / (Total - Dispensasi
                                        Sah)] × 100%. Data langsung terindeks di
                                        sistem portfolio karakter.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
