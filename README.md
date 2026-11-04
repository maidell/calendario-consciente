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

Os capítulos 1, 6 e 8 têm **leituras em voz automática de prévia**, com transcrições correspondentes. As gravações finais da equipe ainda não estão associadas ao catálogo. As leituras podem ser regeneradas no Windows, com Microsoft Maria Desktop pt-BR, por `node scripts/prepare-preview-audio.mjs`.

O capítulo 7 recebeu uma nova reflexão coerente com o card “Leia autores negros”; revisar editorialmente antes do lançamento. Os testes de áudio antigos permanecem em `c1/teste-audio.html` e `c2/teste-audio.html`, com as gravações existentes preservadas.

Os conteúdos ficam em `assets/js/conteudo.js`; após alterar título, situação ou pergunta, executar `node scripts/generate-pages.mjs` para atualizar as páginas HTML e os textos de fallback. Mudanças no texto dos resumos dos pilotos exigem também regenerar os áudios.

Nenhuma resposta é guardada pelo site. O botão de reflexão abre o Microsoft Forms da ação em outra aba; a confirmação de envio e as configurações de identificação pertencem ao formulário.

Na inspeção, o Forms ainda tinha somente “Opção 1” e “Opção 2”, sem campo de reflexão. A prévia sinaliza esse estado por `FORM_STATUS = 'preparacao'`. Os ajustes necessários estão em `docs/CONFIGURAR-FORMULARIO.md`.

O site pode ser servido como arquivos estáticos. Antes de publicar, confirmar a origem da hospedagem que mantém `maidell.github.io/calendario-consciente/`, pois os QR codes impressos usam esse endereço. O comando local não faz publicação nem push.

Consulte o planejamento e o inventário em `docs/`.
