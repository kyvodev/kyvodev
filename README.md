# Kyvo Soluções Digitais — site

Site estático (HTML + CSS + JS puro, sem build), publicado na Cloudflare Pages a partir da pasta `site/`.

- No ar: https://kyvo.dev.br
- Repositório: https://github.com/kyvodev/kyvodev
- Cada push na branch `main` publica automaticamente.

## Rodar localmente

```bash
python -m http.server 8091 -d site
```

Abra http://localhost:8091

## Estrutura

- `site/index.html` — página única: topo, diferencial, portfólio, serviços, como trabalhamos, sobre e contato
- `site/css/style.css` — estilos (paleta do manual de marca em `:root`)
- `site/js/main.js` — menu mobile, animações e formulário
- `site/assets/img/` — favicon, avatar e imagem de compartilhamento

O K é desenhado em SVG no próprio HTML (`<symbol id="k">`), seguindo o grid 100×100 do manual: haste de 14 com cantos rx 3 e o colchete com a mesma espessura e pontas arredondadas. As cores vêm das variáveis `--stem` e `--chev`.

## Portfólio

Cada projeto usa duas imagens em `site/assets/img/portfolio/`:

- `<nome>-desktop.webp` — 960×3000, a página inteira capturada em 1440 px de largura (as primeiras ~5 telas). No hover, a imagem rola de cima para baixo dentro da moldura do navegador.
- `<nome>-mobile.webp` — 390×664, a primeira tela no iPhone 13.

As capturas foram feitas com Playwright usando o Chrome instalado. Para adicionar um projeto, gere as duas imagens nesses tamanhos e copie um bloco `<a class="work">` no HTML (a cor de fundo do card vem de `--tint`).

## Selo "Conheça a Kyvo" (rodapé dos sites de clientes)

`site/selo.js` é publicado em `https://kyvo.dev.br/selo.js`. No rodapé do site do cliente, onde o selo deve aparecer:

```html
<script src="https://kyvo.dev.br/selo.js" async></script>
```

Para escolher o lugar exato (ou usar em mais de um ponto), coloque `<kyvo-selo></kyvo-selo>` e carregue o script em qualquer lugar da página.

- **Cores:** detecta se o fundo do rodapé é claro ou escuro. Com foto ou gradiente de fundo, force com `data-tema="escuro"` ou `data-tema="claro"`.
- **Posição:** `data-alinhar="esquerda"`, `"centro"` (padrão) ou `"direita"`.
- **Comportamento:** quando o rodapé aparece na tela, o selo se abre uma vez com "Gostou do site?" e o K vira seta. Um brilho passa pela borda enquanto ele está visível. Respeita quem desativou animações no sistema.
- **Isolado:** usa Shadow DOM, então o CSS do cliente não mexe no selo (a fonte é herdada do site).
- **Origem dos cliques:** o link leva `utm_source=<domínio do cliente>&utm_medium=selo&utm_campaign=rodape`.

Página de teste com vários rodapés: `/selo/teste.html` (fora dos buscadores).

## Contato

O formulário não tem servidor: ele monta a mensagem e abre o WhatsApp (54 99699-0060) com o texto pronto. Para trocar o número, altere `WHATS` em `site/js/main.js` e os links `wa.me` no HTML.

## Arquivos da marca

Os arquivos originais (manual em PDF, logos em PNG) ficam na raiz, fora de `site/`, e não são publicados.
