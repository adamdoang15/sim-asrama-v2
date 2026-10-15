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
        Schema::table('gelaras', function (Blueprint $table) {
            $table->dropColumn(['ta', 'ayah', 'ibu']);
            $table->string('tahun_diterima')->nullable()->after('angkatan');
            $table->string('nama_ayah')->nullable()->after('tahun_diterima');
            $table->string('pekerjaan_ayah')->nullable()->after('nama_ayah');
            $table->string('nama_ibu')->nullable()->after('pekerjaan_ayah');
            $table->string('pekerjaan_ibu')->nullable()->after('nama_ibu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gelaras', function (Blueprint $table) {
            $table->string('ta')->nullable();
            $table->string('ayah')->nullable();
            $table->string('ibu')->nullable();
            $table->dropColumn(['tahun_diterima', 'nama_ayah', 'pekerjaan_ayah', 'nama_ibu', 'pekerjaan_ibu']);
        });
    }
};
