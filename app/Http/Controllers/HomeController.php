<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController
{
    /** Tampilkan halaman publik UIGenesis. */
    public function index(): View
    {
        return view('home');
    }
}
