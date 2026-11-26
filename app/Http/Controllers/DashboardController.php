<?php

namespace App\Http\Controllers;

use Illuminate\View\View;
use Illuminate\Http\Request;

class DashboardController
{
    /** Tampilkan dashboard untuk pengguna yang sudah masuk. */
    public function index(Request $request): View
    {
        $account = $request->attributes->get('uigUser');
        return view('dashboard', [
            'user' => session('uig_user'),
            'usage' => ['used' => (int) $account->mockups_used, 'limit' => $account->plan === 'free' ? 5 : null, 'plan' => $account->plan],
        ]);
    }
}
