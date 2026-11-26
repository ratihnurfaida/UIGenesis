<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="mockup-usage-url" content="{{ route('mockup-usage.consume') }}">
  <title>Dashboard — UIGenesis</title>
  <meta name="description" content="Dashboard UIGenesis: atur palet warna dan hasilkan mockup UI website.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <link id="mockFont" rel="stylesheet" href="">
  <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}?v={{ filemtime(public_path('assets/css/style.css')) }}">
</head>
<body>
<div class="app">
  <!-- ============ SIDEBAR ============ -->
  <aside class="sidebar" id="sidebar">
    <a href="{{ route('home') }}" class="logo"><span class="logo-mark" aria-hidden="true">G</span><span>UI<b>Genesis</b></span></a>

    <div>
      <div class="side-label">Menu</div>
      <nav class="side-nav" id="sideNav">
        <a href="#overview" data-view="overview"><i data-icon="home"></i>Ringkasan</a>
        <a href="#generator" data-view="generator"><i data-icon="wand"></i>Generator UI</a>
        <a href="#projects" data-view="projects"><i data-icon="folder"></i>Proyek Saya<span class="count" id="projCount">0</span></a>
        <a href="#settings" data-view="settings"><i data-icon="gear"></i>Pengaturan</a>
      </nav>
    </div>

    <div class="side-promo">
      <b>Paket Pro (Trial)</b>
      <p>Sisa 12 hari. Nikmati ekspor tanpa batas dan semua template.</p>
      <a class="btn btn-sm btn-ghost" style="width:100%">Upgrade</a>
    </div>

    <div class="side-user">
      <button id="logoutIcon" type="button" title="Keluar" aria-label="Keluar" aria-haspopup="dialog" aria-controls="logoutConfirmModal"><i data-icon="logout"></i></button>
      <div class="avatar" id="userAvatar">D</div>
      <div class="who"><b id="userName">{{ $user['name'] }}</b><span id="userEmail">{{ $user['email'] }}</span></div>
    </div>
  </aside>
  <div class="overlay" id="overlay"></div>

  <!-- ============ MAIN ============ -->
  <div class="main">
    <header class="topbar">
      <div style="display:flex;align-items:center;gap:12px;min-width:0">
        <button class="icon-btn menu-btn" id="menuBtn" aria-label="Buka menu"><i data-icon="menu"></i></button>
        <div style="min-width:0">
          <h1 id="viewTitle">Ringkasan</h1>
          <p id="viewSub">Pantau aktivitas desain Anda.</p>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn hide-sm" aria-label="Notifikasi" onclick="toast('Belum ada notifikasi baru')"><i data-icon="bell"></i></button>
        <a href="#generator" class="btn btn-primary btn-sm" id="topNewProjectBtn"><i data-icon="plus"></i>Desain Baru</a>
      </div>
    </header>

    <main class="content">
      <!-- ============ OVERVIEW ============ -->
      <section class="view" id="view-overview">
        <div class="welcome">
          <div>
            <h2 id="welcomeText">Halo! 👋</h2>
            <p>Mulai eksplorasi palet warna baru dan ubah jadi mockup website dalam hitungan detik.</p>
          </div>
          <a href="#generator" class="btn btn-ghost"><i data-icon="sparkles"></i>Buka Generator</a>
        </div>

        <div class="stats">
          <div class="stat"><div class="top">Total Proyek<i style="background:#efeaff;color:#6d4aff"><i data-icon="folder"></i></i></div><strong id="stProjects">0</strong><small id="stProjectsNote">+0 minggu ini</small></div>
          <div class="stat"><div class="top">Palet Dibuat<i style="background:#e5f8f5;color:#00a891"><i data-icon="palette"></i></i></div><strong id="stPalettes">0</strong><small>Generate &amp; preset</small></div>
          <div class="stat"><div class="top">Mockup Dilihat<i style="background:#fff0eb;color:#ff7a59"><i data-icon="layout"></i></i></div><strong id="stMockups">0</strong><small>Ganti template</small></div>
          <div class="stat"><div class="top">Ekspor<i style="background:#fff6df;color:#c98a00"><i data-icon="download"></i></i></div><strong id="stExports">0</strong><small>HTML &amp; kode warna</small></div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-head"><h3>Proyek Terbaru</h3><a href="#projects">Lihat semua</a></div>
            <div class="recent" id="recentList"></div>
          </div>
          <div class="card">
            <div class="card-head"><h3>Proyek per Jenis Website</h3></div>
            <div class="bars" id="typeBars"></div>
            <div class="card-head" style="margin:26px 0 12px"><h3>Palet Cepat</h3><a href="#generator">Generator</a></div>
            <div class="preset-list" id="quickPresets"></div>
          </div>
        </div>
      </section>

      <!-- ============ GENERATOR ============ -->
      <section class="view" id="view-generator">
        <div class="flow-steps" id="flowSteps" aria-label="Alur pembuatan mockup">
          <span data-flow="form" class="active"><b>1</b> Kebutuhan</span><i></i>
          <span data-flow="palette"><b>2</b> Pilih palet</span><i></i>
          <span data-flow="design"><b>3</b> Desain</span><i></i>
          <span data-flow="mockup"><b>4</b> Mockup</span><i></i>
          <span data-flow="edit"><b>5</b> Edit</span><i></i>
          <span data-flow="finished"><b>6</b> Selesai</span>
        </div>
        <p class="muted" id="mockupQuota" data-used="{{ $usage['used'] }}" data-limit="{{ $usage['limit'] ?? '' }}" data-plan="{{ $usage['plan'] }}" style="margin:0 0 14px">@if($usage['limit'] === null) Paket Pro: mockup tanpa batas.@else Mockup gratis tersisa: {{ max(0, $usage['limit'] - $usage['used']) }} dari {{ $usage['limit'] }}.@endif</p>
        <div class="gen stage-form" id="generatorFlow">
          <div class="gen-panel">
            <div class="panel-sec" id="briefSection">
              <h4>Formulir Kebutuhan Aplikasi</h4>
              <label class="field"><span>Nama aplikasi</span><input class="input" id="appNameInput" maxlength="40" placeholder="Contoh: TokoKita"></label>
              <div class="field logo-upload-field">
                <span>Logo <small>(opsional)</small></span>
                <div class="logo-upload-row">
                  <label class="btn btn-ghost btn-sm" for="appLogoInput"><i data-icon="upload"></i>Pilih logo</label>
                  <input id="appLogoInput" type="file" accept="image/png,image/jpeg,image/webp" hidden>
                  <small class="muted">PNG, JPG, atau WebP · maks. 4 MB</small>
                </div>
                <div class="logo-upload-preview" id="appLogoPreview" hidden>
                  <img id="appLogoPreviewImage" alt="Pratinjau logo">
                  <span class="muted">Logo siap digunakan</span>
                  <button class="btn btn-ghost btn-sm" type="button" id="removeAppLogoBtn">Hapus</button>
                </div>
              </div>
              <label class="field"><span>Kategori aplikasi</span><select class="select" id="appCategory"><option value="commerce">E-commerce</option><option value="productivity">Produktivitas</option><option value="education">Edukasi</option><option value="food">Kuliner</option><option value="portfolio">Portofolio</option><option value="content">Konten &amp; komunitas</option></select></label>
              <label class="field"><span>Gaya desain</span><select class="select" id="appStyle"><option value="modern">Modern &amp; bersih</option><option value="playful">Ceria &amp; ekspresif</option><option value="elegant">Elegan &amp; premium</option><option value="natural">Natural &amp; hangat</option><option value="minimal">Minimal &amp; profesional</option></select></label>
              <fieldset class="field option-field"><legend>Halaman yang dibutuhkan</legend><div class="option-check-grid" id="pageOptions"></div></fieldset>
              <fieldset class="field option-field"><legend>Fitur yang dibutuhkan</legend><div class="option-check-grid" id="featureOptions"></div></fieldset>
              <button class="btn btn-primary btn-block" id="recommendBtn" type="button" data-endpoint="{{ route('ai.palette') }}"><i data-icon="sparkles"></i>Generate Rekomendasi Palet</button>
            </div>

            <div class="panel-sec" id="recommendationSection" hidden>
              <h4>Rekomendasi Palet Warna</h4>
              <p class="muted" id="recommendationNote">Pilih satu palet untuk melanjutkan.</p>
              <div class="recommendation-list" id="recommendationList"></div>
              <div class="built-in-palette-section">
                <div class="built-in-palette-heading"><div><h5>Galeri Palet UIGenesis</h5><p class="muted" id="builtInPaletteNote">Palet pilihan yang disesuaikan dengan gaya desain Anda.</p></div><span class="palette-source-badge">Palet pilihan</span></div>
                <div class="recommendation-list built-in-palette-list" id="builtInPaletteGallery"></div>
                <div class="community-palette-editor" id="communityPaletteEditor" hidden></div>
              </div>
              <button class="btn btn-ghost btn-block" id="backToBriefBtn" type="button">Ubah kebutuhan aplikasi</button>
              <button class="btn btn-dark btn-block" id="prepareDesignBtn" type="button" disabled>Lanjut: Generate Desain</button>
            </div>

            <div class="panel-sec" id="designSection" hidden>
              <h4>Periksa Ringkasan Kebutuhan</h4>
              <p class="muted">Pastikan informasi dan palet sudah sesuai sebelum membuat mockup. Anda bisa kembali untuk mengganti palet.</p>
              <div id="designSummary"></div>
              <button class="btn btn-ghost btn-block" id="backToPaletteBtn" type="button">Kembali pilih palet</button>
              <button class="btn btn-dark btn-block" id="buildAppBtn" type="button">Lanjut: Generate Mockup</button>
            </div>

            <div id="editControls" hidden>
            <div class="panel-sec">
              <h4>Edit Desain</h4>
              <label class="field"><span>Nama brand / website</span><input class="input" id="brandInput" maxlength="32" value="Nusantara"></label>
            </div>

            <div class="panel-sec">
              <h4>Jenis Website <small id="typeLabel">Landing Page</small></h4>
              <div class="type-grid" id="typeGrid"></div>
            </div>

            <div class="panel-sec">
              <h4>Palet Warna <small>Klik kotak untuk ubah</small></h4>
              <div class="swatches" id="swatches"></div>
              <div class="field">
                <span>Harmoni warna</span>
                <select class="select" id="harmonySelect"></select>
              </div>
              <div class="seg" id="modeSeg">
                <button data-mode="light" class="active">☀ Terang</button>
                <button data-mode="dark">☾ Gelap</button>
              </div>
              <button class="btn btn-dark btn-block" id="generateBtn"><i data-icon="shuffle"></i>Generate Palet <kbd style="opacity:.6;font-size:11px;margin-left:4px">Spasi</kbd></button>
            </div>

            <div class="panel-sec">
              <h4>Preset Palet</h4>
              <div class="preset-list" id="presetList"></div>
            </div>

            <div class="panel-sec">
              <h4>Gaya Visual</h4>
              <label class="field"><span>Font</span><select class="select" id="fontSelect"></select></label>
              <div class="field"><span>Sudut komponen</span><div class="seg" id="radiusSeg"></div></div>
            </div>

            <div class="panel-sec">
              <h4>Cek Kontras <small>WCAG 2.1</small></h4>
              <div class="contrast" id="contrastList"></div>
            </div>
            </div>
          </div>

        <div class="preview-wrap" id="mockupSection" hidden>
          <nav class="prototype-pages" id="prototypePages" aria-label="Navigasi halaman prototype"></nav>
          <div class="preview-toolbar">
            <div class="seg" id="deviceSeg">
              <button data-device="desktop" class="active" aria-label="Desktop"><i data-icon="desktop"></i><span class="hide-sm">Desktop</span></button>
              <button data-device="tablet" aria-label="Tablet"><i data-icon="tablet"></i><span class="hide-sm">Tablet</span></button>
              <button data-device="mobile" aria-label="Mobile"><i data-icon="mobile"></i><span class="hide-sm">Mobile</span></button>
            </div>
            <div class="acts">
              <label class="btn btn-ghost btn-sm canvas-color-tool" id="canvasColorTool" hidden>Warna utama<input type="color" id="canvasColorInput" aria-label="Ubah warna utama mockup"></label>
              <span class="muted" id="canvasEditHint" hidden>Klik teks pada mockup untuk mengubahnya</span>
              <button class="btn btn-ghost btn-sm" id="codeBtn" hidden><i data-icon="code"></i>Kode Warna</button>
              <button class="btn btn-ghost btn-sm" id="exportBtn" hidden><i data-icon="download"></i>Ekspor HTML</button>
              <button class="btn btn-ghost btn-sm" id="openBtn" title="Buka di tab baru" hidden><i data-icon="open"></i></button>
              <button class="btn btn-primary btn-sm" id="saveBtn" hidden><i data-icon="save"></i>Simpan Proyek</button>
              <button class="btn btn-ghost btn-sm" id="editMockupBtn" hidden><i data-icon="wand"></i>Edit di Mockup</button>
            </div>
          </div>
          <div class="stage">
            <div class="device" id="device" data-device="desktop">
              <div class="device-bar"><i></i><i></i><i></i><span class="url" id="deviceUrl">nusantara.id</span></div>
              <div class="device-screen"><div class="mk" id="mockup"></div></div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <!-- ============ PROJECTS ============ -->
      <section class="view" id="view-projects">
        <div class="proj-toolbar">
          <div class="input-group"><i data-icon="search"></i><input class="input" id="projSearch" placeholder="Cari proyek…"></div>
          <div style="display:flex;gap:10px">
            <select class="select" id="projFilter" style="width:auto"><option value="">Semua jenis</option></select>
            <a href="#generator" class="btn btn-primary" id="newProjBtn"><i data-icon="plus"></i>Proyek Baru</a>
          </div>
        </div>
        <div class="proj-grid" id="projGrid"></div>
      </section>

      <!-- ============ SETTINGS ============ -->
      <section class="view" id="view-settings">
        <div class="settings">
          <div class="card">
            <div class="card-head"><h3>Profil</h3></div>
            <form id="profileForm">
              <label class="field"><span>Nama lengkap</span><input class="input" id="setName" required></label>
              <label class="field"><span>Email</span><input class="input" id="setEmail" type="email" disabled></label>
              <label class="field"><span>Paket</span><input class="input" id="setPlan" disabled></label>
              <button class="btn btn-primary" type="submit">Simpan Perubahan</button>
            </form>
          </div>
          <div class="card">
            <div class="card-head"><h3>Data &amp; Akun</h3></div>
            <p style="color:var(--muted);font-size:14px;margin-bottom:16px">Ini adalah aplikasi demo. Semua data (akun, proyek, statistik) hanya disimpan di browser Anda melalui localStorage.</p>
            <div style="display:grid;gap:10px">
              <button class="btn btn-ghost" id="exportDataBtn"><i data-icon="download"></i>Unduh Semua Proyek (JSON)</button>
              <button class="btn btn-danger" id="resetBtn"><i data-icon="trash"></i>Hapus Semua Proyek</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>

