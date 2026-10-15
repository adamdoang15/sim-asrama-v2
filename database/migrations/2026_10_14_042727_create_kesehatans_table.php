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
        Schema::create('kesehatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gelara_id')->constrained('gelaras')->onDelete('cascade');
            $table->string('tahun_akademik');
            $table->string('semester')->default('1');
            $table->decimal('berat_badan', 5, 2)->nullable();
            $table->decimal('tinggi_badan', 5, 2)->nullable();
            $table->decimal('imt', 5, 2)->nullable();
            $table->string('imt_kategori')->nullable();
            $table->string('tensi')->nullable();
            $table->string('tensi_kategori')->nullable();
            $table->json('riwayat_sakit')->nullable();
            $table->text('catatan_kesehatan')->nullable();
            $table->timestamps();

            $table->unique(['gelara_id', 'tahun_akademik', 'semester'], 'kesehatan_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kesehatans');
    }
};
