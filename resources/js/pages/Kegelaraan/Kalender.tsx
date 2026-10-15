import React, { useState, useRef } from 'react';
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
    Trash2
} from 'lucide-react';

export default function Kalender({ kegiatans = [] }: { kegiatans?: any[] }) {
    const calendarScrollRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeCategory, setActiveCategory] = useState('Semua');
    
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        type: 'Khusus',
        location: '',
        is_completed: false
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (kegiatan: any) => {
        setEditingId(kegiatan.id);
        setData({
            title: kegiatan.title || '',
            description: kegiatan.description || '',
            start_date: kegiatan.start_date || '',
            end_date: kegiatan.end_date || '',
            type: kegiatan.type || 'Khusus',
            location: kegiatan.location || '',
            is_completed: !!kegiatan.is_completed
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/kegelaraan/kalender/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post('/kegelaraan/kalender', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = () => {
        if (editingId && confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
            router.delete(`/kegelaraan/kalender/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    
    const categories = [
        { name: 'Semua' },
        { name: 'Program Mingguan', dot: 'bg-blue-600' },
        { name: 'Program Bulanan', dot: 'bg-emerald-500' },
        { name: 'Program Tahunan', dot: 'bg-purple-500' },
        { name: 'PHBN', dot: 'bg-red-500' },
        { name: 'PHBI', dot: 'bg-amber-700' },
        { name: 'Khusus', dot: 'bg-slate-600' },
    ];

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const startingOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
    const totalCells = Math.ceil((daysInMonth + startingOffset) / 7) * 7;

    const completedEvents = kegiatans.filter(k => k.is_completed).length;
    const progressPercentage = kegiatans.length === 0 ? 0 : Math.round((completedEvents / kegiatans.length) * 100);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Mingguan': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500', hover: 'hover:bg-blue-100' };
            case 'Bulanan': return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-500', hover: 'hover:bg-emerald-100' };
            case 'Tahunan': return { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-500', hover: 'hover:bg-purple-100' };
            case 'PHBN': return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-500', hover: 'hover:bg-red-100' };
            case 'PHBI': return { color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-700', hover: 'hover:bg-amber-100' };
            default: return { color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-400', hover: 'hover:bg-slate-200' };
        }
    };

    const getShortMonth = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
    };

    const dbEvents = kegiatans.map((k: any) => ({
        id: k.id,
        raw: k,
        date: new Date(k.start_date).getDate().toString(),
        month: getShortMonth(k.start_date),
        title: k.title,
        type: k.type,
        typeColor: `${getTypeColor(k.type).color} ${getTypeColor(k.type).bg}`,
        desc: k.description || '-',
        loc: k.location || '-'
    }));

    return (
        <DashboardLayout title="Kalender Kegelaraan">
            <div className="font-sans text-slate-800">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Kalender Kegelaraan</h1>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 border border-emerald-100 transition-all hover:bg-emerald-100">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            {currentDate.getMonth() >= 6 ? 'Semester Ganjil Aktif' : 'Semester Genap Aktif'}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <select className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors cursor-pointer">
                            <option>T.A. 2026/2027 (Aktif)</option>
                        </select>
                        <button className="flex flex-1 md:flex-none justify-center items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
                            <Download size={16} />
                            Unduh PDF
                        </button>
                        <button onClick={openCreateModal} className="flex flex-1 md:flex-none justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm">
                            <Plus size={16} />
                            Tambah Kegiatan
                        </button>
                    </div>
                </div>

                {/* Calendar Controls */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                            <div className="flex items-center justify-between sm:justify-start rounded-lg border border-slate-200 p-1">
                                <button onClick={prevMonth} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"><ChevronLeft size={18} /></button>
                                <button onClick={goToToday} className="px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Hari Ini</button>
                                <button onClick={nextMonth} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors"><ChevronRight size={18} /></button>
                            </div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </h2>
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                                    Periode {currentDate.getMonth() >= 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1}/{currentDate.getMonth() >= 6 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}
                                </span>
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-4">
                        <span className="text-xs font-bold tracking-wider text-slate-400 mr-1">KATEGORI:</span>
                        {categories.map((cat, i) => (
                            <button 
                                key={i} 
                                onClick={() => setActiveCategory(cat.name)}
                                className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-medium transition-all hover:-translate-y-0.5 ${activeCategory === cat.name ? 'bg-blue-600 text-white shadow-sm border border-blue-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                            >
                                {cat.dot && <div className={`h-2 w-2 rounded-full ${cat.dot} ${activeCategory === cat.name ? 'border border-white/30' : ''}`}></div>}
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Main Calendar Grid */}
                    <div className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div ref={calendarScrollRef} className="overflow-x-auto custom-scrollbar pb-2">
                            <div className="min-w-[768px]">
                                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
                                    {days.map((day, i) => (
                                        <div key={day} className={`py-3 text-center text-sm font-semibold ${i === 6 ? 'text-red-500' : 'text-slate-600'}`}>
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 bg-slate-100 gap-[1px]">
                                    {/* Calendar Days generation based on screenshot */}
                                    {Array.from({ length: totalCells }).map((_, i) => {
                                        const date = i - startingOffset + 1;
                                        const isCurrentMonth = date > 0 && date <= daysInMonth;
                                        const isToday = isCurrentMonth && date === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                                        const isSunday = i % 7 === 6;
                                        
                                        return (
                                            <div key={i} className={`min-h-[120px] bg-white p-2 flex flex-col group hover:bg-blue-50/30 transition-colors`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    {isToday ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                                                                {date}
                                                            </span>
                                                            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">Hari Ini</span>
                                                        </div>
                                                    ) : (
                                                        <span className={`text-sm font-medium px-1 ${!isCurrentMonth ? 'text-slate-300' : isSunday ? 'text-red-500' : 'text-slate-700'} group-hover:text-blue-600 transition-colors`}>
                                                            {isCurrentMonth ? date : (date <= 0 ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + date : date - daysInMonth)}
                                                        </span>
                                                    )}
                                                    
                                                    {/* Badges removed for dynamic DB data */}
                                                </div>

                                                <div className="flex-1 space-y-1.5 mt-1">
                                                    {/* Dynamic DB Events */}
                                                    {kegiatans.filter(k => {
                                                        if (activeCategory !== 'Semua' && `Program ${k.type}` !== activeCategory && k.type !== activeCategory) return false;
                                                        const eventDate = new Date(k.start_date);
                                                        return isCurrentMonth && eventDate.getDate() === date && eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
                                                    }).map((event: any, idx: number) => {
                                                        const style = getTypeColor(event.type);
                                                        return (
                                                            <div onClick={() => openEditModal(event)} key={idx} className={`border-l-2 ${style.border} ${style.bg} px-2 py-1 text-xs font-medium ${style.color} truncate rounded-r-md cursor-pointer ${style.hover} transition-colors`}>
                                                                {event.title}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Panels */}
                    <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
                        
                        {/* Ringkasan Program */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 leading-tight">Ringkasan Program<br/>Kegelaraan</h3>
                                <BarChart2 className="text-blue-600" size={20} />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center mb-5">
                                <div className="rounded-lg bg-blue-50 py-2 border border-blue-100 transition-colors hover:bg-blue-100 cursor-default">
                                    <div className="text-xl font-bold text-blue-600">{kegiatans.filter(k => k.type === 'Mingguan').length}</div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">Mingguan</div>
                                </div>
                                <div className="rounded-lg bg-emerald-50 py-2 border border-emerald-100 transition-colors hover:bg-emerald-100 cursor-default">
                                    <div className="text-xl font-bold text-emerald-600">{kegiatans.filter(k => k.type === 'Bulanan').length}</div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">Bulanan</div>
                                </div>
                                <div className="rounded-lg bg-purple-50 py-2 border border-purple-100 transition-colors hover:bg-purple-100 cursor-default">
                                    <div className="text-xl font-bold text-purple-600">{kegiatans.filter(k => k.type === 'Tahunan').length}</div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">Tahunan</div>
                                </div>
                                <div className="rounded-lg bg-red-50 py-2 border border-red-100 transition-colors hover:bg-red-100 cursor-default">
                                    <div className="text-xl font-bold text-red-600">{kegiatans.filter(k => k.type === 'PHBN').length}</div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">PHBN</div>
                                </div>
                                <div className="rounded-lg bg-amber-50 py-2 border border-amber-100 transition-colors hover:bg-amber-100 cursor-default">
                                    <div className="text-xl font-bold text-amber-700">{kegiatans.filter(k => k.type === 'PHBI').length}</div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">PHBI</div>
                                </div>
                                <div className="rounded-lg bg-slate-50 py-2 border border-slate-200 transition-colors hover:bg-slate-100 cursor-default">
                                    <div className="text-xl font-bold text-slate-600">{kegiatans.filter(k => k.type === 'Khusus').length}</div>
                                    <div className="text-[10px] font-semibold text-slate-500 uppercase">Khusus</div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="text-slate-600">Realisasi Program Asrama</span>
                                    <span className="text-blue-600">{progressPercentage}% Terlaksana</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-blue-600 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Kegiatan Mendatang */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800">Kegiatan Mendatang</h3>
                                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">Lihat Semua</a>
                            </div>
                            <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                                {dbEvents.length > 0 ? dbEvents.map((evt: any, i: number) => (
                                    <div onClick={() => openEditModal(evt.raw)} key={i} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 hover:border-slate-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300 cursor-pointer group">
                                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <span className="text-[10px] font-bold uppercase">{evt.month}</span>
                                            <span className="text-lg font-bold leading-none">{evt.date}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-1 mb-1">
                                                <h4 className="text-sm font-bold text-slate-800 leading-tight truncate">{evt.title}</h4>
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider whitespace-nowrap ${evt.typeColor}`}>{evt.type}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1 truncate">{evt.desc}</p>
                                            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                                <MapPin size={10} className="shrink-0" /> <span className="truncate">{evt.loc}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-6 text-sm text-slate-500">
                                        Belum ada kegiatan terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panduan Warna */}
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <h3 className="font-bold text-slate-800 mb-4 leading-tight">Panduan Kategori Warna<br/>Program</h3>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs font-medium text-slate-600 mb-4">
                                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><div className="h-3 w-3 rounded-full bg-blue-600 shadow-sm"></div> Program Mingguan</div>
                                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm"></div> Program Bulanan</div>
                                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><div className="h-3 w-3 rounded-full bg-purple-500 shadow-sm"></div> Program Tahunan</div>
                                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><div className="h-3 w-3 rounded-full bg-red-500 shadow-sm"></div> PHBN</div>
                                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><div className="h-3 w-3 rounded-full bg-amber-700 shadow-sm"></div> PHBI</div>
                                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><div className="h-3 w-3 rounded-full bg-slate-600 shadow-sm"></div> Khusus</div>
                            </div>
                            <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100">
                                <Info size={14} className="mt-0.5 shrink-0 text-blue-600" />
                                <p>Seluruh kegiatan dikelompokkan ke dalam 6 kategori program resmi asrama.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal Tambah Kegiatan */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                            <h3 className="font-extrabold text-slate-800">{editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 custom-scrollbar">
                            <form id="kegiatanForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Kegiatan <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                        placeholder="Contoh: Apel Akbar"
                                        required
                                    />
                                    {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Mulai <span className="text-red-500">*</span></label>
                                        <input 
                                            type="date" 
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            required
                                        />
                                        {errors.start_date && <span className="text-red-500 text-xs mt-1 block">{errors.start_date}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Selesai</label>
                                        <input 
                                            type="date" 
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Program <span className="text-red-500">*</span></label>
                                        <select 
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors appearance-none bg-slate-50"
                                            required
                                        >
                                            <option value="Mingguan">Program Mingguan</option>
                                            <option value="Bulanan">Program Bulanan</option>
                                            <option value="Tahunan">Program Tahunan</option>
                                            <option value="PHBN">PHBN</option>
                                            <option value="PHBI">PHBI</option>
                                            <option value="Khusus">Khusus</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Lokasi</label>
                                        <input 
                                            type="text" 
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                            placeholder="Aula, Lapangan, dll"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_completed"
                                        checked={data.is_completed}
                                        onChange={e => setData('is_completed', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="is_completed" className="text-sm font-bold text-slate-700 cursor-pointer">
                                        Sudah Terlaksana
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi</label>
                                    <textarea 
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none h-24"
                                        placeholder="Keterangan singkat kegiatan..."
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <div>
                                {editingId && (
                                    <button type="button" onClick={handleDelete} className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors">
                                        <Trash2 size={16} />
                                        <span className="hidden sm:inline">Hapus</span>
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                                    Batal
                                </button>
                                <button type="submit" form="kegiatanForm" disabled={processing} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50">
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
