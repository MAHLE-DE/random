// Empacota tudo em um HTML local. Uso na produção: node prototipo-mapa/gerar.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(base,'..');
const three=await fs.readFile(path.join(root,'fontes/vendor/three.module.js'),'utf8');
const license=await fs.readFile(path.join(root,'fontes/vendor/LICENCA-THREE.txt'),'utf8');
// A versão fixada 0.170.0 é um módulo único, sem importações externas.
const exportMatch=three.match(/export \{ ([^}]+) \};\s*$/);
if(!exportMatch)throw new Error('Formato da biblioteca diferente do esperado');
const bundled=three.replace(exportMatch[0],`const T = { ${exportMatch[1]} };`);
const car=(await fs.readFile(path.join(root,'modelos/carro.glb'))).toString('base64');
let svg=await fs.readFile(path.join(root,'midias/mahle-azul.svg'),'utf8');
svg=svg.slice(svg.indexOf('<svg')).replace('<svg','<svg class="brand" role="img" aria-label="MAHLE"');
const damage=await fs.readFile(path.join(base,'dano.js'),'utf8');
const vegetation=await fs.readFile(path.join(base,'vegetacao.js'),'utf8');
const manifold=await fs.readFile(path.join(base,'coletor.js'),'utf8');
let app=(await fs.readFile(path.join(base,'movimento.js'),'utf8')).replace('__CARRO_BASE64__',car).replace('__DANO_SOURCE__',()=>damage).replace('__VEGETACAO_SOURCE__',()=>vegetation).replace('__COLETOR_SOURCE__',()=>manifold);
const steps=Array.from({length:6},(_,i)=>`<button class="step" id="etapa-${i}" aria-label="Selecionar slide ${i+1}${i===5?', conclusão':''}" type="button">${String(i+1).padStart(2,'0')}</button>`).join('');
let html=await fs.readFile(path.join(base,'interface.html'),'utf8');
html=html.replace('__LOGO__',svg).replace('__ETAPAS__',steps).replace('__THREE__',()=>bundled).replace('__APP__',()=>app);
html=html.replace('<html lang="pt-BR">',()=>`<!-- Licença da biblioteca incorporada:\n${license}\n-->\n<html lang="pt-BR">`);
await fs.writeFile(path.join(base,'iniciar.html'),html);
console.log('Arquivo offline gerado:',path.join(base,'iniciar.html'));
