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

        // Abaikan route logout
        if ($request->routeIs('logout') || $request->is('logout')) {
            return $next($request);
        }

        // Jika akun Yayasan mencoba melakukan mutasi data (POST, PUT, PATCH, DELETE)
        if ($user && ($user->lembaga === 'Yayasan' || $user->role === 'viewer') && ! in_array($request->method(), ['GET', 'HEAD'])) {
            return back()->with('error', 'Akses Ditolak: Akun Yayasan hanya memiliki izin View Only.');
        }

        return $next($request);
    }
}
