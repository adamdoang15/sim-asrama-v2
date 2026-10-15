import React, { useState, useRef } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    AlertTriangle,
    Trophy,
    Download,
    RefreshCcw,
    Search,
    ChevronDown,
    Check,
    Eye,
    Printer,
    Bot,
    CheckCircle,
    Paperclip,
    X,
    Save,
    Edit,
    Trash2
} from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

export default function TrackRecord({ pelanggarans = [], prestasis = [], gelaras = [] }: { pelanggarans?: any[], prestasis?: any[], gelaras?: any[] }) {
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const handleDeletePelanggaran = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data pelanggaran ini?')) {
            router.delete(`/kegelaraan/track-record/${id}`, { preserveScroll: true });
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        id: null as number | null,
        name: '',
        nim: '',
        room: '',
        category: 'Sedang',
        type: 'info',
        descTitle: '',
        descSub: '',
        attachment: null as File | null,
        _method: 'post'
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (record: any) => {
        clearErrors();
        setData({
            id: record.id,
            name: record.name,
            nim: record.nim || '',
            room: record.room || '',
            category: record.category || 'Sedang',
            type: record.type || 'info',
            descTitle: record.descTitle || '',
            descSub: record.descSub || '',
            attachment: null,
            _method: 'put'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        };
        
        if (data.id) {
            post('/kegelaraan/track-record/' + data.id, options);
        } else {
            post('/kegelaraan/track-record', options);
        }
    };

    const [isPrestasiModalOpen, setIsPrestasiModalOpen] = useState(false);
    const { data: prestasiData, setData: setPrestasiData, post: postPrestasi, put: putPrestasi, processing: processingPrestasi, errors: errorsPrestasi, reset: resetPrestasi, clearErrors: clearErrorsPrestasi } = useForm({
        id: null as number | null,
        name: '',
        nim: '',
        title: '',
        level: '',
        attachment: null as File | null,
        _method: 'post'
    });

    const openPrestasiModal = () => {
        resetPrestasi();
        clearErrorsPrestasi();
        setIsPrestasiModalOpen(true);
    };

    const openEditPrestasiModal = (record: any) => {
        clearErrorsPrestasi();
        setPrestasiData({
            id: record.id,
            name: record.name,
            nim: record.nim || '',
            title: record.title || '',
            level: record.level || '',
            attachment: null,
            _method: 'put'
        });
        setIsPrestasiModalOpen(true);
    };

    const handlePrestasiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsPrestasiModalOpen(false);
                resetPrestasi();
            }
        };

        if (prestasiData.id) {
            postPrestasi('/kegelaraan/prestasi/' + prestasiData.id, options);
        } else {
            postPrestasi('/kegelaraan/prestasi', options);
        }
    };

    const handleDeletePrestasi = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) {
            router.delete(`/kegelaraan/prestasi/${id}`, { preserveScroll: true });
        }
    };

    const [activeTab, setActiveTab] = useState('Daftar Rekam Jejak Pelanggaran');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const filteredPelanggarans = pelanggarans.filter((p: any) => {
        const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.nim || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.descTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === '' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const filteredPrestasis = prestasis.filter((p: any) => {
        const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.nim || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const pelanggaranSedang = pelanggarans.filter((p: any) => p.category === 'Sedang').length;
    const pelanggaranBerat = pelanggarans.filter((p: any) => p.category === 'Berat').length;
    const pelanggaranSangatBerat = pelanggarans.filter((p: any) => p.category === 'Sangat Berat').length;
    const totalPrestasi = prestasis.length;

    return (
        <DashboardLayout title="Track Record">
            <div className="font-sans text-slate-800 pb-10 max-w-[1400px] mx-auto">
                {/* Header Area */}
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
                            Track Record Kedisiplinan &<br />Prestasi Gelara
                        </h1>
                        <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
                            Rekam jejak, akumulasi pelanggaran tata tertib, serta prestasi Gelara asrama.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <button onClick={openCreateModal} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 hover:shadow-md hover:shadow-red-600/20 transition-all">
                            <AlertTriangle size={16} /> Catat Pelanggaran
                        </button>
                        <button onClick={openPrestasiModal} className="flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800 hover:shadow-md hover:shadow-teal-700/20 transition-all">
                            <Trophy size={16} /> Tambah Prestasi
                        </button>
                        <button className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-white transition-colors">
                            <Download size={16} /> Ekspor Rekap Laporan
                        </button>
                    </div>
                </div>

                {/* Banner Sinkronisasi */}
                <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                            <Check size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-bold text-slate-800">Integrasi Otomatis Daily Activity Aktif</h3>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">● Sinkron</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                                Pelanggaran Kategori <b>Sedang</b> terakumulasi langsung dari status <i>Alfa (A)</i> pada presensi. Pelanggaran <b>Berat, Sangat Berat,</b> dan <b>Prestasi</b> diverifikasi manual oleh bidang kegelaraan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-600 mb-3">Pelanggaran Sedang</h4>
                        <div className="text-4xl font-extrabold text-slate-800">{pelanggaranSedang}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-600 mb-3">Pelanggaran Berat</h4>
                        <div className="text-4xl font-extrabold text-slate-800">{pelanggaranBerat}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-600 mb-3">Sangat Berat</h4>
                        <div className="text-4xl font-extrabold text-red-600">{pelanggaranSangatBerat}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-600 mb-3">Total Prestasi</h4>
                        <div className="text-4xl font-extrabold text-teal-600">{totalPrestasi}</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Left Data Section */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
                        {/* Tabs & Controls Container */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-2 flex flex-col gap-4">
                            <div className="flex flex-wrap gap-1 p-2 border-b border-slate-100">
                                <button onClick={() => setActiveTab('Daftar Rekam Jejak Pelanggaran')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'Daftar Rekam Jejak Pelanggaran' ? 'bg-slate-50 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <AlertTriangle size={16} /> Daftar Rekam Jejak Pelanggaran <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'Daftar Rekam Jejak Pelanggaran' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{pelanggarans.length}</span>
                                </button>
                                <button onClick={() => setActiveTab('Rekam Jejak Prestasi')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'Rekam Jejak Prestasi' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    Rekam Jejak Prestasi <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'Rekam Jejak Prestasi' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>{prestasis.length}</span>
                                </button>
                            </div>

                            <div className="px-4 pb-2 flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari nama Gelara, NIM, catatan..." 
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-colors" 
                                    />
                                </div>
                                <select 
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 appearance-none min-w-[200px] hover:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Semua Tingkat Pelanggaran</option>
                                    <option value="Sedang">Sedang</option>
                                    <option value="Berat">Berat</option>
                                    <option value="Sangat Berat">Sangat Berat</option>
                                </select>
                                <select className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 appearance-none min-w-[140px] hover:bg-white focus:outline-none focus:border-blue-500 transition-colors">
                                    <option value="">T.A. 2026/2027</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                            <div ref={tableScrollRef} className="overflow-x-auto custom-scrollbar pb-2">
                                {activeTab === 'Daftar Rekam Jejak Pelanggaran' ? (
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-5 py-4 w-12 text-center"><input type="checkbox" className="rounded border-slate-300 text-blue-600" /></th>
                                                <th className="px-4 py-4 w-40">Tanggal & Waktu</th>
                                                <th className="px-4 py-4">Nama Gelara</th>
                                                <th className="px-4 py-4 text-center">Kategori</th>
                                                <th className="px-4 py-4">Kronologi</th>
                                                <th className="px-4 py-4">Petugas</th>
                                                <th className="px-4 py-4 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredPelanggarans.length === 0 ? (
                                                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">Tidak ada data pelanggaran ditemukan.</td></tr>
                                            ) : filteredPelanggarans.map((v: any) => (
                                                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-5 py-4 text-center"><input type="checkbox" className="rounded border-slate-300 text-blue-600" /></td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-800">{v.date}</div>
                                                        <div className="text-xs text-slate-400">{v.time}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${v.type === 'danger' ? 'bg-red-100 text-red-600' :
                                                                v.type === 'warning' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                                                                }`}>
                                                                {v.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-800">{v.name}</div>
                                                                <div className="text-xs text-slate-500">{v.nim} {v.room ? `• ${v.room}` : ''}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex justify-center">
                                                            <div className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${v.type === 'danger' ? 'bg-red-700 text-white shadow-sm' :
                                                                v.type === 'warning' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                                    'bg-blue-50 text-blue-600 border border-blue-100'
                                                                }`}>
                                                                {v.category}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-800">{v.descTitle}</div>
                                                        <div className="text-xs text-slate-400">{v.descSub}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {v.isSystem ? (
                                                            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                                                                <Bot size={14} /> {v.petugas}
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-700 font-medium text-xs">
                                                                {v.petugas}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-3 text-slate-500">
                                                            <button onClick={() => openEditModal(v)} className="hover:text-amber-500 transition-colors" title="Edit Data"><Edit size={18} /></button>
                                                            {v.attachment && (
                                                                <a href={`/storage/${v.attachment}`} target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors" title="Lihat Lampiran"><Paperclip size={18} /></a>
                                                            )}
                                                            {v.isSystem ? (
                                                                <button className="hover:text-emerald-600 transition-colors" title="Verifikasi Sistem"><CheckCircle size={18} /></button>
                                                            ) : (
                                                                <>
                                                                    <button className="hover:text-blue-600 transition-colors" title="Cetak Surat"><Printer size={18} /></button>
                                                                    <button onClick={() => handleDeletePelanggaran(v.id)} className="hover:text-red-600 transition-colors" title="Hapus Data"><Trash2 size={18} /></button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-5 py-4 w-12 text-center"><input type="checkbox" className="rounded border-slate-300 text-teal-600" /></th>
                                                <th className="px-4 py-4 w-40">Tanggal</th>
                                                <th className="px-4 py-4">Nama Gelara</th>
                                                <th className="px-4 py-4">Nama Prestasi</th>
                                                <th className="px-4 py-4">Tingkat</th>
                                                <th className="px-4 py-4 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredPrestasis.length === 0 ? (
                                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">Tidak ada data prestasi ditemukan.</td></tr>
                                            ) : filteredPrestasis.map((a: any) => (
                                                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-5 py-4 text-center"><input type="checkbox" className="rounded border-slate-300 text-teal-600" /></td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-800">{a.date}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-teal-100 text-teal-700">
                                                                {a.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-800">{a.name}</div>
                                                                <div className="text-xs text-slate-500">{a.nim}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-bold text-slate-800">{a.title}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="text-slate-700 font-medium text-xs">{a.level}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-3 text-slate-500">
                                                            <button onClick={() => openEditPrestasiModal(a)} className="hover:text-amber-500 transition-colors" title="Edit Data"><Edit size={18} /></button>
                                                            {a.attachment && (
                                                                <a href={`/storage/${a.attachment}`} target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors" title="Lihat Lampiran"><Paperclip size={18} /></a>
                                                            )}
                                                            <button className="hover:text-teal-600 transition-colors" title="Cetak Sertifikat"><Printer size={18} /></button>
                                                            <button onClick={() => handleDeletePrestasi(a.id)} className="hover:text-red-600 transition-colors" title="Hapus Data"><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {/* Pagination */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                                <div className="text-slate-500 font-medium">
                                    Menampilkan <b className="text-slate-700">{activeTab === 'Daftar Rekam Jejak Pelanggaran' ? filteredPelanggarans.length : filteredPrestasis.length}</b> dari <b className="text-slate-700">{activeTab === 'Daftar Rekam Jejak Pelanggaran' ? pelanggarans.length : prestasis.length}</b> rekam jejak
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-200 font-medium transition-colors">Sebelumnya</button>
                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-700 text-white font-bold shadow-sm">1</button>
                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors">2</button>
                                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold transition-colors">3</button>
                                    <button className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-200 font-medium transition-colors bg-white border border-slate-200">Selanjutnya</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-50 rounded-xl text-teal-600"><Trophy size={20} /></div>
                                    <h3 className="font-extrabold text-slate-800 leading-tight">Prestasi Gelara<br />Terbaru</h3>
                                </div>
                                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 leading-tight text-right">Lihat<br />Semua</a>
                            </div>

                            <div className="space-y-4">
                                {prestasis.map((a: any, i: number) => (
                                    <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">
                                                    {a.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">{a.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-1">{a.title}</div>
                                            <div className="text-[10px] font-medium text-slate-500">{a.level}</div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium">
                                            {a.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Pelanggaran */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                            <h3 className="font-extrabold text-slate-800">{data.id ? 'Edit Pelanggaran' : 'Catat Pelanggaran'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 custom-scrollbar">
                            <form id="pelanggaranForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Gelara <span className="text-red-500">*</span></label>
                                    <select
                                        value={data.name}
                                        onChange={e => {
                                            const selectedName = e.target.value;
                                            const selectedGelara = gelaras.find(g => g.name === selectedName);
                                            setData(data => ({
                                                ...data,
                                                name: selectedName,
                                                nim: selectedGelara ? selectedGelara.nig || '' : ''
                                            }));
                                        }}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors appearance-none bg-slate-50"
                                        required
                                    >
                                        <option value="">-- Pilih Gelara --</option>
                                        {gelaras.map(g => (
                                            <option key={g.id} value={g.name}>{g.name}</option>
                                        ))}
                                    </select>
                                    {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">NIG</label>
                                    <input
                                        type="text"
                                        value={data.nim}
                                        onChange={e => setData('nim', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                        placeholder="NIG"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Pelanggaran <span className="text-red-500">*</span></label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors appearance-none bg-slate-50"
                                            required
                                        >
                                            <option value="Sedang">Sedang</option>
                                            <option value="Berat">Berat</option>
                                            <option value="Sangat Berat">Sangat Berat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Peringatan <span className="text-red-500">*</span></label>
                                        <select
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors appearance-none bg-slate-50"
                                            required
                                        >
                                            <option value="info">Peringatan Biasa</option>
                                            <option value="warning">Peringatan Keras</option>
                                            <option value="danger">Tindakan Tegas</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Pelanggaran <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.descTitle}
                                        onChange={e => setData('descTitle', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                        placeholder="Ringkasan Kasus"
                                        required
                                    />
                                    {errors.descTitle && <span className="text-red-500 text-xs mt-1 block">{errors.descTitle}</span>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Kronologi / Deskripsi</label>
                                    <textarea
                                        value={data.descSub}
                                        onChange={e => setData('descSub', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none h-24"
                                        placeholder="Keterangan lengkap kronologi..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Lampiran (PDF, Maks 2MB)</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={e => setData('attachment', e.target.files ? e.target.files[0] : null)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {errors.attachment && <span className="text-red-500 text-xs mt-1 block">{errors.attachment}</span>}
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                                    Batal
                                </button>
                                <button type="submit" form="pelanggaranForm" disabled={processing} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50">
                                    <Save size={16} />
                                    {data.id ? 'Simpan Perubahan' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tambah Prestasi */}
            {isPrestasiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                            <h3 className="font-extrabold text-slate-800">{prestasiData.id ? 'Edit Prestasi' : 'Tambah Prestasi'}</h3>
                            <button onClick={() => setIsPrestasiModalOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 custom-scrollbar">
                            <form id="prestasiForm" onSubmit={handlePrestasiSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Gelara <span className="text-red-500">*</span></label>
                                    <select
                                        value={prestasiData.name}
                                        onChange={e => {
                                            const selectedName = e.target.value;
                                            const selectedGelara = gelaras.find(g => g.name === selectedName);
                                            setPrestasiData(data => ({
                                                ...data,
                                                name: selectedName,
                                                nim: selectedGelara ? selectedGelara.nig || '' : ''
                                            }));
                                        }}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors appearance-none bg-slate-50"
                                        required
                                    >
                                        <option value="">-- Pilih Gelara --</option>
                                        {gelaras.map(g => (
                                            <option key={g.id} value={g.name}>{g.name}</option>
                                        ))}
                                    </select>
                                    {errorsPrestasi.name && <span className="text-red-500 text-xs mt-1 block">{errorsPrestasi.name}</span>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">NIG</label>
                                    <input
                                        type="text"
                                        value={prestasiData.nim}
                                        onChange={e => setPrestasiData('nim', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                        placeholder="NIG"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Prestasi <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={prestasiData.title}
                                        onChange={e => setPrestasiData('title', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                        placeholder="Contoh: Juara 1 MTQ"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={prestasiData.level}
                                        onChange={e => setPrestasiData('level', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                        placeholder="Contoh: Nasional"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Lampiran (PDF, Maks 2MB)</label>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={e => setPrestasiData('attachment', e.target.files ? e.target.files[0] : null)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                    {errorsPrestasi.attachment && <span className="text-red-500 text-xs mt-1 block">{errorsPrestasi.attachment}</span>}
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setIsPrestasiModalOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                                    Batal
                                </button>
                                <button type="submit" form="prestasiForm" disabled={processingPrestasi} className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 hover:shadow-md transition-all disabled:opacity-50">
                                    <Save size={16} />
                                    {prestasiData.id ? 'Simpan Perubahan' : 'Simpan Prestasi'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
