import { FORM_URL, FORM_STATUS } from './conteudo.js';
import { url, icon, escapeHtml as e } from './site.js';
import { renderPlayer } from './player.js';

// The same reading → listening → participation flow is rendered with or without JavaScript.
export function renderExperience(card, resolve = url) {
  const situation = card.situacao.split(/\n\s*\n/).filter(Boolean).map(text => `<p>${e(text)}</p>`).join('');
  return `<div class="chapter-experience">
    <nav class="experience-nav" aria-label="Etapas do capítulo"><a href="#situacao">01 · Leia a situação</a><a href="#escuta">02 · Ouça o áudio</a><a href="#participacao">03 · Responda ao formulário</a></nav>
    <section id="situacao" aria-labelledby="situation-title"><h2 class="eyebrow situation-label" id="situation-title">01 · Leia a situação</h2><div class="poster-situation">${situation}</div></section>
    ${renderPlayer(card, resolve)}
    <section class="reflection-card" id="participacao" aria-labelledby="question-title"><p class="eyebrow">03 · Responda ao formulário</p><h2 id="question-title">${e(card.pergunta)}</h2><p class="reflection-hint">Depois de ler a situação e ouvir o áudio, compartilhe sua percepção no formulário da ação. Selecione o capítulo ${card.id} · ${e(card.titulo)}.</p><a class="button button-green" id="abrir-formulario" href="${e(FORM_URL)}" target="_blank" rel="noopener noreferrer">Responder ao formulário ${icon('diagonal')}<span class="sr-only"> (abre em nova aba)</span></a><p class="form-note">Participação voluntária · Abre em outra aba${FORM_STATUS !== 'pronto' ? ' · Formulário em preparação' : ''}</p></section>
  </div>`;
}
