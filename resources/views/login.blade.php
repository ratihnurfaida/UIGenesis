<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Masuk — UIGenesis</title>
  <meta name="description" content="Masuk ke UIGenesis untuk membuat palet warna dan mockup UI website.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
</head>
<body>
<div class="auth">
  <aside class="auth-art">
    <a href="{{ route('home') }}" class="logo"><span class="logo-mark" aria-hidden="true">G</span><span>UI<b style="color:#b9a8ff">Genesis</b></span></a>
    <div>
      <div class="auth-swatches" id="artSwatches">
        <i style="background:#6d4aff"></i><i style="background:#00c2a8"></i><i style="background:#ff7a59"></i><i style="background:#fbfaff"></i><i style="background:#1b1530"></i>
      </div>
      <h2>Dari palet warna menjadi website utuh, dalam hitungan detik.</h2>
      <p>Masuk untuk menyimpan proyek, mengekspor mockup HTML, dan mengelola koleksi palet Anda.</p>
    </div>
    <p class="auth-quote">“UIGenesis memangkas waktu eksplorasi visual tim kami dari berhari-hari menjadi satu sore.” — Rani, Lead Designer</p>
  </aside>

  <div class="auth-form-wrap">
    <div class="auth-form">
      <h1>Selamat datang kembali 👋</h1>
      <p>Masuk ke akun UIGenesis Anda untuk melanjutkan.</p>

      <form id="loginForm" method="POST" action="{{ route('login.store') }}" novalidate>
        @csrf
        <label class="field"><span>Email</span>
          <div class="input-group"><i data-icon="mail"></i><input class="input" id="email" name="email" type="email" value="{{ old('email') }}" placeholder="nama@email.com" autocomplete="email" required></div>
        </label>
        <label class="field"><span>Password</span>
          <div class="input-group"><i data-icon="key"></i><input class="input" id="password" name="password" type="password" placeholder="Minimal 6 karakter" autocomplete="current-password" required style="padding-right:44px">
            <button type="button" class="pw-toggle" id="pwToggle" aria-label="Tampilkan password"><i data-icon="eye"></i></button>
          </div>
        </label>
        <div class="auth-row">
          <label><input type="checkbox" id="remember" checked> Ingat saya</label>
          <a href="#" id="forgot">Lupa password?</a>
        </div>
        <div class="form-error" id="formError" role="alert">{{ $errors->first('email') ?: $errors->first('password') }}</div>
        <button class="btn btn-primary btn-lg btn-block" type="submit" id="submitBtn">Masuk</button>
        <div class="divider">atau</div>
        <button class="btn btn-ghost btn-lg btn-block" type="button" id="googleBtn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4z"/></svg>
          Masuk dengan Google (demo)
        </button>
      </form>

      <div class="demo-box">
        <div>Akun demo:<br><code>demo@uigenesis.id</code> / <code>demo123</code></div>
        <button class="btn btn-sm btn-dark" id="fillDemo" type="button">Isi Otomatis</button>
      </div>
      <p class="auth-foot">Belum punya akun? Cukup masukkan email apa pun &amp; password ≥ 6 karakter.<br><a href="{{ route('home') }}">← Kembali ke beranda</a></p>
    </div>
  </div>
</div>

<script src="{{ asset('assets/js/app.js') }}"></script>
<script>
  (function () {
    const form = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const pass = document.getElementById('password');
    const err = document.getElementById('formError');
    const btn = document.getElementById('submitBtn');

    function doLogin(e, p) {
      email.value = e;
      pass.value = p;
      err.textContent = '';
      const res = Auth.login(e, p, document.getElementById('remember').checked);
      if (!res.ok) { err.textContent = res.error; return; }
      btn.disabled = true;
      btn.textContent = 'Memproses…';
      form.submit();
    }

    form.addEventListener('submit', ev => { ev.preventDefault(); const res = Auth.login(email.value, pass.value, document.getElementById('remember').checked); if (!res.ok) { err.textContent = res.error; return; } btn.disabled = true; btn.textContent = 'Memproses…'; form.submit(); });

    document.getElementById('fillDemo').addEventListener('click', () => {
      email.value = DEMO_ACCOUNT.email;
      pass.value = DEMO_ACCOUNT.password;
      err.textContent = '';
      email.focus();
    });

    document.getElementById('googleBtn').addEventListener('click', () => {
      toast('Login Google disimulasikan…');
      setTimeout(() => doLogin(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password), 500);
    });

    document.getElementById('forgot').addEventListener('click', ev => {
      ev.preventDefault();
      toast('Ini demo — gunakan akun demo atau email apa pun.');
    });

    document.getElementById('pwToggle').addEventListener('click', () => {
      pass.type = pass.type === 'password' ? 'text' : 'password';
    });

    // Gently cycle the art swatches
    const sets = [
      ['#6d4aff', '#00c2a8', '#ff7a59', '#fbfaff', '#1b1530'],
      ['#8b5a2b', '#d4a373', '#e76f51', '#fdf8f3', '#2b1d12'],
      ['#0369a1', '#06b6d4', '#f59e0b', '#f5fbff', '#0b2233'],
      ['#db2777', '#f9a8d4', '#7c3aed', '#fff7fb', '#3b0d22']
    ];
    let k = 0;
    const sw = [...document.querySelectorAll('#artSwatches i')];
    sw.forEach(i => { i.style.transition = 'background .8s'; });
    setInterval(() => { k = (k + 1) % sets.length; sw.forEach((i, n) => { i.style.background = sets[k][n]; }); }, 3000);
  })();
</script>
</body>
</html>
