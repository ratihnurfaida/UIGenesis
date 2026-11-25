<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Throwable;

class AuthController
{
    private const DEMO_EMAIL = 'demo@uigenesis.id';

    public function showLogin(): View
    {
        return view('login');
    }

    public function showRegister(): View
    {
        return view('register');
    }

    public function register(Request $request): RedirectResponse
    {
        $registrationKey = 'register|'.$request->ip();
        if (RateLimiter::tooManyAttempts($registrationKey, 5)) {
            return back()->withErrors(['email' => 'Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti.'])->withInput($request->except('password', 'password_confirmation'));
        }
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'email.email' => 'Masukkan alamat email yang valid.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password belum cocok.',
        ]);

        $email = Str::lower(trim($data['email']));
        $this->importLegacyAccounts();
        if ($email === self::DEMO_EMAIL || DB::table('uigenesis_accounts')->where('email', $email)->exists()) {
            RateLimiter::hit($registrationKey, 3600);
            return back()->withErrors(['email' => 'Email ini sudah terdaftar. Silakan masuk.'])->withInput($request->except('password', 'password_confirmation'));
        }
        RateLimiter::hit($registrationKey, 3600);

        $token = Str::random(64);
        $now = now();
        $id = DB::table('uigenesis_accounts')->insertGetId([
            'name' => trim($data['name']),
            'email' => $email,
            'password' => Hash::make($data['password']),
            'verification_token_hash' => hash('sha256', $token),
            'verification_expires_at' => $now->copy()->addHour(),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        if (!$this->sendVerification($email, $token)) {
            return redirect()->route('login')->with('status', 'Akun sudah dibuat. Email verifikasi belum terkirim; periksa konfigurasi email lalu coba masuk untuk meminta tautan baru.');
        }

        $message = config('mail.default') === 'log'
            ? 'Akun dibuat untuk '.$email.'. Mode lokal tidak mengirim email; buka tautan verifikasi di storage/logs/laravel.log sebelum masuk.'
            : 'Akun dibuat untuk '.$email.'. Buka tautan verifikasi yang dikirim ke email tersebut sebelum masuk.';
        return redirect()->route('login')->with('status', $message);
    }

    public function verifyEmail(string $token): RedirectResponse
    {
        $account = DB::table('uigenesis_accounts')
            ->where('verification_token_hash', hash('sha256', $token))
            ->where('verification_expires_at', '>', now())
            ->first();

        if (!$account) {
            return redirect()->route('login')->withErrors(['email' => 'Tautan verifikasi tidak valid atau sudah kedaluwarsa. Masuk untuk meminta tautan baru.']);
        }

        DB::table('uigenesis_accounts')->where('id', $account->id)->update([
            'email_verified_at' => now(),
            'verification_token_hash' => null,
            'verification_expires_at' => null,
            'updated_at' => now(),
        ]);

        return redirect()->route('login')->with('status', 'Email berhasil diverifikasi. Silakan masuk dengan akunmu.');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
        ], [
            'email.email' => 'Format email tidak valid.',
            'password.min' => 'Password minimal 6 karakter.',
        ]);

        $email = Str::lower(trim($credentials['email']));
        $key = Str::transliterate($email.'|'.$request->ip());
        if (RateLimiter::tooManyAttempts($key, 8)) {
            return back()->withErrors(['email' => 'Terlalu banyak percobaan masuk. Coba lagi dalam satu menit.'])->onlyInput('email');
        }

        $this->ensureDemoAccount();
        $this->importLegacyAccounts();
        $account = DB::table('uigenesis_accounts')->where('email', $email)->first();
        if (!$account || !Hash::check($credentials['password'], $account->password)) {
            RateLimiter::hit($key, 60);
            return back()->withErrors(['email' => 'Email atau password tidak cocok. Jika belum punya akun, silakan daftar.'])->onlyInput('email');
        }

        if (!$account->email_verified_at) {
            $verificationKey = 'verify-resend|'.$account->id.'|'.$request->ip();
            if (RateLimiter::tooManyAttempts($verificationKey, 1)) {
            return back()->with('status', 'Tautan verifikasi untuk '.$email.' baru saja dibuat. Periksa email atau file log, lalu coba lagi dalam satu menit.');
            }
            RateLimiter::hit($verificationKey, 60);
            $token = Str::random(64);
            DB::table('uigenesis_accounts')->where('id', $account->id)->update([
                'verification_token_hash' => hash('sha256', $token),
                'verification_expires_at' => now()->addHour(),
                'updated_at' => now(),
            ]);
            $sent = $this->sendVerification($email, $token);
            if (!$sent) {
                return back()->with('status', 'Email '.$email.' belum diverifikasi. Pengiriman tautan gagal; periksa konfigurasi Gmail SMTP di .env.');
            }
            $message = config('mail.default') === 'log'
                ? 'Email '.$email.' belum diverifikasi. Mode lokal tidak mengirim email; buka tautan verifikasi di storage/logs/laravel.log.'
                : 'Email '.$email.' belum diverifikasi. Tautan baru sudah dikirim ke alamat tersebut.';
            return back()->with('status', $message);
        }

        RateLimiter::clear($key);
        $this->startSession($request, $account);
        return redirect()->intended(route('dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }

    private function ensureDemoAccount(): void
    {
        DB::table('uigenesis_accounts')->insertOrIgnore([
            'name' => 'Demo Designer',
            'email' => self::DEMO_EMAIL,
            'password' => Hash::make('demo123'),
            'email_verified_at' => now(),
            'mockups_used' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function importLegacyAccounts(): void
    {
        $path = storage_path('app/private/accounts.json');
        if (!is_file($path)) {
            return;
        }
        $legacy = json_decode(file_get_contents($path), true);
        if (!is_array($legacy)) {
            return;
        }
        foreach ($legacy as $email => $account) {
            if (!is_string($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || !is_array($account) || empty($account['password'])) {
                continue;
            }
            $now = now();
            DB::table('uigenesis_accounts')->insertOrIgnore([
                'name' => mb_substr((string) ($account['name'] ?? 'Pengguna UIGenesis'), 0, 80),
                'email' => Str::lower($email),
                'password' => $account['password'],
                'mockups_used' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    private function startSession(Request $request, object $account): void
    {
        $request->session()->regenerate();
        $request->session()->put([
            'uig_account_id' => (int) $account->id,
            'uig_user' => ['name' => $account->name, 'email' => $account->email, 'plan' => ucfirst($account->plan ?? 'free')],
        ]);
    }

    private function sendVerification(string $email, string $token): bool
    {
        try {
            $url = route('verify-email', ['token' => $token]);
            Mail::raw("Verifikasi akun UIGenesis dengan membuka tautan ini:\n\n{$url}\n\nTautan berlaku selama satu jam.", function ($message) use ($email): void {
                $message->to($email)->subject('Verifikasi akun UIGenesis');
            });
            return true;
        } catch (Throwable $exception) {
            report($exception);
            return false;
        }
    }
}
