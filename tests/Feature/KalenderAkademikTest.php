<?php

use App\Models\KalenderAkademik;

test('halaman kalender akademik dapat dimuat', function () {
    $response = $this->get(route('kurikulum.kalender'));

    $response->assertOk();
});

test('dapat menambahkan agenda kalender akademik baru', function () {
    $payload = [
        'title' => 'Ujian Tengah Semester',
        'description' => 'UTS Semester Ganjil 2026/2027',
        'start_date' => '2026-10-20',
        'end_date' => '2026-10-25',
        'type' => 'Ujian',
        'location' => 'Aula Utama',
        'is_completed' => false,
    ];

    $response = $this->post(route('kurikulum.kalender.store'), $payload);

    $response->assertRedirect();
    $this->assertDatabaseHas('kalender_akademiks', [
        'title' => 'Ujian Tengah Semester',
        'type' => 'Ujian',
    ]);
});

test('dapat memperbarui agenda kalender akademik', function () {
    $agenda = KalenderAkademik::create([
        'title' => 'Agenda Awal',
        'start_date' => '2026-10-15',
        'type' => 'KBM',
    ]);

    $response = $this->put(route('kurikulum.kalender.update', $agenda), [
        'title' => 'Agenda Diperbarui',
        'start_date' => '2026-10-16',
        'type' => 'KBM',
        'is_completed' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('kalender_akademiks', [
        'id' => $agenda->id,
        'title' => 'Agenda Diperbarui',
        'is_completed' => true,
    ]);
});

test('dapat menghapus agenda kalender akademik', function () {
    $agenda = KalenderAkademik::create([
        'title' => 'Agenda Dihapus',
        'start_date' => '2026-10-15',
        'type' => 'Libur',
    ]);

    $response = $this->delete(route('kurikulum.kalender.destroy', $agenda));

    $response->assertRedirect();
    $this->assertDatabaseMissing('kalender_akademiks', [
        'id' => $agenda->id,
    ]);
});
