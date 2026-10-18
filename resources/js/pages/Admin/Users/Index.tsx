import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Edit2,
    Lock,
    Mail,
    Plus,
    Search,
    Shield,
    Trash2,
    User,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    lembaga: string;
    role: string;
    created_at: string;
}

interface PageProps {
    users: UserData[];
    filters: {
        search?: string;
        lembaga?: string;
        role?: string;
    };
    lembagaOptions: string[];
    roleOptions: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function UsersIndex({
    users,
    filters,
    lembagaOptions,
    roleOptions,
}: PageProps) {
    const { flash, auth } = usePage<any>().props;
    const currentUserId = auth?.user?.id;

    const [search, setSearch] = useState(filters.search || '');
    const [selectedLembaga, setSelectedLembaga] = useState(
        filters.lembaga || '',
    );
    const [selectedRole, setSelectedRole] = useState(filters.role || '');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);

    // Inertia form
    const form = useForm({
        name: '',
        email: '',
        password: '',
        lembaga: lembagaOptions[0] || 'LKP Doa Bangsa Cicantayan',
        roles: ['kesekretariatan'] as string[],
    });

    // Handle filter submit
    const handleFilter = (
        newLembaga = selectedLembaga,
        newRole = selectedRole,
        newSearch = search,
    ) => {
        router.get(
            '/admin/users',
            {
                search: newSearch || undefined,
                lembaga: newLembaga || undefined,
                role: newRole || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter();
    };

    const openCreateModal = () => {
        setEditingUser(null);
        form.reset();
        form.clearErrors();
        form.setData({
            name: '',
            email: '',
            password: '',
            lembaga: lembagaOptions[0] || 'LKP Doa Bangsa Cicantayan',
            roles: ['kesekretariatan'],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (targetUser: UserData) => {
        setEditingUser(targetUser);
        form.clearErrors();
        const parsedRoles = targetUser.role
            ? targetUser.role
                  .split(',')
                  .map((r) => r.trim())
                  .filter(Boolean)
            : ['kesekretariatan'];
        form.setData({
            name: targetUser.name,
            email: targetUser.email,
            password: '',
            lembaga: targetUser.lembaga,
            roles: parsedRoles.length > 0 ? parsedRoles : ['kesekretariatan'],
        });
        setIsModalOpen(true);
    };

    const toggleRole = (roleKey: string) => {
        const current = form.data.roles || [];
        if (current.includes(roleKey)) {
            if (current.length > 1) {
                form.setData(
                    'roles',
                    current.filter((r) => r !== roleKey),
                );
            }
        } else {
            form.setData('roles', [...current, roleKey]);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            form.put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            form.post('/admin/users', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (targetUser: UserData) => {
        if (targetUser.id === currentUserId) {
            alert('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }

        if (
            confirm(
                `Apakah Anda yakin ingin menghapus akun "${targetUser.name}" (${targetUser.email})?`,
            )
        ) {
            router.delete(`/admin/users/${targetUser.id}`);
        }
    };

    // Helper: Styling badge lembaga
    const getLembagaBadge = (lembaga: string) => {
        switch (lembaga) {
            case 'LKP Doa Bangsa Cicantayan':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'LKP Doa Bangsa Banjarbaru':
                return 'bg-sky-50 text-sky-700 border-sky-200';
            case 'Ponpes Doa Bangsa':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Yayasan':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    // Helper: Styling badge role
    const getRoleBadge = (role: string) => {
        if (role === 'administrasi' || role === 'admin') {
            return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
        }
        if (role === 'viewer') {
            return 'bg-purple-50 text-purple-700 border-purple-200';
        }
        if (role === 'pengajar') {
            return 'bg-teal-50 text-teal-700 border-teal-200 font-medium';
        }
        if (role === 'kurikulum' || role === 'kesekretariatan') {
            return 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
        }
        return 'bg-slate-50 text-slate-700 border-slate-200';
    };

    // Stats calculations
    const totalUsers = users.length;
    const totalSuperAdmins = users.filter((u) => {
        const roles = u.role.split(',').map((r) => r.trim());
        return roles.includes('administrasi') || roles.includes('admin');
    }).length;
    const totalYayasan = users.filter((u) => u.lembaga === 'Yayasan').length;

    return (
        <DashboardLayout>
            <Head title="Manajemen User - Super Admin" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-xs">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-xs">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                        <span className="font-medium">{flash.error}</span>
                    </div>
                )}

                {/* Header Banner Berwarna */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xs">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold tracking-tight text-white">
                                        Manajemen Pengguna
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-200">
                                        <Shield className="h-3 w-3 text-blue-300" />
                                        Super Admin Control
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-200 sm:text-sm">
                                    Kelola seluruh akun pengguna, lembaga, dan
                                    pembagian hak akses role di dalam sistem
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-500 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Pengguna</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Total Pengguna
                            </span>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalUsers}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Super Admin
                            </span>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalSuperAdmins}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <UserCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Pengawas Yayasan
                            </span>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalYayasan}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex-1"
                    >
                        <Search className="absolute inset-y-0 left-0 my-auto ml-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau email pengguna..."
                            className="w-full rounded-xl border border-gray-200 py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                    </form>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedLembaga}
                            onChange={(e) => {
                                setSelectedLembaga(e.target.value);
                                handleFilter(
                                    e.target.value,
                                    selectedRole,
                                    search,
                                );
                            }}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                            <option value="">Semua Lembaga</option>
                            {lembagaOptions.map((lem) => (
                                <option key={lem} value={lem}>
                                    {lem}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                handleFilter(
                                    selectedLembaga,
                                    e.target.value,
                                    search,
                                );
                            }}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                            <option value="">Semua Role</option>
                            {Object.entries(roleOptions).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        {(search || selectedLembaga || selectedRole) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setSelectedLembaga('');
                                    setSelectedRole('');
                                    handleFilter('', '', '');
                                }}
                                className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 active:scale-[0.98]"
                            >
                                <X className="h-3.5 w-3.5" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Pengguna</th>
                                    <th className="px-6 py-4">Lembaga</th>
                                    <th className="px-6 py-4">
                                        Role / Hak Akses
                                    </th>
                                    <th className="px-6 py-4">Terdaftar</th>
                                    <th className="px-6 py-4 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.length > 0 ? (
                                    users.map((item) => {
                                        const isSelf =
                                            item.id === currentUserId;
                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-gray-50/60"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary uppercase">
                                                            {item.name.charAt(
                                                                0,
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-semibold text-gray-900">
                                                                    {item.name}
                                                                </span>
                                                                {isSelf && (
                                                                    <span className="py-0.2 rounded bg-blue-100 px-1.5 text-[10px] font-semibold text-blue-700">
                                                                        Akun
                                                                        Anda
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {item.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${getLembagaBadge(
                                                            item.lembaga,
                                                        )}`}
                                                    >
                                                        {item.lembaga ||
                                                            'Tidak Ditentukan'}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex max-w-xs flex-wrap gap-1.5">
                                                        {item.role
                                                            .split(',')
                                                            .map((r) =>
                                                                r.trim(),
                                                            )
                                                            .filter(Boolean)
                                                            .map((r) => (
                                                                <span
                                                                    key={r}
                                                                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${getRoleBadge(
                                                                        r,
                                                                    )}`}
                                                                >
                                                                    {roleOptions[
                                                                        r
                                                                    ] || r}
                                                                </span>
                                                            ))}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    item,
                                                                )
                                                            }
                                                            title="Edit Pengguna"
                                                            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={isSelf}
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item,
                                                                )
                                                            }
                                                            title={
                                                                isSelf
                                                                    ? 'Tidak dapat menghapus akun sendiri'
                                                                    : 'Hapus Pengguna'
                                                            }
                                                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="h-8 w-8 text-gray-300" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    Tidak ada data pengguna yang
                                                    ditemukan
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Coba sesuaikan kata kunci
                                                    pencarian atau filter
                                                    lembaga/role.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Dialog: Tambah / Edit Pengguna */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-7">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingUser
                                        ? 'Edit Data Pengguna'
                                        : 'Tambah Pengguna Baru'}
                                </h3>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {editingUser
                                        ? 'Perbarui informasi profil, unit lembaga, atau hak akses role.'
                                        : 'Buat akun baru untuk staf atau pengawas lembaga.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-5 space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase">
                                    Nama Lengkap
                                </label>
                                <div className="relative mt-1">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                        <User className="h-4 w-4" />
                                    </span>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        placeholder="Contoh: Budi Santoso"
                                        required
                                        className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                                {form.errors.name && (
                                    <span className="mt-1 block text-xs font-medium text-rose-600">
                                        {form.errors.name}
                                    </span>
                                )}
                            </div>

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
                                        value={form.data.email}
                                        onChange={(e) =>
                                            form.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="nama@doabangsa.sch.id"
                                        required
                                        className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                                {form.errors.email && (
                                    <span className="mt-1 block text-xs font-medium text-rose-600">
                                        {form.errors.email}
                                    </span>
                                )}
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
                                        value={form.data.password}
                                        onChange={(e) =>
                                            form.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={
                                            editingUser
                                                ? 'Kosongkan jika tidak ingin mengubah'
                                                : 'Minimal 6 karakter'
                                        }
                                        required={!editingUser}
                                        className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                    />
                                </div>
                                {form.errors.password && (
                                    <span className="mt-1 block text-xs font-medium text-rose-600">
                                        {form.errors.password}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase">
                                    Lembaga
                                </label>
                                <select
                                    value={form.data.lembaga}
                                    onChange={(e) =>
                                        form.setData('lembaga', e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                                >
                                    {lembagaOptions.map((lem) => (
                                        <option key={lem} value={lem}>
                                            {lem}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.lembaga && (
                                    <span className="mt-1 block text-xs font-medium text-rose-600">
                                        {form.errors.lembaga}
                                    </span>
                                )}
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="block text-xs font-semibold text-gray-700 uppercase">
                                        Role / Hak Akses{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <span className="text-[11px] font-medium text-gray-400">
                                        {form.data.roles?.length || 0} role
                                        dipilih (bisa lebih dari 1)
                                    </span>
                                </div>
                                <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {Object.entries(roleOptions).map(
                                        ([key, label]) => {
                                            const isSelected =
                                                form.data.roles?.includes(key);
                                            return (
                                                <label
                                                    key={key}
                                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 text-xs transition-all select-none active:scale-[0.99] ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-50/60 font-semibold text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleRole(key)
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="truncate">
                                                        {label}
                                                    </span>
                                                </label>
                                            );
                                        },
                                    )}
                                </div>
                                {(form.errors.roles ||
                                    (form.errors as any).role) && (
                                    <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                        {form.errors.roles ||
                                            (form.errors as any).role}
                                    </span>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Menyimpan...'
                                        : editingUser
                                          ? 'Perbarui User'
                                          : 'Simpan User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
