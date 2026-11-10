// Exportação de recursos editáveis; ferramenta apenas da máquina de produção.
import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const browser=await chromium.launch({executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{const page=await browser.newPage({offline:true});await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo,{timeout:60000});
let source=await fs.readFile('fontes/vendor/GLTFExporter.js','utf8');source=source.replace(/^import \{([\s\S]*?)\} from 'three';/,(_,names)=>`const {${names}}=T;`).replace('export { GLTFExporter };','window.ExportadorArvores=GLTFExporter;');await page.addScriptTag({content:'(()=>{'+source+'})();'});
await fs.mkdir('modelos/arvores',{recursive:true});
for(const [index,name]of [[3,'conifera'],[12,'frondosa'],[18,'frondosa-variada']]){const data=await page.evaluate(async index=>Array.from(new Uint8Array(await new ExportadorArvores().parseAsync(prototipo.exportarArvore(index),{binary:true}))),index);if(data.length<1000)throw new Error('Modelo vazio');await fs.writeFile(`modelos/arvores/${name}.glb`,new Uint8Array(data));console.log('EXPORTADO',name,data.length)}
}finally{await browser.close()}
