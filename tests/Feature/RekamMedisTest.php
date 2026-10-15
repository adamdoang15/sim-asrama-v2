<?php

use App\Models\Gelara;
use App\Models\Kesehatan;

test('rekam medis page can be rendered with stats and student health data', function () {
    $gelaraSehat = Gelara::create([
        'nig' => 'RM001',
        'name' => 'Santri Sehat',
        'ttl' => 'Jakarta, 01-01-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah Sehat',
        'ibu' => 'Ibu Sehat',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
    ]);

    $gelaraSakit = Gelara::create([
        'nig' => 'RM002',
        'name' => 'Santri Perlu Perhatian',
        'ttl' => 'Bandung, 02-02-2008',
        'angkatan' => '2024',
        'ta' => '2024/2025',
        'ayah' => 'Ayah Sakit',
        'ibu' => 'Ibu Sakit',
        'domisili' => 'Asrama',
        'kelas' => 'Kelas 10',
    ]);

    // Data kesehatan santri sehat (tanpa keluhan sakit)
    Kesehatan::create([
        'gelara_id' => $gelaraSehat->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'semester' => '1',
        'berat_badan' => 55,
        'tinggi_badan' => 165,
        'imt' => 20.2,
        'imt_kategori' => 'Ideal',
        'tensi' => '115/75',
        'tensi_kategori' => 'Normal',
        'riwayat_sakit' => [
            'ringan' => ['jumlah' => 0, 'keterangan' => ''],
            'sedang' => ['jumlah' => 0, 'keterangan' => ''],
            'berat' => ['jumlah' => 0, 'keterangan' => ''],
        ],
        'catatan_kesehatan' => 'Kondisi prima.',
    ]);

    // Data kesehatan santri sakit (perlu perhatian)
    Kesehatan::create([
        'gelara_id' => $gelaraSakit->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'semester' => '1',
        'berat_badan' => 48,
        'tinggi_badan' => 160,
        'imt' => 18.75,
        'imt_kategori' => 'Ideal',
        'tensi' => '120/80',
        'tensi_kategori' => 'Normal',
        'riwayat_sakit' => [
            'ringan' => ['jumlah' => 2, 'keterangan' => 'Flu dan batuk'],
            'sedang' => ['jumlah' => 1, 'keterangan' => 'Demam'],
            'berat' => ['jumlah' => 0, 'keterangan' => ''],
        ],
        'catatan_kesehatan' => 'Istirahat teratur.',
    ]);

    $response = $this->get('/kesehatan/rekam-medis?kelas=Kelas 10');
    $response->assertStatus(200);

    $page = $response->original->getData()['page'];
    expect($page['component'])->toBe('Kesehatan/RekamMedis');

    $props = $page['props'];
    expect($props['stats'])->toBeArray();
    expect($props['stats']['perlu_perhatian'])->toBeGreaterThanOrEqual(1);
    expect($props['stats']['santri_sehat'])->toBeGreaterThanOrEqual(1);

    // Filter pencarian NIG
    $searchResponse = $this->get('/kesehatan/rekam-medis?kelas=Kelas 10&search=RM002');
    $searchResponse->assertStatus(200);
    $searchProps = $searchResponse->original->getData()['page']['props'];
    expect($searchProps['students'])->toHaveCount(1);
    expect($searchProps['students'][0]['nig'])->toBe('RM002');
    expect($searchProps['students'][0]['total_sakit'])->toBe(3);
});
