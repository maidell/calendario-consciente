# Ajustes do formulário da ação

Inspeção de leitura em 03/11/2026, pelo endereço já impresso nos cartazes. Nenhuma resposta foi enviada e nenhuma configuração do Forms foi alterada.

O formulário abre com o título **Registro de participação no projeto: Pequenas escutas, grandes reflexões**. Atualmente apresenta apenas a pergunta “Para qual capítulo do livro você gostaria de registrar sua percepção?”, com alternativas **Opção 1** e **Opção 2**. Não foi encontrado campo para escrever uma reflexão. O aviso da página informa que nome e e-mail não são coletados automaticamente, a menos que a própria pessoa os forneça.

Para completar a experiência prevista, configurar o mesmo Forms, preservando sua URL:

1. Substituir as duas opções provisórias pelos 11 capítulos, com número e título do catálogo em `assets/js/conteudo.js`.
2. Acrescentar uma pergunta de texto longo: **Que reflexão essa situação despertou em você?**. Uma orientação possível é “Compartilhe uma percepção ou uma atitude que você pode experimentar. Evite identificar outras pessoas.”
3. Manter a participação voluntária e conferir o acesso para o público da ação. A identificação, caso desejada pela equipe, deve continuar opcional e claramente indicada.
4. Conferir como a equipe responsável acessará as respostas. Não publicar respostas automaticamente.
5. Fazer um envio de teste identificado como tal e conferir o registro no destino. Abrir o formulário não demonstra envio.

Após esses ajustes, mudar `FORM_STATUS` de `preparacao` para `pronto` em `assets/js/conteudo.js` e regenerar as páginas. A prévia usa “Abrir formulário da ação” e informa que ele ainda está em preparação. No estado pronto, a página retoma “Compartilhar minha reflexão”.

O site conserva o link externo existente; a configuração dos campos precisa ser feita no Forms pela conta responsável.
