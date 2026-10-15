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
    X
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
    initialTab = 'Lembar Kerja Presensi'
}: any) {

    const handleUpdate = (studentId: number, status: string, note: string) => {
        const existing = activitiesData[studentId]?.activities || {};
        const isOldArray = Array.isArray(existing);
        let newActivities: any = isOldArray ? {} : { ...existing };

        newActivities[selectedActivity] = { status, note };

        router.post('/kegelaraan/daily-activity', {
            gelara_id: studentId,
            date: selectedDate,
            activities: newActivities
        }, { preserveScroll: true, preserveState: true });
    };

    const handleMarkAllPresent = () => {
        const bulkData = gelaras.map((g: any) => {
            const existing = activitiesData[g.id]?.activities || {};
            const isOldArray = Array.isArray(existing);
            let newActivities: any = isOldArray ? {} : { ...existing };
            newActivities[selectedActivity] = { status: 'H', note: '' };
            return { gelara_id: g.id, activities: newActivities };
        });

        router.post('/kegelaraan/daily-activity', {
            date: selectedDate,
            bulk_data: bulkData
        }, { preserveScroll: true, preserveState: true });
    };

    const [activeTab, setActiveTab] = useState(initialTab || 'Lembar Kerja Presensi');
    const tabs = ['Lembar Kerja Presensi', 'Rekap Akumulasi', 'Tren'];

    const [selectedDate, setSelectedDate] = useState(date || new Date().toISOString().split('T')[0]);
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
    const totalModalW = (modalStats.hadir_minggu || 0) + (modalStats.izin_minggu || 0) + (modalStats.sakit_minggu || 0) + (modalStats.a_minggu || 0);
    const totalModalM = (modalStats.hadir_bulan || 0) + (modalStats.izin_bulan || 0) + (modalStats.sakit_bulan || 0) + (modalStats.a_bulan || 0);

    const [rekapMonth, setRekapMonth] = useState(selectedMonth || (date ? date.substring(0, 7) : new Date().toISOString().slice(0, 7)));
    const [rekapWeek, setRekapWeek] = useState(selectedWeek || 1);
    const [trendGranularity, setTrendGranularity] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Harian');
    const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

    useEffect(() => {
        if (selectedMonth) setRekapMonth(selectedMonth);
    }, [selectedMonth]);

    useEffect(() => {
        if (selectedWeek) setRekapWeek(selectedWeek);
    }, [selectedWeek]);

    const handleMonthChange = (newMonth: string) => {
        setRekapMonth(newMonth);
        setRekapWeek(1);
        router.get('/kegelaraan/daily-activity', {
            tab: 'Rekap Akumulasi',
            month: newMonth,
            week: 1,
            date: selectedDate
        }, { preserveState: true, preserveScroll: true });
    };

    const handleWeekChange = (newWeek: number) => {
        setRekapWeek(newWeek);
        router.get('/kegelaraan/daily-activity', {
            tab: 'Rekap Akumulasi',
            month: rekapMonth,
            week: newWeek,
            date: selectedDate
        }, { preserveState: true, preserveScroll: true });
    };

    const activities = [
        'Bangun tidur', 'Mandi pagi', 'Sholat subuh', 'TC', 'Piket', 'Berangkat sekolah',
        'Sholat dzuhur', 'Sholat ashar', 'Sholat maghrib', 'Sholat isya', 'KBM',
        'Apel malam', 'Pengumpulan hp', 'Mandi sore', 'Pulang sekolah', 'Olahraga',
        'Nonton bareng', 'Zoom viconnas', 'Pengajian', 'Koordinasi bulanan', 'Opsih'
    ];

    const dateObj = new Date(selectedDate);
    const month = dateObj.getMonth();
    const isGanjil = month >= 6;
    const yearStart = isGanjil ? dateObj.getFullYear() : dateObj.getFullYear() - 1;
    const semesterText = `T.A. ${yearStart}/${yearStart + 1} (Semester ${isGanjil ? 'Ganjil' : 'Genap'})`;

    const totalGelara = gelaras.length;
    let totalH = 0, totalS = 0, totalI = 0, totalA = 0;
    gelaras.forEach((g: any) => {
        const act = activitiesData[g.id]?.activities || {};
        const st = Array.isArray(act) ? (act.includes(selectedActivity) ? 'H' : '-') : (act[selectedActivity]?.status || '-');
        if (st === 'H') totalH++;
        if (st === 'S') totalS++;
        if (st === 'I') totalI++;
        if (st === 'A') totalA++;
    });
    const pct = totalGelara > 0 ? (((totalH + totalS + totalI + totalA) / totalGelara) * 100).toFixed(1) : '0.0';

    return (
        <DashboardLayout title="Daily Activity">
            <div className="font-sans text-slate-800 pb-10">
                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
                            Daily Activity Gelara<br />Lembar Presensi & Rekap Mentor
                        </h1>
                        <p className="text-sm text-slate-500 max-w-md">
                            Pencatatan kehadiran dan aktivitas harian Gelara berbasis lembar kerja oleh Mentor Asrama
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                    </div>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                    <div className="flex flex-wrap gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    {activeTab === 'Lembar Kerja Presensi' && (
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <input
                                type="text"
                                placeholder="Cari nama gelara..."
                                value={lembarSearch}
                                onChange={(e) => setLembarSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-7 text-xs font-medium text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            {lembarSearch && (
                                <button
                                    type="button"
                                    onClick={() => setLembarSearch('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><GraduationCap size={20} /></div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahun Akademik</label>
                                    <select value={semesterText} disabled className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none cursor-pointer appearance-none">
                                        <option value={semesterText}>{semesterText}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-blue-500"><Clock size={20} /></div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kegiatan</label>
                                    <select
                                        value={selectedActivity}
                                        onChange={e => setSelectedActivity(e.target.value)}
                                        className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                                    >
                                        {activities.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-blue-500"><Calendar size={20} /></div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Lembar Kerja</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={e => {
                                            setSelectedDate(e.target.value);
                                            router.get('/kegelaraan/daily-activity', {
                                                date: e.target.value,
                                                tab: 'Lembar Kerja Presensi'
                                            }, { preserveState: true, preserveScroll: true });
                                        }}
                                        className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Gelara</span>
                                </div>
                                <div className="text-3xl font-extrabold text-slate-800">{totalGelara} <span className="text-sm font-medium text-slate-500">Gelara</span></div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1 border-b-4 border-b-emerald-500">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Hadir</span>
                                    <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">H</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="text-3xl font-extrabold text-emerald-600">{totalH}</div>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase">Izin (I)</span>
                                    <span className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">I</span>
                                </div>
                                <div className="text-3xl font-extrabold text-blue-600 mb-1">{totalI}</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-amber-500 uppercase">Sakit (S)</span>
                                    <span className="w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">S</span>
                                </div>
                                <div className="text-3xl font-extrabold text-amber-500">{totalS}</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-red-500 uppercase">Alfa (A)</span>
                                    <span className="w-5 h-5 rounded bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">A</span>
                                </div>
                                <div className="text-3xl font-extrabold text-red-500">{totalA}</div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between bg-blue-50/50">
                                <div className="text-[10px] font-bold text-blue-800 uppercase mb-2">Keterlaksanaan</div>
                                <div className="text-4xl font-extrabold text-blue-700 tracking-tight">{pct}%</div>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Main Table Area */}
                    {activeTab === 'Lembar Kerja Presensi' && (
                        <div className="flex-1 min-w-0 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden flex flex-col">
                            {/* Card Header */}
                            <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/80 shadow-2xs">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-slate-800 leading-tight">
                                            Lembar Presensi: {selectedActivity}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5 capitalize">
                                            {dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleMarkAllPresent}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 active:scale-[0.98] border border-emerald-200/80 font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                                >
                                    <CheckCheck size={14} className="text-emerald-600" />
                                    <span>Tandai Semua Hadir</span>
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                                        <tr>
                                            <th className="px-4 py-3.5 w-12 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={gelaras.length > 0 && selectedRowIds.length === gelaras.length}
                                                    onChange={() => {
                                                        if (selectedRowIds.length === gelaras.length) {
                                                            setSelectedRowIds([]);
                                                        } else {
                                                            setSelectedRowIds(gelaras.map((g: any) => g.id));
                                                        }
                                                    }}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </th>
                                            <th className="px-3 py-3.5 w-12 text-center text-slate-400 font-medium">No</th>
                                            <th className="px-4 py-3.5 text-left">Nama Gelara & Identitas</th>
                                            <th className="px-4 py-3.5 text-center w-44">Status Presensi</th>
                                            <th className="px-4 py-3.5 text-left">Catatan / Keterangan Mentor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {gelaras
                                            .filter((student: any) =>
                                                (student.name || '').toLowerCase().includes(lembarSearch.toLowerCase())
                                            )
                                            .map((student: any, i: number) => {
                                                const gelaraData = activitiesData[student.id]?.activities || {};
                                                const isOldArray = Array.isArray(gelaraData);
                                                const activityInfo = isOldArray
                                                    ? (gelaraData.includes(selectedActivity) ? { status: 'H', note: '' } : { status: '-', note: '' })
                                                    : (gelaraData[selectedActivity] || { status: '-', note: '' });

                                                const isRowSelected = selectedRowIds.includes(student.id);

                                                return (
                                                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors group bg-white">
                                                        <td className="px-4 py-3.5 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isRowSelected}
                                                                onChange={() => {
                                                                    if (isRowSelected) {
                                                                        setSelectedRowIds(selectedRowIds.filter((id: number) => id !== student.id));
                                                                    } else {
                                                                        setSelectedRowIds([...selectedRowIds, student.id]);
                                                                    }
                                                                }}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3.5 text-center text-slate-400 font-medium text-xs">
                                                            {(i + 1).toString().padStart(2, '0')}
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden bg-blue-50 text-blue-600 border border-blue-100">
                                                                    <span>{(student.name || 'G').substring(0, 2).toUpperCase()}</span>
                                                                    {student.foto && (
                                                                        <img
                                                                            src={`/storage/${student.foto}`}
                                                                            alt=""
                                                                            className="absolute inset-0 w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                (e.target as HTMLElement).style.display = 'none';
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-slate-800 text-sm">{student.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="flex items-center justify-center gap-1 bg-slate-100/90 rounded-full p-1 w-fit mx-auto border border-slate-200/60 shadow-2xs">
                                                                {[
                                                                    { key: 'H', label: 'Hadir', bg: 'bg-emerald-500 text-white shadow-2xs' },
                                                                    { key: 'S', label: 'Sakit', bg: 'bg-amber-500 text-white shadow-2xs' },
                                                                    { key: 'I', label: 'Izin', bg: 'bg-blue-500 text-white shadow-2xs' },
                                                                    { key: 'A', label: 'Alfa', bg: 'bg-rose-500 text-white shadow-2xs' }
                                                                ].map((st) => (
                                                                    <button
                                                                        key={st.key}
                                                                        type="button"
                                                                        title={st.label}
                                                                        onClick={() => handleUpdate(student.id, st.key, activityInfo.note)}
                                                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${activityInfo.status === st.key
                                                                                ? `${st.bg} scale-105`
                                                                                : 'text-slate-400 hover:text-slate-700 hover:bg-white/80'
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
                                                                defaultValue={activityInfo.note}
                                                                onBlur={(e) => handleUpdate(student.id, activityInfo.status, e.target.value)}
                                                                className="w-full h-8 px-3 rounded-lg text-xs font-medium bg-slate-50/50 border border-slate-200/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 placeholder-slate-400"
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
                            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 text-xs bg-white">
                                <div className="text-slate-500 font-medium">
                                    Menampilkan {gelaras.length} Gelara
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-slate-500 font-medium">
                                        <span>Baris:</span>
                                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold outline-none cursor-pointer">
                                            <option>10 Baris per halaman</option>
                                            <option>25 Baris per halaman</option>
                                            <option>50 Baris per halaman</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center font-bold">
                                            {'<'}
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs">
                                            1
                                        </button>
                                        <button className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center font-bold">
                                            {'>'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Rekap Akumulasi' && (
                        <div className="flex-1 min-w-0 rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden flex flex-col">
                            {/* Card Header & Controls */}
                            <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
                                            Rekap Akumulasi Presensi
                                        </h2>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/70">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Sinkron Otomatis
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Persentase kehadiran mingguan & bulanan serta catatan akumulasi alfa Gelara
                                    </p>
                                </div>

                                {/* Toolbar: Bulan, Minggu & Search */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Filter Bulan */}
                                    <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                        <Calendar size={14} className="text-blue-500 shrink-0" />
                                        <span className="text-[11px] font-medium text-slate-400">Bulan:</span>
                                        <input
                                            type="month"
                                            value={rekapMonth}
                                            onChange={(e) => handleMonthChange(e.target.value)}
                                            className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Filter Minggu */}
                                    <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                        <Clock size={14} className="text-blue-500 shrink-0" />
                                        <span className="text-[11px] font-medium text-slate-400">Minggu:</span>
                                        <select
                                            value={rekapWeek}
                                            onChange={(e) => handleWeekChange(Number(e.target.value))}
                                            className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer pr-1"
                                        >
                                            {availableWeeks.map((w: any) => (
                                                <option key={w.week} value={w.week}>
                                                    Minggu {w.week} ({w.start_label} - {w.end_label})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Cari Nama */}
                                    <div className="relative w-full sm:w-56">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Cari nama gelara..."
                                            value={rekapSearch}
                                            onChange={(e) => setRekapSearch(e.target.value)}
                                            className="w-full h-9 rounded-xl border border-slate-200 bg-white pl-8 pr-7 text-xs font-medium text-slate-700 placeholder-slate-400 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all"
                                        />
                                        {rekapSearch && (
                                            <button
                                                type="button"
                                                onClick={() => setRekapSearch('')}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                            >
                                                <X size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                                        <tr>
                                            <th className="px-4 py-3.5 w-12 text-center text-slate-400 font-medium">No</th>
                                            <th className="px-5 py-3.5 text-left">Nama Gelara</th>
                                            <th className="px-4 py-3.5 text-center">
                                                <div>Progress Mingguan</div>
                                                <div className="text-[11px] font-normal text-slate-400 capitalize">{weekLabel}</div>
                                            </th>
                                            <th className="px-4 py-3.5 text-center">
                                                <div>Progress Bulanan</div>
                                                <div className="text-[11px] font-normal text-slate-400 capitalize">{monthLabel}</div>
                                            </th>
                                            <th className="px-4 py-3.5 text-center">Alfa Minggu</th>
                                            <th className="px-4 py-3.5 text-center">Alfa Bulan</th>
                                            <th className="px-4 py-3.5 text-center w-24">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {gelaras
                                            .filter((student: any) =>
                                                (student.name || '').toLowerCase().includes(rekapSearch.toLowerCase())
                                            )
                                            .map((student: any, i: number) => {
                                                const stats = rekapData[student.id] || {
                                                    progress_mingguan: null,
                                                    progress_bulanan: null,
                                                    a_minggu: 0,
                                                    a_bulan: 0,
                                                    hadir_minggu: 0,
                                                    izin_minggu: 0,
                                                    sakit_minggu: 0,
                                                    hadir_bulan: 0,
                                                    izin_bulan: 0,
                                                    sakit_bulan: 0
                                                };
                                                const pm = stats.progress_mingguan;
                                                const pb = stats.progress_bulanan;
                                                const am = stats.a_minggu;
                                                const ab = stats.a_bulan;

                                                const renderProgress = (val: number | null) => {
                                                    if (val === null || val === undefined) {
                                                        return (
                                                            <span className="inline-flex items-center justify-center min-w-[56px] px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200">
                                                                -
                                                            </span>
                                                        );
                                                    }
                                                    let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
                                                    if (val < 70) {
                                                        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80';
                                                    } else if (val < 85) {
                                                        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80';
                                                    }
                                                    return (
                                                        <span className={`inline-flex items-center justify-center min-w-[56px] px-2.5 py-1 rounded-full text-xs font-bold border ${colorClasses}`}>
                                                            {val}%
                                                        </span>
                                                    );
                                                };

                                                return (
                                                    <tr key={student.id} className="transition-colors group bg-white hover:bg-slate-50/70">
                                                        <td className="px-4 py-3.5 text-center text-slate-400 font-medium text-xs">{i + 1}</td>
                                                        <td className="px-5 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden bg-blue-50 text-blue-600 border border-blue-100">
                                                                    <span>{(student.name || 'G').substring(0, 2).toUpperCase()}</span>
                                                                    {student.foto && (
                                                                        <img
                                                                            src={`/storage/${student.foto}`}
                                                                            alt=""
                                                                            className="absolute inset-0 w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                (e.target as HTMLElement).style.display = 'none';
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="font-semibold text-slate-800 text-sm">{student.name}</div>
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
                                                                <span className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/80">
                                                                    {am}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 font-medium text-xs">0</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            {ab > 0 ? (
                                                                <span className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/80">
                                                                    {ab}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 font-medium text-xs">0</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3.5 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDetailStudentRekap({ student, stats })}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 shadow-2xs transition-all cursor-pointer"
                                                            >
                                                                <Info size={13} className="text-slate-400" />
                                                                <span>Detail</span>
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
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden bg-blue-50 text-blue-600 border border-blue-100">
                                                    <span>{(detailStudentRekap.student.name || 'G').substring(0, 2).toUpperCase()}</span>
                                                    {detailStudentRekap.student.foto && (
                                                        <img
                                                            src={`/storage/${detailStudentRekap.student.foto}`}
                                                            alt=""
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLElement).style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm">{detailStudentRekap.student.name}</h3>
                                                    <p className="text-xs text-slate-500">Rincian Akumulasi Presensi</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setDetailStudentRekap(null)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-3 text-xs">
                                            {/* Rincian Mingguan */}
                                            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 space-y-2.5">
                                                <div className="flex items-center justify-between font-bold text-slate-700">
                                                    <span className="capitalize">Progress Mingguan ({weekLabel})</span>
                                                    <span className="text-emerald-700 font-extrabold text-sm">{detailStudentRekap.stats.progress_mingguan !== null && detailStudentRekap.stats.progress_mingguan !== undefined ? `${detailStudentRekap.stats.progress_mingguan}%` : '-'}</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Hadir</span>
                                                        <span className="font-bold text-emerald-600 text-sm">{calcPct(modalStats.hadir_minggu || 0, totalModalW)}</span>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Izin</span>
                                                        <span className="font-bold text-blue-600 text-sm">{calcPct(modalStats.izin_minggu || 0, totalModalW)}</span>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Sakit</span>
                                                        <span className="font-bold text-amber-600 text-sm">{calcPct(modalStats.sakit_minggu || 0, totalModalW)}</span>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Alfa</span>
                                                        <span className="font-bold text-rose-600 text-sm">{calcPct(modalStats.a_minggu || 0, totalModalW)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rincian Bulanan */}
                                            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 space-y-2.5">
                                                <div className="flex items-center justify-between font-bold text-slate-700">
                                                    <span className="capitalize">Progress Bulanan ({monthLabel})</span>
                                                    <span className="text-emerald-700 font-extrabold text-sm">{detailStudentRekap.stats.progress_bulanan !== null && detailStudentRekap.stats.progress_bulanan !== undefined ? `${detailStudentRekap.stats.progress_bulanan}%` : '-'}</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Hadir</span>
                                                        <span className="font-bold text-emerald-600 text-sm">{calcPct(modalStats.hadir_bulan || 0, totalModalM)}</span>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Izin</span>
                                                        <span className="font-bold text-blue-600 text-sm">{calcPct(modalStats.izin_bulan || 0, totalModalM)}</span>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Sakit</span>
                                                        <span className="font-bold text-amber-600 text-sm">{calcPct(modalStats.sakit_bulan || 0, totalModalM)}</span>
                                                    </div>
                                                    <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-2xs">
                                                        <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Alfa</span>
                                                        <span className="font-bold text-rose-600 text-sm">{calcPct(modalStats.a_bulan || 0, totalModalM)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setDetailStudentRekap(null)}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                                            >
                                                Tutup
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'Tren' && (() => {
                        const activePoint = (hoveredTrendIndex !== null && trendData[hoveredTrendIndex])
                            ? trendData[hoveredTrendIndex]
                            : (trendData[trendData.length - 1] || null);

                        const svgWidth = 1000;
                        const svgHeight = 280;
                        const padX = 50;
                        const padTop = 30;
                        const padBottom = 45;
                        const plotW = svgWidth - padX * 2;
                        const plotH = svgHeight - padTop - padBottom;

                        const getX = (idx: number) => {
                            if (trendData.length <= 1) return padX + plotW / 2;
                            return padX + (idx / (trendData.length - 1)) * plotW;
                        };
                        const getY = (val: number) => {
                            const clamped = Math.max(0, Math.min(100, val || 0));
                            return (svgHeight - padBottom) - (clamped / 100) * plotH;
                        };

                        const hadirPoints = trendData.map((d: any, i: number) => `${getX(i)},${getY(d.hadir)}`).join(' ');
                        const hadirAreaPath = trendData.length > 0
                            ? `M ${getX(0)} ${svgHeight - padBottom} L ${trendData.map((d: any, i: number) => `${getX(i)} ${getY(d.hadir)}`).join(' L ')} L ${getX(trendData.length - 1)} ${svgHeight - padBottom} Z`
                            : '';
                        const izinPoints = trendData.map((d: any, i: number) => `${getX(i)},${getY(d.izin)}`).join(' ');
                        const sakitPoints = trendData.map((d: any, i: number) => `${getX(i)},${getY(d.sakit)}`).join(' ');
                        const alfaPoints = trendData.map((d: any, i: number) => `${getX(i)},${getY(d.alfa)}`).join(' ');

                        return (
                            <div className="flex-1 min-w-0 flex flex-col gap-6 pb-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                                Tren Dinamika Kepatuhan Presensi Gelara
                                            </h2>
                                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 capitalize">
                                                {monthLabel}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                                            Visualisasi fluktuasi kepatuhan presensi harian seluruh Gelara berdasarkan status Hadir, Izin, Sakit, dan Alfa sepanjang periode aktif.
                                        </p>
                                    </div>
                                    <div className="flex items-center p-1 bg-slate-100/80 rounded-xl shrink-0 border border-slate-200/60 shadow-2xs">
                                        {(['Harian', 'Mingguan', 'Bulanan'] as const).map((gran) => (
                                            <button
                                                key={gran}
                                                type="button"
                                                onClick={() => setTrendGranularity(gran)}
                                                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                                    trendGranularity === gran
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
                                <div className="relative w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs overflow-hidden flex flex-col justify-between min-h-[460px]">
                                    {trendData.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-3 shadow-2xs">
                                                <Calendar size={26} />
                                            </div>
                                            <h3 className="text-base font-bold text-slate-800 mb-1">Belum Ada Data Presensi di Periode Ini</h3>
                                            <p className="text-xs text-slate-500 max-w-md">
                                                Data tren akan otomatis divisualisasikan setelah mentor mengisi presensi harian Gelara pada tab Lembar Kerja Presensi.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Floating Tooltip Banner */}
                                            {activePoint && (
                                                <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 rounded-xl bg-slate-900 text-white text-xs shadow-md">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-white text-sm">{activePoint.label}</span>
                                                        <span className="text-[11px] text-slate-400">({activePoint.total} kegiatan terisi)</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                                                        <span className="text-emerald-400 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                            Hadir: {activePoint.hadir}%
                                                        </span>
                                                        <span className="text-blue-400 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                                            Izin: {activePoint.izin}%
                                                        </span>
                                                        <span className="text-amber-400 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                            Sakit: {activePoint.sakit}%
                                                        </span>
                                                        <span className="text-rose-400 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                                            Alfa: {activePoint.alfa}%
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Target 85% Reference Banner */}
                                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
                                                <span className="text-slate-400">Grafik Kepatuhan (%)</span>
                                                <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Garis Target Kepatuhan: 85%
                                                </span>
                                            </div>

                                            {/* SVG Chart */}
                                            <div className="w-full h-[300px] relative overflow-hidden">
                                                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                                    <defs>
                                                        <linearGradient id="hadirAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                                        </linearGradient>
                                                    </defs>

                                                    {/* Horizontal grid lines */}
                                                    {[0, 25, 50, 75, 100].map((val) => (
                                                        <g key={val}>
                                                            <line
                                                                x1={padX}
                                                                y1={getY(val)}
                                                                x2={svgWidth - padX}
                                                                y2={getY(val)}
                                                                stroke="#f1f5f9"
                                                                strokeWidth="1.5"
                                                            />
                                                            <text
                                                                x={padX - 8}
                                                                y={getY(val) + 4}
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
                                                        <path d={hadirAreaPath} fill="url(#hadirAreaGrad)" />
                                                    )}

                                                    {/* Polylines for Hadir, Izin, Sakit, Alfa */}
                                                    {hadirPoints && (
                                                        <polyline points={hadirPoints} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                    )}
                                                    {izinPoints && (
                                                        <polyline points={izinPoints} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
                                                    )}
                                                    {sakitPoints && (
                                                        <polyline points={sakitPoints} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
                                                    )}
                                                    {alfaPoints && (
                                                        <polyline points={alfaPoints} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    )}

                                                    {/* Data Circles & Hover Targets */}
                                                    {trendData.map((d: any, idx: number) => {
                                                        const cx = getX(idx);
                                                        const cyHadir = getY(d.hadir);
                                                        const isHovered = hoveredTrendIndex === idx;

                                                        return (
                                                            <g
                                                                key={d.date}
                                                                className="cursor-pointer transition-all"
                                                                onMouseEnter={() => setHoveredTrendIndex(idx)}
                                                            >
                                                                {/* Transparent wide hover hitbox */}
                                                                <rect
                                                                    x={cx - 15}
                                                                    y={padTop}
                                                                    width={30}
                                                                    height={plotH}
                                                                    fill="transparent"
                                                                />

                                                                {/* Hover indicator line */}
                                                                {isHovered && (
                                                                    <line
                                                                        x1={cx}
                                                                        y1={padTop}
                                                                        x2={cx}
                                                                        y2={svgHeight - padBottom}
                                                                        stroke="#94a3b8"
                                                                        strokeWidth="1"
                                                                        strokeDasharray="2 2"
                                                                    />
                                                                )}

                                                                {/* Hadir Circle */}
                                                                <circle
                                                                    cx={cx}
                                                                    cy={cyHadir}
                                                                    r={isHovered ? 6 : 4}
                                                                    fill={isHovered ? '#10b981' : '#ffffff'}
                                                                    stroke="#10b981"
                                                                    strokeWidth={isHovered ? 3 : 2}
                                                                />

                                                                {/* X Axis Date Label */}
                                                                <text
                                                                    x={cx}
                                                                    y={svgHeight - 15}
                                                                    textAnchor="middle"
                                                                    className={`text-[10px] transition-colors ${
                                                                        isHovered
                                                                            ? 'fill-emerald-600 font-extrabold'
                                                                            : 'fill-slate-400 font-medium'
                                                                    }`}
                                                                >
                                                                    {d.label}
                                                                </text>
                                                            </g>
                                                        );
                                                    })}
                                                </svg>
                                            </div>
                                        </>
                                    )}

                                    {/* Legend Bar */}
                                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 shadow-2xs">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            Hadir (%)
                                        </div>
                                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200/60 shadow-2xs">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            Izin (%)
                                        </div>
                                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200/60 shadow-2xs">
                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                            Sakit (%)
                                        </div>
                                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200/60 shadow-2xs">
                                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                            Alfa (%)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Right Sidebar Widgets */}
                    {activeTab === 'Lembar Kerja Presensi' && (
                        <div className="w-full xl:w-72 flex flex-col gap-6 shrink-0">


                            {/* Formula Presensi */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Formula Presensi</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="font-extrabold text-slate-800 text-lg leading-tight">Rekap<br />Periode</div>
                                    <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">Tinggi</div>
                                </div>
                                <div className="space-y-4 text-xs font-medium">
                                    <div>
                                        <div className="flex justify-between text-slate-600 mb-1">
                                            <span>Rekap Harian ({dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})</span>
                                            <span className="font-bold text-blue-600">{pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-slate-600 mb-1">
                                            <span>Rekap Mingguan (Pekan ke-{Math.ceil(dateObj.getDate() / 7)} {dateObj.toLocaleDateString('id-ID', { month: 'long' })})</span>
                                            <span className="font-bold text-emerald-600">{pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-slate-600 mb-1">
                                            <span>Rekap Bulanan ({dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})</span>
                                            <span className="font-bold text-slate-800">{pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-800" style={{ width: `${pct}%` }}></div></div>
                                    </div>
                                </div>
                                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 flex gap-3 items-start">
                                    <div className="flex flex-col gap-1 shrink-0">
                                        <span className="font-bold">Formula SKPI:</span>
                                        <span className="font-bold text-emerald-600">Target ≥ 90.0%</span>
                                    </div>
                                    <div>
                                        Presensi = [Hadir / (Total - Dispensasi Sah)] × 100%. Data langsung terindeks di sistem portfolio karakter.
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
