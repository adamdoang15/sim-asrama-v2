<?php

use App\Domain\AssetRegistry;
use App\Models\Aset;
use App\Models\PengadaanAset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('generateAssetCode generates sequence with year and padded number', function () {
    $code1 = AssetRegistry::generateAssetCode(2026);
    expect($code1)->toBe('AST-2026-0001');

    Aset::create([
        'kode_aset' => $code1,
        'nama_aset' => 'Meja Guru',
        'kategori' => 'Mebel & Furnitur',
        'lokasi' => 'Ruang Guru SMP',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Baik',
        'status' => 'Tersedia',
    ]);

    $code2 = AssetRegistry::generateAssetCode(2026);
    expect($code2)->toBe('AST-2026-0002');
});

test('generateProcurementCode generates sequential procurement numbers', function () {
    $code1 = AssetRegistry::generateProcurementCode(2026);
    expect($code1)->toBe('PGD-2026-0001');
});

test('registerAsset creates asset with default status and auto code', function () {
    $aset = AssetRegistry::registerAsset([
        'nama_aset' => 'Laptop Asrama',
        'kategori' => 'Elektronik & IT',
        'lokasi' => 'Lab Komputer',
        'jumlah' => 2,
        'satuan' => 'Unit',
        'kondisi' => 'Baik',
    ]);

    expect($aset->id)->not->toBeNull();
    expect($aset->status)->toBe('Tersedia');
    expect($aset->kode_aset)->toStartWith('AST-');
    expect($aset->nama_aset)->toBe('Laptop Asrama');
});

test('recordInspection updates asset condition and inspection notes', function () {
    $aset = AssetRegistry::registerAsset([
        'nama_aset' => 'AC Kantor',
        'kategori' => 'Elektronik & IT',
        'lokasi' => 'Ruang Guru SMP',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Baik',
    ]);

    AssetRegistry::recordInspection($aset, [
        'kondisi' => 'Rusak Ringan',
        'catatan_pemeriksaan' => 'Perlu isi freon',
        'tanggal_pemeriksaan' => '2026-05-01',
    ]);

    $aset->refresh();
    expect($aset->kondisi)->toBe('Rusak Ringan');
    expect($aset->catatan_pemeriksaan)->toBe('Perlu isi freon');
    expect($aset->tanggal_pemeriksaan_terakhir?->toDateString())->toBe('2026-05-01');
});

test('decommission writes off an asset with reason and date', function () {
    $aset = AssetRegistry::registerAsset([
        'nama_aset' => 'Kursi Patah',
        'kategori' => 'Mebel & Furnitur',
        'lokasi' => 'Gudang Utama',
        'jumlah' => 1,
        'satuan' => 'Unit',
        'kondisi' => 'Rusak Berat',
    ]);

    AssetRegistry::decommission($aset, 'Kaki kursi patah dua', '2026-05-10');

    $aset->refresh();
    expect($aset->status)->toBe('Dihapuskan');
    expect($aset->alasan_penghapusan)->toBe('Kaki kursi patah dua');
    expect($aset->tanggal_penghapusan?->toDateString())->toBe('2026-05-10');
});

test('recordProcurement with autoReceive creates procurement and matching inventory item', function () {
    $pengadaan = AssetRegistry::recordProcurement([
        'nama_barang' => 'Papan Tulis Whiteboard',
        'kategori' => 'Mebel & Furnitur',
        'lokasi_tujuan' => 'Ruang Kelas 7',
        'jumlah' => 3,
        'satuan' => 'Buah',
        'estimasi_biaya' => 1500000,
    ], autoReceive: true);

    expect($pengadaan->status)->toBe('Diterima');
    expect($pengadaan->nomor_pengadaan)->toStartWith('PGD-');

    $aset = Aset::where('catatan_pemeriksaan', 'like', '%'.$pengadaan->nomor_pengadaan.'%')->first();
    expect($aset)->not->toBeNull();
    expect($aset->nama_aset)->toBe('Papan Tulis Whiteboard');
    expect($aset->jumlah)->toBe(3);
    expect($aset->status)->toBe('Tersedia');
});

test('receiveProcurement transitions status and instantiates asset', function () {
    $pengadaan = PengadaanAset::create([
        'nomor_pengadaan' => 'PGD-2026-9999',
        'nama_barang' => 'Sound System',
        'lembaga' => 'Lembaga 3',
        'kategori' => 'Elektronik & IT',
        'lokasi_tujuan' => 'Masjid Asrama',
        'jumlah' => 1,
        'satuan' => 'Set',
        'estimasi_biaya' => 5000000,
        'tanggal_pengajuan' => '2026-05-01',
        'status' => 'Disetujui',
    ]);

    $aset = AssetRegistry::receiveProcurement($pengadaan);

    $pengadaan->refresh();
    expect($pengadaan->status)->toBe('Diterima');
    expect($aset->nama_aset)->toBe('Sound System');
    expect($aset->lembaga)->toBe('Lembaga 3');
    expect($aset->lokasi)->toBe('Masjid Asrama');
    expect($aset->status)->toBe('Tersedia');
});
