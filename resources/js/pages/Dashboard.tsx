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
    ArrowDown,
} from 'lucide-react';

const STATS = [
    {
        title: 'Total Gelara',
        value: '75',
        icon: Users,
        iconBg: 'bg-blue-600 text-white',
        cardBg: 'bg-blue-50/80 border border-blue-100',
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
        iconBg: 'bg-emerald-600 text-white',
        cardBg: 'bg-emerald-50/80 border border-emerald-100',
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
        iconBg: 'bg-rose-600 text-white',
        cardBg: 'bg-rose-50/80 border border-rose-100',
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
        iconBg: 'bg-amber-600 text-white',
        cardBg: 'bg-amber-50/80 border border-amber-100',
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
        description:
            'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
    {
        date: '07 Okt 2026',
        type: 'Kesiswaan',
        title: 'Pengumuman Lomba Siswa Berprestasi',
        description:
            'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
    {
        date: '04 Okt 2026',
        type: 'Keuangan',
        title: 'Pembayaran SPP Bulan Oktober',
        description:
            'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
    {
        date: '01 Okt 2026',
        type: 'Kurikulum',
        title: 'Jadwal Ujian Tengah Semester',
        description:
            'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    },
];

const AGENDA = [
    {
        date: '05 Okt',
        title: 'Peringatan Sumpah Pemuda',
        time: '07.00 - 10.00 WIB',
        location: 'Lapangan Sekolah',
        badge: 'Upacara',
        badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
        icon: Users,
    },
    {
        date: '08 Okt',
        title: 'Ujian karate',
        time: '08.00 - 11.00 WIB',
        location: 'Gedung Serbaguna',
        badge: 'Ekstrakurikuler',
        badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        icon: UserPlus,
    },
    {
        date: '12 Okt',
        title: 'Rapat Orang Tua/Wali Murid',
        time: '09.00 - 12.00 WIB',
        location: 'Aula Sekolah',
        badge: 'Kegiatan Sekolah',
        badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
        icon: Users,
    },
    {
        date: '15 Okt',
        title: 'Pekan Literasi',
        time: '07.00 - 15.00 WIB',
        location: 'Perpustakaan',
        badge: 'Kurikulum',
        badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
        icon: BookOpen,
    },
    {
        date: '20 Okt',
        title: 'Lomba Cerdas Cermat',
        time: '08.30 - 12.00 WIB',
        location: 'Ruang Serbaguna',
        badge: 'Kesiswaan',
        badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200',
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
                            if (stat.title === 'Total Gelara')
                                finalValue = stats.total_gelara;
                            if (stat.title === 'Total Petugas')
                                finalValue = stats.total_petugas;
                        }

                        return (
                            <div
                                key={idx}
                                className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md ${stat.cardBg}`}
                            >
                                {/* Left side content */}
                                <div className="relative z-10 w-2/3">
                                    <div className="mb-3 flex items-center space-x-3">
                                        <div
                                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full shadow-sm ${stat.iconBg}`}
                                        >
                                            <stat.icon
                                                size={22}
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                        <p className="text-sm font-bold text-[#1e293b]">
                                            {stat.title}
                                        </p>
                                    </div>

                                    <p className="mb-1 text-[28px] leading-tight font-extrabold text-[#0f172a]">
                                        {finalValue}
                                    </p>
                                </div>

                                {/* Right side illustration */}
                                <div className="pointer-events-none absolute -right-2 bottom-0 flex h-full w-[55%] items-end justify-end">
                                    <img
                                        src={stat.image}
                                        alt={stat.title}
                                        className="h-full origin-bottom-right object-contain object-bottom opacity-95 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Pengumuman */}
                    <div className="rounded-xl border border-gray-200/80 bg-white shadow-xs">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div className="flex items-center space-x-3">
                                <div className="text-blue-600">
                                    <Megaphone size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Pengumuman
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Informasi terbaru asrama
                                    </p>
                                </div>
                            </div>
                            <button className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Lihat Semua &rarr;
                            </button>
                        </div>
                        <div className="p-0">
                            {ANNOUNCEMENTS.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex cursor-pointer items-start border-b border-gray-100 p-6 transition-colors last:border-0 hover:bg-gray-50"
                                >
                                    <div className="mr-6 flex min-w-[70px] flex-col items-center justify-center rounded-lg bg-blue-50 px-4 py-2 text-blue-600">
                                        <span className="text-2xl leading-none font-bold">
                                            {item.date.split(' ')[0]}
                                        </span>
                                        <span className="text-xs font-medium">
                                            {item.date.split(' ')[1]}{' '}
                                            {item.date.split(' ')[2]}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <span
                                            className={`text-xs font-semibold ${
                                                item.type === 'Akademik'
                                                    ? 'text-blue-600'
                                                    : item.type === 'Kesiswaan'
                                                      ? 'text-emerald-600'
                                                      : item.type === 'Keuangan'
                                                        ? 'text-amber-600'
                                                        : 'text-indigo-600'
                                            }`}
                                        >
                                            {item.type}
                                        </span>
                                        <h3 className="mt-1 mb-1 text-sm font-bold text-gray-900">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs leading-relaxed text-gray-500">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="ml-4 text-gray-300">
                                        &gt;
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Agenda */}
                    <div className="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs">
                        <div className="relative z-10 flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div className="flex items-center space-x-3">
                                <div className="text-blue-600">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Agenda Oktober
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Kegiatan penting dan jadwal asrama
                                    </p>
                                </div>
                            </div>
                            <button className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Lihat Semua &rarr;
                            </button>
                        </div>
                        <div className="relative z-10 p-6">
                            <div className="relative ml-5 space-y-8 border-l-2 border-gray-100">
                                {AGENDA.map((item, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className="absolute top-1 -left-[30px] flex h-14 w-14 flex-col items-center justify-center rounded-full border border-gray-100 bg-white text-blue-600 shadow-sm">
                                            <span className="text-lg leading-none font-bold">
                                                {item.date.split(' ')[0]}
                                            </span>
                                            <span className="text-[10px] font-medium">
                                                {item.date.split(' ')[1]}
                                            </span>
                                        </div>
                                        <div className="ml-4 flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className={`rounded-full p-1.5 ${item.badgeColor}`}
                                                    >
                                                        <item.icon size={14} />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-gray-900">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <div className="mt-2 space-y-1 text-xs text-gray-500">
                                                    <p className="flex items-center">
                                                        <Calendar
                                                            size={12}
                                                            className="mr-2"
                                                        />{' '}
                                                        {item.time}
                                                    </p>
                                                    <p className="flex items-center">
                                                        <span className="mr-1 inline-block w-3 text-center">
                                                            📍
                                                        </span>{' '}
                                                        {item.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${item.badgeColor}`}
                                            >
                                                {item.badge}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Decorative background building vector could be added here */}
                        <div className="absolute right-0 bottom-0 z-0 h-32 w-full bg-gradient-to-t from-blue-50 to-transparent opacity-50"></div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
