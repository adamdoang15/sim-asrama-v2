import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Download, Search, LayoutList, LayoutGrid, ClipboardList } from 'lucide-react';
import { KegiatanItem } from '@/components/rekap/types';
import PaginationBar from '@/components/rekap/PaginationBar';
import EditLaporanModal from '@/components/rekap/EditLaporanModal';
import RekapListView from '@/components/rekap/RekapListView';
import RekapGridView from '@/components/rekap/RekapGridView';

export default function RekapProgram({ kegiatans = [] }: { kegiatans?: any[] }) {
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
            case 'Mingguan': catBadgeClass = 'bg-blue-100 text-blue-700'; dotColor = 'bg-blue-600'; break;
            case 'Bulanan': catBadgeClass = 'bg-emerald-100 text-emerald-700'; dotColor = 'bg-emerald-500'; break;
            case 'Tahunan': catBadgeClass = 'bg-purple-100 text-purple-700'; dotColor = 'bg-purple-500'; break;
            case 'PHBN': catBadgeClass = 'bg-amber-100 text-amber-700'; dotColor = 'bg-amber-500'; break;
            case 'PHBI': catBadgeClass = 'bg-teal-100 text-teal-700'; dotColor = 'bg-teal-500'; break;
            case 'Khusus': catBadgeClass = 'bg-[#a5f3fc] text-[#0e7490]'; dotColor = 'bg-cyan-500'; break;
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
            date: dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
            time: '00:00 WIB',
            location: k.location || '-',
            participants: 'Sesuai Program',
            participantSub: '-',
            evaluation: k.description || 'Tidak ada deskripsi.',
            photos: k.photo_path ? 1 : 0,
            tabGroup: k.type,
            existing_photo_path: k.photo_path,
            period: m >= 7 ? `T.A. ${y}/${y + 1} Ganjil` : `T.A. ${y - 1}/${y} Genap`,
            monthStr: dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            timestamp: dateObj.getTime(),
        };
    });

    const periodOptions = Array.from(new Set(kegiatanList.map((k) => k.period))).sort().reverse();
    const monthOptionsMap = new Map<string, number>();
    kegiatanList.forEach((k) => {
        if (!monthOptionsMap.has(k.monthStr)) {
            monthOptionsMap.set(k.monthStr, k.timestamp);
        }
    });
    const monthOptions = Array.from(monthOptionsMap.keys()).sort((a, b) => monthOptionsMap.get(b)! - monthOptionsMap.get(a)!);

    const tabs = [
        { name: 'Semua Kategori', count: kegiatanList.length > 0 ? kegiatanList.length : null },
        { name: 'Mingguan', count: kegiatanList.filter((k) => k.tabGroup === 'Mingguan').length },
        { name: 'Bulanan', count: kegiatanList.filter((k) => k.tabGroup === 'Bulanan').length },
        { name: 'Tahunan', count: kegiatanList.filter((k) => k.tabGroup === 'Tahunan').length },
        { name: 'PHBN', count: kegiatanList.filter((k) => k.tabGroup === 'PHBN').length },
        { name: 'PHBI', count: kegiatanList.filter((k) => k.tabGroup === 'PHBI').length },
        { name: 'Khusus', count: kegiatanList.filter((k) => k.tabGroup === 'Khusus').length },
    ];

    const filteredKegiatan = kegiatanList.filter((item) => {
        const matchesTab = activeTab === 'Semua Kategori' || item.tabGroup === activeTab;
        const matchesSearch =
            searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.evaluation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPeriod = filterPeriod === 'Semua Periode' || item.period === filterPeriod;
        const matchesMonth = filterMonth === 'Semua Bulan' || item.monthStr === filterMonth;

        return matchesTab && matchesSearch && matchesPeriod && matchesMonth;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, filterPeriod, filterMonth]);

    const totalItems = filteredKegiatan.length;
    const paginatedKegiatan = filteredKegiatan.slice((currentPage - 1) * perPage, currentPage * perPage);

    return (
        <DashboardLayout title="Rekap Kegiatan Asrama">
            <div className="font-sans text-slate-800 pb-12 max-w-[1400px] mx-auto">
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
                                <p className="text-xs text-slate-200 sm:text-sm mt-0.5">
                                    Arsip pelaporan dan rekapitulasi keterlaksanaan kegiatan santri asrama
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
                <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-6 bg-white p-2 rounded-2xl shadow-xs border border-slate-200/80">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            type="text"
                            placeholder="Cari nama kegiatan, tempat, keterangan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl bg-slate-50/70 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200/60 outline-none transition-colors cursor-pointer w-full sm:w-auto focus:border-blue-400 focus:bg-white"
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
                            className="px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200/60 outline-none transition-colors cursor-pointer w-full sm:w-auto focus:border-blue-400 focus:bg-white"
                        >
                            <option value="Semua Bulan">Semua Bulan</option>
                            {monthOptions.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-0.5 hidden sm:block"></div>
                    </div>
                </div>

                {/* Category Tabs & View Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                        isActive
                                            ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                                    }`}
                                >
                                    <span>{tab.name}</span>
                                    {tab.count !== null && (
                                        <span
                                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
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

                    <div className="flex items-center gap-1 shrink-0 self-end md:self-auto bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-white shadow-xs text-blue-600'
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                            title="Tampilan Tabel"
                        >
                            <LayoutList size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-white shadow-xs text-blue-600'
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
                    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden flex flex-col mb-6">
                        <RekapListView items={paginatedKegiatan} onEdit={setEditingItem} />
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
                        <RekapGridView items={paginatedKegiatan} onEdit={setEditingItem} />
                        <PaginationBar
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalItems={totalItems}
                            perPage={perPage}
                            setPerPage={setPerPage}
                            className="rounded-2xl border border-slate-200/80 mb-6"
                        />
                    </>
                )}

                {/* Modal Edit Laporan */}
                {editingItem && (
                    <EditLaporanModal
                        item={editingItem}
                        rawKegiatan={kegiatans.find((k) => k.id === editingItem.id)}
                        onClose={() => setEditingItem(null)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
