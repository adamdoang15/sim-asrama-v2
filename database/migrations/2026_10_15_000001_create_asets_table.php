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
        Schema::create('asets', function (Blueprint $table) {
            $table->id();
            $table->string('kode_aset')->unique();
            $table->string('nama_aset');
            $table->string('kategori');
            $table->string('lokasi');
            $table->integer('jumlah')->default(1);
            $table->string('satuan')->default('Unit');
            $table->string('kondisi')->default('Baik'); // Baik, Rusak Ringan, Rusak Berat
            $table->string('status')->default('Tersedia'); // Tersedia, Dalam Perbaikan, Dihapuskan
            $table->date('tanggal_perolehan')->nullable();
            $table->decimal('nilai_perolehan', 15, 2)->nullable();
            $table->date('tanggal_pemeriksaan_terakhir')->nullable();
            $table->text('catatan_pemeriksaan')->nullable();
            $table->text('alasan_penghapusan')->nullable();
            $table->date('tanggal_penghapusan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asets');
    }
};
