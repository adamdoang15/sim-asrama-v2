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
        Schema::create('daily_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gelara_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->json('activities')->nullable();
            $table->timestamps();

            // A Gelara should only have one daily activity record per day
            $table->unique(['gelara_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_activities');
    }
};
