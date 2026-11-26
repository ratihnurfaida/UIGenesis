<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $missingColumns = array_filter(
            ['name', 'verification_token_hash', 'verification_expires_at', 'mockups_used', 'plan'],
            fn (string $column): bool => !Schema::hasColumn('users', $column),
        );

        if ($missingColumns !== []) {
            Schema::table('users', function (Blueprint $table) use ($missingColumns): void {
                foreach ($missingColumns as $column) {
                    match ($column) {
                        'name' => $table->string('name', 80)->default(''),
                        'verification_token_hash' => $table->string('verification_token_hash', 64)->nullable(),
                        'verification_expires_at' => $table->timestamp('verification_expires_at')->nullable(),
                        'mockups_used' => $table->unsignedInteger('mockups_used')->default(0),
                        'plan' => $table->string('plan', 20)->default('free'),
                    };
                }
            });
        }

        DB::table('users')->where('name', '')->update(['name' => DB::raw('username')]);

        if (!Schema::hasTable('uigenesis_accounts')) {
            return;
        }

        DB::table('uigenesis_accounts')->orderBy('id')->chunk(100, function ($accounts): void {
            foreach ($accounts as $account) {
                $email = Str::lower(trim($account->email));
                $existing = DB::table('users')->where('email', $email)->first();
                $now = now();

                if ($existing) {
                    DB::table('users')->where('id', $existing->id)->update([
                        'name' => $account->name ?: $existing->name,
                        'email_verified_at' => $existing->email_verified_at ?: $account->email_verified_at,
                        'verification_token_hash' => $existing->verification_token_hash ?: $account->verification_token_hash,
                        'verification_expires_at' => $existing->verification_expires_at ?: $account->verification_expires_at,
                        'mockups_used' => max((int) $existing->mockups_used, (int) $account->mockups_used),
                        'plan' => $account->plan ?: ($existing->plan ?: 'free'),
                        'updated_at' => $now,
                    ]);
                    continue;
                }

                $name = $account->name ?: 'Pengguna UIGenesis';
                DB::table('users')->insert([
                    'username' => $this->uniqueUsername($name),
                    'name' => $name,
                    'email' => $email,
                    'password' => $account->password,
                    'email_verified_at' => $account->email_verified_at,
                    'verification_token_hash' => $account->verification_token_hash,
                    'verification_expires_at' => $account->verification_expires_at,
                    'mockups_used' => $account->mockups_used,
                    'plan' => $account->plan ?: 'free',
                    'created_at' => $account->created_at ?: $now,
                    'updated_at' => $now,
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $columns = [
                'name',
                'verification_token_hash',
                'verification_expires_at',
                'mockups_used',
                'plan',
            ];
            $existing = array_values(array_filter($columns, fn (string $column): bool => Schema::hasColumn('users', $column)));
            if ($existing !== []) {
                $table->dropColumn($existing);
            }
        });
    }

    private function uniqueUsername(string $name): string
    {
        $base = Str::slug($name) ?: 'pengguna';
        $base = mb_substr($base, 0, 180);
        $username = $base;
        $suffix = 2;

        while (DB::table('users')->where('username', $username)->exists()) {
            $username = mb_substr($base, 0, 180 - strlen((string) $suffix)).'-'.$suffix;
            $suffix++;
        }

        return $username;
    }
};
