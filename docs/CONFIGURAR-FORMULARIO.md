# Formulário da ação

O [Microsoft Forms revisado da ação](https://forms.cloud.microsoft/r/xz3tNcRzQU) foi configurado e conferido no navegador em **05/11/2026**. Este é o endereço usado pelos botões dos 11 capítulos do site. Os QR codes impressos que apontam diretamente ao formulário anterior continuam com seu destino original.

O formulário abre com o título **Registro de participação: Pequenas escutas, grandes reflexões**. A seleção obrigatória de um dos **11 capítulos**, correspondentes ao catálogo em `assets/js/conteudo.js`, encaminha para uma seção com **três perguntas abertas específicas daquela situação**. Os 33 campos de resposta escrita são opcionais, permitem respostas longas e têm os enunciados em negrito.

Cada seção oferece um link opcional para enviar áudio, foto ou vídeo por uma solicitação de arquivos do OneDrive correspondente ao capítulo. O formulário e os links de envio não exigem login. A página do OneDrive pede nome e sobrenome; os arquivos ficam separados das respostas escritas, sem vínculo automático entre os dois envios.

O estado do catálogo é `FORM_STATUS = 'pronto'`. As páginas convidam a pessoa a responder ao formulário depois de **ler a situação integral do cartaz e ouvir o áudio original**, indicando o número e o título do capítulo que deve selecionar. A abertura ocorre em outra aba. A URL central fica em `FORM_URL`; após alterá-la, executar `node scripts/generate-pages.mjs` para atualizar também os links do HTML estático.

O Calendário Consciente tem como equipe **Maidel, Renata e Daniel** e é embasado no livro *Pequeno manual antirracista*, de Djamila Ribeiro. O site apresenta os mesmos textos de situação e perguntas dos cartazes, aproximando a experiência digital da sequência impressa: situação → áudio pelo QR code → formulário.

Nenhuma resposta é guardada pelo site. A confirmação de envio, as configurações de identificação e o acesso às respostas pertencem ao Microsoft Forms e à conta responsável. Os 11 caminhos de navegação, as perguntas e os 11 links de envio foram conferidos. Nenhuma resposta ou arquivo foi enviado nos testes.
