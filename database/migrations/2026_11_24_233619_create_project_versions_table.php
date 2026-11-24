
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_versions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('project_id')
                ->constrained('projects')
                ->cascadeOnDelete();

            $table->unsignedInteger('version_number');

            $table->foreignId('created_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->json('snapshot');

            $table->string('note', 255)->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->unique(['project_id', 'version_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_versions');
    }
};
