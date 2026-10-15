<?php

use App\Models\Aset;
use App\Models\PengadaanAset;
use App\Models\PerbaikanAset;

test('inventaris page can be rendered and an asset can be checked and archived', function () {
    $aset = Aset::create([
        'kode_aset' => 'AST-TEST-001',
        'nama_aset' => 'Proyektor Ruang Belajar',
        'kategori' => 'Elektronik & IT',
        'lokasi' => 'Ruang Kelas',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Baik',
        'status' => 'Tersedia',
        'nilai_perolehan' => 4500000,
        'tanggal_perolehan' => '2026-01-15',
    ]);

    // Halaman inventaris murni render read-only
    $response = $this->get('/sarpras/inventaris');
    $response->assertStatus(200);

    // Pemeriksaan berkala aset (dijalankan dari halaman pemeriksaan & perbaikan)
    $checkResponse = $this->post("/sarpras/inventaris/{$aset->id}/periksa", [
        'tanggal_pemeriksaan_terakhir' => '2026-04-10',
        'kondisi' => 'Rusak Ringan',
        'catatan_pemeriksaan' => 'Kabel power longgar',
    ]);
    $checkResponse->assertRedirect();

    $aset->refresh();
    expect($aset->kondisi)->toBe('Rusak Ringan');
    expect($aset->catatan_pemeriksaan)->toBe('Kabel power longgar');

    // Afkir/Hapus aset rusak berat ke arsip dihapuskan
    $deleteResponse = $this->post("/sarpras/inventaris/{$aset->id}/hapus", [
        'alasan_penghapusan' => 'Rusak permanen',
        'tanggal_penghapusan' => '2026-04-15',
    ]);
    $deleteResponse->assertRedirect();

    $aset->refresh();
    expect($aset->status)->toBe('Dihapuskan');
    expect($aset->alasan_penghapusan)->toBe('Rusak permanen');
});

test('perbaikan asset can be submitted and completed with asset status auto-update', function () {
    $aset = Aset::create([
        'kode_aset' => 'AST-TEST-002',
        'nama_aset' => 'AC Kamar Santri 3',
        'kategori' => 'Elektronik & IT',
        'lokasi' => 'Gedung Asrama Putra',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Rusak Ringan',
        'status' => 'Tersedia',
    ]);

    $response = $this->get('/sarpras/perbaikan');
    $response->assertStatus(200);

    // Catat perbaikan aset
    $storePerbaikan = $this->post('/sarpras/perbaikan', [
        'aset_id' => $aset->id,
        'pelapor' => 'Petugas Sarpras',
        'tanggal_pengajuan' => '2026-04-12',
        'prioritas' => 'Sedang',
        'deskripsi_kerusakan' => 'AC tidak dingin dan meneteskan air',
    ]);
    $storePerbaikan->assertRedirect();

    $aset->refresh();
    expect($aset->status)->toBe('Dalam Perbaikan');

    $perbaikan = PerbaikanAset::where('aset_id', $aset->id)->first();
    expect($perbaikan)->not->toBeNull();
    expect($perbaikan->status)->toBe('Menunggu');

    // Selesaikan perbaikan
    $updateStatus = $this->post("/sarpras/perbaikan/{$perbaikan->id}/update-status", [
        'status' => 'Selesai',
        'teknisi' => 'Teknisi CV Dingin Sejahtera',
        'biaya' => 250000,
        'tanggal_selesai' => '2026-04-14',
    ]);
    $updateStatus->assertRedirect();

    $perbaikan->refresh();
    expect($perbaikan->status)->toBe('Selesai');
    expect((float) $perbaikan->biaya)->toBe(250000.0);

    $aset->refresh();
    expect($aset->status)->toBe('Tersedia');
    expect($aset->kondisi)->toBe('Baik');
});

test('pengadaan directly enters active inventory upon purchase record', function () {
    $response = $this->get('/sarpras/pengadaan');
    $response->assertStatus(200);

    // Catat Pembelian Aset Baru langsung masuk inventaris aktif
    $postPengadaan = $this->post('/sarpras/pengadaan', [
        'nama_barang' => 'Lemari Pakaian 4 Pintu',
        'kategori' => 'Mebel & Furnitur',
        'lokasi_tujuan' => 'Gedung Asrama Putra',
        'jumlah' => 2,
        'satuan' => 'Unit',
        'estimasi_biaya' => 3000000,
        'sumber_dana' => 'Yayasan',
        'keterangan' => 'Penambahan kapasitas santri baru',
    ]);
    $postPengadaan->assertRedirect();

    $pengadaan = PengadaanAset::where('nama_barang', 'Lemari Pakaian 4 Pintu')->first();
    expect($pengadaan)->not->toBeNull();
    expect($pengadaan->status)->toBe('Diterima');

    $this->assertDatabaseHas('asets', [
        'nama_aset' => 'Lemari Pakaian 4 Pintu',
        'kategori' => 'Mebel & Furnitur',
        'lokasi' => 'Gedung Asrama Putra',
        'status' => 'Tersedia',
        'kondisi' => 'Baik',
    ]);

    // Hapus riwayat belanja
    $deleteResponse = $this->delete("/sarpras/pengadaan/{$pengadaan->id}");
    $deleteResponse->assertRedirect();

    $this->assertDatabaseMissing('pengadaan_asets', [
        'id' => $pengadaan->id,
    ]);

    $this->assertDatabaseMissing('asets', [
        'nama_aset' => 'Lemari Pakaian 4 Pintu',
    ]);
});

