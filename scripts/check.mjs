import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=new URL('../',import.meta.url);
for(const dir of ['assets/js/','scripts/','tests/']) {
  for(const name of await readdir(new URL(dir,root))) {
    if(!/\.(?:mjs|js)$/.test(name))continue;
    const file=fileURLToPath(new URL(dir+name,root));
    const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
    if(result.status!==0){process.stderr.write(result.stderr);process.exit(result.status||1)}
  }
}
for(let id=1;id<=11;id++){
  const html=await readFile(new URL(`c${id}/index.html`,root),'utf8');
  if(!html.includes('lang="pt-BR"')||!html.includes(`data-capitulo="${id}"`))throw Error(`Página ${id} inconsistente`);
}
console.log('Sintaxe JavaScript e 11 páginas verificadas.');
