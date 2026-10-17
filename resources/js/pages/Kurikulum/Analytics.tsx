import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    GraduationCap,
    CheckCircle,
    Calendar,
    ArrowRight,
    Award,
    AlertTriangle,
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
        total_agenda: number;
        total_mapel: number;
        total_nilai: number;
        persen_tuntas: number;
    };
    kkm: number;
    ketuntasanData: Array<{ name: string; value: number }>;
    mapelData: Array<{ name: string; value: number }>;
    recentNilai: Array<{
        id: number;
        kelas: string;
        mata_pelajaran: string;
        nilai_akhir: number;
        predikat: string;
        gelara?: {
            name: string;
            nig: string;
            kelas?: string;
        };
        updated_at?: string;
    }>;
}

const TUNTAS_COLORS = ['#10b981', '#f59e0b'];
const MAPEL_BAR_COLOR = '#0d9488';

export default function KurikulumAnalytics({
    stats,
    kkm = 75,
    ketuntasanData,
    mapelData,
    recentNilai = [],
}: PageProps) {
    return (
        <DashboardLayout title="Analytics Kurikulum">
            <Head title="Analytics Kurikulum" />

            <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl font-bold tracking-tight text-white">
                                        Analytics &amp; Statistik Kurikulum
                                    </h1>
                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-0.5 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                                        <span>Standar KKM: {kkm} (Semua Pelajaran)</span>
                                    </div>
                                </div>
                                <p className="text-xs text-teal-100 mt-1">
                                    Evaluasi ketuntasan belajar santri, nilai rata-rata mata pelajaran, dan jadwal akademik
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/kurikulum/kalender"
                                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-[0.98]"
                            >
                                <span>Kalender Akademik</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/kurikulum/nilai-akademik"
                                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-[0.98]"
                            >
                                <span>Nilai Akademik</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tingkat Ketuntasan</span>
                            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.persen_tuntas}%</div>
                        <p className="mt-1 text-xs text-slate-400">Rasio nilai di atas KKM ({kkm}) semua pelajaran</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mata Pelajaran</span>
                            <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                <BookOpen size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.total_mapel}</div>
                        <p className="mt-1 text-xs text-slate-400">Mapel terdaftar aktif</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Entri Nilai</span>
                            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <GraduationCap size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.total_nilai}</div>
                        <p className="mt-1 text-xs text-slate-400">Data evaluasi terinput</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agenda Akademik</span>
                            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Calendar size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">{stats.total_agenda}</div>
                        <p className="mt-1 text-xs text-slate-400">Jadwal semester berjalan</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Ketuntasan Belajar Pie */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Rasio Ketuntasan Belajar (KKM {kkm})</h3>
                                <p className="text-xs text-slate-400">Perbandingan santri tuntas KKM vs butuh perbaikan semua pelajaran</p>
                            </div>
                            {stats.total_nilai > 0 ? (
                                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                    {stats.persen_tuntas}% Lulus
                                </span>
                            ) : (
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                    Belum Ada Data
                                </span>
                            )}
                        </div>
                        {stats.total_nilai > 0 && ketuntasanData.length > 0 ? (
                            <div className="h-[260px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ketuntasanData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {ketuntasanData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={TUNTAS_COLORS[index % TUNTAS_COLORS.length]} />
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
                        ) : (
                            <div className="h-[260px] w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <BookOpen className="h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-xs font-semibold text-slate-600">Belum ada data evaluasi nilai santri</p>
                                <p className="text-[11px] text-slate-400 mt-1 max-w-[260px]">
                                    Input nilai santri pada menu Nilai Akademik untuk melihat distribusi ketuntasan KKM
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Chart 2: Rata-rata Nilai per Mapel Bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Rata-rata Nilai per Mata Pelajaran</h3>
                                <p className="text-xs text-slate-400">Performa akademik mata pelajaran utama</p>
                            </div>
                            <Award size={16} className="text-teal-600" />
                        </div>
                        {mapelData && mapelData.length > 0 ? (
                            <div className="h-[260px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mapelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                                border: '1px solid #f1f5f9',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Bar dataKey="value" fill={MAPEL_BAR_COLOR} radius={[6, 6, 0, 0]} name="Rata-rata Nilai" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[260px] w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <GraduationCap className="h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-xs font-semibold text-slate-600">Belum ada data rata-rata nilai mata pelajaran</p>
                                <p className="text-[11px] text-slate-400 mt-1 max-w-[260px]">
                                    Rata-rata per mata pelajaran akan terhitung secara otomatis setelah nilai akademik diinput
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Academic Grades */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Nilai Akademik Santri Terkini</h3>
                            <p className="text-xs text-slate-400">Riwayat entri evaluasi nilai akademik dan ketuntasan santri</p>
                        </div>
                        <Link href="/kurikulum/nilai-akademik" className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700">
                            <span>Kelola Nilai Akademik</span>
                            <ArrowRight size={13} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="py-3 px-4">Santri</th>
                                    <th className="py-3 px-4">Kelas & Mapel</th>
                                    <th className="py-3 px-4">Nilai Akhir</th>
                                    <th className="py-3 px-4">Predikat</th>
                                    <th className="py-3 px-4">Status Ketuntasan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentNilai && recentNilai.length > 0 ? (
                                    recentNilai.map((item) => {
                                        const isTuntas = Number(item.nilai_akhir) >= kkm;
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition">
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-800">{item.gelara?.name || 'Santri'}</div>
                                                    <div className="text-[11px] text-slate-400 font-mono">NIG: {item.gelara?.nig || '-'}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-slate-700">{item.mata_pelajaran}</div>
                                                    <div className="text-[11px] text-slate-400">{item.kelas}</div>
                                                </td>
                                                <td className="py-3 px-4 font-mono font-bold text-slate-800 text-sm">
                                                    {Number(item.nilai_akhir).toFixed(1)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="inline-block px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-700">
                                                        {item.predikat || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {isTuntas ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">
                                                            <CheckCircle size={12} /> Tuntas (≥ {kkm})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold">
                                                            <AlertTriangle size={12} /> Remedial (&lt; {kkm})
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            Belum ada entri nilai akademik santri
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
