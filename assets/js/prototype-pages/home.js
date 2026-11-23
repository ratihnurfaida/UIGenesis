/* Prototype screen: Home */
window.UIGenesisPrototypePages = window.UIGenesisPrototypePages || {};
window.UIGenesisPrototypePages.Home = (state, ui) => {
  const brand = ui.esc(state.brand || 'Aplikasi Baru');
  const pages = state.application?.pages || ['Home'];
  const catalogPage = pages.find(page => /product|catalog|course|menu|portfolio|feed|explore|workspace|task/i.test(page)) || pages.find(page => page !== 'Home') || 'Home';
  const detailPage = pages.find(page => /detail|project|post|course/i.test(page)) || catalogPage;
  const productCards = ui.products.map(([name, price], index) => `
    <article class="proto-card">
      <div class="proto-art">0${index + 1}</div>
      <h3>${name}</h3><p>${price}</p>
      ${ui.go(state, detailPage, 'Lihat detail', 'mk-btn sm')}
    </article>`).join('');
  const body = `
    <section class="w mk-hero">
      <div><span class="mk-badge"><i></i>Selamat datang</span>
        <h1>Semua kebutuhan Anda, dalam satu tempat bersama <em>${brand}</em></h1>
        <p class="lead">Mulai jelajahi aplikasi dan temukan hal yang Anda butuhkan.</p>
        <div class="mk-row">${ui.go(state, catalogPage, 'Jelajahi aplikasi')}
          ${state.application?.pages?.includes('Profile') ? ui.go(state, 'Profile', 'Lihat profil', 'mk-btn ghost') : ''}</div>
      </div><div class="proto-art" style="height:300px">${brand.slice(0, 1)}</div>
    </section>
    <section class="w" style="padding:20px 32px 64px"><div class="proto-grid">${productCards}</div></section>`;
  return ui.frame(state, body);
};
