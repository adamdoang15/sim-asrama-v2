<?php

use App\Domain\AcademicEvaluation;

test('calculateNilaiAkhir calculates weighted score accurately', function () {
    // Rerata harian (80, 90) = 85 -> 85 * 0.6 = 51
    // UTS (80) * 0.2 = 16
    // UAS (90) * 0.2 = 18
    // Total = 51 + 16 + 18 = 85.0
    $na = AcademicEvaluation::calculateNilaiAkhir(80, 90, 0, 0, 0, 80, 90);
    expect($na)->toBe(85.0);

    // Only 1 harian score
    // H1 (100) = 100 * 0.6 = 60
    // UTS (100) * 0.2 = 20
    // UAS (100) * 0.2 = 20
    // Total = 100.0
    $perfect = AcademicEvaluation::calculateNilaiAkhir(100, 0, 0, 0, 0, 100, 100);
    expect($perfect)->toBe(100.0);
});

test('calculatePredikat maps numeric grades to proper predicate letters', function () {
    expect(AcademicEvaluation::calculatePredikat(85.0))->toBe('A');
    expect(AcademicEvaluation::calculatePredikat(95.0))->toBe('A');
    expect(AcademicEvaluation::calculatePredikat(75.0))->toBe('B');
    expect(AcademicEvaluation::calculatePredikat(84.9))->toBe('B');
    expect(AcademicEvaluation::calculatePredikat(65.0))->toBe('C');
    expect(AcademicEvaluation::calculatePredikat(74.9))->toBe('C');
    expect(AcademicEvaluation::calculatePredikat(64.9))->toBe('D');
    expect(AcademicEvaluation::calculatePredikat(0.0))->toBe('D');
});

test('calculateDistribution aggregates distribution counts and percentages', function () {
    $students = collect([
        ['predikat' => 'A'],
        ['predikat' => 'A'],
        ['predikat' => 'B'],
        ['predikat' => 'C'],
    ]);

    $distribution = AcademicEvaluation::calculateDistribution($students);
    $aBucket = collect($distribution)->firstWhere('grade', 'A');
    $bBucket = collect($distribution)->firstWhere('grade', 'B');

    expect($aBucket['count'])->toBe(2);
    expect($aBucket['percentage'])->toBe(50.0);
    expect($bBucket['count'])->toBe(1);
    expect($bBucket['percentage'])->toBe(25.0);
});
