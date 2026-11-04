import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { CAPITULOS, FORM_URL } from '../assets/js/conteudo.js';
import { chooseChapter, readSeen, escapeHtml } from '../assets/js/site.js';

const root = new URL('../', import.meta.url);
test('o sorteio percorre os 11 cards sem repetir e reinicia o ciclo', () => {
  let seen = [];
  const sequence = [];
  for (let i=0; i<11; i++) { const result = chooseChapter(seen, () => .37); assert.equal(result.reset,false); sequence.push(result.id); seen = result.seen; }
  assert.equal(new Set(sequence).size,11);
  const reset = chooseChapter(seen, () => .999999);
  assert.deepEqual(reset, {id:11,reset:true,seen:[11]});
});
test('dados inválidos da sessão não impedem o sorteio', () => {
  assert.deepEqual(readSeen({getItem:()=>'{broken'}),[]);
  assert.deepEqual(readSeen({getItem:()=>'null'}),[]);
  assert.deepEqual(readSeen({getItem:()=>'[1,1,0,12,"2",3]'}),[1,3]);
  assert.deepEqual(readSeen({getItem:()=>{throw Error('Blocked')}}),[]);
});
test('catálogo mantém correspondência entre capítulo, rota e cartaz', async () => {
  assert.deepEqual(CAPITULOS.map(card=>card.id), Array.from({length:11},(_,i)=>i+1));
  assert.deepEqual(CAPITULOS.filter(card=>card.piloto).map(card=>card.id),[1,6,8]);
  assert.equal(new URL(FORM_URL).hostname,'forms.cloud.microsoft');
  for (const card of CAPITULOS) {
    for (const field of ['titulo','tema','chamada','situacao','resumo','acao','pergunta','alt']) assert.ok(card[field]?.trim(),`Card ${card.id}: ${field}`);
    assert.ok(card.reflexao.length>=5);
    assert.equal(card.imagem,`assets/imagens/cap${card.id}.webp`);
    await access(new URL(card.imagem,root)); await access(new URL(card.miniatura,root));
    const html=await readFile(new URL(`c${card.id}/index.html`,root),'utf8');
    assert.ok(html.includes(`data-capitulo="${card.id}"`));
    assert.ok(html.includes(e(card.titulo)));
    assert.ok(html.includes(e(card.pergunta)));
    assert.ok(card.referencias.length<=2);
    for (const ref of card.referencias) assert.equal(new URL(ref.url).protocol,'https:');
  }
  function e(value){return escapeHtml(value)}
});
test('a transcrição da escuta de prévia corresponde ao texto sintetizado', async () => {
  const manifest=JSON.parse(await readFile(new URL('assets/audio/previa-manifest.json',root),'utf8'));
  for (const item of manifest.files) {
    const card=CAPITULOS.find(card=>card.id===item.chapter);
    const text=[card.resumo,card.acao,card.pergunta].join('\n\n');
    assert.equal(createHash('sha256').update(text,'utf8').digest('hex'),item.textSha256);
    const wave=await readFile(new URL(`assets/audio/${item.file}`,root));
    assert.equal(wave.toString('ascii',0,4),'RIFF'); assert.equal(wave.toString('ascii',8,12),'WAVE');
    assert.equal(wave.length,item.bytes);
    assert.ok(item.durationSeconds>=30 && item.durationSeconds<=60);
  }
});
test('a página de teste editada do capítulo 2 mantém a gravação escolhida pelo usuário', async () => {
  const legacy=await readFile(new URL('c2/teste-audio.html',root),'utf8');
  assert.match(legacy,/src="ab\.m4a"/);
  await access(new URL('c2/ab.m4a',root));
});
