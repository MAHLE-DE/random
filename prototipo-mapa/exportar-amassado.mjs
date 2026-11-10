// Ferramenta de produção. Não é necessária para abrir o protótipo.
// Requer Node.js, Playwright e um navegador Chromium instalado.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const executablePath=process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser=await chromium.launch({executablePath,headless:true});
try{
 const page=await browser.newPage({offline:true});
 await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo);
 let exporter=await fs.readFile('fontes/vendor/GLTFExporter.js','utf8');
 exporter=exporter.replace(/^import \{([\s\S]*?)\} from 'three';/,(_,names)=>`const {${names}}=T;`).replace('export { GLTFExporter };','window.ExportadorGLB=GLTFExporter;');
 await page.addScriptTag({content:'(()=>{'+exporter+'})();'});
 const data=await page.evaluate(async()=>{const model=prototipo.exportarAmassado();const buffer=await new ExportadorGLB().parseAsync(model,{binary:true});return Array.from(new Uint8Array(buffer))});
 const bytes=new Uint8Array(data),view=new DataView(bytes.buffer);
 const json=JSON.parse(new TextDecoder().decode(bytes.slice(20,20+view.getUint32(12,true))));
 if(!json.meshes?.length)throw new Error('Modelo exportado vazio');
 await fs.writeFile('modelos/carro-amassado.glb',new Uint8Array(data));
 const preview=await page.evaluate(()=>{
  const scene=new T.Scene();scene.background=new T.Color('#ffffff');const model=prototipo.exportarAmassado();scene.add(model);
  scene.add(new T.HemisphereLight(0xffffff,0xcbd8e8,2.8));const key=new T.DirectionalLight(0xffffff,3);key.position.set(4,7,5);scene.add(key);
  const camera=new T.PerspectiveCamera(35,1.5,.1,100);camera.position.set(5,3.2,5.6);camera.lookAt(0,.75,0);
  const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1200,800);renderer.outputColorSpace=T.SRGBColorSpace;renderer.render(scene,camera);
  const png=renderer.domElement.toDataURL('image/png');renderer.dispose();return png;
 });
 await fs.writeFile('modelos/previa-carro-amassado.png',Buffer.from(preview.split(',')[1],'base64'));
 console.log('Modelo amassado exportado:',data.length,'bytes');
}finally{await browser.close()}
