<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MockupUsageController
{
    private const FREE_MOCKUP_LIMIT = 5;

    public function consume(Request $request): JsonResponse
    {
        $userId = (int) $request->session()->get('uig_user_id');
        $account = DB::table('users')->where('id', $userId)->first();
        if (!$account || !$account->email_verified_at) {
            return response()->json(['ok' => false, 'message' => 'Silakan masuk kembali.'], 401);
        }

        $query = DB::table('users')->where('id', $userId);
        if ($account->plan === 'free') {
            $query->where('mockups_used', '<', self::FREE_MOCKUP_LIMIT);
        }
        $updated = $query->increment('mockups_used');
        $used = (int) (DB::table('users')->where('id', $userId)->value('mockups_used') ?? 0);
        if (!$updated) {
            return response()->json([
                'ok' => false,
                'limit_reached' => true,
                'used' => $used,
                'limit' => self::FREE_MOCKUP_LIMIT,
                'message' => 'Kuota gratis 5 mockup sudah habis. Upgrade akun untuk melanjutkan.',
            ], 429);
        }

        return response()->json([
            'ok' => true,
            'used' => $used,
            'limit' => $account->plan === 'free' ? self::FREE_MOCKUP_LIMIT : null,
            'remaining' => $account->plan === 'free' ? max(0, self::FREE_MOCKUP_LIMIT - $used) : null,
        ]);
    }
}
