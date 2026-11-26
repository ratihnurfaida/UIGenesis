/* =========================================================
   UIGenesis — Palette engine + Mockup templates
   Mockups are pure HTML strings styled by MOCKUP_CSS and
   driven by CSS variables, so the same output can be exported.
   ========================================================= */

const FONTS = {
  'Inter': 'Inter:wght@400;500;600;700;800',
  'Poppins': 'Poppins:wght@400;500;600;700;800',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:wght@400;500;600;700;800',
  'Space Grotesk': 'Space+Grotesk:wght@400;500;600;700',
  'DM Sans': 'DM+Sans:wght@400;500;700;800',
  'Playfair Display': 'Playfair+Display:wght@500;600;700;800'
};

const RADIUS = {
  sharp: { r: '2px', rb: '2px', label: 'Tajam' },
  soft: { r: '10px', rb: '8px', label: 'Lembut' },
  rounded: { r: '20px', rb: '999px', label: 'Bulat' }
};

const PRESETS = [
  { name: 'Nusantara', colors: { primary: '#718477', secondary: '#c6b79e', accent: '#b57d6b', background: '#f7f5ef', text: '#30342f' } },
  { name: 'Kopi', colors: { primary: '#7a5d4a', secondary: '#c6a98e', accent: '#b77d69', background: '#f7f2eb', text: '#332a24' } },
  { name: 'Laut', colors: { primary: '#557d86', secondary: '#9cb8b5', accent: '#c69a72', background: '#f3f7f6', text: '#263638' } },
  { name: 'Hutan', colors: { primary: '#62755f', secondary: '#aab69f', accent: '#bea37b', background: '#f5f6f0', text: '#2e352e' } },
  { name: 'Sakura', colors: { primary: '#b57990', secondary: '#d6b3be', accent: '#92819c', background: '#fbf5f7', text: '#3b2e36' } },
  { name: 'Senja', colors: { primary: '#b87559', secondary: '#d4a48a', accent: '#a97983', background: '#fcf5f0', text: '#3b2d29' } },
  { name: 'Midnight', colors: { primary: '#8582a8', secondary: '#7ba5a7', accent: '#c49283', background: '#1f202a', text: '#f3f0ea' } },
  { name: 'Mono', colors: { primary: '#4e5054', secondary: '#92918c', accent: '#aa9672', background: '#f5f5f2', text: '#2e2f2c' } }
];

const COLOR_ROLES = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'background', label: 'Background' },
  { key: 'text', label: 'Text' }
];

const HARMONIES = {
  analogous: 'Analog',
  complementary: 'Komplementer',
  triadic: 'Triadik',
  split: 'Split',
  monochrome: 'Monokrom'
};

/* ---------- Palette generation ---------- */
function generatePalette(base, harmony, mode, current = {}, locks = {}) {
  const [h, s0] = Color.toHsl(base);
  const s = Math.max(48, Math.min(78, s0));
  let h2 = h + 30, h3 = h - 35;
  if (harmony === 'complementary') { h2 = h + 180; h3 = h + 35; }
  if (harmony === 'triadic') { h2 = h + 120; h3 = h + 240; }
  if (harmony === 'split') { h2 = h + 150; h3 = h + 210; }
  const mono = harmony === 'monochrome';
  const dark = mode === 'dark';

  const next = {
    primary: Color.fromHsl(h, s, dark ? 62 : 48),
    secondary: mono ? Color.fromHsl(h, s * 0.55, dark ? 74 : 64) : Color.fromHsl(h2, s * 0.8, dark ? 60 : 46),
    accent: mono ? Color.fromHsl(h, s * 0.9, dark ? 82 : 30) : Color.fromHsl(h3, Math.min(95, s + 8), dark ? 66 : 56),
    background: dark ? Color.fromHsl(h, 28, 8) : Color.fromHsl(h, 40, 98.5),
    text: dark ? Color.fromHsl(h, 20, 94) : Color.fromHsl(h, 30, 12)
  };
  const out = {};
  COLOR_ROLES.forEach(({ key }) => { out[key] = locks[key] && current[key] ? current[key] : next[key]; });
  return out;
}

function randomBase() {
  const h = Math.floor(Math.random() * 360);
  return Color.fromHsl(h, 60 + Math.random() * 25, 45 + Math.random() * 10);
}

/* ---------- CSS variables for a design state ---------- */
function mockupVars(st) {
  const c = st.colors;
  const rad = RADIUS[st.radius] || RADIUS.rounded;
  const vars = {
    '--p': c.primary, '--s': c.secondary, '--a': c.accent, '--bg': c.background, '--tx': c.text,
    '--on-p': Color.on(c.primary), '--on-s': Color.on(c.secondary), '--on-a': Color.on(c.accent),
    '--surface': Color.mix(c.text, c.background, 0.04),
    '--surface-2': Color.mix(c.text, c.background, 0.08),
    '--border': Color.mix(c.text, c.background, 0.12),
    '--muted': Color.mix(c.text, c.background, 0.62),
    '--p-soft': Color.mix(c.primary, c.background, 0.12),
    '--s-soft': Color.mix(c.secondary, c.background, 0.14),
    '--a-soft': Color.mix(c.accent, c.background, 0.14),
    '--card': Color.isDark(c.background) ? Color.mix('#ffffff', c.background, 0.05) : '#ffffff',
    '--r': rad.r, '--rb': rad.rb,
    '--font': `"${st.font}", system-ui, sans-serif`
  };
  return Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
}

function fontHref(font) {
  return `https://fonts.googleapis.com/css2?family=${FONTS[font] || FONTS.Inter}&display=swap`;
}

