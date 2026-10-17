import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Download,
    UserPlus,
    Search,
    ChevronDown,
    RefreshCcw,
    Eye,
    Edit2,
    Trash2,
    Users,
    UserCheck,
    Contact,
    Briefcase,
    X,
    Save,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { Link, usePage, useForm, router } from '@inertiajs/react';

export default function DataPegawai({ employees, stats, jabatans, filters }: { employees: any, stats: any, jabatans?: any[], filters?: any }) {
    const { url } = usePage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [detailModalPegawai, setDetailModalPegawai] = useState<any | null>(null);

    const [search, setSearch] = useState(filters?.search || '');
    const [jabatan, setJabatan] = useState(filters?.jabatan || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [gender, setGender] = useState(filters?.gender || 'Semua');

    useEffect(() => {
        const timeout = setTimeout(() => {
            const query: any = {};
            if (search) query.search = search;
            if (jabatan) query.jabatan = jabatan;
            if (status) query.status = status;
            if (gender !== 'Semua') query.gender = gender;

            router.get('/kesekretariatan/data-pegawai', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, jabatan, status, gender]);

    const handleReset = () => {
        setSearch('');
        setJabatan('');
        setStatus('');
        setGender('Semua');
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        niy: '',
        jenis_kelamin: 'Laki-laki',
        ttl: '',
        status_pegawai: 'Pegawai Tetap Yayasan',
        jabatan: '',
        tahun_masuk: '',
        foto: null as any,
        hapus_foto: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = editingId
            ? `/kesekretariatan/data-pegawai/${editingId}/update`
            : '/kesekretariatan/data-pegawai';

        post(endpoint, {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                setEditingId(null);
            }
        });
    };

    const handleDelete = (pegawai: any) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data pegawai "${pegawai.name}"? Data yang dihapus tidak dapat dikembalikan.`)) {
            router.delete(`/kesekretariatan/data-pegawai/${pegawai.id}`, {
                preserveScroll: true,
            });
        }
    };

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setData('hapus_foto', false);
        setIsModalOpen(true);
    };

    const openEditModal = (pegawai: any) => {
        clearErrors();
        setEditingId(pegawai.id);
        setData({
            name: pegawai.name || '',
            niy: pegawai.niy || '',
            jenis_kelamin: pegawai.jenis_kelamin || 'Laki-laki',
            ttl: pegawai.ttl || '',
            status_pegawai: pegawai.status_pegawai || 'Pegawai Tetap Yayasan',
            jabatan: pegawai.jabatan || '',
            tahun_masuk: pegawai.tahun_masuk || '',
            foto: null as any,
            hapus_foto: false
        });
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout title="Data Pegawai">
            <div className="font-sans text-slate-800 pb-10 max-w-[1400px] mx-auto">
                {/* Header Banner Berwarna */}
                <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Data Pegawai & Staf
                                </h1>
                                <p className="text-xs text-slate-200 sm:text-sm mt-0.5">
                                    Pengelolaan data induk pendidik dan staf kependidikan Asrama
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
                                <span>Ekspor Data Pegawai</span>
                            </button>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>Tambah Pegawai Baru</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs flex items-start justify-between">
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Pegawai Aktif</h4>
                            <div className="flex items-baseline gap-2">
                                <div className="text-4xl font-extrabold text-blue-700">{stats?.total || 0}</div>
                                <div className="text-sm font-bold text-slate-500">Orang</div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distribusi Gender</h4>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-3">
                            <div className="text-3xl font-extrabold text-slate-800">{stats?.laki || 0}</div>
                            <div className="text-sm font-bold text-slate-500">L</div>
                            <div className="text-xl font-bold text-slate-300 mx-1">/</div>
                            <div className="text-3xl font-extrabold text-slate-800">{stats?.perempuan || 0}</div>
                            <div className="text-sm font-bold text-slate-500">P</div>
                        </div>
                        <div className="w-full flex h-1.5 rounded-full overflow-hidden mb-1.5">
                            <div className="bg-blue-500" style={{ width: `${stats?.total ? (stats.laki / stats.total) * 100 : 0}%` }}></div>
                            <div className="bg-amber-400" style={{ width: `${stats?.total ? (stats.perempuan / stats.total) * 100 : 0}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                            <span>Laki-laki {stats?.total ? ((stats.laki / stats.total) * 100).toFixed(1) : 0}%</span>
                            <span>Perempuan {stats?.total ? ((stats.perempuan / stats.total) * 100).toFixed(1) : 0}%</span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs flex items-start justify-between">
                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status Kepegawaian</h4>
                            <div className="text-2xl font-extrabold text-slate-800 mb-2">{stats?.tetap || 0} Tetap Yayasan</div>
                            <div className="text-xs font-medium text-slate-500">{stats?.kontrak || 0} Kontrak Kerja</div>
                        </div>
                    </div>
                </div>


                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 mb-6 p-3 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Cari berdasarkan NIY, Nama Pegawai..." className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select value={jabatan} onChange={e => setJabatan(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 appearance-none outline-none focus:ring-1 focus:ring-blue-500 min-w-[180px]">
                            <option value="">Semua Jabatan / Bidang</option>
                            {jabatans?.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600 appearance-none outline-none focus:ring-1 focus:ring-blue-500 min-w-[140px]">
                            <option value="">Semua Status</option>
                            <option value="Pegawai Tetap Yayasan">Pegawai Tetap Yayasan</option>
                            <option value="Kontrak Kerja">Kontrak Kerja</option>
                        </select>
                        <button onClick={handleReset} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Reset Filter">
                            <RefreshCcw size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 md:ml-auto bg-slate-50 p-1 rounded-xl border border-slate-100 text-xs font-bold">
                        <button onClick={() => setGender('Semua')} className={`px-3 py-1.5 rounded-lg transition-colors ${gender === 'Semua' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>Semua</button>
                        <button onClick={() => setGender('Laki-laki')} className={`px-3 py-1.5 rounded-lg transition-colors ${gender === 'Laki-laki' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>Laki-laki (L)</button>
                        <button onClick={() => setGender('Perempuan')} className={`px-3 py-1.5 rounded-lg transition-colors ${gender === 'Perempuan' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>Perempuan (P)</button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm whitespace-nowrap min-w-[1000px]">
                            <thead className="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-5 py-4 w-72">Nama Pegawai</th>
                                    <th className="px-4 py-4 w-40">Nomor Induk Yayasan (NIY)</th>
                                    <th className="px-4 py-4 w-32">Jenis Kelamin</th>
                                    <th className="px-4 py-4 w-48">Tempat, Tanggal Lahir</th>
                                    <th className="px-4 py-4 min-w-[200px]">Jabatan</th>
                                    <th className="px-5 py-4 text-center">Status Berkas</th>
                                    <th className="px-5 py-4 w-28 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {employees.data?.map((emp: any) => {
                                    const isL = emp.jenis_kelamin === 'Laki-laki';
                                    const statusColor = emp.status_pegawai === 'Pegawai Tetap Yayasan' ? 'emerald' : 'amber';
                                    return (
                                        <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-5 py-5 align-top">
                                                <div className="flex items-center gap-3.5">
                                                    {emp.foto && emp.foto !== 'Belum Ada Foto' ? (
                                                        <img
                                                            src={`/storage/pegawai/${emp.foto}`}
                                                            alt={emp.name}
                                                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm mt-0.5"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_2px_10px_-3px_rgba(37,99,235,0.3)] mt-0.5 bg-blue-50/80 text-blue-600 border border-blue-100/50">
                                                            <UserCheck size={20} strokeWidth={2.5} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-extrabold text-slate-800 text-[13px] leading-tight">{emp.name}</div>
                                                        <div className="flex items-center gap-1.5 mt-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full bg-${statusColor}-500`}></div>
                                                            <div className="text-[10px] font-bold text-slate-500">{emp.status_pegawai}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top">
                                                <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-extrabold font-mono inline-block">
                                                    {emp.niy || '-'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border ${isL ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    <span className="text-lg leading-none -mt-0.5">{isL ? '♂' : '♀'}</span> {emp.jenis_kelamin}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top">
                                                <div className="text-xs font-bold text-slate-700 leading-tight">
                                                    {emp.ttl?.split(', ')[0] || ''}<br />
                                                    <span className="font-medium text-slate-500 block mt-1">{emp.ttl?.split(', ')[1] || ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 align-top whitespace-normal">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {emp.jabatan?.split(',').map((j: string) => j.trim()).filter(Boolean).map((j: string, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${j.toLowerCase().includes('wali kelas')
                                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                                                }`}
                                                        >
                                                            {j}
                                                        </span>
                                                    ))}
                                                </div>
                                                {emp.tahun_masuk && (
                                                    <div className="text-[10px] font-medium text-slate-500 mt-1.5 inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                                                        Mulai {emp.tahun_masuk}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-5 align-top text-center">
                                                <div className="flex flex-col items-center justify-start gap-2">
                                                    <div className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${emp.status_berkas === 'Berkas Lengkap' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/20' : 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-600/20'}`}>
                                                        {emp.status_berkas === 'Berkas Lengkap' ? <CheckCircle2 size={12} /> : <XCircle size={12} />} {emp.status_berkas}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{emp.foto && emp.foto !== 'Belum Ada Foto' ? 'Ada Foto' : 'Tanpa Foto'}</div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 align-top">
                                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                                    <button onClick={() => setDetailModalPegawai(emp)} className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Detail"><Eye size={16} /></button>
                                                    <button onClick={() => openEditModal(emp)} className="p-1.5 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Edit"><Edit2 size={16} /></button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(emp)}
                                                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors active:scale-95"
                                                        title="Hapus Pegawai"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                        <div className="text-slate-500 font-medium">
                            Menampilkan <b className="text-slate-700">{employees.from || 0} - {employees.to || 0}</b> dari <b className="text-slate-700">{employees.total}</b> Pegawai Terdaftar
                            <span className="mx-2">•</span>
                            Halaman {employees.current_page} dari {employees.last_page}
                        </div>
                        <div className="flex items-center gap-1">
                            <Link href={employees.first_page_url || '#'} className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${employees.current_page === 1 ? 'text-slate-300 pointer-events-none' : 'text-slate-500 hover:bg-slate-200'}`}>{'|<'}</Link>
                            {employees.links?.map((link: any, index: number) => {
                                if (index === 0 || index === employees.links.length - 1) {
                                    const isPrev = index === 0;
                                    const label = isPrev ? '<' : '>';
                                    return link.url ? (
                                        <Link key={index} href={link.url} className="w-8 h-8 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition-colors" dangerouslySetInnerHTML={{ __html: label }} />
                                    ) : (
                                        <span key={index} className="w-8 h-8 flex items-center justify-center rounded text-slate-300" dangerouslySetInnerHTML={{ __html: label }} />
                                    );
                                }
                                return link.url ? (
                                    <Link key={index} href={link.url} className={`min-w-8 h-8 px-2 flex items-center justify-center rounded transition-colors ${link.active ? 'bg-blue-700 text-white font-bold shadow-sm' : 'text-slate-600 font-bold hover:bg-slate-200'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span key={index} className="min-w-8 h-8 px-2 flex items-center justify-center rounded text-slate-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                                );
                            })}
                            <Link href={employees.last_page_url || '#'} className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${employees.current_page === employees.last_page ? 'text-slate-300 pointer-events-none' : 'text-slate-500 hover:bg-slate-200'}`}>{'>|'}</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Pegawai */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-800">{editingId ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}</h3>
                                <p className="text-xs font-medium text-slate-500">Lengkapi formulir di bawah ini untuk {editingId ? 'memperbarui' : 'menambahkan'} data pegawai.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="pegawaiForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap & Gelar <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.name ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="Contoh: Hendi Suhendi, S.Pd"
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1 font-medium">{errors.name}</div>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor Induk Yayasan (NIY)</label>
                                        <input
                                            type="text"
                                            value={data.niy}
                                            onChange={e => setData('niy', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.niy ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                            placeholder="Contoh: NIY-2026-0001"
                                        />
                                        {errors.niy && <div className="text-red-500 text-xs mt-1 font-medium">{errors.niy}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex-1 cursor-pointer">
                                                <input type="radio" name="jk" className="peer sr-only" checked={data.jenis_kelamin === 'Laki-laki'} onChange={() => setData('jenis_kelamin', 'Laki-laki')} />
                                                <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:font-bold transition-all">Laki-laki</div>
                                            </label>
                                            <label className="flex-1 cursor-pointer">
                                                <input type="radio" name="jk" className="peer sr-only" checked={data.jenis_kelamin === 'Perempuan'} onChange={() => setData('jenis_kelamin', 'Perempuan')} />
                                                <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:font-bold transition-all">Perempuan</div>
                                            </label>
                                        </div>
                                        {errors.jenis_kelamin && <div className="text-red-500 text-xs mt-1 font-medium">{errors.jenis_kelamin}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tempat, Tanggal Lahir <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.ttl}
                                        onChange={e => setData('ttl', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.ttl ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="Contoh: Sukabumi, 14 Mei 1988"
                                    />
                                    {errors.ttl && <div className="text-red-500 text-xs mt-1 font-medium">{errors.ttl}</div>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Kepegawaian <span className="text-red-500">*</span></label>
                                        <select
                                            value={data.status_pegawai}
                                            onChange={e => setData('status_pegawai', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none ${errors.status_pegawai ? 'border-red-300 bg-red-50 focus:border-red-500 text-red-700' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white text-slate-700'}`}
                                        >
                                            <option value="Pegawai Tetap Yayasan">Pegawai Tetap Yayasan</option>
                                            <option value="Kontrak Kerja">Kontrak Kerja</option>
                                        </select>
                                        {errors.status_pegawai && <div className="text-red-500 text-xs mt-1 font-medium">{errors.status_pegawai}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Jabatan / Posisi <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={data.jabatan}
                                            onChange={e => setData('jabatan', e.target.value)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.jabatan ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                            placeholder="Contoh: Guru, Wali Kelas 10"
                                        />
                                        {/* Shortcut Tambah Jabatan */}
                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                            <span className="text-[11px] font-semibold text-slate-400">Pilihan Cepat:</span>
                                            {['Wali Kelas 10', 'Wali Kelas 11', 'Wali Kelas 12',].map(preset => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = data.jabatan ? data.jabatan.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
                                                        if (!current.includes(preset)) {
                                                            setData('jabatan', [...current, preset].join(', '));
                                                        }
                                                    }}
                                                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold border border-slate-200 hover:border-blue-200 active:scale-[0.98] transition-all"
                                                >
                                                    +{preset}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.jabatan && <div className="text-red-500 text-xs mt-1 font-medium">{errors.jabatan}</div>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Tahun Masuk <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.tahun_masuk}
                                        onChange={e => setData('tahun_masuk', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${errors.tahun_masuk ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="Contoh: 2023"
                                        maxLength={4}
                                    />
                                    {errors.tahun_masuk && <div className="text-red-500 text-xs mt-1 font-medium">{errors.tahun_masuk}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Foto Pegawai (Opsional, Rasio 2:3)</label>

                                    {!data.foto ? (
                                        <>
                                            {editingId !== null && (
                                                <label className="flex items-center gap-2 mb-3 text-sm text-red-600 font-bold cursor-pointer">
                                                    <input type="checkbox" checked={data.hapus_foto} onChange={e => setData('hapus_foto', e.target.checked)} className="rounded border-red-300 text-red-600 focus:ring-red-500" />
                                                    Hapus foto saat ini
                                                </label>
                                            )}
                                            <input
                                                key="no-file"
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setData('foto', e.target.files ? e.target.files[0] : null)}
                                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-slate-50"
                                            />
                                        </>
                                    ) : (
                                        <div className="relative inline-block border border-slate-200 rounded-xl p-1.5 bg-white shadow-sm">
                                            <img
                                                src={URL.createObjectURL(data.foto)}
                                                alt="Preview"
                                                className="h-32 w-24 object-cover rounded-lg border border-slate-100"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('foto', null)}
                                                className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md transition-transform hover:scale-110"
                                                title="Batal pilih foto"
                                            >
                                                <X size={14} strokeWidth={3} />
                                            </button>
                                        </div>
                                    )}

                                    {errors.foto && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.foto}</span>}
                                    <p className="text-[10px] text-slate-500 mt-1.5 font-medium">Sistem akan otomatis mengkompres dan memotong foto menjadi ukuran 2x3 (rasio 2:3).</p>
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 rounded-b-2xl">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">Batal</button>
                            <button type="submit" form="pegawaiForm" disabled={processing} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Pegawai'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailModalPegawai && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDetailModalPegawai(null)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative z-10">
                        {/* Header Banner */}
                        <div className="h-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative">
                            <button onClick={() => setDetailModalPegawai(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/30 rounded-full p-2 backdrop-blur-md transition-all">
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="px-7 pb-7 relative">
                            {/* Overlapping Avatar */}
                            <div className="absolute -top-16 left-7">
                                {detailModalPegawai.foto && detailModalPegawai.foto !== 'Belum Ada Foto' && !detailModalPegawai.foto.includes('Belum Ada Foto') ? (
                                    <img src={`/storage/pegawai/${detailModalPegawai.foto}`} alt={detailModalPegawai.name} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white" />
                                ) : (
                                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-slate-400">
                                        <UserCheck size={48} />
                                    </div>
                                )}
                            </div>

                            <div className="ml-32 pt-2 h-20">
                                <h3 className="text-xl font-extrabold text-slate-800 leading-tight truncate">{detailModalPegawai.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 font-mono tracking-wider">{detailModalPegawai.niy || '-'}</span>
                                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${detailModalPegawai.jenis_kelamin === 'Laki-laki' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        <span className="text-sm leading-none -mt-px">{detailModalPegawai.jenis_kelamin === 'Laki-laki' ? '♂' : '♀'}</span> {detailModalPegawai.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tempat, Tgl Lahir</div>
                                        <div className="text-sm font-bold text-slate-700 leading-tight">{detailModalPegawai.ttl}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tahun Masuk</div>
                                        <div className="text-sm font-bold text-slate-700 leading-tight">{detailModalPegawai.tahun_masuk || '-'}</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Kepegawaian</div>
                                    <div className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{detailModalPegawai.status_pegawai}</div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Jabatan / Posisi</div>
                                    <div className="flex flex-wrap gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {detailModalPegawai.jabatan?.split(',').map((j: string) => j.trim()).filter(Boolean).map((j: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border shadow-xs ${j.toLowerCase().includes('wali kelas')
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : 'bg-white text-slate-700 border-slate-200'
                                                    }`}
                                            >
                                                {j}
                                            </span>
                                        )) || <span className="text-xs text-slate-400">-</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
