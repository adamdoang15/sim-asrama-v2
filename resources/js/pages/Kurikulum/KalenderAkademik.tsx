import React, { useState, useRef, useMemo } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useForm, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Download,
    BarChart2,
    MapPin,
    Info,
    X,
    Save,
    Trash2,
    GraduationCap,
    CalendarCheck,
} from 'lucide-react';

export interface KalenderEvent {
    id: number;
    title: string;
    description?: string;
    start_date: string;
    end_date?: string;
    type: string;
    location?: string;
    is_completed?: boolean;
}

const CATEGORIES = [
    {
        key: 'KBM',
        name: 'KBM & Perkuliahan',
        dot: 'bg-blue-600',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        hover: 'hover:bg-blue-100',
    },
    {
        key: 'Ujian',
        name: 'Ujian & Asesmen',
        dot: 'bg-amber-600',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        hover: 'hover:bg-amber-100',
    },
    {
        key: 'Libur',
        name: 'Libur Akademik',
        dot: 'bg-rose-500',
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-500',
        hover: 'hover:bg-rose-100',
    },
    {
        key: 'Registrasi',
        name: 'Registrasi & Adm.',
        dot: 'bg-purple-600',
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        border: 'border-purple-500',
        hover: 'hover:bg-purple-100',
    },
    {
        key: 'Asrama',
        name: 'Kegiatan Asrama',
        dot: 'bg-emerald-600',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-500',
        hover: 'hover:bg-emerald-100',
    },
    {
        key: 'Lainnya',
        name: 'Khusus & Lainnya',
        dot: 'bg-slate-600',
        color: 'text-slate-700',
        bg: 'bg-slate-50',
        border: 'border-slate-400',
        hover: 'hover:bg-slate-100',
    },
] as const;

