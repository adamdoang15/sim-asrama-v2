<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $userRoles = array_map('trim', explode(',', (string) $user->role));

        // Super admin (administrasi / admin) memiliki akses penuh ke seluruh modul
        if (in_array('administrasi', $userRoles, true) || in_array('admin', $userRoles, true)) {
            return $next($request);
        }

        // Modul manajemen user (admin) khusus Super Admin, tidak dapat diakses role lain termasuk Yayasan
        if (in_array('admin', $roles, true)) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak: Modul ini hanya untuk Super Admin.');
        }

        // Yayasan (viewer) boleh melihat modul operasional lainnya
        if (in_array('viewer', $userRoles, true) || $user->lembaga === 'Yayasan') {
            return $next($request);
        }

        // Cek apakah ada irisan antara role user dengan daftar role yang diizinkan untuk modul ini
        if (! empty(array_intersect($userRoles, $roles))) {
            return $next($request);
        }

        return redirect()->route('dashboard')->with('error', 'Akses ditolak: Anda tidak memiliki izin untuk membuka modul ini.');
    }
}
