<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PrestasiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'level' => 'required|string|max:255',
        ]);

        $validated['date'] = date('Y-m-d');

        if ($request->hasFile('attachment')) {
            $request->validate(['attachment' => 'file|mimes:pdf|max:2048']);
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        if ($request->filled('lembaga')) {
            $validated['lembaga'] = $request->input('lembaga');
        }

        Prestasi::create($validated);

        return back()->with('success', 'Prestasi berhasil dicatat');
    }

    public function update(Request $request, $id)
    {
        $prestasi = Prestasi::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nim' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'level' => 'required|string|max:255',
        ]);

        if ($request->hasFile('attachment')) {
            $request->validate(['attachment' => 'file|mimes:pdf|max:2048']);
            if ($prestasi->attachment) {
                Storage::disk('public')->delete($prestasi->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $prestasi->update($validated);

        return back()->with('success', 'Data prestasi berhasil diperbarui');
    }

    public function destroy($id)
    {
        $prestasi = Prestasi::findOrFail($id);
        if ($prestasi->attachment) {
            Storage::disk('public')->delete($prestasi->attachment);
        }
        $prestasi->delete();

        return back()->with('success', 'Data prestasi berhasil dihapus');
    }
}
