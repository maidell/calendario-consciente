export const ROOT = new URL('../../', import.meta.url);
export const url = (path = '') => new URL(path, ROOT).href;
export const chapterUrl = id => url(`c${Number(id)}/index.html`);
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const paths = {
  shuffle:'<path d="m18 3 3 3-3 3M18 15l3 3-3 3M3 6h3c5 0 7 12 12 12h3M3 18h3c2 0 3.5-2 5-5M13 8c1.5-1.3 3-2 5-2h3"/>',
  down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>', diagonal:'<path d="M6 18 18 6M6 6h12v12"/>',
  headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="12" width="5" height="9" rx="2"/><rect x="17" y="12" width="5" height="9" rx="2"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',leaf:'<path d="M19 3C8 2 3 8 5 14c2 6 11 6 14-11Z"/><path d="M3 21 15 9M8 16l1-5m3 1 5-1"/>',
  expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'
};
export function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.arrow}</svg>`; }
export function renderHeader(resolve = url) {
  return `<div class="header-inner wrap"><a class="brand" href="${escapeHtml(resolve(''))}" aria-label="Calendário Consciente — início"><span class="brand-icon" aria-hidden="true">${icon('sun')}</span><span class="brand-name">Pequenas escutas,<br>Grandes <em>reflexões.</em></span></a><nav class="header-nav" aria-label="Navegação principal"><a class="button button-outline" href="${escapeHtml(resolve('#como-funciona'))}">Como funciona</a></nav></div>`;
}
export function renderFooter() {
  return `<div class="footer-inner wrap"><div><p class="footer-label">Pequenas escutas, Grandes reflexões</p><p><strong>Calendário Consciente · Mês da Consciência Negra</strong></p><p class="footer-team"><strong>Concepção e desenvolvimento do projeto · Equipe EAD</strong><br>Daniel Kaiss, Mateus Maidel, Renata Largura de Lima Furtado e Lilian de Almeida Ribeiro.</p></div><div class="footer-note"><p><strong>Referência e conteúdo</strong></p><p>Material inspirado na obra <cite>Pequeno Manual Antirracista</cite>, de Djamila Ribeiro.<br>Situações e reflexões autorais · participação voluntária.</p><p>Respeito, diversidade e práticas antirracistas no cotidiano.</p></div></div>`;
}
export function renderShared() {
  const header = document.querySelector('#cabecalho');
  if (header) header.innerHTML = renderHeader();
  const footer = document.querySelector('#rodape');
  if (footer) footer.innerHTML = renderFooter();
  document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });
}
const STORAGE_KEY = 'calendario-consciente:sorteados:v1';
let memorySeen = [];
export function readSeen(storage) {
  try { const values = JSON.parse(storage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(values) ? [...new Set(values.filter(id => Number.isInteger(id) && id >= 1 && id <= 11))] : []; }
  catch { return [...memorySeen]; }
}
export function chooseChapter(seen = [], random = Math.random) {
  const all = Array.from({length:11}, (_, i) => i+1);
  const remaining = all.filter(id => !seen.includes(id));
  const reset = remaining.length === 0;
  const pool = reset ? all : remaining;
  const index = Math.min(pool.length - 1, Math.max(0, Math.floor(random() * pool.length)));
  const id = pool[index];
  return {id, reset, seen: [...(reset ? [] : seen), id]};
}
export function bindDraw() {
  document.querySelectorAll('[data-sortear]').forEach(button => button.addEventListener('click', () => {
    let storage; try { storage = window.sessionStorage; } catch { storage = null; }
    const result = chooseChapter(storage ? readSeen(storage) : memorySeen);
    memorySeen = result.seen;
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(result.seen)); } catch { /* Session storage is optional. */ }
    if (result.reset) { try { storage?.setItem('calendario-consciente:novo-ciclo', '1'); } catch { /* Continue without persistence. */ } }
    const status = document.querySelector('#sorteio-status');
    if (status) status.textContent = `Abrindo o card ${result.id}.`;
    window.location.assign(chapterUrl(result.id));
  }));
}
export function renderError(error) {
  console.error(error);
  document.querySelector('main').innerHTML = `<section class="error-page wrap"><p class="eyebrow">Calendário Consciente</p><h1>Vamos retomar a conversa.</h1><p>Não foi possível abrir este card. Você pode voltar ao início e escolher um dos 11 capítulos.</p><a class="button button-green" href="${url()}">Voltar ao início ${icon('arrow')}</a></section>`;
}
