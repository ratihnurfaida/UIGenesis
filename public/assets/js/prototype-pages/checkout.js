/* Prototype screen: Checkout */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Checkout = (state, ui) => ui.frame(state, `
  <section class="proto-main"><div class="proto-heading"><span class="mk-badge"><i></i>Langkah terakhir</span>
    <h1>Checkout</h1><p>Lengkapi informasi pesanan Anda.</p></div>
    <div class="proto-summary"><h3>Informasi pengiriman</h3>
      <form class="proto-form">
        <label>Nama penerima<input placeholder="Nama lengkap"></label>
        <label>Alamat pengiriman<input placeholder="Alamat lengkap"></label>
        <label>Email atau nomor telepon<input placeholder="Kontak penerima"></label>
        <div class="proto-row"><b>Total pembayaran</b><b>Rp189.000</b></div>
        <button type="button" class="mk-btn" data-proto-action="complete-order">Buat pesanan</button>
      </form>
    </div>
  </section>`);
