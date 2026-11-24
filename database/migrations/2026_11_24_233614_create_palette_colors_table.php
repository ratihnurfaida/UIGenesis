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
        Schema::create('palette_colors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('palette_id')->constrained('palettes')->onDelete('cascade');
            $table->enum('role', ['primary', 'secondary', 'accent', 'background', 'text']);
            $table->char('hex_value', 7);
            $table->unique(['palette_id', 'role']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('palette_colors');
    }
};
