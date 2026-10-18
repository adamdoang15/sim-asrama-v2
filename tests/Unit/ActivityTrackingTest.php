<?php

use App\Domain\ActivityTracking;
use App\Models\DailyActivity;
use App\Models\Gelara;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('sliceWeeks partitions month days into available week intervals', function () {
    $carbonMonth = Carbon::parse('2026-10-01')->locale('id');
    $weeks = ActivityTracking::sliceWeeks($carbonMonth);

    expect($weeks)->toBeArray();
    expect($weeks)->not->toBeEmpty();
    expect($weeks[0])->toHaveKeys(['week', 'start', 'end', 'start_label', 'end_label']);
    expect($weeks[0]['start'])->toBe('2026-10-01');
});

test('resolveActiveWeek resolves requested week or falls back properly', function () {
    $carbonMonth = Carbon::parse('2026-10-01')->locale('id');
    $currentDate = Carbon::parse('2026-10-15')->locale('id');
    $availableWeeks = ActivityTracking::sliceWeeks($carbonMonth);

    // Explicit week requested
    $resolved = ActivityTracking::resolveActiveWeek($availableWeeks, 2, $currentDate, $carbonMonth);
    expect($resolved['selected_week'])->toBe(2);
    expect($resolved['week_label'])->toContain('minggu 2');
    expect($resolved['start_of_week'])->toBeInstanceOf(Carbon::class);

    // Fallback to week 1 when requested week is null and month is different
    $differentMonth = Carbon::parse('2026-05-01')->locale('id');
    $fallbackWeeks = ActivityTracking::sliceWeeks($differentMonth);
    $resolvedFallback = ActivityTracking::resolveActiveWeek($fallbackWeeks, null, $currentDate, $differentMonth);
    expect($resolvedFallback['selected_week'])->toBe(1);
});

test('compileRekap calculates accurate weekly and monthly attendance counts and percentages', function () {
    $gelara = Gelara::create([
        'nig' => '12345',
        'name' => 'Santri Test',
        'ttl' => 'Bandung, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah',
        'ibu' => 'Ibu',
        'domisili' => 'Asrama',
        'kelas' => '10A',
    ]);

    // Record on 2026-10-13 (Inside Week 2)
    $rec1 = new DailyActivity([
        'gelara_id' => $gelara->id,
        'date' => '2026-10-13',
        'activities' => [
            'sholat subuh' => ['status' => 'H'],
            'TC' => ['status' => 'A'],
        ],
    ]);

    // Record on 2026-10-25 (Outside Week 2, but inside October)
    $rec2 = new DailyActivity([
        'gelara_id' => $gelara->id,
        'date' => '2026-10-25',
        'activities' => [
            'sholat subuh' => ['status' => 'I'],
            'sholat maghrib' => ['status' => 'S'],
        ],
    ]);

    $grouped = collect([$gelara->id => collect([$rec1, $rec2])]);
    $startOfWeek = Carbon::parse('2026-10-11')->startOfDay();
    $endOfWeek = Carbon::parse('2026-10-17')->endOfDay();

    $rekap = ActivityTracking::compileRekap(collect([$gelara]), $grouped, $startOfWeek, $endOfWeek);

    expect($rekap)->toHaveKey($gelara->id);
    $data = $rekap[$gelara->id];

    // Weekly metrics (only rec1)
    expect($data['hadir_minggu'])->toBe(1);
    expect($data['a_minggu'])->toBe(1);
    expect($data['total_minggu'])->toBe(2);
    expect($data['progress_mingguan'])->toBe(50.0);

    // Monthly metrics (rec1 + rec2)
    expect($data['hadir_bulan'])->toBe(1);
    expect($data['izin_bulan'])->toBe(1);
    expect($data['sakit_bulan'])->toBe(1);
    expect($data['a_bulan'])->toBe(1);
    expect($data['total_bulan'])->toBe(4);
    expect($data['progress_bulanan'])->toBe(25.0);
});

test('compileDailyTrends aggregates daily percentage distribution for chart', function () {
    $carbonMonth = Carbon::parse('2026-10-01')->locale('id');

    $record = new DailyActivity([
        'date' => '2026-10-13',
        'activities' => [
            'piket' => ['status' => 'H'],
            'olahraga' => ['status' => 'H'],
            'apel' => ['status' => 'A'],
        ],
    ]);

    $byDate = collect(['2026-10-13' => collect([$record])]);
    $trends = ActivityTracking::compileDailyTrends($carbonMonth, $byDate);

    expect($trends)->toBeArray();
    expect($trends)->toHaveCount(1);
    expect($trends[0]['date'])->toBe('2026-10-13');
    expect($trends[0]['total'])->toBe(3);
    expect($trends[0]['hadir'])->toBe(66.7);
    expect($trends[0]['alfa'])->toBe(33.3);
});

test('recordBulkAttendance updates or creates records across multiple gelaras', function () {
    $gelara1 = Gelara::create([
        'nig' => 'NIG01',
        'name' => 'Santri 1',
        'ttl' => 'Subang, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'A1',
        'ibu' => 'I1',
        'domisili' => 'Asrama',
        'kelas' => '10A',
    ]);
    $gelara2 = Gelara::create([
        'nig' => 'NIG02',
        'name' => 'Santri 2',
        'ttl' => 'Subang, 02-02-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'A2',
        'ibu' => 'I2',
        'domisili' => 'Asrama',
        'kelas' => '10A',
    ]);

    ActivityTracking::recordBulkAttendance([
        [
            'gelara_id' => $gelara1->id,
            'activities' => ['sholat subuh' => ['status' => 'H']],
        ],
        [
            'gelara_id' => $gelara2->id,
            'activities' => ['sholat subuh' => ['status' => 'I']],
        ],
    ], '2026-10-18', 'Lembaga 1');

    $all = DailyActivity::all();
    expect($all)->toHaveCount(2);

    $saved1 = DailyActivity::where('gelara_id', $gelara1->id)->first();
    $saved2 = DailyActivity::where('gelara_id', $gelara2->id)->first();

    expect($saved1)->not->toBeNull();
    expect($saved1->date?->toDateString())->toBe('2026-10-18');
    expect($saved1->activities['sholat subuh']['status'])->toBe('H');
    expect($saved2)->not->toBeNull();
    expect($saved2->date?->toDateString())->toBe('2026-10-18');
    expect($saved2->activities['sholat subuh']['status'])->toBe('I');
});
