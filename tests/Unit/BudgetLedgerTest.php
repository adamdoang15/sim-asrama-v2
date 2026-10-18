<?php

use App\Domain\BudgetLedger;
use App\Models\AnggaranBop;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('calculateSourceSummary accurately calculates plan, actual, and expense variance', function () {
    $items = collect([
        ['tipe' => 'pemasukan', 'plan' => 10000000, 'aktual' => 10000000],
        ['tipe' => 'pengeluaran', 'plan' => 5000000, 'aktual' => 4500000],
        ['tipe' => 'pengeluaran', 'plan' => 2000000, 'aktual' => 2200000],
    ]);

    $summary = BudgetLedger::calculateSourceSummary($items);

    expect($summary['plan_pemasukan'])->toBe(10000000.0);
    expect($summary['aktual_pemasukan'])->toBe(10000000.0);
    expect($summary['plan_pengeluaran'])->toBe(7000000.0);
    expect($summary['aktual_pengeluaran'])->toBe(6700000.0);
    // Selisih = plan - aktual = 7,000,000 - 6,700,000 = 300,000 (penghematan)
    expect($summary['selisih_pengeluaran'])->toBe(300000.0);
});

test('summarizeMonthly compiles both fkdb and ot funding channels', function () {
    $fkdb = collect([
        ['tipe' => 'pemasukan', 'plan' => 5000000, 'aktual' => 5000000],
        ['tipe' => 'pengeluaran', 'plan' => 4000000, 'aktual' => 4000000],
    ]);

    $ot = collect([
        ['tipe' => 'pemasukan', 'plan' => 2000000, 'aktual' => 2500000],
        ['tipe' => 'pengeluaran', 'plan' => 1500000, 'aktual' => 1200000],
    ]);

    $result = BudgetLedger::summarizeMonthly($fkdb, $ot);

    expect($result)->toHaveKeys(['fkdb', 'ot']);
    expect($result['fkdb']['aktual_pemasukan'])->toBe(5000000.0);
    expect($result['ot']['aktual_pemasukan'])->toBe(2500000.0);
    expect($result['ot']['selisih_pengeluaran'])->toBe(300000.0);
});

test('compileAnnualSchedule aggregates 12 academic months matrix and computes net balance', function () {
    $allYear = collect([
        // Juli FKDB
        ['bulan' => 'Juli', 'sumber_dana' => 'fkdb', 'tipe' => 'pemasukan', 'plan' => 5000000, 'aktual' => 5000000],
        ['bulan' => 'Juli', 'sumber_dana' => 'fkdb', 'tipe' => 'pengeluaran', 'plan' => 4500000, 'aktual' => 4000000],
        // Juli Mandiri OT
        ['bulan' => 'Juli', 'sumber_dana' => 'ot', 'tipe' => 'pemasukan', 'plan' => 2000000, 'aktual' => 2000000],
        ['bulan' => 'Juli', 'sumber_dana' => 'ot', 'tipe' => 'pengeluaran', 'plan' => 2000000, 'aktual' => 2500000],
        // Agustus Mandiri OT
        ['bulan' => 'Agustus', 'sumber_dana' => 'ot', 'tipe' => 'pemasukan', 'plan' => 3000000, 'aktual' => 3000000],
        ['bulan' => 'Agustus', 'sumber_dana' => 'ot', 'tipe' => 'pengeluaran', 'plan' => 2000000, 'aktual' => 1000000],
    ]);

    $schedule = BudgetLedger::compileAnnualSchedule($allYear);

    expect($schedule)->toHaveKeys(BudgetLedger::ACADEMIC_MONTHS);
    // Juli FKDB saldo: 5jt - 4jt = 1jt
    expect($schedule['Juli']['fkdb']['saldo'])->toBe(1000000.0);
    // Juli OT saldo: 2jt - 2.5jt = -500rb (defisit)
    expect($schedule['Juli']['mandiri']['saldo'])->toBe(-500000.0);
    // Agustus OT saldo: 3jt - 1jt = 2jt (surplus)
    expect($schedule['Agustus']['mandiri']['saldo'])->toBe(2000000.0);
    // September (empty) should have 0 saldo
    expect($schedule['September']['mandiri']['saldo'])->toBe(0.0);
});

test('calculateCumulativeBalance computes continuous running balance with debit and credit split', function () {
    $schedule = [
        'Juli' => ['mandiri' => ['saldo' => 1000000.0]],
        'Agustus' => ['mandiri' => ['saldo' => -300000.0]],
        'September' => ['mandiri' => ['saldo' => 500000.0]],
    ];

    $months = ['Juli', 'Agustus', 'September'];
    $sisaBop = BudgetLedger::calculateCumulativeBalance($schedule, $months);

    expect($sisaBop)->toHaveCount(3);

    // Juli: surplus 1jt -> debit 1jt, kredit 0, kumulatif 1jt
    expect($sisaBop[0]['bulan'])->toBe('Juli');
    expect($sisaBop[0]['debit'])->toBe(1000000.0);
    expect($sisaBop[0]['kredit'])->toBe(0.0);
    expect($sisaBop[0]['saldo_kumulatif'])->toBe(1000000.0);

    // Agustus: defisit -300rb -> debit 0, kredit 300rb, kumulatif 700rb
    expect($sisaBop[1]['bulan'])->toBe('Agustus');
    expect($sisaBop[1]['debit'])->toBe(0.0);
    expect($sisaBop[1]['kredit'])->toBe(300000.0);
    expect($sisaBop[1]['saldo_kumulatif'])->toBe(700000.0);

    // September: surplus 500rb -> debit 500rb, kredit 0, kumulatif 1.2jt
    expect($sisaBop[2]['bulan'])->toBe('September');
    expect($sisaBop[2]['debit'])->toBe(500000.0);
    expect($sisaBop[2]['kredit'])->toBe(0.0);
    expect($sisaBop[2]['saldo_kumulatif'])->toBe(1200000.0);
});

test('seedDefaultTemplate seeds account templates idempotently', function () {
    $inserted1 = BudgetLedger::seedDefaultTemplate('2026/2027', 'Juli', 'fkdb', 'Lembaga 1');
    expect($inserted1)->toBe(count(BudgetLedger::FKDB_TEMPLATES));

    // Second call should insert 0 because items already exist
    $inserted2 = BudgetLedger::seedDefaultTemplate('2026/2027', 'Juli', 'fkdb', 'Lembaga 1');
    expect($inserted2)->toBe(0);

    expect(AnggaranBop::where('tahun_ajaran', '2026/2027')->where('bulan', 'Juli')->count())
        ->toBe(count(BudgetLedger::FKDB_TEMPLATES));
});
