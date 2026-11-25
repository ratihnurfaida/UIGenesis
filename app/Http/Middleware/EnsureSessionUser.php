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
        $accountId = $request->session()->get('uig_account_id');
        $account = $accountId ? DB::table('uigenesis_accounts')->where('id', $accountId)->first() : null;
        if (!$account || !$account->email_verified_at) {
            $request->session()->invalidate();
            return redirect()->route('login');
        }

        $request->attributes->set('uigAccount', $account);

        return $next($request);
    }
}
