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
            $table->string('kelas')->default('Kelas 10')->nullable()->after('angkatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gelaras', function (Blueprint $table) {
            $table->dropColumn('kelas');
        });
    }
};
