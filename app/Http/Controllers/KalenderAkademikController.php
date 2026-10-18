<?php

namespace App\Http\Controllers;

use App\Models\KalenderAkademik;
use Illuminate\Http\Request;

class KalenderAkademikController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Kurikulum/KalenderAkademik', [
            'kegiatans' => KalenderAkademik::forUser($request->user())->orderBy('start_date', 'asc')->get(),
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

        KalenderAkademik::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, KalenderAkademik $kalender)
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

        $kalender->update($validated);

        return redirect()->back();
    }

    public function destroy(KalenderAkademik $kalender)
    {
        $kalender->delete();

        return redirect()->back();
    }
}