/* ---------- Mockup stylesheet (scoped to .mk) ---------- */
const MOCKUP_CSS = `
.mk{font-family:var(--font);background:var(--bg);color:var(--tx);container-type:inline-size;line-height:1.55;font-size:15px;min-height:100%}
.mk *{box-sizing:border-box;margin:0;padding:0}
.mk a{color:inherit;text-decoration:none}
.mk h1,.mk h2,.mk h3,.mk h4{line-height:1.12;letter-spacing:-.02em}
.mk .w{max-width:1140px;margin:0 auto;padding:0 32px}
.mk svg{width:20px;height:20px;flex:none}
.mk-nav{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 32px;border-bottom:1px solid var(--border)}
.mk-logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;white-space:nowrap}
.mk-logo i,.mk-logo img{width:30px;height:30px;flex:none;border-radius:calc(var(--r)*.5 + 4px);object-fit:contain}
.mk-logo i{background:linear-gradient(135deg,var(--p),var(--a));display:block}
.mk-logo img{padding:2px;background:#fff;border:1px solid var(--border)}
.mk-links{display:flex;gap:28px;font-size:14px;font-weight:500;color:var(--muted)}
.mk-links a:first-child{color:var(--tx);font-weight:600}
.mk-navr{display:flex;align-items:center;gap:10px}
.mk-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 22px;border-radius:var(--rb);font-weight:600;font-size:14px;background:var(--p);color:var(--on-p);border:2px solid var(--p);white-space:nowrap;cursor:pointer}
.mk-btn.ghost{background:transparent;color:var(--tx);border-color:var(--border)}
.mk-btn.sec{background:var(--s);color:var(--on-s);border-color:var(--s)}
.mk-btn.acc{background:var(--a);color:var(--on-a);border-color:var(--a)}
.mk-btn.sm{padding:8px 14px;font-size:13px}
.mk-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:var(--p-soft);color:var(--p);font-size:13px;font-weight:600}
.mk-badge i{width:7px;height:7px;border-radius:50%;background:var(--a);display:block}
.mk-chip{display:inline-flex;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:600;background:var(--s-soft);color:var(--tx);border:1px solid var(--border)}
.mk-muted{color:var(--muted)}
.mk-sec{padding:84px 0}
.mk-sec.alt{background:var(--surface)}
.mk-head{text-align:center;max-width:620px;margin:0 auto 46px}
.mk-head .eb{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--p)}
.mk-head h2{font-size:38px;margin:10px 0 12px}
.mk-head p{color:var(--muted);font-size:16px}
.mk-g2{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}
.mk-g3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.mk-g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.mk-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:26px}
.mk-ic{width:48px;height:48px;border-radius:calc(var(--r)*.6 + 4px);display:grid;place-items:center;margin-bottom:18px;background:var(--p-soft);color:var(--p)}
.mk-ic.s{background:var(--s-soft);color:var(--s)}
.mk-ic.a{background:var(--a-soft);color:var(--a)}
.mk-card h3{font-size:18px;margin-bottom:8px}
.mk-card p{color:var(--muted);font-size:14px}
.mk-img{border-radius:var(--r);background:linear-gradient(135deg,var(--p),var(--s));position:relative;overflow:hidden}
.mk-img.v2{background:linear-gradient(135deg,var(--s),var(--a))}
.mk-img.v3{background:linear-gradient(135deg,var(--a),var(--p))}
.mk-img.v4{background:linear-gradient(160deg,var(--surface-2),var(--p-soft))}
.mk-img::before{content:"";position:absolute;width:55%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.18);right:-12%;top:-15%}
.mk-img::after{content:"";position:absolute;width:35%;aspect-ratio:1;border-radius:calc(var(--r) + 6px);background:rgba(255,255,255,.14);left:10%;bottom:-10%;transform:rotate(18deg)}
.mk-hero{display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:center;padding:84px 0 70px}
.mk-hero h1{font-size:56px;margin:20px 0 18px;font-weight:800}
.mk-hero h1 em{font-style:normal;color:var(--p)}
.mk-hero p.lead{font-size:18px;color:var(--muted);max-width:500px}
.mk-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.mk-hero .mk-row{margin-top:30px}
.mk-stats{display:flex;gap:34px;margin-top:40px;flex-wrap:wrap}
.mk-stats strong{display:block;font-size:26px;letter-spacing:-.02em}
.mk-stats span{font-size:13px;color:var(--muted)}
.mk-visual{position:relative}
.mk-visual .mk-img{aspect-ratio:1.05}
.mk-float{position:absolute;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px;box-shadow:0 20px 40px -18px rgba(0,0,0,.35);display:flex;gap:12px;align-items:center;font-size:13px}
.mk-float b{display:block;font-size:15px}
.mk-float .dot{width:38px;height:38px;border-radius:calc(var(--r)*.6 + 4px);background:var(--a);color:var(--on-a);display:grid;place-items:center}
.mk-float.f1{left:-24px;bottom:34px}
.mk-float.f2{right:-18px;top:30px}
.mk-logos{display:flex;justify-content:center;gap:44px;flex-wrap:wrap;padding:30px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);font-weight:800;font-size:19px;color:var(--muted);opacity:.75}
.mk-price{display:flex;flex-direction:column;gap:18px}
.mk-price .amt{font-size:40px;font-weight:800;letter-spacing:-.03em}
.mk-price .amt small{font-size:14px;font-weight:500;color:var(--muted)}
.mk-price ul{list-style:none;display:grid;gap:10px;font-size:14px}
.mk-price li{display:flex;gap:10px;align-items:center}
.mk-price li::before{content:"";width:18px;height:18px;border-radius:50%;background:var(--s-soft);box-shadow:inset 0 0 0 5px var(--s-soft),inset 0 0 0 9px var(--s);flex:none}
.mk-price.hot{background:var(--p);color:var(--on-p);border-color:var(--p);transform:scale(1.03)}
.mk-price.hot p,.mk-price.hot .amt small{color:inherit;opacity:.8}
.mk-price.hot .mk-btn{background:var(--on-p);color:var(--p);border-color:var(--on-p)}
.mk-price.hot li::before{background:transparent;box-shadow:inset 0 0 0 9px var(--a)}
.mk-cta{border-radius:calc(var(--r) + 8px);padding:60px;text-align:center;background:var(--p);color:var(--on-p);position:relative;overflow:hidden}
.mk-cta::before{content:"";position:absolute;width:320px;height:320px;border-radius:50%;background:var(--a);opacity:.35;right:-90px;top:-140px}
.mk-cta::after{content:"";position:absolute;width:240px;height:240px;border-radius:50%;background:var(--s);opacity:.35;left:-80px;bottom:-130px}
.mk-cta>*{position:relative}
.mk-cta h2{font-size:38px;margin-bottom:12px}
.mk-cta p{opacity:.85;margin-bottom:26px}
.mk-cta .mk-btn{background:var(--on-p);color:var(--p);border-color:var(--on-p)}
.mk-foot{padding:44px 32px;border-top:1px solid var(--border);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center;font-size:14px;color:var(--muted)}
.mk-foot nav{display:flex;gap:22px}
.mk-input{flex:1;min-width:180px;padding:13px 16px;border-radius:var(--rb);border:1px solid var(--border);background:var(--card);color:var(--tx);font:inherit;font-size:14px}
/* ecommerce */
.mk-promo{background:var(--tx);color:var(--bg);text-align:center;font-size:13px;padding:9px 16px;font-weight:500}
.mk-promo b{color:var(--a)}
.mk-search{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:var(--rb);background:var(--surface);border:1px solid var(--border);color:var(--muted);font-size:14px;width:280px}
.mk-search svg{width:17px;height:17px}
.mk-iconbtn{width:42px;height:42px;border-radius:var(--rb);display:grid;place-items:center;border:1px solid var(--border);position:relative}
.mk-iconbtn sup{position:absolute;top:-5px;right:-5px;background:var(--a);color:var(--on-a);font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:grid;place-items:center}
.mk-banner{margin-top:28px;border-radius:calc(var(--r) + 6px);padding:56px;display:grid;grid-template-columns:1.1fr 1fr;gap:30px;align-items:center;background:var(--p-soft);overflow:hidden}
.mk-banner h1{font-size:50px;margin:14px 0}
.mk-banner .mk-img{aspect-ratio:1.3}
.mk-cats{display:flex;gap:10px;flex-wrap:wrap;margin:40px 0 26px}
.mk-cats span{padding:9px 18px;border-radius:var(--rb);border:1px solid var(--border);font-size:14px;font-weight:500}
.mk-cats span:first-child{background:var(--tx);color:var(--bg);border-color:var(--tx)}
.mk-prod .mk-img{aspect-ratio:1;margin-bottom:14px}
.mk-prod .tag{position:absolute;left:12px;top:12px;z-index:1;background:var(--a);color:var(--on-a);font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px}
.mk-prod h4{font-size:15px;font-weight:600}
.mk-prod .meta{display:flex;justify-content:space-between;align-items:center;margin-top:6px}
.mk-prod .price{font-weight:800;font-size:16px;color:var(--p)}
.mk-prod .old{font-size:12px;color:var(--muted);text-decoration:line-through;margin-left:6px;font-weight:500}
.mk-stars{color:var(--a);font-size:13px;letter-spacing:1px}
.mk-stars span{color:var(--muted);letter-spacing:0;margin-left:4px}
.mk-add{width:36px;height:36px;border-radius:var(--rb);background:var(--p);color:var(--on-p);display:grid;place-items:center}
.mk-add svg{width:16px;height:16px}
.mk-news{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center;padding:44px;border-radius:calc(var(--r) + 6px);background:var(--tx);color:var(--bg)}
.mk-news h3{font-size:28px}
.mk-news p{opacity:.7;margin-top:8px}
/* blog */
.mk-feat{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:center;padding:56px 0}
.mk-feat .mk-img{aspect-ratio:1.45}
.mk-feat h1{font-size:44px;margin:16px 0}
.mk-author{display:flex;align-items:center;gap:12px;margin-top:22px;font-size:14px}
.mk-author i{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--a),var(--s));display:block}
.mk-author b{display:block}
.mk-blog{display:grid;grid-template-columns:1fr 300px;gap:40px;padding-bottom:70px}
.mk-post .mk-img{aspect-ratio:1.6;margin-bottom:16px}
.mk-post h3{font-size:19px;margin:10px 0 8px}
.mk-post p{color:var(--muted);font-size:14px}
.mk-post .by{font-size:12px;color:var(--muted);margin-top:12px}
.mk-side{display:grid;gap:20px;align-content:start}
.mk-side h4{font-size:15px;margin-bottom:14px}
.mk-list{list-style:none;display:grid;gap:10px;font-size:14px}
.mk-list li{display:flex;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid var(--border)}
.mk-list li span{color:var(--muted)}
.mk-tagcloud{display:flex;flex-wrap:wrap;gap:8px}
/* portfolio */
.mk-port{padding:90px 0 60px}
.mk-port .hey{display:flex;align-items:center;gap:14px;margin-bottom:26px}
.mk-port .hey i{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--a));display:block;box-shadow:0 0 0 6px var(--p-soft)}
.mk-port h1{font-size:68px;font-weight:800;max-width:900px;letter-spacing:-.035em}
.mk-port h1 em{font-style:normal;background:linear-gradient(90deg,var(--p),var(--a));-webkit-background-clip:text;background-clip:text;color:transparent}
.mk-port p.lead{font-size:19px;color:var(--muted);max-width:620px;margin-top:22px}
.mk-work .mk-img{aspect-ratio:1.35;margin-bottom:16px}
.mk-work .row{display:flex;justify-content:space-between;align-items:center}
.mk-work h3{font-size:20px}
.mk-work .yr{font-size:13px;color:var(--muted)}
.mk-svc{display:flex;gap:18px;align-items:flex-start;padding:26px 0;border-bottom:1px solid var(--border)}
.mk-svc .n{font-size:14px;font-weight:700;color:var(--p);min-width:40px}
.mk-svc h3{font-size:24px;flex:1}
.mk-svc p{flex:1.3;color:var(--muted);font-size:15px}
/* saas app */
.mk-app{display:grid;grid-template-columns:230px 1fr;min-height:760px}
.mk-aside{background:var(--surface);border-right:1px solid var(--border);padding:22px 16px;display:flex;flex-direction:column;gap:24px}
.mk-aside nav{display:grid;gap:4px}
.mk-aside nav a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:calc(var(--r)*.6);font-size:14px;color:var(--muted);font-weight:500}
.mk-aside nav a svg{width:18px;height:18px}
.mk-aside nav a.on{background:var(--p);color:var(--on-p)}
.mk-aside .up{margin-top:auto;padding:16px;border-radius:var(--r);background:var(--p-soft);font-size:13px}
.mk-aside .up b{display:block;margin-bottom:4px}
.mk-amain{padding:26px 30px;display:grid;gap:22px;align-content:start;min-width:0}
.mk-atop{display:flex;justify-content:space-between;align-items:center;gap:16px}
.mk-atop h2{font-size:26px}
.mk-kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.mk-kpi .mk-card{padding:18px}
.mk-kpi span{font-size:13px;color:var(--muted)}
.mk-kpi strong{display:block;font-size:26px;margin:6px 0 4px;letter-spacing:-.02em}
.mk-kpi em{font-style:normal;font-size:12px;font-weight:700;color:var(--s)}
.mk-kpi em.dn{color:var(--a)}
.mk-charts{display:grid;grid-template-columns:1.7fr 1fr;gap:16px}
.mk-bars{display:flex;align-items:flex-end;gap:12px;height:190px;padding-top:10px}
.mk-bars div{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:8px;height:100%;font-size:11px;color:var(--muted)}
.mk-bars i{display:block;width:100%;border-radius:calc(var(--r)*.4) calc(var(--r)*.4) 3px 3px;background:var(--p-soft)}
.mk-bars div.hi i{background:var(--p)}
.mk-donut{width:150px;height:150px;border-radius:50%;margin:8px auto 18px;background:conic-gradient(var(--p) 0 46%,var(--s) 0 74%,var(--a) 0 90%,var(--surface-2) 0);display:grid;place-items:center}
.mk-donut::after{content:"";width:96px;height:96px;border-radius:50%;background:var(--card)}
.mk-legend{display:grid;gap:8px;font-size:13px}
.mk-legend div{display:flex;align-items:center;gap:8px}
.mk-legend i{width:10px;height:10px;border-radius:3px;display:block}
.mk-legend b{margin-left:auto}
.mk-table{width:100%;border-collapse:collapse;font-size:14px}
.mk-table th{text-align:left;font-size:12px;color:var(--muted);font-weight:600;padding:10px 12px;border-bottom:1px solid var(--border)}
.mk-table td{padding:13px 12px;border-bottom:1px solid var(--border)}
.mk-table td .u{display:flex;align-items:center;gap:10px}
.mk-table td .u i{width:30px;height:30px;border-radius:50%;display:block;background:linear-gradient(135deg,var(--s),var(--p))}
.mk-st{font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px}
.mk-st.ok{background:var(--s-soft);color:var(--tx)}
.mk-st.pd{background:var(--a-soft);color:var(--tx)}
.proto-main{padding:54px 32px 76px;min-height:620px}
.proto-heading{max-width:680px;margin:0 auto 32px;text-align:center}
.proto-heading h1{font-size:42px;margin:12px 0}
.proto-heading p{color:var(--muted)}
.proto-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.proto-detail-grid{grid-template-columns:1fr 1fr;align-items:center}
.proto-card{padding:18px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);display:grid;gap:12px}
.proto-art{height:150px;border-radius:var(--r);background:linear-gradient(135deg,var(--p-soft),var(--s-soft),var(--a-soft));display:grid;place-items:center;color:var(--p);font-size:38px;font-weight:800}
.proto-card p,.proto-copy{color:var(--muted)}
.proto-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 0;border-bottom:1px solid var(--border)}
.proto-summary{max-width:650px;margin:24px auto;padding:24px;border:1px solid var(--border);border-radius:var(--r);background:var(--card)}
.proto-form{display:grid;gap:14px;margin-top:20px}
.proto-form label{display:grid;gap:6px;font-size:13px;font-weight:600}
.proto-form input{padding:12px;border:1px solid var(--border);border-radius:var(--r);background:var(--bg)}
.prototype-pages{display:flex;gap:8px;overflow:auto;padding:4px 0;}
.prototype-pages button{flex:none;border:1px solid var(--line);border-radius:999px;padding:8px 14px;background:var(--card);color:var(--ink-2);font-weight:700;font-size:13px;cursor:pointer}
.prototype-pages button.active{background:var(--brand);border-color:var(--brand);color:#fff}
@container (max-width:900px){
  .mk-links,.mk-search{display:none}
  .mk-hero,.mk-banner,.mk-feat,.mk-blog,.mk-news,.mk-charts{grid-template-columns:1fr}
  .mk-hero{padding:56px 0;gap:40px}
  .mk-g3,.mk-g4,.mk-kpi{grid-template-columns:repeat(2,1fr)}
  .proto-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mk-app{grid-template-columns:1fr}
  .mk-aside{display:none}
  .mk-price.hot{transform:none}
  .mk-port h1{font-size:52px}
  .mk-svc{flex-wrap:wrap}
  .mk-svc p{flex-basis:100%;padding-left:58px}
}
@container (max-width:560px){
  .mk .w{padding:0 18px}
  .mk-nav{padding:14px 18px}
  .mk-navr .mk-btn.ghost{display:none}
  .mk-g2,.mk-g3,.mk-g4{grid-template-columns:1fr}
  .mk-kpi{grid-template-columns:1fr 1fr;gap:10px}
  .mk-hero h1{font-size:36px}
  .mk-banner{padding:28px}
  .mk-banner h1,.mk-feat h1{font-size:32px}
  .mk-head h2,.mk-cta h2{font-size:28px}
  .mk-port h1{font-size:38px}
  .mk-sec{padding:56px 0}
  .mk-cta{padding:38px 22px}
  .mk-news{padding:28px}
  .mk-float.f1{left:8px}.mk-float.f2{right:8px}
  .mk-amain{padding:18px}
  .mk-table th:nth-child(3),.mk-table td:nth-child(3){display:none}
  .proto-main{padding:38px 18px 54px;min-height:520px}
  .proto-heading h1{font-size:32px}
  .proto-grid{grid-template-columns:1fr}
  .proto-detail-grid{grid-template-columns:1fr}
  .mk-foot{padding:30px 18px}
}
`;

