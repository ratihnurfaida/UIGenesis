
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users');

            $table->foreignId('project_id')
                ->constrained('projects');

            $table->enum('export_type', [
                'html',
                'json'
            ]);

            $table->string('file_name', 150);

            $table->string('file_path', 255)->nullable();

            $table->enum('status', [
                'success',
                'failed'
            ]);

            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exports');
    }
};
