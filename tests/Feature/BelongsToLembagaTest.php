<?php

use App\Models\Gelara;
use App\Models\Pegawai;
use App\Models\User;

test('belongs to lembaga auto assigns user lembaga on model creation when omitted', function () {
    $user = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
    ]);

    $this->actingAs($user);

    $santri = Gelara::create([
        'nig' => 'TEST-001',
        'name' => 'Auto Tenant Santri',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Banjarbaru, 1 Jan 2010',
        'angkatan' => '2026',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    expect($santri->lembaga)->toBe('LKP Doa Bangsa Banjarbaru');
});

test('belongs to lembaga assigns default lembaga if user has no lembaga or unauthenticated', function () {
    $pegawai = Pegawai::factory()->create([
        'lembaga' => null,
    ]);

    expect($pegawai->lembaga)->toBe(Pegawai::DEFAULT_LEMBAGA);
});

test('scopeForUser filters data correctly for standard user, yayasan, and explicit lembaga filter', function () {
    $gelara1 = Gelara::create([
        'nig' => 'S-01',
        'name' => 'Santri A',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Sukabumi',
        'angkatan' => '2026',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    $gelara2 = Gelara::create([
        'nig' => 'S-02',
        'name' => 'Santri B',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Banjarbaru',
        'angkatan' => '2026',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
    ]);

    $userCicantayan = User::factory()->create(['lembaga' => 'LKP Doa Bangsa Cicantayan']);
    $userYayasan = User::factory()->create(['lembaga' => 'Yayasan']);

    // Standard institution user only gets their own institution
    $cicantayanResults = Gelara::forUser($userCicantayan)->pluck('nig');
    expect($cicantayanResults)->toContain('S-01');
    expect($cicantayanResults)->not->toContain('S-02');

    // Yayasan gets both
    $yayasanResults = Gelara::forUser($userYayasan)->pluck('nig');
    expect($yayasanResults)->toContain('S-01');
    expect($yayasanResults)->toContain('S-02');

    // Explicit filter overrides user scope
    $filtered = Gelara::forUser($userYayasan, 'LKP Doa Bangsa Banjarbaru')->pluck('nig');
    expect($filtered)->toContain('S-02');
    expect($filtered)->not->toContain('S-01');
});
