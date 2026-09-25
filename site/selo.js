/*!
 * Selo Kyvo — crédito "Conheça a Kyvo" para o rodapé dos sites de clientes.
 *
 * Uso (cole no rodapé, onde o selo deve aparecer):
 *   <script src="https://kyvo.dev.br/selo.js" async></script>
 *
 * Ou, para escolher o lugar exato, coloque o elemento e carregue o script em qualquer ponto:
 *   <kyvo-selo></kyvo-selo>
 *
 * Opções (no <script> ou no <kyvo-selo>):
 *   data-tema="escuro" | "claro" | "cor"   força as cores (padrão: detecta pelo fundo do rodapé;
 *                                            "cor" é para fundos coloridos, como laranja ou verde)
 *   data-alinhar="centro" | "esquerda" | "direita"   (padrão: centro)
 *
 * Fora de um <footer>, o selo vira uma faixa própria, com espaço em cima e embaixo.
 */
(function () {
  if (window.customElements && customElements.get('kyvo-selo')) return;

  var script = document.currentScript;
  var ORIGEM = 'https://kyvo.dev.br/';

  var CSS = [
    ':host{display:block;font-size:15px;line-height:1;-webkit-font-smoothing:antialiased}',
    '.caixa{display:flex;justify-content:center;padding:14px 0}',
    ':host([data-faixa]) .caixa{padding:32px 16px 40px}',
    ':host([data-alinhar="esquerda"]) .caixa{justify-content:flex-start}',
    ':host([data-alinhar="direita"]) .caixa{justify-content:flex-end}',
    'a{--txt:#0B1B33;--mute:rgba(11,27,51,.62);--line:#2454FF;--line-h:#0B1B33;--nome:#2454FF;--stem:#0B1B33;--brilho:rgba(36,84,255,.22);',
    'position:relative;overflow:hidden;isolation:isolate;display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 19px 0 15px;border-radius:999px;border:1px solid var(--line);',
    'color:var(--txt);text-decoration:none;white-space:nowrap;font:inherit;font-family:inherit;letter-spacing:normal;background:transparent;',
    'transition:border-color .3s,background-color .3s}',
    'a.cor{--txt:#fff;--mute:rgba(255,255,255,.82);--line:rgba(255,255,255,.7);--line-h:#fff;--nome:#fff;--stem:#fff;--chev:#0B1B33;--brilho:rgba(255,255,255,.35)}',
    'a.escuro{--txt:#F4F6FB;--mute:rgba(244,246,251,.66);--line:#2454FF;--line-h:#8BA5FF;--nome:#8BA5FF;--stem:#F4F6FB;--brilho:rgba(139,165,255,.45)}',
    'a::after{content:"";position:absolute;z-index:-1;top:0;bottom:0;left:0;width:40%;pointer-events:none;',
    'background:linear-gradient(90deg,transparent,var(--brilho),transparent);transform:translateX(-160%) skewX(-20deg);',
    'animation:brilho 4.5s 1s infinite;animation-play-state:paused}',
    'a.visivel::after{animation-play-state:running}',
    '@keyframes brilho{0%{transform:translateX(-160%) skewX(-20deg)}30%,100%{transform:translateX(360%) skewX(-20deg)}}',
    'a:hover,a:focus-visible{border-color:var(--line-h)}',
    'a:focus-visible{outline:2px solid #2454FF;outline-offset:3px}',
    'svg{width:20px;height:20px;flex:none;overflow:visible}',
    'rect{fill:var(--stem)}',
    'polyline{fill:none;stroke:var(--chev,#2454FF);stroke-width:14;stroke-linecap:round;stroke-linejoin:round;transform-origin:59px 50px;',
    'transition:transform .45s cubic-bezier(.2,.7,.2,1)}',
    'a:hover polyline,a:focus-visible polyline,a.aberto polyline{transform:rotate(180deg) translateX(-14px)}',
    '.tx{display:inline-flex;align-items:baseline}',
    '.gancho{display:inline-block;max-width:0;overflow:hidden;white-space:pre;line-height:1.2;vertical-align:baseline;color:var(--mute);transition:max-width .7s cubic-bezier(.2,.7,.2,1)}',
    'a.aberto .gancho,a:hover .gancho,a:focus-visible .gancho{max-width:200px}',
    'b{font-weight:600;color:var(--nome)}',
    '@media (prefers-reduced-motion:reduce){polyline,.gancho{transition:none}a::after{animation:none;display:none}}',
    '@media print{:host{display:none}}'
  ].join('');

  var K = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
    '<rect x="18" y="12" width="14" height="76" rx="3"/><polyline points="80,15 39,50 80,85"/></svg>';

  // Escolhe o tema pelo fundo atrás do selo, subindo até achar uma cor opaca
  function temaDoFundo(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentElement || (n.getRootNode && n.getRootNode().host)) {
      var m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > 0.5)) {
        var r = +m[0], g = +m[1], b = +m[2];
        var lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        var max = Math.max(r, g, b), sat = max ? (max - Math.min(r, g, b)) / max : 0;
        // fundo colorido de brilho médio (laranja, verde, vermelho…): nem claro nem escuro
        if (sat > 0.45 && lum > 0.22 && lum < 0.72) return 'cor';
        return lum < 0.5 ? 'escuro' : 'claro';
      }
    }
    return 'claro';
  }

  // No próprio site da Kyvo o selo leva ao topo, sem abrir outra aba
  var CASA = /(^|\.)kyvo\.dev\.br$/.test(location.hostname);

  function link() {
    if (CASA) return '#topo';
    var host = location.hostname.replace(/^www\./, '') || 'site';
    return ORIGEM + '?utm_source=' + encodeURIComponent(host) + '&utm_medium=selo&utm_campaign=rodape';
  }

  class Selo extends HTMLElement {
    connectedCallback() { montar.call(this); }
  }

  function montar() {
    if (this.shadowRoot) return;
    // Fora de um rodapé (ex.: script carregado no fim da página), vira uma faixa com respiro
    if (!this.closest('footer') && !this.hasAttribute('data-faixa')) this.setAttribute('data-faixa', '');
    var root = this.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + CSS + '</style><div class="caixa">' +
      '<a href="' + link() + '"' + (CASA ? '' : ' target="_blank" rel="noopener"') + ' aria-label="Site desenvolvido pela Kyvo. Conheça a Kyvo">' +
      K + '<span class="tx" aria-hidden="true"><span class="gancho">Gostou do site?&nbsp;</span><span>Conheça a <b>Kyvo</b></span></span></a></div>';

    var a = root.querySelector('a');
    var tema = this.getAttribute('data-tema');
    var aplicarTema = function (el) {
      var t = tema || temaDoFundo(el);
      a.classList.toggle('escuro', t === 'escuro');
      a.classList.toggle('cor', t === 'cor');
    };
    aplicarTema(this);
    // o CSS do site pode terminar de carregar depois do script
    var self = this;
    window.addEventListener('load', function () { aplicarTema(self); });

    var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window)) { a.classList.add('visivel'); return; }

    var jaAbriu = false;
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        a.classList.toggle('visivel', e.isIntersecting);
        // uma vez por visita: quando o rodapé aparece, puxa conversa e depois recolhe
        if (e.isIntersecting && e.intersectionRatio >= 0.9 && !jaAbriu && !calmo) {
          jaAbriu = true;
          setTimeout(function () { a.classList.add('aberto'); }, 350);
          setTimeout(function () { a.classList.remove('aberto'); }, 5200);
        }
      });
    }, { threshold: [0, 0.9] }).observe(this);
  }

  customElements.define('kyvo-selo', Selo);

  // Sem <kyvo-selo> na página: o selo entra logo depois do <script>
  if (script && !document.querySelector('kyvo-selo')) {
    var el = document.createElement('kyvo-selo');
    ['data-tema', 'data-alinhar'].forEach(function (at) {
      if (script.hasAttribute(at)) el.setAttribute(at, script.getAttribute(at));
    });
    script.parentNode.insertBefore(el, script.nextSibling);
  }
})();
