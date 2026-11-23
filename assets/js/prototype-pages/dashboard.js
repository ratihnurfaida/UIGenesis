/* Prototype screen: Dashboard */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Dashboard = (state, ui) => {
  const metrics = [['Pengguna aktif', '1.284'], ['Pesanan', '326'], ['Pendapatan', 'Rp24,8jt']];
  const cards = metrics.map(([label, value]) => `
    <article class="proto-card"><p>${label}</p><h2>${value}</h2><span class="mk-st ok">Naik minggu ini</span></article>`).join('');
  return ui.frame(state, `
    <section class="proto-main"><div class="proto-heading"><span class="mk-badge"><i></i>Ringkasan</span>
      <h1>Dashboard ${ui.esc(state.brand)}</h1><p>Pantau aktivitas aplikasi Anda.</p></div>
      <div class="proto-grid">${cards}</div>
    </section>`);
};
