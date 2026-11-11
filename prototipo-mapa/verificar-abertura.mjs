// Capa geométrica, transição para o carro e autoria persistente nos slides.
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';

const output=process.env.QA_ABERTURA_OUTPUT||'.producao/qa-abertura';
await fs.mkdir(output,{recursive:true});
const file=path.resolve('prototipo-mapa/iniciar.html');
const html=await fs.readFile(file,'utf8');
const report={sha256:crypto.createHash('sha256').update(html.replace(/\r\n/g,'\n')).digest('hex'),errors:[],network:[],sizes:[]};
const assert=(v,message)=>{if(!v)throw Error(message)};
const authors=['Bruno Caetano','Cauã Ferrari','BU2 SA (TMD2)'];
const browser=await chromium.launch({headless:true,executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});

try{
 const page=await browser.newPage({offline:true});
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text())});
 page.on('request',r=>{if(/^https?:/.test(r.url()))report.network.push(r.url())});
 const state=()=>page.evaluate(()=>prototipo.estado());
 const idle=()=>page.waitForFunction(()=>{const s=prototipo.estado();return !s.moving&&!s.fading&&!s.abertura.animando},null,{timeout:45000});
 const select=async i=>{await page.evaluate(i=>prototipo.selectSlide(i),i);await idle();await page.waitForTimeout(250)};

 for(const size of[{width:1600,height:900},{width:1280,height:720},{width:1280,height:960}]){
  await page.setViewportSize(size);
  await page.goto(pathToFileURL(file).href);
  await page.waitForFunction(()=>window.prototipo?.abertura&&prototipo.estado().abertura,null,{timeout:90000});
  let s=await state(),a=s.abertura;
  assert(a.ativa&&!a.animando&&a.tempo===0,'O arquivo deve abrir na capa estática, aguardando um único avanço');
  assert(a.blocos>0&&a.subdivisoes>=0&&a.corFinal.toUpperCase()==='#1B267D','Geometria ou cor final da abertura ausente');
  assert(a.duracao>=10&&a.duracao<=22,'Duração da transformação fora do intervalo da apresentação');
  assert(await page.locator('#capa').isVisible()&&await page.locator('#capa-geometria').isVisible(),'Capa ou canvas da geometria oculto');
  assert((await page.locator('#capa-titulo').textContent()).trim().toLocaleLowerCase('pt-BR')==='jornada da qualidade','Título da capa incorreto');
  const names=await page.locator('#capa-autores').textContent();
  assert(authors.every(n=>names.includes(n))&&/[·•]/.test(names),'Nomes, unidade ou ponto central ausentes na capa');
  assert(!/SLIDE TEMPLATE/.test(await page.locator('#capa').textContent()),'Texto de placeholder apareceu na capa');
  const initialLayout=await page.evaluate(()=>{const r=id=>document.querySelector(id).getBoundingClientRect().toJSON();return{cover:r('#capa'),title:r('#capa-titulo'),authors:r('#capa-autores'),geometry:r('#capa-geometria')}});
  assert(initialLayout.title.x>=0&&initialLayout.title.right<=size.width&&initialLayout.authors.bottom<size.height,'Título ou autores fora da tela');
  assert(initialLayout.geometry.width>size.width*.35&&initialLayout.geometry.height>size.height*.55,'Geometria muito pequena na capa');
  await page.screenshot({path:`${output}/${size.width}x${size.height}-capa.png`});

  // Uma amostra por quadro observa o fade de um segundo e as fases da morfagem.
  await page.evaluate(()=>{
   window.openingFrames=[];window.openingDone=false;
   function sample(){const s=prototipo.estado(),a=s.abertura,el=document.querySelector('#capa-texto');openingFrames.push({time:performance.now(),a:{...a},page:s.pageIndex,step:s.demoStep,car:s.car,viewport:{width:innerWidth,height:innerHeight},opacity:Number(getComputedStyle(el).opacity)});if(a.ativa||a.animando)requestAnimationFrame(sample);else window.openingDone=true}
   requestAnimationFrame(sample);
  });
  if(size.width===1600)await page.locator('#proximo').click();else await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>prototipo.estado().abertura.animando);
  await page.waitForTimeout(350);
  const duringStart=(await state()).abertura;
  assert(duringStart.ativa&&duringStart.fadeTexto>0&&duringStart.fadeTexto<1,'Texto e fundo não iniciam o fade suave de um segundo');
  const textOpacity=await page.locator('#capa-texto').evaluate(el=>Number(getComputedStyle(el).opacity));
  assert(textOpacity>0&&textOpacity<1,'O texto da capa não está fazendo fade na tela');
  assert(await page.locator('#proximo').isDisabled(),'Avanço permanece liberado durante a transformação');
  await page.keyboard.press('ArrowRight');await page.keyboard.press('Space');
  await page.evaluate(()=>prototipo.advance(1));
  await page.waitForFunction(()=>{const a=prototipo.estado().abertura;return a.tempo>=1.1&&a.animando});
  assert((await state()).abertura.fadeTexto<=.002,'Texto não desapareceu depois de um segundo');
  assert(await page.locator('#capa-texto').evaluate(el=>Number(getComputedStyle(el).opacity))<=.02,'O texto continua visível depois de um segundo');
  await page.screenshot({path:`${output}/${size.width}x${size.height}-fade.png`});
  // Redimensionar durante o rolamento precisa conservar o relógio e recalcular o destino.
  await page.waitForFunction(()=>{const a=prototipo.estado().abertura;return a.tempo>=3&&a.animando});
  const beforeResize=(await state()).abertura;
  const temporarySize={width:size.width-64,height:size.height+48};
  await page.setViewportSize(temporarySize);await page.waitForTimeout(350);
  const resized=(await state()).abertura;
  assert(resized.animando&&resized.tempo>=beforeResize.tempo&&resized.projecaoFinal?.depth>0,'Resize reiniciou a abertura ou perdeu o enquadramento de destino');
  assert(resized.carro.posicao.every(Number.isFinite)&&resized.carro.quaternion.every(Number.isFinite)&&resized.carro.escala>0,'Resize produziu uma transformação inválida');
  const resizedCanvas=await page.locator('#capa-geometria canvas').boundingBox();assert(Math.abs(resizedCanvas.width-temporarySize.width)<1&&Math.abs(resizedCanvas.height-temporarySize.height)<1,'Canvas não acompanha o redimensionamento');
  await page.screenshot({path:`${output}/${size.width}x${size.height}-resize.png`});
  await page.setViewportSize(size);await page.waitForTimeout(350);
  const afterResize=(await state()).abertura;
  assert(afterResize.animando&&afterResize.tempo>=resized.tempo,'Restaurar o tamanho reiniciou a animação');
  await page.waitForFunction(()=>{const a=prototipo.estado().abertura;return a.tempo>a.duracao*.45&&a.tempo<a.duracao*.85&&a.animando});
  await page.screenshot({path:`${output}/${size.width}x${size.height}-morfagem.png`});
  await page.waitForFunction(()=>window.openingDone,null,{timeout:45000});
  await page.waitForTimeout(350);
  s=await state();a=s.abertura;
  assert(!a.ativa&&!a.animando&&s.pageIndex===0&&s.demoStep===0&&s.index===0,'Abertura deve terminar na primeira etapa de S1, sem avançar por comandos repetidos');
  assert(a.logoEncaixada&&a.progressoCarro>=.999,'Logo não terminou no capô ou carro não se completou');
  assert(Number.isFinite(a.erroEncaixe)&&a.erroEncaixe<1e-7,'A geometria final não coincide com o carro do mapa');
  assert(Number.isFinite(a.erroLogo)&&a.erroLogo<1e-8,'Placa MAHLE não terminou exatamente no alvo do capô');
  assert(s.carroAparencia?.logosLaterais===0&&s.carroAparencia.logoCapo&&s.carroAparencia.cor.toUpperCase()==='#1B267D','Pintura ou aplicação da marca no carro incorreta');
  const frames=await page.evaluate(()=>openingFrames),active=frames.filter(f=>f.a.animando),fade=active.filter(f=>f.a.tempo>0&&f.a.tempo<1);
  assert(active.length>100&&fade.length>8,'Amostragem insuficiente para verificar a transformação');
  assert(fade.some(f=>f.a.fadeTexto>.65)&&fade.some(f=>f.a.fadeTexto<.35),'Fade salta diretamente entre visível e oculto');
  assert(active.filter(f=>f.a.tempo>=1.05).every(f=>f.a.fadeTexto<=.002),'Texto reaparece durante a morfagem');
  assert(active.every((f,i)=>i===0||f.a.tempo>=active[i-1].a.tempo),'Relógio reiniciou durante a animação');
  assert(active.some(f=>f.a.progressoCarro>.05&&f.a.progressoCarro<.95),'Carro aparece instantaneamente, sem transformação intermediária');
  assert(new Set(active.map(f=>f.a.fase)).size>=3,'Sequência não apresenta fade, rolamento e formação');
  assert(active.every(f=>f.page<=0&&f.step===0),'Comando durante a abertura pulou uma etapa da apresentação');
  assert(active.every(f=>{const b=f.a.limitesVisuais;return b&&b.pontos>0&&b.x0>=-1.03&&b.x1<=1.03&&b.y0>=-1.03&&b.y1<=1.03}),'Peças da abertura escapam do enquadramento');
  // Depois do resize, a entrega deve convergir sem salto de tamanho ou profundidade.
  const handoff=active.filter(f=>f.a.tempo>=10.4).map(f=>{const d=Math.max(720,f.viewport.height*1280/f.viewport.width)/2/Math.tan(21*Math.PI/180);return{time:f.a.tempo,scale:f.a.carro.escala,depth:d-f.a.carro.posicao[2],q:f.a.carro.quaternion}});
  assert(handoff.length>12&&handoff.every(f=>Number.isFinite(f.scale)&&f.scale>0&&Number.isFinite(f.depth)&&f.depth>0&&Math.abs(Math.hypot(...f.q)-1)<1e-6),'Entrega do carro tem escala, profundidade ou rotação inválida');
  let maxScaleRate=0,maxDepthRate=0;
  for(let i=1;i<handoff.length;i++){const a=handoff[i-1],b=handoff[i],dt=b.time-a.time;if(dt<=0)continue;assert(b.scale<=a.scale+.002&&b.depth<=a.depth+.002,'Tamanho ou profundidade cresce e recua na entrega');maxScaleRate=Math.max(maxScaleRate,Math.abs(Math.log(b.scale/a.scale))/dt);maxDepthRate=Math.max(maxDepthRate,Math.abs(Math.log(b.depth/a.depth))/dt)}
  assert(maxScaleRate<12&&maxDepthRate<12,'Salto de escala ou profundidade na aproximação ao mapa');
  await page.screenshot({path:`${output}/${size.width}x${size.height}-primeiro-slide.png`});

  // O rodapé é comum às telas, mas precisa caber também na conclusão de 40%.
  const footerChecks=[];
  for(let i=0;i<=13;i++){
   if(i)await select(i);
   const footer=page.locator('#conteudo .slide-authors');
   assert(await footer.count()===1&&await footer.isVisible(),'Autoria ausente no slide '+i);
   const text=await footer.textContent();assert(authors.every(n=>text.includes(n))&&/[·•]/.test(text),'Autoria ou unidade incorreta no slide '+i);
   const layout=await page.evaluate(()=>{const p=document.querySelector('#conteudo').getBoundingClientRect(),f=document.querySelector('#conteudo .slide-authors').getBoundingClientRect(),nav=document.querySelector('.bottom').getBoundingClientRect();return{panel:p.toJSON(),footer:f.toJSON(),nav:nav.toJSON()}});
   assert(layout.footer.left>=layout.panel.left&&layout.footer.right<=layout.panel.right&&layout.footer.bottom<=layout.panel.bottom&&layout.footer.bottom<layout.nav.top,'Rodapé cortado ou sobrepondo navegação no slide '+i);
   assert(layout.footer.left-layout.panel.left<80&&layout.panel.bottom-layout.footer.bottom<65,'Autoria fora do canto inferior esquerdo no slide '+i);
   footerChecks.push({page:i,...layout});
  }
  await page.locator('#etapa-inicio').click();await page.waitForFunction(()=>prototipo.estado().abertura.ativa&&!prototipo.estado().abertura.animando);
  assert((await state()).abertura.tempo===0,'Voltar à capa não restaura sua etapa inicial');
  await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>prototipo.estado().abertura.tempo>1.4);
  await select(2);s=await state();assert(!s.abertura.ativa&&!s.abertura.animando&&s.pageIndex===2,'Salto direto não cancela a abertura');
  assert(!await page.locator('#capa').isVisible(),'Capa permanece sobre os slides após cancelar a animação');
  report.sizes.push({...size,duration:a.duracao,frames:frames.length,animatedFrames:active.length,fadeFrames:fade.length,phases:[...new Set(active.map(f=>f.a.fase))],initialLayout,resize:{before:beforeResize.tempo,during:resized.tempo,after:afterResize.tempo,temporarySize},handoff:{frames:handoff.length,maxScaleRate,maxDepthRate,erroEncaixe:a.erroEncaixe,erroLogo:a.erroLogo},footerChecks,cancelled:true,finalAppearance:s.carroAparencia});
  await fs.writeFile(`${output}/${size.width}x${size.height}-frames.json`,JSON.stringify(frames));
  console.log('ABERTURA APROVADA',size.width,size.height);
 }
 assert(!report.errors.length&&!report.network.length,'Erros JavaScript/WebGL ou solicitações de rede durante a abertura');
 await fs.writeFile(`${output}/relatorio.json`,JSON.stringify(report,null,2));
}catch(e){await fs.writeFile(`${output}/falha.json`,JSON.stringify({...report,error:e.message,stack:e.stack},null,2));throw e}finally{await browser.close()}
