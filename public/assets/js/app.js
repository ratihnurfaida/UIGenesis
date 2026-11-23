/* =========================================================
   UIGenesis — shared helpers: color math, auth (dummy), storage, UI
   ========================================================= */

/* ---------- Color utilities ---------- */
const Color = {
  normalize(hex) {
    let h = String(hex || '').trim().replace('#', '');
    if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map(c => c + c).join('');
    return /^[0-9a-f]{6}$/i.test(h) ? '#' + h.toLowerCase() : null;
  },
  toRgb(hex) {
    const n = parseInt(Color.normalize(hex).slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  },
  fromRgb(r, g, b) {
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  },
  toHsl(hex) {
    let [r, g, b] = Color.toRgb(hex).map(v => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return [h, s * 100, l * 100];
  },
  fromHsl(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Color.fromRgb(f(0) * 255, f(8) * 255, f(4) * 255);
  },
  luminance(hex) {
    const [r, g, b] = Color.toRgb(hex).map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  contrast(a, b) {
    const la = Color.luminance(a), lb = Color.luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  },
  /** mix(a, b, w): w = weight of a (0..1) */
  mix(a, b, w) {
    const A = Color.toRgb(a), B = Color.toRgb(b);
    return Color.fromRgb(...A.map((v, i) => v * w + B[i] * (1 - w)));
  },
  on(hex) {
    return Color.contrast(hex, '#ffffff') >= Color.contrast(hex, '#14121c') ? '#ffffff' : '#14121c';
  },
  isDark(hex) { return Color.luminance(hex) < 0.2; }
};

/* ---------- Storage ---------- */
const Store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }
};

/* ---------- Dummy auth ---------- */
const DEMO_ACCOUNT = { email: 'demo@uigenesis.id', password: 'demo123', name: 'Demo Designer' };

const Auth = {
  user() { return Store.get('uig_user', null); },
  login(email, password, remember) {
    email = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Format email tidak valid.' };
    if (String(password || '').length < 6) return { ok: false, error: 'Password minimal 6 karakter.' };
    if (email === DEMO_ACCOUNT.email && password !== DEMO_ACCOUNT.password) {
      return { ok: false, error: 'Password akun demo salah. Gunakan "demo123".' };
    }
    const name = email === DEMO_ACCOUNT.email
      ? DEMO_ACCOUNT.name
      : email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const user = { name, email, plan: 'Pro (Trial)', joined: new Date().toISOString(), remember: !!remember };
    Store.set('uig_user', user);
    if (!Store.get('uig_seeded_' + email, false)) {
      seedProjects();
      Store.set('uig_seeded_' + email, true);
    }
    return { ok: true, user };
  },
  logout() {
    Store.remove('uig_user');
    const form = document.getElementById('logoutForm');
    if (form) form.submit();
  },
  require() {
    const u = Auth.user();
    if (!u) location.replace('/login');
    return u;
  }
};

/* ---------- Projects ---------- */
const Projects = {
  all() { return Store.get('uig_projects', []); },
  save(list) { Store.set('uig_projects', list); },
  upsert(p) {
    const list = Projects.all();
    const i = list.findIndex(x => x.id === p.id);
    if (i >= 0) list[i] = p; else list.unshift(p);
    Projects.save(list);
    return p;
  },
  remove(id) { Projects.save(Projects.all().filter(p => p.id !== id)); },
  get(id) { return Projects.all().find(p => p.id === id); }
};

const Stats = {
  get() { return Store.get('uig_stats', { palettes: 0, exports: 0, mockups: 0 }); },
  bump(key, n = 1) {
    const s = Stats.get();
    s[key] = (s[key] || 0) + n;
    Store.set('uig_stats', s);
    return s;
  }
};

function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }

function seedProjects() {
  const now = Date.now(), day = 864e5;
  const samples = [
    { name: 'Kopi Senja — Landing', type: 'landing', font: 'Poppins', radius: 'rounded', mode: 'light',
      colors: { primary: '#8b5a2b', secondary: '#d4a373', accent: '#e76f51', background: '#fdf8f3', text: '#2b1d12' }, t: now - day * 1 },
    { name: 'Batik Store', type: 'ecommerce', font: 'Inter', radius: 'soft', mode: 'light',
      colors: { primary: '#1d4ed8', secondary: '#0ea5e9', accent: '#f59e0b', background: '#f8fafc', text: '#0f172a' }, t: now - day * 3 },
    { name: 'Finora Analytics', type: 'saas', font: 'Space Grotesk', radius: 'soft', mode: 'dark',
      colors: { primary: '#7c5cff', secondary: '#22d3ee', accent: '#f472b6', background: '#0e0c1d', text: '#ecebf7' }, t: now - day * 5 }
  ];
  const existing = Projects.all();
  samples.forEach(s => existing.push({ id: uid(), brand: s.name.split(' —')[0], harmony: 'analogous', created: s.t, updated: s.t, ...s }));
  Projects.save(existing);
  const st = Stats.get();
  if (!st.palettes) Store.set('uig_stats', { palettes: 18, exports: 4, mockups: 9 });
}

/* ---------- UI helpers ---------- */
function toast(msg, type = 'ok') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('role', 'status');
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.innerHTML = '<i></i><span></span>';
  el.querySelector('span').textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; }, 2400);
  setTimeout(() => el.remove(), 2800);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function timeAgo(t) {
  const d = (Date.now() - t) / 1000;
  if (d < 60) return 'baru saja';
  if (d < 3600) return Math.floor(d / 60) + ' menit lalu';
  if (d < 86400) return Math.floor(d / 3600) + ' jam lalu';
  if (d < 86400 * 30) return Math.floor(d / 86400) + ' hari lalu';
  return new Date(t).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (_) { /* ignore */ }
    ta.remove();
  }
}

function download(filename, content, mime = 'text/html') {
  const blob = new Blob([content], { type: mime + ';charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- Icons (inline SVG, stroke-based) ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  wand: '<path d="m15 4 1.5 3L20 8.5 16.5 10 15 13l-1.5-3L10 8.5 13.5 7z"/><path d="M4 20 13 11"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.9 1.7-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H16a5 5 0 0 0 5-5c0-3.9-4-7-9-7z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15.5" cy="7.5" r="1"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  desktop: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  tablet: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/>',
  mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="M12 15 9 12a22 22 0 0 1 2-4 12.9 12.9 0 0 1 11-6c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  key: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  open: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>'
};

function icon(name, extra = '') {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${ICONS[name] || ''}</svg>`;
}

/* Replace <i data-icon="name"></i> placeholders with SVG */
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    el.outerHTML = icon(el.getAttribute('data-icon'));
  });
}
document.addEventListener('DOMContentLoaded', () => hydrateIcons());
