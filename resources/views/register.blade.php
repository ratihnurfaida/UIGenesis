<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Buat Akun — UIGenesis</title>
  <meta name="description" content="Buat akun UIGenesis untuk menyimpan palet warna dan mengembangkan ide desain menjadi mockup UI.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
</head>
<body>
<div class="auth">
  <aside class="auth-art">
    <a href="{{ route('home') }}" class="logo"><span class="logo-mark"></span><span>UI<b style="color:#b9a8ff">Genesis</b></span></a>
    <div>
      <div class="auth-swatches"><i style="background:#6d4aff"></i><i style="background:#00c2a8"></i><i style="background:#ff7a59"></i><i style="background:#fbfaff"></i><i style="background:#1b1530"></i></div>
      <h2>Mulai dari satu warna. Bangun seluruh ide visualmu.</h2>
      <p>Buat palet, jelajahi inspirasi, lalu lihat konsep desainmu menjadi mockup website.</p>
    </div>
    <p class="auth-quote">Ruang kreatif untuk merancang, bereksperimen, dan menyimpan setiap ide desainmu.</p>
  </aside>

  <main class="auth-form-wrap">
    <div class="auth-form">
      <h1>Buat akun gratis ✨</h1>
      <p>Daftar dengan email aktif. Kamu perlu memverifikasi email sebelum masuk.</p>

      <form method="POST" action="{{ route('register.store') }}">
        @csrf
        <label class="field"><span>Nama lengkap</span>
          <div class="input-group"><i data-icon="user"></i><input class="input" name="name" type="text" value="{{ old('name') }}" placeholder="Nama kamu" autocomplete="name" maxlength="80" required></div>
          @error('name')<small class="form-error">{{ $message }}</small>@enderror
        </label>
        <label class="field"><span>Email</span>
          <div class="input-group"><i data-icon="mail"></i><input class="input" name="email" type="email" value="{{ old('email') }}" placeholder="nama@email.com" autocomplete="email" required></div>
          @error('email')<small class="form-error">{{ $message }}</small>@enderror
        </label>
        <label class="field"><span>Password</span>
          <div class="input-group"><i data-icon="key"></i><input class="input" id="password" name="password" type="password" placeholder="Minimal 8 karakter" autocomplete="new-password" minlength="8" required style="padding-right:44px"><button type="button" class="pw-toggle" data-toggle="password" aria-label="Tampilkan password"><i data-icon="eye"></i></button></div>
          <small style="color:var(--muted);font-size:12px">Gunakan minimal 8 karakter agar akunmu lebih aman.</small>
          @error('password')<small class="form-error">{{ $message }}</small>@enderror
        </label>
        <label class="field"><span>Konfirmasi password</span>
          <div class="input-group"><i data-icon="key"></i><input class="input" id="password_confirmation" name="password_confirmation" type="password" placeholder="Ulangi password" autocomplete="new-password" minlength="8" required style="padding-right:44px"><button type="button" class="pw-toggle" data-toggle="password_confirmation" aria-label="Tampilkan konfirmasi password"><i data-icon="eye"></i></button></div>
        </label>
        <button class="btn btn-primary btn-lg btn-block" type="submit">Buat Akun</button>
      </form>

      <p class="auth-foot">Sudah punya akun? <a href="{{ route('login') }}">Masuk di sini</a><br><a href="{{ route('home') }}">← Kembali ke beranda</a></p>
    </div>
  </main>
</div>
<script src="{{ asset('assets/js/app.js') }}"></script>
<script>
  document.querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.toggle);
    input.type = input.type === 'password' ? 'text' : 'password';
  }));
</script>
</body>
</html>
