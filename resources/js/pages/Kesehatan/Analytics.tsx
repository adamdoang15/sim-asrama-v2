import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    HeartPulse,
    Activity,
    ShieldCheck,
    Stethoscope,
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
        total_pemeriksaan: number;
        imt_normal: number;
        tensi_normal: number;
        persen_sehat: number;
    };
    imtData: Array<{ name: string; value: number }>;
    tensiData: Array<{ name: string; value: number }>;
    recentPemeriksaan: Array<{
        id: number;
        gelara?: { name: string; kelas?: string; nig?: string };
        berat_badan?: number;
        tinggi_badan?: number;
        imt_kategori?: string;
        tensi_kategori?: string;
        updated_at?: string;
    }>;
}

const IMT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
const TENSI_BAR_COLOR = '#e11d48';

export default function KesehatanAnalytics({
    stats,
    imtData,
    tensiData,
    recentPemeriksaan,
}: PageProps) {
    return (
        <DashboardLayout title="Analytics Kesehatan">
            <Head title="Analytics Kesehatan" />

            <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-rose-900 via-red-950 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <HeartPulse className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Analytics & Statistik Kesehatan
                                </h1>
                                <p className="mt-0.5 text-xs text-rose-100">
                                    Pemantauan status gizi (IMT), tekanan darah,
                                    dan rekap skrining fisik santri asrama
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/kesehatan/pemeriksaan"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-[0.98]"
                            >
                                <span>Pemeriksaan</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/kesehatan/rekam-medis"
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 active:scale-[0.98]"
                            >
                                <span>Rekam Medis</span>
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
                                Total Skrining
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <Stethoscope size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.total_pemeriksaan}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Pemeriksaan fisik tercatat
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Tingkat Gizi Baik
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ShieldCheck size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.persen_sehat}%
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            IMT kategori normal
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Tensi Normal
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Activity size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.tensi_normal}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Tekanan darah ideal
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                IMT Normal
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                <TrendingUp size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.imt_normal}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Santri berat badan proporsional
                        </p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Chart 1: Kategori IMT Pie */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Sebaran Indeks Massa Tubuh (IMT)
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Distribusi proporsi berat & tinggi badan
                                    santri
                                </p>
                            </div>
                            <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                {stats.total_pemeriksaan} Data
                            </span>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={imtData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {imtData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    IMT_COLORS[
                                                        index %
                                                            IMT_COLORS.length
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

                    {/* Chart 2: Tekanan Darah Bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Distribusi Kategori Tekanan Darah
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Rekap skrining tensi normal vs
                                    hipertensi/hipotensi
                                </p>
                            </div>
                            <Activity size={16} className="text-rose-600" />
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={tensiData}
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
                                        fill={TENSI_BAR_COLOR}
                                        radius={[6, 6, 0, 0]}
                                        name="Jumlah Santri"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Health Screenings */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                Pemeriksaan Fisik Terakhir
                            </h3>
                            <p className="text-xs text-slate-400">
                                Riwayat skrining kesehatan santri yang baru
                                diperbarui
                            </p>
                        </div>
                        <Link
                            href="/kesehatan/pemeriksaan"
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                            Lihat Pemeriksaan →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nama Santri</th>
                                    <th className="px-4 py-3">Kelas</th>
                                    <th className="px-4 py-3">
                                        Tinggi / Berat
                                    </th>
                                    <th className="px-4 py-3">Kategori IMT</th>
                                    <th className="px-4 py-3">
                                        Kategori Tensi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentPemeriksaan &&
                                recentPemeriksaan.length > 0 ? (
                                    recentPemeriksaan.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-slate-50/50"
                                        >
                                            <td className="px-4 py-3 font-bold text-slate-800">
                                                {item.gelara?.name || 'Santri'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {item.gelara?.kelas || '-'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-600">
                                                {item.tinggi_badan
                                                    ? `${item.tinggi_badan} cm`
                                                    : '-'}{' '}
                                                /{' '}
                                                {item.berat_badan
                                                    ? `${item.berat_badan} kg`
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                                    {item.imt_kategori ||
                                                        'Belum Diperiksa'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700">
                                                    {item.tensi_kategori ||
                                                        'Normal'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-6 text-center text-slate-400"
                                        >
                                            Belum ada data pemeriksaan
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
