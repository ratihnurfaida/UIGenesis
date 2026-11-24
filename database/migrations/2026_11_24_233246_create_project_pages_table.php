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
        Schema::create('projects_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('page_option_id')->constrained('page_options')->onDelete('cascade');
            $table->unsignedSmallInteger('sort_order');
            $table->string('slug', 100);
            $table->json('ui_schema')->nullable();
            $table->timestamps();
            $table->unique(['project_id', 'page_option_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects_pages');
    }
};
