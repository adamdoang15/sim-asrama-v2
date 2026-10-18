<?php

namespace App\Domain;

use App\Models\Aset;
use App\Models\PengadaanAset;

class AssetRegistry
{
    /**
     * Hasilkan kode unik aset baru dengan format AST-YYYY-XXXX.
     */
    public static function generateAssetCode(?int $year = null): string
    {
        $year = $year ?? (int) date('Y');
        $nextId = (Aset::max('id') ?? 0) + 1;

        return 'AST-'.$year.'-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Hasilkan nomor unik usulan pengadaan dengan format PGD-YYYY-XXXX.
     */
    public static function generateProcurementCode(?int $year = null): string
    {
        $year = $year ?? (int) date('Y');
        $nextId = (PengadaanAset::max('id') ?? 0) + 1;

        return 'PGD-'.$year.'-'.str_pad((string) $nextId, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Daftarkan aset baru ke inventaris aktif.
     */
    public static function registerAsset(array $attributes): Aset
    {
        if (empty($attributes['kode_aset'])) {
            $attributes['kode_aset'] = self::generateAssetCode();
        }

        if (empty($attributes['status'])) {
            $attributes['status'] = 'Tersedia';
        }

        return Aset::create($attributes);
    }

    /**
     * Catat hasil pemeriksaan berkala dan mutasikan status aset bila diperlukan.
     */
    public static function recordInspection(Aset $aset, array $data): Aset
    {
        $updateData = [
            'kondisi' => $data['kondisi'],
            'catatan_pemeriksaan' => $data['catatan_pemeriksaan'] ?? null,
            'tanggal_pemeriksaan_terakhir' => $data['tanggal_pemeriksaan']
                ?? $data['tanggal_pemeriksaan_terakhir']
                ?? now()->toDateString(),
        ];

        if (! empty($data['status'])) {
            $updateData['status'] = $data['status'];
            if ($data['status'] === 'Dihapuskan') {
                $updateData['tanggal_penghapusan'] = now()->toDateString();
                $updateData['alasan_penghapusan'] = $data['catatan_pemeriksaan'] ?? 'Dihapuskan hasil pemeriksaan berkala.';
            }
        }

        $aset->update($updateData);

        return $aset;
    }

    /**
     * Pindahkan aset ke daftar aset dihapuskan (write-off).
     */
    public static function decommission(Aset $aset, string $reason, ?string $date = null): Aset
    {
        $aset->update([
            'status' => 'Dihapuskan',
            'alasan_penghapusan' => $reason,
            'tanggal_penghapusan' => $date ?? now()->toDateString(),
        ]);

        return $aset;
    }

    /**
     * Catat pengadaan baru dan secara opsional konversikan langsung ke inventaris aktif.
     */
    public static function recordProcurement(array $attributes, bool $autoReceive = false): PengadaanAset
    {
        if (empty($attributes['nomor_pengadaan'])) {
            $attributes['nomor_pengadaan'] = self::generateProcurementCode();
        }

        $tgl = $attributes['tanggal_pengajuan'] ?? now()->toDateString();
        $attributes['tanggal_pengajuan'] = $tgl;

        if ($autoReceive) {
            $attributes['status'] = 'Diterima';
            $attributes['tanggal_diterima'] = $tgl;
        }

        $pengadaan = PengadaanAset::create($attributes);

        if ($autoReceive) {
            self::receiveProcurement($pengadaan);
        }

        return $pengadaan;
    }

    /**
     * Konversikan barang dari pengadaan yang telah tiba ke dalam inventaris aktif.
     */
    public static function receiveProcurement(PengadaanAset $pengadaan): Aset
    {
        $tgl = now()->toDateString();

        if ($pengadaan->status !== 'Diterima') {
            $pengadaan->update([
                'status' => 'Diterima',
                'tanggal_diterima' => $tgl,
            ]);
        }

        return Aset::create([
            'kode_aset' => self::generateAssetCode(),
            'nama_aset' => $pengadaan->nama_barang,
            'lembaga' => $pengadaan->lembaga,
            'kategori' => $pengadaan->kategori,
            'lokasi' => $pengadaan->lokasi_tujuan,
            'jumlah' => $pengadaan->jumlah,
            'satuan' => $pengadaan->satuan,
            'kondisi' => 'Baik',
            'status' => 'Tersedia',
            'tanggal_perolehan' => $pengadaan->tanggal_diterima ?? $tgl,
            'nilai_perolehan' => $pengadaan->estimasi_biaya,
            'catatan_pemeriksaan' => 'Aset baru dari pengadaan nomor '.$pengadaan->nomor_pengadaan,
            'tanggal_pemeriksaan_terakhir' => $tgl,
        ]);
    }
}
