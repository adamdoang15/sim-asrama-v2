import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    CreditCard,
    DollarSign,
    TrendingDown,
    PiggyBank,
    ArrowRight,
    PieChart as PieIcon,
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
        total_plan: number;
        total_aktual: number;
        sisa_saldo: number;
        persen_serapan: number;
    };
    posBelanjaData: Array<{ name: string; value: number }>;
    realisasiData: Array<{ name: string; value: number }>;
    recentAnggaran: Array<{
        id: number;
        kegiatan: string;
        kategori?: string;
        plan: number;
        aktual: number;
        selisih?: number;
    }>;
}

const POS_COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899'];
const REALISASI_COLORS = ['#3b82f6', '#10b981'];

export default function KeuanganAnalytics({
    stats,
    posBelanjaData,
    realisasiData,
    recentAnggaran,
}: PageProps) {
    const formatRp = (val: number) =>
        `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

    return (
        <DashboardLayout title="Analytics Keuangan">
            <Head title="Analytics Keuangan" />

            <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <CreditCard className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">
                                    Analytics & Statistik Keuangan
                                </h1>
                                <p className="mt-0.5 text-xs text-emerald-200">
                                    Monitoring pagu anggaran BOP, penyerapan
                                    dana operasional, dan efisiensi realisasi
                                    belanja
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/keuangan/bop"
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
                            >
                                <span>Anggaran BOP</span>
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
                                Total Pagu (Plan)
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <PiggyBank size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-800">
                            {formatRp(stats.total_plan)}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Total alokasi anggaran
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Total Realisasi
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <DollarSign size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-800">
                            {formatRp(stats.total_aktual)}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Total belanja terserap
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Sisa Saldo
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                                <TrendingDown size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-800">
                            {formatRp(stats.sisa_saldo)}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Sisa efisiensi anggaran
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Persentase Serapan
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <PieIcon size={18} />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-800">
                            {stats.persen_serapan}%
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Rasio aktual terhadap plan
                        </p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Chart 1: Pagu Pos Belanja Pie */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Alokasi Anggaran per Pos Kategori
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Distribusi pagu anggaran kegiatan BOP asrama
                                </p>
                            </div>
                            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                {formatRp(stats.total_plan)}
                            </span>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={posBelanjaData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {posBelanjaData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    POS_COLORS[
                                                        index %
                                                            POS_COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: any) => [
                                            formatRp(Number(val)),
                                            'Pagu',
                                        ]}
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

                    {/* Chart 2: Plan vs Aktual Bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Perbandingan Pagu Rencana vs Realisasi
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Volume total rencana belanja vs pengeluaran
                                    aktual
                                </p>
                            </div>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={realisasiData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 10,
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
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        tickFormatter={(val) =>
                                            `Rp ${(val / 1000000).toFixed(0)}Jt`
                                        }
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        formatter={(val: any) => [
                                            formatRp(Number(val)),
                                            'Nominal',
                                        ]}
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
                                        name="Nominal"
                                    >
                                        {realisasiData.map((_, index) => (
                                            <Cell
                                                key={`bar-${index}`}
                                                fill={
                                                    REALISASI_COLORS[
                                                        index %
                                                            REALISASI_COLORS.length
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

                {/* Recent Anggaran Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">
                                Pos Anggaran Terkini
                            </h3>
                            <p className="text-xs text-slate-400">
                                Rincian pagu dan realisasi item belanja BOP
                            </p>
                        </div>
                        <Link
                            href="/keuangan/bop"
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                            Kelola BOP →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Nama Kegiatan</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">
                                        Rencana (Plan)
                                    </th>
                                    <th className="px-4 py-3">
                                        Realisasi (Aktual)
                                    </th>
                                    <th className="px-4 py-3">Selisih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentAnggaran && recentAnggaran.length > 0 ? (
                                    recentAnggaran.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-slate-50/50"
                                        >
                                            <td className="px-4 py-3 font-bold text-slate-800">
                                                {item.kegiatan}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                                    {item.kategori || 'Umum'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-700">
                                                {formatRp(item.plan)}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-semibold text-emerald-700">
                                                {formatRp(item.aktual)}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-slate-600">
                                                {formatRp(
                                                    (item.plan || 0) -
                                                        (item.aktual || 0),
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-6 text-center text-slate-400"
                                        >
                                            Belum ada data anggaran BOP
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
