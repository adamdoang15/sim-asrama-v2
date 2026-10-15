import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { ClipboardList, FileText, Archive, Building2 } from 'lucide-react';

export default function AdministrasiIndex() {
    return (
        <DashboardLayout title="Modul Administrasi">
            <Head title="Administrasi" />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                            <ClipboardList className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Modul Administrasi Lembaga</h1>
                            <p className="text-sm text-slate-200">
                                Pengelolaan surat menyurat, pengarsipan dokumen resmi, dan pengawasan operasional lembaga.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-500">Surat Menyurat</span>
                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                <FileText size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Aktif</p>
                        <p className="mt-1 text-xs text-gray-500">Pencatatan surat masuk, keluar, dan disposisi.</p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-500">Arsip Digital</span>
                            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                <Archive size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Tersedia</p>
                        <p className="mt-1 text-xs text-gray-500">Penyimpanan berkas SK, sertifikat, dan izin operasional.</p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-500">Profil Lembaga</span>
                            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                                <Building2 size={20} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">Lengkap</p>
                        <p className="mt-1 text-xs text-gray-500">Data legalitas dan struktur organisasi lembaga.</p>
                    </div>
                </div>

                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
                    <p className="text-sm">Halaman modul administrasi dalam mode operasional. Silakan pilih menu terkait untuk mengelola dokumen dan persuratan.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
