import { CAPITULOS } from './conteudo.js';
import { url, chapterUrl, escapeHtml as e, renderShared, bindDraw, renderError } from './site.js';

// Dedicated text-free illustrations; originals remain available at their existing paths.
const edited = new Set([1, 2, 4, 6, 7, 9, 10]);
const crops = {3: '0 400 1200 660', 5: '0 450 1200 550', 8: '0 550 1200 415', 11: '0 390 1200 700'};
function renderArt(card) {
  if (edited.has(card.id)) return `<img src="${url(`assets/imagens/galeria/cap${card.id}.webp`)}" alt="" width="960" height="540" loading="lazy" decoding="async">`;
  return `<svg viewBox="${crops[card.id]}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><image href="${url(card.imagem)}" width="1200" height="1800"></image></svg>`;
}
function renderCards() {
  document.querySelector('#lista-capitulos').innerHTML = CAPITULOS.map(card => `<a class="chapter-card" href="${chapterUrl(card.id)}"><div class="card-art">${renderArt(card)}</div><div class="card-copy"><h3>${e(card.titulo)}</h3><p>${e(card.chamada)}</p></div></a>`).join('');
}
try {
  renderShared(); bindDraw(); renderCards();
} catch (error) { renderError(error); }
