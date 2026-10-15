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
        Schema::create('pelanggarans', function (Blueprint $table) {
            $table->id();
            $table->date('date')->nullable();
            $table->time('time')->nullable();
            $table->string('name')->nullable();
            $table->string('nim')->nullable();
            $table->string('room')->nullable();
            $table->string('category')->nullable(); // Sedang, Berat, Sangat Berat
            $table->string('type')->nullable(); // info, warning, danger
            $table->string('descTitle')->nullable();
            $table->text('descSub')->nullable();
            $table->string('petugas')->nullable();
            $table->boolean('isSystem')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggarans');
    }
};