<div class="modal-backdrop" id="logoutConfirmModal" role="dialog" aria-modal="true" aria-labelledby="logoutConfirmTitle" aria-describedby="logoutConfirmDescription">
  <div class="modal" style="width:min(420px,100%)">
    <div class="modal-head"><h3 id="logoutConfirmTitle">Konfirmasi Keluar</h3><button class="icon-btn" type="button" data-close aria-label="Tutup konfirmasi"><i data-icon="x"></i></button></div>
    <p class="muted" id="logoutConfirmDescription" style="margin:0 0 22px">Anda akan keluar dari akun UIGenesis. Apakah Anda yakin ingin melanjutkan?</p>
    <form method="POST" action="{{ route('logout') }}" class="modal-foot">
      @csrf
      <button class="btn btn-ghost" id="cancelLogoutBtn" type="button" data-close>Batal</button>
      <button class="btn btn-danger" type="submit"><i data-icon="logout"></i>Ya, keluar</button>
    </form>
  </div>
</div>

<!-- ============ CODE MODAL ============ -->
<div class="modal-backdrop" id="codeModal" role="dialog" aria-modal="true" aria-labelledby="codeTitle">
  <div class="modal">
    <div class="modal-head"><h3 id="codeTitle">Kode Palet Warna</h3><button class="icon-btn" data-close aria-label="Tutup"><i data-icon="x"></i></button></div>
    <div class="seg" id="codeSeg">
      <button data-fmt="css" class="active">CSS Variables</button>
      <button data-fmt="tailwind">Tailwind</button>
      <button data-fmt="json">JSON</button>
    </div>
    <div class="code-box" id="codeBox"></div>
    <div class="modal-foot"><button class="btn btn-ghost" data-close>Tutup</button><button class="btn btn-primary" id="copyCodeBtn"><i data-icon="copy"></i>Salin Kode</button></div>
  </div>
