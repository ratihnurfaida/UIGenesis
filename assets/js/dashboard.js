/* =========================================================
   UIGenesis — Dashboard controller
   ========================================================= */
(function () {
  const user = Auth.require();
  if (!user) return;

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* ---------- 01. DATA DRAFT & STATE ---------- */
  const defaultState = () => ({
    brand: 'Nusantara', type: 'landing', font: 'Inter', radius: 'rounded',
    mode: 'light', harmony: 'analogous', colors: { ...PRESETS[0].colors }, locks: {}
  });
  let state = Store.get('uig_draft', null) || defaultState();
  state.locks = state.locks || {};
  let editingId = Store.get('uig_editing', null);
  let device = 'desktop';
  let codeFmt = 'css';

  const saveDraft = () => { Store.set('uig_draft', state); Store.set('uig_editing', editingId); };

  // Palette sent from landing page
  const pending = Store.get('uig_pending_palette', null);
  if (pending && pending.colors) {
    state.colors = { ...pending.colors };
    state.mode = Color.isDark(pending.colors.background) ? 'dark' : 'light';
    editingId = null;
    Store.remove('uig_pending_palette');
    if (!location.hash) location.hash = '#generator';
  }

  /* ---------- 02. PROFIL PENGGUNA & SESSION UI ---------- */
  function renderUser() {
    const u = Auth.user() || user;
    $('#userName').textContent = u.name;
    $('#userEmail').textContent = u.email;
    $('#userAvatar').textContent = (u.name || 'U').trim().charAt(0).toUpperCase();
    $('#welcomeText').textContent = `Halo, ${u.name.split(' ')[0]}! 👋`;
  }
  renderUser();
  $('#logoutBtn').addEventListener('click', Auth.logout);
  $('#logoutBtn2').addEventListener('click', Auth.logout);

  /* ---------- 03. ROUTER HALAMAN DASHBOARD ---------- */
  const VIEWS = {
    overview: ['Ringkasan', 'Pantau aktivitas desain Anda.'],
    generator: ['Generator UI', 'Isi kebutuhan aplikasi dan siapkan desain prototype.'],
    projects: ['Proyek Saya', 'Semua desain yang telah Anda simpan.'],
    settings: ['Pengaturan', 'Kelola profil dan data akun demo.']
  };
  let openRequestedProject = false;
  function route() {
    const requestedView = (location.hash || '#overview').slice(1);
    if (requestedView === 'prototype') { location.hash = '#generator'; return; }
    const v = requestedView;
    const view = VIEWS[v] ? v : 'overview';
    $$('.view').forEach(el => el.classList.toggle('active', el.id === 'view-' + view));
    $$('#sideNav a').forEach(a => a.classList.toggle('active', a.dataset.view === view));
    $('#viewTitle').textContent = VIEWS[view][0];
    $('#viewSub').textContent = VIEWS[view][1];
    document.title = `${VIEWS[view][0]} — UIGenesis`;
    closeSidebar();
    if (view === 'overview') renderOverview();
    if (view === 'projects') renderProjects();
    if (view === 'generator') {
      setFlowStep(openRequestedProject ? 'edit' : 'form');
      openRequestedProject = false;
      renderMockup(true);
    }
    if (view === 'settings') renderSettings();
    window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', route);

  /* ---------- 04. NAVIGASI SIDEBAR MOBILE ---------- */
  const sidebar = $('#sidebar'), overlay = $('#overlay');
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }
  $('#menuBtn').addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('open'); });
  overlay.addEventListener('click', closeSidebar);

  /* ---------- 05. MODAL & SHORTCUT GLOBAL ---------- */
  function openModal(id) { $(id).classList.add('open'); }
  function closeModals() { $$('.modal-backdrop').forEach(m => m.classList.remove('open')); }
  $$('.modal-backdrop').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeModals(); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

  /* =========================================================
     06. GENERATOR: TEMPLATE & KONTROL DASAR
     ========================================================= */
  const mockEl = $('#mockup');
  const styleTag = document.createElement('style');
  styleTag.textContent = MOCKUP_CSS;
  document.head.appendChild(styleTag);

  // Type buttons
  $('#typeGrid').innerHTML = Object.entries(TEMPLATES).map(([k, t]) =>
    `<button class="type-btn" data-type="${k}">${icon(t.icon)}${t.label}</button>`).join('');
  $('#typeGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-type]');
    if (!b) return;
    state.type = b.dataset.type;
    Stats.bump('mockups');
    syncControls(); renderMockup(true); saveDraft();
  });

  // Swatches
  $('#swatches').innerHTML = COLOR_ROLES.map(({ key, label }) => `
    <div class="swatch-row" data-role="${key}">
      <label class="swatch-color"><input type="color" aria-label="Pilih warna ${label}"></label>
      <div class="swatch-meta"><span>${label}</span><input type="text" maxlength="7" spellcheck="false" aria-label="Kode hex ${label}"></div>
      <button class="lock-btn" title="Kunci warna saat generate" aria-label="Kunci ${label}"></button>
    </div>`).join('');

  $$('.swatch-row').forEach(row => {
    const key = row.dataset.role;
    const picker = row.querySelector('input[type=color]');
    const hex = row.querySelector('input[type=text]');
    const lock = row.querySelector('.lock-btn');
    picker.addEventListener('input', () => setColor(key, picker.value, 'picker'));
    hex.addEventListener('input', () => {
      const v = Color.normalize(hex.value);
      if (v) setColor(key, v, 'hex');
    });
    hex.addEventListener('blur', () => { hex.value = state.colors[key].toUpperCase(); });
    lock.addEventListener('click', () => {
      state.locks[key] = !state.locks[key];
      syncSwatches(); saveDraft();
    });
  });

  function setColor(key, value, from) {
    state.colors[key] = value;
    syncSwatches(from === 'hex' ? key : null);
    applyColors();
    saveDraft();
  }

  function syncSwatches(skipHexFor) {
    $$('.swatch-row').forEach(row => {
      const key = row.dataset.role, c = state.colors[key];
      row.querySelector('.swatch-color').style.background = c;
      row.querySelector('input[type=color]').value = c;
      if (skipHexFor !== key) row.querySelector('input[type=text]').value = c.toUpperCase();
      const lock = row.querySelector('.lock-btn');
      const locked = !!state.locks[key];
      lock.classList.toggle('locked', locked);
      lock.innerHTML = icon(locked ? 'lock' : 'unlock');
      lock.setAttribute('aria-pressed', locked);
    });
  }

  // Harmony
  $('#harmonySelect').innerHTML = Object.entries(HARMONIES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  $('#harmonySelect').addEventListener('change', e => {
    state.harmony = e.target.value;
    state.colors = generatePalette(state.colors.primary, state.harmony, state.mode, state.colors, { ...state.locks, primary: true });
    Stats.bump('palettes');
    syncSwatches(); applyColors(); saveDraft();
  });

  // Mode
  $('#modeSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-mode]');
    if (!b || b.dataset.mode === state.mode) return;
    state.mode = b.dataset.mode;
    // Regenerate only background & text (respecting locks), adjust brand colors for readability
    const keep = { ...state.locks, primary: true, secondary: true, accent: true };
    state.colors = generatePalette(state.colors.primary, state.harmony, state.mode, state.colors, keep);
    syncControls(); syncSwatches(); applyColors(); saveDraft();
  });

  // Generate
  function doGenerate() {
    const base = state.locks.primary ? state.colors.primary : randomBase();
    state.colors = generatePalette(base, state.harmony, state.mode, state.colors, state.locks);
    Stats.bump('palettes');
    syncSwatches(); applyColors(); saveDraft();
  }
  $('#generateBtn').addEventListener('click', doGenerate);
  document.addEventListener('keydown', e => {
    if (e.code !== 'Space' || location.hash !== '#generator') return;
    if (e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) return;
    if (e.target.closest('input, textarea, select, button') || $('.modal-backdrop.open')) return;
    e.preventDefault();
    doGenerate();
  });

  // Presets
  const presetHtml = PRESETS.map((p, i) => `
    <button class="preset" data-preset="${i}" title="${p.name}">
      <div>${COLOR_ROLES.map(r => `<i style="background:${p.colors[r.key]}"></i>`).join('')}</div><span>${p.name}</span>
    </button>`).join('');
  $('#presetList').innerHTML = presetHtml;
  $('#quickPresets').innerHTML = presetHtml;
  function applyPreset(i) {
    const p = PRESETS[i];
    state.colors = { ...p.colors };
    state.mode = Color.isDark(p.colors.background) ? 'dark' : 'light';
    Stats.bump('palettes');
    syncControls(); syncSwatches(); applyColors(); saveDraft();
  }
  $('#presetList').addEventListener('click', e => {
    const b = e.target.closest('[data-preset]');
    if (b) { applyPreset(+b.dataset.preset); toast(`Preset "${PRESETS[b.dataset.preset].name}" diterapkan`); }
  });
  $('#quickPresets').addEventListener('click', e => {
    const b = e.target.closest('[data-preset]');
    if (b) { applyPreset(+b.dataset.preset); location.hash = '#generator'; }
  });

  /* ---------- 07. FORMULIR KEBUTUHAN & ALUR GENERATE ----------
     Rekomendasi palet saat ini memakai aturan lokal; integrasi AI bisa
     mengganti fungsi rekomendasi tanpa mengubah struktur formulir.
  */
  const CATEGORY_FIELDS = {
    commerce: {
      pages: ['Home', 'Product', 'Detail', 'Cart', 'Checkout', 'Profile', 'Dashboard'],
      features: ['Search', 'Filter & kategori', 'Cart & wishlist', 'Pembayaran', 'Login & registrasi', 'Review & rating', 'Promo & kupon', 'Notifikasi']
    },
    productivity: {
      pages: ['Home', 'Workspace', 'Project', 'Task Board', 'Calendar', 'Reports', 'Team', 'Profile', 'Dashboard'],
      features: ['Manajemen tugas', 'Kanban board', 'Kalender', 'Kolaborasi tim', 'Komentar & diskusi', 'Notifikasi', 'Berbagi file', 'Statistik proyek']
    },
    education: {
      pages: ['Home', 'Course Catalog', 'Course Detail', 'Learning', 'Quiz', 'Progress', 'Profile', 'Dashboard'],
      features: ['Pendaftaran kelas', 'Video pembelajaran', 'Kuis & ujian', 'Progres belajar', 'Forum diskusi', 'Sertifikat', 'Notifikasi', 'Pembayaran kelas']
    },
    food: {
      pages: ['Home', 'Menu', 'Detail Menu', 'Cart', 'Checkout', 'Order Tracking', 'Profile', 'Dashboard'],
      features: ['Search menu', 'Filter kategori', 'Keranjang pesanan', 'Pembayaran', 'Pelacakan pesanan', 'Promo & voucher', 'Rating restoran', 'Chat kurir']
    },
    portfolio: {
      pages: ['Home', 'Portfolio', 'Project Detail', 'About', 'Services', 'Contact', 'Blog'],
      features: ['Galeri proyek', 'Filter karya', 'Studi kasus', 'Form kontak', 'Booking konsultasi', 'Unduh CV', 'Tautan sosial', 'Artikel blog']
    },
    content: {
      pages: ['Home', 'Feed', 'Post Detail', 'Explore', 'Create Post', 'Messages', 'Notifications', 'Profile', 'Dashboard'],
      features: ['Buat postingan', 'Like & komentar', 'Follow pengguna', 'Search konten', 'Pesan langsung', 'Notifikasi', 'Upload media', 'Moderasi konten']
    }
  };
  function renderCategoryOptions(category, selectedPages = ['Home'], selectedFeatures = []) {
    const config = CATEGORY_FIELDS[category] || CATEGORY_FIELDS.commerce;
    $('#pageOptions').innerHTML = config.pages.map(page => `<label><input type="checkbox" value="${escapeHtml(page)}" ${selectedPages.includes(page) ? 'checked' : ''}> ${escapeHtml(page)}</label>`).join('');
    $('#featureOptions').innerHTML = config.features.map(feature => `<label><input type="checkbox" value="${escapeHtml(feature)}" ${selectedFeatures.includes(feature) ? 'checked' : ''}> ${escapeHtml(feature)}</label>`).join('');
  }
  const appBrief = Store.get('uig_app_brief', {});
  $('#appNameInput').value = appBrief.name || state.brand;
  $('#appCategory').value = appBrief.category || 'commerce';
  $('#appStyle').value = appBrief.style || 'modern';
  renderCategoryOptions($('#appCategory').value, appBrief.pages || ['Home'], appBrief.features || []);
  $('#appCategory').addEventListener('change', e => renderCategoryOptions(e.target.value));
  function setFlowStep(step) {
    $('#generatorFlow').className = `gen stage-${step}`;
    $('#briefSection').hidden = step !== 'form';
    $('#recommendationSection').hidden = step !== 'palette';
    $('#designSection').hidden = step !== 'design';
    $('#editControls').hidden = true;
    $('#mockupSection').hidden = !['mockup', 'edit', 'finished'].includes(step);
    $('#editMockupBtn').hidden = !['mockup', 'edit', 'finished'].includes(step);
    $('#editMockupBtn').textContent = step === 'edit' ? 'Selesai Edit' : step === 'finished' ? 'Edit Lagi' : 'Edit di Mockup';
    $('#editMockupBtn').className = `btn btn-sm ${step === 'edit' ? 'btn-primary finish-edit-cta' : 'btn-ghost'}`;
    $('#canvasColorTool').hidden = step !== 'edit';
    $('#canvasEditHint').hidden = step !== 'edit';
    $('#codeBtn').hidden = step !== 'edit';
    $('#exportBtn').hidden = step !== 'finished';
    $('#openBtn').hidden = true;
    $('#saveBtn').hidden = step !== 'finished';
    $('#prototypePages').hidden = !['mockup', 'edit', 'finished'].includes(step) || !state.application;
    if (step === 'edit') beginCanvasEdit(); else finishCanvasEdit();
    const order = ['form', 'palette', 'design', 'mockup', 'edit', 'finished'];
    $$('[data-flow]').forEach(el => {
      const i = order.indexOf(el.dataset.flow), current = order.indexOf(step);
      el.classList.toggle('active', i === current);
      el.classList.toggle('done', i < current);
    });
  }
  const briefValues = () => {
    const pages = $$('#pageOptions input:checked').map(o => o.value);
    return {
      name: $('#appNameInput').value.trim() || 'Aplikasi Baru',
      category: $('#appCategory').value,
      style: $('#appStyle').value,
      pages: pages.length ? pages : ['Home'],
      features: $$('#featureOptions input:checked').map(o => o.value)
    };
  };
  function renderPageSwitcher() {
    const bar = $('#prototypePages');
    const pages = state.application?.pages || [];
    bar.hidden = !pages.length || !['mockup', 'edit'].some(step => $('#generatorFlow').classList.contains(`stage-${step}`));
    bar.innerHTML = pages.map(page => `<button type="button" data-prototype-page="${escapeHtml(page)}" class="${page === state.currentPage ? 'active' : ''}" aria-pressed="${page === state.currentPage}">${escapeHtml(page)}</button>`).join('');
  }
  let paletteChoices = [], selectedPalette = null, selectedPaletteSource = 'recommendation';
  const categoryPalettes = {
    commerce: [2, 1, 5, 0], productivity: [0, 7, 6, 2], education: [4, 0, 3, 2],
    food: [1, 3, 5, 4], portfolio: [7, 4, 0, 6], content: [4, 5, 0, 3]
  };
  const stylePalettes = { modern: [0, 2, 7], playful: [4, 5, 0], elegant: [7, 6, 4], natural: [3, 1, 2], minimal: [7, 0, 2] };
  const stylePaletteNotes = {
    modern: 'warna tegas dan bersih dengan aksen seimbang',
    playful: 'warna lebih cerah dan ekspresif, tetap dipadukan dengan latar lembut',
    elegant: 'warna premium yang lembut dengan aksen hangat',
    natural: 'warna bumi, hijau, dan material alami',
    minimal: 'warna netral dan tenang dengan aksen seperlunya'
  };
  const stylePaletteThemes = {
    modern: [
      { name: 'Nusantara Modern', colors: { primary: '#456b78', secondary: '#a8c0bf', accent: '#d28d6e', background: '#f6f7f5', text: '#29373a' } },
      { name: 'Laut Modern', colors: { primary: '#3e718e', secondary: '#9bb9c9', accent: '#e5b278', background: '#f5f8fa', text: '#263943' } },
      { name: 'Mono Modern', colors: { primary: '#48535c', secondary: '#a7adb0', accent: '#c38e77', background: '#f5f5f2', text: '#2b2f32' } }
    ],
    playful: [
      { name: 'Sakura Ceria', colors: { primary: '#d6487f', secondary: '#ffc0d9', accent: '#7963d8', background: '#fff7fa', text: '#402633' } },
      { name: 'Senja Ceria', colors: { primary: '#e85d3f', secondary: '#ffc675', accent: '#5b69c9', background: '#fff8f0', text: '#3d2a25' } },
      { name: 'Nusantara Ceria', colors: { primary: '#3c8f86', secondary: '#f1b24a', accent: '#e47478', background: '#f6fcf8', text: '#263b36' } }
    ],
    elegant: [
      { name: 'Mono Elegan', colors: { primary: '#5b5147', secondary: '#b99a6c', accent: '#8f6c78', background: '#faf7f1', text: '#322d29' } },
      { name: 'Midnight Elegan', colors: { primary: '#9a91b8', secondary: '#779995', accent: '#d3a47d', background: '#1f2028', text: '#f1eee8' } },
      { name: 'Sakura Elegan', colors: { primary: '#9f6176', secondary: '#d2b4b7', accent: '#a88f76', background: '#faf5f3', text: '#34282b' } }
    ],
    natural: [
      { name: 'Hutan Natural', colors: { primary: '#4f6a4f', secondary: '#a7b897', accent: '#c48f69', background: '#f5f4ec', text: '#30372e' } },
      { name: 'Kopi Natural', colors: { primary: '#735540', secondary: '#c7aa83', accent: '#9c705a', background: '#f7f2e9', text: '#332b23' } },
      { name: 'Laut Natural', colors: { primary: '#557b76', secondary: '#b4c7b8', accent: '#be9877', background: '#f4f8f3', text: '#2d3834' } }
    ],
    minimal: [
      { name: 'Mono Minimal', colors: { primary: '#3d4144', secondary: '#b8bbba', accent: '#8a9ba1', background: '#f7f7f5', text: '#272b2d' } },
      { name: 'Nusantara Minimal', colors: { primary: '#51665e', secondary: '#c4c8bb', accent: '#a47e69', background: '#f6f6f1', text: '#2c332f' } },
      { name: 'Laut Minimal', colors: { primary: '#496673', secondary: '#b7c1c3', accent: '#b39b80', background: '#f6f7f7', text: '#2b3438' } }
    ]
  };
  function paletteForStyle(style, index) {
    const indexes = stylePalettes[style] || stylePalettes.modern;
    const position = indexes.indexOf(index);
    return stylePaletteThemes[style]?.[position] || PRESETS[index];
  }
  const paletteOverrideKey = (style, index) => `${style}:${index}`;
  function paletteSwatches(palette) {
    return `<span class="recommendation-swatches">${COLOR_ROLES.map(role => {
      const color = palette.colors[role.key];
      const ink = Color.luminance(color) > 0.2 ? '#302e2b' : '#ffffff';
      return `<i style="--swatch:${color};--swatch-ink:${ink}"><small>${role.label}</small><b>${color}</b></i>`;
    }).join('')}</span>`;
  }
  let communityPaletteOverrides = {}, communityPaletteDraft = null, communityPaletteEditIndex = null, communityActiveRole = 'primary';
  function getSelectedPalette() {
    const style = $('#appStyle').value;
    const key = paletteOverrideKey(style, selectedPalette);
    return selectedPaletteSource === 'community' && communityPaletteOverrides[key]
      ? communityPaletteOverrides[key]
      : paletteForStyle(style, selectedPalette);
  }
  function renderBuiltInPalettes(style) {
    const indexes = stylePalettes[style] || stylePalettes.modern;
    const styleName = $('#appStyle').selectedOptions[0].textContent;
    $('#builtInPaletteNote').textContent = `Palet pilihan UIGenesis yang cocok untuk gaya ${styleName}.`;
    $('#builtInPaletteGallery').innerHTML = indexes.map((index, i) => {
      const key = paletteOverrideKey(style, index);
      const palette = communityPaletteOverrides[key] || paletteForStyle(style, index);
      const sourceName = communityPaletteOverrides[key] ? 'Palet kustom' : i === 0 ? 'Pilihan yang disarankan' : `Gaya ${styleName}`;
      return `<article class="community-palette-item">
        <button type="button" class="recommendation-card community-palette-card" data-community-palette="${index}" aria-pressed="false">
          <span class="recommendation-heading"><span><b>${escapeHtml(palette.name)}</b><small>${sourceName}</small></span><span class="recommendation-choice">Pilih palet</span></span>
          ${paletteSwatches(palette)}
        </button>
        <button type="button" class="btn btn-ghost btn-sm community-palette-edit" data-edit-community-palette="${index}">Edit palet ini</button>
      </article>`;
    }).join('');
  }
  function renderCommunityPaletteEditor() {
    const palette = communityPaletteDraft;
    if (!palette) return;
    const role = COLOR_ROLES.find(item => item.key === communityActiveRole) || COLOR_ROLES[0];
    const style = $('#appStyle').value;
    const options = [...new Map((stylePaletteThemes[style] || stylePaletteThemes.modern).map(preset => [preset.colors[role.key].toLowerCase(), { color: preset.colors[role.key], name: preset.name }])).values()];
    const editor = $('#communityPaletteEditor');
    editor.hidden = false;
    editor.innerHTML = `
      <div class="community-editor-head"><div><span class="summary-kicker">EDIT PALET UIGENESIS</span><h5>Sesuaikan ${escapeHtml(palette.name)}</h5><p class="muted">Pilih kelompok warna yang ingin diganti, lalu pilih warna penggantinya.</p></div><span class="palette-source-badge">Kustom</span></div>
      <div class="palette-role-grid">${COLOR_ROLES.map(item => `<button type="button" class="palette-role-choice ${item.key === role.key ? 'active' : ''}" data-palette-role="${item.key}" aria-pressed="${item.key === role.key}"><i style="background:${palette.colors[item.key]}"></i><span><b>${item.label}</b><small>${palette.colors[item.key].toUpperCase()}</small></span>${item.key === role.key ? '<strong>Dipilih</strong>' : ''}</button>`).join('')}</div>
      <div class="palette-color-pool"><div class="palette-color-pool-head"><b>Warna pengganti untuk ${role.label}</b><span class="muted">Pilih salah satu warna</span></div><div class="palette-color-options">${options.map(option => `<button type="button" class="palette-color-option ${option.color.toLowerCase() === palette.colors[role.key].toLowerCase() ? 'active' : ''}" data-palette-color="${option.color}" title="${escapeHtml(option.name)} — ${option.color}" aria-label="Gunakan ${option.color} dari palet ${escapeHtml(option.name)}"><i style="background:${option.color}"></i><span>${option.color.toUpperCase()}</span></button>`).join('')}</div></div>
      <div class="community-editor-actions"><button type="button" class="btn btn-ghost" data-community-edit-cancel>Batal</button><button type="button" class="btn btn-primary" data-community-edit-save>Selesai, gunakan palet</button></div>`;
  }
  function openCommunityPaletteEditor(index) {
    const style = $('#appStyle').value;
    const key = paletteOverrideKey(style, index);
    communityPaletteEditIndex = index;
    communityPaletteDraft = JSON.parse(JSON.stringify(communityPaletteOverrides[key] || paletteForStyle(style, index)));
    communityActiveRole = 'primary';
    renderCommunityPaletteEditor();
    $('#communityPaletteEditor').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function syncPaletteSelection() {
    $$('#recommendationList [data-recommendation]').forEach(card => {
      const active = selectedPaletteSource === 'recommendation' && +card.dataset.recommendation === selectedPalette;
      card.classList.toggle('active', active);
      card.setAttribute('aria-pressed', active);
      card.querySelector('.recommendation-heading small').textContent = active ? 'Rekomendasi utama' : 'Pilihan alternatif';
      card.querySelector('.recommendation-choice').textContent = active ? '✓ Dipilih' : 'Pilih palet';
    });
    $$('#builtInPaletteGallery [data-community-palette]').forEach(card => {
      const active = selectedPaletteSource === 'community' && +card.dataset.communityPalette === selectedPalette;
      card.classList.toggle('active', active);
      card.setAttribute('aria-pressed', active);
      card.querySelector('.recommendation-choice').textContent = active ? '✓ Dipilih' : 'Pilih palet';
    });
  }
  function showRecommendations() {
    const brief = briefValues();
    Store.set('uig_app_brief', brief);
    state.brand = brief.name;
    syncControls(); renderMockup(true); saveDraft();
    const base = categoryPalettes[brief.category] || [0, 2, 1, 3];
    const preferred = stylePalettes[brief.style] || [];
    const ordered = [...new Set([...preferred, ...base])];
    paletteChoices = ordered.slice(0, 3);
    selectedPalette = paletteChoices[0];
    selectedPaletteSource = 'recommendation';
    renderBuiltInPalettes(brief.style);
    $('#recommendationNote').textContent = `Palet disesuaikan dengan gaya ${$('#appStyle').selectedOptions[0].text}: ${stylePaletteNotes[brief.style] || stylePaletteNotes.modern}. Pilih satu untuk lanjut.`;
    $('#recommendationList').innerHTML = paletteChoices.map((index, i) => {
      const p = paletteForStyle(brief.style, index);
      return `<button type="button" class="recommendation-card ${i === 0 ? 'active' : ''}" data-recommendation="${index}" aria-pressed="${i === 0}">
        <span class="recommendation-heading"><span><b>${p.name}</b><small>${i === 0 ? 'Rekomendasi utama' : 'Pilihan alternatif'}</small></span><span class="recommendation-choice">${i === 0 ? '✓ Dipilih' : 'Pilih palet'}</span></span>
        ${paletteSwatches(p)}
      </button>`;
    }).join('');
    $('#prepareDesignBtn').disabled = false;
    setFlowStep('palette');
  }
  $('#recommendBtn').addEventListener('click', () => {
    showRecommendations();
    $('#recommendationSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#backToBriefBtn').addEventListener('click', () => setFlowStep('form'));
  $('#recommendationList').addEventListener('click', e => {
    const card = e.target.closest('[data-recommendation]');
    if (!card) return;
    selectedPalette = +card.dataset.recommendation;
    selectedPaletteSource = 'recommendation';
    syncPaletteSelection();
  });
  $('#builtInPaletteGallery').addEventListener('click', e => {
    const editButton = e.target.closest('[data-edit-community-palette]');
    if (editButton) {
      openCommunityPaletteEditor(+editButton.dataset.editCommunityPalette);
      return;
    }
    const card = e.target.closest('[data-community-palette]');
    if (!card) return;
    selectedPalette = +card.dataset.communityPalette;
    selectedPaletteSource = 'community';
    syncPaletteSelection();
  });
  $('#communityPaletteEditor').addEventListener('click', e => {
    const roleButton = e.target.closest('[data-palette-role]');
    if (roleButton) {
      communityActiveRole = roleButton.dataset.paletteRole;
      renderCommunityPaletteEditor();
      return;
    }
    const colorButton = e.target.closest('[data-palette-color]');
    if (colorButton && communityPaletteDraft) {
      communityPaletteDraft.colors[communityActiveRole] = colorButton.dataset.paletteColor;
      renderCommunityPaletteEditor();
      return;
    }
    if (e.target.closest('[data-community-edit-cancel]')) {
      communityPaletteDraft = null;
      communityPaletteEditIndex = null;
      $('#communityPaletteEditor').hidden = true;
      $('#communityPaletteEditor').innerHTML = '';
      return;
    }
    if (e.target.closest('[data-community-edit-save]') && communityPaletteDraft) {
      const index = communityPaletteEditIndex;
      const baseName = paletteForStyle($('#appStyle').value, index).name;
      communityPaletteOverrides[paletteOverrideKey($('#appStyle').value, index)] = { name: `${baseName} (Kustom)`, colors: { ...communityPaletteDraft.colors } };
      selectedPalette = index;
      selectedPaletteSource = 'community';
      communityPaletteDraft = null;
      communityPaletteEditIndex = null;
      $('#communityPaletteEditor').hidden = true;
      $('#communityPaletteEditor').innerHTML = '';
      renderBuiltInPalettes($('#appStyle').value);
      syncPaletteSelection();
      toast('Palet kustom siap digunakan');
    }
  });
  $('#prepareDesignBtn').addEventListener('click', () => {
    if (selectedPalette == null) return;
    const brief = briefValues();
    const palette = getSelectedPalette();
    const type = { commerce: 'ecommerce', productivity: 'saas', education: 'landing', food: 'ecommerce', portfolio: 'portfolio', content: 'blog' }[brief.category];
    const category = $('#appCategory').selectedOptions[0].textContent;
    const style = $('#appStyle').selectedOptions[0].textContent;
    const list = items => items.length
      ? `<div class="summary-tags">${items.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>`
      : '<span class="summary-empty">Belum ada pilihan</span>';
    $('#designSummary').innerHTML = `
      <div class="design-summary-head"><span class="summary-kicker">RINGKASAN DESAIN</span><span class="summary-template">${escapeHtml(TEMPLATES[type]?.label || 'Landing Page')}</span></div>
      <div class="design-summary-grid">
        <section class="design-summary-item"><small>Nama aplikasi</small><strong>${escapeHtml(brief.name)}</strong></section>
        <section class="design-summary-item"><small>Kategori</small><strong>${escapeHtml(category)}</strong></section>
        <section class="design-summary-item"><small>Gaya desain</small><strong>${escapeHtml(style)}</strong></section>
        <section class="design-summary-item summary-wide"><small>Halaman yang dibutuhkan · ${brief.pages.length}</small>${list(brief.pages)}</section>
        <section class="design-summary-item summary-wide"><small>Fitur yang dibutuhkan · ${brief.features.length}</small>${list(brief.features)}</section>
        <section class="design-summary-item summary-wide"><small>Palet warna terpilih</small><strong>${escapeHtml(palette.name)}</strong><div class="summary-palette">${COLOR_ROLES.map(role => `<span title="${role.label}: ${palette.colors[role.key]}"><i style="background:${palette.colors[role.key]}"></i><small>${role.label}</small></span>`).join('')}</div></section>
      </div>`;
    setFlowStep('design');
    $('#designSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  $('#backToPaletteBtn').addEventListener('click', () => setFlowStep('palette'));
  $('#buildAppBtn').addEventListener('click', () => {
    if (selectedPalette == null) return;
    const brief = briefValues();
    const typeByCategory = { commerce: 'ecommerce', productivity: 'saas', education: 'landing', food: 'ecommerce', portfolio: 'portfolio', content: 'blog' };
    state.brand = brief.name;
    state.type = typeByCategory[brief.category] || 'landing';
    state.application = brief;
    state.currentPage = brief.pages[0] || 'Home';
    state.customPages = {};
    state.customHtml = null;
    applyPreset(selectedPalette);
    state.colors = { ...getSelectedPalette().colors };
    state.mode = Color.isDark(state.colors.background) ? 'dark' : 'light';
    syncControls(); syncSwatches(); applyColors(); saveDraft();
    syncControls(); renderMockup(true); saveDraft();
    Stats.bump('mockups');
    $('#mockup').scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('Mockup dibuat dari kebutuhan aplikasi Anda');
    setFlowStep('mockup');
  });
  function beginCanvasEdit() {
    const editables = mockEl.querySelectorAll('h1,h2,h3,h4,p,a,button,span,strong,b');
    editables.forEach(el => {
      if (el.children.length || !el.textContent.trim()) return;
      el.contentEditable = 'true';
      el.spellcheck = true;
    });
    $('#canvasColorInput').value = state.colors.primary;
  }
  function finishCanvasEdit() {
    if (!mockEl) return;
    mockEl.querySelectorAll('[contenteditable="true"]').forEach(el => { el.contentEditable = 'false'; });
    if (state && mockEl.innerHTML) persistCanvasPage();
  }
  function persistCanvasPage() {
    const html = mockEl.innerHTML.replaceAll('contenteditable="true"', 'contenteditable="false"');
    if (state.application) {
      state.customPages = state.customPages || {};
      state.customPages[state.currentPage] = html;
    } else state.customHtml = html;
    if (state.application && state.customPages) {
      Object.keys(state.customPages).forEach(page => {
        state.customPages[page] = state.customPages[page].replaceAll('contenteditable="true"', 'contenteditable="false"');
      });
    }
    saveDraft();
  }
  $('#editMockupBtn').addEventListener('click', () => {
    const flow = $('#generatorFlow');
    if (flow.classList.contains('stage-edit')) setFlowStep('finished');
    else setFlowStep('edit');
  });
  mockEl.addEventListener('input', () => {
    if (!$('#generatorFlow').classList.contains('stage-edit')) return;
    persistCanvasPage();
  });
  $('#prototypePages').addEventListener('click', e => {
    const button = e.target.closest('[data-prototype-page]');
    if (!button) return;
    persistCanvasPage();
    state.currentPage = button.dataset.prototypePage;
    saveDraft(); renderMockup(true);
  });
  mockEl.addEventListener('click', e => {
    const action = e.target.closest('[data-proto-action]');
    if (action?.dataset.protoAction === 'add-cart') {
      if (state.application?.pages?.includes('Cart')) { state.currentPage = 'Cart'; renderMockup(true); }
      toast('Produk ditambahkan ke keranjang');
      return;
    }
    if (action?.dataset.protoAction === 'complete-order') { toast('Contoh prototype: pesanan berhasil dibuat'); return; }
    const link = e.target.closest('[data-proto-goto]');
    if (!link || !state.application?.pages?.includes(link.dataset.protoGoto)) return;
    e.preventDefault();
    persistCanvasPage();
    state.currentPage = link.dataset.protoGoto;
    saveDraft(); renderMockup(true);
  });
  $('#canvasColorInput').addEventListener('input', e => setColor('primary', e.target.value, 'picker'));

  /* ---------- 08. KONTROL EDIT: FONT, SUDUT, DAN NAMA ---------- */
  // Font
  $('#fontSelect').innerHTML = Object.keys(FONTS).map(f => `<option>${f}</option>`).join('');
  $('#fontSelect').addEventListener('change', e => { state.font = e.target.value; applyColors(); saveDraft(); });

  // Radius
  $('#radiusSeg').innerHTML = Object.entries(RADIUS).map(([k, r]) => `<button data-radius="${k}">${r.label}</button>`).join('');
  $('#radiusSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-radius]');
    if (!b) return;
    state.radius = b.dataset.radius;
    syncControls(); applyColors(); saveDraft();
  });

  // Brand
  $('#brandInput').addEventListener('input', e => {
    state.brand = e.target.value.trim() || 'Brand';
    renderMockup(true); saveDraft();
  });

  /* ---------- 09. TAMPILAN PREVIEW & RESPONSIVE DEVICE ---------- */
  // Device
  $('#deviceSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-device]');
    if (!b) return;
    device = b.dataset.device;
    $('#device').dataset.device = device;
    $$('#deviceSeg button').forEach(x => x.classList.toggle('active', x === b));
    fitPreview();
    setTimeout(fitPreview, 420); // after the width transition
  });

  function syncControls() {
    $$('#typeGrid .type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === state.type));
    $('#typeLabel').textContent = TEMPLATES[state.type].label;
    $$('#modeSeg button').forEach(b => b.classList.toggle('active', b.dataset.mode === state.mode));
    $$('#radiusSeg button').forEach(b => b.classList.toggle('active', b.dataset.radius === state.radius));
    $('#harmonySelect').value = state.harmony;
    $('#fontSelect').value = state.font;
    if (document.activeElement !== $('#brandInput')) $('#brandInput').value = state.brand;
  }

  function applyColors() {
    mockEl.setAttribute('style', mockupVars(state));
    $('#mockFont').href = fontHref(state.font);
    fitPreview();
    renderContrast();
  }

  // Render desktop/tablet at their real width, then zoom down to fit the frame
  const VIRTUAL_WIDTH = { desktop: 1280, tablet: 768 };
  const screenEl = $('.device-screen');
  function fitPreview() {
    const vw = VIRTUAL_WIDTH[device];
    const avail = screenEl.clientWidth;
    if (!vw || !avail || avail >= vw) {
      mockEl.style.width = '';
      mockEl.style.zoom = '';
    } else {
      mockEl.style.width = vw + 'px';
      mockEl.style.zoom = (avail / vw).toFixed(4);
    }
  }
  if (window.ResizeObserver) new ResizeObserver(fitPreview).observe(screenEl);
  else window.addEventListener('resize', fitPreview);

  function renderMockup(full) {
    if (full) {
      const page = state.currentPage || state.application?.pages?.[0] || 'Home';
      const savedPage = state.application ? state.customPages?.[page] : null;
      const generated = state.application ? renderPrototypePage(state, page) : TEMPLATES[state.type].render(state.brand);
      mockEl.innerHTML = savedPage || state.customHtml || generated;
      if (!$('#generatorFlow').classList.contains('stage-edit')) {
        mockEl.querySelectorAll('[contenteditable="true"]').forEach(el => { el.contentEditable = 'false'; });
      }
      if ($('#generatorFlow').classList.contains('stage-edit')) beginCanvasEdit();
      const slug = state.brand.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'brand';
      $('#deviceUrl').textContent = state.application ? `${slug}.id/${page.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : `${slug}.id/${TEMPLATES[state.type].url}`;
      renderPageSwitcher();
    }
    applyColors();
  }

  function renderContrast() {
    const c = state.colors;
    const checks = [
      ['Teks di background', c.text, c.background],
      ['Teks di tombol primary', Color.on(c.primary), c.primary],
      ['Primary di background', c.primary, c.background],
      ['Teks di secondary', Color.on(c.secondary), c.secondary],
      ['Teks di accent', Color.on(c.accent), c.accent]
    ];
    $('#contrastList').innerHTML = checks.map(([label, fg, bg]) => {
      const r = Color.contrast(fg, bg);
      const [cls, txt] = r >= 7 ? ['pass', 'AAA'] : r >= 4.5 ? ['pass', 'AA'] : r >= 3 ? ['warn', 'AA Besar'] : ['fail', 'Gagal'];
      return `<div class="contrast-row"><span class="demo" style="background:${bg};color:${fg}">Aa</span>
        <span class="lbl">${label}</span><span class="ratio">${r.toFixed(2)}:1</span><span class="badge ${cls}">${txt}</span></div>`;
    }).join('');
  }

  /* ---------- 10. KODE PALET WARNA ---------- */
  // Code modal
  function renderCode() {
    const c = state.colors;
    $('#codeBox').textContent = codeFmt === 'css' ? paletteCss(c) : codeFmt === 'tailwind' ? paletteTailwind(c) : paletteJson(c);
    $$('#codeSeg button').forEach(b => b.classList.toggle('active', b.dataset.fmt === codeFmt));
  }
  $('#codeBtn').addEventListener('click', () => { renderCode(); openModal('#codeModal'); });
  $('#codeSeg').addEventListener('click', e => {
    const b = e.target.closest('[data-fmt]');
    if (b) { codeFmt = b.dataset.fmt; renderCode(); }
  });
  $('#copyCodeBtn').addEventListener('click', async () => {
    await copyText($('#codeBox').textContent);
    Stats.bump('exports');
    toast('Kode berhasil disalin ke clipboard');
  });

  /* ---------- 11. EKSPOR & BUKA MOCKUP ---------- */
  // Export / open
  const fileSlug = () => (state.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mockup') + '-' + state.type;
  $('#exportBtn').addEventListener('click', () => {
    download(fileSlug() + '.html', buildMockupHtml(state));
    Stats.bump('exports');
    toast('Mockup HTML berhasil diunduh');
  });
  $('#openBtn').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([buildMockupHtml(state)], { type: 'text/html' }));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  });

  /* ---------- 12. SIMPAN, BUKA, DAN RESET PROYEK ---------- */
  // Save
  $('#saveBtn').addEventListener('click', () => {
    const existing = editingId && Projects.get(editingId);
    $('#saveName').value = existing ? existing.name : `${state.brand} — ${TEMPLATES[state.type].label}`;
    $('#saveAsNew').checked = false;
    $('#saveAsNewWrap').style.display = existing ? 'flex' : 'none';
    $('#saveTitle').textContent = existing ? 'Perbarui Proyek' : 'Simpan Proyek';
    openModal('#saveModal');
    setTimeout(() => $('#saveName').select(), 50);
  });
  $('#saveForm').addEventListener('submit', e => {
    e.preventDefault();
    const now = Date.now();
    const existing = editingId && !$('#saveAsNew').checked ? Projects.get(editingId) : null;
    const p = {
      id: existing ? existing.id : uid(),
      name: $('#saveName').value.trim() || state.brand,
      brand: state.brand, type: state.type, font: state.font, radius: state.radius,
      mode: state.mode, harmony: state.harmony, colors: { ...state.colors }, application: state.application || null, customHtml: state.customHtml || null,
      currentPage: state.currentPage || null, customPages: state.customPages || {},
      created: existing ? existing.created : now, updated: now
    };
    Projects.upsert(p);
    editingId = p.id;
    saveDraft(); closeModals(); updateCount();
    toast(existing ? 'Proyek diperbarui' : 'Proyek berhasil disimpan');
  });

  function loadProject(id) {
    const p = Projects.get(id);
    if (!p) return;
    state = { brand: p.brand || p.name, type: p.type, font: p.font, radius: p.radius, mode: p.mode, harmony: p.harmony || 'analogous', colors: { ...p.colors }, application: p.application || null, currentPage: p.currentPage || p.application?.pages?.[0] || 'Home', customPages: p.customPages || {}, customHtml: p.customHtml || null, locks: {} };
    editingId = p.id;
    saveDraft(); syncControls(); syncSwatches();
    openRequestedProject = location.hash !== '#generator';
    setFlowStep('edit');
    location.hash = '#generator';
    toast(`Membuka "${p.name}"`);
  }

  function startNewDesign() {
    if ($('#generatorFlow').classList.contains('stage-edit')) finishCanvasEdit();
    state = defaultState(); editingId = null;
    $('#appNameInput').value = state.brand;
    $('#appCategory').value = 'commerce';
    $('#appStyle').value = 'modern';
    renderCategoryOptions('commerce', ['Home'], []);
    Store.remove('uig_app_brief');
    setFlowStep('form');
    saveDraft(); syncControls(); syncSwatches();
  }
  $('#newProjBtn').addEventListener('click', startNewDesign);
  $('#topNewProjectBtn').addEventListener('click', startNewDesign);

  /* =========================================================
     13. RINGKASAN DASHBOARD
     ========================================================= */
  const sorted = () => Projects.all().sort((a, b) => b.updated - a.updated);

  function swatchStrip(c) { return COLOR_ROLES.map(r => `<i style="background:${c[r.key]}"></i>`).join(''); }

  function renderOverview() {
    const list = sorted();
    const st = Stats.get();
    const week = list.filter(p => Date.now() - p.created < 7 * 864e5).length;
    $('#stProjects').textContent = list.length;
    $('#stProjectsNote').textContent = `+${week} minggu ini`;
    $('#stPalettes').textContent = st.palettes || 0;
    $('#stMockups').textContent = st.mockups || 0;
    $('#stExports').textContent = st.exports || 0;

    $('#recentList').innerHTML = list.length ? list.slice(0, 5).map(p => `
      <div class="recent-item" data-open="${p.id}" tabindex="0" role="button">
        <div class="mini-sw">${swatchStrip(p.colors)}</div>
        <div class="info"><b>${escapeHtml(p.name)}</b><span>Diubah ${timeAgo(p.updated)}</span></div>
        <span class="tag">${TEMPLATES[p.type]?.label || p.type}</span>
      </div>`).join('')
      : `<div class="empty"><b>Belum ada proyek</b>Buat desain pertama Anda di Generator.</div>`;

    const counts = Object.keys(TEMPLATES).map(k => [k, list.filter(p => p.type === k).length]);
    const max = Math.max(1, ...counts.map(c => c[1]));
    const colors = ['#6d4aff', '#00c2a8', '#ff7a59', '#f5b301', '#3b82f6'];
    $('#typeBars').innerHTML = counts.map(([k, n], i) => `
      <div class="bar-row"><span>${TEMPLATES[k].label}</span><div class="track"><i style="width:${(n / max) * 100}%;background:${colors[i]}"></i></div><b>${n}</b></div>`).join('');
  }
  $('#recentList').addEventListener('click', e => { const it = e.target.closest('[data-open]'); if (it) loadProject(it.dataset.open); });
  $('#recentList').addEventListener('keydown', e => { const it = e.target.closest('[data-open]'); if (it && e.key === 'Enter') loadProject(it.dataset.open); });

  /* =========================================================
     14. DAFTAR & PENGELOLAAN PROYEK
     ========================================================= */
  $('#projFilter').innerHTML += Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}">${t.label}</option>`).join('');
  $('#projSearch').addEventListener('input', renderProjects);
  $('#projFilter').addEventListener('change', renderProjects);

  function renderProjects() {
    const q = $('#projSearch').value.trim().toLowerCase();
    const f = $('#projFilter').value;
    const list = sorted().filter(p => (!f || p.type === f) && (!q || p.name.toLowerCase().includes(q)));
    $('#projGrid').innerHTML = list.length ? list.map(p => {
      const c = p.colors;
      return `<article class="proj-card">
        <div class="proj-thumb" style="background:${c.background}">
          <span class="t-blob" style="background:linear-gradient(135deg,${c.primary},${c.accent})"></span>
          <span class="t-line" style="background:${c.text}"></span>
          <span class="t-line sm" style="background:${c.text}"></span>
          <span class="t-btn" style="background:${c.primary}"></span>
        </div>
        <div class="proj-sw">${swatchStrip(c)}</div>
        <div class="proj-body">
          <div class="row"><h4 title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h4><span class="tag">${TEMPLATES[p.type]?.label || p.type}</span></div>
          <p>${escapeHtml(p.font)} · ${RADIUS[p.radius]?.label || ''} · ${p.mode === 'dark' ? 'Gelap' : 'Terang'} · ${timeAgo(p.updated)}</p>
          <div class="acts">
            <button class="btn btn-ghost btn-sm" data-act="open" data-id="${p.id}">${icon('wand')}Buka</button>
            <button class="icon-btn" data-act="export" data-id="${p.id}" title="Ekspor HTML" aria-label="Ekspor HTML">${icon('download')}</button>
            <button class="icon-btn" data-act="delete" data-id="${p.id}" title="Hapus" aria-label="Hapus">${icon('trash')}</button>
          </div>
        </div>
      </article>`;
    }).join('') : `<div class="card empty" style="grid-column:1/-1"><b>${q || f ? 'Tidak ada proyek yang cocok' : 'Belum ada proyek'}</b>${q || f ? 'Coba kata kunci atau filter lain.' : 'Simpan desain dari Generator untuk melihatnya di sini.'}</div>`;
  }
  $('#projGrid').addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const p = Projects.get(b.dataset.id);
    if (!p) return;
    if (b.dataset.act === 'open') loadProject(p.id);
    if (b.dataset.act === 'export') {
      download(p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html', buildMockupHtml({ ...p, brand: p.brand || p.name }));
      Stats.bump('exports');
      toast('Mockup HTML berhasil diunduh');
    }
    if (b.dataset.act === 'delete' && confirm(`Hapus proyek "${p.name}"?`)) {
      Projects.remove(p.id);
      if (editingId === p.id) { editingId = null; saveDraft(); }
      renderProjects(); updateCount();
      toast('Proyek dihapus');
    }
  });

  function updateCount() { $('#projCount').textContent = Projects.all().length; }

  /* =========================================================
     15. PENGATURAN PROFIL & DATA
     ========================================================= */
  function renderSettings() {
    const u = Auth.user();
    $('#setName').value = u.name;
    $('#setEmail').value = u.email;
    $('#setPlan').value = u.plan;
  }
  $('#profileForm').addEventListener('submit', e => {
    e.preventDefault();
    const u = Auth.user();
    u.name = $('#setName').value.trim() || u.name;
    Store.set('uig_user', u);
    renderUser();
    toast('Profil diperbarui');
  });
  $('#exportDataBtn').addEventListener('click', () => {
    download('uigenesis-proyek.json', JSON.stringify(Projects.all(), null, 2), 'application/json');
    toast('Data proyek diunduh');
  });
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('Hapus semua proyek? Tindakan ini tidak bisa dibatalkan.')) return;
    Projects.save([]);
    editingId = null; saveDraft(); updateCount();
    toast('Semua proyek dihapus');
  });

  /* ---------- 16. INISIALISASI TAMPILAN ---------- */
  syncControls();
  syncSwatches();
  renderMockup(true);
  updateCount();
  route();
})();
