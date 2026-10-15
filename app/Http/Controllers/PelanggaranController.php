<?php

namespace App\Http\Controllers;

use App\Models\Gelara;
use App\Models\Pelanggaran;
use App\Models\Prestasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PelanggaranController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $pelanggaranQuery = Pelanggaran::latest();
        $prestasiQuery = Prestasi::latest();
        $gelaraQuery = Gelara::query();

        if ($user && $user->lembaga !== 'Yayasan') {
            $pelanggaranQuery->where('lembaga', $user->lembaga);
            $prestasiQuery->where('lembaga', $user->lembaga);
            $gelaraQuery->where('lembaga', $user->lembaga);
        }

        $pelanggarans = $pelanggaranQuery->get();
        $prestasis = $prestasiQuery->get();
        $gelaras = $gelaraQuery->get(['id', 'name', 'nig']);

        return inertia('Kegelaraan/TrackRecord', [
            'pelanggarans' => $pelanggarans,
            'prestasis' => $prestasis,
            'gelaras' => $gelaras,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:255',
            'category' => 'required|string',
            'type' => 'required|string',
            'descTitle' => 'required|string',
            'descSub' => 'nullable|string',
        ]);

        $validated['date'] = date('Y-m-d');
        $validated['time'] = date('H:i');
        $validated['petugas'] = auth()->user() ? auth()->user()->name : 'Petugas';
        $validated['isSystem'] = false;

        if ($request->hasFile('attachment')) {
            $request->validate(['attachment' => 'file|mimes:pdf|max:2048']);
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $user = $request->user();
        $validated['lembaga'] = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

        Pelanggaran::create($validated);

        return back()->with('success', 'Pelanggaran berhasil dicatat');
    }

    public function update(Request $request, $id)
    {
        $pelanggaran = Pelanggaran::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:255',
            'category' => 'required|string',
            'type' => 'required|string',
            'descTitle' => 'required|string',
            'descSub' => 'nullable|string',
        ]);

        if ($request->hasFile('attachment')) {
            $request->validate(['attachment' => 'file|mimes:pdf|max:2048']);
            if ($pelanggaran->attachment) {
                Storage::disk('public')->delete($pelanggaran->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $pelanggaran->update($validated);

        return back()->with('success', 'Data pelanggaran berhasil diperbarui');
    }

    public function destroy($id)
    {
        $pelanggaran = Pelanggaran::findOrFail($id);
        if ($pelanggaran->attachment) {
            Storage::disk('public')->delete($pelanggaran->attachment);
        }
        $pelanggaran->delete();

        return back()->with('success', 'Data pelanggaran berhasil dihapus');
    }
}
