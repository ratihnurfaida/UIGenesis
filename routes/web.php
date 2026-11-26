<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AiPaletteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MockupUsageController;
use Illuminate\Support\Facades\Route;

// Halaman publik
Route::get('/', [HomeController::class, 'index'])->name('home');

// Login dan logout pengguna
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->name('register.store');
Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail'])->name('verify-email');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Halaman yang hanya bisa dibuka setelah login
Route::middleware('auth.session')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/ai/palette', AiPaletteController::class)->name('ai.palette');
    Route::post('/mockup-usage', [MockupUsageController::class, 'consume'])->name('mockup-usage.consume');
});
