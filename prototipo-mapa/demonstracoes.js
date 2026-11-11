// Sequências ilustrativas: o relógio anima só a etapa atual; nunca avança o roteiro.
function criarDemonstracoes(T,model){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),group=new T.Group();group.name='Demonstracoes_didaticas';model.root.add(group);
 const blue='#167de0',red='#dc4c38',green='#159c79',amber='#d99622';let current=null,step=0,elapsed=0,animated=false,actors=[],noiseBounds=null;
 function mat(color,opacity=1){return new T.MeshStandardMaterial({color,roughness:.5,metalness:.12,transparent:opacity<1,opacity,depthWrite:opacity===1,side:T.DoubleSide})}
 function mesh(g,color,p,scale,opacity=1){const o=new T.Mesh(g,mat(color,opacity));if(p)o.position.copy(p);if(scale)o.scale.copy(scale);group.add(o);return o}
 const box=(p,s,c=blue,o=1)=>mesh(new T.BoxGeometry(1,1,1),c,p,s,o);
 function line(points,c=blue,r=.035,o=1){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),40,r,7,false),c,null,null,o)}
 function ring(p,r,c){const o=mesh(new T.TorusGeometry(r,.035,8,48),c,p);return o}
 function proxy(x,z,gray=false){const g=new T.Group();group.add(g);const m=mat(gray?'#96a4ad':'#526571',.48),add=(geo,p)=>{const o=new T.Mesh(geo,m);o.position.copy(p);g.add(o);return o};add(new T.BoxGeometry(4.8,1,1.8),V(0,.6,.8));for(const dx of [-1.8,-.6,.6,1.8])add(new T.CylinderGeometry(.28,.28,2.5,8),V(dx,.8,-1.4)).rotation.x=Math.PI/2;g.position.set(x,0,z);return g}
 function flow(mode='normal',water=false){
  const reverse=mode==='reverse',xs=[-1.8,-.6,.6,1.8];
  for(let i=0;i<4;i++){
   const blocked=mode==='restriction'&&i===2,c=water?'#2bafd0':reverse?'#ff7b34':blocked?amber:blue;
   const points=[V(-3.25,.67,.65),V(-1,.65,.6),V(xs[i],.67,-.2),V(xs[i],.85,-1.6),V(xs[i],1.12,-3.1)];
   const curve=new T.CatmullRomCurve3(points),tube=mesh(new T.TubeGeometry(curve,48,water?.085:.025,6,false),c,null,null,.48);tube.material.depthTest=false;tube.renderOrder=7;
   const beads=[];for(let j=0;j<5;j++){const b=mesh(new T.SphereGeometry(water?.12:.055,8,6),c,curve.getPoint(j/5));b.material.depthTest=false;b.renderOrder=8;beads.push(b)}
   actors.push(t=>{for(let j=0;j<beads.length;j++){let u=(j/5+t*(blocked?.06:.18))%1;if(reverse)u=1-u;beads[j].position.copy(curve.getPoint(u));beads[j].visible=mode!=='stopped'}});
   if(mode==='degraded')tube.material.opacity=.18;if(mode==='stopped'){tube.visible=false;beads.forEach(b=>b.visible=false)}
  }
 }
 function crack(){const paths=[[-1.4,-.7,-.9,-.4,-.15,.05],[.3,.55,.45,.9,1.1,1.3]];for(const path of paths)line(path.map((x,i)=>V(x,.93-i*.1,1.85)),red,.025)}
 function vacuum(broken){const p=[V(2.65,.7,.5),V(3.25,.7,.5),V(3.3,1.1,.5),V(3.85,1.1,.5)];line(p,broken?'#a6b0b7':green,.075);const booster=mesh(new T.CylinderGeometry(.48,.48,.22,28),broken?'#9da8af':green,V(3.9,1.1,.5));booster.rotation.z=Math.PI/2;box(V(2.8,.7,.5),V(.35,.18,.22),broken?red:green);if(broken){box(V(3.16,.7,.5),V(.15,.2,.23),red);ring(V(3.16,.7,.5),.3,red)}}
 function clear(){for(const o of [...group.children]){o.traverse(n=>{n.geometry?.dispose();if(n.material){for(const m of Array.isArray(n.material)?n.material:[n.material])m.dispose()}});group.remove(o)}actors=[]}
 function set(s,n){
  current=s;step=n;elapsed=0;clear();noiseBounds=null;const id=s.id,active=n>0;animated=true;group.visible=true;
  if(id==='ruido'){
   flow();
   const o=ring(V(0,1.5,.7),1.3,amber);o.scale.setScalar(1.3);actors.push(t=>{o.scale.setScalar(.8+(t%1)*.5);o.material.opacity=1-t%1;o.material.transparent=true});
   // O enquadramento usa o maior volume da onda, sem seguir sua pulsação.
   group.updateWorldMatrix(true,true);const inverse=group.matrixWorld.clone().invert();noiseBounds=new T.Box3();
   group.traverse(m=>{if(!m.geometry)return;m.geometry.computeBoundingBox();noiseBounds.union(m.geometry.boundingBox.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,m.matrixWorld)))});noiseBounds.expandByScalar(.06);
  }
  if(id==='logistica'){
   const support=box(V(2.9,.6,.6),V(.55,.18,.45),active?red:amber);if(active)support.rotation.z=.4;
   {const a=proxy(-.2,-4.6),b=proxy(.2,4.6);box(V(0,-.3,.3),V(7,.2,13),'#7e8e98',.28);if(n===1)actors.push(t=>{const u=Math.min(t/1.4,1);a.position.z=-4.6+u*.7;b.position.z=4.6-u*.7;support.rotation.z=u*.5});if(n===2){for(const z of [-2.7,2.9])box(V(0,.6,z),V(6,2,.22),green,.32);for(const x of [-2.5,2.5])box(V(x,0,.5),V(.25,.4,11),green,.32)}}
  }
  if(id==='rastreabilidade'){box(V(-.9,.31,1.85),V(.5,.17,.045),active?red:green);if(n===1)ring(V(-.9,.31,1.9),.4,red)}
  if(id==='servico'){
   const target=V(2.63,1.61,-3.18);ring(target,.22,amber);{const obstacle=box(V(2.65,2.4,-2),V(1.7,1.2,1.7),n===2?green:'#8899a9',.24),tool=line([V(2.65,3.8,-3),V(2.65,2,-3),target],n===2?green:red,.10);if(n<2)actors.push(t=>{tool.position.y=.1*Math.sin(t*3)});else obstacle.position.x+=2;line([target,V(2.65,4,-3.18)],n===2?green:red,.18,.2)}
  }
  if(id==='producao'){for(const x of [-3.6,3.6])box(V(x,.7,.4),V(.9,2.4,3.6),n===2?green:'#8a99aa',.25);if(n===1){box(V(0,1.7,.8),V(6,.2,2.7),red,.3);line([V(3.6,2.8,-1),V(1,1.6,-1)],red,.12)}if(n===2){line([V(-2,1.3,.9),V(-3,2.9,.9)],green,.08);line([V(2,1.3,.9),V(3,2.9,.9)],green,.08)}}
  if(id==='quimica'){
   flow(n>=2?'degraded':'normal');if(active){crack();ring(V(2.63,1.61,-3.18),.2,'#af6e36');for(let i=0;i<14;i++){const b=mesh(new T.SphereGeometry(.06,8,6),'#b56cba',V(-2.5+i*.38,.7,2.1));actors.push(t=>{b.position.y=.6+.22*Math.sin(t*2+i);b.position.z=1.84+.4*(1-(t*.4+i/14)%1)})}}{const ref=proxy(-.1,-5,true);ref.scale.setScalar(.8)}
  }
  if(id==='limpeza'){
   flow();if(active){for(let i=0;i<9;i++){const curve=new T.CatmullRomCurve3([V(-2.9,.67,.65),V(.6,.7,0),V(.6,.95,-2.5),V(.6,1.12,-3)]),p=mesh(new T.IcosahedronGeometry(.09,0),i%2?amber:red,curve.getPoint(i/12));p.material.depthTest=false;p.renderOrder=9;const update=t=>p.position.copy(curve.getPoint(n===2?.94:((i/12+t*.13)%1)));update(0);actors.push(update)}ring(V(.6,1.12,-3),.32,red)}
  }
  if(id==='distribuicao'){flow(active?'restriction':'normal');if(active){const o=box(V(.6,.9,-1.7),V(.48,.5,.18),red);o.rotation.y=.25}}
  if(id==='agua'){
   if(n===0){for(let i=0;i<22;i++){const b=mesh(new T.SphereGeometry(.04+i%3*.01,8,6),'#28b6dd',V(-2.3+(i%8)*.6,.95,.3+Math.floor(i/8)*.45));actors.push(t=>{b.position.y=.95-(t*.15+i/22)% .7})}}
   if(n>=1){const pool=box(V(0,.19,.7),V(4.5,.18,1.4),'#26afe0',.68);if(n===2){flow('stopped');flow('normal',true);actors.push(t=>{pool.scale.y=Math.max(.025,.18*(1-Math.min(t/2,1)));pool.rotation.z=.06*Math.sin(Math.min(t,1)*Math.PI/2)})}}
  }
  if(id==='backfire'){
   flow('reverse');if(active){crack();if(n===1)box(V(0,.9,1.83),V(4.6,.3,.035),red,.25)}if(n===2){const shield=mesh(new T.SphereGeometry(3.4,24,16),blue,V(0,.7,0),V(1.12,.6,.9),.08);shield.material.wireframe=true;for(let i=0;i<7;i++){const o=box(V(.1,.9,1.8),V(.18,.12,.13),amber);actors.push(t=>{const u=Math.min(t/1.5,1);o.position.set(.1+Math.sin(i*2)*u*2,.9+u*(i%3)*.35,1.8+u*.7);o.rotation.set(u*i,u*i*.5,0)})}}
  }
  if(id==='estanqueidade'){
   flow();ring(V(.5,.67,1.85),.2,active?red:green);if(active){crack();for(let i=0;i<18;i++){const b=mesh(new T.SphereGeometry(.055,8,6),'#50d3a4',V(.5,.67,1.9),null,.6);actors.push(t=>{const u=(t*.38+i/18)%1;b.position.set(.5+u*.6*Math.sin(i),.67+u*.65,1.9+u*1.2);b.material.opacity=(1-u)*.75})}}
  }
  if(id==='vacuo'){vacuum(active);if(n===0)flow()}
  animated=actors.length>0;
 }
 function tick(dt){if(!animated)return false;elapsed+=dt;actors.forEach(f=>f(elapsed));return true}
 function limitesEnquadramento(){group.updateWorldMatrix(true,true);return noiseBounds?noiseBounds.clone().applyMatrix4(group.matrixWorld):new T.Box3().setFromObject(group)}
 return{set,tick,group,limitesEnquadramento,estado:()=>({id:current?.id,step,animated,elapsed,objetos:group.children.length})};
}

