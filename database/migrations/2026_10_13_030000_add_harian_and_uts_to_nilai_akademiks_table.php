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
        Schema::table('nilai_akademiks', function (Blueprint $table) {
            $table->decimal('h1', 5, 2)->default(0)->after('mata_pelajaran');
            $table->decimal('h2', 5, 2)->default(0)->after('h1');
            $table->decimal('h3', 5, 2)->default(0)->after('h2');
            $table->decimal('h4', 5, 2)->default(0)->after('h3');
            $table->decimal('h5', 5, 2)->default(0)->after('h4');
            $table->decimal('uts', 5, 2)->default(0)->after('h5');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nilai_akademiks', function (Blueprint $table) {
            $table->dropColumn(['h1', 'h2', 'h3', 'h4', 'h5', 'uts']);
        });
    }
};
