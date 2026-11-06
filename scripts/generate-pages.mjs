import { readFile, writeFile, copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CAPITULOS } from '../assets/js/conteudo.js';
import { escapeHtml as e, renderFooter } from '../assets/js/site.js';
import { renderExperience } from '../assets/js/experiencia.js';

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
  <main id="conteudo"><div class="wrap chapter-main">
    <nav class="breadcrumb" aria-label="Você está em"><a href="../index.html">Início</a><span aria-hidden="true">›</span><a href="../index.html#capitulos">Os 11 cards</a><span aria-hidden="true">›</span><span aria-current="page">Card ${String(card.id).padStart(2,'0')}</span></nav>
    <header class="chapter-heading"><h1>${e(card.titulo)}</h1><p>${e(card.chamada)}</p></header>
    ${renderExperience(card, path => `../${path}`)}
    <details class="full-reflection" id="reflexao-completa"><summary>Aprofundar esta reflexão em texto</summary><div class="reading-body">${card.reflexao.map(text => `<p>${e(text)}</p>`).join('')}<p class="text-credit">Reflexão autoral embasada em <cite>Pequeno manual antirracista</cite>, de Djamila Ribeiro.</p></div></details>
  </div></main>
  <footer class="site-footer" id="rodape">${renderFooter()}</footer>
  <noscript><div class="noscript-message"><p>Você pode ler a situação, ouvir o áudio e responder ao formulário acima. Para usar o sorteio e os controles adicionais de velocidade, ative o JavaScript.</p><p><a href="../index.html">Voltar ao início</a></p></div></noscript>
</body>
</html>
`;
  await writeFile(target, html, 'utf8');
}
console.log(`${CAPITULOS.length} páginas geradas. Testes de áudio anteriores preservados em c1/teste-audio.html e c2/teste-audio.html.`);