// Diagramas vetoriais complementam o 3D com relações que uma cor isolada não explica.
function diagramaDemonstracao(s,n){
 const id=s.id,active=n>0||['tatil','ruido'].includes(id),last=n===s.etapas.length-1,blue='#0064cf',red='#c94135',green='#00836d',muted='#557087';
 const text=(x,y,t,c=muted,size=15)=>`<text x="${x}" y="${y}" fill="${c}" font-size="${size}" font-family="Arial">${t}</text>`;
 const rect=(x,y,w,h,c,r=7)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
 const path=(d,c=blue,width=3,dash='')=>`<path d="${d}" stroke="${c}" stroke-width="${width}" fill="none" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
 const car=(x,y,c,cls='')=>`<g transform="translate(${x} ${y})"><g class="${cls}">${rect(0,8,48,18,c,5)}${path('M9 8 L17 0 H32 L41 8',c,3)}<circle cx="12" cy="28" r="5" fill="#284154"/><circle cx="37" cy="28" r="5" fill="#284154"/></g></g>`;
 let body='';
 if(id==='identificacao'&&n===2||id==='rastreabilidade'&&n===2){body=text(8,18,id==='identificacao'?'Peças funcionais, identidade desconhecida':'Contenção: de uma peça para um lote');for(let i=0;i<24;i++){const x=10+i%12*48,y=30+Math.floor(i/12)*33;body+=rect(x,y+8,39,17,'#b8c4ce',3)+[0,1,2,3].map(j=>rect(x+3+j*9,y,5,10,'#8da0af',2)).join('')+text(x+14,y+22,'?',red,18)}}
 else if(id==='identificacao'){body=['DATA','PEÇA','CAVIDADE'].map((v,i)=>rect(8+i*198,15,184,63,'#edf3f8')+text(20+i*198,38,v)+text(20+i*198,64,active?'SEM GRAVAÇÃO':['DATA*','PEÇA*','CAV.*'][i],active?red:blue,18)).join('');body+=text(8,103,'* Identificações didáticas, sem códigos de produção.',muted,12)}
 else if(['aparencia','tatil','ruido'].includes(id)){const k=['aparencia','tatil','ruido'].indexOf(id);body=text(8,18,'Intensidade do incômodo percebido');['Ligeiro · S2','Moderado · S3','Intenso · S4'].forEach((t,i)=>{body+=rect(8+i*198,30,184,30,i===k?blue:'#e4ebf1')+text(18+i*198,51,t,i===k?'white':muted,15)});if(id==='ruido'&&active){for(let i=0;i<30;i++){const h=9+Math.abs(Math.sin(i*1.3))*24;body+=`<rect class="spectrum-bar" style="animation-delay:-${i*.07}s" x="${12+i*14}" y="${103-h}" width="9" height="${h}" fill="${i>18?red:'#d79325'}"/>`}body+=text(445,97,'Spectre illustratif'.replace('Spectre illustratif','Espectro ilustrativo'),muted,13)}else body+=text(8,91,id==='aparencia'?'Três alterações de acabamento em regiões separadas':id==='tatil'?'Lateral rugosa · linha de partição no topo · canto da flange':active?'Fluxo de ar preservado · representação ampliada':'Referência antes do efeito',green,16)}
 else if(id==='rastreabilidade'){const nodes=['Código 2D','Lote','Cavidade','Parâmetros'];nodes.forEach((v,i)=>{body+=rect(8+i*149,15,133,39,active?'#f9e9e5':'#e6f3ee')+text(17+i*149,40,v,active?red:green);if(i<3)body+=path(`M${141+i*149} 34h16`,active?red:green,3,active?'3 4':'')});body+=text(8,88,active?'Registros sem vínculo recuperável':'Peça, processo e matéria-prima conectados',active?red:green,18)}
 else if(id==='logistica'){body=['Peças soltas','Contato no transporte','Berços e separadores'].map((v,i)=>rect(8+i*198,22,184,49,n===i?i===1?'#f9e9e5':'#e4f3ed':'#edf1f5')+text(17+i*198,52,v,n===i?i===1?red:green:muted,14)).join('');body+=text(8,101,'Proteção das interfaces auxiliares · sequência ilustrativa',muted,13)}
 else if(id==='servico'){body=text(8,20,n===2||last?'Acesso liberado':'Acesso bloqueado',n===2||last?green:red,18);['Acessar fixador','Retirar vizinhos','Desconectar','Remontar'].forEach((v,i)=>body+=rect(8+i*149,35,133,34,i>0&&n!==1?'#edf1f5':'#fae9e4')+text(16+i*149,57,v,muted,13));body+=text(8,99,n===1?'Mais operações → mais tempo de serviço (sem escala numérica)':'O envelope deve permitir inserção e retirada da ferramenta.',muted,14)}
 else if(id==='producao'){['Moldagem','União','Inspeção'].forEach((v,i)=>{body+=rect(8+i*198,20,180,42,n===1?'#fae8e3':n===2?'#e4f3ec':'#e5edf6')+text(22+i*198,47,v,n===1?red:n===2?green:blue,18);if(i<2)body+=path(`M${188+i*198} 41h16`,n===1?red:green)});body+=text(8,96,n===1?'LINHA INTERROMPIDA':n===2?'Envelopes e abertura corrigidos':'Viabilidade avaliada antes da liberação',n===1?red:green,17)}
 else if(id==='quimica'){body=text(8,20,'TEMPO ZERO',green)+text(318,20,'VIDA EM SERVIÇO',active?red:blue)+path('M300 7v90','#c3d1dc',1);for(let i=0;i<4;i++){body+=rect(10+i*64,38,48,36,blue)+rect(320+i*64,38,48,active?18:36,active?'#ad793c':blue)}body+=text(8,105,'Comparação qualitativa: ataque químico → material degradado → fluxo reduzido',muted,13)}
 else if(id==='limpeza'){body=path('M12 52 H540',blue,9)+text(8,20,'Vista interna esquemática · caminho até a válvula');for(let i=0;i<6;i++)body+=`<circle class="${n===1?'travelling-dot':''}" cx="${40+i*74}" cy="52" r="${active?7:3}" fill="${active?red:'#b5e3ff'}"/>`;body+=path('M548 29v46 M532 76l33-48',muted,5)+text(8,102,n===2?'CONGELADO · partícula antes do contato':'Partículas ampliadas para permitir a visualização',n===2?red:muted,14);if(n===2)body+=`<circle cx="510" cy="52" r="13" fill="none" stroke="${red}" stroke-width="3"/>`}
 else if(id==='distribuicao'){for(let i=0;i<4;i++){const h=active&&i===2?20:59;body+=rect(12+i*77,82-h,48,h,active&&i===2?red:blue)+text(12+i*77,104,'C'+(i+1),muted,13)}body+=path('M347 86V14 M347 86h235','#a1b5c6',1)+path('M353 77 Q420 2 576 26',blue,3,'6 4')+path(active?'M353 83 Q420 40 576 59':'M353 77 Q420 2 576 26',active?red:blue,3)+text(367,105,'Torque · comparação qualitativa',muted,12)}
 else if(id==='agua'){body=text(8,20,n===0?'Gotas → condensado':n===1?'Condensado → bolsa de água':'Água aspirada → admissão interrompida',n>=2?red:blue,18);for(let i=0;i<4;i++){body+=rect(20+i*139,34,115,44,n>=2?'#687a89':blue)+text(38+i*139,62,n>=2?'APAGADO':'CILINDRO '+(i+1),'white',13)}body+=text(8,105,'Perda de função primária · risco de falha grave do motor',red,14)}
 else if(id==='backfire'){body=path('M555 48H35',n===0?'#df8639':red,7)+path('M58 30 32 48 58 66',red,5)+text(8,20,'Pressão no sentido inverso · representação qualitativa',red,17)+text(8,101,n===2?'ESCUDO ATIVO · fragmentos contidos':'Mapa de cores ilustrativo, sem valores de tensão',muted,14);for(let i=0;i<9;i++)body+=rect(150+i*40,35,34,26,['#448abf','#5ea0aa','#a1af63','#d4aa3e','#e28a33','#dc6932','#cb4b37','#bb3535','#9e3038'][i])}
 else if(id==='estanqueidade'){body=text(8,20,n<2?'Verificação de fuga por pressurização':'Operação: ar não medido e controle de mistura',blue,16);body+=rect(8,33,172,39,'#e8f1fa')+text(20,58,'Sensor: ar medido',blue)+path('M188 52h45',blue,5)+rect(242,33,172,39,'#e8f1fa')+text(252,58,'Fluxo real',blue);if(n>=2)body+=path('M325 12v20',red,5)+rect(436,22,153,63,'#fae7e1')+text(451,47,'AVARIA',red,17)+text(451,69,'EMISSÕES',red,17);body+=text(8,103,n>=2?'Entrada adicional após o sensor → mistura e diagnóstico afetados':'Fumaça de teste sai pela falha; em admissão, ar pode entrar.',muted,13)}
 else if(id==='vacuo'){
  if(n===3){body=text(8,16,'Distâncias ilustrativas · mesmas condições de comparação');body+=path('M12 47H300',green,3)+car(252,20,green,'braking-normal')+text(318,47,'Com assistência',green,14)+path('M12 90H470',red,3)+car(422,63,red,'braking-reduced')+text(486,90,'Reduzida',red,13)}
  else{body=text(8,18,'Coletor → mangueira → servofreio',active?red:green,17);body+=path('M12 48H350',active?'#9ba8b2':green,10,active?'18 10':'')+rect(365,28,74,48,active?'#b6c1ca':green)+path('M456 41l39 43h58',muted,6);for(let i=0;i<(n>=2?5:2);i++)body+=path(`M${490+i*16} 16v19`,n>=2?red:green,3);body+=text(8,103,n>=2?'Assistência reduzida → maior esforço no pedal':active?'Circuito interrompido · vácuo perdido':'Circuito íntegro · assistência disponível',active?red:green,15)}
 }
 return `<svg viewBox="0 0 600 114" role="img" aria-label="${s.etapas[n][0]}">${body}</svg>`;
}
