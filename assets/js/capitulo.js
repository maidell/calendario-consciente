import { CAPITULOS, obterCapitulo } from './conteudo.js';
import { url, icon, escapeHtml as e, renderShared, bindDraw, renderError } from './site.js';
import { renderExperience } from './experiencia.js';

function renderReferences(card) {
  if (!card.referencias?.length) return '';
  return `<section class="other-voices" aria-labelledby="voices-title"><div class="section-heading"><div><p class="eyebrow">Ampliar o repertório</p><h2 id="voices-title">Outras vozes sobre <em>este tema.</em></h2></div><p>Conheça outras perspectivas. As indicações complementam a reflexão embasada em Djamila Ribeiro.</p></div><div class="voice-grid">${card.referencias.slice(0,2).map(ref => `<a class="voice-card" href="${e(ref.url)}" target="_blank" rel="noopener noreferrer"><span class="voice-initial" aria-hidden="true">${e(ref.nome.split(/\s+/).slice(0,2).map(word => word[0]).join(''))}</span><div class="voice-content"><p class="voice-platform">${e(ref.plataforma)}</p><h3>${e(ref.nome)}</h3><p>${e(ref.descricao)}</p><span class="voice-link">${ref.tipo === 'perfil' ? 'Conhecer o perfil' : 'Explorar este conteúdo'} ${icon('diagonal')}<span class="sr-only"> (abre em nova aba)</span></span></div></a>`).join('')}</div></section>`;
}

function bindPlayer() {
  const audio = document.querySelector('#audio-reflexao');
  if (!audio) return;
  const status = document.querySelector('#audio-status');
  const speed = document.querySelector('#velocidade');
  const format = value => Number.isFinite(value) ? `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}` : '';
  const ready = () => { if (audio.paused && audio.currentTime === 0) status.textContent = `Pronto para ouvir${format(audio.duration) ? ` · ${format(audio.duration)}` : ''}`; };
  audio.addEventListener('loadedmetadata', ready);
  audio.addEventListener('play', () => { status.textContent = 'Reproduzindo a reflexão'; });
  audio.addEventListener('pause', () => { if (!audio.ended) status.textContent = 'Áudio pausado'; });
  audio.addEventListener('ended', () => { status.textContent = 'Escuta concluída. Agora, compartilhe sua reflexão no formulário abaixo.'; });
  audio.addEventListener('error', () => { status.textContent = 'Não foi possível reproduzir. Você pode abrir a gravação ou ler a reflexão sobre o tema.'; });
  speed.addEventListener('change', () => { audio.playbackRate = Number(speed.value); });
  window.addEventListener('pagehide', () => audio.pause());
  if (audio.readyState >= 1) ready();
}

try {
  const card = obterCapitulo(Number(document.body.dataset.capitulo));
  if (!card || !CAPITULOS.includes(card)) throw new Error('Capítulo não encontrado');
  document.title = `${card.titulo} · Calendário Consciente`;
  document.querySelector('meta[name="description"]').content = card.chamada;
  renderShared();
  document.querySelector('#conteudo').innerHTML = `<div class="wrap chapter-main">
    <nav class="breadcrumb" aria-label="Você está em"><a href="${url()}">Início</a>${icon('chevron')}<a href="${url('#capitulos')}">Os 11 cards</a>${icon('chevron')}<span aria-current="page">Card ${String(card.id).padStart(2,'0')}</span></nav>
    <header class="chapter-heading"><p class="eyebrow">Card ${String(card.id).padStart(2,'0')} de 11 <span aria-hidden="true">/</span> ${e(card.tema)}</p><h1>${e(card.titulo)}</h1><p>${e(card.chamada)}</p></header>
    <p class="sr-only" id="sorteio-status" role="status"></p><p class="cycle-notice" id="ciclo-status" hidden></p>
    ${renderExperience(card)}
    <div class="chapter-bottom"><details class="full-reflection" id="reflexao-completa"><summary>Aprofundar esta reflexão em texto</summary><div class="reading-body">${card.reflexao.map(p => `<p>${e(p)}</p>`).join('')}<p class="text-credit">Reflexão autoral embasada em <cite>Pequeno manual antirracista</cite>, de Djamila Ribeiro.</p></div></details>
      ${renderReferences(card)}
      <div class="next-actions"><p>Uma conversa pode levar a outra.</p><div><button class="button button-green" data-sortear>${icon('shuffle')} Sortear outro card</button><a class="button button-outline" href="${url('#capitulos')}">Ver os 11 cards ${icon('arrow')}</a></div></div>
      <p class="chapter-mini-credit">Este material tem como embasamento o livro <cite>Pequeno manual antirracista</cite>, de Djamila Ribeiro. Equipe: <strong>Maidel, Renata e Daniel</strong>.</p>
    </div>
  </div>`;
  bindDraw();
  bindPlayer();
  document.querySelectorAll('[data-abrir-reflexao]').forEach(link => link.addEventListener('click', () => { document.querySelector('#reflexao-completa').open = true; }));
  try {
    if (sessionStorage.getItem('calendario-consciente:novo-ciclo')) {
      const notice = document.querySelector('#ciclo-status');
      notice.hidden = false;
      notice.textContent = 'Você já sorteou os 11 cards. Um novo ciclo de conversas começa aqui.';
      sessionStorage.removeItem('calendario-consciente:novo-ciclo');
    }
  } catch { /* Optional session state. */ }
} catch (error) { renderError(error); }
