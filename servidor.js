'use strict';

const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const defaultHtml = path.resolve(__dirname, 'index.html');
const [htmlPath = defaultHtml, requestedPort = '8080'] = process.argv.slice(2);
const port = Number(requestedPort);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error('A porta deve ser um inteiro de 0 a 65535.');
}

function readDeck(html) {
  const marker = 'const DECK = ';
  const start = html.indexOf(marker);
  if (start === -1) throw new Error('Objeto DECK não encontrado no HTML.');
  const first = start + marker.length;
  let depth = 0, quoted = false, escaped = false;
  for (let i = first; i < html.length; i++) {
    const ch = html[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') quoted = false;
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}' && --depth === 0) {
      if (!/^\s*;/.test(html.slice(i + 1))) break;
      const { frames, notes } = JSON.parse(html.slice(first, i + 1));
      if (!Array.isArray(frames) || !frames.length) throw new Error('DECK sem quadros.');
      return {
        frames: frames.map(({ thumb, number, label, slide }) => ({ thumb, number, label, slide })),
        notes
      };
    }
  }
  throw new Error('Não foi encontrado o fim do objeto DECK.');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const deck = readDeck(html);
const deckJson = JSON.stringify(deck);
const presentation = html.replace(/connect-src\s+'none'(?=;|")/, "connect-src 'self'");
const clients = new Set();
let cur = 0;

function event(response, type, payload) {
  response.write('event: ' + type + '\ndata: ' + JSON.stringify(payload) + '\n\n');
}

function broadcast(type, payload) {
  for (const response of clients) event(response, type, payload);
}

function send(response, status, contentType, body = '') {
  response.writeHead(status, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
  response.end(body);
}

async function jsonBody(request) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] || '')) {
    request.resume();
    throw new Error('Envie application/json.');
  }
  let body = '', bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes <= 1024) body += chunk.toString('utf8');
  }
  if (bytes > 1024) throw new Error('Corpo acima de 1024 bytes.');
  return JSON.parse(body);
}

const validFrame = n => Number.isInteger(n) && n >= 0 && n < deck.frames.length;
const server = http.createServer(async (request, response) => {
  const route = request.url.split('?')[0];
  const plain = 'text/plain; charset=utf-8';
  const htmlType = 'text/html; charset=utf-8';
  if (request.method === 'GET') {
    if (route === '/') return send(response, 200, htmlType, presentation);
    if (route === '/celular') return send(response, 200, htmlType, phonePage);
    if (route === '/deck.json') return send(response, 200, 'application/json; charset=utf-8', deckJson);
    if (route === '/events') {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      });
      response.write('retry: 1500\n\n');
      clients.add(response);
      response.on('close', () => clients.delete(response));
      event(response, 'state', { cur });
      return;
    }
  }
  if (request.method === 'POST' && (route === '/state' || route === '/cmd')) {
    try {
      const data = await jsonBody(request);
      if (route === '/state') {
        if (!validFrame(data?.cur)) return send(response, 400, plain, 'Quadro inválido.');
        cur = data.cur;
        broadcast('state', { cur });
      } else {
        const { acao, n } = data || {};
        if (acao !== 'next' && acao !== 'prev' && !(acao === 'goto' && validFrame(n))) {
          return send(response, 400, plain, 'Comando inválido.');
        }
        broadcast('command', { acao, n });
      }
      return send(response, 204, plain);
    } catch {
      return send(response, 400, plain, 'Corpo JSON inválido.');
    }
  }
  return send(response, 404, plain, 'Página não encontrada.');
});

const heartbeat = setInterval(() => {
  for (const response of clients) response.write(': aberto\n\n');
}, 15000);
heartbeat.unref();
server.on('close', () => clearInterval(heartbeat));

