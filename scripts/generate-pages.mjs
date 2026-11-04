import { readFile, writeFile, copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CAPITULOS, FORM_URL, FORM_STATUS } from '../assets/js/conteudo.js';
import { escapeHtml as e } from '../assets/js/site.js';

const root = new URL('../', import.meta.url);
for (const card of CAPITULOS) {
  const target = new URL(`c${card.id}/index.html`, root);
  const existing = await readFile(target, 'utf8').catch(() => '');
  // Keep the existing recordings and the user's edited test page reachable.
  if ([1,2].includes(card.id) && existing.includes('Gravação de teste')) {
    const backup = new URL(`c${card.id}/teste-audio.html`, root);
    try { await access(backup); } catch { await copyFile(target, backup, constants.COPYFILE_EXCL); }
  }
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#163d2b">
  <meta name="description" content="${e(card.chamada)}">
  <title>${e(card.titulo)} · Calendário Consciente</title>
  <link rel="icon" href="../assets/imagens/sol.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/site.css">
  <script type="module" src="../assets/js/capitulo.js"></script>
</head>
<body data-capitulo="${card.id}">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header" id="cabecalho"></header>
  <main id="conteudo"><div class="wrap chapter-main"><p class="eyebrow">Card ${card.id} de 11</p><h1>${e(card.titulo)}</h1><p>${e(card.situacao)}</p><h2>Para refletir</h2><p>${e(card.pergunta)}</p>${FORM_STATUS !== 'pronto' ? '<p>O formulário ainda está sendo preparado para receber sua reflexão.</p>' : ''}<p><a href="${e(FORM_URL)}" target="_blank" rel="noopener noreferrer">${FORM_STATUS === 'pronto' ? 'Compartilhar minha reflexão' : 'Abrir formulário da ação'} (abre em nova aba)</a></p></div></main>
  <footer class="site-footer" id="rodape"></footer>
  <noscript><div class="noscript-message"><p>Você pode ler a situação e a pergunta acima. Para ouvir a prévia e usar o sorteio, ative o JavaScript.</p><p><a href="../assets/imagens/cap${card.id}.webp">Ver o cartaz do capítulo ${card.id}</a> · <a href="../index.html">Voltar ao início</a></p></div></noscript>
</body>
</html>
`;
  await writeFile(target, html, 'utf8');
}
console.log(`${CAPITULOS.length} páginas geradas. Testes de áudio anteriores preservados em c1/teste-audio.html e c2/teste-audio.html.`);
