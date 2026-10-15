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
        Schema::create('perbaikan_asets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aset_id')->constrained('asets')->onDelete('cascade');
            $table->string('nomor_laporan')->unique();
            $table->string('pelapor');
            $table->text('deskripsi_kerusakan');
            $table->string('prioritas')->default('Sedang'); // Rendah, Sedang, Tinggi, Darurat
            $table->string('status')->default('Menunggu'); // Menunggu, Diproses, Selesai, Ditolak
            $table->decimal('biaya', 15, 2)->nullable();
            $table->string('teknisi')->nullable();
            $table->date('tanggal_pengajuan');
            $table->date('tanggal_selesai')->nullable();
            $table->text('catatan_penyelesaian')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perbaikan_asets');
    }
};
