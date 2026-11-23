/* Prototype screen: Product */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Product = (state, ui) => {
  const cards = ui.products.map(([name, price], index) => `
    <article class="proto-card">
      <div class="proto-art">0${index + 1}</div><h3>${name}</h3><p>${price}</p>
      ${ui.go(state, 'Detail', 'Lihat detail', 'mk-btn sm')}
    </article>`).join('');
  return ui.frame(state, `
    <section class="proto-main">
      <div class="proto-heading"><span class="mk-badge"><i></i>Koleksi ${ui.esc(state.brand)}</span>
        <h1>Temukan produk pilihan</h1><p>Pilih produk untuk melihat detailnya.</p></div>
      <div class="proto-grid">${cards}</div>
    </section>`);
};
