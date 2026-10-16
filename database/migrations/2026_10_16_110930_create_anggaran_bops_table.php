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
        Schema::create('anggaran_bops', function (Blueprint $table) {
            $table->id();
            $table->string('tahun_ajaran')->default('2026/2027');
            $table->string('bulan');
            $table->enum('sumber_dana', ['fkdb', 'ot'])->default('fkdb');
            $table->enum('tipe', ['pengeluaran', 'pemasukan'])->default('pengeluaran');
            $table->string('kategori')->default('Operasional');
            $table->string('uraian');
            $table->decimal('plan', 15, 2)->default(0);
            $table->decimal('aktual', 15, 2)->default(0);
            $table->string('keterangan', 500)->nullable();
            $table->string('lembaga')->nullable()->default('LKP Doa Bangsa Cicantayan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggaran_bops');
    }
};
