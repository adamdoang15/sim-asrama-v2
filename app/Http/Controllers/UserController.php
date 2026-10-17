<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $lembaga = $request->input('lembaga', '');
        $role = $request->input('role', '');

        $query = User::query()->latest('id');

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (! empty($lembaga)) {
            $query->where('lembaga', $lembaga);
        }

        if (! empty($role)) {
            $query->where('role', 'like', "%{$role}%");
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->get(),
            'filters' => [
                'search' => $search,
                'lembaga' => $lembaga,
                'role' => $role,
            ],
            'lembagaOptions' => [
                'LKP Doa Bangsa Cicantayan',
                'LKP Doa Bangsa Banjarbaru',
                'Ponpes Doa Bangsa',
                'Yayasan',
            ],
            'roleOptions' => [
                'administrasi' => 'Administrasi (Super Admin)',
                'kesekretariatan' => 'Staf Kesekretariatan',
                'kegelaraan' => 'Staf Kegelaraan',
                'kurikulum' => 'Staf Kurikulum',
                'kesehatan' => 'Staf Kesehatan',
                'sarpras' => 'Staf Sarpras',
                'keuangan' => 'Staf Keuangan',
                'pengajar' => 'Pengajar / Guru',
                'viewer' => 'Viewer (Khusus Yayasan)',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $rolesInput = $request->input('roles') ?? ($request->input('role') ? (is_array($request->input('role')) ? $request->input('role') : explode(',', $request->input('role'))) : []);
        $request->merge(['roles' => array_values(array_filter(array_map('trim', (array) $rolesInput)))]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'lembaga' => 'required|string',
            'roles' => 'required|array|min:1',
            'roles.*' => 'string',
        ], [
            'roles.required' => 'Pilih minimal satu role untuk user.',
            'roles.min' => 'Pilih minimal satu role untuk user.',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = implode(',', $validated['roles']);
        unset($validated['roles']);

        User::create($validated);

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $rolesInput = $request->input('roles') ?? ($request->input('role') ? (is_array($request->input('role')) ? $request->input('role') : explode(',', $request->input('role'))) : []);
        $request->merge(['roles' => array_values(array_filter(array_map('trim', (array) $rolesInput)))]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'lembaga' => 'required|string',
            'roles' => 'required|array|min:1',
            'roles.*' => 'string',
        ], [
            'roles.required' => 'Pilih minimal satu role untuk user.',
            'roles.min' => 'Pilih minimal satu role untuk user.',
        ]);

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $validated['role'] = implode(',', $validated['roles']);
        unset($validated['roles']);

        $user->update($validated);

        return back()->with('success', 'Data user berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        // Proteksi: Super admin tidak boleh menghapus akunnya sendiri yang sedang aktif
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
