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
        Schema::create('generation_runs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->enum('generation_type', ['palette', 'mockup']);
            $table->string('provider', 50)->nullable();
            $table->string('model', 100)->nullable();
            $table->enum('status', ['queued', 'success', 'completed', 'failed'])->default('queued');
            $table->boolean('consumes_quota')->default(false);
            $table->json('request_payload');
            $table->json('response_payload')->nullable();
            $table->text('error_message')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generation_runs');
    }
};