const DEFAULT_CATEGORY_STYLE = CATEGORIES[5];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function KalenderAkademik({
    kegiatans = [],
}: {
    kegiatans?: KalenderEvent[];
}) {
    const calendarScrollRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeCategory, setActiveCategory] = useState<string>('Semua');

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            type: 'KBM',
            location: '',
            is_completed: false,
        });

    const categoryMap = useMemo(() => {
        return new Map(CATEGORIES.map((c) => [c.key, c]));
    }, []);

    const getCategory = (type: string) =>
        categoryMap.get(type as any) || DEFAULT_CATEGORY_STYLE;

    // Calendar navigation & math
    const prevMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        );
    const nextMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        );
    const goToToday = () => setCurrentDate(new Date());

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
    ).getDate();
    const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
    ).getDay();
    const startingOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
    const totalCells = Math.ceil((daysInMonth + startingOffset) / 7) * 7;

    const completedEvents = kegiatans.filter((k) => k.is_completed).length;
    const progressPercentage =
        kegiatans.length === 0
            ? 0
            : Math.round((completedEvents / kegiatans.length) * 100);

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: KalenderEvent) => {
        setEditingId(item.id);
        setData({
            title: item.title || '',
            description: item.description || '',
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            type: item.type || 'KBM',
            location: item.location || '',
            is_completed: !!item.is_completed,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        };

        if (editingId) {
            put(`/kurikulum/kalender/${editingId}`, options);
        } else {
            post('/kurikulum/kalender', options);
        }
    };

    const handleDelete = () => {
        if (
            editingId &&
            confirm('Apakah Anda yakin ingin menghapus agenda akademik ini?')
        ) {
            router.delete(`/kurikulum/kalender/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <DashboardLayout title="Kalender Akademik">
            <div className="font-sans text-slate-800">
                {/* Header Banner Berwarna */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold tracking-tight text-white">
                                        Kalender Akademik
                                    </h1>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-200">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"></span>
                                        {currentDate.getMonth() >= 6
                                            ? 'Semester Ganjil Aktif'
                                            : 'Semester Genap Aktif'}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Jadwal pembelajaran, asesmen, dan agenda
                                    kurikulum asrama
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-md">
                                <select className="cursor-pointer rounded-lg bg-transparent text-xs font-bold text-white focus:outline-hidden">
                                    <option className="text-gray-900">
                                        T.A. 2026/2027 (Aktif)
                                    </option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-900 shadow-xs transition hover:bg-blue-50 active:scale-[0.98]"
                            >
                                <Download className="h-4 w-4" />
                                Unduh PDF
                            </button>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah Agenda
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Controls & Category Filters */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-1 sm:justify-start">
                                <button
                                    onClick={prevMonth}
                                    className="rounded px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100"
                                    title="Bulan Sebelumnya"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={goToToday}
                                    className="px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Hari Ini
                                </button>
                                <button
                                    onClick={nextMonth}
                                    className="rounded px-2 py-1 text-slate-600 transition-colors hover:bg-slate-100"
                                    title="Bulan Berikutnya"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {currentDate.toLocaleDateString('id-ID', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </h2>
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    Tahun Akademik{' '}
                                    {currentDate.getMonth() >= 6
                                        ? currentDate.getFullYear()
                                        : currentDate.getFullYear() - 1}
                                    /
                                    {currentDate.getMonth() >= 6
                                        ? currentDate.getFullYear() + 1
                                        : currentDate.getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-4">
                        <span className="mr-1 text-xs font-bold tracking-wider text-slate-400">
                            KATEGORI:
                        </span>
                        <button
                            type="button"
                            onClick={() => setActiveCategory('Semua')}
                            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all hover:-translate-y-0.5 sm:text-sm ${activeCategory === 'Semua' ? 'border border-blue-600 bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                        >
                            Semua
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setActiveCategory(cat.key)}
                                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all hover:-translate-y-0.5 sm:text-sm ${activeCategory === cat.key ? 'border border-blue-600 bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                            >
                                <div
                                    className={`h-2 w-2 rounded-full ${cat.dot} ${activeCategory === cat.key ? 'border border-white/30' : ''}`}
                                />
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col items-start gap-6 xl:flex-row">
                    {/* Calendar Grid */}
                    <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                        <div
                            ref={calendarScrollRef}
                            className="custom-scrollbar overflow-x-auto pb-2"
                        >
                            <div className="min-w-[768px]">
                                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
                                    {DAYS.map((day, i) => (
                                        <div
                                            key={day}
                                            className={`py-3 text-center text-sm font-semibold ${i === 6 ? 'text-red-500' : 'text-slate-600'}`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-[1px] bg-slate-100">
                                    {Array.from({ length: totalCells }).map(
                                        (_, i) => {
                                            const date = i - startingOffset + 1;
                                            const isCurrentMonth =
                                                date > 0 && date <= daysInMonth;
                                            const isToday =
                                                isCurrentMonth &&
                                                date === new Date().getDate() &&
                                                currentDate.getMonth() ===
                                                    new Date().getMonth() &&
                                                currentDate.getFullYear() ===
                                                    new Date().getFullYear();
                                            const isSunday = i % 7 === 6;

                                            const dayEvents = kegiatans.filter(
                                                (k) => {
                                                    if (
                                                        activeCategory !==
                                                            'Semua' &&
                                                        k.type !==
                                                            activeCategory
                                                    )
                                                        return false;
                                                    const eventDate = new Date(
                                                        k.start_date,
                                                    );
                                                    return (
                                                        isCurrentMonth &&
                                                        eventDate.getDate() ===
                                                            date &&
                                                        eventDate.getMonth() ===
                                                            currentDate.getMonth() &&
                                                        eventDate.getFullYear() ===
                                                            currentDate.getFullYear()
                                                    );
                                                },
                                            );

                                            return (
                                                <div
                                                    key={i}
                                                    className="group flex min-h-[120px] flex-col bg-white p-2 transition-colors hover:bg-blue-50/30"
                                                >
                                                    <div className="mb-1 flex items-start justify-between">
                                                        {isToday ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                                                                    {date}
                                                                </span>
                                                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                                                                    Hari Ini
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span
                                                                className={`px-1 text-sm font-medium ${!isCurrentMonth ? 'text-slate-300' : isSunday ? 'text-red-500' : 'text-slate-700'} transition-colors group-hover:text-blue-600`}
                                                            >
                                                                {isCurrentMonth
                                                                    ? date
                                                                    : date <= 0
                                                                      ? new Date(
                                                                            currentDate.getFullYear(),
                                                                            currentDate.getMonth(),
                                                                            0,
                                                                        ).getDate() +
                                                                        date
                                                                      : date -
                                                                        daysInMonth}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-1 flex-1 space-y-1">
                                                        {dayEvents.map(
                                                            (event) => {
                                                                const cat =
                                                                    getCategory(
                                                                        event.type,
                                                                    );
                                                                return (
                                                                    <button
                                                                        type="button"
                                                                        key={
                                                                            event.id
                                                                        }
                                                                        onClick={() =>
                                                                            openEditModal(
                                                                                event,
                                                                            )
                                                                        }
                                                                        className={`w-full border-l-2 text-left ${cat.border} ${cat.bg} px-2 py-1 text-xs font-medium ${cat.color} cursor-pointer truncate rounded-r-md ${cat.hover} block transition-colors`}
                                                                        title={`${event.title} (${cat.name})`}
                                                                    >
                                                                        {
                                                                            event.title
                                                                        }
                                                                    </button>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Panels */}
                    <div className="flex w-full shrink-0 flex-col gap-6 xl:w-80">
                        {/* Ringkasan Agenda Akademik */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="leading-tight font-bold text-slate-800">
                                    Ringkasan Agenda
                                    <br />
                                    Akademik
                                </h3>
                                <BarChart2
                                    className="text-blue-600"
                                    size={20}
                                />
                            </div>

                            <div className="mb-5 grid grid-cols-3 gap-2 text-center">
                                {CATEGORIES.map((cat) => {
                                    const count = kegiatans.filter(
                                        (k) => k.type === cat.key,
                                    ).length;
                                    return (
                                        <div
                                            key={cat.key}
                                            className={`rounded-lg ${cat.bg} border border-slate-100 py-2 transition-colors ${cat.hover} cursor-default`}
                                        >
                                            <div
                                                className={`text-xl font-bold ${cat.color}`}
                                            >
                                                {count}
                                            </div>
                                            <div className="truncate px-1 text-[10px] font-semibold text-slate-500 uppercase">
                                                {cat.key}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div>
                                <div className="mb-1.5 flex justify-between text-xs font-bold">
                                    <span className="text-slate-600">
                                        Realisasi Agenda
                                    </span>
                                    <span className="text-blue-600">
                                        {progressPercentage}% Terlaksana
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${progressPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Agenda Mendatang */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">
                                    Agenda Mendatang
                                </h3>
                                <span className="text-xs font-semibold text-slate-400">
                                    {kegiatans.length} Agenda
                                </span>
                            </div>
                            <div className="custom-scrollbar max-h-[350px] space-y-3 overflow-y-auto pr-1">
                                {kegiatans.length > 0 ? (
                                    kegiatans.slice(0, 6).map((evt) => {
                                        const cat = getCategory(evt.type);
                                        const evtDate = new Date(
                                            evt.start_date,
                                        );
                                        const monthStr = evtDate
                                            .toLocaleDateString('id-ID', {
                                                month: 'short',
                                            })
                                            .toUpperCase();
                                        const dayStr = evtDate
                                            .getDate()
                                            .toString();

                                        return (
                                            <div
                                                key={evt.id}
                                                onClick={() =>
                                                    openEditModal(evt)
                                                }
                                                className="group flex cursor-pointer gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                                            >
                                                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                                    <span className="text-[10px] font-bold uppercase">
                                                        {monthStr}
                                                    </span>
                                                    <span className="text-lg leading-none font-bold">
                                                        {dayStr}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex items-start justify-between gap-1">
                                                        <h4 className="truncate text-sm leading-tight font-bold text-slate-800">
                                                            {evt.title}
                                                        </h4>
                                                        <span
                                                            className={`rounded px-1.5 py-0.5 text-[8px] font-bold tracking-wider whitespace-nowrap uppercase ${cat.color} ${cat.bg}`}
                                                        >
                                                            {evt.type}
                                                        </span>
                                                    </div>
                                                    <p className="mb-1 truncate text-xs text-slate-500">
                                                        {evt.description || '-'}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                                        <MapPin
                                                            size={10}
                                                            className="shrink-0"
                                                        />
                                                        <span className="truncate">
                                                            {evt.location ||
                                                                'Kampus / Asrama'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-6 text-center text-sm text-slate-500">
                                        Belum ada agenda akademik terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panduan Kategori Warna */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                            <h3 className="mb-4 leading-tight font-bold text-slate-800">
                                Panduan Kategori Warna
                                <br />
                                Akademik
                            </h3>
                            <div className="mb-4 grid grid-cols-2 gap-x-2 gap-y-3 text-xs font-medium text-slate-600">
                                {CATEGORIES.map((cat) => (
                                    <div
                                        key={cat.key}
                                        className="flex items-center gap-2 transition-colors hover:text-slate-900"
                                    >
                                        <div
                                            className={`h-3 w-3 rounded-full ${cat.dot} shrink-0 shadow-sm`}
                                        />
                                        <span className="truncate">
                                            {cat.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
                                <Info
                                    size={14}
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />
                                <p>
                                    Seluruh agenda perkuliahan dan kurikulum
                                    tersinkronisasi otomatis dengan jadwal
                                    santri.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah / Edit Agenda */}
            {isModalOpen && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
                    <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                            <div className="flex items-center gap-2.5">
                                <CalendarCheck
                                    size={18}
                                    className="text-blue-600"
                                />
                                <h3 className="font-extrabold text-slate-800">
                                    {editingId
                                        ? 'Edit Agenda Akademik'
                                        : 'Tambah Agenda Akademik'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="custom-scrollbar overflow-y-auto p-6">
                            <form
                                id="agendaForm"
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Judul Agenda{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Contoh: UTS Semester Ganjil, Libur Ramadhan"
                                        required
                                    />
                                    {errors.title && (
                                        <span className="mt-1 block text-xs text-red-500">
                                            {errors.title}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Tanggal Mulai{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    'start_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            required
                                        />
                                        {errors.start_date && (
                                            <span className="mt-1 block text-xs text-red-500">
                                                {errors.start_date}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Tanggal Selesai
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    'end_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Kategori Akademik{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) =>
                                                setData('type', e.target.value)
                                            }
                                            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            required
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option
                                                    key={cat.key}
                                                    value={cat.key}
                                                >
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                            Lokasi / Ruang
                                        </label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) =>
                                                setData(
                                                    'location',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="Gedung A, Ruang Kelas, dll"
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="agenda_completed"
                                        checked={data.is_completed}
                                        onChange={(e) =>
                                            setData(
                                                'is_completed',
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="agenda_completed"
                                        className="cursor-pointer text-sm font-bold text-slate-700"
                                    >
                                        Sudah Terlaksana
                                    </label>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">
                                        Deskripsi / Keterangan
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="h-24 w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Keterangan singkat agenda akademik..."
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <div>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                        <span className="hidden sm:inline">
                                            Hapus
                                        </span>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    form="agendaForm"
                                    disabled={processing}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
