<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelas_mapels', function (Blueprint $table) {
            $table->id();
            $table->string('kelas')->unique();
            $table->json('mapels');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas_mapels');
    }
};
