import { Head, useForm } from '@inertiajs/react';
import { Lock, LogIn, Mail, ShieldAlert } from 'lucide-react';
import React from 'react';

const DEMO_ACCOUNTS = [
    {
        label: 'LKP Cicantayan',
        email: 'cicantayan@doabangsa.sch.id',
        badge: 'Full Akses',
        badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
        label: 'LKP Banjarbaru',
        email: 'banjarbaru@doabangsa.sch.id',
        badge: 'Full Akses',
        badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
        label: 'Ponpes Doa Bangsa',
        email: 'ponpes@doabangsa.sch.id',
        badge: 'Full Akses',
        badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
        label: 'Yayasan',
        email: 'yayasan@doabangsa.sch.id',
        badge: 'View Only',
        badgeColor: 'bg-purple-100 text-purple-800',
    },
];

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    const fillDemo = (email: string) => {
        setData((prev) => ({
            ...prev,
            email,
            password: 'password',
        }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Head title="Masuk ke Sistem" />

            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                        <Lock className="h-7 w-7" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                        SIM Asrama & Sekolah
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Silakan masuk dengan akun lembaga Anda
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    {errors.email && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                            <ShieldAlert className="h-4 w-4 shrink-0" />
                            <span>{errors.email}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase">
                                Alamat Email
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Mail className="h-4 w-4" />
                                </span>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="nama@doabangsa.sch.id"
                                    required
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Lock className="h-4 w-4" />
                                </span>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span>Ingat saya</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-50"
                        >
                            <LogIn className="h-4 w-4" />
                            <span>
                                {processing
                                    ? 'Memproses...'
                                    : 'Masuk ke Sistem'}
                            </span>
                        </button>
                    </form>

                    {/* Quick Demo Accounts Selection */}
                    <div className="mt-6 border-t border-gray-100 pt-5">
                        <p className="text-center text-xs font-medium text-gray-500">
                            Pilih Akun Demo Cepat (Password:{' '}
                            <code className="font-mono text-gray-700">
                                password
                            </code>
                            ):
                        </p>
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {DEMO_ACCOUNTS.map((acc) => (
                                <button
                                    key={acc.email}
                                    type="button"
                                    onClick={() => fillDemo(acc.email)}
                                    className="flex flex-col items-start rounded-lg border border-gray-200 p-2 text-left transition hover:border-primary hover:bg-gray-50"
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-800">
                                            {acc.label}
                                        </span>
                                        <span
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${acc.badgeColor}`}
                                        >
                                            {acc.badge}
                                        </span>
                                    </div>
                                    <span className="mt-0.5 w-full truncate text-[11px] text-gray-500">
                                        {acc.email}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
