import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Building,
    Wrench,
    CheckCircle2,
    PackagePlus,
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
        total_aset: number;
        aset_baik: number;
        perbaikan_aktif: number;
        pengadaan_aktif: number;
    };
    kondisiData: Array<{ name: string; value: number }>;
    statusPerbaikanData: Array<{ name: string; value: number }>;
    recentPerbaikan: Array<{
        id: number;
        aset?: { nama_aset: string; kode_aset?: string };
        uraian_kerusakan?: string;
        status?: string;
        biaya?: number;
    }>;
}

const KONDISI_COLORS = ['#10b981', '#f59e0b', '#ef4444'];
const STATUS_BAR_COLOR = '#8b5cf6';

export default function SarprasAnalytics({
    stats,
    kondisiData,
    statusPerbaikanData,
    recentPerbaikan,
}: PageProps) {
    return (
        <DashboardLayout title="Analytics Sarpras">
            <Head title="Analytics Sarpras" />

            <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Building className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Analytics & Statistik Sarana Prasarana
                                </h1>
                                <p className="mt-0.5 text-xs text-purple-200">
                                    Inventarisasi aset lembaga, monitoring
                                    kondisi kelayakan, dan status perbaikan
                                    sarpras
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/sarpras/inventaris"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 active:scale-[0.98]"
                            >
                                <span>Inventaris Aset</span>
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/sarpras/perbaikan"
                                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-purple-500 active:scale-[0.98]"
                            >
                                <span>Perbaikan Aset</span>
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
                                Total Aset
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <Building size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.total_aset}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Barang inventaris tercatat
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Kondisi Baik
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.aset_baik}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Siap & layak digunakan
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Tiket Perbaikan Aktif
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Wrench size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.perbaikan_aktif}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Dalam proses pemeliharaan
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Pengadaan Berjalan
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <PackagePlus size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-3xl font-extrabold text-slate-800">
                            {stats.pengadaan_aktif}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Pengajuan barang baru
                        </p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Chart 1: Kondisi Aset Pie */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Distribusi Kondisi Fisik Aset
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Persentase kelayakan barang inventaris
                                    asrama
                                </p>
                            </div>
                            <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                {stats.total_aset} Item
                            </span>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={kondisiData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {kondisiData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    KONDISI_COLORS[
                                                        index %
                                                            KONDISI_COLORS.length
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

                    {/* Chart 2: Status Perbaikan Bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Progres Penanganan Perbaikan
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Status tiket pemeliharaan aset rusak
                                </p>
                            </div>
                            <TrendingUp size={16} className="text-purple-600" />
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={statusPerbaikanData}
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
                                        fill={STATUS_BAR_COLOR}
                                        radius={[6, 6, 0, 0]}
                                        name="Tiket Perbaikan"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Maintenance Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                Tiket Perbaikan Terbaru
                            </h3>
                            <p className="text-xs text-slate-400">
                                Daftar laporan kerusakan aset yang sedang
                                ditangani
                            </p>
                        </div>
                        <Link
                            href="/sarpras/perbaikan"
                            className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                        >
                            Buka Daftar Perbaikan →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nama Aset</th>
                                    <th className="px-4 py-3">
                                        Uraian Masalah
                                    </th>
                                    <th className="px-4 py-3">
                                        Estimasi Biaya
                                    </th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentPerbaikan &&
                                recentPerbaikan.length > 0 ? (
                                    recentPerbaikan.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-slate-50/50"
                                        >
                                            <td className="px-4 py-3 font-bold text-slate-800">
                                                {item.aset?.nama_aset || 'Aset'}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-slate-600">
                                                {item.uraian_kerusakan || '-'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-700">
                                                {item.biaya
                                                    ? `Rp ${Number(item.biaya).toLocaleString('id-ID')}`
                                                    : 'Rp 0'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 font-semibold text-purple-700">
                                                    {item.status || 'Menunggu'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-6 text-center text-slate-400"
                                        >
                                            Belum ada data perbaikan aktif
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
