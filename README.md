# Calendário Consciente

Pequenas Escutas, Grandes Reflexões — Faculdade Senac Portão.

Prévia estática com 11 cards, sorteio sem repetição na sessão, reflexões em texto e formulário externo existente. Djamila Ribeiro é a referência principal; outras vozes aparecem com links para seus próprios perfis.

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

O capítulo 7 recebeu uma nova reflexão coerente com o card “Leia autores negros”; revisar editorialmente antes do lançamento. Os testes de áudio antigos permanecem em `c1/teste-audio.html` e `c2/teste-audio.html`, com as gravações existentes preservadas.

Os conteúdos e os caminhos dos áudios ficam em `assets/js/conteudo.js`; após alterá-los, executar `node scripts/generate-pages.mjs` para atualizar as páginas HTML. O player compartilhado fica em `assets/js/player.js`. Os textos de aprofundamento continuam disponíveis como leitura sobre cada tema; não foram apresentados como transcrições verificadas das novas gravações.

Nenhuma resposta é guardada pelo site. O botão de reflexão abre o Microsoft Forms da ação em outra aba; a confirmação de envio e as configurações de identificação pertencem ao formulário.

Na inspeção, o Forms ainda tinha somente “Opção 1” e “Opção 2”, sem campo de reflexão. A prévia sinaliza esse estado por `FORM_STATUS = 'preparacao'`. Os ajustes necessários estão em `docs/CONFIGURAR-FORMULARIO.md`.

O site pode ser servido como arquivos estáticos. Antes de publicar, confirmar a origem da hospedagem que mantém `maidell.github.io/calendario-consciente/`, pois os QR codes impressos usam esse endereço. O comando local não faz publicação nem push.

Consulte o planejamento e o inventário em `docs/`.
