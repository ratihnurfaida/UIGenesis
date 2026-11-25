<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>UIGenesis — Palet Warna &amp; Mockup UI Instan</title>
  <meta name="description" content="UIGenesis membantu Anda menentukan palet warna dan langsung menghasilkan mockup UI website: landing page, e-commerce, blog, portofolio, dan dashboard.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
</head>
<body>

<header class="site-nav" id="siteNav">
  <div class="container">
    <a href="{{ route('home') }}" class="logo"><span class="logo-mark"></span><span>UI<b>Genesis</b></span></a>
    <nav class="nav-links">
      <a href="#fitur">Fitur</a>
      <a href="#cara-kerja">Cara Kerja</a>
      <a href="#palet">Palet</a>
      <a href="#mulai">Mulai</a>
    </nav>
    <div class="nav-actions" id="navActions">
      <a href="{{ route('login') }}" class="btn btn-ghost">Masuk</a>
      <a href="{{ route('register') }}" class="btn btn-primary">Daftar</a>
    </div>
  </div>
</header>

<section class="hero">
  <div class="container hero-grid">
    <div>
      <span class="pill"><span>Baru</span>Generator mockup dengan 5 template website</span>
      <h1>Pilih warnanya,<br><span class="grad-text">UIGenesis</span> bangun tampilannya.</h1>
      <p class="lead">Tentukan palet warna brand Anda, lalu lihat langsung bagaimana warna itu hidup di landing page, toko online, blog, portofolio, hingga dashboard aplikasi.</p>
      <div class="hero-cta">
        <a href="{{ route('register') }}" class="btn btn-primary btn-lg"><i data-icon="sparkles"></i>Mulai Mendesain</a>
        <a href="#cara-kerja" class="btn btn-ghost btn-lg">Lihat Cara Kerja</a>
      </div>
      <div class="hero-meta">
        <div><strong>5</strong>Template website</div>
        <div><strong>8+</strong>Preset palet</div>
        <div><strong>WCAG</strong>Cek kontras otomatis</div>
      </div>
    </div>

    <div class="hero-visual" aria-hidden="true">
      <div class="hv-window">
        <div class="hv-bar"><i></i><i></i><i></i><span>nusantara.id/beranda</span></div>
        <div class="hv-body" id="hvBody">
          <div class="hv-nav"><b></b><div><i></i><i></i><i></i></div><em></em></div>
          <div class="hv-hero">
            <div class="hv-lines"><i></i><i></i><i class="sm"></i><i class="sm"></i><div class="btns"><b></b><b></b></div></div>
            <div class="hv-img"></div>
          </div>
          <div class="hv-cards"><div><i></i><b></b></div><div><i></i><b></b></div><div><i></i><b></b></div></div>
        </div>
      </div>
      <div class="hv-palette" id="hvPalette"><i></i><i></i><i></i><i></i><i></i><span id="hvName">Nusantara</span></div>
      <div class="hv-chip"><i></i>Kontras AA lulus</div>
    </div>
  </div>

  <div class="container logos">
    <p>Dipercaya desainer &amp; developer dari</p>
    <div class="row"><span>Arunika</span><span>Bumiraya</span><span>Kalpa Studio</span><span>Nirmala</span><span>Sagara Labs</span></div>
  </div>
</section>

<section class="section" id="fitur">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Fitur</span>
      <h2>Semua yang Anda butuhkan untuk eksplorasi visual</h2>
      <p>Dari memilih warna sampai mengekspor kode — tanpa perlu membuka software desain.</p>
    </div>
    <div class="feature-grid">
      <div class="feature"><div class="ic" style="background:#efeaff;color:#6d4aff"><i data-icon="palette"></i></div><h3>Generator Palet Cerdas</h3><p>Buat palet otomatis berdasarkan harmoni warna: analog, komplementer, triadik, split, atau monokrom. Kunci warna favorit Anda.</p></div>
      <div class="feature"><div class="ic" style="background:#e5f8f5;color:#00a891"><i data-icon="layout"></i></div><h3>Mockup UI Instan</h3><p>Lihat palet diterapkan langsung pada 5 jenis website lengkap dengan navigasi, hero, kartu, harga, dan footer.</p></div>
      <div class="feature"><div class="ic" style="background:#fff0eb;color:#ff7a59"><i data-icon="contrast"></i></div><h3>Cek Kontras WCAG</h3><p>Setiap kombinasi warna dihitung rasio kontrasnya, sehingga desain tetap mudah dibaca dan aksesibel.</p></div>
      <div class="feature"><div class="ic" style="background:#fff6df;color:#c98a00"><i data-icon="desktop"></i></div><h3>Pratinjau Responsif</h3><p>Ganti tampilan desktop, tablet, dan mobile untuk memastikan layout tetap rapi di semua ukuran layar.</p></div>
      <div class="feature"><div class="ic" style="background:#e8f1ff;color:#2563eb"><i data-icon="code"></i></div><h3>Ekspor Kode</h3><p>Unduh mockup sebagai file HTML siap pakai, atau salin palet dalam format CSS variables, Tailwind, dan JSON.</p></div>
      <div class="feature"><div class="ic" style="background:#ffe9f3;color:#db2777"><i data-icon="folder"></i></div><h3>Kelola Proyek</h3><p>Simpan setiap eksplorasi sebagai proyek, cari, filter, dan buka kembali kapan saja dari dashboard.</p></div>
    </div>
  </div>
