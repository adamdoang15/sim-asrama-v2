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

        // Super admin (administrasi / admin) memiliki akses penuh ke seluruh modul
        if ($user->role === 'administrasi' || $user->role === 'admin') {
            return $next($request);
        }

        // Modul khusus super admin (administrasi/admin) tidak dapat diakses oleh role lain termasuk Yayasan
        if (in_array('administrasi', $roles, true) || in_array('admin', $roles, true)) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak: Modul ini hanya untuk Super Admin.');
        }

        // Yayasan (viewer) boleh melihat modul operasional lainnya
        if ($user->role === 'viewer' || $user->lembaga === 'Yayasan') {
            return $next($request);
        }

        // Cek apakah role user ada di daftar role yang diizinkan untuk modul ini
        if (in_array($user->role, $roles, true)) {
            return $next($request);
        }

        return redirect()->route('dashboard')->with('error', 'Akses ditolak: Anda tidak memiliki izin untuk membuka modul ini.');
    }
}
