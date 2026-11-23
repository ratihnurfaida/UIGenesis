/* Prototype screen: Cart */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Cart = (state, ui) => ui.frame(state, `
  <section class="proto-main"><div class="proto-heading"><span class="mk-badge"><i></i>Pesanan Anda</span>
    <h1>Keranjang belanja</h1><p>Periksa kembali pilihan sebelum melanjutkan.</p></div>
    <div class="proto-summary">
      <div class="proto-row"><b>Produk unggulan ${ui.esc(state.brand)}</b><span>Rp189.000</span></div>
      <div class="proto-row"><span>Subtotal</span><b>Rp189.000</b></div>
      <div class="proto-row"><span>Pengiriman</span><span>Dihitung saat checkout</span></div>
      <div style="display:flex;justify-content:flex-end;margin-top:20px">${ui.go(state, 'Checkout', 'Lanjut ke Checkout')}</div>
    </div>
  </section>`);
