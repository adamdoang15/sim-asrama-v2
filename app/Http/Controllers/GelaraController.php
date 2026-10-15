<?php

namespace App\Http\Controllers;

use App\Models\Gelara;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class GelaraController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Gelara::latest();

        if ($user && $user->lembaga !== 'Yayasan') {
            $query->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nig', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('domisili', 'like', "%{$search}%");
            });
        }

        if ($request->filled('gender') && $request->gender !== 'Semua') {
            $query->where('jenis_kelamin', $request->gender);
        }

        if ($request->filled('angkatan')) {
            $query->where('angkatan', $request->angkatan);
        }

        if ($request->filled('tahun_ajaran')) {
            $query->where('tahun_diterima', $request->tahun_ajaran);
        }

        $baseQuery = Gelara::query();
        if ($user && $user->lembaga !== 'Yayasan') {
            $baseQuery->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }

        $angkatans = (clone $baseQuery)->select('angkatan')->distinct()->orderBy('angkatan', 'desc')->pluck('angkatan');
        $tahun_ajarans = (clone $baseQuery)->select('tahun_diterima')->distinct()->orderBy('tahun_diterima', 'desc')->pluck('tahun_diterima');

        $perPage = $request->input('per_page', 25);
        $students = $query->paginate($perPage)->withQueryString();

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'putra' => (clone $baseQuery)->where('jenis_kelamin', 'Laki-laki')->count(),
            'putri' => (clone $baseQuery)->where('jenis_kelamin', 'Perempuan')->count(),
        ];

        return Inertia::render('Kesekretariatan/DataGelara', [
            'students' => $students,
            'filters' => $request->only(['search', 'gender', 'angkatan', 'tahun_ajaran', 'per_page']),
            'angkatans' => $angkatans,
            'tahun_ajarans' => $tahun_ajarans,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nig' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'ttl' => 'required|string|max:255',
            'angkatan' => 'required|string|max:255',
            'tahun_diterima' => 'required|string|max:255',
            'kelas' => 'nullable|string|max:255',
            'nama_ayah' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'domisili' => 'nullable|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $isValid = ! empty($validated['nama_ayah']) &&
                   ! empty($validated['pekerjaan_ayah']) &&
                   ! empty($validated['nama_ibu']) &&
                   ! empty($validated['pekerjaan_ibu']) &&
                   ! empty($validated['domisili']) &&
                   $request->hasFile('foto');

        $validated['status_berkas'] = $isValid ? 'Berkas Lengkap' : 'Belum Valid';

        if ($request->hasFile('foto')) {
            $image = $request->file('foto');
            $filename = time().'_'.Str::slug($validated['name']).'.'.$image->getClientOriginalExtension();
            $path = storage_path('app/public/gelara');

            if (! file_exists($path)) {
                mkdir($path, 0755, true);
            }

            // Inisialisasi Intervention Image
            $manager = new ImageManager(new Driver);
            $img = $manager->decode($image);

            // Resize & crop (cover) otomatis ke rasio 2:3 (400x600 px)
            $img->cover(400, 600);

            // Simpan gambar dengan kualitas 75% untuk menghemat ukuran (kompres)
            $img->save($path.'/'.$filename, quality: 75);

            $validated['foto'] = 'storage/gelara/'.$filename;
        } else {
            $validated['foto'] = 'Belum Ada Foto';
        }

        // Buat avatar dari 2 huruf pertama nama
        $words = explode(' ', $validated['name']);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $w) {
            $initials .= strtoupper(substr($w, 0, 1));
        }
        $validated['avatar'] = $initials;

        $user = $request->user();
        $validated['lembaga'] = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        Gelara::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Gelara $gelara)
    {
        $validated = $request->validate([
            'nig' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'ttl' => 'required|string|max:255',
            'angkatan' => 'required|string|max:255',
            'tahun_diterima' => 'required|string|max:255',
            'kelas' => 'nullable|string|max:255',
            'domisili' => 'required|string',
            'nama_ayah' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'hapus_foto' => 'nullable|boolean',
        ]);

        $isValid = ! empty($validated['nama_ayah']) &&
                   ! empty($validated['pekerjaan_ayah']) &&
                   ! empty($validated['nama_ibu']) &&
                   ! empty($validated['pekerjaan_ibu']) &&
                   ! empty($validated['domisili']) &&
                   (isset($validated['foto']) || ($gelara->foto && $gelara->foto !== 'Belum Ada Foto' && ! $request->boolean('hapus_foto')));

        $validated['status_berkas'] = $isValid ? 'Berkas Lengkap' : 'Belum Valid';

        if ($request->boolean('hapus_foto')) {
            $validated['foto'] = 'Belum Ada Foto';
        } elseif ($request->hasFile('foto')) {
            $imageFile = $request->file('foto');
            $filename = time().'_'.Str::slug($validated['name']).'.'.$imageFile->getClientOriginalExtension();
            $path = storage_path('app/public/gelara');

            if (! file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $manager = new ImageManager(new Driver);
            $img = $manager->decode($imageFile);
            $img->cover(400, 600); // Rasio 2x3
            $img->save($path.'/'.$filename, quality: 75);
            $validated['foto'] = 'storage/gelara/'.$filename;
        }

        // Update avatar jika nama berubah
        $words = explode(' ', $validated['name']);
        $initials = '';
        foreach (array_slice($words, 0, 2) as $w) {
            $initials .= strtoupper(substr($w, 0, 1));
        }
        $validated['avatar'] = $initials;

        $gelara->update($validated);

        return redirect()->back();
    }

    public function destroy(Gelara $gelara)
    {
        $gelara->delete();

        return redirect()->back();
    }
}
