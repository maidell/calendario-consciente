import { FORM_URL, FORM_STATUS, CAPITULOS, obterCapitulo } from './conteudo.js';
import { url, icon, escapeHtml as e, renderShared, bindDraw, renderError } from './site.js';
const paragraph = text => String(text).split(/\n\s*\n/).filter(Boolean).map(value => `<p>${e(value)}</p>`).join('');
const readingText = card => [card.resumo, card.acao, card.pergunta].join('\n\n');
function renderPlayer(card) {
  const ready = card.piloto;
  return `<section class="player-panel" aria-labelledby="player-title"><p class="eyebrow">${ready ? 'Comece pela escuta' : 'Escolha o seu ritmo'}</p><div class="player-heading"><span class="listen-icon">${icon('headphones')}</span><div><h2 id="player-title">${ready ? 'Uma pausa para ouvir.' : 'A reflexão também está aqui.'}</h2><p>${ready ? 'Resumo e pergunta do card · leitura em voz automática' : 'Leia o resumo ou abra a reflexão completa abaixo.'}</p></div></div>${ready ? `<audio id="audio-resumo" controls preload="metadata" aria-label="Ouvir resumo e pergunta do capítulo ${card.id}" src="${url(`assets/audio/cap${card.id}-previa.wav`)}">Seu navegador não reproduz este áudio. Você pode ler o mesmo conteúdo abaixo.</audio><div class="player-meta"><p class="player-status" id="audio-status" role="status">Preparando a leitura…</p><label for="velocidade">Velocidade <select id="velocidade"><option value="0.75">0,75×</option><option value="1" selected>1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option><option value="2">2×</option></select></label></div><details class="player-disclosure"><summary>Ler a transcrição desta escuta</summary>${paragraph(readingText(card))}</details><p class="audio-note">Voz automática nesta prévia. As gravações autorais da equipe serão integradas à ação.</p>` : `<p class="player-empty">A gravação da equipe está em preparação. Enquanto isso, você pode conhecer a reflexão completa em texto.</p><a class="button button-yellow" href="#reflexao-completa" data-abrir-reflexao>Ler a reflexão ${icon('arrow')}</a>`}</section>`;
}
function renderReferences(card) {
  if (!card.referencias?.length) return '';
  return `<section class="other-voices" aria-labelledby="voices-title"><div class="section-heading"><div><p class="eyebrow">Ampliar o repertório</p><h2 id="voices-title">Outras vozes sobre <em>este tema.</em></h2></div><p>Conheça outras perspectivas. As indicações complementam a reflexão inspirada em Djamila Ribeiro.</p></div><div class="voice-grid">${card.referencias.slice(0,2).map(ref => `<a class="voice-card" href="${e(ref.url)}" target="_blank" rel="noopener noreferrer"><span class="voice-initial" aria-hidden="true">${e(ref.nome.split(/\s+/).slice(0,2).map(word => word[0]).join(''))}</span><div class="voice-content"><p class="voice-platform">${e(ref.plataforma)}</p><h3>${e(ref.nome)}</h3><p>${e(ref.descricao)}</p><span class="voice-link">${ref.tipo === 'perfil' ? 'Conhecer o perfil' : 'Explorar este conteúdo'} ${icon('diagonal')}<span class="sr-only"> (abre em nova aba)</span></span></div></a>`).join('')}</div></section>`;
}
function bindPlayer() {
  const audio = document.querySelector('#audio-resumo');
  if (!audio) return;
  const status = document.querySelector('#audio-status');
  const speed = document.querySelector('#velocidade');
  const format = value => Number.isFinite(value) ? `${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}` : '';
  const ready = () => { if (audio.paused && audio.currentTime === 0) status.textContent = `Pronto para ouvir${format(audio.duration) ? ` · ${format(audio.duration)}` : ''}`; };
  audio.addEventListener('loadedmetadata', ready);
  audio.addEventListener('play', () => { status.textContent = 'Reproduzindo a leitura'; });
  audio.addEventListener('pause', () => { if (!audio.ended) status.textContent = 'Leitura pausada'; });
  audio.addEventListener('ended', () => { status.textContent = 'Escuta concluída. A reflexão continua com você.'; });
  audio.addEventListener('error', () => { status.textContent = 'Não foi possível reproduzir. O mesmo conteúdo está na transcrição.'; });
  speed.addEventListener('change', () => { audio.playbackRate = Number(speed.value); });
  window.addEventListener('pagehide', () => audio.pause());
  if (audio.readyState >= 1) ready();
}
function bindPoster() {
  const dialog = document.querySelector('#cartaz-ampliado');
  document.querySelectorAll('[data-ampliar]').forEach(link => link.addEventListener('click', event => { if (typeof dialog.showModal !== 'function') return; event.preventDefault(); dialog.showModal(); }));
  document.querySelector('[data-fechar]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
}
try {
  const card = obterCapitulo(Number(document.body.dataset.capitulo));
  if (!card || !CAPITULOS.includes(card)) throw new Error('Capítulo não encontrado');
  document.title = `${card.titulo} · Calendário Consciente`;
  document.querySelector('meta[name="description"]').content = card.chamada;
  renderShared();
  document.querySelector('#conteudo').innerHTML = `<div class="wrap chapter-main"><nav class="breadcrumb" aria-label="Você está em"><a href="${url()}">Início</a>${icon('chevron')}<a href="${url('#capitulos')}">Os 11 cards</a>${icon('chevron')}<span aria-current="page">Card ${String(card.id).padStart(2,'0')}</span></nav><header class="chapter-heading"><p class="eyebrow">Card ${String(card.id).padStart(2,'0')} de 11 <span aria-hidden="true">/</span> ${e(card.tema)}</p><h1>${e(card.titulo)}</h1><p>${e(card.chamada)}</p></header><p class="sr-only" id="sorteio-status" role="status"></p><p class="cycle-notice" id="ciclo-status" hidden></p><div class="chapter-entry"><div class="chapter-core"><section aria-labelledby="situation-title"><h2 class="eyebrow situation-label" id="situation-title">Uma situação para olhar de perto</h2><p class="situation-summary">${e(card.resumo)}</p><div class="action-note">${icon('leaf')}<p><strong>Um começo possível</strong>${e(card.acao)}</p></div></section>${renderPlayer(card)}<section class="reflection-card" aria-labelledby="question-title"><p class="eyebrow">Para refletir</p><h2 id="question-title">${e(card.pergunta)}</h2><p class="reflection-hint">Pense no que essa situação desperta em você. Se quiser, compartilhe sua percepção com a equipe.</p><a class="button button-green" id="abrir-formulario" href="${e(FORM_URL)}" target="_blank" rel="noopener noreferrer">Compartilhar minha reflexão ${icon('diagonal')}<span class="sr-only"> (abre em nova aba)</span></a><p class="form-note">Abre o formulário da ação em outra aba · Card ${card.id}</p></section></div><aside class="poster-aside" aria-label="Cartaz do capítulo"><div class="poster-card"><a href="${url(card.imagem)}" data-ampliar aria-label="Ampliar cartaz do capítulo ${card.id}"><img src="${url(card.imagem)}" alt="${e(card.alt)}" width="1200" height="1800" decoding="async"></a></div><p class="poster-caption"><a href="${url(card.imagem)}" data-ampliar>${icon('expand')} Ampliar o cartaz original</a></p></aside></div><div class="chapter-bottom"><details class="full-reflection" id="reflexao-completa"><summary>Aprofundar esta reflexão</summary><div class="reading-body"><h3>A situação do cartaz</h3><div class="full-situation">${paragraph(card.situacao)}</div><h3>Uma escuta que também pode ser lida</h3>${card.reflexao.map(p => `<p>${e(p)}</p>`).join('')}<p class="text-credit">Reflexão autoral inspirada em <cite>Pequeno manual antirracista</cite>, de Djamila Ribeiro.</p></div></details>${renderReferences(card)}<div class="next-actions"><p>Uma conversa pode levar a outra.</p><div><button class="button button-green" data-sortear>${icon('shuffle')} Sortear outro card</button><a class="button button-outline" href="${url('#capitulos')}">Ver os 11 cards ${icon('arrow')}</a></div></div><p class="chapter-mini-credit">Djamila Ribeiro é a referência principal desta ação. Situações, resumos e reflexões são adaptações autorais para a comunidade da Faculdade Senac Portão.</p></div></div><dialog class="lightbox" id="cartaz-ampliado" aria-labelledby="cartaz-title"><div class="lightbox-head"><p id="cartaz-title">Card ${card.id} · ${e(card.titulo)}</p><button class="close-dialog" data-fechar aria-label="Fechar cartaz ampliado">×</button></div><img src="${url(card.imagem)}" alt="${e(card.alt)}" width="1200" height="1800" loading="lazy"><p class="lightbox-credit">${e(card.titulo)} · Faculdade Senac Portão. A situação e a pergunta também estão disponíveis em texto nesta página.</p></dialog>`;
  if (FORM_STATUS !== 'pronto') {
    const formLink = document.querySelector('#abrir-formulario');
    formLink.innerHTML = `Abrir formulário da ação ${icon('diagonal')}<span class="sr-only"> (abre em nova aba)</span>`;
    document.querySelector('.reflection-hint').textContent = 'Pense no que essa situação desperta em você. O formulário ainda está sendo preparado para receber sua reflexão.';
    document.querySelector('.form-note').textContent = `Abre em outra aba · prévia do formulário · Card ${card.id}`;
  }
  bindDraw(); bindPlayer(); bindPoster();
  document.querySelectorAll('[data-abrir-reflexao]').forEach(link => link.addEventListener('click', () => { document.querySelector('#reflexao-completa').open = true; }));
  try { if (sessionStorage.getItem('calendario-consciente:novo-ciclo')) { const notice = document.querySelector('#ciclo-status'); notice.hidden = false; notice.textContent = 'Você já sorteou os 11 cards. Um novo ciclo de conversas começa aqui.'; sessionStorage.removeItem('calendario-consciente:novo-ciclo'); } } catch { /* Optional session state. */ }
} catch (error) { renderError(error); }
