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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('app_category_id')->constrained('app_categories')->onDelete('cascade');
            $table->foreignId('design_style_id')->constrained('design_styles')->onDelete('cascade');
            $table->foreignId('website_type_id')->constrained('website_types')->onDelete('cascade');
            $table->foreignId('font_id')->constrained('fonts')->onDelete('cascade');
            $table->string('name', 120);
            $table->enum('flow_status', ['requirements',
                'palette',
                'design',
                'mockup',
                'edit',
                'completed'])->default('requirements');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
