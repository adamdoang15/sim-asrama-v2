<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckViewOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Abaikan route logout dan ganti password akun mandiri
        if ($request->routeIs('logout', 'profile.password') || $request->is('logout', 'profile/password')) {
            return $next($request);
        }

        $userRoles = array_map('trim', explode(',', (string) $user?->role));
        $isViewer = in_array('viewer', $userRoles, true) || $user?->lembaga === 'Yayasan';
        $hasOperationalRole = ! empty(array_diff($userRoles, ['viewer']));

        // Jika akun Yayasan atau akun murni viewer (tanpa role operasional lain) mencoba melakukan mutasi data (POST, PUT, PATCH, DELETE)
        if ($user && $isViewer && ! $hasOperationalRole && ! in_array($request->method(), ['GET', 'HEAD'])) {
            return back()->with('error', 'Akses Ditolak: Akun Yayasan hanya memiliki izin View Only.');
        }

        return $next($request);
    }
}
