import { router, useForm, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronDown,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    LogOut,
    Menu,
    Search,
    ShieldCheck,
    User as UserIcon,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Password visibility toggles
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleCloseModal = () => {
        reset();
        clearErrors();
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setIsPasswordModalOpen(false);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isPasswordModalOpen) {
                    handleCloseModal();
                } else if (isDropdownOpen) {
                    setIsDropdownOpen(false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPasswordModalOpen, isDropdownOpen]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseModal();
            },
        });
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs sm:px-6">
            <div className="flex items-center">
                <button
                    className="mr-4 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 active:scale-95 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Toggle menu"
                >
                    <Menu size={22} />
                </button>

                {/* Search Bar */}
                <div className="hidden items-center sm:flex">
                    <div className="relative w-80 lg:w-96">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                            <Search size={17} />
                        </span>
                        <input
                            type="text"
                            placeholder="Cari menu, informasi, atau nama..."
                            className="block w-full rounded-full border border-gray-200 bg-gray-50/60 py-2 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Notification Bell */}
                <button
                    type="button"
                    aria-label="Notifikasi"
                    className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 active:scale-95"
                >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>

                {/* User Profile Dropdown Trigger */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className={`group flex items-center space-x-3 rounded-2xl p-1.5 transition-all duration-200 focus:outline-none active:scale-[0.98] ${
                            isDropdownOpen
                                ? 'bg-gray-100/80 ring-2 ring-blue-500/20'
                                : 'hover:bg-gray-50'
                        }`}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        <div className="hidden flex-col items-end text-right sm:flex">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
                                    {user?.name || 'Pengguna'}
                                </span>
                                {isViewOnly && (
                                    <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-purple-500/15">
                                        View Only
                                    </span>
                                )}
                            </div>
                            <span className="max-w-[180px] truncate text-xs font-normal text-gray-500">
                                {user?.lembaga ||
                                    (user?.role === 'admin'
                                        ? 'Administrator'
                                        : 'Pengguna')}
                            </span>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100/80 font-semibold text-blue-700 shadow-2xs ring-1 ring-blue-500/15 transition group-hover:shadow-xs">
                            <UserIcon size={19} strokeWidth={2.2} />
                        </div>

                        <ChevronDown
                            size={15}
                            className={`text-gray-400 transition-transform duration-200 ${
                                isDropdownOpen
                                    ? 'rotate-180 text-blue-600'
                                    : 'group-hover:text-gray-600'
                            }`}
                        />
                    </button>

                    {/* Popover Dropdown */}
                    {isDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.12),0_4px_12px_-4px_rgba(15,23,42,0.06)] ring-1 ring-black/5 duration-150">
                                {/* Account Context Block */}
                                <div className="mb-1 rounded-xl bg-slate-50/80 px-3.5 py-3">
                                    <div className="mb-1 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                                        <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                                            Akun Aktif
                                        </p>
                                    </div>
                                    <p className="truncate text-sm font-bold text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="truncate text-xs text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>

                                <div className="space-y-0.5 pt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setIsPasswordModalOpen(true);
                                        }}
                                        className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50/80 hover:text-blue-700 active:scale-[0.98]"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition group-hover:bg-blue-100 group-hover:text-blue-700">
                                            <KeyRound size={15} />
                                        </div>
                                        <span>Ganti Password</span>
                                    </button>

                                    <div className="my-1 border-t border-gray-100" />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50/80 active:scale-[0.98]"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition group-hover:bg-rose-100 group-hover:text-rose-600">
                                            <LogOut size={15} />
                                        </div>
                                        <span>Keluar</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal Ganti Password */}
            {mounted &&
                isPasswordModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <div
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                                onClick={handleCloseModal}
                            />

                            <div className="animate-in fade-in zoom-in-95 relative z-10 my-8 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 duration-150">
                                {/* Modal Header */}
                                <div className="relative border-b border-gray-100 bg-gradient-to-b from-slate-50/80 to-white px-6 pt-6 pb-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
                                                <ShieldCheck
                                                    size={22}
                                                    strokeWidth={2.2}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold tracking-tight text-gray-900">
                                                    Ganti Password
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    Perbarui password akun Anda
                                                    secara aman.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:scale-95"
                                            aria-label="Tutup modal"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Form */}
                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="space-y-4 p-6"
                                >
                                    {/* Password Saat Ini */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                            Password Saat Ini
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showCurrentPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={data.current_password}
                                                onChange={(e) =>
                                                    setData(
                                                        'current_password',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Masukkan password saat ini"
                                                className={`block w-full rounded-xl border py-2.5 pr-11 pl-3.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${
                                                    errors.current_password
                                                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15'
                                                }`}
                                                required
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        !showCurrentPassword,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.current_password && (
                                            <p className="mt-1.5 text-xs font-medium text-rose-600">
                                                {errors.current_password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Baru */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showNewPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Minimal 6 karakter"
                                                className={`block w-full rounded-xl border py-2.5 pr-11 pl-3.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${
                                                    errors.password
                                                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15'
                                                }`}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-600"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1.5 text-xs font-medium text-rose-600">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Konfirmasi Password Baru */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-gray-700">
                                            Konfirmasi Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Ulangi password baru"
                                                className={`block w-full rounded-xl border py-2.5 pr-11 pl-3.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:outline-none ${
                                                    errors.password_confirmation
                                                        ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15'
                                                }`}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="mt-1.5 text-xs font-medium text-rose-600">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-gray-100 pt-5">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 active:scale-95"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {processing && (
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            )}
                                            <span>
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan Password'}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </header>
    );
}
