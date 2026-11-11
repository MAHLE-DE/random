// Cenas didáticas de embalagem e rastreabilidade. Coordenadas locais do coletor.
function criarCenaProduto(T,model,host,id,stage){
 if(!['logistica','rastreabilidade'].includes(id))return null;
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),textures=new Set(),smooth=t=>{t=T.MathUtils.clamp(t,0,1);return t*t*(3-2*t)},duration=2.4;
 const info={id,stage,didatico:true},blue='#1768ae',red='#c84231',amber='#d8a142',tags=[],clones=[];let targetList=[],animation=null,details=()=>({});
 function material(color,opts={}){return new T.MeshStandardMaterial({color,roughness:.65,metalness:.05,side:T.DoubleSide,...opts})}
 function mesh(g,m,parent=host,p=V()){const o=new T.Mesh(g,m);o.position.copy(p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 function box(p,s,m,parent=host){const o=mesh(new T.BoxGeometry(...s),m,parent,V(...p));return o}
 function line(points,color,r=.018,parent=host){const c=new T.CurvePath();for(let i=1;i<points.length;i++)c.add(new T.LineCurve3(V(...points[i-1]),V(...points[i])));return mesh(new T.TubeGeometry(c,32,r,7,false),material(color),parent)}
 function canvasTexture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.add(t);return t}
 function panel(w,h,texture,parent,p){return mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}),parent,p)}
 function labelTexture(title,subtitle,color='#23465f'){return canvasTexture(1024,256,(c,w,h)=>{c.fillStyle='#f8faf5';c.fillRect(0,0,w,h);c.fillStyle=color;c.font='bold 66px Arial';c.fillText(title,35,104);c.font='40px Arial';c.fillText(subtitle,35,181)})}
 function qrLabel(missing=false){return canvasTexture(1280,400,(c,w,h)=>{
  c.fillStyle='#f4f5ed';c.fillRect(0,0,w,h);c.strokeStyle=missing?'#c84231':'#326c77';c.lineWidth=14;c.strokeRect(8,8,w-16,h-16);
  if(!missing){const rows=CONFIG.codigoRastreabilidade.modulos,n=rows.length,module=9,x=40,y=55;c.fillStyle='white';c.fillRect(x-4*module,y-4*module,(n+8)*module,(n+8)*module);c.fillStyle='#14252d';rows.forEach((r,j)=>[...r].forEach((bit,i)=>{if(bit==='1')c.fillRect(x+i*module,y+j*module,module,module)}))}
  else {c.fillStyle='#f2dad3';c.fillRect(20,20,330,340);c.fillStyle=red;c.font='bold 290px Arial';c.textAlign='center';c.fillText('?',185,288);c.textAlign='left'}
  const data=CONFIG.codigoRastreabilidade;
  c.fillStyle=missing?red:'#243a49';c.font='bold 76px Arial';c.fillText(missing?'PN: ???':'PN: '+data.partNumber,390,108);
  c.font='bold 64px Arial';c.fillText(missing?'LOTE: ?????':'LOTE: '+data.lote,390,202);c.font='45px Arial';c.fillText(missing?'SÉRIE: ???     CAV: ??':'S/N: '+data.serie+'    CAV: '+data.cavidade,390,275);
  c.font='bold 34px Arial';c.fillStyle=missing?red:'#5e7079';c.fillText(missing?'SEM VÍNCULO COM O PROCESSO':'DADOS DIDÁTICOS · SEM CÓDIGOS DE PRODUÇÃO',390,349);
 })}
 function question(p,size=1.35,parent=host){const texture=canvasTexture(256,320,(c,w,h)=>{c.fillStyle='#fff9f3';c.beginPath();c.roundRect(17,8,222,292,30);c.fill();c.strokeStyle=red;c.lineWidth=9;c.stroke();c.fillStyle=red;c.font='bold 246px Arial';c.textAlign='center';c.fillText('?',128,251)});const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthTest:true}));sprite.position.copy(p);sprite.scale.set(size,size*1.25,1);parent.add(sprite);return sprite}
 function roofTag(missing,parent=host){const holder=new T.Group();parent.add(holder);tags.push(holder);const tag=panel(4.35,1.34,qrLabel(missing),holder,V(-.15,1.226,.68));tag.rotation.x=-Math.PI/2;
  const y=1.234,x0=-2.42,x1=2.12,z0=-.08,z1=1.44,len=.26;
  for(const [x,dx]of [[x0,1],[x1,-1]])for(const [z,dz]of [[z0,1],[z1,-1]])line([[x+dx*len,y,z],[x,y,z],[x,y,z+dz*len]],missing?red:amber,.025,holder);
  return holder;
 }
 function rootPoint(object,local=V()){model.root.updateWorldMatrix(true,true);return model.root.worldToLocal(object.localToWorld(local.clone())).toArray()}
 const presentation={direction:id==='logistica'?(stage===0?[-.75,.8,1.4]:[.12,2.8,-1.2]):stage===2?[-.4,1.55,1.4]:[-.35,1.25,1.3],duration:id==='logistica'&&stage===1?duration:0,large:true};
 if(id==='logistica'){
  // Papelão opaco, tampa dividida no centro e duas dobradiças independentes.
  const paperTexture=canvasTexture(512,512,(c,w,h)=>{c.fillStyle='#b58a58';c.fillRect(0,0,w,h);let seed=37;for(let i=0;i<7000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%w,y=(seed>>>9)%h;c.fillStyle=i%2?'#ffffff0c':'#3829160e';c.fillRect(x,y,1+i%3,1)}for(let y=0;y<h;y+=9){c.fillStyle='#61432009';c.fillRect(0,y,w,1)}});
  paperTexture.wrapS=paperTexture.wrapT=T.RepeatWrapping;
  const paper=material('#d0ae7e',{map:paperTexture,roughness:.98}),inside=material('#c8a46e',{map:paperTexture,roughness:1}),tape=material('#d9be86',{roughness:.84});
  const W=7.8,D=7.4,z=-.9,floor=-.25,top=2.65;
  box([0,floor,z],[W,.12,D],inside);
  for(const x of [-W/2,W/2])box([x,1.19,z],[.09,2.9,D],paper);
  for(const zz of [z-D/2,z+D/2])box([0,1.19,zz],[W,2.9,.09],paper);
  const flaps=[];
  for(const sign of [-1,1]){const hinge=new T.Group();hinge.position.set(sign*W/2,top,z);host.add(hinge);const leaf=box([-sign*W/4,0,0],[W/2,.075,D],paper,hinge);box([-sign*(W/2-.06),.043,0],[.12,.012,D],tape,hinge);flaps.push({hinge,sign});line([[sign*W/2,top,z-D/2],[sign*W/2,top,z+D/2]],'#78572f',.015)}
  // Etiqueta externa e linha da junta central deixam clara a caixa fechada.
  const shipping=panel(3.7,.78,labelTexture('TRANSPORTE','COLETOR · DEMONSTRAÇÃO'),host,V(0,1.25,z+D/2+.052));
  const seals=[],xs=[-1.8,-.6,.6,1.8];
  xs.forEach((x,i)=>{const g=new T.Group();g.position.set(x,1.12,-3.315);host.add(g);mesh(new T.TorusGeometry(.349,.050,12,56),material('#647b60',{roughness:.95}),g);seals.push(g);if(i===2)mesh(new T.TorusGeometry(.414,.014,7,48),material(amber),g)});
  function sleeve(parent,p){const shape=new T.Shape();shape.absarc(0,0,.064,0,Math.PI*2,false);const hole=new T.Path();hole.absarc(0,0,.037,0,Math.PI*2,true);shape.holes.push(hole);const g=new T.Group();g.position.copy(p);parent.add(g);const metal=material('#c6d5df',{metalness:.92,roughness:.24});mesh(new T.ExtrudeGeometry(shape,{depth:.18,bevelEnabled:false,curveSegments:28}),metal,g);mesh(new T.TorusGeometry(.072,.016,8,32),metal,g);return g}
  const holes=[[-2.63,.69],[-2.63,1.61],[2.63,.69],[2.63,1.61],...xs.map(x=>[x,1.66])],missing=new Set([0,6]);const mounted=[];
  holes.forEach(([x,y],i)=>{if(!missing.has(i))mounted.push(sleeve(host,V(x,y,-3.285)))});
  const loose=[sleeve(host,V(3.18,-.085,-1.12)),sleeve(host,V(3.05,-.085,-1.76))];loose[0].rotation.set(.06,.35,0);loose[1].rotation.set(.08,-.6,0);
  // Dois suportes em papelão mantêm o corpo acima do fundo, com os soltos ao lado.
  for(const x of [-2.5,2.5])box([x,-.11,.4],[.30,.15,2.4],inside);
  info.juntas=seals.length;info.juntaDeslocada=2;info.limitadoresMontados=mounted.length;info.limitadoresSoltos=loose.length;info.furosSemLimitador=[...missing];info.abertura=0;
  details=()=>({abas:flaps.map(f=>f.hinge.rotation.z),juntas:seals.map(g=>({posicao:g.position.toArray(),rotacao:g.rotation.toArray().slice(0,3)})),montados:mounted.map(g=>g.position.toArray()),caidos:loose.map(g=>g.position.toArray())});
  animation=t=>{const q=smooth(t/duration);flaps.forEach(f=>f.hinge.rotation.z=-f.sign*q*3.02);seals[2].position.set(.6,1.12+q*.045,-3.315-q*.05);seals[2].rotation.set(q*.26,q*-.18,0);info.abertura=q;return t<duration};
  if(stage===0){animation(0);animation=null}else animation(0);
  targetList=()=>stage===0?[[0,top+.07,-.8],[-W/2,top+.04,-.4],[0,1.25,z+D/2+.065]]:[rootPoint(seals[2],V(0,.349,0)),rootPoint(mounted[1],V(.072,0,0)),rootPoint(loose[0],V(0,.072,.12))];
  info.etiquetaExterna=shipping.name='Etiqueta_da_caixa';
 }else{
  const missing=stage>0;roofTag(missing);
  info.qrPayload=CONFIG.codigoRastreabilidade.payload;info.registroAdequado=!missing;info.partNumber=missing?'???':CONFIG.codigoRastreabilidade.partNumber;info.lote=missing?'?????':CONFIG.codigoRastreabilidade.lote;
  if(stage===1){question(V(-1.5,2.8,.4),1.55);question(V(1.3,2.7,.4),1.55);line([[-2.3,1.26,-.08],[2.1,1.26,1.44]],red,.025)}
  if(stage===2){
   // Réplicas da geometria real, compartilhadas: seis peças grandes, em vez de ícones.
   const positions=[[-7.1,0],[0,0],[7.1,0],[-7.1,6.3],[0,6.3],[7.1,6.3]],prototype=model.exportar(false);prototype.getObjectByName('Demonstracoes_didaticas')?.removeFromParent();prototype.traverse(o=>{if(o.geometry)o.userData.sharedGeometry=true;if(o.material)o.userData.sharedMaterial=true});
   for(const [index,[x,z]]of positions.entries()){
    if(x||z){const clone=prototype.clone(true);clone.position.set(x,0,z);host.add(clone);clones.push(clone);roofTag(true,clone)}
    question(V(x,3.05,z+.6),1.9);line([[x-3.5,-.10,z-3.6],[x+3.5,-.10,z-3.6],[x+3.5,-.10,z+2.2],[x-3.5,-.10,z+2.2],[x-3.5,-.10,z-3.6]],red,.035);
   }
   info.pecasLote=positions.length;info.interrogacoes=6;
  }else{info.pecasLote=1;info.interrogacoes=stage===1?2:0}
  targetList=()=>stage===2?[[-7.1,3.05,.6],[0,3.05,.6],[7.1,3.05,6.9]]:[[-1.78,1.245,.68],[.25,1.245,.35],[.70,1.245,.85]];
 }
 function corte(on){tags.forEach(t=>t.visible=!on);clones.forEach(c=>{c.getObjectByName('Metade_superior').visible=!on;for(const name of ['Parede_traseira_em_corte','Entrada_parede_em_corte'])c.getObjectByName(name).visible=on;for(const name of ['Parede_traseira_inteira','Entrada_parede_inteira'])c.getObjectByName(name).visible=!on})}
 function bounds(focused=false){if(id!=='logistica')return null;model.root.updateWorldMatrix(true,true);const b=focused&&stage===1?new T.Box3(V(-3.5,-.22,-3.65),V(3.5,1.95,1.95)):new T.Box3(V(-4,-.34,-4.68),V(4,2.78,2.88));return b.applyMatrix4(model.root.matrixWorld)}
 return{presentation,animated:!!animation,update:t=>animation?animation(t):false,targets:()=>targetList(),bounds,corte,info:()=>({...info,detalhes:details()}),dispose:()=>textures.forEach(t=>t.dispose())};
}
