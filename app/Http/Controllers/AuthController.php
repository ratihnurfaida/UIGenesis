<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AuthController
{
    /** Tampilkan form login atau arahkan pengguna yang sudah masuk ke dashboard. */
    public function showLogin(): View|RedirectResponse
    {
        return session()->has('uig_user') ? redirect()->route('dashboard') : view('login');
    }

    /** Validasi akun demo dan mulai sesi pengguna. */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.min' => 'Password minimal 6 karakter.',
        ]);

        if ($credentials['email'] === 'demo@uigenesis.id' && $credentials['password'] !== 'demo123') {
            return back()->withErrors(['password' => 'Password akun demo salah. Gunakan "demo123".'])->onlyInput('email');
        }

        $email = strtolower($credentials['email']);
        $name = $email === 'demo@uigenesis.id'
            ? 'Demo Designer'
            : ucwords(preg_replace('/[._-]+/', ' ', explode('@', $email)[0]));

        $request->session()->regenerate();
        $request->session()->put('uig_user', [
            'name' => $name,
            'email' => $email,
            'plan' => 'Pro (Trial)',
        ]);

        return redirect()->intended(route('dashboard'));
    }

    /** Akhiri sesi dan perbarui token CSRF. */
    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget('uig_user');
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
