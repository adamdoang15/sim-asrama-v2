import { router, usePage } from '@inertiajs/react';
import { Bell, LogOut, Menu, Search, User as UserIcon } from 'lucide-react';

interface HeaderProps {
    setSidebarOpen: (isOpen: boolean) => void;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    lembaga?: string;
    role?: string;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
    const { auth } = usePage<{ auth?: { user?: AuthUser } }>().props;
    const user = auth?.user;
    const isViewOnly = user?.lembaga === 'Yayasan' || user?.role === 'viewer';

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
            <div className="flex items-center">
                <button
                    className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar */}
                <div className="hidden items-center sm:flex">
                    <div className="relative w-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Cari menu, informasi, atau nama..."
                            className="block w-full rounded-full border border-gray-300 py-2 pr-3 pl-10 text-sm placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                    <Bell size={24} />
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        1
                    </span>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900">
                                {user?.name || 'Pengguna'}
                            </span>
                            {isViewOnly && (
                                <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
                                    View Only
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">
                            {user?.lembaga ||
                                (user?.role === 'admin'
                                    ? 'Administrator'
                                    : 'Pengguna')}
                        </span>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                        <UserIcon size={20} />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Keluar dari sistem"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
