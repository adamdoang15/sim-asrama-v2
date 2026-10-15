<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'gelaras',
            'pegawais',
            'kegiatans',
            'daily_activities',
            'pelanggarans',
            'prestasis',
            'kalender_akademiks',
            'nilai_akademiks',
            'kelas_mapels',
            'rapor_pelengkaps',
            'kesehatans',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && ! Schema::hasColumn($table, 'lembaga')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->string('lembaga')->nullable()->index();
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'gelaras',
            'pegawais',
            'kegiatans',
            'daily_activities',
            'pelanggarans',
            'prestasis',
            'kalender_akademiks',
            'nilai_akademiks',
            'kelas_mapels',
            'rapor_pelengkaps',
            'kesehatans',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'lembaga')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->dropColumn('lembaga');
                });
            }
        }
    }
};
