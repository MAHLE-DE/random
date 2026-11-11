// Regressão: etapas reais, S1/S2 estáticos e fade restrito ao conteúdo da parada.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const output=process.env.QA_OUTPUT||'.producao/qa-completa';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={errors:[],network:[],sizes:[],navigation:[],fades:[],source:'apresentacao_qualidade_completa.xlsx'};
const assert=(ok,message)=>{if(!ok)throw Error(message)};
function frame(s,label){const b=s.enquadramento,mx=1-2*b.margemPx/s.width,my=1-2*b.margemPx/s.height;assert((b.detalhe===1?b.pontos>=8:b.pontos>1000)&&b.x0>=-mx-.002&&b.x1<=mx+.002&&b.y0>=-my-.002&&b.y1<=my+.002&&b.z0>=-1&&b.z1<=1,'Modelo ou detalhe cortado: '+label+' '+JSON.stringify(b))}
try{
 const page=await browser.newPage({offline:true,viewport:{width:1600,height:900}});page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text().slice(0,1200))});page.on('request',r=>{if(/^https?:/.test(r.url()))report.network.push(r.url())});
 await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo,{timeout:90000});
 const script=await page.evaluate(()=>prototipo.roteiro),indexOf=id=>script.findIndex(s=>s.id===id),expectedRows=Array.from({length:15},(_,i)=>i+3).filter(n=>![10,12].includes(n));assert(script.length===13&&!script.some(s=>['producao','limpeza'].includes(s.id)),'Esperadas 13 funções, sem produção e limpeza interna');assert(JSON.stringify(script.map(s=>s.linha))===JSON.stringify(expectedRows),'Correspondência de linhas da planilha');
 assert(script.every(s=>s.etapas.every(e=>!/inspeção 3d/i.test(e[0])))&&[1,2,3].every(i=>script[i].etapas.length===1)&&script[4].etapas.length===2&&script[5].etapas.length===3&&script[6].etapas.length===2&&script[indexOf('quimica')].etapas.length===2&&script[indexOf('distribuicao')].etapas.length===2&&script[indexOf('agua')].etapas.length===2&&script[indexOf('backfire')].etapas.length===2&&script.reduce((n,s)=>n+s.etapas.length,0)===28,'Inspeção extra ou quantidade de etapas incorreta');
 assert(!(await page.locator('.step').allTextContents()).some(t=>['6·3','7·3'].includes(t))&&await page.locator('.step').count()===14,'Slide removido ainda aparece na navegação');
 assert(await page.locator('#sequencia,#inspecionar-demo,#repetir-demo,.step-progress').count()===0,'Mapeador ou botão de inspeção ainda presente');
 assert(await page.locator('.meaning>section').count()===2&&await page.locator('.meaning>button,.meaning>div').count()===0,'Coluna esquerda deve conter só o texto explicativo');
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
    if(i===4&&j===1)await page.waitForFunction(()=>!prototipo.estado().coletor.animandoVista&&!prototipo.estado().coletor.demo.animated);
    if(i===6&&j===1)await page.waitForFunction(()=>!prototipo.estado().coletor.animandoVista&&prototipo.estado().coletor.demo.elapsed>4.7);
    if(script[i].id==='quimica'&&j===1)await page.waitForFunction(()=>!prototipo.estado().coletor.animandoVista&&!prototipo.estado().coletor.demo.animated);
    if(script[i].id==='agua'&&j===1)await page.waitForFunction(()=>prototipo.estado().coletor.demo.cena.concluido&&!prototipo.estado().coletor.animandoVista);
    if(script[i].id==='backfire'&&j===1)await page.waitForFunction(()=>prototipo.estado().coletor.demo.cena.concluido&&!prototipo.estado().coletor.animandoVista);
    if(script[i].id==='distribuicao'&&j===1)await page.waitForFunction(()=>prototipo.estado().coletor.demo.cena.progresso===1);
    await page.waitForTimeout(75);s=await state();frame(s.coletor,`${i}/${j}/${size.width}`);
    assert(JSON.stringify(s.car)===JSON.stringify(car),'Carro se moveu durante demonstração');
    assert(await page.locator('#coletor-transparencia').isVisible()===(script[i].id==='distribuicao'),'Botão de transparência deve existir somente na distribuição de ar');
    if(i<2){assert(!s.coletor.transparent&&!s.coletor.demo.animated&&s.coletor.demo.objetos===0,'S1/S2 deve ser opaco e sem animação de ar');assert(!await page.locator('#coletor-transparencia').isVisible(),'Transparência visível em S1/S2');const b=await page.locator('#coletor-viewport').boundingBox();await page.mouse.move(b.x+b.width*.5,b.y+b.height*.5);await page.mouse.down();await page.mouse.move(b.x+b.width*.5+80,b.y+b.height*.5+30,{steps:3});await page.mouse.up();assert(Math.abs((await state()).coletor.rotation[1])>.4,'Rotação indisponível em etapa S1/S2');frame((await state()).coletor,'giro S1/S2');await page.locator('#coletor-restaurar').click()}
    if(i===2){const d=s.coletor.detalhesTateis;assert(s.coletor.maos===2&&await page.locator('#maos-tato').isVisible()&&s.coletor.demo.objetos===0&&!s.coletor.demo.animated,'S3 deve iniciar com mãos, rugosidade e sem ar');assert(s.coletor.alvos.every(Boolean)&&d.linhaParticao.visivel&&d.cantoVivo.visivel&&d.linhaParticao.malhas>0&&d.cantoVivo.malhas>0,'S3 sem detalhes físicos ou balões visíveis');assert(JSON.stringify(d.linhaParticao.alvo)===JSON.stringify(script[i].alvos[1])&&JSON.stringify(d.cantoVivo.alvo)===JSON.stringify(script[i].alvos[2]),'Balões S3 fora das suas geometrias')}
    if(i===3){assert(s.coletor.ondas&&await page.locator('#ondas-ruido').isVisible()&&await page.locator('.spectrum-bar').count()===30,'S4 deve iniciar com ondas e espectro');const frames=await page.evaluate(()=>new Promise(resolve=>{const frames=[],start=performance.now();function collect(){frames.push(prototipo.estado().coletor);if(performance.now()-start<1000)requestAnimationFrame(collect);else resolve(frames)}collect()}));const distances=frames.map(f=>f.camera.distance),angles=frames.map(f=>f.rotation[2]);assert(Math.max(...distances)-Math.min(...distances)<1e-8&&frames.every(f=>JSON.stringify(f.camera.position)===JSON.stringify(frames[0].camera.position)&&f.zoom===frames[0].zoom&&f.escala.every(v=>v===1)),'S4 aproxima/afasta o modelo ou a câmera');assert(Math.max(...angles)-Math.min(...angles)>.001&&angles.every(a=>Math.abs(a)<=.001501),'Vibração ausente ou excessiva');entry.ruido={amostras:frames.length,variacaoDistancia:Math.max(...distances)-Math.min(...distances),amplitudeRotacao:Math.max(...angles)-Math.min(...angles)}}
    const layout=await page.evaluate(()=>{const b=e=>e.getBoundingClientRect().toJSON(),panel=document.querySelector('#conteudo');return{panel:b(panel),footer:b(document.querySelector('.bottom')),meaning:b(document.querySelector('.meaning')),sections:[...document.querySelectorAll('.meaning>section')].map(b),model:b(document.querySelector('#coletor-viewport')),diagram:b(document.querySelector('#diagrama')),legend:b(document.querySelector('.field-legend')),tools:b(document.querySelector('.model-tools')),scroll:panel.scrollHeight,client:panel.clientHeight}});
    assert(Math.abs(layout.panel.width-size.width*.9)<1&&Math.abs(layout.panel.height-size.height*.9)<1,'Painel diferente de 90%');
    assert(layout.panel.bottom+2<=layout.footer.top,'Slide sobrepõe navegação');assert(layout.scroll<=layout.client+1,'Slide possui conteúdo cortado');
    assert(layout.sections.at(-1).bottom<layout.panel.bottom,'Texto fora do painel');assert(layout.meaning.right+4<=layout.model.left,'Texto sobrepõe modelo');
    assert(layout.model.height>100&&(['logistica','rastreabilidade','servico','quimica','distribuicao','agua','backfire'].includes(script[i].id)?layout.model.bottom<=layout.legend.top+1:layout.model.bottom<=layout.diagram.top+1&&layout.diagram.bottom<=layout.legend.top+1)&&layout.legend.bottom<=layout.tools.top+1&&layout.tools.bottom<layout.panel.bottom,'Sobreposição no visor');
    if(i<11||j===1)await page.screenshot({path:`${output}/${size.width}x${size.height}-${String(i+1).padStart(2,'0')}-etapa${j+1}.png`});
   }
   const final=await state();assert(!final.coletor.cut,'Última etapa deve manter a versão completa do coletor');
   await page.waitForTimeout(200);assert((await state()).demoStep===script[i].etapas.length-1,'Avanço automático indevido');
   if(i<2){const renders=(await state()).coletor.rendered;await page.waitForTimeout(200);assert((await state()).coletor.rendered===renders,'S1/S2 redesenhando sem interação')}
   for(let k=0;k<3;k++){await page.locator('#legenda-'+k).click();const focused=(await state()).coletor;assert(focused.selected===k&&focused.alvos[k],'Legenda não localiza alvo visível: '+i+'/'+k);if(i<3)assert(!focused.transparent,'Foco ativou transparência em S1/S2/S3');frame(focused,`foco ${i}/${k}`)}
   await page.locator('#coletor-corte').click();assert((await state()).coletor.cut,'Botão de corte');frame((await state()).coletor,'corte');await page.locator('#coletor-corte').click();
   await page.locator('#coletor-restaurar').click();const box=await page.locator('#coletor-viewport').boundingBox();
   await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.5+80,box.y+box.height*.5+35,{steps:3});await page.mouse.up();assert(Math.abs((await state()).coletor.rotation[1])>.4,'Giro indisponível no final');frame((await state()).coletor,'giro');
   await page.mouse.wheel(0,-10000);assert((await state()).coletor.zoom===1.25,'Zoom máximo');frame((await state()).coletor,'zoom');await page.locator('#coletor-restaurar').click();
   if(i===2||i===script.length-1)await page.screenshot({path:`${output}/${size.width}x${size.height}-${i+1}-final.png`});
   entry.slides.push({funcao:script[i].id,severidade:script[i].severidade,linha:script[i].linha,etapas:script[i].etapas.length,rotacao:true,legendas:3,layout:true});
  }
  await select(script.length);const layout=await page.evaluate(()=>{const p=document.querySelector('#conteudo'),c=document.querySelector('#conclusao-conteudo');return{scroll:p.scrollHeight,client:p.clientHeight,visible:!c.classList.contains('hidden')}});assert(layout.visible&&layout.scroll<=layout.client,'Conclusão cortada');await page.screenshot({path:`${output}/${size.width}x${size.height}-conclusao.png`});report.sizes.push(entry);console.log('APROVADO',size.width,size.height);
 }
 await page.setViewportSize({width:1600,height:900});await select(0);
 for(let i=0;i<script.length;i++){
  await page.evaluate(()=>prototipo.setDemoStep(prototipo.roteiro[prototipo.estado().pageIndex].etapas.length-1));const before=await state();await page.locator('#proximo').click();await idle();const after=await state();assert(after.pageIndex===i+1,'Sequência de slides incorreta');
  if(i+1<script.length&&script[i].severidade===script[i+1].severidade)assert(JSON.stringify(before.car)===JSON.stringify(after.car),'Nova parada indevida na mesma severidade');
  assert(!after.crashed&&!after.fire&&after.impacts===0,'Acidente indevido na S10');report.navigation.push({from:i,to:i+1,stop:after.index,carStayed:JSON.stringify(before.car)===JSON.stringify(after.car)});
 }
 await page.locator('#anterior').click();await idle();assert((await state()).pageIndex===script.length-1,'Retorno da conclusão');
 const beforeBack=(await state()).coletor.rendered;await page.evaluate(()=>prototipo.setDemoStep(0));await page.locator('#anterior').click();await idle();await page.waitForTimeout(150);const back=await state();assert(back.pageIndex===script.length-2&&back.demoStep===script.at(-2).etapas.length-1&&back.coletor.rendered>beforeBack,'Retorno deve redesenhar a etapa final do slide anterior');
 await select(4);await page.evaluate(()=>prototipo.setDemoStep(3));await page.locator('#proximo').click();await page.waitForTimeout(100);await page.evaluate(()=>prototipo.selectSlide(2));await idle();assert((await state()).pageIndex===2,'Cancelamento de viagem');
 // Mesmo ponto do mapa: só os filhos do painel recebem o fade, com troca no zero.
 for(const [fromId,toId,method]of [['rastreabilidade','servico','next'],['quimica','distribuicao','next'],['backfire','estanqueidade','next'],['servico','rastreabilidade','back'],['quimica','distribuicao','select']]){const from=indexOf(fromId),to=indexOf(toId);
  await select(from);await page.waitForTimeout(250);if(method==='next')await page.evaluate(()=>prototipo.setDemoStep(prototipo.roteiro[prototipo.estado().pageIndex].etapas.length-1));
  const samples=await page.evaluate(({to,method})=>new Promise(resolve=>{const samples=[],before=prototipo.estado();if(method==='select')prototipo.selectSlide(to);else prototipo.advance(method==='back'?-1:1);function collect(){const p=document.querySelector('#conteudo'),c=document.querySelector('#slide-content'),s=prototipo.estado();samples.push({panel:Number(getComputedStyle(p).opacity),content:Number(getComputedStyle(c).opacity),veil:Number(getComputedStyle(document.querySelector('#fade')).opacity),background:getComputedStyle(p).backgroundColor,panelClass:p.className,index:s.pageIndex,car:s.car,camera:s.camera,renders:s.coletor.rendered});if(s.fading)requestAnimationFrame(collect);else resolve({before,frames:samples,after:s})}requestAnimationFrame(collect)}),{to,method});
  assert(samples.after.pageIndex===to,'Destino errado no fade');assert(samples.frames.every(f=>f.panel===1&&f.veil===0&&!f.panelClass.includes('absent')),'Fade alterou painel branco ou usou véu global');
  assert(Math.min(...samples.frames.map(f=>f.content))<.02&&samples.frames.at(-1).content===1,'Conteúdo não desapareceu e reapareceu');
  assert(samples.frames.every(f=>f.background===samples.frames[0].background&&JSON.stringify(f.car)===JSON.stringify(samples.before.car)&&JSON.stringify(f.camera)===JSON.stringify(samples.before.camera)),'Fundo, carro ou câmera mudaram na mesma parada');
  const firstVisible=samples.frames.find(f=>f.index===to&&f.content>.05);assert(firstVisible?.renders>samples.before.coletor.rendered,'Novo modelo não foi desenhado antes de reaparecer');report.fades.push({from,to,method,...samples});
 }
 await select(1);assert((await page.locator('#proximo').textContent()).includes('Próximo slide'),'S2 ainda oferece etapa extra');await page.keyboard.press('ArrowRight');await idle();assert((await state()).pageIndex===2,'S2 não segue direto para S3');
 for(const i of [2,3]){await select(i);assert((await page.locator('#proximo').textContent()).includes('Próximo slide'),'S3/S4 ainda oferece etapa extra');await page.keyboard.press('ArrowRight');await idle();assert((await state()).pageIndex===i+1,'S3/S4 não segue diretamente ao próximo slide')}
 assert(!report.errors.length&&!report.network.length,'Erros de execução ou rede');await fs.writeFile(`${output}/relatorio.json`,JSON.stringify(report,null,2));console.log('APROVADO: 13 funções, 28 etapas, backfire em loop e trinca progressiva, controles 3D e navegação offline');
}catch(e){await fs.writeFile(`${output}/falha.json`,JSON.stringify({...report,error:e.message,stack:e.stack},null,2));throw e}finally{await browser.close()}
