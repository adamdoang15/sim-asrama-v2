<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class PegawaiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Pegawai::forUser($user)->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('niy', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('jabatan')) {
            $query->where('jabatan', 'like', '%'.$request->jabatan.'%');
        }

        if ($request->filled('status')) {
            $query->where('status_pegawai', $request->status);
        }

        if ($request->filled('gender')) {
            $query->where('jenis_kelamin', $request->gender);
        }

        $baseQuery = Pegawai::forUser($user);

        $perPage = $request->input('per_page', 25);
        $employees = $query->paginate($perPage)->withQueryString();

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'laki' => (clone $baseQuery)->where('jenis_kelamin', 'Laki-laki')->count(),
            'perempuan' => (clone $baseQuery)->where('jenis_kelamin', 'Perempuan')->count(),
            'tetap' => (clone $baseQuery)->where('status_pegawai', 'Pegawai Tetap Yayasan')->count(),
            'kontrak' => (clone $baseQuery)->where('status_pegawai', 'Kontrak Kerja')->count(),
        ];

        $jabatans = (clone $baseQuery)->pluck('jabatan')
            ->flatMap(fn ($j) => explode(',', (string) $j))
            ->map(fn ($j) => trim($j))
            ->filter()
            ->unique()
            ->values();

        return Inertia::render('Kesekretariatan/DataPegawai', [
            'employees' => $employees,
            'stats' => $stats,
            'jabatans' => $jabatans,
            'filters' => $request->only(['search', 'jabatan', 'status', 'gender']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'niy' => 'nullable|string|max:255|unique:pegawais',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'ttl' => 'required|string|max:255',
            'status_pegawai' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'tahun_masuk' => 'required|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('foto')) {
            $image = $request->file('foto');
            $filename = time().'_'.Str::slug($validated['name']).'.'.$image->getClientOriginalExtension();
            $path = storage_path('app/public/pegawai');

            if (! file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $manager = new ImageManager(new Driver);
            $img = $manager->decode($image);
            $img->cover(400, 600);
            $img->save($path.'/'.$filename, quality: 75);

            $validated['foto'] = $filename; // Just save filename as we will access it via /storage/pegawai/
        } else {
            $validated['foto'] = 'Belum Ada Foto';
        }

        if ($request->filled('lembaga')) {
            $validated['lembaga'] = $request->input('lembaga');
        }

        Pegawai::create($validated);

        return back()->with('success', 'Data pegawai berhasil ditambahkan');
    }

    public function update(Request $request, Pegawai $pegawai)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'niy' => 'nullable|string|max:255|unique:pegawais,niy,'.$pegawai->id,
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'ttl' => 'required|string|max:255',
            'status_pegawai' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'tahun_masuk' => 'required|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'hapus_foto' => 'nullable|boolean',
        ]);

        if (isset($validated['hapus_foto']) && $validated['hapus_foto']) {
            if ($pegawai->foto && $pegawai->foto !== 'Belum Ada Foto') {
                $oldPath = storage_path('app/public/pegawai/'.$pegawai->foto);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $validated['foto'] = 'Belum Ada Foto';
        } elseif ($request->hasFile('foto')) {
            if ($pegawai->foto && $pegawai->foto !== 'Belum Ada Foto') {
                $oldPath = storage_path('app/public/pegawai/'.$pegawai->foto);
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $image = $request->file('foto');
            $filename = time().'_'.Str::slug($validated['name']).'.'.$image->getClientOriginalExtension();
            $path = storage_path('app/public/pegawai');

            if (! file_exists($path)) {
                mkdir($path, 0755, true);
            }

            $manager = new ImageManager(new Driver);
            $img = $manager->decode($image);
            $img->cover(400, 600);
            $img->save($path.'/'.$filename, quality: 75);

            $validated['foto'] = $filename;
        } else {
            unset($validated['foto']);
        }

        unset($validated['hapus_foto']);
        $pegawai->update($validated);

        return back()->with('success', 'Data pegawai berhasil diperbarui');
    }

    public function destroy(Pegawai $pegawai)
    {
        if ($pegawai->foto && $pegawai->foto !== 'Belum Ada Foto') {
            $oldPath = storage_path('app/public/pegawai/'.$pegawai->foto);
            if (file_exists($oldPath)) {
                @unlink($oldPath);
            }
        }

        $pegawai->delete();

        return back()->with('success', 'Data pegawai berhasil dihapus');
    }
}
