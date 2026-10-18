import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Download,
    Search,
    LayoutList,
    LayoutGrid,
    ClipboardList,
} from 'lucide-react';
import { KegiatanItem } from '@/components/rekap/types';
import PaginationBar from '@/components/rekap/PaginationBar';
import EditLaporanModal from '@/components/rekap/EditLaporanModal';
import RekapListView from '@/components/rekap/RekapListView';
import RekapGridView from '@/components/rekap/RekapGridView';

export default function RekapProgram({
    kegiatans = [],
}: {
    kegiatans?: any[];
}) {
    const [activeTab, setActiveTab] = useState('Semua Kategori');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('Semua Periode');
    const [filterMonth, setFilterMonth] = useState('Semua Bulan');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [editingItem, setEditingItem] = useState<KegiatanItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const kegiatanList: KegiatanItem[] = kegiatans.map((k: any) => {
        let catBadgeClass = 'bg-slate-100 text-slate-700';
        let dotColor = 'bg-slate-500';
        switch (k.type) {
            case 'Mingguan':
                catBadgeClass = 'bg-blue-100 text-blue-700';
                dotColor = 'bg-blue-600';
                break;
            case 'Bulanan':
                catBadgeClass = 'bg-emerald-100 text-emerald-700';
                dotColor = 'bg-emerald-500';
                break;
            case 'Tahunan':
                catBadgeClass = 'bg-purple-100 text-purple-700';
                dotColor = 'bg-purple-500';
                break;
            case 'PHBN':
                catBadgeClass = 'bg-amber-100 text-amber-700';
                dotColor = 'bg-amber-500';
                break;
            case 'PHBI':
                catBadgeClass = 'bg-teal-100 text-teal-700';
                dotColor = 'bg-teal-500';
                break;
            case 'Khusus':
                catBadgeClass = 'bg-[#a5f3fc] text-[#0e7490]';
                dotColor = 'bg-cyan-500';
                break;
        }

        const dateObj = new Date(k.start_date);
        const m = dateObj.getMonth() + 1;
        const y = dateObj.getFullYear();

        return {
            id: k.id,
            category: k.type,
            catLines: k.type.split(' '),
            catBadgeClass,
            dotColor,
            title: k.title,
            ref: `ACT-${y}-${String(m).padStart(2, '0')}${String(dateObj.getDate()).padStart(2, '0')}`,
            date: dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            time: '00:00 WIB',
            location: k.location || '-',
            participants: 'Sesuai Program',
            participantSub: '-',
            evaluation: k.description || 'Tidak ada deskripsi.',
            photos: k.photo_path ? 1 : 0,
            tabGroup: k.type,
            existing_photo_path: k.photo_path,
            period:
                m >= 7
                    ? `T.A. ${y}/${y + 1} Ganjil`
                    : `T.A. ${y - 1}/${y} Genap`,
            monthStr: dateObj.toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
            }),
            timestamp: dateObj.getTime(),
        };
    });

    const periodOptions = Array.from(new Set(kegiatanList.map((k) => k.period)))
        .sort()
        .reverse();
    const monthOptionsMap = new Map<string, number>();
    kegiatanList.forEach((k) => {
        if (!monthOptionsMap.has(k.monthStr)) {
            monthOptionsMap.set(k.monthStr, k.timestamp);
        }
    });
    const monthOptions = Array.from(monthOptionsMap.keys()).sort(
        (a, b) => monthOptionsMap.get(b)! - monthOptionsMap.get(a)!,
    );

    const tabs = [
        {
            name: 'Semua Kategori',
            count: kegiatanList.length > 0 ? kegiatanList.length : null,
        },
        {
            name: 'Mingguan',
            count: kegiatanList.filter((k) => k.tabGroup === 'Mingguan').length,
        },
        {
            name: 'Bulanan',
            count: kegiatanList.filter((k) => k.tabGroup === 'Bulanan').length,
        },
        {
            name: 'Tahunan',
            count: kegiatanList.filter((k) => k.tabGroup === 'Tahunan').length,
        },
        {
            name: 'PHBN',
            count: kegiatanList.filter((k) => k.tabGroup === 'PHBN').length,
        },
        {
            name: 'PHBI',
            count: kegiatanList.filter((k) => k.tabGroup === 'PHBI').length,
        },
        {
            name: 'Khusus',
            count: kegiatanList.filter((k) => k.tabGroup === 'Khusus').length,
        },
    ];

    const filteredKegiatan = kegiatanList.filter((item) => {
        const matchesTab =
            activeTab === 'Semua Kategori' || item.tabGroup === activeTab;
        const matchesSearch =
            searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.evaluation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPeriod =
            filterPeriod === 'Semua Periode' || item.period === filterPeriod;
        const matchesMonth =
            filterMonth === 'Semua Bulan' || item.monthStr === filterMonth;

        return matchesTab && matchesSearch && matchesPeriod && matchesMonth;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, filterPeriod, filterMonth]);

    const totalItems = filteredKegiatan.length;
    const paginatedKegiatan = filteredKegiatan.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage,
    );

    return (
        <DashboardLayout title="Rekap Kegiatan Asrama">
            <div className="mx-auto max-w-[1400px] pb-12 font-sans text-slate-800">
                {/* Header Banner Berwarna */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <ClipboardList className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Rekap Kegiatan Asrama
                                </h1>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Arsip pelaporan dan rekapitulasi
                                    keterlaksanaan kegiatan santri asrama
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-900 shadow-xs transition hover:bg-blue-50 active:scale-[0.98]"
                            >
                                <Download className="h-4 w-4" />
                                <span>Ekspor Rekap Laporan</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="mb-6 flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs sm:flex-row">
                    <div className="relative w-full flex-1">
                        <Search
                            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Cari nama kegiatan, tempat, keterangan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-transparent bg-slate-50/70 py-2.5 pr-4 pl-10 text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none"
                        />
                    </div>
                    <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition-colors outline-none hover:bg-slate-100 focus:border-blue-400 focus:bg-white sm:w-auto"
                        >
                            <option value="Semua Periode">Semua Periode</option>
                            {periodOptions.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition-colors outline-none hover:bg-slate-100 focus:border-blue-400 focus:bg-white sm:w-auto"
                        >
                            <option value="Semua Bulan">Semua Bulan</option>
                            {monthOptions.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        <div className="ml-0.5 hidden h-2 w-2 shrink-0 rounded-full bg-emerald-500 sm:block"></div>
                    </div>
                </div>

                {/* Category Tabs & View Switcher */}
                <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                                        isActive
                                            ? 'border border-slate-200/80 bg-white text-blue-600 shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                                    }`}
                                >
                                    <span>{tab.name}</span>
                                    {tab.count !== null && (
                                        <span
                                            className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                                                isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-slate-200/70 text-slate-600'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex shrink-0 items-center gap-1 self-end rounded-xl border border-slate-200/60 bg-slate-100/70 p-1 md:self-auto">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`rounded-lg p-1.5 transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Tampilan Tabel"
                        >
                            <LayoutList size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`rounded-lg p-1.5 transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-white text-blue-600 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Tampilan Grid"
                        >
                            <LayoutGrid size={14} />
                        </button>
                    </div>
                </div>

                {/* Table or Grid View */}
                {viewMode === 'list' ? (
                    <div className="mb-6 flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                        <RekapListView
                            items={paginatedKegiatan}
                            onEdit={setEditingItem}
                        />
                        <PaginationBar
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalItems={totalItems}
                            perPage={perPage}
                            setPerPage={setPerPage}
                            className="border-t border-slate-100"
                        />
                    </div>
                ) : (
                    <>
                        <RekapGridView
                            items={paginatedKegiatan}
                            onEdit={setEditingItem}
                        />
                        <PaginationBar
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalItems={totalItems}
                            perPage={perPage}
                            setPerPage={setPerPage}
                            className="mb-6 rounded-2xl border border-slate-200/80"
                        />
                    </>
                )}

                {/* Modal Edit Laporan */}
                {editingItem && (
                    <EditLaporanModal
                        item={editingItem}
                        rawKegiatan={kegiatans.find(
                            (k) => k.id === editingItem.id,
                        )}
                        onClose={() => setEditingItem(null)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
