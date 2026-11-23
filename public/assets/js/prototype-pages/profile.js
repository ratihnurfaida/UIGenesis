/* Prototype screen: Profile */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Profile = (state, ui) => ui.frame(state, `
  <section class="proto-main"><div class="proto-heading"><span class="mk-badge"><i></i>Akun ${ui.esc(state.brand)}</span>
    <h1>Profil pengguna</h1><p>Kelola informasi akun dan aktivitas Anda.</p></div>
    <div class="proto-summary">
      <div class="proto-row"><b>Nama</b><span>Pengguna ${ui.esc(state.brand)}</span></div>
      <div class="proto-row"><b>Email</b><span>pengguna@email.com</span></div>
      <div class="proto-row"><b>Pesanan</b><span>Belum ada pesanan</span></div>
    </div>
  </section>`);