/* ---------- Shared fragments ---------- */
const mkIcon = n => icon(n);
const esc = s => escapeHtml(s);

function mkBrandLogo(brand, logo) {
  const validLogo = typeof logo === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(logo);
  return `<a class="mk-logo">${validLogo ? `<img src="${esc(logo)}" alt="">` : '<i></i>'}${esc(brand)}</a>`;
}
function mkNav(brand, links, right, logo) {
  return `<header class="mk-nav">${mkBrandLogo(brand, logo)}
  <nav class="mk-links">${links.map(l => `<a>${l}</a>`).join('')}</nav>
  <div class="mk-navr">${right}</div></header>`;
}
function mkFoot(brand, logo) {
  return `<footer class="mk-foot">${mkBrandLogo(brand, logo)}
  <nav><a>Tentang</a><a>Karier</a><a>Bantuan</a><a>Privasi</a></nav>
  <span>© ${new Date().getFullYear()} ${esc(brand)}. Hak cipta dilindungi.</span></footer>`;
}
window.UIGenesisPrototypeUtils = {
  esc,
  products: [['Produk pilihan', 'Rp125.000'], ['Favorit pelanggan', 'Rp189.000'], ['Koleksi terbaru', 'Rp249.000']],
  go(st, name, label, className = 'mk-btn') {
    const pages = st.application?.pages?.length ? st.application.pages : ['Home'];
    const target = pages.includes(name) ? name : pages[0];
    return `<a href="#" class="${className}" data-proto-goto="${esc(target)}">${label}</a>`;
  },
  frame(st, content) {
    const brand = st.brand || 'Aplikasi Baru';
    const pages = st.application?.pages?.length ? st.application.pages : ['Home'];
    const cart = pages.includes('Cart') ? this.go(st, 'Cart', 'Keranjang', 'mk-btn ghost sm') : '';
    const header = `<header class="mk-nav">${mkBrandLogo(brand, st.logo)}<nav class="mk-links">${pages.slice(0, 5).map(page => `<a href="#" data-proto-goto="${esc(page)}">${esc(page)}</a>`).join('')}</nav><div class="mk-navr">${cart}</div></header>`;
    return `${header}${content}${mkFoot(brand, st.logo)}`;
  }
};