const phonePage = `<!doctype html>
<html lang="pt-BR">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Painel do apresentador</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#10171d;color:#eff3f5;font:16px/1.45 system-ui,sans-serif}
main{max-width:640px;margin:auto;padding:16px 16px calc(92px + env(safe-area-inset-bottom))}
h1,h2{font-size:1rem;margin:0 0 8px}
section{margin-bottom:16px}
img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#1a252c;border-radius:5px}
img[hidden]{display:none}
#current-slide{width:45%;min-width:120px}
#build{margin-left:8px;padding:2px 8px;background:#24444b;border-radius:8px;font-size:.8rem}
#status{display:flex;align-items:center;justify-content:space-between;gap:12px}
button{font:inherit;color:inherit;background:#20333c;border:1px solid #53636c;border-radius:8px}
#timer{padding:8px 14px;font-variant-numeric:tabular-nums}
#notes{max-height:32vh;overflow:auto;overscroll-behavior:contain;white-space:pre-wrap;background:#19242b;padding:12px;border-radius:6px}
#connection{color:#b6c8cc;font-size:.875rem;min-height:1.3em}
footer{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:center;gap:12px;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:#10171d;border-top:1px solid #53636c}
footer button{width:min(45%,300px);min-height:56px;font-size:1.65rem;background:#1d555e}
button:disabled{opacity:.45}
</style>
<body>
<main>
  <section><h1>Próximo <span id="build" hidden>animação</span></h1><img id="next-slide" alt="" hidden><p id="end" hidden>Fim da apresentação</p></section>
  <section><h2>Atual</h2><img id="current-slide" alt="" hidden></section>
  <section id="status"><span id="position" aria-live="polite"></span><button id="timer" type="button" aria-label="Iniciar ou pausar cronômetro" aria-pressed="false">0:00</button></section>
  <section><h2>Notas</h2><div id="notes" tabindex="0"></div></section>
  <div id="connection" role="status">Conectando…</div>
</main>
<footer><button id="prev" type="button" aria-label="Voltar" disabled>◀</button><button id="next" type="button" aria-label="Avançar" disabled>▶</button></footer>
<script>
'use strict';
const byId = id => document.getElementById(id);
const connection = byId('connection'), timer = byId('timer');
let deck, cur = 0, elapsed = 0, start = null, online = false;

function preview(id, frame) {
  const img = byId(id);
  img.hidden = !frame?.thumb;
  if (frame?.thumb && img.getAttribute('src') !== frame.thumb) img.src = frame.thumb;
  img.alt = frame?.label || '';
}

function render() {
  if (!deck) return;
  const current = deck.frames[cur], next = deck.frames[cur + 1];
  preview('current-slide', current);
  preview('next-slide', next);
  byId('end').hidden = Boolean(next);
  byId('build').hidden = !next || next.slide !== current.slide;
  byId('position').textContent = 'slide ' + (current.number ?? '—') + ' · quadro ' + (cur + 1) + '/' + deck.frames.length;
  const notes = byId('notes'), note = deck.notes[current.slide] || 'Sem notas.';
  if (notes.textContent !== note) {
    notes.textContent = note;
    notes.scrollTop = 0;
  }
  byId('prev').disabled = !online || cur === 0;
  byId('next').disabled = !online || !next;
}

function tick() {
  const seconds = Math.floor((elapsed + (start === null ? 0 : performance.now() - start)) / 1000);
  timer.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}

timer.addEventListener('click', () => {
  if (start === null) start = performance.now();
  else { elapsed += performance.now() - start; start = null; }
  timer.setAttribute('aria-pressed', String(start !== null));
  tick();
});
setInterval(tick, 250);

async function command(acao) {
  try {
    const response = await fetch('/cmd', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ acao })
    });
    if (!response.ok) throw new Error();
    connection.textContent = '';
  } catch {
    connection.textContent = 'Comando não enviado.';
  }
}

for (const direction of ['prev', 'next']) {
  byId(direction).addEventListener('click', () => command(direction));
}

const events = new EventSource('/events');
events.addEventListener('open', () => { online = true; connection.textContent = ''; render(); });
events.addEventListener('error', () => { online = false; connection.textContent = 'Reconectando…'; render(); });
events.addEventListener('state', event => { cur = JSON.parse(event.data).cur; render(); });
fetch('/deck.json').then(response => {
  if (!response.ok) throw new Error();
  return response.json();
}).then(data => { deck = data; render(); }).catch(() => {
  connection.textContent = 'Não foi possível carregar os quadros. Recarregue a página.';
});
</script>
</body>
</html>`;

server.listen(port, '0.0.0.0', () => {
  const activePort = server.address().port;
  console.log('Notebook: http://localhost:' + activePort + '/');
  const addresses = new Set(Object.values(os.networkInterfaces()).flat().filter(
    entry => entry && !entry.internal && (entry.family === 'IPv4' || entry.family === 4)
  ).map(entry => entry.address));
  for (const address of addresses) console.log('Celular: http://' + address + ':' + activePort + '/celular');
  console.log('Na primeira vez, o Firewall do Windows pode pedir permissão. Use uma rede privada de confiança.');
});
