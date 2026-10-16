<?php

namespace Database\Seeders;

use App\Models\TransaksiKeuangan;
use Illuminate\Database\Seeder;

class TransaksiKeuanganSeeder extends Seeder
{
    public function run(): void
    {
        $lembaga = 'LKP Doa Bangsa Cicantayan';

        $data = [
            // 1. BOP OT Mandiri
            ['tanggal' => '2026-07-15', 'pos_keuangan' => 'BOP OT Mandiri', 'jenis' => 'masuk', 'nominal' => 57549000, 'keterangan' => 'Penerimaan Iuran BOP Santri Mandiri Juli 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-07-28', 'pos_keuangan' => 'BOP OT Mandiri', 'jenis' => 'keluar', 'nominal' => 46324343, 'keterangan' => 'Realisasi Operasional Pendidikan Juli 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-08-15', 'pos_keuangan' => 'BOP OT Mandiri', 'jenis' => 'masuk', 'nominal' => 54328500, 'keterangan' => 'Penerimaan Iuran BOP Santri Mandiri Agustus 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-08-28', 'pos_keuangan' => 'BOP OT Mandiri', 'jenis' => 'keluar', 'nominal' => 48567500, 'keterangan' => 'Realisasi Operasional Pendidikan Agustus 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-09-15', 'pos_keuangan' => 'BOP OT Mandiri', 'jenis' => 'masuk', 'nominal' => 50062500, 'keterangan' => 'Penerimaan Iuran BOP Santri Mandiri September 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-09-28', 'pos_keuangan' => 'BOP OT Mandiri', 'jenis' => 'keluar', 'nominal' => 55614632, 'keterangan' => 'Realisasi Operasional Pendidikan September 2026', 'lembaga' => $lembaga],

            // 2. Bansos LKP
            ['tanggal' => '2026-06-30', 'pos_keuangan' => 'Bansos LKP', 'jenis' => 'masuk', 'nominal' => 4200000, 'keterangan' => 'Saldo Awal Dana Bansos LKP (Infak Bu Lina Sofi)', 'lembaga' => $lembaga],

            // 3. Tabungan Gelara
            ['tanggal' => '2026-06-30', 'pos_keuangan' => 'Tabungan Gelara', 'jenis' => 'masuk', 'nominal' => 12610000, 'keterangan' => 'Saldo Awal Tabungan Santri Gelara', 'lembaga' => $lembaga],
            ['tanggal' => '2026-07-20', 'pos_keuangan' => 'Tabungan Gelara', 'jenis' => 'masuk', 'nominal' => 2240000, 'keterangan' => 'Setoran Tabungan Santri Juli 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-08-20', 'pos_keuangan' => 'Tabungan Gelara', 'jenis' => 'masuk', 'nominal' => 1110000, 'keterangan' => 'Setoran Tabungan Santri Agustus 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-09-20', 'pos_keuangan' => 'Tabungan Gelara', 'jenis' => 'masuk', 'nominal' => 1480000, 'keterangan' => 'Setoran Tabungan Santri September 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-09-25', 'pos_keuangan' => 'Tabungan Gelara', 'jenis' => 'keluar', 'nominal' => 300000, 'keterangan' => 'Penarikan Tabungan Santri', 'lembaga' => $lembaga],

            // 4. Tabungan Umum
            ['tanggal' => '2026-06-30', 'pos_keuangan' => 'Tabungan Umum', 'jenis' => 'masuk', 'nominal' => 8967500, 'keterangan' => 'Sisa Dana Awal Tahun TA 2324, 2425, 2526', 'lembaga' => $lembaga],

            // 5. Tabungan Qurban Sapi Civitas Asrama
            ['tanggal' => '2026-06-30', 'pos_keuangan' => 'Tabungan Qurban Sapi Civitas Asrama', 'jenis' => 'masuk', 'nominal' => 71908, 'keterangan' => 'Saldo Awal Tabungan Qurban Sapi', 'lembaga' => $lembaga],
            ['tanggal' => '2026-09-30', 'pos_keuangan' => 'Tabungan Qurban Sapi Civitas Asrama', 'jenis' => 'masuk', 'nominal' => 90, 'keterangan' => 'Bunga & Bagi Hasil Bank September 2026', 'lembaga' => $lembaga],

            // 6. Hasil Pertanian dll
            ['tanggal' => '2026-06-30', 'pos_keuangan' => 'Hasil Pertanian dll', 'jenis' => 'masuk', 'nominal' => 1825800, 'keterangan' => 'Saldo Awal Unit Usaha Pertanian', 'lembaga' => $lembaga],
            ['tanggal' => '2026-07-10', 'pos_keuangan' => 'Hasil Pertanian dll', 'jenis' => 'keluar', 'nominal' => 1800000, 'keterangan' => 'Pengadaan Bibit & Pupuk Lahan Asrama', 'lembaga' => $lembaga],
            ['tanggal' => '2026-08-15', 'pos_keuangan' => 'Hasil Pertanian dll', 'jenis' => 'masuk', 'nominal' => 1137000, 'keterangan' => 'Penjualan Hasil Panen Pertanian', 'lembaga' => $lembaga],
            ['tanggal' => '2026-09-10', 'pos_keuangan' => 'Hasil Pertanian dll', 'jenis' => 'keluar', 'nominal' => 1137000, 'keterangan' => 'Biaya Perawatan Kebun & Pengairan', 'lembaga' => $lembaga],

            // 7. Infak Gelara
            ['tanggal' => '2026-06-30', 'pos_keuangan' => 'Infak Gelara', 'jenis' => 'masuk', 'nominal' => 1203500, 'keterangan' => 'Saldo Awal Infak Santri Gelara', 'lembaga' => $lembaga],
            ['tanggal' => '2026-07-25', 'pos_keuangan' => 'Infak Gelara', 'jenis' => 'masuk', 'nominal' => 896000, 'keterangan' => 'Penerimaan Infak Santri Juli 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-08-25', 'pos_keuangan' => 'Infak Gelara', 'jenis' => 'masuk', 'nominal' => 444000, 'keterangan' => 'Penerimaan Infak Santri Agustus 2026', 'lembaga' => $lembaga],
            ['tanggal' => '2026-09-25', 'pos_keuangan' => 'Infak Gelara', 'jenis' => 'masuk', 'nominal' => 592000, 'keterangan' => 'Penerimaan Infak Santri September 2026', 'lembaga' => $lembaga],
        ];

        foreach ($data as $item) {
            TransaksiKeuangan::create($item);
        }
    }
}
