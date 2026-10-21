<?php

use App\Models\Gelara;
use App\Models\KalenderAkademik;
use App\Models\Kegiatan;
use App\Models\Kesehatan;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

test('returns a successful response and delivers dashboard stats including gelara_sakit', function () {
    $user = User::factory()->create([
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    $gelara = Gelara::create([
        'nig' => 'GEL-001',
        'name' => 'Santri Sakit',
        'ttl' => 'Sukabumi, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah',
        'ibu' => 'Ibu',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    Kesehatan::create([
        'gelara_id' => $gelara->id,
        'tahun_akademik' => '2024/2025',
        'semester' => '1',
        'riwayat_sakit' => ['ringan' => ['jumlah' => 1, 'keterangan' => 'Demam']],
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Dashboard')
        ->has('stats')
        ->where('stats.gelara_sakit', 1)
    );
});

test('dashboard stats gelara_sakit respects user lembaga multi-tenant scoping', function () {
    $userCicantayan = User::factory()->create(['lembaga' => 'LKP Doa Bangsa Cicantayan']);
    $userBanjarbaru = User::factory()->create(['lembaga' => 'LKP Doa Bangsa Banjarbaru']);

    $gelaraCicantayan = Gelara::create([
        'nig' => 'GEL-CIC-01',
        'name' => 'Santri Cicantayan',
        'ttl' => 'Sukabumi, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah',
        'ibu' => 'Ibu',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    $gelaraBanjarbaru = Gelara::create([
        'nig' => 'GEL-BJB-01',
        'name' => 'Santri Banjarbaru',
        'ttl' => 'Banjarbaru, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah',
        'ibu' => 'Ibu',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
    ]);

    Kesehatan::create([
        'gelara_id' => $gelaraCicantayan->id,
        'tahun_akademik' => '2024/2025',
        'semester' => '1',
        'riwayat_sakit' => ['ringan' => ['jumlah' => 2, 'keterangan' => 'Batuk']],
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    Kesehatan::create([
        'gelara_id' => $gelaraBanjarbaru->id,
        'tahun_akademik' => '2024/2025',
        'semester' => '1',
        'riwayat_sakit' => ['sedang' => ['jumlah' => 1, 'keterangan' => 'Tifus']],
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
    ]);

    $resCicantayan = $this->actingAs($userCicantayan)->get('/dashboard');
    $resCicantayan->assertOk();
    $resCicantayan->assertInertia(fn (Assert $page) => $page
        ->where('stats.gelara_sakit', 1)
    );

    $resBanjarbaru = $this->actingAs($userBanjarbaru)->get('/dashboard');
    $resBanjarbaru->assertOk();
    $resBanjarbaru->assertInertia(fn (Assert $page) => $page
        ->where('stats.gelara_sakit', 1)
    );
});

test('dashboard delivers combined agendas from kegiatan and kalender_akademik sorted by date', function () {
    $user = User::factory()->create(['lembaga' => 'LKP Doa Bangsa Cicantayan']);

    $tomorrow = Carbon::tomorrow()->toDateString();
    $inThreeDays = Carbon::today()->addDays(3)->toDateString();

    Kegiatan::create([
        'title' => 'Lomba Asrama Cicantayan',
        'start_date' => $inThreeDays,
        'type' => 'Khusus',
        'location' => 'Aula Asrama',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    KalenderAkademik::create([
        'title' => 'PTS Semester Ganjil',
        'start_date' => $tomorrow,
        'type' => 'KBM',
        'location' => 'Gedung Sekolah',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Dashboard')
        ->has('agendas', 2)
        ->where('agendas.0.title', 'PTS Semester Ganjil')
        ->where('agendas.0.source', 'kurikulum')
        ->where('agendas.1.title', 'Lomba Asrama Cicantayan')
        ->where('agendas.1.source', 'kegelaraan')
    );
});

test('dashboard agendas respect user lembaga multi-tenant scoping', function () {
    $userCicantayan = User::factory()->create(['lembaga' => 'LKP Doa Bangsa Cicantayan']);
    $userBanjarbaru = User::factory()->create(['lembaga' => 'LKP Doa Bangsa Banjarbaru']);

    $tomorrow = Carbon::tomorrow()->toDateString();

    Kegiatan::create([
        'title' => 'Agenda Cicantayan',
        'start_date' => $tomorrow,
        'type' => 'Rutin',
        'location' => 'Asrama Cicantayan',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
    ]);

    KalenderAkademik::create([
        'title' => 'Agenda Banjarbaru',
        'start_date' => $tomorrow,
        'type' => 'KBM',
        'location' => 'Sekolah Banjarbaru',
        'lembaga' => 'LKP Doa Bangsa Banjarbaru',
    ]);

    $resCicantayan = $this->actingAs($userCicantayan)->get('/dashboard');
    $resCicantayan->assertOk();
    $resCicantayan->assertInertia(fn (Assert $page) => $page
        ->has('agendas', 1)
        ->where('agendas.0.title', 'Agenda Cicantayan')
        ->where('agendas.0.source', 'kegelaraan')
    );

    $resBanjarbaru = $this->actingAs($userBanjarbaru)->get('/dashboard');
    $resBanjarbaru->assertOk();
    $resBanjarbaru->assertInertia(fn (Assert $page) => $page
        ->has('agendas', 1)
        ->where('agendas.0.title', 'Agenda Banjarbaru')
        ->where('agendas.0.source', 'kurikulum')
    );
});
