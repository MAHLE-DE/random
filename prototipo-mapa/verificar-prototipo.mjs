// Testes de produção: requer Node.js e Playwright. O HTML entregue não depende deles.
import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const output=process.env.QA_OUTPUT||'.producao/qa-floresta';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={errors:[],requests:[],sizes:[]};
try{
 const page=await browser.newPage({offline:true,viewport:{width:1600,height:900}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text().slice(0,1200))});page.on('request',r=>report.requests.push(r.url()));
 await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo,{timeout:60000});
 await page.waitForFunction(()=>prototipo.estado().coletor.rendered>0);
 const initialModel=await page.evaluate(()=>prototipo.estado().coletor);if(initialModel.dutos!==4||!initialModel.cut||initialModel.width<=0)throw new Error('Coletor não iniciou no slide 1');
 await page.locator('#coletor-corte').click();if((await page.evaluate(()=>prototipo.estado().coletor)).cut)throw new Error('Vista completa do coletor falhou');await page.locator('#coletor-corte').click();
 const modelBox=await page.locator('#coletor-viewport canvas').boundingBox();await page.mouse.move(modelBox.x+modelBox.width*.5,modelBox.y+modelBox.height*.5);await page.mouse.down();await page.mouse.move(modelBox.x+modelBox.width*.5+65,modelBox.y+modelBox.height*.5+12,{steps:5});await page.mouse.up();if(Math.abs((await page.evaluate(()=>prototipo.estado().coletor)).rotation[1])<.2)throw new Error('Rotação do coletor falhou');await page.locator('#coletor-restaurar').click();
 report.coletor={dutos:initialModel.dutos,corte:true,completo:true,rotacao:true,reenquadramento:true};
 report.geometry=await page.evaluate(()=>prototipo.verificarGeometria());
 if(report.geometry.minClearance<=0||report.geometry.negative||report.geometry.closureGap>.001)throw new Error('Geometria da estrada inválida: '+JSON.stringify(report.geometry));
 if(report.geometry.forestCount<3500||report.geometry.variantStats.length<20)throw new Error('Variedade/densidade insuficiente');
 const idle=()=>page.waitForFunction(()=>!prototipo.estado().moving&&!prototipo.estado().fading,{timeout:15000});
 for(const size of [{width:1600,height:900},{width:1280,height:960}]){
  await page.setViewportSize(size);await page.waitForTimeout(650);
  if((await page.evaluate(()=>prototipo.estado())).index!==0){await page.locator('#etapa-0').click();await idle()}
  await page.evaluate(()=>{window.qaFrames=[];function collect(time){const s=prototipo.estado();if(s.moving)qaFrames.push({time,...s});requestAnimationFrame(collect)}if(!window.qaCollecting){qaCollecting=true;requestAnimationFrame(collect)}});
  await page.screenshot({path:`${output}/${size.width}-01.png`});
  for(let i=1;i<=5;i++){
   await page.locator('#proximo').click();if(i===4){await page.waitForFunction(()=>prototipo.estado().crashTime!==null);await page.waitForTimeout(200);await page.screenshot({path:`${output}/${size.width}-derrapagem.png`})}
   await idle();await page.waitForTimeout(280);const s=await page.evaluate(()=>prototipo.estado());if(s.index!==i)throw new Error('Destino de navegação incorreto');
   if(i>0&&await page.locator('#coletor-viewport').isVisible())throw new Error('Coletor apareceu em outra cena');
   await page.screenshot({path:`${output}/${size.width}-${String(i+1).padStart(2,'0')}.png`});console.log('CENA',size.width,i+1);
  }
  const final=await page.evaluate(()=>prototipo.estado());if(final.impacts!==1||!final.fire)throw new Error('Impacto/fogo final incorreto');
  await page.locator('#anterior').click();await idle();if((await page.evaluate(()=>prototipo.estado())).impacts!==1)throw new Error('Impacto se repetiu no retorno');
  for(let i=0;i<4;i++){await page.locator('#anterior').click();await idle()}
  const frames=await page.evaluate(()=>qaFrames),outside=frames.filter(s=>s.carBounds.some(v=>Math.abs(v[0])>.97||Math.abs(v[1])>.94));if(outside.length)throw new Error('Carro saiu da tela em '+outside.length+' quadros');
  const skid=frames.filter(s=>s.crashTime!==null&&s.crashTime<s.contactTime&&s.crashTime>.08),speeds=skid.slice(1).map((s,i)=>Math.hypot(...s.car.map((v,j)=>v-skid[i].car[j]))/((s.time-skid[i].time)/1000));
  const first=speeds.slice(0,Math.max(1,Math.floor(speeds.length/3))),last=speeds.slice(-Math.max(1,Math.floor(speeds.length/3))),average=a=>a.reduce((a,v)=>a+v,0)/a.length,ratio=average(last)/average(first);
  if(!Number.isFinite(ratio)||ratio<.90)throw new Error('Desaceleração excessiva antes da batida: '+ratio);
  for(const s of skid)if(s.skidDrawCounts.some(n=>n!==(s.skidSamples-1)*6))throw new Error('Marcas de derrapagem reveladas antes dos pneus');
  report.sizes.push({...size,frames:frames.length,initialSpeed:average(first),finalSpeed:average(last),speedRatio:ratio,contactTime:skid[0]?.contactTime,final});
 }
 // Replay e cancelamento devem restaurar o carro e os efeitos.
 await page.locator('#etapa-4').click();await page.waitForFunction(()=>prototipo.estado().crashTime!==null);await page.locator('#etapa-1').click();await idle();await page.waitForTimeout(3300);
 const reset=await page.evaluate(()=>prototipo.estado());if(reset.fire||reset.crashed||reset.index!==1)throw new Error('Cancelamento da sequência falhou');
 if(report.errors.length||report.requests.some(r=>/^https?:/.test(r)))throw new Error('Erro de execução ou dependência de rede');
 await fs.writeFile(`${output}/relatorio.json`,JSON.stringify(report,null,2));console.log('APROVADO',JSON.stringify({geometry:report.geometry,sizes:report.sizes.map(s=>({width:s.width,frames:s.frames,speedRatio:s.speedRatio}))}));
}catch(error){await fs.writeFile(`${output}/falha.json`,JSON.stringify({...report,error:error.message},null,2));throw error}finally{await browser.close()}
