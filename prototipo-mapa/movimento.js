/* Cena única, percurso por comprimento de arco, carro e câmera independentes.
   Biblioteca e modelo são incorporados por gerar.mjs. Nenhuma requisição de rede. */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const clamp=T.MathUtils.clamp;
const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
const ease=x=>x*x*x*(x*(x*6-15)+10);
const lerp=T.MathUtils.lerp;
try {
const scene=new T.Scene();scene.background=new T.Color('#ffffff');
scene.fog=new T.Fog('#ffffff',90,200);
const camera=new T.PerspectiveCamera(42,innerWidth/innerHeight,.1,500);
const renderer=new T.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;$('mundo').appendChild(renderer.domElement);
scene.add(new T.HemisphereLight(0xffffff,0xc5d5eb,2.7));
const sun=new T.DirectionalLight(0xffffff,3);sun.position.set(-35,70,25);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-110,right:110,top:110,bottom:-110,far:200});
sun.shadow.bias=-.0003;sun.shadow.normalBias=.035;scene.add(sun);
const mat=(color,roughness=.7)=>new T.MeshStandardMaterial({color,roughness});
const white=mat('#ffffff'),blue=mat('#0043bc'),pale=mat('#d6e3f6'),gray=mat('#dbe4ef');
function mesh(geo,m,parent=scene){const o=new T.Mesh(geo,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
const floor=mesh(new T.PlaneGeometry(700,700),white);floor.rotation.x=-Math.PI/2;floor.position.y=-.48;
// O percurso muda de direção livremente no plano e tem desníveis suaves.
const control=[[-43,.1,29],[-30,.2,17],[-13,.5,21],[1,1.1,11],[11,2.8,-6],[7,3.9,-24],[24,3.2,-39],[43,1.7,-31],[54,1.2,-13],[43,.6,5],[28,1.3,21],[35,2.7,39],[56,3.7,47],[77,2,34]].map(p=>V(...p));
const route=new T.CatmullRomCurve3(control,false,'centripetal');route.arcLengthDivisions=2500;route.updateArcLengths();
const total=route.getLength();
function at(u){return route.getPointAt(clamp(u,0,1))}
function tangent(u){return route.getTangentAt(clamp(u,0,1)).normalize()}
function side(u){const t=tangent(u);return V(-t.z,0,t.x).normalize()}
function ribbon(width,height,material){
 const p=[],ix=[],n=1200;
 for(let i=0;i<=n;i++){const u=i/n,c=at(u),s=side(u);for(const sign of [-1,1])p.push(...c.clone().addScaledVector(s,width*sign).add(V(0,height,0)).toArray())}
 for(let i=0;i<n;i++){let a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);g.computeVertexNormals();return mesh(g,material);
}
// Bordas integradas à geometria, sem textura ou carregamento externo.
ribbon(3.32,-.10,gray);ribbon(3.06,0,pale);
function curveLine(offset,height,radius,material){const pp=[];for(let i=0;i<=1000;i++){const u=i/1000;pp.push(at(u).addScaledVector(side(u),offset).add(V(0,height,0)))}mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pp),1000,radius,5,false),material)}
curveLine(-2.91,.025,.035,blue);curveLine(2.91,.025,.035,blue);
const stripe=mat('#ffffff');
for(let s=1;s<total;s+=3.5){const u=s/total,p=at(u),d=tangent(u);const o=mesh(new T.BoxGeometry(.095,.018,1.25),stripe);o.position.copy(p).add(V(0,.028,0));o.quaternion.setFromUnitVectors(V(0,0,1),d)}
// Paisagem discreta: volumes claros preservam o fundo branco e a leitura da estrada.
const stops=[.055,.265,.485,.715,.955];
let seed=42;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
for(let i=0;i<70;i++){
 const u=.02+rand()*.96,p=at(u).addScaledVector(side(u),(rand()>.5?1:-1)*(5.5+rand()*7));
 if(stops.some(v=>p.distanceTo(at(v).addScaledVector(side(v),7.5))<6))continue;
 const h=.5+rand()*2.4;const o=mesh(new T.IcosahedronGeometry(1,0),i%6===0?mat('#cfdef3'):white);
 o.position.copy(p);o.position.y=-.46+h*.85;o.scale.set(1.1+rand()*2.2,h,1.1+rand()*2.2);o.rotation.y=rand()*6;
}
const labels=[];
stops.forEach((u,i)=>{
 const p=at(u),s=side(u),d=tangent(u);
 // Discos fora da faixa: o carro para na própria estrada.
 const base=mesh(new T.CylinderGeometry(2.45,2.55,.18,64),white);base.position.copy(p).addScaledVector(s,7.5).add(V(0,-.04,0));
 const ring=mesh(new T.TorusGeometry(2.12,.025,5,64),gray);ring.rotation.x=-Math.PI/2;ring.position.copy(base.position).add(V(0,.11,0));
 const c=document.createElement('canvas');c.width=256;c.height=256;const ctx=c.getContext('2d');ctx.clearRect(0,0,256,256);ctx.fillStyle='#0043bc';ctx.font='500 135px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(i+1).padStart(2,'0'),128,132);
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
 const label=mesh(new T.PlaneGeometry(2.6,2.6),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));
 label.rotation.x=-Math.PI/2;label.position.copy(base.position).add(V(0,.12,0));labels.push({base,ring,label});
 // Pinos baixos ao lado de cada parada.
 const post=mesh(new T.CylinderGeometry(.10,.10,1.35,12),blue);post.position.copy(p).addScaledVector(s,-4).add(V(0,.58,0));
 const cap=mesh(new T.SphereGeometry(.19,12,8),blue);cap.position.copy(post.position).add(V(0,.72,0));
});
// Leitor GLB restrito aos recursos efetivamente presentes no modelo original:
// malhas estáticas, materiais PBR sem imagens, matrizes e hierarquia de nós.
function readCar(b64){
 const raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const view=new DataView(raw.buffer);
 if(view.getUint32(0,true)!==0x46546c67)throw new Error('Modelo inválido');
 let json,bin;for(let pos=12;pos<raw.length;){const len=view.getUint32(pos,true),kind=view.getUint32(pos+4,true);pos+=8;if(kind===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(raw.subarray(pos,pos+len)));else if(kind===0x004e4942)bin=raw.slice(pos,pos+len);pos+=len}
 if(json.textures?.length||json.skins?.length||json.extensionsRequired?.length)throw new Error('Recurso de modelo não suportado');
 const types={5126:Float32Array,5123:Uint16Array,5125:Uint32Array,5121:Uint8Array};const count={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};
 function accessor(i){const a=json.accessors[i],b=json.bufferViews[a.bufferView],C=types[a.componentType],n=count[a.type];if(!C||!n)throw new Error('Accessor não suportado');const offset=(b.byteOffset||0)+(a.byteOffset||0),stride=b.byteStride||n*C.BYTES_PER_ELEMENT;let values;if(stride===n*C.BYTES_PER_ELEMENT)values=new C(bin.buffer,offset,a.count*n).slice();else{values=new C(a.count*n);for(let row=0;row<a.count;row++)values.set(new C(bin.buffer,offset+row*stride,n),row*n)}return new T.BufferAttribute(values,n,a.normalized||false)}
 const mats=json.materials.map(m=>{const p=m.pbrMetallicRoughness||{},v=p.baseColorFactor||[1,1,1,1];const out=new T.MeshStandardMaterial({color:new T.Color().setRGB(v[0],v[1],v[2]),metalness:p.metallicFactor??1,roughness:p.roughnessFactor??1,side:m.doubleSided?T.DoubleSide:T.FrontSide});if(m.emissiveFactor)out.emissive.setRGB(...m.emissiveFactor);return out});
 const geos=json.meshes.map(m=>m.primitives.map(p=>{const g=new T.BufferGeometry();const names={POSITION:'position',NORMAL:'normal',TEXCOORD_0:'uv',COLOR_0:'color'};for(const [key,i]of Object.entries(p.attributes))if(names[key])g.setAttribute(names[key],accessor(i));if(p.indices!==undefined)g.setIndex(accessor(p.indices));return {g,m:mats[p.material]}}));
 const nodes=json.nodes.map(n=>{const o=new T.Group();o.name=n.name||'';if(n.matrix)new T.Matrix4().fromArray(n.matrix).decompose(o.position,o.quaternion,o.scale);else{if(n.translation)o.position.fromArray(n.translation);if(n.rotation)o.quaternion.fromArray(n.rotation);if(n.scale)o.scale.fromArray(n.scale)}if(n.mesh!==undefined)for(const {g,m}of geos[n.mesh]){const child=mesh(g,m,o);child.name='Malha'}return o});
 json.nodes.forEach((n,i)=>(n.children||[]).forEach(k=>nodes[i].add(nodes[k])));const root=new T.Group();json.scenes[json.scene||0].nodes.forEach(i=>root.add(nodes[i]));return root;
}
const car=readCar('__CARRO_BASE64__');scene.add(car);
const wheels=[],steers=[];car.traverse(o=>{if(o.name.startsWith('Roda_giratoria'))wheels.push(o);if(o.name.startsWith('Manga_de_eixo'))steers.push(o)});
// O eixo longitudinal do modelo é +X; a base local acompanha a inclinação.
function orient(u){const x=tangent(u),z=new T.Vector3().crossVectors(x,V(0,1,0)).normalize(),y=new T.Vector3().crossVectors(z,x).normalize();return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z))}
let carU=stops[0],index=0,motion=null,lastTime=null,cameraTween=null,fade=null;
let look=V(),boom=V(),carTurn=orient(carU),wheelAngle=0;
const contentSides=['left','right','left','right','left','left'];
const probeCamera=new T.PerspectiveCamera(42,camera.aspect,.1,500);
const roadProbes=[];for(let j=0;j<=550;j++){const u=j/550;for(const s of [-3.4,-1.7,0,1.7,3.4])roadProbes.push(at(u).addScaledVector(side(u),s))}
let poses=[],layoutAudit=[];
function contentRect(i){return contentSides[i]==='left'?{x0:-.90,x1:-.04,y0:-.48,y1:.56}:{x0:.04,x1:.90,y0:-.48,y1:.56}}
function roadIntrusions(pose,i,margin=.015){
 probeCamera.position.copy(pose.look).add(pose.boom);probeCamera.lookAt(pose.look);probeCamera.updateMatrixWorld();
 const rect=contentRect(i);let n=0;const v=V();
 for(const p of roadProbes){v.copy(p).project(probeCamera);if(v.z>-1&&v.z<1&&v.x>rect.x0-margin&&v.x<rect.x1+margin&&v.y>rect.y0-margin&&v.y<rect.y1+margin)n++}return n;
}
function compose(p,offset,screenX){
 const right=V(offset.z,0,-offset.x).normalize();
 const shift=screenX*offset.length()*Math.tan(T.MathUtils.degToRad(21))*camera.aspect;
 return{look:p.clone().addScaledVector(right,-shift),boom:offset};
}
function makePoses(){
 probeCamera.aspect=camera.aspect;probeCamera.updateProjectionMatrix();
 poses=stops.map((u,i)=>{
  const p=at(u),sign=contentSides[i]==='left'?1:-1;let best=null,bestCost=Infinity;
  // Busca de POV: a estrada completa é projetada e testada contra a área do texto.
  // Isso reserva espaço por enquadramento, sem recortar ou esconder a estrada.
  for(const h of [23,27,31])for(const distance of [26,30])for(let k=0;k<48;k++){
   const yaw=k*Math.PI*2/48,offset=V(Math.sin(yaw)*distance,h,Math.cos(yaw)*distance);
   const pose=compose(p,offset,sign*.60),hits=roadIntrusions(pose,i);
   const preference=Math.abs(Math.atan2(Math.sin(yaw-i*.9),Math.cos(yaw-i*.9)));
   const cost=hits*100+(h-23)*.015+(distance-26)*.01+preference*.01;
   if(cost<bestCost){bestCost=cost;best={...pose,hits,yaw}}
  }
  labels[i].label.rotation.z=best.yaw;
  return best;
 });
 const aerialPoints=roadProbes.concat(stops.flatMap(u=>[-11,11].map(s=>at(u).addScaledVector(side(u),s))));
 let aerial=null,aerialCost=Infinity;
 for(let scale=.95;scale<=2;scale+=.05)for(let screenX=.40;screenX<=.60;screenX+=.025){
  const p=compose(V(18,0,6),V(-9,178,140).multiplyScalar(scale),screenX);
  probeCamera.position.copy(p.look).add(p.boom);probeCamera.lookAt(p.look);probeCamera.updateMatrixWorld();
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;const v=V();
  for(const point of aerialPoints){v.copy(point).project(probeCamera);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y)}
  const cost=scale+Math.abs((x0+x1)/2-.49)*.1;
  if(x0>.07&&x1<.91&&y0>-.60&&y1<.70&&cost<aerialCost){aerial=p;aerialCost=cost}
 }
 poses.push(aerial||compose(V(18,0,6),V(-9,356,280),.48));
 layoutAudit=poses.map((p,i)=>({side:contentSides[i],roadIntrusions:roadIntrusions(p,i,0),yaw:p.yaw}));
}
makePoses();
function stopPose(i){return poses[i]}
function place(u){car.position.copy(at(u)).add(V(0,-.06,0));car.quaternion.copy(carTurn)}
function setContent(){
 const end=index===5,busy=!!motion||!!cameraTween;
 $('conteudo').className='content'+(contentSides[index]==='right'?' right':'')+(end?' conclusion':'')+(busy?' absent':'');
 $('titulo-parada').textContent=end?'CONCLUSÃO · SLIDE 06':`PARADA ${String(index+1).padStart(2,'0')}`;
 $('titulo').innerHTML=end?'Uma visão do<br>caminho completo.':'Espaço para<br>a apresentação.';
 $('descricao').textContent=end?'Aqui entra a conclusão da apresentação, com a jornada inteira ao lado.':'Este retângulo está reservado para os textos, imagens e explicações de cada slide.';
 $('legenda-area').textContent=end?'ENCERRAMENTO DA JORNADA':'ÁREA DE CONTEÚDO · SEM ESTRADA';
}
function ensureSelectedVisible(){
 const list=$('numeros'),item=$('etapa-'+index),left=item.offsetLeft-list.offsetLeft;
 if(left<list.scrollLeft)list.scrollTo({left,behavior:'smooth'});
 else if(left+item.offsetWidth>list.scrollLeft+list.clientWidth)list.scrollTo({left:left+item.offsetWidth-list.clientWidth,behavior:'smooth'});
}
function ui(){
 const busy=!!motion||!!cameraTween||!!fade;
 $('anterior').disabled=busy||index===0;$('proximo').disabled=busy||index===5;
 $('proximo').textContent=index===4?'Conclusão →':'Avançar →';
 $('estado').innerHTML=fade?'Trocando slide <span>Transição suave</span>':cameraTween?'Novo enquadramento <span>Câmera em movimento</span>':motion?`Percurso ${String(index+1).padStart(2,'0')} → ${String(motion.to+1).padStart(2,'0')} <span>Em movimento</span>`:index===5?'Slide 06 <span>Conclusão</span>':`Slide ${String(index+1).padStart(2,'0')} <span>Aguardando avanço</span>`;
 for(let i=0;i<6;i++){$('etapa-'+i).className='step'+(i===index?' current':i<index?' done':'');$('etapa-'+i).setAttribute('aria-current',i===index?'step':'false')}
 labels.forEach((label,i)=>label.ring.material=i===index?blue:gray);
 setContent();ensureSelectedVisible();
}
function setInstant(to){
 index=to;carU=stops[Math.min(to,4)];carTurn.copy(orient(carU));place(carU);steers.forEach(s=>s.rotation.y=0);
 const pose=stopPose(to);look.copy(pose.look);boom.copy(pose.boom);
}
function selectSlide(to){
 if(fade||to<0||to>5||(index===to&&!motion&&!cameraTween))return;
 // Um salto cancela o percurso atual; a troca de mundo acontece apenas no branco total.
 motion=null;cameraTween=null;fade={to,time:0,switched:false};ui();
}
function advance(direction){
 if(motion||cameraTween||fade)return;
 const to=index+direction;if(to<0||to>5)return;
 if(to===5||index===5){
  const pose=stopPose(to);cameraTween={to,fromLook:look.clone(),fromBoom:boom.clone(),toLook:pose.look,toBoom:pose.boom,time:0};ui();return;
 }
 const from=carU,end=stops[to],length=Math.abs(end-from)*total;
 motion={from,end,to,direction,time:0,duration:Math.max(4.4,length/8.75),tracking:false,trackTime:0,initialLook:look.clone(),initialBoom:boom.clone(),endPose:stopPose(to)};ui();
}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{})}
$('proximo').addEventListener('click',()=>advance(1));$('anterior').addEventListener('click',()=>advance(-1));
for(let i=0;i<6;i++)$('etapa-'+i).addEventListener('click',()=>selectSlide(i));
function scrollList(direction){$('numeros').scrollBy({left:direction*($('etapa-0').offsetWidth+8),behavior:'smooth'})}
$('rolar-anterior').addEventListener('click',()=>scrollList(-1));$('rolar-proximo').addEventListener('click',()=>scrollList(1));
$('numeros').addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();$('numeros').scrollLeft+=e.deltaY}},{passive:false});
addEventListener('keydown',e=>{
 if(e.repeat||e.altKey||e.ctrlKey||e.metaKey)return;
 // Espaço e Enter conservam a semântica dos botões quando a lista tem foco.
 if(e.target.closest?.('.slide-nav')&&[' ','Enter','ArrowLeft','ArrowRight'].includes(e.key)){
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=clamp(Number(e.target.id.replace('etapa-',''))+(e.key==='ArrowRight'?1:-1),0,5);$('etapa-'+next)?.focus()}return;
 }
 const key=e.key.toLowerCase();if([' ','arrowright','pagedown','arrowleft','pageup','f'].includes(key)){e.preventDefault();if([' ','arrowright','pagedown'].includes(key))advance(1);else if(['arrowleft','pageup'].includes(key))advance(-1);else fullscreen()}
});
let resizeTimer;
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{makePoses();if(!motion&&!cameraTween&&!fade){const p=stopPose(index);look.copy(p.look);boom.copy(p.boom)}else if(motion)motion.endPose=stopPose(motion.to);else if(cameraTween){const p=stopPose(cameraTween.to);cameraTween.toLook=p.look;cameraTween.toBoom=p.boom}},150)});
const first=stopPose(0);look.copy(first.look);boom.copy(first.boom);place(carU);
function update(dt){
 if(fade){
  fade.time+=dt;const out=.27,hold=.08,into=.34;
  $('fade').style.opacity=fade.time<out?smooth(fade.time/out):fade.time<out+hold?1:1-smooth((fade.time-out-hold)/into);
  if(!fade.switched&&fade.time>=out){fade.switched=true;setInstant(fade.to);ui()}
  if(fade.time>=out+hold+into){fade=null;$('fade').style.opacity=0;ui()}
 }
 if(cameraTween){const t=cameraTween;t.time+=dt;const u=ease(clamp(t.time/2.1,0,1));look.lerpVectors(t.fromLook,t.toLook,u);boom.lerpVectors(t.fromBoom,t.toBoom,u);if(u===1){index=t.to;cameraTween=null;ui()}}
 if(motion){
  const m=motion;m.time+=dt;const q=clamp(m.time/m.duration,0,1),u=ease(q),previousU=carU;
  carU=lerp(m.from,m.end,u);
  // Voltar refaz o mesmo caminho de ré, mantendo a frente do carro orientada à estrada.
  const targetTurn=orient(carU);carTurn.slerp(targetTurn,1-Math.exp(-dt*12));
  const distance=(carU-previousU)*total;wheelAngle+=distance/.335;
  wheels.forEach(w=>w.rotation.z=-wheelAngle);
  const before=tangent(clamp(carU-.002,0,1)),after=tangent(clamp(carU+.002,0,1));
  const curvature=new T.Vector3().crossVectors(before,after).y;
  steers.forEach(s=>{if(s.position.x>0)s.rotation.y=clamp(curvature*3,-.28,.28)});
  place(carU);
  camera.position.copy(look).add(boom);camera.lookAt(look);camera.updateMatrixWorld();
  const ndc=car.position.clone().add(V(0,.8,0)).project(camera);
  // A parada é lateral. O gatilho considera a saída da área inicial e a proximidade da borda.
  const initialScreenX=contentSides[index]==='left'?.60:-.60;
  if(!m.tracking&&(Math.abs(ndc.x)>.70||Math.abs(ndc.y)>.45||Math.abs(ndc.x-initialScreenX)>.42)){m.tracking=true;m.trackTime=0}
  if(m.tracking){
   m.trackTime+=dt;
   const angleU=smooth((q-.10)/.78);
   // Interpolar o azimute evita que a câmera atravesse o mapa ao orbitar entre lados.
   const yaw0=Math.atan2(m.initialBoom.x,m.initialBoom.z),yaw1=Math.atan2(m.endPose.boom.x,m.endPose.boom.z);
   const yaw=yaw0+Math.atan2(Math.sin(yaw1-yaw0),Math.cos(yaw1-yaw0))*angleU;
   const radius=lerp(Math.hypot(m.initialBoom.x,m.initialBoom.z),Math.hypot(m.endPose.boom.x,m.endPose.boom.z),angleU);
   const b=V(Math.sin(yaw)*radius,lerp(m.initialBoom.y,m.endPose.boom.y,angleU)+Math.sin(angleU*Math.PI)*3,Math.cos(yaw)*radius);
   const right=V(b.z,0,-b.x).normalize();
   const endSign=contentSides[m.to]==='left'?1:-1;
   const framing=lerp(initialScreenX,endSign*.60,smooth((q-.55)/.40));
   // Durante o percurso o carro ocupa o centro; só na chegada abre espaço para o texto.
   const travelFraming=framing*(1-Math.sin(q*Math.PI)*.9);
   const desired=compose(at(carU),b,travelFraming).look;
   // O deslocamento começa sem salto; a câmera chega suavemente ao enquadramento de parada.
   desired.lerpVectors(m.initialLook,desired,smooth(m.trackTime/.95));
   look.lerp(desired,1-Math.exp(-dt*6));boom.lerp(b,1-Math.exp(-dt*4));
  }
  if(q===1){
   look.lerp(m.endPose.look,1-Math.exp(-dt*7));boom.lerp(m.endPose.boom,1-Math.exp(-dt*7));carTurn.slerp(targetTurn,1-Math.exp(-dt*14));place(carU);
   if(look.distanceTo(m.endPose.look)<.012&&boom.distanceTo(m.endPose.boom)<.012){look.copy(m.endPose.look);boom.copy(m.endPose.boom);carTurn.copy(targetTurn);place(carU);steers.forEach(s=>s.rotation.y=0);index=m.to;motion=null;ui()}
  }
 }
 // A visão geral precisa conservar o mapa visível também a grande distância.
 const aerialDistance=Math.max(0,boom.length()-50);
 scene.fog.near=90+aerialDistance*1.3;scene.fog.far=200+aerialDistance*2;
 camera.position.copy(look).add(boom);camera.lookAt(look);camera.updateMatrixWorld();
 if(motion){
  // Margem de segurança contínua: o carro inteiro permanece visível nas órbitas.
  const center=car.position.clone().add(V(0,.8,0)),screen=center.clone().project(camera);
  const depth=-center.clone().applyMatrix4(camera.matrixWorldInverse).z;
  const dx=(screen.x-clamp(screen.x,-.80,.80))*depth*Math.tan(T.MathUtils.degToRad(21))*camera.aspect;
  const dy=(screen.y-clamp(screen.y,-.70,.70))*depth*Math.tan(T.MathUtils.degToRad(21));
  if(dx||dy){look.addScaledVector(V().setFromMatrixColumn(camera.matrixWorld,0),dx).addScaledVector(V().setFromMatrixColumn(camera.matrixWorld,1),dy);camera.position.copy(look).add(boom);camera.lookAt(look)}
 }
 renderer.render(scene,camera);
}
function tick(time){const dt=lastTime===null?0:Math.min((time-lastTime)/1000,.06);lastTime=time;update(dt);requestAnimationFrame(tick)}
// Diagnóstico local para validação: sem telemetria, sem persistência e sem rede.
window.prototipo={estado:()=>({index,carU,moving:!!motion||!!cameraTween,fading:!!fade,tracking:motion?.tracking||false,conclusion:index===5,car:car.position.toArray(),screen:car.position.clone().project(camera).toArray(),camera:camera.position.toArray(),look:look.toArray(),wheels:wheels.length,drawCalls:renderer.info.render.calls,layout:layoutAudit}),advance,selectSlide};
ui();requestAnimationFrame(tick);
} catch(error){console.error(error);$('erro').classList.remove('hidden');$('erro').textContent='Não foi possível iniciar a cena 3D. Abra este arquivo no Microsoft Edge ou Google Chrome com suporte a WebGL. Detalhe: '+error.message;$('estado').textContent='Cena indisponível';}
})();
