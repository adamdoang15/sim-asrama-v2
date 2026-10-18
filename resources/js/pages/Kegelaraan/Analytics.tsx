import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    CalendarCheck,
    CheckCircle2,
    Award,
    AlertTriangle,
    ArrowRight,
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
        total_kegiatan: number;
        kegiatan_selesai: number;
        total_daily: number;
        total_prestasi: number;
    };
    kategoriData: Array<{ name: string; value: number }>;
    disciplineData: Array<{ name: string; value: number }>;
    recentKegiatan: Array<{
        id: number;
        title: string;
        type?: string;
        kategori?: string;
        start_date?: string;
        is_completed?: boolean;
    }>;
}

const KATEGORI_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
const DISCIPLINE_COLORS = ['#ef4444', '#10b981'];

export default function KegelaraanAnalytics({
    stats,
    kategoriData,
    disciplineData,
    recentKegiatan,
}: PageProps) {
    return (
        <DashboardLayout title="Analytics Kegelaraan">
            <Head title="Analytics Kegelaraan" />

            <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-amber-900 via-orange-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Analytics & Statistik Kegelaraan
                                </h1>
                                <p className="mt-0.5 text-xs text-amber-100">
                                    Monitoring program kegiatan santri, tingkat
                                    ketercapaian agenda, dan track record
                                    kedisiplinan
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/kegelaraan/kalender"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-[0.98]"
                            >
                                <span>Kalender Program</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/kegelaraan/track-record"
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 active:scale-[0.98]"
                            >
                                <span>Track Record</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Total Program
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Briefcase size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.total_kegiatan}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Agenda program terdaftar
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Program Terlaksana
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.kegiatan_selesai}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Kegiatan tuntas dilaksanakan
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Daily Activities
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CalendarCheck size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.total_daily}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Jurnal harian santri aktif
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Total Prestasi
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <Award size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.total_prestasi}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Pencapaian santri terdata
                        </p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Chart 1: Kategori Kegiatan Pie */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Distribusi Kategori Program
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Proporsi jenis kegiatan pembinaan asrama
                                </p>
                            </div>
                            <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                {stats.total_kegiatan} Program
                            </span>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={kategoriData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {kategoriData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    KATEGORI_COLORS[
                                                        index %
                                                            KATEGORI_COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            boxShadow:
                                                '0 4px 20px rgba(0,0,0,0.08)',
                                            border: '1px solid #f1f5f9',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{
                                            fontSize: '12px',
                                            paddingTop: '10px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Disiplin Santri Bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Keseimbangan Kedisiplinan & Prestasi
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Perbandingan catatan pelanggaran dan
                                    prestasi santri
                                </p>
                            </div>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={disciplineData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            boxShadow:
                                                '0 4px 20px rgba(0,0,0,0.08)',
                                            border: '1px solid #f1f5f9',
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[6, 6, 0, 0]}
                                        name="Total"
                                    >
                                        {disciplineData.map((_, index) => (
                                            <Cell
                                                key={`bar-${index}`}
                                                fill={
                                                    DISCIPLINE_COLORS[
                                                        index %
                                                            DISCIPLINE_COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activities Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                Program Kegiatan Terkini
                            </h3>
                            <p className="text-xs text-slate-400">
                                Jadwal dan status pelaksanaan program asrama
                            </p>
                        </div>
                        <Link
                            href="/kegelaraan/kalender"
                            className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                        >
                            Buka Kalender →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nama Kegiatan</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Waktu Mulai</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentKegiatan && recentKegiatan.length > 0 ? (
                                    recentKegiatan.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-slate-50/50"
                                        >
                                            <td className="px-4 py-3 font-bold text-slate-800">
                                                {item.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                                    {item.type ||
                                                        item.kategori ||
                                                        'Umum'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-500">
                                                {item.start_date || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.is_completed ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-600">
                                                        <CheckCircle2
                                                            size={12}
                                                        />{' '}
                                                        Selesai
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-600">
                                                        <AlertTriangle
                                                            size={12}
                                                        />{' '}
                                                        Terjadwal
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-6 text-center text-slate-400"
                                        >
                                            Belum ada data kegiatan
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
