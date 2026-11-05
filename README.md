# Calendário Consciente

Pequenas Escutas, Grandes Reflexões — Maidel, Renata e Daniel.

O Calendário Consciente é uma ação educativa com 11 capítulos para reconhecer o racismo no cotidiano e transformar a reflexão em atitudes. O material tem como embasamento o livro *Pequeno manual antirracista*, de Djamila Ribeiro. Equipe: **Maidel, Renata e Daniel**. Outras vozes aparecem como referências complementares, com links para seus próprios perfis.

Cada capítulo segue a experiência dos cartazes: **ler a situação integral do cartaz → ouvir o áudio original → responder ao formulário**. Os títulos, as situações e as perguntas de reflexão dos 11 capítulos foram conferidos com os cartazes impressos; o capítulo 2 conserva seus três parágrafos. O card “Versão impressa” foi removido das páginas dos capítulos. A página inicial apresenta os 11 cards e permite sorteá-los sem repetição na sessão.

## Testar localmente

Requer Node.js, sem instalar dependências:

```text
npm run dev
```

Abrir `http://127.0.0.1:4173/`. O servidor também oferece o prefixo `/calendario-consciente/` para verificar a navegação nos caminhos dos QR codes.

```text
npm run check
npm test
```

Os **11 capítulos têm as gravações enviadas em 05/11/2026**, ligadas ao player de cada página e disponíveis também no HTML sem JavaScript. Os MP4 originais foram copiados sem transcodificação para `assets/audio/cap1.mp4` até `cap11.mp4`; o player reproduz sua trilha de áudio, com pausa, navegação e velocidade selecionável.

O mapeamento dos nomes originais, hashes e durações está em `assets/audio/gravacoes-manifest.json`. Para repetir a importação, executar `python scripts/import-audios.py --source CAMINHO_DOS_ARQUIVOS`. Os originais não são alterados. As antigas leituras automáticas dos capítulos 1, 6 e 8 permanecem como arquivos de prévia e não são usadas pelos players atuais.

Os testes de áudio antigos permanecem em `c1/teste-audio.html` e `c2/teste-audio.html`, com as gravações existentes preservadas.

Os conteúdos e os caminhos dos áudios ficam em `assets/js/conteudo.js`; após alterá-los, executar `node scripts/generate-pages.mjs` para atualizar as páginas HTML. O fluxo compartilhado dos capítulos fica em `assets/js/experiencia.js` e o player em `assets/js/player.js`. Os textos de aprofundamento continuam disponíveis como leitura sobre cada tema; não foram apresentados como transcrições verificadas das novas gravações.

Nenhuma resposta é guardada pelo site. O botão de reflexão abre o Microsoft Forms da ação em outra aba; a confirmação de envio e as configurações de identificação pertencem ao formulário.

O [Forms revisado](https://forms.cloud.microsoft/r/xz3tNcRzQU) foi conferido no navegador em **05/11/2026**: a seleção de um dos 11 capítulos mostra três perguntas abertas específicas sobre a percepção da situação. Os enunciados estão em negrito e cada capítulo oferece um link opcional para enviar áudio, foto ou vídeo pelo OneDrive. O acesso ao formulário não exige login. Nenhuma resposta foi enviada nos testes. O catálogo usa `FORM_STATUS = 'pronto'`; o registro da conferência está em `docs/CONFIGURAR-FORMULARIO.md`.

O site pode ser servido como arquivos estáticos. Antes de publicar, confirmar a origem da hospedagem que mantém `maidell.github.io/calendario-consciente/`, pois os QR codes impressos usam esse endereço. O comando local não faz publicação nem push.

Consulte o planejamento e o inventário em `docs/`.
