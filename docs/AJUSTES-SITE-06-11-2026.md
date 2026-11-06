# Ajustes do site — 06/11/2026

Referência: **ajustes_site 1.docx**, de Renata Largura de Lima Furtado, recebido em 06/11/2026. Aplicação local autorizada inicialmente pelo usuário; o envio ao repositório também foi autorizado após a conclusão da revisão.

- Abertura com título do projeto e subtítulo da edição; apresentação substituída pelos cinco parágrafos do documento.
- Caixa verde “Como participar?” após a apresentação e antes do sorteio, com as três instruções e o fechamento propostos.
- Foto da abertura preservada. Apenas a etiqueta verde permanece como texto na imagem; identificação de imagem ilustrativa gerada por IA integra o texto alternativo.
- “Nossa inspiração” usa os três parágrafos fornecidos e oferece “Conheça a obra” e “Conheça a autora”.
- Galeria com título único, ilustração sem texto, título do capítulo e pergunta curta já existente abaixo dele; filtros, tema, selos e links repetidos retirados.
- Rodapé com Mês da Consciência Negra, Equipe EAD e os quatro nomes, incluindo Lilian de Almeida Ribeiro. O mesmo conteúdo aparece com e sem JavaScript.
- Capítulos sem a identificação redundante de tema, navegação repetida de etapas, título decorativo do player, links adicionais de leitura/download e minicrédito final. Controles nativos, velocidade, títulos das três etapas, aprofundamento e referências complementares preservados.
- Estado do player disponível para leitores de tela; falhas de reprodução são mostradas visualmente.

Os 11 áudios, situações, perguntas, URLs dos capítulos, formulário e cartazes originais permanecem nas mesmas associações. As miniaturas são versões de uso exclusivo na galeria. Cópias dos fontes anteriores à alteração ficam em `output/ajustes-site-2026-11-06/originais/` na pasta do projeto.

## Miniaturas sem texto

Os capítulos 1, 2, 4, 6, 7, 9 e 10 usam versões da ilustração preparadas com ImageGen integrado em `assets/imagens/galeria/`. Os capítulos 3, 5, 8 e 11 usam recortes SVG dos WebP existentes. O enquadramento do capítulo 8 mostra a cena do cinema. As imagens da galeria são decorativas: título e pergunta identificam cada link. O conjunto exato de prompts, nomes dos arquivos, dimensões, hashes e recortes está em [IMAGENS-GALERIA-06-11-2026.json](IMAGENS-GALERIA-06-11-2026.json).

## Verificação

As 11 páginas de capítulo foram regeneradas. Sintaxe e sete testes existentes passaram, incluindo integridade e associação dos áudios. A conferência estática verificou as 12 páginas, o rodapé compartilhado, os 11 arquivos/recortes da galeria, a ordem de participação e as referências ARIA. As miniaturas foram inspecionadas visualmente. A inspeção de layout em navegador não foi realizada porque a navegação local está desativada nas configurações do Work. Registro e contact sheet em `output/ajustes-site-2026-11-06/`.

## Envio ao repositório

Destino confirmado: `https://github.com/maidell/calendario-consciente.git`, branch `main`, com publicação em `https://maidell.github.io/calendario-consciente/`. O clone foi atualizado por avanço direto para preservar os três commits remotos anteriores. A integração compara cada fonte com a base revisada e copia somente os arquivos desta alteração.

## Correção mobile e navbar

A navbar oferece somente o botão “Como funciona”, inclusive no HTML sem JavaScript. Em telas de até 760 px, a etiqueta verde fica abaixo da foto, sem rotação nem sobreposição. Os botões de participação e de referência ficam organizados em coluna nas telas mais estreitas. As setas textuais foram substituídas por SVG para evitar apresentação como emojis no iOS.

## Identidade preservada na navbar

Após esclarecimento do usuário, foram restaurados o símbolo do sol, o nome Calendário Consciente e a identificação da Equipe EAD. Apenas o botão “Como funciona” permanece na navegação. No celular, marca e botão ficam na primeira linha e a equipe aparece abaixo.
