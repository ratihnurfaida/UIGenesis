<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class DashboardController
{
    /** Tampilkan dashboard untuk pengguna yang sudah masuk. */
    public function index(): View
    {
        return view('dashboard', ['user' => session('uig_user')]);
    }
}