/* ---------- Templates ---------- */
const TEMPLATES = {
  landing: {
    label: 'Landing Page', icon: 'rocket', url: 'beranda',
    render: (b, st = {}) => `
${mkNav(b, ['Produk', 'Fitur', 'Harga', 'Blog'], '<a class="mk-btn ghost sm">Masuk</a><a class="mk-btn sm">Mulai Gratis</a>', st.logo)}
<section class="w mk-hero">
  <div>
    <span class="mk-badge"><i></i>Versi 2.0 telah hadir</span>
    <h1>Bangun bisnis lebih cepat bersama <em>${esc(b)}</em></h1>
    <p class="lead">Platform all-in-one untuk mengelola tim, proyek, dan pelanggan Anda — semua dalam satu tempat yang rapi dan intuitif.</p>
    <div class="mk-row"><a class="mk-btn">Coba Gratis 14 Hari</a><a class="mk-btn ghost">Lihat Demo</a></div>
    <div class="mk-stats"><div><strong>12rb+</strong><span>Tim aktif</span></div><div><strong>98%</strong><span>Kepuasan</span></div><div><strong>4.9/5</strong><span>Rating</span></div></div>
  </div>
  <div class="mk-visual">
    <div class="mk-img"></div>
    <div class="mk-float f1"><div class="dot">${mkIcon('chart')}</div><div><b>+128%</b>Pertumbuhan</div></div>
    <div class="mk-float f2"><div class="dot" style="background:var(--s);color:var(--on-s)">${mkIcon('user')}</div><div><b>2.4rb</b>Pengguna baru</div></div>
  </div>
</section>
<div class="w"><div class="mk-logos"><span>Arunika</span><span>Bumiraya</span><span>Kalpa</span><span>Nirmala</span><span>Sagara</span></div></div>
<section class="mk-sec"><div class="w">
  <div class="mk-head"><span class="eb">Fitur</span><h2>Semua yang Anda butuhkan</h2><p>Alat yang dirancang untuk membantu tim bekerja lebih fokus dan produktif.</p></div>
  <div class="mk-g3">
    <div class="mk-card"><div class="mk-ic">${mkIcon('sparkles')}</div><h3>Otomasi Cerdas</h3><p>Hemat waktu dengan alur kerja otomatis yang menyesuaikan kebiasaan tim.</p></div>
    <div class="mk-card"><div class="mk-ic s">${mkIcon('chart')}</div><h3>Analitik Real-time</h3><p>Pantau performa bisnis lewat dashboard yang selalu terbarui.</p></div>
    <div class="mk-card"><div class="mk-ic a">${mkIcon('lock')}</div><h3>Keamanan Terjamin</h3><p>Enkripsi end-to-end dan kontrol akses berlapis untuk data Anda.</p></div>
  </div>
</div></section>
<section class="mk-sec alt"><div class="w">
  <div class="mk-head"><span class="eb">Harga</span><h2>Paket yang transparan</h2><p>Mulai gratis, upgrade kapan saja sesuai kebutuhan.</p></div>
  <div class="mk-g3">
    <div class="mk-card mk-price"><div><h3>Starter</h3><p class="mk-muted">Untuk individu</p></div><div class="amt">Rp0<small>/bulan</small></div><ul><li>3 proyek</li><li>1 GB penyimpanan</li><li>Dukungan email</li></ul><a class="mk-btn ghost">Pilih Paket</a></div>
    <div class="mk-card mk-price hot"><div><h3>Pro</h3><p>Paling populer</p></div><div class="amt">Rp149rb<small>/bulan</small></div><ul><li>Proyek tanpa batas</li><li>50 GB penyimpanan</li><li>Analitik lanjutan</li></ul><a class="mk-btn">Pilih Paket</a></div>
    <div class="mk-card mk-price"><div><h3>Bisnis</h3><p class="mk-muted">Untuk perusahaan</p></div><div class="amt">Rp499rb<small>/bulan</small></div><ul><li>SSO &amp; audit log</li><li>Penyimpanan 1 TB</li><li>Manajer akun</li></ul><a class="mk-btn ghost">Hubungi Sales</a></div>
  </div>
</div></section>
<section class="mk-sec"><div class="w"><div class="mk-cta"><h2>Siap memulai perjalanan Anda?</h2><p>Bergabung dengan ribuan tim yang sudah tumbuh bersama ${esc(b)}.</p><a class="mk-btn">Daftar Sekarang</a></div></div></section>
${mkFoot(b, st.logo)}`
  },

  ecommerce: {
    label: 'E-Commerce', icon: 'cart', url: 'toko',
    render: (b, st = {}) => {
      const products = [
        ['Kemeja Linen', '289.000', '359.000', 'Baru', ''], ['Sneakers Urban', '649.000', '', '', 'v2'],
        ['Tas Kanvas', '199.000', '249.000', '-20%', 'v3'], ['Jam Minimalis', '899.000', '', '', 'v4'],
        ['Hoodie Basic', '329.000', '', 'Laris', 'v2'], ['Topi Bucket', '119.000', '', '', ''],
        ['Kacamata Retro', '259.000', '299.000', '', 'v4'], ['Tumbler Steel', '149.000', '', 'Baru', 'v3']
      ];
      return `
<div class="mk-promo">Gratis ongkir untuk pembelian di atas Rp250rb — gunakan kode <b>HEMAT25</b></div>
${mkNav(b, ['Pria', 'Wanita', 'Aksesoris', 'Promo'], `<div class="mk-search">${mkIcon('search')}Cari produk…</div><a class="mk-iconbtn">${mkIcon('user')}</a><a class="mk-iconbtn">${mkIcon('cart')}<sup>3</sup></a>`, st.logo)}
<div class="w">
  <section class="mk-banner">
    <div><span class="mk-badge"><i></i>Koleksi Musim Ini</span><h1>Gaya baru, cerita baru.</h1><p class="mk-muted">Diskon hingga 40% untuk koleksi pilihan. Hanya minggu ini.</p><div class="mk-row" style="margin-top:24px"><a class="mk-btn">Belanja Sekarang</a><a class="mk-btn ghost">Lihat Katalog</a></div></div>
    <div class="mk-img"></div>
  </section>
  <div class="mk-cats"><span>Semua</span><span>Atasan</span><span>Sepatu</span><span>Tas</span><span>Jam Tangan</span><span>Aksesoris</span></div>
  <div class="mk-g4">${products.map(([n, p, o, t, v]) => `
    <div class="mk-prod"><div class="mk-img ${v}">${t ? `<span class="tag">${t}</span>` : ''}</div><h4>${n}</h4>
    <div class="mk-stars">★★★★★<span>(${(n.length * 7) % 90 + 12})</span></div>
    <div class="meta"><div><span class="price">Rp${p}</span>${o ? `<span class="old">Rp${o}</span>` : ''}</div><a class="mk-add">${mkIcon('plus')}</a></div></div>`).join('')}
  </div>
  <section class="mk-sec" style="padding-bottom:70px"><div class="mk-news"><div><h3>Dapatkan diskon 15%</h3><p>Langganan newsletter untuk promo eksklusif dan rilis terbaru.</p></div><div class="mk-row"><input class="mk-input" placeholder="Alamat email Anda"><a class="mk-btn acc">Langganan</a></div></div></section>
</div>
${mkFoot(b, st.logo)}`;
    }
  },

  blog: {
    label: 'Blog', icon: 'pen', url: 'blog',
    render: (b, st = {}) => {
      const posts = [
        ['Desain', '7 Prinsip Tipografi untuk Antarmuka Modern', 'Panduan praktis memilih dan memadukan huruf agar konten mudah dibaca.', ''],
        ['Produk', 'Cara Menyusun Roadmap yang Disukai Tim', 'Pelajari teknik prioritas yang membuat semua orang selaras.', 'v2'],
        ['Kode', 'CSS Container Query: Kapan Harus Dipakai?', 'Membuat komponen benar-benar responsif tanpa media query.', 'v3'],
        ['Karier', 'Membangun Portofolio Desainer yang Menonjol', 'Tips dari perekrut tentang apa yang benar-benar mereka cari.', 'v4']
      ];
      return `
${mkNav(b, ['Terbaru', 'Desain', 'Teknologi', 'Karier'], '<a class="mk-btn sm">Berlangganan</a>', st.logo)}
<div class="w">
  <section class="mk-feat">
    <div class="mk-img"></div>
    <div><span class="mk-chip">Pilihan Editor</span><h1>Masa depan desain: kolaborasi manusia dan AI</h1><p class="mk-muted">Bagaimana alat generatif mengubah cara kita mengeksplorasi ide, tanpa menggantikan intuisi seorang desainer.</p>
    <div class="mk-author"><i></i><div><b>Rani Prameswari</b><span class="mk-muted">9 Nov 2026 · 8 menit baca</span></div></div></div>
  </section>
  <div class="mk-blog">
    <div class="mk-g2">${posts.map(([c, t, d, v]) => `<article class="mk-post"><div class="mk-img ${v}"></div><span class="mk-chip">${c}</span><h3>${t}</h3><p>${d}</p><div class="by">Oleh Tim ${esc(b)} · 5 menit baca</div></article>`).join('')}</div>
    <aside class="mk-side">
      <div class="mk-card"><h4>Kategori</h4><ul class="mk-list"><li>Desain <span>24</span></li><li>Teknologi <span>18</span></li><li>Produk <span>12</span></li><li>Karier <span>9</span></li></ul></div>
      <div class="mk-card"><h4>Tag Populer</h4><div class="mk-tagcloud"><span class="mk-chip">UI</span><span class="mk-chip">UX</span><span class="mk-chip">Figma</span><span class="mk-chip">CSS</span><span class="mk-chip">Riset</span><span class="mk-chip">AI</span></div></div>
      <div class="mk-card" style="background:var(--p);color:var(--on-p);border-color:var(--p)"><h4>Newsletter Mingguan</h4><p style="color:inherit;opacity:.85;margin-bottom:14px">Artikel terbaik langsung ke inbox Anda.</p><a class="mk-btn" style="background:var(--on-p);color:var(--p);border-color:var(--on-p);width:100%">Gabung Gratis</a></div>
    </aside>
  </div>
</div>
${mkFoot(b, st.logo)}`;
    }
  },

  portfolio: {
    label: 'Portofolio', icon: 'user', url: 'karya',
    render: (b, st = {}) => `
${mkNav(b, ['Karya', 'Layanan', 'Tentang', 'Kontak'], '<a class="mk-btn sm">Hubungi Saya</a>', st.logo)}
<section class="w mk-port">
  <div class="hey"><i></i><div><b>Halo, saya ${esc(b)} 👋</b><div class="mk-muted">Product Designer · Bandung, Indonesia</div></div></div>
  <h1>Saya merancang <em>pengalaman digital</em> yang sederhana dan bermakna.</h1>
  <p class="lead">8 tahun membantu startup dan brand membangun produk yang dicintai pengguna — dari riset hingga peluncuran.</p>
  <div class="mk-row" style="margin-top:32px"><a class="mk-btn">Lihat Karya</a><a class="mk-btn ghost">Unduh CV</a><span class="mk-chip">● Tersedia untuk proyek baru</span></div>
</section>
<section class="w" style="padding-bottom:40px"><div class="mk-g2">
  <div class="mk-work"><div class="mk-img"></div><div class="row"><h3>Aplikasi Bank Digital</h3><span class="yr">2026</span></div><p class="mk-muted">Riset UX, Desain UI</p></div>
  <div class="mk-work"><div class="mk-img v2"></div><div class="row"><h3>Platform Edukasi</h3><span class="yr">2025</span></div><p class="mk-muted">Design System</p></div>
  <div class="mk-work"><div class="mk-img v3"></div><div class="row"><h3>Brand Kopi Lokal</h3><span class="yr">2025</span></div><p class="mk-muted">Branding, Website</p></div>
  <div class="mk-work"><div class="mk-img v4"></div><div class="row"><h3>Dashboard Logistik</h3><span class="yr">2024</span></div><p class="mk-muted">Product Design</p></div>
</div></section>
<section class="mk-sec"><div class="w">
  <div class="mk-svc"><span class="n">01</span><h3>Desain Produk</h3><p>Merancang alur dan antarmuka aplikasi web &amp; mobile yang berpusat pada pengguna.</p></div>
  <div class="mk-svc"><span class="n">02</span><h3>Design System</h3><p>Membangun komponen dan pedoman agar tim bisa bergerak cepat dan konsisten.</p></div>
  <div class="mk-svc"><span class="n">03</span><h3>Branding &amp; Web</h3><p>Identitas visual dan website yang menyampaikan cerita brand dengan jelas.</p></div>
</div></section>
<section class="w" style="padding-bottom:80px"><div class="mk-cta"><h2>Punya ide proyek? Mari ngobrol.</h2><p>Saya biasanya membalas dalam 24 jam.</p><a class="mk-btn">halo@${esc(b.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'studio')}.id</a></div></section>
${mkFoot(b, st.logo)}`
  },

  saas: {
    label: 'Dashboard App', icon: 'layout', url: 'app/dashboard',
    render: (b, st = {}) => {
      const bars = [42, 58, 46, 72, 64, 88, 76, 94, 70, 82, 60, 78];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const rows = [['Andi Wijaya', 'Paket Pro', 'Rp149.000', 'ok', 'Lunas'], ['Siti Rahma', 'Paket Bisnis', 'Rp499.000', 'ok', 'Lunas'], ['Budi Santoso', 'Paket Pro', 'Rp149.000', 'pd', 'Tertunda'], ['Dewi Lestari', 'Paket Starter', 'Rp0', 'ok', 'Aktif']];
      return `
<div class="mk-app">
  <aside class="mk-aside">${mkBrandLogo(b, st.logo)}
    <nav><a class="on">${mkIcon('home')}Ringkasan</a><a>${mkIcon('chart')}Analitik</a><a>${mkIcon('user')}Pelanggan</a><a>${mkIcon('folder')}Proyek</a><a>${mkIcon('mail')}Pesan</a><a>${mkIcon('gear')}Pengaturan</a></nav>
    <div class="up"><b>Upgrade ke Pro</b><span class="mk-muted">Buka semua fitur analitik.</span><div style="margin-top:12px"><a class="mk-btn sm">Upgrade</a></div></div>
  </aside>
  <main class="mk-amain">
    <div class="mk-atop"><div><h2>Selamat pagi, Rani 👋</h2><span class="mk-muted">Berikut ringkasan performa bisnis Anda hari ini.</span></div><div class="mk-row"><a class="mk-iconbtn">${mkIcon('bell')}<sup>2</sup></a><a class="mk-btn sm">${mkIcon('plus')}Laporan</a></div></div>
    <div class="mk-kpi">
      <div class="mk-card"><span>Pendapatan</span><strong>Rp84,2jt</strong><em>▲ 12,4%</em></div>
      <div class="mk-card"><span>Pengguna Aktif</span><strong>8.429</strong><em>▲ 8,1%</em></div>
      <div class="mk-card"><span>Konversi</span><strong>4,62%</strong><em class="dn">▼ 0,8%</em></div>
      <div class="mk-card"><span>Tiket Terbuka</span><strong>23</strong><em>▲ 3 baru</em></div>
    </div>
    <div class="mk-charts">
      <div class="mk-card"><div class="mk-atop"><h3>Pendapatan Bulanan</h3><span class="mk-chip">2026</span></div><div class="mk-bars">${bars.map((v, i) => `<div class="${i === 7 ? 'hi' : ''}"><i style="height:${v}%"></i>${months[i]}</div>`).join('')}</div></div>
      <div class="mk-card"><h3>Sumber Trafik</h3><div class="mk-donut"></div><div class="mk-legend"><div><i style="background:var(--p)"></i>Organik<b>46%</b></div><div><i style="background:var(--s)"></i>Sosial<b>28%</b></div><div><i style="background:var(--a)"></i>Iklan<b>16%</b></div></div></div>
    </div>
    <div class="mk-card"><div class="mk-atop" style="margin-bottom:8px"><h3>Transaksi Terbaru</h3><a class="mk-btn ghost sm">Lihat Semua</a></div>
      <table class="mk-table"><thead><tr><th>Pelanggan</th><th>Paket</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td><div class="u"><i></i>${r[0]}</div></td><td>${r[1]}</td><td>${r[2]}</td><td><span class="mk-st ${r[3]}">${r[4]}</span></td></tr>`).join('')}
      </tbody></table></div>
  </main>
</div>`;
    }
  }
};

/* ---------- Dispatcher prototype: isi tiap layar ada di file tersendiri ---------- */
function renderPrototypePage(st, pageName) {
  const pages = window.UIGenesisPrototypePages || {};
  const renderPage = pages[pageName] || pages.Generic || pages.Home;
  return renderPage ? renderPage(st, window.UIGenesisPrototypeUtils, pageName) : '';
}

/* ---------- Full export ---------- */
function buildMockupHtml(st) {
  const tpl = TEMPLATES[st.type] || TEMPLATES.landing;
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(st.brand)} — ${tpl.label}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${fontHref(st.font)}" rel="stylesheet">
<!-- Dibuat dengan UIGenesis -->
<style>
html,body{margin:0;background:${st.colors.background}}
${MOCKUP_CSS}
</style>
</head>
<body>
<div class="mk" style="${mockupVars(st)}">
${st.customPages?.[st.currentPage] || st.customHtml || (st.application ? renderPrototypePage(st, st.currentPage || st.application.pages?.[0] || 'Home') : tpl.render(st.brand, st))}
</div>
</body>
</html>`;
}

function paletteCss(c) {
  return `:root {
  --color-primary: ${c.primary};
  --color-secondary: ${c.secondary};
  --color-accent: ${c.accent};
  --color-background: ${c.background};
  --color-text: ${c.text};
  --color-on-primary: ${Color.on(c.primary)};
  --color-muted: ${Color.mix(c.text, c.background, 0.62)};
  --color-border: ${Color.mix(c.text, c.background, 0.12)};
}`;
}
function paletteTailwind(c) {
  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${c.primary}',
        secondary: '${c.secondary}',
        accent: '${c.accent}',
        background: '${c.background}',
        foreground: '${c.text}',
      },
    },
  },
};`;
}
function paletteJson(c) { return JSON.stringify(c, null, 2); }