</div>

<!-- ============ SAVE MODAL ============ -->
<div class="modal-backdrop" id="saveModal" role="dialog" aria-modal="true" aria-labelledby="saveTitle">
  <div class="modal" style="width:min(440px,100%)">
    <div class="modal-head"><h3 id="saveTitle">Simpan Proyek</h3><button class="icon-btn" data-close aria-label="Tutup"><i data-icon="x"></i></button></div>
    <form id="saveForm" style="display:grid;gap:16px">
      <label class="field"><span>Nama proyek</span><input class="input" id="saveName" required maxlength="60"></label>
      <label style="display:flex;gap:8px;align-items:center;font-size:14px" id="saveAsNewWrap"><input type="checkbox" id="saveAsNew"> Simpan sebagai proyek baru</label>
      <div class="modal-foot"><button type="button" class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" type="submit"><i data-icon="save"></i>Simpan</button></div>
    </form>
  </div>
</div>

<div class="modal-backdrop" id="upgradeModal" role="dialog" aria-modal="true" aria-labelledby="upgradeTitle">
  <div class="modal" style="width:min(440px,100%)">
    <div class="modal-head"><h3 id="upgradeTitle">Kuota mockup gratis habis</h3><button class="icon-btn" data-close aria-label="Tutup"><i data-icon="x"></i></button></div>
    <p class="muted" style="margin:8px 0 20px">Akun ini sudah menggunakan 5 mockup gratis. Upgrade paket untuk membuat mockup lagi. Pembayaran online belum tersedia di versi demo ini.</p>
    <div class="modal-foot"><button class="btn btn-primary" data-close>Tutup</button></div>
  </div>
</div>

<script>window.UIGENESIS_USER = @json($user);</script>
<script src="{{ asset('assets/js/app.js') }}"></script>
<script src="{{ asset('assets/js/mockups.js') }}?v={{ filemtime(public_path('assets/js/mockups.js')) }}"></script>
<script src="{{ asset('assets/js/prototype-pages/home.js') }}"></script>
<script src="{{ asset('assets/js/prototype-pages/product.js') }}"></script>
<script src="{{ asset('assets/js/prototype-pages/detail.js') }}"></script>
<script src="{{ asset('assets/js/prototype-pages/cart.js') }}"></script>
<script src="{{ asset('assets/js/prototype-pages/checkout.js') }}"></script>
<script src="{{ asset('assets/js/prototype-pages/profile.js') }}"></script>
<script src="{{ asset('assets/js/prototype-pages/dashboard.js') }}"></script>
<script src="{{ asset('assets/js/prototype-pages/generic.js') }}"></script>
<script src="{{ asset('assets/js/dashboard.js') }}?v={{ filemtime(public_path('assets/js/dashboard.js')) }}"></script>
</body>
</html>
