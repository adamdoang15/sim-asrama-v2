import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Bell,
    BookOpen,
    Briefcase,
    Building,
    Calendar,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    CreditCard,
    FileText,
    HeartPulse,
    Home,
    LogOut,
    Menu,
    PieChart,
    Settings,
    Shield,
    ShieldCheck,
    Users,
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const MENU_ITEMS = [
    { name: 'Dashboard', icon: Home, href: '/dashboard' },
    {
        name: 'Kesekretariatan',
        icon: Users,
        role: 'kesekretariatan',
        subItems: [
            { name: 'Data Gelara', href: '/kesekretariatan/data-gelara' },
            { name: 'Data Pegawai', href: '/kesekretariatan/data-pegawai' }
        ],
    },
    {
        name: 'Kegelaraan',
        icon: Briefcase,
        role: 'kegelaraan',
        subItems: [
            { name: 'Kalender Program', href: '/kegelaraan/kalender' },
            { name: 'Daily Activity', href: '/kegelaraan/daily-activity' },
            { name: 'Track Record', href: '/kegelaraan/track-record' },
            { name: 'Rekap Program Khusus', href: '/kegelaraan/rekap' },
        ],
    },
    {
        name: 'Kurikulum',
        icon: BookOpen,
        role: 'kurikulum',
        subItems: [
            { name: 'Kalender Akademik', href: '/kurikulum/kalender' },
            { name: 'Nilai Akademik', href: '/kurikulum/nilai-akademik' },
        ],
    },
    {
        name: 'Kesehatan',
        icon: HeartPulse,
        role: 'kesehatan',
        subItems: [
            { name: 'Pemeriksaan Kesehatan', href: '/kesehatan/pemeriksaan' },
            { name: 'Rekam Medis', href: '/kesehatan/rekam-medis' },
        ],
    },
    {
        name: 'Sarpras',
        icon: Building,
        role: 'sarpras',
        subItems: [
            { name: 'Inventaris Aset', href: '/sarpras/inventaris' },
            { name: 'Pemeriksaan & Perbaikan', href: '/sarpras/perbaikan' },
            { name: 'Pengadaan Aset', href: '/sarpras/pengadaan' },
        ],
    },
    {
        name: 'Keuangan',
        icon: CreditCard,
        role: 'keuangan',
        subItems: [
            { name: 'Dashboard Keuangan', href: '/keuangan' },
            { name: 'Pembayaran SPP', href: '/keuangan' },
            { name: 'Donasi', href: '/keuangan' },
            { name: 'Laporan Keuangan', href: '/keuangan' },
        ],
    },
    {
        name: 'Administrasi',
        icon: ClipboardList,
        role: 'administrasi',
        subItems: [
            { name: 'Dashboard Administrasi', href: '/administrasi' },
            { name: 'Surat Menyurat', href: '/administrasi' },
            { name: 'Arsip & Dokumen', href: '/administrasi' },
        ],
    },
    {
        name: 'Manajemen User',
        icon: ShieldCheck,
        href: '/admin/users',
        superAdminOnly: true,
    },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { url, props } = usePage<any>();
    const user = props.auth?.user;
    const userRole = user?.role || '';
    const isSuperAdmin = userRole === 'administrasi' || userRole === 'admin';
    const isSuper = isSuperAdmin || userRole === 'viewer' || user?.lembaga === 'Yayasan';

    const visibleMenuItems = MENU_ITEMS.filter(item => {
        if ((item as any).superAdminOnly) {
            return isSuperAdmin;
        }

        if (!item.role || isSuper) return true;
        return item.role === userRole;
    });

    const activeParent = visibleMenuItems.find(item =>
        item.subItems?.some(sub => typeof sub !== 'string' && url.startsWith(sub.href))
    )?.name || null;

    const [openMenu, setOpenMenu] = useState<string | null>(activeParent);

    useEffect(() => {
        if (activeParent) {
            setOpenMenu(activeParent);
        }
    }, [activeParent]);

    const toggleMenu = (name: string) => {
        setOpenMenu(prev => prev === name ? null : name);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-primary text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo Area */}
                <div className="flex h-20 items-center justify-between px-4 mb-2">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-md transition-transform hover:scale-105">
                            <img src="/logo.png" alt="Logo LKP Doa Bangsa" className="h-full w-full object-contain" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[13px] font-extrabold leading-tight tracking-wide text-white truncate">LKP DOA BANGSA</span>
                            <span className="text-[10px] text-blue-200 font-medium tracking-wider uppercase mt-0.5 truncate">Jujur, Ikhlas, Amanah</span>
                        </div>
                    </div>
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 pb-4 pt-4 custom-scrollbar">
                    <ul className="space-y-1 text-sm font-medium">
                        {visibleMenuItems.map((item) => {
                            const isCurrentActive = Boolean(item.subItems?.some(sub => typeof sub !== 'string' && url.startsWith(sub.href)));
                            const isExpanded = openMenu === item.name;

                            return (
                                <li key={item.name}>
                                    {item.subItems ? (
                                        <>
                                            {/* Parent Menu Item */}
                                            <button
                                                onClick={() => toggleMenu(item.name)}
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-primary-hover ${isExpanded || isCurrentActive ? 'bg-primary-hover text-white' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <item.icon size={18} />
                                                    <span>{item.name}</span>
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronRight size={16} />
                                                )}
                                            </button>

                                            {/* Sub menu items */}
                                            {isExpanded && (
                                                <ul className="mt-1 space-y-1 pl-9">
                                                    {item.subItems.map((subItem, index) => {
                                                        const name = typeof subItem === 'string' ? subItem : subItem.name;
                                                        const href = typeof subItem === 'string' ? '#' : subItem.href;
                                                        const isActive = href !== '#' && url.startsWith(href);
                                                        return (
                                                            <li key={name + index}>
                                                                <Link
                                                                    href={href}
                                                                    className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary-hover hover:text-white ${isActive ? 'bg-primary-hover text-white font-bold' : 'text-blue-200'
                                                                        }`}
                                                                >
                                                                    {name}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href || '#'}
                                            className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-primary-hover ${item.href && url.startsWith(item.href) ? 'bg-primary-hover text-white' : ''
                                                }`}
                                        >
                                            <item.icon size={18} />
                                            <span>{item.name}</span>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
