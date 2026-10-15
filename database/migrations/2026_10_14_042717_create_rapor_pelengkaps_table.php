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
        Schema::create('rapor_pelengkaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gelara_id')->constrained('gelaras')->onDelete('cascade');
            $table->string('tahun_akademik');
            $table->string('kelas');
            $table->string('sikap_spiritual_predikat')->default('Sangat Baik');
            $table->text('sikap_spiritual_deskripsi')->nullable();
            $table->string('sikap_sosial_predikat')->default('Sangat Baik');
            $table->text('sikap_sosial_deskripsi')->nullable();
            $table->json('ekskul')->nullable();
            $table->integer('absensi_sakit')->default(0);
            $table->integer('absensi_izin')->default(0);
            $table->integer('absensi_alpha')->default(0);
            $table->text('catatan_wali')->nullable();
            $table->timestamps();

            $table->unique(['gelara_id', 'tahun_akademik', 'kelas'], 'rapor_pelengkap_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapor_pelengkaps');
    }
};
