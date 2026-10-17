<?php

use App\Models\Gelara;
use App\Models\User;

test('multi lembaga isolates student data between institutions and lets yayasan view all', function () {
    // 1. Buat data untuk 2 lembaga berbeda
    $studentCicantayan = Gelara::create([
        'nig' => 'CIC-001',
        'name' => 'Santri Cicantayan',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Sukabumi, 1 Januari 2010',
        'angkatan' => '2026',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    $studentBanjarbaru = Gelara::create([
        'nig' => 'BJB-001',
        'name' => 'Santri Banjarbaru',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Banjarbaru, 1 Februari 2010',
        'angkatan' => '2026',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
    ]);

    // 2. User Cicantayan hanya melihat santri Cicantayan
    $userCicantayan = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'kesekretariatan',
    ]);

    $responseCicantayan = $this->actingAs($userCicantayan)->get('/kesekretariatan/data-gelara');
    $responseCicantayan->assertStatus(200);
    $studentsCicantayan = $responseCicantayan->viewData('page')['props']['students']['data'];
    $namesCicantayan = collect($studentsCicantayan)->pluck('name');
    expect($namesCicantayan)->toContain('Santri Cicantayan');
    expect($namesCicantayan)->not->toContain('Santri Banjarbaru');

    // 3. User Banjarbaru hanya melihat santri Banjarbaru
    $userBanjarbaru = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
        'role' => 'kesekretariatan',
    ]);

    $responseBanjarbaru = $this->actingAs($userBanjarbaru)->get('/kesekretariatan/data-gelara');
    $responseBanjarbaru->assertStatus(200);
    $studentsBanjarbaru = $responseBanjarbaru->viewData('page')['props']['students']['data'];
    $namesBanjarbaru = collect($studentsBanjarbaru)->pluck('name');
    expect($namesBanjarbaru)->toContain('Santri Banjarbaru');
    expect($namesBanjarbaru)->not->toContain('Santri Cicantayan');

    // 4. User Yayasan (viewer) dapat melihat seluruh santri lintas lembaga
    $userYayasan = User::factory()->create([
        'lembaga' => 'Yayasan',
        'role' => 'viewer',
    ]);

    $responseYayasan = $this->actingAs($userYayasan)->get('/kesekretariatan/data-gelara');
    $responseYayasan->assertStatus(200);
    $studentsYayasan = $responseYayasan->viewData('page')['props']['students']['data'];
    $namesYayasan = collect($studentsYayasan)->pluck('name');
    expect($namesYayasan)->toContain('Santri Cicantayan');
    expect($namesYayasan)->toContain('Santri Banjarbaru');
});

test('check role middleware blocks unauthorized roles and allows authorized roles', function () {
    $stafSarpras = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'sarpras',
    ]);

    // Role sarpras tidak boleh membuka kurikulum
    $responseBlocked = $this->actingAs($stafSarpras)->get('/kurikulum/nilai-akademik');
    $responseBlocked->assertRedirect(route('dashboard'));
    $responseBlocked->assertSessionHas('error');

    // Role sarpras boleh membuka sarpras
    $responseAllowed = $this->actingAs($stafSarpras)->get('/sarpras/inventaris');
    $responseAllowed->assertStatus(200);

    // Role administrasi boleh membuka semua modul
    $adminUser = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'administrasi',
    ]);
    $this->actingAs($adminUser)->get('/kurikulum/nilai-akademik')->assertStatus(200);
    $this->actingAs($adminUser)->get('/sarpras/inventaris')->assertStatus(200);
    $this->actingAs($adminUser)->get('/keuangan/bop')->assertStatus(200);
    $this->actingAs($adminUser)->get('/administrasi')->assertStatus(200);
});

test('keuangan and administrasi pages render correctly', function () {
    $adminUser = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'administrasi',
    ]);

    $this->actingAs($adminUser)->get('/keuangan/bop')->assertStatus(200);
    $this->actingAs($adminUser)->get('/administrasi')->assertStatus(200);
});
