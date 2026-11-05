import { CAPITULOS } from './conteudo.js';
import { url, chapterUrl, icon, escapeHtml as e, renderShared, bindDraw, renderError } from './site.js';
// The original illustration is framed in the browser; the source poster remains intact.
const crops = {1:'0 1000 3072 1620',2:'0 900 3072 1620',3:'0 1000 3072 1620',4:'0 1000 3072 1620',5:'0 1000 3072 1620',6:'0 1000 3072 1620',7:'0 500 3072 1620',8:'0 900 3072 1620',9:'0 950 3072 1620',10:'0 950 3072 1620',11:'0 950 3072 1620'};
function renderCards(filter = 'todos') {
  const cards = CAPITULOS.filter(card => filter === 'todos' || Boolean(card.audio));
  document.querySelector('#lista-capitulos').innerHTML = cards.map(card => `<a class="chapter-card" href="${chapterUrl(card.id)}" aria-label="Card ${card.id}: ${e(card.titulo)}"><div class="card-art"><svg viewBox="${crops[card.id]}" role="img" aria-label="${e(card.alt)}"><image href="${url(card.miniatura)}" width="3072" height="4608" preserveAspectRatio="xMidYMid meet"></image></svg><span class="card-number">${String(card.id).padStart(2,'0')} / 11</span>${card.audio ? `<span class="card-audio">${icon('headphones')} Áudio disponível</span>` : ''}</div><div class="card-copy"><p class="card-theme">${e(card.tema)}</p><h3>${e(card.titulo)}</h3><p>${e(card.chamada)}</p><div class="card-bottom"><span>Explorar este card</span>${icon('diagonal')}</div></div></a>`).join('');
  document.querySelector('#filtro-status').textContent = `${cards.length} cards disponíveis nesta seleção.`;
}
try {
  renderShared(); bindDraw(); renderCards();
  document.querySelectorAll('[data-filtro]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filtro]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    renderCards(button.dataset.filtro);
  }));
} catch (error) { renderError(error); }
