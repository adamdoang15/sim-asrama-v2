import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { CreditCard, DollarSign, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function KeuanganIndex() {
    return (
        <DashboardLayout title="Modul Keuangan">
            <Head title="Keuangan" />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                            <CreditCard className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Modul Keuangan & Pembayaran</h1>
                            <p className="text-sm text-blue-100">
                                Pengelolaan SPP santri, catatan donasi operasional, dan rekapitulasi keuangan asrama.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-500">Pembayaran SPP</span>
                            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                                <DollarSign size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Aktif</p>
                        <p className="mt-1 text-xs text-gray-500">Modul pencatatan pembayaran SPP santri.</p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-500">Donasi & Infaq</span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                <Wallet size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Tersedia</p>
                        <p className="mt-1 text-xs text-gray-500">Pencatatan donatur dan alokasi dana infaq.</p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-500">Laporan Keuangan</span>
                            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Siap Cetak</p>
                        <p className="mt-1 text-xs text-gray-500">Rekapitulasi arus kas dan laporan bulanan.</p>
                    </div>
                </div>

                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
                    <p className="text-sm">Halaman modul keuangan dalam mode operasional. Silakan pilih menu terkait untuk mengelola transaksi.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
