import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import {
    BookOpen,
    BriefcaseMedical,
    Calendar,
    CircleUser,
    Megaphone,
    User,
    UserPlus,
    Users,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

const STATS = [
    {
        title: 'Total Gelara',
        value: '75',
        icon: Users,
        iconBg: 'bg-[#2F65E3] text-white',
        cardBg: 'bg-[#EBF2FF]',
        trend: 'up',
        trendValue: '5%',
        trendLabel: 'Dibanding bulan lalu',
        trendColor: 'text-emerald-600',
        image: '/images/illustrations/illus_students_1791193731403.jpg',
    },
    {
        title: 'Total Petugas',
        value: '20',
        icon: User,
        iconBg: 'bg-[#189F5F] text-white',
        cardBg: 'bg-[#E7F8F0]',
        trend: 'up',
        trendValue: '2%',
        trendLabel: 'Dibanding bulan lalu',
        trendColor: 'text-emerald-600',
        image: '/images/illustrations/illus_staff_1791193742473.jpg',
    },
    {
        title: 'Gelara Sakit',
        value: '12',
        icon: BriefcaseMedical,
        iconBg: 'bg-[#F43C5E] text-white',
        cardBg: 'bg-[#FFE8EC]',
        trend: 'down',
        trendValue: '3%',
        trendLabel: 'Dibanding bulan lalu',
        trendColor: 'text-rose-500',
        image: '/images/illustrations/illus_sick_1791193752445.jpg',
    },
    {
        title: 'Gelara Izin',
        value: '8',
        icon: CircleUser,
        iconBg: 'bg-[#7B52CE] text-white',
        cardBg: 'bg-[#F2EEFA]',
        trend: 'down',
        trendValue: '2%',
        trendLabel: 'Dibanding bulan lalu',
        trendColor: 'text-rose-500',
        image: '/images/illustrations/illus_leave_1791193763372.jpg',
    },
];

const ANNOUNCEMENTS = [
    {
        date: '09 Okt 2026',
        type: 'Akademik',
        title: 'Rapat di Aula',
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
    {
        date: '07 Okt 2026',
        type: 'Kesiswaan',
        title: 'Pengumuman Lomba Siswa Berprestasi',
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
    {
        date: '04 Okt 2026',
        type: 'Keuangan',
        title: 'Pembayaran SPP Bulan Oktober',
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
    {
        date: '01 Okt 2026',
        type: 'Kurikulum',
        title: 'Jadwal Ujian Tengah Semester',
        description: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
];

const AGENDA = [
    {
        date: '05 Okt',
        title: 'Peringatan Sumpah Pemuda',
        time: '07.00 - 10.00 WIB',
        location: 'Lapangan Sekolah',
        badge: 'Upacara',
        badgeColor: 'bg-blue-100 text-blue-600',
        icon: Users,
    },
    {
        date: '08 Okt',
        title: 'Ujian karate',
        time: '08.00 - 11.00 WIB',
        location: 'Gedung Serbaguna',
        badge: 'Ekstrakurikuler',
        badgeColor: 'bg-emerald-100 text-emerald-600',
        icon: UserPlus,
    },
    {
        date: '12 Okt',
        title: 'Rapat Orang Tua/Wali Murid',
        time: '09.00 - 12.00 WIB',
        location: 'Aula Sekolah',
        badge: 'Kegiatan Sekolah',
        badgeColor: 'bg-purple-100 text-purple-600',
        icon: Users,
    },
    {
        date: '15 Okt',
        title: 'Pekan Literasi',
        time: '07.00 - 15.00 WIB',
        location: 'Perpustakaan',
        badge: 'Kurikulum',
        badgeColor: 'bg-orange-100 text-orange-600',
        icon: BookOpen, // I should import BookOpen or just use a fallback, I'll use Calendar for now
    },
    {
        date: '20 Okt',
        title: 'Lomba Cerdas Cermat',
        time: '08.30 - 12.00 WIB',
        location: 'Ruang Serbaguna',
        badge: 'Kesiswaan',
        badgeColor: 'bg-cyan-100 text-cyan-600',
        icon: Calendar,
    },
];

export default function Dashboard({ stats }: { stats?: any }) {
    return (
        <DashboardLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS.map((stat, idx) => {
                        let finalValue = stat.value;
                        if (stats) {
                            if (stat.title === 'Total Gelara') finalValue = stats.total_gelara;
                            if (stat.title === 'Total Petugas') finalValue = stats.total_petugas;
                        }

                        return (
                            <div key={idx} className={`relative group flex flex-col justify-between rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${stat.cardBg}`}>
                                {/* Left side content */}
                                <div className="relative z-10 w-2/3">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full shadow-sm ${stat.iconBg}`}>
                                            <stat.icon size={22} strokeWidth={2.5} />
                                        </div>
                                        <p className="text-sm font-bold text-[#1e293b]">{stat.title}</p>
                                    </div>

                                    <p className="text-[28px] leading-tight font-extrabold text-[#0f172a] mb-1">{finalValue}</p>
                                </div>

                                {/* Right side illustration */}
                                <div className="absolute -right-2 bottom-0 h-full w-[55%] flex items-end justify-end pointer-events-none">
                                    <img src={stat.image} alt={stat.title} className="h-full object-contain object-bottom mix-blend-multiply opacity-95 group-hover:scale-105 transition-transform duration-300 origin-bottom-right" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Pengumuman */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div className="flex items-center space-x-3">
                                <div className="text-blue-500">
                                    <Megaphone size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Pengumuman</h2>
                                    <p className="text-sm text-gray-500">Informasi terbaru asrama</p>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                                Lihat Semua &rarr;
                            </button>
                        </div>
                        <div className="p-0">
                            {ANNOUNCEMENTS.map((item, idx) => (
                                <div key={idx} className="flex items-start border-b border-gray-100 p-6 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="mr-6 flex flex-col items-center justify-center rounded-lg bg-blue-50 px-4 py-2 text-blue-600 min-w-[70px]">
                                        <span className="text-2xl font-bold leading-none">{item.date.split(' ')[0]}</span>
                                        <span className="text-xs font-medium">{item.date.split(' ')[1]} {item.date.split(' ')[2]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className={`text-xs font-semibold ${item.type === 'Akademik' ? 'text-blue-600' :
                                            item.type === 'Kesiswaan' ? 'text-emerald-600' :
                                                item.type === 'Keuangan' ? 'text-orange-600' : 'text-purple-600'
                                            }`}>{item.type}</span>
                                        <h3 className="text-sm font-bold text-gray-900 mt-1 mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                                    </div>
                                    <div className="ml-4 text-gray-300">
                                        &gt;
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Agenda */}
                    <div className="rounded-xl bg-white shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="text-blue-500">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Agenda Oktober</h2>
                                    <p className="text-sm text-gray-500">Kegiatan penting dan jadwal asrama</p>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                                Lihat Semua &rarr;
                            </button>
                        </div>
                        <div className="p-6 relative z-10">
                            <div className="relative border-l-2 border-gray-100 ml-5 space-y-8">
                                {AGENDA.map((item, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className="absolute -left-[30px] top-1 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-blue-600">
                                            <span className="text-lg font-bold leading-none">{item.date.split(' ')[0]}</span>
                                            <span className="text-[10px] font-medium">{item.date.split(' ')[1]}</span>
                                        </div>
                                        <div className="flex items-start justify-between ml-4">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <div className={`p-1.5 rounded-full ${item.badgeColor}`}>
                                                        <item.icon size={14} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                                                </div>
                                                <div className="mt-2 text-xs text-gray-500 space-y-1">
                                                    <p className="flex items-center"><Calendar size={12} className="mr-2" /> {item.time}</p>
                                                    <p className="flex items-center"><span className="w-3 inline-block text-center mr-1">📍</span> {item.location}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                                                {item.badge}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Decorative background building vector could be added here */}
                        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-blue-50 to-transparent opacity-50 z-0"></div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