</section>

<section class="section" id="cara-kerja" style="padding-top:20px">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Cara Kerja</span>
      <h2>Tiga langkah menuju desain siap presentasi</h2>
    </div>
    <div class="steps">
      <div class="step"><h3>Tentukan palet</h3><p>Pilih preset, masukkan kode hex brand Anda, atau tekan Spasi untuk generate palet acak yang harmonis.</p></div>
      <div class="step"><h3>Pilih jenis website</h3><p>Landing page, e-commerce, blog, portofolio, atau dashboard. Atur font, sudut komponen, dan mode gelap.</p></div>
      <div class="step"><h3>Simpan &amp; ekspor</h3><p>Simpan sebagai proyek, unduh file HTML, atau salin kode warna untuk langsung dipakai developer.</p></div>
    </div>
  </div>
</section>

<section class="section" id="palet" style="padding-top:20px">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Inspirasi Palet</span>
      <h2>Mulai dari palet pilihan kami</h2>
      <p>Klik salah satu palet untuk langsung membukanya di generator.</p>
    </div>
    <div class="palette-grid" id="paletteGrid"></div>
  </div>
</section>

<section class="section" id="mulai" style="padding-top:20px">
  <div class="container">
    <div class="cta-band">
      <h2>Siap mewujudkan ide visual Anda?</h2>
      <p>Buat akun gratis dan mulai ubah inspirasi warna menjadi rancangan website.</p>
      <a href="{{ route('register') }}" class="btn btn-ghost btn-lg"><i data-icon="rocket"></i>Mulai Gratis</a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <a href="{{ route('home') }}" class="logo"><span class="logo-mark"></span><span>UI<b>Genesis</b></span></a>
    <nav><a href="#fitur">Fitur</a><a href="#cara-kerja">Cara Kerja</a><a href="#palet">Palet</a><a href="{{ route('login') }}">Masuk</a></nav>
    <p>© <span id="year"></span> UIGenesis</p>
  </div>
</footer>

<script>window.UIGENESIS_AUTHENTICATED = @json(session()->has('uig_user'));</script>
<script src="{{ asset('assets/js/app.js') }}"></script>
<script src="{{ asset('assets/js/mockups.js') }}"></script>
<script>
  (function () {
    document.getElementById('year').textContent = new Date().getFullYear();

    // Nav state
    const nav = document.getElementById('siteNav');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Palette showcase
    const grid = document.getElementById('paletteGrid');
    grid.innerHTML = PRESETS.map((p, i) => `
      <button class="palette-card" data-i="${i}">
        <div class="sw">${COLOR_ROLES.map(r => `<i style="background:${p.colors[r.key]}" title="${r.label} ${p.colors[r.key]}"></i>`).join('')}</div>
        <div class="meta"><b>${p.name}</b><span>Coba →</span></div>
      </button>`).join('');
    grid.addEventListener('click', e => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      Store.set('uig_pending_palette', { colors: PRESETS[b.dataset.i].colors });
      location.href = window.UIGENESIS_AUTHENTICATED ? '{{ route('dashboard') }}#generator' : '{{ route('login') }}';
    });

    // Hero: cycle through palettes on the live mini-mockup
    const body = document.getElementById('hvBody');
    const chips = [...document.querySelectorAll('#hvPalette i')];
    const name = document.getElementById('hvName');
    const light = PRESETS.filter(p => !Color.isDark(p.colors.background));
    let k = 0;
    function apply(p) {
      const c = p.colors;
      body.style.setProperty('--hv-p', c.primary);
      body.style.setProperty('--hv-s', c.secondary);
      body.style.setProperty('--hv-a', c.accent);
      body.style.setProperty('--hv-bg', c.background);
      body.style.setProperty('--hv-tx', c.text);
      chips.forEach((ch, n) => { ch.style.background = c[COLOR_ROLES[n].key]; });
      name.textContent = p.name;
    }
    apply(light[0]);
    setInterval(() => { k = (k + 1) % light.length; apply(light[k]); }, 2600);
  })();
</script>
</body>
</html>
