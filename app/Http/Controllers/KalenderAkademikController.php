<?php

namespace App\Http\Controllers;

use App\Models\KalenderAkademik;
use Illuminate\Http\Request;

class KalenderAkademikController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = KalenderAkademik::orderBy('start_date', 'asc');
        if ($user && $user->lembaga !== 'Yayasan') {
            $query->where(fn ($q) => $q->where('lembaga', $user->lembaga)->orWhereNull('lembaga'));
        }
        $kegiatans = $query->get();

        return inertia('Kurikulum/KalenderAkademik', [
            'kegiatans' => $kegiatans,
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

        $user = $request->user();
        $validated['lembaga'] = $request->input('lembaga') ?? ($user && $user->lembaga !== 'Yayasan' ? $user->lembaga : 'LKP Doa Bangsa Cicantayan');

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
