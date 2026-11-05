import { url, icon, escapeHtml as e } from './site.js';

export function renderPlayer(card, resolve = url) {
  if (!card.audio) {
    return `<section class="player-panel" id="escuta" aria-labelledby="player-title"><p class="eyebrow">02 · Ouça o áudio</p><div class="player-heading"><span class="listen-icon">${icon('headphones')}</span><div><h2 id="player-title">A reflexão também está aqui.</h2><p>Abra a reflexão completa abaixo.</p></div></div><p class="player-empty">A gravação ainda não está disponível. Você pode conhecer a reflexão em texto.</p><a class="button button-yellow" href="#reflexao-completa" data-abrir-reflexao>Ler a reflexão ${icon('arrow')}</a></section>`;
  }
  return `<section class="player-panel" id="escuta" aria-labelledby="player-title">
    <p class="eyebrow">02 · Ouça o áudio</p>
    <div class="player-heading"><span class="listen-icon">${icon('headphones')}</span><div><h2 id="player-title">Uma pausa para ouvir.</h2><p>Reflexão do capítulo ${card.id} · gravação da equipe</p></div></div>
    <audio id="audio-reflexao" controls preload="metadata" aria-label="Ouvir a reflexão do capítulo ${card.id}" src="${e(resolve(card.audio))}">Seu navegador não reproduz este áudio. <a href="${e(resolve(card.audio))}">Abrir a gravação do capítulo ${card.id}</a>.</audio>
    <div class="player-meta"><p class="player-status" id="audio-status" role="status">Preparando o áudio…</p><label for="velocidade">Velocidade <select id="velocidade"><option value="0.75">0,75×</option><option value="1" selected>1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option><option value="2">2×</option></select></label></div>
    <p class="audio-note"><a href="#reflexao-completa" data-abrir-reflexao>Ler a reflexão sobre este tema</a> · <a href="${e(resolve(card.audio))}" download="calendario-consciente-cap${card.id}.mp4">Baixar áudio</a></p>
  </section>`;
}
