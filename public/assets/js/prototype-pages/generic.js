/* Prototype screen: category-specific pages without a dedicated template */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Generic = (state, ui, pageName) => {
  const pages = state.application?.pages || ['Home'];
  const index = pages.indexOf(pageName);
  const nextPage = pages[index + 1];
  const previousPage = pages[index - 1];
  const heading = ui.esc(pageName || 'Halaman aplikasi');
  const category = ui.esc(state.application?.category || 'commerce');
  const features = state.application?.features || [];
  const featureCards = (features.length ? features.slice(0, 3) : ['Konten utama', 'Aktivitas terbaru', 'Informasi']).map((feature, i) => `
    <article class="proto-card"><div class="proto-art">0${i + 1}</div><h3>${ui.esc(feature)}</h3>
      <p>Bagian ${ui.esc(pageName)} untuk aplikasi ${category}.</p>
      ${nextPage ? ui.go(state, nextPage, `Buka ${ui.esc(nextPage)}`, 'mk-btn sm') : ''}
    </article>`).join('');
  const body = `
    <section class="proto-main">
      <div class="proto-heading"><span class="mk-badge"><i></i>${category}</span>
        <h1>${heading}</h1><p>Halaman ${heading} untuk ${ui.esc(state.brand || 'Aplikasi Baru')}.</p></div>
      <div class="proto-grid">${featureCards}</div>
      <div class="mk-row" style="justify-content:center;margin-top:28px">
        ${previousPage ? ui.go(state, previousPage, `Kembali ke ${ui.esc(previousPage)}`, 'mk-btn ghost') : ''}
        ${nextPage ? ui.go(state, nextPage, `Lanjut ke ${ui.esc(nextPage)}`) : ''}
      </div>
    </section>`;
  return ui.frame(state, body);
};
