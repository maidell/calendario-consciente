/**
 * Generate explicitly synthetic preview narration for pilot cards 1, 6 and 8.
 * Run on Windows with Microsoft Maria Desktop installed:
 *     node scripts/prepare-preview-audio.mjs
 * Text is read directly from the shared card catalogue, without paraphrasing.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = dirname(dirname(fileURLToPath(import.meta.url)));
const { CAPITULOS } = await import(pathToFileURL(join(repo, 'assets/js/conteudo.js')));
const output = join(repo, 'assets/audio');
const powershell = process.env.CALENDARIO_POWERSHELL || 'powershell.exe';
const speechScript = join(repo, 'scripts/speak-preview.ps1');

function speak(text, target) {
  return new Promise((resolve, reject) => {
    const child = spawn(powershell, [
      '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
      '-File', speechScript, '-OutputPath', target,
    ], { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let errors = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => { errors += chunk; });
    child.stdout.resume();
    child.on('error', reject);
    child.stdin.on('error', (error) => {
      if (error.code !== 'EPIPE') reject(error);
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Speech synthesis exited ${code}: ${errors.trim()}`));
    });
    child.stdin.end(text, 'utf8');
  });
}

function waveInfo(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Speech output is not a RIFF/WAVE file.');
  }
  let format;
  let audioBytes;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const chunk = buffer.toString('ascii', offset, offset + 4);
    const length = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (start + length > buffer.length) throw new Error(`Truncated WAV chunk: ${chunk}`);
    if (chunk === 'fmt ') {
      if (length < 16) throw new Error('Incomplete WAV format chunk.');
      format = {
        encoding: buffer.readUInt16LE(start),
        channels: buffer.readUInt16LE(start + 2),
        sampleRate: buffer.readUInt32LE(start + 4),
        bytesPerSecond: buffer.readUInt32LE(start + 8),
        bitsPerSample: buffer.readUInt16LE(start + 14),
      };
    }
    if (chunk === 'data') audioBytes = length;
    offset = start + length + (length % 2);
  }
  if (!format || format.encoding !== 1 || !audioBytes || !format.bytesPerSecond) {
    throw new Error('Expected non-empty PCM audio with a complete WAV header.');
  }
  return {
    ...format,
    durationSeconds: Number((audioBytes / format.bytesPerSecond).toFixed(3)),
    bytes: buffer.length,
  };
}

await mkdir(output, { recursive: true });
const files = [];
for (const id of [1, 6, 8]) {
  const cap = CAPITULOS.find((item) => Number(item.id) === id);
  if (!cap) throw new Error(`Missing chapter ${id}.`);
  for (const field of ['resumo', 'acao', 'pergunta']) {
    if (typeof cap[field] !== 'string' || !cap[field].trim()) {
      throw new Error(`Missing ${field} for chapter ${id}.`);
    }
  }
  const text = [cap.resumo, cap.acao, cap.pergunta].join('\n\n');
  const filename = `cap${id}-previa.wav`;
  const target = join(output, filename);
  const temporary = join(output, `cap${id}-previa.tmp.wav`);
  await speak(text, temporary);
  const buffer = await readFile(temporary);
  const info = waveInfo(buffer);
  await rename(temporary, target);
  files.push({
    chapter: id,
    file: filename,
    ...info,
    textSha256: createHash('sha256').update(text, 'utf8').digest('hex'),
  });
}
const manifest = {
  purpose: 'Voz automática de prévia; não é gravação autoral da equipe.',
  voice: 'Microsoft Maria Desktop',
  language: 'pt-BR',
  rate: 0,
  files,
};
await writeFile(join(output, 'previa-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(manifest, null, 2));