test('periksa berkala can update asset status to tidak tersedia or dihapuskan', function () {
    $aset = Aset::create([
        'kode_aset' => 'AST-TEST-003',
        'nama_aset' => 'Kasur Busa Kamar 5',
        'kategori' => 'Mebel & Furnitur',
        'lokasi' => 'Kamar 5',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Baik',
        'status' => 'Tersedia',
    ]);

    // Update to Tidak Tersedia via periksa berkala
    $response = $this->post("/sarpras/inventaris/{$aset->id}/periksa", [
        'kondisi' => 'Rusak Berat',
        'status' => 'Tidak Tersedia',
        'catatan_pemeriksaan' => 'Kain sobek parah dan busa kempes',
        'tanggal_pemeriksaan_terakhir' => '2026-04-20',
    ]);
    $response->assertRedirect();

    $aset->refresh();
    expect($aset->kondisi)->toBe('Rusak Berat');
    expect($aset->status)->toBe('Tidak Tersedia');
    expect($aset->catatan_pemeriksaan)->toBe('Kain sobek parah dan busa kempes');

    // Update to Dihapuskan via periksa berkala
    $responseAfkir = $this->post("/sarpras/inventaris/{$aset->id}/periksa", [
        'kondisi' => 'Rusak Berat',
        'status' => 'Dihapuskan',
        'catatan_pemeriksaan' => 'Afkir karena tidak dapat diperbaiki',
        'tanggal_pemeriksaan_terakhir' => '2026-04-21',
    ]);
    $responseAfkir->assertRedirect();

    $aset->refresh();
    expect($aset->status)->toBe('Dihapuskan');
    expect($aset->alasan_penghapusan)->toBe('Afkir karena tidak dapat diperbaiki');
    expect($aset->tanggal_penghapusan)->not->toBeNull();
});

test('an asset can be permanently deleted from database', function () {
    $aset = Aset::create([
        'kode_aset' => 'AST-TEST-DEL',
        'nama_aset' => 'Meja Rusak Total',
        'kategori' => 'Mebel & Furnitur',
        'lokasi' => 'Gudang',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Rusak Berat',
        'status' => 'Dihapuskan',
    ]);

    $deleteResponse = $this->delete("/sarpras/inventaris/{$aset->id}");
    $deleteResponse->assertRedirect();

    $this->assertDatabaseMissing('asets', [
        'id' => $aset->id,
    ]);
});

test('perbaikan page activeAsets includes inspection date and notes', function () {
    $aset = Aset::create([
        'kode_aset' => 'AST-TEST-004',
        'nama_aset' => 'Kipas Angin Dinding',
        'kategori' => 'Elektronik & IT',
        'lokasi' => 'Masjid',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Baik',
        'status' => 'Tersedia',
        'tanggal_pemeriksaan_terakhir' => '2026-04-10',
        'catatan_pemeriksaan' => 'Kondisi prima dan bersih',
    ]);

    $response = $this->get('/sarpras/perbaikan');
    $response->assertStatus(200);

    $activeAsets = $response->viewData('page')['props']['activeAsets'];
    $found = collect($activeAsets)->firstWhere('kode_aset', 'AST-TEST-004');

    expect($found)->not->toBeNull();
    expect($found['tanggal_pemeriksaan_terakhir'])->not->toBeNull();
    expect($found['catatan_pemeriksaan'])->toBe('Kondisi prima dan bersih');
});

test('pengadaan can specify lembaga and assets can be filtered by lembaga', function () {
    $postPengadaan = $this->post('/sarpras/pengadaan', [
        'nama_barang' => 'Infocus Proyektor Kelas 7',
        'lembaga' => 'Lembaga 1',
        'kategori' => 'Elektronik & IT',
        'lokasi_tujuan' => 'Ruang Kelas 7',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'estimasi_biaya' => 4500000,
    ]);
    $postPengadaan->assertRedirect();

    $this->assertDatabaseHas('pengadaan_asets', [
        'nama_barang' => 'Infocus Proyektor Kelas 7',
        'lembaga' => 'Lembaga 1',
        'lokasi_tujuan' => 'Ruang Kelas 7',
    ]);

    $this->assertDatabaseHas('asets', [
        'nama_aset' => 'Infocus Proyektor Kelas 7',
        'lembaga' => 'Lembaga 1',
        'lokasi' => 'Ruang Kelas 7',
    ]);

    // Test filter inventaris by lembaga
    $filterResponse = $this->get('/sarpras/inventaris?lembaga=Lembaga+1');
    $filterResponse->assertStatus(200);

    $inventarisAsets = $filterResponse->viewData('page')['props']['asets'];
    expect(collect($inventarisAsets)->every(fn ($a) => $a['lembaga'] === 'Lembaga 1'))->toBeTrue();
});
