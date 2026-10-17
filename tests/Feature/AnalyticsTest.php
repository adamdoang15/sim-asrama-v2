<?php

use App\Models\Gelara;
use App\Models\Kegiatan;
use App\Models\NilaiAkademik;
use App\Models\User;

test('kegelaraan analytics page can be loaded without error and aggregates by type', function () {
    $user = User::factory()->create([
        'name' => 'Staf Kegelaraan',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'kegelaraan',
    ]);

    Kegiatan::create([
        'title' => 'Kegiatan Rutin Pagi',
        'start_date' => '2026-10-18',
        'type' => 'Harian',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'is_completed' => false,
    ]);

    Kegiatan::create([
        'title' => 'Kajian Spesial',
        'start_date' => '2026-10-19',
        'type' => 'Khusus',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'is_completed' => true,
    ]);

    $response = $this->actingAs($user)->get(route('kegelaraan.analytics'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Kegelaraan/Analytics')
        ->has('stats')
        ->has('kategoriData')
        ->has('disciplineData')
        ->has('recentKegiatan')
    );
});

test('kurikulum analytics page is connected to nilai akademik and kkm', function () {
    $user = User::factory()->create([
        'name' => 'Guru Kurikulum',
        'lembaga' => 'SMK Doa Bangsa',
        'role' => 'kurikulum',
    ]);

    $gelara = Gelara::create([
        'nig' => 'NIG12345',
        'name' => 'Ahmad Fulan',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Bandung, 1 Januari 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
        'lembaga' => 'SMK Doa Bangsa',
    ]);

    NilaiAkademik::create([
        'gelara_id' => $gelara->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Matematika',
        'nilai_akhir' => 88.5,
        'predikat' => 'A',
        'lembaga' => 'SMK Doa Bangsa',
    ]);

    $response = $this->actingAs($user)->get(route('kurikulum.analytics'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Kurikulum/Analytics')
        ->has('stats')
        ->where('kkm', 75)
        ->has('recentNilai', 1)
        ->where('recentNilai.0.mata_pelajaran', 'Matematika')
        ->where('recentNilai.0.gelara.name', 'Ahmad Fulan')
    );
});

test('kurikulum analytics does not display dummy mapel data when database is empty', function () {
    $user = User::factory()->create([
        'name' => 'Guru Kosong',
        'lembaga' => 'LKP Doa Bangsa Cicantayan',
        'role' => 'kurikulum',
    ]);

    $response = $this->actingAs($user)->get(route('kurikulum.analytics'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Kurikulum/Analytics')
        ->where('stats.total_nilai', 0)
        ->where('stats.persen_tuntas', 0)
        ->where('mapelData', [])
        ->where('ketuntasanData', [])
    );
});
