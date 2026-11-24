
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('palettes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('design_style_id')
                ->constrained('design_styles')
                ->cascadeOnDelete();

            $table->string('name', 80);
            $table->enum('source', ['library', 'ai', 'custom']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('palettes');
    }
};
