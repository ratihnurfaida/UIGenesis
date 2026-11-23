/* Prototype screen: Detail */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Detail = (state, ui) => ui.frame(state, `
  <section class="w proto-main"><div class="proto-grid proto-detail-grid">
    <div class="proto-art" style="height:380px">01</div>
    <div><span class="mk-badge"><i></i>Produk pilihan</span>
      <h1 style="font-size:42px;margin:16px 0">Produk unggulan ${ui.esc(state.brand)}</h1>
      <p class="proto-copy">Deskripsi produk ditampilkan di sini. AI nantinya dapat mengisi detail berdasarkan kategori dan kebutuhan aplikasi.</p>
      <h2 style="margin:22px 0">Rp189.000</h2>
      <div class="mk-row"><button class="mk-btn" data-proto-action="add-cart">Tambah ke keranjang</button>
        ${ui.go(state, 'Product', 'Kembali', 'mk-btn ghost')}</div>
    </div>
  </div></section>`);
