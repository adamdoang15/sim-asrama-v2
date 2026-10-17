import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    FileCheck,
    Building2,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

interface PageProps {
    stats: {
        total_gelara: number;
        total_pegawai: number;
        pegawai_tetap: number;
        berkas_lengkap: number;
    };
    genderData: Array<{ name: string; value: number }>;
    angkatanData: Array<{ name: string; value: number }>;
    recentData: Array<{
        id: number;
        name: string;
        nig?: string;
        kelas?: string;
        angkatan?: string;
        created_at: string;
    }>;
}

const GENDER_COLORS = ['#3b82f6', '#ec4899'];
const BAR_COLOR = '#4f46e5';

export default function KesekretariatanAnalytics({
    stats,
    genderData,
    angkatanData,
    recentData,
}: PageProps) {
    return (
        <DashboardLayout title="Analytics Kesekretariatan">
            <Head title="Analytics Kesekretariatan" />

            <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Analytics & Statistik Kesekretariatan
                                </h1>
                                <p className="text-xs text-slate-200 mt-0.5">
                                    Ringkasan demografi santri Gelara, sebaran angkatan, dan rasio kepegawaian asrama
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/kesekretariatan/data-gelara"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-[0.98]"
                            >
                                <span>Data Gelara</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/kesekretariatan/data-pegawai"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-[0.98]"
                            >
                                <span>Data Pegawai</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Gelara</span>
                            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Users size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.total_gelara}</div>
                        <p className="mt-1 text-xs text-slate-400">Santri terdaftar aktif</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pegawai</span>
                            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <UserCheck size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.total_pegawai}</div>
                        <p className="mt-1 text-xs text-slate-400">Pendidik & staf kependidikan</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pegawai Tetap</span>
                            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Building2 size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.pegawai_tetap}</div>
                        <p className="mt-1 text-xs text-slate-400">Pegawai Tetap Yayasan</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Berkas Terverifikasi</span>
                            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <FileCheck size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.berkas_lengkap}</div>
                        <p className="mt-1 text-xs text-slate-400">Identitas NIG resmi terbit</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Gender Distribution */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Distribusi Gender Santri</h3>
                                <p className="text-xs text-slate-400">Proporsi santri putra dan putri asrama</p>
                            </div>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                {stats.total_gelara} Total
                            </span>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={genderData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {genderData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            border: '1px solid #f1f5f9',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Angkatan Bar Chart */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Sebaran Santri per Angkatan</h3>
                                <p className="text-xs text-slate-400">Volume santri terdaftar per generasi</p>
                            </div>
                            <TrendingUp size={16} className="text-indigo-600" />
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={angkatanData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                            border: '1px solid #f1f5f9',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Bar dataKey="value" fill={BAR_COLOR} radius={[6, 6, 0, 0]} name="Jumlah Santri" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Registrations Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Santri Terdaftar Terbaru</h3>
                            <p className="text-xs text-slate-400">Data pendaftaran santri terakhir yang masuk ke sistem</p>
                        </div>
                        <Link href="/kesekretariatan/data-gelara" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                            Lihat Semua →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="py-3 px-4">Nama Lengkap</th>
                                    <th className="py-3 px-4">NIG</th>
                                    <th className="py-3 px-4">Kelas</th>
                                    <th className="py-3 px-4">Angkatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentData && recentData.length > 0 ? (
                                    recentData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                                            <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                                            <td className="py-3 px-4 font-mono text-slate-600">{item.nig || '-'}</td>
                                            <td className="py-3 px-4 text-slate-600">{item.kelas || '-'}</td>
                                            <td className="py-3 px-4">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                                                    {item.angkatan ? `Angkatan ${item.angkatan}` : '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-slate-400">
                                            Belum ada data santri
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
