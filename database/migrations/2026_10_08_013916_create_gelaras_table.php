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
        Schema::create('gelaras', function (Blueprint $table) {
            $table->id();
            $table->string('nig');
            $table->string('name');
            $table->string('ttl');
            $table->string('angkatan');
            $table->string('ta');
            $table->string('ayah');
            $table->string('ibu');
            $table->string('domisili');
            $table->string('status_berkas')->default('Berkas Valid');
            $table->string('foto')->nullable();
            $table->string('avatar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gelaras');
    }
};
