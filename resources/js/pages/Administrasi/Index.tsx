import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ClipboardList,
    FileText,
    Archive,
    UserCheck,
    ArrowRight,
} from 'lucide-react';

export default function AdministrasiIndex() {
    const modules = [
        {
            title: 'Surat Menyurat',
            desc: 'Pencatatan surat masuk, asal pengirim, perihal, dan unggah dokumen.',
            href: '/administrasi/surat',
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            badge: 'Buka Surat',
        },
        {
            title: 'Arsip Dokumen',
            desc: 'Penyimpanan berkas SK, sertifikat, izin operasional, dan MoU lembaga.',
            href: '/administrasi/arsip',
            icon: Archive,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            badge: 'Buka Arsip',
        },
        {
            title: 'Absensi Petugas',
            desc: 'Pencatatan presensi harian petugas pengasuhan, pembina, dan staf lembaga.',
            href: '/administrasi/absensi',
            icon: UserCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            badge: 'Buka Presensi',
        },
    ];

    return (
        <DashboardLayout title="Modul Administrasi">
            <Head title="Administrasi" />

            <div className="space-y-6">
                {/* Header Banner */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                            <ClipboardList className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                Modul Administrasi Lembaga
                            </h1>
                            <p className="text-sm text-slate-200">
                                Pengelolaan surat menyurat, pengarsipan dokumen
                                resmi, dan pengawasan operasional lembaga.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Clickable Quick Navigation Cards */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {modules.map((m) => (
                        <Link
                            key={m.title}
                            href={m.href}
                            className="group flex cursor-pointer flex-col justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md"
                        >
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-base font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                                        {m.title}
                                    </span>
                                    <div
                                        className={`rounded-xl ${m.bg} p-2.5 ${m.color} transition-transform group-hover:scale-110`}
                                    >
                                        <m.icon size={22} />
                                    </div>
                                </div>
                                <p className="text-xs leading-relaxed text-gray-600">
                                    {m.desc}
                                </p>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-blue-600">
                                <span>{m.badge}</span>
                                <ArrowRight
                                    size={15}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                    Klik kartu di atas atau gunakan menu pada sidebar untuk
                    membuka halaman modul administrasi yang diinginkan.
                </div>
            </div>
        </DashboardLayout>
    );
}
