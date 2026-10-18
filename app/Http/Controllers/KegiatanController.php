<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KegiatanController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Kegelaraan/Kalender', [
            'kegiatans' => Kegiatan::forUser($request->user())->orderBy('start_date', 'asc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'type' => 'required|string',
            'location' => 'nullable|string',
            'is_completed' => 'boolean',
        ]);

        if ($request->filled('lembaga')) {
            $validated['lembaga'] = $request->input('lembaga');
        }

        Kegiatan::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Kegiatan $kegiatan)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'type' => 'required|string',
            'location' => 'nullable|string',
            'is_completed' => 'boolean',
            'photo' => 'nullable|image|max:2048',
            'delete_photo' => 'nullable|boolean',
        ]);

        if ($request->boolean('delete_photo')) {
            if ($kegiatan->photo_path) {
                Storage::disk('public')->delete($kegiatan->photo_path);
                $validated['photo_path'] = null;
            }
        } elseif ($request->hasFile('photo')) {
            if ($kegiatan->photo_path) {
                Storage::disk('public')->delete($kegiatan->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('kegiatans', 'public');
        }

        unset($validated['photo'], $validated['delete_photo']);
        $kegiatan->update($validated);

        return redirect()->back();
    }

    public function destroy(Kegiatan $kegiatan)
    {
        $kegiatan->delete();

        return redirect()->back();
    }
}
