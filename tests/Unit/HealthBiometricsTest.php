<?php

use App\Domain\HealthBiometrics;
use App\Models\Gelara;
use App\Models\Kesehatan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('calculateImt calculates BMI accurately and handles invalid input', function () {
    // 60 kg, 170 cm -> 60 / (1.7^2) = 60 / 2.89 = 20.76
    $imt = HealthBiometrics::calculateImt(60, 170);
    expect($imt)->toBe(20.76);

    // Invalid / zero inputs
    expect(HealthBiometrics::calculateImt(null, 170))->toBeNull();
    expect(HealthBiometrics::calculateImt(60, null))->toBeNull();
    expect(HealthBiometrics::calculateImt(60, 0))->toBeNull();
    expect(HealthBiometrics::calculateImt(0, 170))->toBeNull();
});

test('classifyImt maps BMI values to correct Kemenkes categories', function () {
    expect(HealthBiometrics::classifyImt(17.0))->toBe(HealthBiometrics::IMT_KURUS);
    expect(HealthBiometrics::classifyImt(18.4))->toBe(HealthBiometrics::IMT_KURUS);

    expect(HealthBiometrics::classifyImt(18.5))->toBe(HealthBiometrics::IMT_IDEAL);
    expect(HealthBiometrics::classifyImt(22.0))->toBe(HealthBiometrics::IMT_IDEAL);
    expect(HealthBiometrics::classifyImt(24.9))->toBe(HealthBiometrics::IMT_IDEAL);

    expect(HealthBiometrics::classifyImt(25.0))->toBe(HealthBiometrics::IMT_GEMUK);
    expect(HealthBiometrics::classifyImt(29.9))->toBe(HealthBiometrics::IMT_GEMUK);

    expect(HealthBiometrics::classifyImt(30.0))->toBe(HealthBiometrics::IMT_OBESITAS);
    expect(HealthBiometrics::classifyImt(35.5))->toBe(HealthBiometrics::IMT_OBESITAS);

    expect(HealthBiometrics::classifyImt(null))->toBeNull();
    expect(HealthBiometrics::classifyImt(0))->toBeNull();
});

test('parseSicknessHistory aggregates severity and formats default structure', function () {
    $raw = [
        'ringan' => ['jumlah' => 3, 'keterangan' => 'Flu'],
        'sedang' => ['jumlah' => 1, 'keterangan' => 'Demam'],
    ];

    $parsed = HealthBiometrics::parseSicknessHistory($raw);
    expect($parsed['ringan'])->toBe(3);
    expect($parsed['sedang'])->toBe(1);
    expect($parsed['berat'])->toBe(0);
    expect($parsed['total'])->toBe(4);
    expect($parsed['formatted']['berat']['jumlah'])->toBe(0);
    expect($parsed['formatted']['berat']['keterangan'])->toBe('');

    // Null input
    $nullParsed = HealthBiometrics::parseSicknessHistory(null);
    expect($nullParsed['total'])->toBe(0);
    expect($nullParsed['formatted']['ringan']['jumlah'])->toBe(0);
});

test('aggregateCohortStats evaluates healthy, requiring attention, and unexamined counts', function () {
    $students = [
        ['sudah_diperiksa' => true, 'total_sakit' => 0], // Sehat
        ['sudah_diperiksa' => true, 'total_sakit' => 0], // Sehat
        ['sudah_diperiksa' => true, 'total_sakit' => 2], // Perlu Perhatian
        ['sudah_diperiksa' => false, 'total_sakit' => 0], // Belum diperiksa
    ];

    $stats = HealthBiometrics::aggregateCohortStats($students);

    expect($stats['total_santri'])->toBe(4);
    expect($stats['santri_sehat'])->toBe(2);
    expect($stats['perlu_perhatian'])->toBe(1);
    expect($stats['belum_diperiksa'])->toBe(1);
});

test('recordExamination auto-calculates IMT and saves record', function () {
    $gelara = Gelara::create([
        'nig' => 'MED001',
        'name' => 'Santri Medis',
        'ttl' => 'Jakarta, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah',
        'ibu' => 'Ibu',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
    ]);

    $exam = HealthBiometrics::recordExamination([
        'gelara_id' => $gelara->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'semester' => '1',
        'berat_badan' => 54,
        'tinggi_badan' => 165,
        'tensi' => '110/70',
        'tensi_kategori' => 'Normal',
        'catatan_kesehatan' => 'Sehat wal afiat',
    ]);

    expect($exam->id)->not->toBeNull();
    // 54 / (1.65^2) = 54 / 2.7225 = 19.83
    expect((float) $exam->imt)->toBe(19.83);
    expect($exam->imt_kategori)->toBe('Ideal');

    $saved = Kesehatan::where('gelara_id', $gelara->id)->first();
    expect($saved)->not->toBeNull();
    expect($saved->imt_kategori)->toBe('Ideal');
});
