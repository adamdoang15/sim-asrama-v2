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
        Schema::create('nilai_akademiks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gelara_id')->constrained('gelaras')->onDelete('cascade');
            $table->string('tahun_akademik')->default('T.A. 2026/2027 (Semester Ganjil)');
            $table->string('kelas')->default('Kelas 10');
            $table->string('mata_pelajaran')->default('Bahasa Arab');
            $table->decimal('uas', 5, 2)->default(0);
            $table->decimal('nilai_akhir', 5, 2)->default(0);
            $table->decimal('mutu', 5, 2)->default(0);
            $table->string('predikat', 5)->default('-');
            $table->text('deskripsi')->nullable();
            $table->timestamps();

            $table->unique(['gelara_id', 'tahun_akademik', 'kelas', 'mata_pelajaran'], 'nilai_akademik_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_akademiks');
    }
};
