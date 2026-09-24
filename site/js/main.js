document.documentElement.classList.remove('no-js');
(function () {
  var WHATS = '5554996990060';

  // Cabeçalho com fundo ao rolar
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 20); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  var menu = document.querySelector('.menu');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    menu.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    if (open) header.classList.add('is-scrolled'); else onScroll();
  }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Animação de entrada
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Formulário → mensagem pronta no WhatsApp
  var form = document.getElementById('form');
  var err = document.getElementById('form-err');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var nome = (d.get('nome') || '').trim();
    if (!nome) { err.textContent = 'Coloca teu nome pra gente saber com quem está falando.'; form.nome.focus(); return; }
    err.textContent = '';
    var empresa = (d.get('empresa') || '').trim();
    var servicos = d.getAll('servico');
    var msg = (d.get('mensagem') || '').trim();

    var txt = 'Olá, Kyvo! Sou ' + nome + (empresa ? ', da ' + empresa : '') + '.';
    if (servicos.length) txt += '\nTenho interesse em: ' + servicos.join(', ') + '.';
    if (msg) txt += '\n\n' + msg;

    window.open('https://wa.me/' + WHATS + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  });

  // Bolinha "Visitar" seguindo o mouse nos projetos
  var cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.work__stage').forEach(function (st) {
      st.addEventListener('mouseenter', function () {
        cursor.textContent = st.closest('[data-case]') ? 'Ver projeto' : 'Visitar ↗';
        cursor.classList.add('is-on');
      });
      st.addEventListener('mouseleave', function () { cursor.classList.remove('is-on'); });
    });
    window.addEventListener('mousemove', function (e) {
      cursor.style.setProperty('--x', e.clientX + 'px');
      cursor.style.setProperty('--y', e.clientY + 'px');
    }, { passive: true });
  }

  // Projetos que abrem um case em vez de um link
  var lastOpener = null;
  function openCase(id, opener) {
    var dlg = document.getElementById(id);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    lastOpener = opener || null;
    if (cursor) cursor.classList.remove('is-on');
    dlg.showModal();
    dlg.scrollTop = 0;
    document.body.classList.add('has-case');
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  }
  document.querySelectorAll('[data-case]').forEach(function (btn) {
    btn.addEventListener('click', function () { openCase(btn.getAttribute('data-case'), btn); });
  });
  document.querySelectorAll('dialog.case').forEach(function (dlg) {
    dlg.addEventListener('close', function () {
      document.body.classList.remove('has-case');
      if (location.hash === '#' + dlg.id) history.replaceState(null, '', location.pathname + location.search);
      if (lastOpener && !dlg.dataset.goingTo) lastOpener.focus();
      delete dlg.dataset.goingTo;
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) { dlg.close(); return; }
      var c = e.target.closest('[data-close]');
      if (!c) return;
      var href = c.getAttribute('href');
      if (href) { e.preventDefault(); dlg.dataset.goingTo = href; dlg.close(); document.querySelector(href).scrollIntoView(); }
      else dlg.close();
    });
  });
  function caseFromHash() {
    var dlg = /^#case-/.test(location.hash) && document.getElementById(location.hash.slice(1));
    if (dlg && !dlg.open) openCase(dlg.id);
  }
  caseFromHash();
  window.addEventListener('hashchange', caseFromHash);

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
