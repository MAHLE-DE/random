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
__DANO_SOURCE__
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
const crashOrigin=at(stops[4]),exitSide=side(stops[4]),exitTangent=tangent(stops[4]);
const treePosition=crashOrigin.clone().addScaledVector(exitTangent,8).addScaledVector(exitSide,7);
treePosition.y=crashOrigin.y-.11;
const crashDirection=treePosition.clone().sub(crashOrigin).setY(0).normalize();
const hitPosition=treePosition.clone().addScaledVector(crashDirection,-2.16).add(V(0,.05,0));
const wreckPosition=treePosition.clone().addScaledVector(crashDirection,-1.38).add(V(0,.05,0));
const escapeCurve=new T.CubicBezierCurve3(crashOrigin.clone().add(V(0,-.06,0)),crashOrigin.clone().addScaledVector(exitTangent,3.6),hitPosition.clone().addScaledVector(crashDirection,-3),hitPosition.clone());
const tree=new T.Group();tree.name='Arvore_do_impacto';tree.position.copy(treePosition);scene.add(tree);
const trunkMat=mat('#735441'),leafMat=mat('#51766a'),leafLight=mat('#739486');
const island=mesh(new T.CylinderGeometry(4.5,5.0,.22,48),white);island.position.copy(treePosition).add(V(0,-.20,0));
const trunk=mesh(new T.CylinderGeometry(.30,.43,4.0,13),trunkMat,tree);trunk.position.y=1.85;
for(const [x,y,z,r]of [[-.7,4.6,0,1.45],[.8,4.9,.1,1.65],[0,5.7,-.3,1.7],[.1,4.3,.8,1.35]]){const foliage=mesh(new T.IcosahedronGeometry(r,1),y>5?leafLight:leafMat,tree);foliage.position.set(x,y,z)}
let seed=42;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
for(let i=0;i<70;i++){
 const u=.02+rand()*.96,p=at(u).addScaledVector(side(u),(rand()>.5?1:-1)*(5.5+rand()*7));
 if(stops.some(v=>p.distanceTo(at(v).addScaledVector(side(v),7.5))<6))continue;
 if(p.distanceTo(treePosition)<7||p.distanceTo(escapeCurve.getPoint(.65))<4)continue;
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
const damaged=criarCarroAmassado(T,car);scene.add(damaged.root);damaged.root.visible=false;
const fire=new T.Group();fire.name='Fogo_pos_impacto';damaged.root.add(fire);fire.visible=false;
const flames=[],smoke=[];
const flameShape=new T.LatheGeometry([new T.Vector2(0,0),new T.Vector2(.20,.12),new T.Vector2(.28,.4),new T.Vector2(.15,.9),new T.Vector2(.035,1.4),new T.Vector2(0,1.7)],10);
for(let i=0;i<20;i++){
 const m=new T.MeshBasicMaterial({color:i%3===0?'#fff0a1':i%2?'#ff9a16':'#f34d10',transparent:true,opacity:.88,depthWrite:false,toneMapped:false});
 const f=mesh(flameShape,m,fire);f.castShadow=false;f.receiveShadow=false;
 const angle=i*2.39996,radius=.15+(i%5)*.10;
 flames.push({mesh:f,x:.35+Math.cos(angle)*radius,z:Math.sin(angle)*radius,phase:i*.47});
}
for(let i=0;i<12;i++){const m=new T.MeshBasicMaterial({color:'#6f737a',transparent:true,opacity:.2,depthWrite:false});const s=mesh(new T.IcosahedronGeometry(1,1),m,fire);s.castShadow=false;s.receiveShadow=false;smoke.push({mesh:s,phase:i/12})}
const fireLight=new T.PointLight('#ff9a30',0,8,2);fireLight.position.set(.3,1.5,0);fire.add(fireLight);
const skid=new T.Group();skid.name='Marcas_de_derrapagem';scene.add(skid);skid.visible=false;
for(const s of [-.70,.70]){const points=[];for(let j=0;j<=80;j++){const q=j/80,p=escapeCurve.getPoint(q),d=escapeCurve.getTangent(q),normal=V(-d.z,0,d.x).normalize();p.addScaledVector(normal,s);p.y=treePosition.y+.008;points.push(p)}const mark=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),80,.035,4,false),mat('#7b8999'),skid);mark.castShadow=false}
const localCarBox=new T.Box3().setFromObject(car);
const carCorners=[];for(const x of [localCarBox.min.x,localCarBox.max.x])for(const y of [localCarBox.min.y,localCarBox.max.y])for(const z of [localCarBox.min.z,localCarBox.max.z])carCorners.push(V(x,y,z));
const wheels=[],steers=[];car.traverse(o=>{if(o.name.startsWith('Roda_giratoria'))wheels.push(o);if(o.name.startsWith('Manga_de_eixo'))steers.push(o)});
// O eixo longitudinal do modelo é +X; a base local acompanha a inclinação.
function orient(u){const x=tangent(u),z=new T.Vector3().crossVectors(x,V(0,1,0)).normalize(),y=new T.Vector3().crossVectors(z,x).normalize();return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z))}
let carU=stops[0],index=0,motion=null,lastTime=null,cameraTween=null,fade=null,crash=null,crashed=false,fireTime=0,impacts=0,crashPose=null;
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
function fitPose(p,i,includeTree=false){
 const sign=contentSides[i]==='left'?1:-1;let best=null,bestCost=Infinity;
 for(const h of [23,27,31])for(const distance of [26,30])for(let k=0;k<48;k++){
  const yaw=k*Math.PI*2/48,offset=V(Math.sin(yaw)*distance,h,Math.cos(yaw)*distance);
  const pose=compose(p,offset,sign*.60),hits=roadIntrusions(pose,i);
  const preference=Math.abs(Math.atan2(Math.sin(yaw-i*.9),Math.cos(yaw-i*.9)));
  let treePenalty=0;
  if(includeTree){for(const x of [-2.4,2.4])for(const y of [0,7])for(const z of [-2.4,2.4]){const v=treePosition.clone().add(V(x,y,z)).project(probeCamera);if(v.x<.03||v.x>.94||v.y<-.66||v.y>.78)treePenalty+=10000}}
  const cost=hits*100+(h-23)*.015+(distance-26)*.01+preference*.01+treePenalty;
  if(cost<bestCost){bestCost=cost;best={...pose,hits,yaw}}
 }return best;
}
function makePoses(){
 probeCamera.aspect=camera.aspect;probeCamera.updateProjectionMatrix();
 poses=stops.map((u,i)=>{
  const p=at(u);
  // Busca de POV: a estrada completa é projetada e testada contra a área do texto.
  // Isso reserva espaço por enquadramento, sem recortar ou esconder a estrada.
  const best=fitPose(p,i);
  labels[i].label.rotation.z=best.yaw;
  return best;
 });
 crashPose=fitPose(wreckPosition.clone().add(V(0,.06,0)),4,true);
 const aerialPoints=roadProbes.concat(stops.flatMap(u=>[-11,11].map(s=>at(u).addScaledVector(side(u),s))),[treePosition,treePosition.clone().add(V(0,7,0))]);
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
function presentationPose(i){return i===4&&crashed?crashPose:stopPose(i)}
function place(u){car.position.copy(at(u)).add(V(0,-.06,0));car.quaternion.copy(carTurn)}
function directionQuaternion(d){const x=d.clone().normalize(),z=V().crossVectors(x,V(0,1,0)).normalize(),y=V().crossVectors(z,x).normalize();return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z))}
function syncDamaged(){damaged.root.position.copy(car.position);damaged.root.quaternion.copy(car.quaternion)}
function resetCrash(){crash=null;crashed=false;fireTime=0;impacts=0;damaged.aplicar(0);damaged.root.visible=false;car.visible=true;fire.visible=false;skid.visible=false}
function finishWreck(){car.position.copy(wreckPosition);car.quaternion.copy(directionQuaternion(crashDirection));syncDamaged();damaged.aplicar(1);damaged.root.visible=true;car.visible=false;fire.visible=true;skid.visible=true;crashed=true;fireTime=Math.max(fireTime,1)}
function beginCrash(){crash={time:0,impacted:false,initialLook:look.clone(),initialBoom:boom.clone()};ui()}
function setContent(){
 const end=index===5,busy=!!motion||!!cameraTween||!!crash;
 $('conteudo').className='content'+(contentSides[index]==='right'?' right':'')+(end?' conclusion':'')+(busy?' absent':'');
 $('titulo-parada').textContent=end?'CONCLUSÃO · SLIDE 06':`PARADA ${String(index+1).padStart(2,'0')}`;
 $('titulo').innerHTML=end?'Uma visão do<br>caminho completo.':index===4&&crashed?'Perda de controle.<br>Impacto frontal.':'Espaço para<br>a apresentação.';
 $('descricao').textContent=end?'Aqui entra a conclusão da apresentação, com a jornada inteira ao lado.':index===4&&crashed?'Demonstração visual da batida. Selecione 05 novamente para repetir a sequência.':'Este retângulo está reservado para os textos, imagens e explicações de cada slide.';
 $('legenda-area').textContent=end?'ENCERRAMENTO DA JORNADA':'ÁREA DE CONTEÚDO · SEM ESTRADA';
}
function ensureSelectedVisible(){
 const list=$('numeros'),item=$('etapa-'+index),left=item.offsetLeft-list.offsetLeft;
 if(left<list.scrollLeft)list.scrollTo({left,behavior:'smooth'});
 else if(left+item.offsetWidth>list.scrollLeft+list.clientWidth)list.scrollTo({left:left+item.offsetWidth-list.clientWidth,behavior:'smooth'});
}
function ui(){
 const busy=!!motion||!!cameraTween||!!fade||!!crash;
 $('anterior').disabled=busy||index===0;$('proximo').disabled=busy||index===5;
 $('proximo').textContent=index===4?'Conclusão →':'Avançar →';
 $('estado').innerHTML=fade?'Trocando slide <span>Transição suave</span>':crash?`Slide 05 <span>${crash.impacted?'Impacto frontal':'Perda de controle'}</span>`:cameraTween?'Novo enquadramento <span>Câmera em movimento</span>':motion?`Percurso ${String(index+1).padStart(2,'0')} → ${String(motion.to+1).padStart(2,'0')} <span>Em movimento</span>`:index===5?'Slide 06 <span>Conclusão</span>':`Slide ${String(index+1).padStart(2,'0')} <span>${crashed?'Após o impacto':'Aguardando avanço'}</span>`;
 for(let i=0;i<6;i++){$('etapa-'+i).className='step'+(i===index?' current':i<index?' done':'');$('etapa-'+i).setAttribute('aria-current',i===index?'step':'false')}
 labels.forEach((label,i)=>label.ring.material=i===index?blue:gray);
 setContent();ensureSelectedVisible();
}
function setInstant(to){
 resetCrash();
 index=to;carU=stops[Math.min(to,4)];carTurn.copy(orient(carU));place(carU);steers.forEach(s=>s.rotation.y=0);
 if(to===5)finishWreck();
 const pose=presentationPose(to);look.copy(pose.look);boom.copy(pose.boom);
}
function selectSlide(to){
 if(fade||to<0||to>5||(index===to&&to!==4&&!motion&&!cameraTween&&!crash))return;
 // Um salto cancela o percurso atual; a troca de mundo acontece apenas no branco total.
 motion=null;cameraTween=null;crash=null;fade={to,time:0,switched:false};ui();
}
function advance(direction){
 if(motion||cameraTween||fade||crash)return;
 const to=index+direction;if(to<0||to>5)return;
 if(index===4&&crashed&&direction<0){selectSlide(to);return}
 if(to===5||index===5){
  const pose=presentationPose(to);cameraTween={to,fromLook:look.clone(),fromBoom:boom.clone(),toLook:pose.look,toBoom:pose.boom,time:0,duration:3};ui();return;
 }
 const from=carU,end=stops[to];
 // Um único relógio sincroniza carro, órbita e composição: todos chegam juntos.
 motion={from,end,to,direction,time:0,duration:3,initialLook:look.clone(),initialBoom:boom.clone(),endPose:stopPose(to)};ui();
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
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{makePoses();if(!motion&&!cameraTween&&!fade&&!crash){const p=presentationPose(index);look.copy(p.look);boom.copy(p.boom)}else if(motion)motion.endPose=stopPose(motion.to);else if(cameraTween){const p=presentationPose(cameraTween.to);cameraTween.toLook=p.look;cameraTween.toBoom=p.boom}},150)});
const first=stopPose(0);look.copy(first.look);boom.copy(first.boom);place(carU);
function update(dt){
 if(fade){
  fade.time+=dt;const out=.27,hold=.08,into=.34;
  $('fade').style.opacity=fade.time<out?smooth(fade.time/out):fade.time<out+hold?1:1-smooth((fade.time-out-hold)/into);
  if(!fade.switched&&fade.time>=out){fade.switched=true;setInstant(fade.to);ui()}
  if(fade.time>=out+hold+into){fade=null;$('fade').style.opacity=0;if(index===4)beginCrash();else ui()}
 }
 if(cameraTween){const t=cameraTween;t.time+=dt;const u=ease(clamp(t.time/t.duration,0,1));look.lerpVectors(t.fromLook,t.toLook,u);boom.lerpVectors(t.fromBoom,t.toBoom,u);if(u===1){index=t.to;cameraTween=null;ui()}}
 if(motion){
  const m=motion;m.time+=dt;const q=clamp(m.time/m.duration,0,1),u=ease(q),previousU=carU;
  carU=lerp(m.from,m.end,u);
  // Voltar refaz o mesmo caminho de ré, mantendo a frente do carro orientada à estrada.
  carTurn.copy(orient(carU));
  const distance=(carU-previousU)*total;wheelAngle+=distance/.335;
  wheels.forEach(w=>w.rotation.z=-wheelAngle);
  const before=tangent(clamp(carU-.002,0,1)),after=tangent(clamp(carU+.002,0,1));
  const curvature=new T.Vector3().crossVectors(before,after).y;
  steers.forEach(s=>{if(s.position.x>0)s.rotation.y=clamp(curvature*3,-.28,.28)*Math.sin(q*Math.PI)**2});
  place(carU);
  // Curva quintica: velocidade e aceleração nulas nas duas extremidades.
  // O POV já se move no primeiro quadro, sem gatilho de borda, perseguição ou correção tardia.
  const initialScreenX=contentSides[index]==='left'?.60:-.60;
  const yaw0=Math.atan2(m.initialBoom.x,m.initialBoom.z),yaw1=Math.atan2(m.endPose.boom.x,m.endPose.boom.z);
  const yaw=yaw0+Math.atan2(Math.sin(yaw1-yaw0),Math.cos(yaw1-yaw0))*u;
  const radius=lerp(Math.hypot(m.initialBoom.x,m.initialBoom.z),Math.hypot(m.endPose.boom.x,m.endPose.boom.z),u);
  const lift=Math.sin(u*Math.PI)**2*3;
  boom.set(Math.sin(yaw)*radius,lerp(m.initialBoom.y,m.endPose.boom.y,u)+lift,Math.cos(yaw)*radius);
  const endScreenX=contentSides[m.to]==='left'?.60:-.60;
  // Composição lateral na saída/chegada; liberdade central durante a viagem.
  const framing=lerp(initialScreenX,endScreenX,u)*(1-Math.sin(u*Math.PI)**2*.75);
  look.copy(compose(at(carU),boom,framing).look);
  if(q===1){
   look.copy(m.endPose.look);boom.copy(m.endPose.boom);steers.forEach(s=>s.rotation.y=0);index=m.to;motion=null;if(index===4&&m.direction>0)beginCrash();else ui();
  }
 }
 if(crash){
  const c=crash;c.time+=dt;const contactTime=1.55,crushTime=.20,duration=3;
  if(c.time<contactTime){
   const q=clamp(c.time/contactTime,0,1),u=q*q*(2-q),d=escapeCurve.getTangent(u).normalize();
   car.position.copy(escapeCurve.getPoint(u));car.quaternion.copy(directionQuaternion(d));
   car.quaternion.multiply(new T.Quaternion().setFromAxisAngle(V(0,1,0),Math.sin(u*6*Math.PI)*Math.sin(u*Math.PI)**2*.25));
   wheelAngle+=dt*12;wheels.forEach(w=>w.rotation.z=-wheelAngle);steers.forEach(s=>{if(s.position.x>0)s.rotation.y=Math.sin(u*6*Math.PI)*.35});
   skid.visible=q>.12;
  }else{
   if(!c.impacted){c.impacted=true;impacts++;car.visible=false;damaged.root.visible=true;ui()}
   const d=ease(clamp((c.time-contactTime)/crushTime,0,1));
   car.position.lerpVectors(hitPosition,wreckPosition,d);car.quaternion.copy(directionQuaternion(crashDirection));
   const rebound=Math.sin(Math.min((c.time-contactTime)*15,Math.PI))*Math.exp(-(c.time-contactTime)*8)*.06;
   car.quaternion.multiply(new T.Quaternion().setFromAxisAngle(V(0,0,1),rebound));
   syncDamaged();damaged.aplicar(d);
   if(c.time>contactTime+.44)fire.visible=true;
  }
  const u=ease(clamp(c.time/duration,0,1)),yaw0=Math.atan2(c.initialBoom.x,c.initialBoom.z),yaw1=Math.atan2(crashPose.boom.x,crashPose.boom.z);
  const yaw=yaw0+Math.atan2(Math.sin(yaw1-yaw0),Math.cos(yaw1-yaw0))*u;
  const radius=lerp(Math.hypot(c.initialBoom.x,c.initialBoom.z),Math.hypot(crashPose.boom.x,crashPose.boom.z),u);
  boom.set(Math.sin(yaw)*radius,lerp(c.initialBoom.y,crashPose.boom.y,u)+Math.sin(u*Math.PI)**2*1.5,Math.cos(yaw)*radius);
  look.copy(compose(car.position.clone().add(V(0,.06,0)),boom,.60).look);
  if(c.time>=duration){finishWreck();look.copy(crashPose.look);boom.copy(crashPose.boom);crash=null;ui()}
 }
 if(fire.visible){
  fireTime+=dt;const strength=smooth(fireTime/.55);
  for(const f of flames){const phase=(fireTime*.95+f.phase)%1,flicker=.82+.18*Math.sin(fireTime*11+f.phase*7);f.mesh.position.set(f.x+Math.sin(fireTime*3+f.phase)*.07,.87+phase*.42,f.z);f.mesh.scale.setScalar(1);f.mesh.scale.set((.50+.24*Math.sin(f.phase*6))*flicker,(.7+.65*Math.sin(f.phase*8)**2)*strength,(.5+.20*Math.cos(f.phase*5))*flicker);f.mesh.rotation.set(Math.sin(fireTime*4+f.phase)*.11,0,Math.cos(fireTime*3+f.phase)*.14);f.mesh.material.opacity=(.64+.27*flicker)*strength}
  for(const s of smoke){const p=(fireTime*.13+s.phase)%1;s.mesh.position.set(.3+p*.9+Math.sin(p*7+s.phase)*.3,1.9+p*3.7,p*.4);s.mesh.scale.setScalar(.28+p*.85);s.mesh.material.opacity=Math.sin(p*Math.PI)*.16*strength}
  fireLight.intensity=(3+Math.sin(fireTime*13)*.8)*strength;
 }
 // A visão geral precisa conservar o mapa visível também a grande distância.
 const aerialDistance=Math.max(0,boom.length()-50);
 scene.fog.near=90+aerialDistance*1.3;scene.fog.far=200+aerialDistance*2;
 camera.position.copy(look).add(boom);camera.lookAt(look);camera.updateMatrixWorld();
 renderer.render(scene,camera);
}
// Tempo real de apresentação, independente da taxa de quadros. Pausa quando a aba fica oculta.
document.addEventListener('visibilitychange',()=>{lastTime=null});
function tick(time){const dt=lastTime===null?0:Math.max((time-lastTime)/1000,0);lastTime=time;update(dt);requestAnimationFrame(tick)}
// Diagnóstico local para validação: sem telemetria, sem persistência e sem rede.
window.prototipo={estado:()=>({index,carU,moving:!!motion||!!cameraTween||!!crash,fading:!!fade,tracking:!!motion,crashTime:crash?.time??null,crashed,fire:fire.visible,impacts,damagedVisible:damaged.root.visible,tree:treePosition.toArray(),frontDirection:V(1,0,0).applyQuaternion(car.quaternion).toArray(),wreckPosition:wreckPosition.toArray(),crashLayout:roadIntrusions(crashPose,4,0),progress:motion?clamp(motion.time/motion.duration,0,1):cameraTween?clamp(cameraTween.time/cameraTween.duration,0,1):null,conclusion:index===5,car:car.position.toArray(),screen:car.position.clone().project(camera).toArray(),carBounds:carCorners.map(p=>p.clone().applyMatrix4(car.matrixWorld).project(camera).toArray()),camera:camera.position.toArray(),look:look.toArray(),wheels:wheels.length,drawCalls:renderer.info.render.calls,layout:layoutAudit}),advance,selectSlide,exportarAmassado:()=>damaged.exportar()};
ui();requestAnimationFrame(tick);
} catch(error){console.error(error);$('erro').classList.remove('hidden');$('erro').textContent='Não foi possível iniciar a cena 3D. Abra este arquivo no Microsoft Edge ou Google Chrome com suporte a WebGL. Detalhe: '+error.message;$('estado').textContent='Cena indisponível';}
})();
