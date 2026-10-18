<?php

use App\Models\AnggaranBop;

test('bop page can be rendered and standard templates can be seeded', function () {
    // 1. Render BOP page
    $response = $this->get('/keuangan/bop?tahun_ajaran=2026/2027&bulan=Juli&tab=fkdb');
    $response->assertStatus(200);

    // 2. Seed standard template for FKDB
    $seedResponse = $this->post('/keuangan/bop/seed-template', [
        'tahun_ajaran' => '2026/2027',
        'bulan' => 'Juli',
        'sumber_dana' => 'fkdb',
    ]);
    $seedResponse->assertRedirect();

    expect(AnggaranBop::where('tahun_ajaran', '2026/2027')->where('bulan', 'Juli')->where('sumber_dana', 'fkdb')->count())
        ->toBeGreaterThan(0);

    // 3. Save a budget record
    $storeResponse = $this->post('/keuangan/bop', [
        'tahun_ajaran' => '2026/2027',
        'bulan' => 'Juli',
        'sumber_dana' => 'ot',
        'tipe' => 'pemasukan',
        'kategori' => 'Pemasukan Mandiri',
        'uraian' => 'Donasi Operasional',
        'plan' => 5000000,
        'aktual' => 5000000,
    ]);
    $storeResponse->assertRedirect();

    $item = AnggaranBop::where('uraian', 'Donasi Operasional')->first();
    expect($item)->not->toBeNull();
    expect((float) $item->aktual)->toBe(5000000.0);

    // 4. Delete the budget record
    $deleteResponse = $this->delete("/keuangan/bop/{$item->id}");
    $deleteResponse->assertRedirect();
    expect(AnggaranBop::find($item->id))->toBeNull();
});
