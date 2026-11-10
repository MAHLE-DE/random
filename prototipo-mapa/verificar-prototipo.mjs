// Testes de produção: requer Node.js e Playwright. O HTML entregue não depende deles.
import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const output=process.env.QA_OUTPUT||'.producao/qa-slide-central';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={errors:[],requests:[],sizes:[],firstSlide:[],inspecaoModelo:[]};
function checkModel(s,etapa){const b=s.enquadramento,mx=1-2*b.margemPx/s.width,my=1-2*b.margemPx/s.height;if(b.pontos<1000||b.x0< -mx-.001||b.x1>mx+.001||b.y0< -my-.001||b.y1>my+.001||b.z0< -1||b.z1>1)throw new Error('Coletor recortado em '+etapa+': '+JSON.stringify(s));return b}
try{
 const page=await browser.newPage({offline:true,viewport:{width:1600,height:900}});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text().slice(0,1200))});page.on('request',r=>report.requests.push(r.url()));
 await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo,{timeout:60000});
 await page.waitForFunction(()=>prototipo.estado().coletor.rendered>0);
 const initial=await page.evaluate(()=>prototipo.estado()),last=initial.paradas-1,final=initial.paradas;
 if(initial.paradas!==10||initial.slides!==11||await page.locator('.step').count()!==11)throw new Error('Esperadas dez severidades e conclusão');
 const initialModel=await page.evaluate(()=>prototipo.estado().coletor);if(initialModel.dutos!==4||!initialModel.cut||initialModel.width<=0)throw new Error('Coletor não iniciou no slide 1');
 await page.locator('#coletor-corte').click();if((await page.evaluate(()=>prototipo.estado().coletor)).cut)throw new Error('Vista completa do coletor falhou');await page.locator('#coletor-corte').click();
 const modelBox=await page.locator('#coletor-viewport canvas').boundingBox();await page.mouse.move(modelBox.x+modelBox.width*.5,modelBox.y+modelBox.height*.5);await page.mouse.down();await page.mouse.move(modelBox.x+modelBox.width*.5+65,modelBox.y+modelBox.height*.5+12,{steps:5});await page.mouse.up();if(Math.abs((await page.evaluate(()=>prototipo.estado().coletor)).rotation[1])<.2)throw new Error('Rotação do coletor falhou');await page.locator('#coletor-restaurar').click();
 await page.locator('#coletor-mais').click();if((await page.evaluate(()=>prototipo.estado().coletor.zoom))<=initialModel.zoom)throw new Error('Zoom + falhou');await page.locator('#coletor-menos').click();
 await page.locator('#coletor-viewport').hover();await page.mouse.wheel(0,-220);if((await page.evaluate(()=>prototipo.estado().coletor.zoom))<=initialModel.zoom)throw new Error('Zoom pela roda falhou');
 await page.locator('#coletor-marcas').click();if(!(await page.evaluate(()=>prototipo.estado().coletor.focus)))throw new Error('Foco nas marcações falhou');await page.screenshot({path:`${output}/foco-marcacoes.png`});
 await page.locator('#coletor-restaurar').click();const resetModel=await page.evaluate(()=>prototipo.estado().coletor);if(resetModel.focus||Math.abs(resetModel.zoom-1.1)>.001||resetModel.rotation.some(v=>v!==0))throw new Error('Reenquadramento falhou');
 const renders=resetModel.rendered;await page.waitForTimeout(600);if((await page.evaluate(()=>prototipo.estado().coletor.rendered))!==renders)throw new Error('Visor renderizando sem interação');
 report.coletor={dutos:initialModel.dutos,marcacoesAusentes:initialModel.marcacoesAusentes,corte:true,completo:true,rotacao:true,zoomBotoes:true,zoomRoda:true,foco:true,reenquadramento:true,sobDemanda:true};
 for(const size of [{width:1600,height:900},{width:1280,height:960},{width:1280,height:720}]){
  await page.setViewportSize(size);await page.waitForTimeout(700);
  const layout=await page.evaluate(()=>{const box=e=>e.getBoundingClientRect().toJSON(),panel=document.querySelector('#conteudo'),styles=e=>{const s=getComputedStyle(e);return{fonte:parseFloat(s.fontSize),peso:Number(s.fontWeight),cor:s.color,fundo:s.backgroundColor}};return{panel:box(panel),logo:box(document.querySelector('.slide-brand')),text:box(document.querySelector('.meaning')),sections:[...document.querySelectorAll('.meaning section')].map(box),model:box(document.querySelector('#coletor-viewport')),legend:box(document.querySelector('.field-legend')),tools:box(document.querySelector('#ferramentas-modelo')),footer:box(document.querySelector('.bottom')),severity:styles(document.querySelector('#titulo-parada')),legendStyle:styles(document.querySelector('.field-legend')),legendChip:styles(document.querySelector('.field-legend>span')),bodyStyle:styles(document.querySelector('.meaning p')),alpha:getComputedStyle(panel).backgroundColor,scroll:panel.scrollHeight,client:panel.clientHeight,functionText:document.querySelector('#descricao').textContent,removed:[...document.querySelectorAll('#conteudo *')].some(e=>e.children.length===0&&/REFERÊNCIA K24|ARRASTE PARA GIRAR/.test(e.textContent)),navWidth:document.querySelector('#numeros').clientWidth,stepWidth:document.querySelector('.step').offsetWidth}});
  if(Math.abs(layout.panel.width-size.width*.8)>1||Math.abs(layout.panel.height-size.height*.8)>1||Math.abs(layout.panel.x-size.width*.1)>1||Math.abs(layout.panel.y-size.height*.1)>1||!layout.alpha.includes('0.85'))throw new Error('Tamanho/centralização/transparência do painel incorreto');
  if(layout.logo.right>layout.panel.right||layout.logo.top<layout.panel.top||layout.logo.left<layout.panel.left+layout.panel.width*.7)throw new Error('Logo fora do canto do slide');
  if(layout.text.right>layout.model.left+1||layout.legend.bottom>layout.tools.top+1||layout.scroll>layout.client+1||layout.removed)throw new Error('Conteúdo sobreposto/recortado: '+JSON.stringify(layout));
  if(layout.sections.at(-1).bottom>layout.tools.top||layout.panel.bottom>layout.footer.top+1||layout.model.bottom>layout.legend.top)throw new Error('Modelo/texto/controles sobrepostos: '+JSON.stringify(layout));
  if(layout.severity.fonte<20||layout.severity.peso<700||layout.severity.cor!=='rgb(0, 62, 174)'||layout.legendStyle.fonte<14||layout.bodyStyle.fonte<17)throw new Error('Fontes sem o destaque solicitado');
  if(layout.functionText!=='Garantir marcação dos componentes com data de injeção, número do componente e número de cavidade')throw new Error('Função diferente da solicitada');
  if(layout.navWidth!==5*layout.stepWidth+4*8)throw new Error('Lista não mostra cinco números');
  report.firstSlide.push({...size,...layout});await page.screenshot({path:`${output}/${size.width}x${size.height}-01.png`});
  // Giro por gestos reais, em todas as direções, com aproximação máxima.
  // Conferimos os vértices de todas as malhas em corte e no conjunto completo.
  for(const cut of [true,false]){
   if((await page.evaluate(()=>prototipo.estado().coletor.cut))!==cut)await page.locator('#coletor-corte').click();
   await page.locator('#coletor-restaurar').click();checkModel(await page.evaluate(()=>prototipo.estado().coletor),'vista inicial');
   await page.locator('#coletor-viewport').hover();await page.mouse.wheel(0,10000);let s=await page.evaluate(()=>prototipo.estado().coletor);checkModel(s,'zoom mínimo');if(s.zoom!==.6)throw new Error('Zoom mínimo falhou');
   await page.mouse.wheel(0,-10000);s=await page.evaluate(()=>prototipo.estado().coletor);checkModel(s,'zoom máximo');if(s.zoom!==1.25)throw new Error('Zoom máximo falhou');
   const frame=await page.locator('#coletor-viewport canvas').boundingBox(),samples=[];
   for(let i=0;i<16;i++){const x=frame.x+frame.width*.5,y=frame.y+frame.height*.5;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+90,y+(i%4<2?80:-80),{steps:3});await page.mouse.up();s=await page.evaluate(()=>prototipo.estado().coletor);samples.push({rotacao:s.rotation,limites:checkModel(s,`giro ${i} em ${size.width}x${size.height}, corte=${cut}`)});if(i===5||i===12)await page.screenshot({path:`${output}/${size.width}x${size.height}-${cut?'corte':'completo'}-giro${i}.png`})}
   await page.locator('#coletor-marcas').click();checkModel(await page.evaluate(()=>prototipo.estado().coletor),'foco nas marcações');
   report.inspecaoModelo.push({...size,corte:cut,zoomMinimo:.6,zoomMaximo:1.25,amostras:samples});
  }
  await page.locator('#coletor-corte').click();await page.locator('#coletor-restaurar').click();
 }
 report.geometry=await page.evaluate(()=>prototipo.verificarGeometria());
 if(report.geometry.duracaoTransicao!==2.5||report.geometry.distanciasEntreParadas.length!==9||report.geometry.distanciasEntreParadas.some(d=>d<47))throw new Error('Distância ou duração entre paradas incorreta');
 if(report.geometry.minClearance<=0||report.geometry.negative||report.geometry.closureGap>.001)throw new Error('Geometria da estrada inválida: '+JSON.stringify(report.geometry));
 if(report.geometry.forestCount<3500||report.geometry.variantStats.length<20)throw new Error('Variedade/densidade insuficiente');
 const idle=()=>page.waitForFunction(()=>!prototipo.estado().moving&&!prototipo.estado().fading,{timeout:15000});
 for(const size of [{width:1600,height:900},{width:1280,height:960}]){
  await page.setViewportSize(size);await page.waitForTimeout(650);
  if((await page.evaluate(()=>prototipo.estado())).index!==0){await page.locator('#etapa-0').click();await idle()}
  const visibility=await page.evaluate(()=>prototipo.verificarVisibilidade());if(visibility.arvoresSemFolhas||[...visibility.paradas,visibility.acidente].some(p=>p.carro||p.numero||p.arvoreImpacto||!p.enquadrado))throw new Error('Visibilidade do mapa inválida: '+JSON.stringify(visibility));
  await page.evaluate(()=>{window.qaFrames=[];function collect(time){const s=prototipo.estado();if(s.moving||qaFrames.at(-1)?.moving)qaFrames.push({time,...s});requestAnimationFrame(collect)}if(!window.qaCollecting){qaCollecting=true;requestAnimationFrame(collect)}});
  await page.screenshot({path:`${output}/${size.width}-01.png`});
  for(let i=1;i<=final;i++){
   await page.locator('#proximo').click();if(i===last){await page.waitForFunction(()=>prototipo.estado().crashTime!==null);await page.waitForTimeout(200);await page.screenshot({path:`${output}/${size.width}-derrapagem.png`})}
   await idle();await page.waitForTimeout(280);const s=await page.evaluate(()=>prototipo.estado());if(s.index!==i)throw new Error('Destino de navegação incorreto');
   if((await page.locator('#coletor-viewport').isVisible())!==(i<4))throw new Error('Visibilidade incorreta do coletor no slide '+(i+1));
   await page.screenshot({path:`${output}/${size.width}-${String(i+1).padStart(2,'0')}.png`});console.log('CENA',size.width,i+1);
  }
  const end=await page.evaluate(()=>prototipo.estado());if(end.impacts!==1||!end.fire||!end.conclusion)throw new Error('Impacto/fogo/conclusão incorreto');
  await page.locator('#anterior').click();await idle();if((await page.evaluate(()=>prototipo.estado())).impacts!==1)throw new Error('Impacto se repetiu no retorno');
  for(let i=0;i<last;i++){await page.locator('#anterior').click();await idle()}
  const frames=await page.evaluate(()=>qaFrames),outside=frames.filter(s=>s.carBounds.some(v=>Math.abs(v[0])>.97||Math.abs(v[1])>.94));if(outside.length)throw new Error('Carro saiu da tela em '+outside.length+' quadros');
  const durations=[];for(let k=0;k<frames.length;k++){const start=frames[k];if(!start.tracking||frames[k-1]?.tracking)continue;let j=k+1;while(j<frames.length&&frames[j].tracking)j++;if(j<frames.length&&frames[j].crashTime===null){const seconds=(frames[j].time-start.time)/1000;if(seconds<2.25||seconds>2.75)throw new Error('Transição fora de 2,5 s: '+seconds);durations.push(seconds)}}
  const skid=frames.filter(s=>s.crashTime!==null&&s.crashTime<s.contactTime&&s.crashTime>.08),speeds=skid.slice(1).map((s,i)=>Math.hypot(...s.car.map((v,j)=>v-skid[i].car[j]))/((s.time-skid[i].time)/1000));
  const first=speeds.slice(0,Math.max(1,Math.floor(speeds.length/3))),lastSpeeds=speeds.slice(-Math.max(1,Math.floor(speeds.length/3))),average=a=>a.reduce((a,v)=>a+v,0)/a.length,ratio=average(lastSpeeds)/average(first);
  if(!Number.isFinite(ratio)||ratio<.90)throw new Error('Desaceleração excessiva antes da batida: '+ratio);
  for(const s of skid)if(s.skidDrawCounts.some(n=>n!==(s.skidSamples-1)*6))throw new Error('Marcas de derrapagem reveladas antes dos pneus');
  report.sizes.push({...size,frames:frames.length,duracoesTransicoes:durations,initialSpeed:average(first),finalSpeed:average(lastSpeeds),speedRatio:ratio,contactTime:skid[0]?.contactTime,final:end});
 }
 // Replay e cancelamento devem restaurar o carro e os efeitos.
 await page.locator('#etapa-'+last).click();await page.waitForFunction(()=>prototipo.estado().crashTime!==null);await page.locator('#etapa-1').click();await idle();await page.waitForTimeout(3300);
 const reset=await page.evaluate(()=>prototipo.estado());if(reset.fire||reset.crashed||reset.index!==1)throw new Error('Cancelamento da sequência falhou');
 const start=Date.now();await page.evaluate(final=>prototipo.selectSlide(final),final);await idle();report.fadeMs=Date.now()-start;if(report.fadeMs>2000)throw new Error('Salto distante percorreu a estrada');
 if(report.errors.length||report.requests.some(r=>/^https?:/.test(r)))throw new Error('Erro de execução ou dependência de rede');
 await fs.writeFile(`${output}/relatorio.json`,JSON.stringify(report,null,2));console.log('APROVADO',JSON.stringify({geometry:report.geometry,sizes:report.sizes.map(s=>({width:s.width,frames:s.frames,speedRatio:s.speedRatio}))}));
}catch(error){await fs.writeFile(`${output}/falha.json`,JSON.stringify({...report,error:error.message},null,2));throw error}finally{await browser.close()}
