// Validação dos slides 1 a 4 e dos corredores visuais, em navegador offline.
import {chromium} from 'playwright';import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const output=process.env.QA_OUTPUT||'.producao/qa-sensoriais';await fs.mkdir(output,{recursive:true});const browser=await chromium.launch({executablePath:process.env.PRESENTATION_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={errors:[],network:[],sizes:[]};
function contained(s){const b=s.enquadramento,mx=1-2*b.margemPx/s.width,my=1-2*b.margemPx/s.height;if(b.x0< -mx-.001||b.x1>mx+.001||b.y0< -my-.001||b.y1>my+.001)throw Error('Coletor cortado: '+JSON.stringify(s));}
try{const page=await browser.newPage({offline:true,viewport:{width:1600,height:900}});page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text().slice(0,1200))});page.on('request',r=>{if(/^https?:/.test(r.url()))report.network.push(r.url())});await page.goto(pathToFileURL(path.resolve('prototipo-mapa/iniciar.html')).href);await page.waitForFunction(()=>window.prototipo,{timeout:90000});
 for(const size of [{width:1600,height:900},{width:1280,height:720},{width:1280,height:960}]){
  await page.setViewportSize(size);await page.waitForTimeout(650);const visibility=await page.evaluate(()=>prototipo.verificarVisibilidade());
  if(visibility.arvoresSemFolhas||[...visibility.paradas,visibility.acidente].some(v=>v.carro||v.numero||v.arvoreImpacto||!v.enquadrado))throw Error('Alvo escondido: '+JSON.stringify(visibility));
  const entry={...size,visibility,slides:[]};
  for(let i=0;i<4;i++){
   await page.evaluate(i=>prototipo.selectSlide(i),i);await page.waitForFunction(i=>prototipo.estado().index===i&&!prototipo.estado().fading,i);await page.waitForTimeout(120);
   const layout=await page.evaluate(()=>{const b=e=>e.getBoundingClientRect().toJSON();return{texto:b(document.querySelector('.meaning')),secoes:[...document.querySelectorAll('.meaning section')].map(b),modelo:b(document.querySelector('#coletor-viewport')),legenda:b(document.querySelector('.field-legend')),ferramentas:b(document.querySelector('#ferramentas-modelo')),conteudo:document.querySelector('#conteudo').innerText,palavras:document.querySelector('.meaning').innerText.split(/\s+/).length,maos:[...document.querySelectorAll('.touch-hand svg')].map(e=>getComputedStyle(e).transform)}});
   if(layout.texto.right>layout.modelo.left||layout.secoes.at(-1).bottom>layout.ferramentas.top||layout.modelo.bottom>layout.legenda.top+1)throw Error('Sobreposição no slide '+(i+1));
   const s=await page.evaluate(()=>prototipo.estado().coletor);contained(s);if(s.modo!==['marcacoes','aparencia','tatil','ruido'][i])throw Error('Efeito errado');
   if(i>0&&(!layout.conteudo.includes(['','Ligeiramente desagradável','Moderadamente desagradável','Muito desagradável'][i])||!layout.conteudo.includes('podem ocupar S2, S3 ou S4')))throw Error('Intensidade/intercâmbio de exemplos ausente');
   if(i===2&&(s.maos!==2||!await page.locator('#maos-tato').isVisible()))throw Error('Mãos ausentes');
   if(i===3){const a=await page.locator('.wave').first().evaluate(e=>getComputedStyle(e).transform);const n=s.rendered;await page.waitForTimeout(280);const b=await page.locator('.wave').first().evaluate(e=>getComputedStyle(e).transform);if(a===b||(await page.evaluate(()=>prototipo.estado().coletor.rendered))!==n)throw Error('Ondas sem animação independente');}
   await page.screenshot({path:`${output}/${size.width}x${size.height}-0${i+1}.png`});let gestures=0;
   if(i>0)for(const cut of [false,true]){
    if((await page.evaluate(()=>prototipo.estado().coletor.cut))!==cut)await page.locator('#coletor-corte').click();await page.locator('#coletor-viewport').hover();await page.mouse.wheel(0,-10000);await page.waitForFunction(()=>prototipo.estado().coletor.zoom===1.25);
    const b=await page.locator('#coletor-viewport canvas').boundingBox();for(let j=0;j<4;j++){const x=b.x+b.width*.5,y=b.y+b.height*.5;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+180,y+(j%2?90:-90),{steps:3});await page.mouse.up();contained(await page.evaluate(()=>prototipo.estado().coletor));gestures++}
   }
   if(i===2){const matrix=await page.locator('.touch-hand svg').evaluateAll(es=>es.map(e=>getComputedStyle(e).transform));if(JSON.stringify(matrix)!==JSON.stringify(layout.maos))throw Error('Mãos mudaram de ângulo com o POV');}
   await page.locator('#coletor-restaurar').click();entry.slides.push({severidade:i+1,modo:s.modo,maos:s.maos,ondas:s.ondas,palavras:layout.palavras,gestosDeGiro:gestures,semCortes:true,semSobreposicao:true});
  }
  await page.evaluate(()=>prototipo.selectSlide(9));await page.waitForFunction(()=>prototipo.estado().index===9&&!prototipo.estado().fading&&!prototipo.estado().moving,{timeout:20000});await page.waitForTimeout(250);await page.screenshot({path:`${output}/${size.width}x${size.height}-acidente.png`});report.sizes.push(entry);console.log('APROVADO',size.width,size.height);
 }
 if(report.errors.length||report.network.length)throw Error('Erros ou dependência de rede');await fs.writeFile(`${output}/relatorio.json`,JSON.stringify(report,null,2));
}catch(e){await fs.writeFile(`${output}/falha.json`,JSON.stringify({...report,erro:e.message},null,2));throw e}finally{await browser.close()}
