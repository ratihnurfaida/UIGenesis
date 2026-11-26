<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class EnsureSessionUser
{
    public function handle(Request $request, Closure $next): Response
    {
        $userId = $request->session()->get('uig_user_id');
        $account = $userId ? DB::table('users')->where('id', $userId)->first() : null;
        if (!$account || !$account->email_verified_at) {
            $request->session()->invalidate();
            return redirect()->route('login');
        }

        $request->attributes->set('uigUser', $account);

        return $next($request);
    }
}
