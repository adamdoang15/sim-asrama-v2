<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengadaan_asets', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_pengadaan')->unique();
            $table->string('nama_barang');
            $table->string('kategori');
            $table->string('lokasi_tujuan');
            $table->integer('jumlah')->default(1);
            $table->string('satuan')->default('Unit');
            $table->decimal('estimasi_biaya', 15, 2)->nullable();
            $table->string('sumber_dana')->nullable();
            $table->string('status')->default('Diajukan'); // Diajukan, Disetujui, Ditolak, Diterima
            $table->date('tanggal_pengajuan');
            $table->date('tanggal_diterima')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengadaan_asets');
    }
};
