<?php

use App\Models\DailyActivity;
use App\Models\Gelara;

test('rekap akumulasi returns null for unrecorded weeks and accurate percentage for filled dates', function () {
    $gelara = Gelara::first() ?? Gelara::create([
        'nig' => '12345',
        'name' => 'Test Gelara',
        'ttl' => 'Jakarta, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah Test',
        'ibu' => 'Ibu Test',
        'domisili' => 'Asrama',
        'kelas' => '10A',
    ]);

    // Record only on 2026-10-13 (Week 2): 1 Hadir, 1 Alfa
    DailyActivity::updateOrCreate(
        ['gelara_id' => $gelara->id, 'date' => '2026-10-13'],
        ['activities' => [
            'Bangun tidur' => ['status' => 'H', 'note' => ''],
            'Nonton bareng' => ['status' => 'A', 'note' => 'Telat'],
        ]]
    );

    // Filter Week 2 (contains 2026-10-13)
    $responseW2 = $this->get('/kegelaraan/daily-activity?month=2026-10&week=2&date=2026-10-13');
    $responseW2->assertStatus(200);
    $propsW2 = $responseW2->original->getData()['page']['props'];
    $rekapW2 = $propsW2['rekapData'][$gelara->id];

    expect($rekapW2['hadir_minggu'])->toBe(1);
    expect($rekapW2['a_minggu'])->toBe(1);
    expect($rekapW2['total_minggu'])->toBe(2);
    expect($rekapW2['progress_mingguan'])->toBe(50.0);

    // Filter Week 1 (no records)
    $responseW1 = $this->get('/kegelaraan/daily-activity?month=2026-10&week=1&date=2026-10-13');
    $responseW1->assertStatus(200);
    $propsW1 = $responseW1->original->getData()['page']['props'];
    $rekapW1 = $propsW1['rekapData'][$gelara->id];

    expect($rekapW1['total_minggu'])->toBe(0);
    expect($rekapW1['progress_mingguan'])->toBeNull();

    // Verify trendData in month 2026-10
    expect($propsW2['trendData'])->toBeArray();
    expect($propsW2['trendData'])->toHaveCount(1);
    expect($propsW2['trendData'][0]['date'])->toBe('2026-10-13');
    expect($propsW2['trendData'][0]['hadir'])->toBe(50.0);
    expect($propsW2['trendData'][0]['alfa'])->toBe(50.0);
});
