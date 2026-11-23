<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

// Halaman publik
Route::get('/', [HomeController::class, 'index'])->name('home');

// Login dan logout pengguna
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth.session')->name('logout');

// Halaman yang hanya bisa dibuka setelah login
Route::middleware('auth.session')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});
