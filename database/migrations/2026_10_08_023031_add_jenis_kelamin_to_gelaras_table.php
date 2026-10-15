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
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gelaras', function (Blueprint $table) {
            $table->dropColumn('jenis_kelamin');
        });
    }
};
