<?php

use App\Models\Gelara;
use App\Models\NilaiAkademik;
use App\Models\Pegawai;
use App\Models\Prestasi;
use Inertia\Testing\AssertableInertia as Assert;

test('halaman manajemen nilai akademik dapat diakses dengan sukses', function () {
    $response = $this->get(route('kurikulum.nilai-akademik'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Kurikulum/NilaiAkademik')
        ->has('initialFilters')
        ->has('options')
        ->has('students')
        ->has('allGelaras')
        ->has('distribution')
        ->where('kkm', 75)
    );
});

test('filter pencarian pada halaman nilai akademik berfungsi dengan database gelara', function () {
    $gelara = Gelara::first() ?? Gelara::create([
        'nig' => '001.2026.001',
        'name' => 'Fadhil Test',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Bandung, 1 Januari 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    $response = $this->get(route('kurikulum.nilai-akademik', [
        'search' => $gelara->name,
    ]));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Kurikulum/NilaiAkademik')
        ->where('students.0.name', $gelara->name)
    );
});

test('dapat menyimpan dan memperbarui nilai akademik santri ke database', function () {
    $gelara = Gelara::first() ?? Gelara::create([
        'nig' => '001.2026.002',
        'name' => 'Santri Nilai Test',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Jakarta, 1 Februari 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    $response = $this->post(route('kurikulum.nilai-akademik.store'), [
        'gelara_id' => $gelara->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
        'h1' => 95.0,
        'h2' => 95.0,
        'h3' => 95.0,
        'h4' => 95.0,
        'h5' => 95.0,
        'uts' => 95.0,
        'uas' => 95.0,
        'deskripsi' => 'Prestasi istimewa dalam hafalan mufradat dan insya.',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('nilai_akademiks', [
        'gelara_id' => $gelara->id,
        'uas' => 95.0,
        'predikat' => 'A',
    ]);
});

test('filter tahun akademik berhasil memuat konteks dan mengisolasi nilai semester', function () {
    $gelara = Gelara::first() ?? Gelara::create([
        'nig' => '001.2026.003',
        'name' => 'Santri Filter TA Test',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Surabaya, 1 Maret 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    // Simpan nilai hanya di Semester Ganjil
    NilaiAkademik::updateOrCreate(
        [
            'gelara_id' => $gelara->id,
            'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
            'kelas' => 'Kelas 10',
            'mata_pelajaran' => 'Bahasa Arab',
        ],
        [
            'uas' => 90.0,
            'nilai_akhir' => 90.0,
            'predikat' => 'A',
        ]
    );

    // Request ke Semester Ganjil -> Nilai harus ada
    $responseGanjil = $this->get(route('kurikulum.nilai-akademik', [
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
    ]));

    $responseGanjil->assertStatus(200);
    $responseGanjil->assertInertia(fn (Assert $page) => $page
        ->where('initialFilters.tahun_akademik', 'T.A. 2026/2027 (Semester Ganjil)')
        ->where('students.0.uas', 90)
    );

    // Request ke Semester Genap -> Nilai harus 0/kosong (terisolasi)
    $responseGenap = $this->get(route('kurikulum.nilai-akademik', [
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Genap)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
    ]));

    $responseGenap->assertStatus(200);
    $responseGenap->assertInertia(fn (Assert $page) => $page
        ->where('initialFilters.tahun_akademik', 'T.A. 2026/2027 (Semester Genap)')
        ->where('students.0.uas', 0)
    );
});

test('dapat menyimpan nilai akademik secara batch per kelas', function () {
    $gelara = Gelara::first() ?? Gelara::create([
        'nig' => '001.2026.004',
        'name' => 'Santri Batch Test',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Surabaya, 1 Maret 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    $response = $this->post(route('kurikulum.nilai-akademik.batch'), [
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Genap)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
        'scores' => [
            [
                'gelara_id' => $gelara->id,
                'h1' => 80.0,
                'h2' => 80.0,
                'h3' => 80.0,
                'h4' => 80.0,
                'h5' => 80.0,
                'uts' => 80.0,
                'uas' => 80.0,
            ],
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('nilai_akademiks', [
        'gelara_id' => $gelara->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Genap)',
        'nilai_akhir' => 80.0,
        'predikat' => 'B',
    ]);
});

test('dapat menyimpan kompetensi dasar kd hingga 5 kd dan tidak tertimpa saat batch update', function () {
    $gelara = Gelara::first() ?? Gelara::create([
        'nig' => '001.2026.005',
        'name' => 'Santri KD Test',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Surabaya, 1 Maret 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    $kds = [
        'Memahami kaidah nahwu dasar',
        'Mampu membaca kitab gundul tema madrosah',
        'Menulis insya muwajjah',
    ];

    $response = $this->post(route('kurikulum.nilai-akademik.kd'), [
        'gelara_id' => $gelara->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
        'kds' => $kds,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('nilai_akademiks', [
        'gelara_id' => $gelara->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'deskripsi' => json_encode($kds, JSON_UNESCAPED_UNICODE),
    ]);

    // Jalankan batch save dan pastikan deskripsi KD tidak ter-overwrite
    $responseBatch = $this->post(route('kurikulum.nilai-akademik.batch'), [
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
        'scores' => [
            [
                'gelara_id' => $gelara->id,
                'h1' => 88.0,
                'h2' => 88.0,
                'h3' => 88.0,
                'h4' => 88.0,
                'h5' => 88.0,
                'uts' => 88.0,
                'uas' => 88.0,
            ],
        ],
    ]);

    $responseBatch->assertRedirect();

    $this->assertDatabaseHas('nilai_akademiks', [
        'gelara_id' => $gelara->id,
        'nilai_akhir' => 88.0,
        'deskripsi' => json_encode($kds, JSON_UNESCAPED_UNICODE),
    ]);
});

test('perhitungan nilai akhir menggunakan rerata harian dinamis dan bobot 60-20-20', function () {
    $gelara = Gelara::first() ?? Gelara::create([
        'nig' => '001.2026.006',
        'name' => 'Santri Formula Test',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Surabaya, 1 Maret 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    // H1=80, H2=90 (H3..H5=0), UTS=70, UAS=80 -> rH=85.0 -> NA = (85*0.6)+(70*0.2)+(80*0.2) = 51.0 + 14.0 + 16.0 = 81.0, Predikat B
    $response = $this->post(route('kurikulum.nilai-akademik.batch'), [
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
        'scores' => [
            [
                'gelara_id' => $gelara->id,
                'h1' => 80.0,
                'h2' => 90.0,
                'h3' => 0,
                'h4' => 0,
                'h5' => 0,
                'uts' => 70.0,
                'uas' => 80.0,
            ],
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('nilai_akademiks', [
        'gelara_id' => $gelara->id,
        'nilai_akhir' => 81.0,
        'predikat' => 'B',
    ]);
});

test('classLedger memuat seluruh mata pelajaran dan rekapitulasi nilai untuk cetak rapor dan ledger', function () {
    $gelara = Gelara::create([
        'nig' => '001.2026.099',
        'name' => 'Santri Ledger Test',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Bandung, 5 Mei 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    NilaiAkademik::create([
        'gelara_id' => $gelara->id,
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'mata_pelajaran' => 'Bahasa Arab',
        'nilai_akhir' => 90.0,
        'predikat' => 'A',
    ]);

    $response = $this->get(route('kurikulum.nilai-akademik', [
        'tahun_akademik' => 'T.A. 2026/2027 (Semester Ganjil)',
        'kelas' => 'Kelas 10',
        'search' => 'Santri Ledger Test',
    ]));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Kurikulum/NilaiAkademik')
        ->has('classLedger')
        ->has('classLedger.mapels')
        ->has('classLedger.students', 1)
        ->where('classLedger.students.0.name', 'Santri Ledger Test')
        ->where('classLedger.students.0.scores.Bahasa Arab.nilai_akhir', 90)
        ->where('classLedger.students.0.scores.Bahasa Arab.predikat', 'A')
        ->where('classLedger.students.0.avg', 90)
        ->where('classLedger.students.0.filled_count', 1)
        ->where('classLedger.students.0.is_complete', false)
    );
});

test('dapat menyimpan dan memperbarui daftar mata pelajaran khusus per kelas', function () {
    $response = $this->post(route('kurikulum.nilai-akademik.mapel'), [
        'kelas' => 'Kelas 10',
        'mapels' => ['Bahasa Arab', 'Tahfidz Al-Quran', 'Fiqih'],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('kelas_mapels', [
        'kelas' => 'Kelas 10',
    ]);

    // Halaman Nilai Akademik Kelas 10 sekarang memuat 3 mapel tersebut
    $page = $this->get(route('kurikulum.nilai-akademik', ['kelas' => 'Kelas 10']));
    $page->assertInertia(fn (Assert $assert) => $assert
        ->where('options.mata_pelajaran', ['Bahasa Arab', 'Tahfidz Al-Quran', 'Fiqih'])
    );
});

test('menampilkan data wali kelas dan niy secara dinamis sesuai kelas aktif', function () {
    Pegawai::create([
        'name' => 'Ust. Ahmad Fauzan, S.Pd.I',
        'niy' => '9988776655',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Bandung, 10 Januari 1990',
        'status_pegawai' => 'Pegawai Tetap Yayasan',
        'jabatan' => 'Guru, Wali Kelas 10',
        'tahun_masuk' => '2022',
        'foto' => 'Belum Ada Foto',
    ]);

    $response = $this->get(route('kurikulum.nilai-akademik', ['kelas' => 'Kelas 10']));
    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Kurikulum/NilaiAkademik')
        ->where('waliKelas.name', 'Ust. Ahmad Fauzan, S.Pd.I')
        ->where('waliKelas.niy', '9988776655')
        ->where('classLedger.waliKelas.name', 'Ust. Ahmad Fauzan, S.Pd.I')
        ->where('classLedger.waliKelas.niy', '9988776655')
    );
});

test('memuat data prestasi dan biodata santri dengan benar pada classLedger tanpa error sql', function () {
    $gelara = Gelara::create([
        'nig' => '001.2026.999',
        'name' => 'Santri Berprestasi',
        'jenis_kelamin' => 'Laki-laki',
        'ttl' => 'Bandung, 1 Januari 2011',
        'angkatan' => '19',
        'tahun_diterima' => '2026',
        'domisili' => 'Asrama Putra',
        'kelas' => 'Kelas 10',
    ]);

    Prestasi::create([
        'name' => 'Santri Berprestasi',
        'nim' => '001.2026.999',
        'title' => 'Juara 1 Lomba Pidato Bahasa Arab',
        'level' => 'Tingkat Kabupaten',
        'date' => date('Y-m-d'),
    ]);

    $response = $this->get(route('kurikulum.nilai-akademik', ['kelas' => 'Kelas 10']));
    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Kurikulum/NilaiAkademik')
        ->has('classLedger.students')
    );
});
