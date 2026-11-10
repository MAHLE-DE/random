import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const browser=await chromium.launch({executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{const page=await browser.newPage({offline:true,viewport:{width:1600,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,600))});
await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo,{timeout:60000});
await fs.mkdir('modelos/arvores',{recursive:true});await fs.mkdir('.producao',{recursive:true});
for(const index of [-1,3,12,18]){
 const preview=await page.evaluate(index=>{const s=new T.Scene(),collection=new T.Group();s.add(collection);s.background=new T.Color('#d8dfca');const ground=new T.Mesh(new T.PlaneGeometry(160,160),new T.MeshStandardMaterial({color:'#667f4a',roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;s.add(ground);
 s.add(new T.HemisphereLight('#d4e3ed','#283626',1.25));const light=new T.DirectionalLight('#fff1ce',3);light.position.set(-15,26,16);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-30,right:30,top:30,bottom:-30,far:100});light.shadow.normalBias=.02;s.add(light);
 if(index<0){for(let i=0;i<20;i++){const t=prototipo.exportarArvore(i);t.position.set((i%5-2)*7.4,0,(Math.floor(i/5)-1.5)*8);collection.add(t)}}else collection.add(prototipo.exportarArvore(index));
 const w=index<0?2200:1100,h=index<0?1600:1100,c=new T.PerspectiveCamera(37,w/h,.8,200);c.position.copy(index<0?new T.Vector3(27,30,45):new T.Vector3(10,7,12));c.lookAt(0,index<0?2.5:3.6,0);
 const bounds=new T.Box3().setFromObject(collection),center=bounds.getCenter(new T.Vector3()),direction=c.position.clone().sub(center).normalize();let distance=c.position.distanceTo(center);
 for(let step=0;step<60;step++){c.position.copy(center).addScaledVector(direction,distance);c.lookAt(center);c.updateMatrixWorld();let visible=true;for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const v=new T.Vector3(x,y,z).project(c);if(Math.abs(v.x)>.90||Math.abs(v.y)>.90)visible=false}if(visible)break;distance*=1.04}
 const r=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});r.setSize(w,h);r.shadowMap.enabled=true;r.shadowMap.type=T.PCFShadowMap;light.shadow.radius=2.2;r.toneMapping=T.ACESFilmicToneMapping;r.render(s,c);const png=r.domElement.toDataURL();r.dispose();return png},index);
 const name=index<0?'galeria':index===3?'conifera':index===12?'frondosa':'frondosa-variada';await fs.writeFile(`modelos/arvores/${name}.png`,Buffer.from(preview.split(',')[1],'base64'));
}
await page.screenshot({path:'.producao/floresta-inicio.png'});await page.locator('#etapa-5').click();await page.waitForFunction(()=>prototipo.estado().index===5&&!prototipo.estado().fading);await page.waitForTimeout(400);await page.screenshot({path:'.producao/floresta-aerea.png'});
console.log(JSON.stringify({errors,state:await page.evaluate(()=>prototipo.estado())}));if(errors.length)throw new Error('Falha de execução');
}finally{await browser.close()}
