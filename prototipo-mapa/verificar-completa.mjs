// Regressão da versão completa: passos manuais, 15 funções, dez paradas e inspeção livre.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const output=process.env.QA_OUTPUT||'.producao/qa-completa';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={errors:[],network:[],sizes:[],navigation:[],source:'apresentacao_qualidade_completa.xlsx'};
const assert=(ok,message)=>{if(!ok)throw Error(message)};
function frame(s,label){const b=s.enquadramento,mx=1-2*b.margemPx/s.width,my=1-2*b.margemPx/s.height;assert(b.pontos>1000&&b.x0>=-mx-.002&&b.x1<=mx+.002&&b.y0>=-my-.002&&b.y1<=my+.002&&b.z0>=-1&&b.z1<=1,'Modelo cortado: '+label+' '+JSON.stringify(b))}
try{
 const page=await browser.newPage({offline:true,viewport:{width:1600,height:900}});page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text().slice(0,1200))});page.on('request',r=>{if(/^https?:/.test(r.url()))report.network.push(r.url())});
 await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo,{timeout:90000});
 const script=await page.evaluate(()=>prototipo.roteiro);assert(script.length===15,'Esperadas 15 funções da planilha');assert(new Set(script.map(s=>s.linha)).size===15&&script.every((s,i)=>s.linha===i+3),'Correspondência de linhas da planilha');
 const state=()=>page.evaluate(()=>prototipo.estado());const idle=()=>page.waitForFunction(()=>!prototipo.estado().moving&&!prototipo.estado().fading,null,{timeout:20000});
 const select=async i=>{await page.evaluate(i=>prototipo.selectSlide(i),i);await idle();};
 for(const size of [{width:1600,height:900},{width:1280,height:720},{width:1280,height:960}]){
  await page.setViewportSize(size);await page.waitForTimeout(500);const entry={...size,slides:[]};
  for(let i=0;i<script.length;i++){
   await select(i);let s=await state();assert(!s.coletor.cut,'Entrada deve mostrar coletor completo');
   assert(s.index===script[i].severidade-1,'Parada incorreta');assert(s.demoStep===0,'Demonstração não iniciou no passo zero');
   const car=s.car;
   for(let j=0;j<script[i].etapas.length;j++){
    if(j){await page.keyboard.press('ArrowRight');assert((await state()).demoStep===j,'Seta não avança etapa: '+i+'/'+j)}
    await page.waitForTimeout(75);s=await state();frame(s.coletor,`${i}/${j}/${size.width}`);
    assert(JSON.stringify(s.car)===JSON.stringify(car),'Carro se moveu durante demonstração');
    const layout=await page.evaluate(()=>{const b=e=>e.getBoundingClientRect().toJSON(),panel=document.querySelector('#conteudo');return{panel:b(panel),footer:b(document.querySelector('.bottom')),meaning:b(document.querySelector('.meaning')),sections:[...document.querySelectorAll('.meaning>section')].map(b),sequence:b(document.querySelector('#sequencia')),model:b(document.querySelector('#coletor-viewport')),diagram:b(document.querySelector('#diagrama')),legend:b(document.querySelector('.field-legend')),tools:b(document.querySelector('.model-tools')),scroll:panel.scrollHeight,client:panel.clientHeight}});
    assert(Math.abs(layout.panel.width-size.width*.9)<1&&Math.abs(layout.panel.height-size.height*.9)<1,'Painel diferente de 90%');
    assert(layout.panel.bottom+2<=layout.footer.top,'Slide sobrepõe navegação');assert(layout.scroll<=layout.client+1,'Slide possui conteúdo cortado');
    assert(layout.sections.at(-1).bottom+3<=layout.sequence.top,'Texto sobrepõe demonstração');assert(layout.meaning.right+4<=layout.model.left,'Texto sobrepõe modelo');
    assert(layout.model.height>100&&layout.model.bottom<=layout.diagram.top+1&&layout.diagram.bottom<=layout.legend.top+1&&layout.legend.bottom<=layout.tools.top+1&&layout.tools.bottom<layout.panel.bottom,'Sobreposição no visor');
    if(j===1)await page.screenshot({path:`${output}/${size.width}x${size.height}-${String(i+1).padStart(2,'0')}-efeito.png`});
   }
   const final=await state();assert(!final.coletor.cut&&!final.coletor.transparent&&!final.coletor.demo.animated,'Final deve ser completo, opaco e livre');
   await page.waitForTimeout(200);assert((await state()).demoStep===script[i].etapas.length-1,'Avanço automático indevido');
   for(let k=0;k<3;k++){await page.locator('#legenda-'+k).click();const focused=(await state()).coletor;assert(focused.selected===k&&focused.alvos[k],'Legenda não localiza alvo visível: '+i+'/'+k);frame(focused,`foco ${i}/${k}`)}
   await page.locator('#coletor-corte').click();assert((await state()).coletor.cut,'Botão de corte');frame((await state()).coletor,'corte');await page.locator('#coletor-corte').click();
   await page.locator('#coletor-restaurar').click();const box=await page.locator('#coletor-viewport').boundingBox();
   await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.5+80,box.y+box.height*.5+35,{steps:3});await page.mouse.up();assert(Math.abs((await state()).coletor.rotation[1])>.4,'Giro indisponível no final');frame((await state()).coletor,'giro');
   await page.mouse.wheel(0,-10000);assert((await state()).coletor.zoom===1.25,'Zoom máximo');frame((await state()).coletor,'zoom');await page.locator('#coletor-restaurar').click();
   if(i===2||i===14)await page.screenshot({path:`${output}/${size.width}x${size.height}-${i+1}-final.png`});
   entry.slides.push({funcao:script[i].id,severidade:script[i].severidade,linha:script[i].linha,etapas:script[i].etapas.length,final3D:true,legendas:3,layout:true});
  }
  await select(script.length);const layout=await page.evaluate(()=>{const p=document.querySelector('#conteudo'),c=document.querySelector('#conclusao-conteudo');return{scroll:p.scrollHeight,client:p.clientHeight,visible:!c.classList.contains('hidden')}});assert(layout.visible&&layout.scroll<=layout.client,'Conclusão cortada');await page.screenshot({path:`${output}/${size.width}x${size.height}-conclusao.png`});report.sizes.push(entry);console.log('APROVADO',size.width,size.height);
 }
 await page.setViewportSize({width:1600,height:900});await select(0);
 for(let i=0;i<script.length;i++){
  await page.evaluate(()=>prototipo.setDemoStep(prototipo.roteiro[prototipo.estado().pageIndex].etapas.length-1));const before=await state();await page.locator('#proximo').click();await idle();const after=await state();assert(after.pageIndex===i+1,'Sequência de slides incorreta');
  if(i+1<script.length&&script[i].severidade===script[i+1].severidade)assert(JSON.stringify(before.car)===JSON.stringify(after.car),'Nova parada indevida na mesma severidade');
  assert(!after.crashed&&!after.fire&&after.impacts===0,'Acidente indevido na S10');report.navigation.push({from:i,to:i+1,stop:after.index,carStayed:JSON.stringify(before.car)===JSON.stringify(after.car)});
 }
 await page.locator('#anterior').click();await idle();assert((await state()).pageIndex===14,'Retorno da conclusão');
 const beforeBack=(await state()).coletor.rendered;await page.evaluate(()=>prototipo.setDemoStep(0));await page.locator('#anterior').click();await idle();await page.waitForTimeout(150);const back=await state();assert(back.pageIndex===13&&back.demoStep===script[13].etapas.length-1&&back.coletor.rendered>beforeBack,'Retorno deve redesenhar a inspeção final do slide anterior');
 await select(4);await page.evaluate(()=>prototipo.setDemoStep(3));await page.locator('#proximo').click();await page.waitForTimeout(100);await page.evaluate(()=>prototipo.selectSlide(2));await idle();assert((await state()).pageIndex===2,'Cancelamento de viagem');
 assert(!report.errors.length&&!report.network.length,'Erros de execução ou rede');await fs.writeFile(`${output}/relatorio.json`,JSON.stringify(report,null,2));console.log('APROVADO: 15 funções, 10 paradas, etapas, legendas, inspeção e navegação offline');
}catch(e){await fs.writeFile(`${output}/falha.json`,JSON.stringify({...report,error:e.message,stack:e.stack},null,2));throw e}finally{await browser.close()}
