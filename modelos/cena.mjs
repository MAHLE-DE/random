// Modelos 3D originais, genéricos e editáveis. Produção gráfica com Three.js 0.170.0.
// Nenhuma dimensão representa especificação de fabricação.
import * as T from '/vendor/three.module.js';
import {GLTFExporter} from '/vendor/GLTFExporter.js';
import {SVGLoader} from '/vendor/SVGLoader.js';
const W=1920,H=1080;
export const scene=new T.Scene();scene.background=new T.Color('#FFFFFF');scene.fog=new T.Fog('#FFFFFF',20,85);
export const camera=new T.PerspectiveCamera(36,W/H,.1,250);
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(W,H);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;document.body.appendChild(renderer.domElement);
const material=(color,metalness=0,roughness=.5,emissive=false)=>new T.MeshStandardMaterial({color,metalness,roughness,side:T.DoubleSide,...(emissive?{emissive:color,emissiveIntensity:.8}:{})});
const M={navy:material('#FFFFFF'),pavement:material('#E8EFF8'),road:material('#022954',.25),blue:material('#0043BC',.35,.3),glass:material('#111820',.55,.2),white:material('#EAEBFE'),light:material('#88CAFC',.2,.4,true),metal:material('#9DAFBD',.65,.3),poly:material('#263E53',.2,.4),inside:material('#0B1B2C'),teal:material('#17D6C3',.2,.4,true),amber:material('#FFB547',.2,.4,true),red:material('#FF5A5F',.2,.4,true),water:material('#399CD2',.2,.2),tire:material('#111820',0,.9)};
function mesh(g,m,name,parent=scene){const o=new T.Mesh(g,m);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(name,loc,dim,m,parent=scene){const o=mesh(new T.BoxGeometry(...dim),m,name,parent);o.position.set(...loc);return o;}
function cyl(name,loc,r,depth,m,parent=scene,n=24){const o=mesh(new T.CylinderGeometry(r,r,depth,n),m,name,parent);o.position.set(...loc);return o;}
function profile(name,pts,width,m,parent){const s=new T.Shape();pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const o=mesh(new T.ExtrudeGeometry(s,{depth:width,bevelEnabled:false,curveSegments:12}),m,name,parent);o.position.z=-width/2;return o;}
function polygon(name,pts,m,parent){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();return mesh(g,m,name,parent);}
function tube(name,pts,r,m,parent=scene,half=false){const path=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));const g=new T.TubeGeometry(path,24,r,16,false);if(half){const index=[];for(let i=0;i<24;i++)for(let j=8;j<16;j++){const a=i*17+j,b=(i+1)*17+j;index.push(a,b,a+1,b,b+1,a+1);}g.setIndex(index);}return mesh(g,m,name,parent);}
function line(name,pts,m,r=.015,parent=scene){return tube(name,pts,r,m,parent);}
function group(name,parent=scene){const o=new T.Group();o.name=name;parent.add(o);return o;}
scene.add(new T.HemisphereLight('#FFFFFF','#CBD8EA',2.1));const key=new T.DirectionalLight('#FFFFFF',1.6);key.position.set(-8,16,-6);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-18;key.shadow.camera.right=18;key.shadow.camera.top=18;key.shadow.camera.bottom=-18;scene.add(key);scene.add(key.target);
const rim=new T.DirectionalLight('#88CAFC',3);rim.position.set(10,8,5);scene.add(rim);
const floor=box('Plano_continuo',[0,-.25,70],[200,.2,230],M.navy);const grid=new T.GridHelper(240,48,'#E6EEF6','#F4F7FB');grid.position.set(0,-.14,70);scene.add(grid);
export function estrada(t){return new T.Vector3(3.8*Math.sin(t*.17),.15*Math.sin(t*.12),t);}
function direcao(t){return estrada(t+.01).sub(estrada(t-.01)).normalize();}
const road=group('Estrada_segmentada');
for(let k=0;k<42;k++){
 const vertices=[],idx=[];for(let j=0;j<=12;j++){let t=k*4+j/3,p=estrada(t),d=direcao(t),n=new T.Vector3(d.z,0,-d.x);for(let s of [-1,1])vertices.push(...p.clone().addScaledVector(n,1.4*s).toArray());}
 for(let j=0;j<12;j++)idx.push(j*2,j*2+1,j*2+2,j*2+1,j*2+3,j*2+2);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(idx);g.computeVertexNormals();mesh(g,M.pavement,'Segmento_'+String(k+1).padStart(2,'0'),road);
 for(let s of [-1,1]){const pts=[];for(let j=0;j<=12;j++){const t=k*4+j/3,p=estrada(t),d=direcao(t);pts.push(p.addScaledVector(new T.Vector3(d.z,0,-d.x),1.37*s).add(new T.Vector3(0,.025,0)).toArray());}line('Borda_conectada',pts,M.light,.014,road);}
 if(k%2===0){const p=estrada(k*4+2);const o=box('Marco_da_estrada',p.clone().add(new T.Vector3(0,.02,0)).toArray(),[.055,.02,.8],M.white,road);o.rotation.y=Math.atan2(direcao(p.z).x,direcao(p.z).z);}
 if([6,15,25,33].includes(k)){const p=estrada(k*4);for(let s of [-1,1])box('Pilar_portal',p.clone().add(new T.Vector3(s*1.7,1.8,0)).toArray(),[.13,3.6,.15],M.road,road);box('Portal',p.clone().add(new T.Vector3(0,3.6,0)).toArray(),[3.55,.10,.15],M.light,road);}
}
export const car=group('Carro_original');
// O perfil inferior é recortado em arco: os pneus não atravessam a carroceria.
const pts=[[-1.7,.40],[-1.7,1.02],[-1.3,1.10],[.60,1.10],[1.65,.98],[1.72,.8],[1.72,.40]];
for(let x of [1.04,-1.04]){pts.push([x+.43,.4]);for(let j=1;j<=12;j++)pts.push([x+.43*Math.cos(j*Math.PI/12),.4+.43*Math.sin(j*Math.PI/12)]);pts.push([x-.43,.4]);}
profile('Carroceria_com_caixas_de_roda',pts,1.5,M.blue,car);
profile('Cabine_alta',[[-1.35,1.05],[-1.20,1.72],[.20,1.72],[.70,1.05]],1.36,M.blue,car);
for(let side of [-1,1]){
 let z=side*.682;polygon('Vidro_lateral_traseiro',[[-1.23,1.13,z],[-1.10,1.63,z],[-.55,1.63,z],[-.55,1.13,z]],M.glass,car);polygon('Vidro_lateral_dianteiro',[[-.47,1.13,z],[-.47,1.63,z],[.15,1.63,z],[.53,1.13,z]],M.glass,car);
 box('Retrovisor',[.46,1.13,side*.82],[.20,.12,.20],M.blue,car);box('Macaneta',[-.65,.99,side*.754],[.18,.035,.018],M.metal,car);
}
polygon('Para_brisa_alinhado',[[.658,1.11,-.60],[.658,1.11,.60],[.244,1.665,.60],[.244,1.665,-.60]],M.glass,car);
polygon('Vidro_traseiro',[[-1.331,1.14,-.58],[-1.331,1.14,.58],[-1.219,1.64,.58],[-1.219,1.64,-.58]],M.glass,car);
for(let x of [-1.73,1.74])box('Para_choque',[x,.51,0],[.10,.15,1.4],M.tire,car);
for(let side of [-1,1]){box('Farol',[1.73,.85,side*.51],[.02,.13,.30],M.white,car);box('Lanterna',[-1.73,.86,side*.5],[.02,.12,.24],M.red,car);}
const wheels=[];
for(let x of [-1.04,1.04])for(let side of [-1,1]){
 const steering=group('Manga_de_eixo',car);steering.position.set(x,.40,side*.785);const w=group('Roda_giratoria',steering);w.userData.front=x>0;w.steering=steering;
 const tire=cyl('Pneu',[0,0,0],.335,.23,M.tire,w,64);tire.rotation.x=Math.PI/2;
 const hub=cyl('Aro',[0,0,side*.125],.215,.025,M.metal,w,48);hub.rotation.x=Math.PI/2;
 for(let j=0;j<5;j++){const a=j*Math.PI*2/5;const o=box('Raio',[.10*Math.sin(a),.10*Math.cos(a),side*.143],[.035,.17,.018],M.road,w);o.rotation.z=-a;}
 wheels.push(w);
}
// Path SVG de marca preservado em geometria separada, leitura externa em ambos os lados.
const svg=await(await fetch('/midias/mahle-vetor.svg')).text();const svgData=new SVGLoader().parse(svg);
for(let side of [-1,1]){
 const lg=group('Logotipo_vetorial_lateral_'+side,car);
 for(const p of svgData.paths)for(const sh of SVGLoader.createShapes(p))mesh(new T.ShapeGeometry(sh),M.white,'Marca_MAHLE_vetorial',lg);
 const scale=.78/113;lg.scale.set(scale,-scale,scale);
 if(side===1)lg.position.set(-.39,1.005,.758);else{lg.rotation.y=Math.PI;lg.position.set(.39,1.005,-.758);}
}
export const manifold=group('Coletor_generico');
const plenum=box('Plenum',[0,1.7,.15],[3.55,.85,.84],M.poly,manifold);
line('Linha_de_soldagem',[[-1.7,1.7,-.28],[1.7,1.7,-.28]],M.light,.012,manifold);
const inlet=cyl('Entrada_principal',[-1.91,1.7,.15],.33,.55,M.poly,manifold);inlet.rotation.z=Math.PI/2;
const throttle=cyl('Corpo_de_borboleta',[-2.26,1.7,.15],.35,.18,M.metal,manifold);throttle.rotation.z=Math.PI/2;
const runnerPaths=[],runnerMeshes=[];
for(let [i,x] of [-1.35,-.45,.45,1.35].entries()){
 const pp=[];for(let j=0;j<=12;j++){const t=j/12;pp.push([x,1.65-.98*(1-Math.cos(t*Math.PI/2)),-.02-1.10*Math.sin(t*Math.PI/2)]);}runnerPaths.push(pp);runnerMeshes.push(tube('Duto_'+(i+1),pp,.235,M.poly,manifold));
 const shape=new T.Shape();shape.moveTo(-.38,-.33);shape.lineTo(.38,-.33);shape.lineTo(.38,.33);shape.lineTo(-.38,.33);shape.closePath();const hole=new T.Path();hole.absellipse(0,.07,.235,.235,0,Math.PI*2,true);shape.holes.push(hole);const flange=mesh(new T.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:false,curveSegments:24}),M.poly,'Flange_'+(i+1),manifold);flange.position.set(x,.60,-1.26);
 const gasket=mesh(new T.TorusGeometry(.25,.022,6,24),M.teal,'Junta_'+(i+1),manifold);gasket.position.set(x,.67,-1.275);
 for(let dx of [-.30,.30]){const ins=cyl('Inserto_metalico',[x+dx,.83,-1.29],.055,.2,M.metal,manifold,12);ins.rotation.x=Math.PI/2;}
}
box('Sensor_generico',[.76,2.19,.06],[.27,.16,.25],M.glass,manifold);const aux=cyl('Conexao_auxiliar',[.20,1.82,.59],.075,.26,M.metal,manifold,12);aux.rotation.x=Math.PI/2;
export const engine=group('Motor_generico');
box('Bloco',[0,.23,-1.95],[3.6,1.1,1.45],M.road,engine);box('Cabecote',[0,.91,-1.72],[3.55,.35,.8],M.metal,engine);
for(let x of [-1.35,-.45,.45,1.35]){cyl('Cilindro',[x,.38,-2],.29,.95,M.metal,engine);cyl('Pistao',[x,.70,-2],.255,.12,M.poly,engine);}
const evidence=group('Elementos_tecnicos');const particles=[];let crashBarrier=null;
function clearEvidence(){while(evidence.children.length){const o=evidence.children[0];evidence.remove(o);o.traverse(c=>{if(c.geometry)c.geometry.dispose();});}particles.length=0;}
function pointLocal(v){return new T.Vector3(...v).add(manifold.position);}
function baseCamera(t,id){const p=estrada(t);const angle=.08*Math.sin(id*.65);return{pos:p.clone().add(new T.Vector3(-10+Math.sin(angle)*3,9.5+Math.cos(id*.5)*.4,-16)),look:p.clone().add(new T.Vector3(1.5,1.0,2.8))};}
let current=null;
const marcos=[];
for(const [s,id] of [[1,6],[2,7],[3,8],[4,9],[5,10],[6,11],[7,13],[8,16],[9,18],[10,19]]){
 const p=estrada(10+id*4.6);const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#FFFFFF';ctx.fillRect(0,0,256,128);ctx.font='bold 88px Arial';ctx.textAlign='center';ctx.fillStyle=s>=9?'#CA3643':s>=4?'#98600A':'#0043BC';ctx.fillText(String(s).padStart(2,'0'),128,98);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const m=new T.MeshBasicMaterial({map:texture,side:T.DoubleSide});const o=mesh(new T.PlaneGeometry(.86,.43),m,'Marco_de_severidade_'+s,road);o.position.copy(p).add(new T.Vector3(1.9,.82,0));marcos.push(o);box('Suporte_do_marco',p.clone().add(new T.Vector3(1.9,.34,0)).toArray(),[.06,.7,.06],M.light,road);
}
export function prepare(item){current=item;clearEvidence();const t=10+item.id*4.6,p=estrada(t);manifold.position.copy(p).add(new T.Vector3(-5.3,.8,1.1));manifold.rotation.set(0,0,0);manifold.scale.setScalar(1);engine.position.copy(manifold.position);engine.visible=item.visual==='motor';manifold.visible=true;plenum.visible=true;plenum.position.y=1.7;runnerMeshes.forEach(o=>o.visible=true);for(const o of manifold.children)if(o.name==='Inserto_metalico')o.visible=true;
 const v=item.visual;
 const localbox=(n,l,d,m)=>box(n,pointLocal(l).toArray(),d,m,evidence);
 const localline=(n,pp,m,r=.02)=>line(n,pp.map(x=>pointLocal(x).toArray()),m,r,evidence);
 if(['motor','explodido','obstrucao','particula','agua','trinca','pressao','parede','atuador','atuador2'].includes(v)){
   plenum.visible=false;localbox('Plenum_em_corte',[0,1.52,.35],[3.55,.50,.34],M.poly);runnerMeshes.forEach(o=>o.visible=false);
   runnerPaths.forEach((pp,k)=>{tube('Meia_casca_duto_'+k,pp.map(x=>pointLocal(x).toArray()),.235,M.poly,evidence,true);for(let q=2;q<12;q+=2){if(v==='obstrucao'&&k===1&&q>5)continue;const part=mesh(new T.SphereGeometry(.042,8,6),M.light,'Ar_ilustrativo',evidence);part.position.copy(pointLocal(pp[q]));particles.push({o:part,k,q});}});
 }
 if(v==='explodido'){plenum.visible=true;plenum.position.y=2.5;}
 if(v.startsWith('aparencia')){const n=v==='aparencia'?1:v==='aparencia2'?3:7;for(let j=0;j<n;j++)localline('Marca_superficial',[[.3+j*.06,1.9,-.283],[.55+j*.06,1.74,-.283]],n<7?M.light:M.amber,.009);}
 if(v==='acustica')for(let j=0;j<3;j++){let pp=[];for(let k=-8;k<=8;k++){let a=k*Math.PI/20;pp.push([2.1+j*.25+.3*Math.cos(a),1.7+.55*Math.sin(a),.15]);}localline('Onda_acustica',pp,M.amber,.025);}
 if(['atuador','atuador2'].includes(v)){for(let x of [-1.35,-.45,.45,1.35]){const o=localbox('Palheta_auxiliar',[x,1.15,-.95],[.35,.35,.03],M.amber);o.rotation.x=v==='atuador'?.6:0;}localline('Eixo_auxiliar',[[-1.6,1.15,-.95],[1.65,1.15,-.95]],M.metal,.025);localbox('Atuador_auxiliar',[1.95,1.15,-.95],[.4,.4,.3],M.road);}
 if(v==='inserto'){for(const o of manifold.children)if(o.name==='Inserto_metalico'&&Math.abs(o.position.x-.75)<.01)o.visible=false;const i=cyl('Inserto_deslocado',pointLocal([.8,1.1,-1.6]).toArray(),.12,.4,M.amber,evidence);i.rotation.x=Math.PI/2;i.rotation.z=.25;localbox('Interferencia',[1.3,.85,-1.6],[.8,.8,.2],M.metal);}
 if(['flange','dinamica'].includes(v)){const pp=[];for(let j=0;j<=32;j++){let x=j*.1-1.6;pp.push([x,.32+.07*Math.sin(x*3),-1.31]);}localline('Contato_irregular',pp,M.amber,.035);localline('Referencia_plana',[[-1.7,.23,-1.34],[1.7,.23,-1.34]],M.teal,.018);}
 if(v==='obstrucao')localbox('Obstrucao',[ -.45,1.22,-.97],[.40,.2,.28],M.amber);
 if(v==='particula')for(let j=0;j<7;j++){const o=mesh(new T.IcosahedronGeometry(.055+j*.003,0),M.amber,'Particula_solida',evidence);o.position.copy(pointLocal(runnerPaths[2][j+3]));}
 if(v==='agua')localbox('Acumulo_de_agua',[0,1.6,.12],[2.9,.10,.44],M.water);
 if(v==='quimica')for(let j=0;j<17;j++)localbox('Regiao_degradada',[Math.sin(j*2.3)*1.4,1.5+((j*7)%10)*.05,-.285],[.09,.07,.025],M.amber);
 if(['parede','pressao','trinca'].includes(v))localbox('Parede_vulneravel',[.5,1.98,.3],[1.4,.42,.055],M.amber);
 if(v==='pressao')for(let j=0;j<3;j++){const o=mesh(new T.TorusGeometry(.34+j*.16,.02,6,32),M.amber,'Pulso_de_pressao',evidence);o.position.copy(pointLocal([0,1.75,.1]));}
 if(v==='trinca'){localline('Trinca',[[.15,1.35,-.28],[.25,1.55,-.29],[.19,1.70,-.29],[.39,1.95,-.29]],M.red,.025);for(let j=0;j<4;j++)localline('Fuga',[[.26,1.66+j*.07,-.3],[.35,1.7+j*.10,-.9]],M.amber,.018);}
 if(['fabrica','equipes'].includes(v)){for(let j=0;j<6;j++)box('Estacao_de_processo',p.clone().add(new T.Vector3(7.5+j*.8,.5,5+j*1.2)).toArray(),[.6,1,.6],M.road,evidence);}
 if(['barreiras','retorno','equipes'].includes(v))for(let j=0;j<5;j++){const q=estrada(t+3+j*1.6);box('Barreira_'+j,q.add(new T.Vector3(0,.5,0)).toArray(),[2.6,1,.055],v==='retorno'?M.amber:M.teal,evidence);}
 if(v==='bifurcacao'){manifold.visible=false;const pp=[];for(let j=0;j<24;j++){const u=j*.32;pp.push(estrada(t+u).add(new T.Vector3(u*.42,.04,0)).toArray());}line('Rota_de_escape',pp,M.red,.04,evidence);}
 if(v==='legal'){const q=estrada(t+3);box('Portal_de_liberacao',q.add(new T.Vector3(0,1.1,0)).toArray(),[2.8,.12,.14],M.red,evidence);}
 if(v==='acidente'){manifold.visible=false;engine.visible=false;crashBarrier=box('Barreira_de_protecao',p.clone().add(new T.Vector3(2.3,.5,2.8)).toArray(),[.18,1,4.0],M.metal,evidence);}
 if(v==='final'){for(let j=0;j<4;j++)line('Rede_do_sistema',[p.clone().add(new T.Vector3(-4,.1,4+j*2)).toArray(),p.clone().add(new T.Vector3(7,1,6+j*2)).toArray()],M.light,.015,evidence);}
 const cam=baseCamera(t,item.id);return {t,cam};
}
export function frame(item,u=1,technical=0){
 const t=10+item.id*4.6;const prev=10+(item.id-1)*4.6;const ease=u*u*(3-2*u);const travel=prev+(t-prev)*ease;const a=baseCamera(prev,item.id-1),b=baseCamera(t,item.id);camera.position.lerpVectors(a.pos,b.pos,ease);const look=a.look.clone().lerp(b.look,ease);camera.lookAt(look);
 const cp=estrada(travel);car.position.copy(cp);car.scale.setScalar(.58);car.rotation.set(0,-Math.atan2(direcao(travel).z,direcao(travel).x),.01*Math.sin(travel));
 wheels.forEach(w=>{w.rotation.z=-(travel-prev)/(.335*.58);if(w.userData.front)w.steering.rotation.y=-.04*Math.sin(travel*.17);});
 manifold.position.copy(estrada(travel)).add(new T.Vector3(-5.3,.8,1.1));engine.position.copy(manifold.position);evidence.position.copy(estrada(travel)).sub(estrada(t));
 if(item.s>=7&&item.s<=8){car.position.y+=.012*Math.sin(u*40);}
 if(item.visual==='acidente'&&technical>0){const p=estrada(t);const k=Math.min(1,technical);car.position.copy(p).add(new T.Vector3(1.25*k,.02,1.7*k));car.rotation.y+=.32*k;wheels.forEach(w=>{w.rotation.z=-k*5;});}
 if(item.visual==='pressao'&&technical>0)evidence.children.filter(o=>o.name==='Pulso_de_pressao').forEach((o,j)=>o.scale.setScalar(.65+((technical+j*.25)%1)*.65));
 if(item.visual==='inserto'){const o=evidence.children.find(o=>o.name==='Inserto_deslocado');const p=pointLocal([.75+.05*technical,.83+.27*technical,-1.29-.31*technical]);o.position.copy(p).sub(evidence.position);o.rotation.z=.25*technical;}
 if(item.visual==='agua'&&technical>0){const o=evidence.children.find(o=>o.name==='Acumulo_de_agua');o.scale.y=.2+.8*technical;}
 for(const p of particles){const idx=Math.min(12,(p.q+technical*3)%12);const aa=runnerPaths[p.k][Math.floor(idx)],bb=runnerPaths[p.k][Math.min(12,Math.floor(idx)+1)];p.o.position.copy(pointLocal(aa)).lerp(pointLocal(bb),idx%1).sub(evidence.position);}
 for(const o of marcos)o.lookAt(camera.position);
 key.position.set(cp.x-8,16,cp.z-6);key.target.position.set(cp.x+2,0,cp.z+2);renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');
}
export async function exportGLB(name){const target={carro:car,coletor:manifold,motor:engine,estrada:road}[name];const clone=target.clone(true);clone.position.set(0,0,0);clone.rotation.set(0,0,0);clone.scale.setScalar(1);clone.visible=true;clone.traverse(o=>o.visible=true);const result=await new GLTFExporter().parseAsync(clone,{binary:true,onlyVisible:false});return Array.from(new Uint8Array(result));}
export function counts(){let triangles=0;car.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;});return{triangulos:triangles,rodas:wheels.length};}
function previaCarro(side){for(const o of scene.children)o.visible=o===car||o===floor||o.isLight||o===key.target;floor.position.y=-.035;car.position.set(0,0,0);car.scale.setScalar(1);car.rotation.set(0,0,0);wheels.forEach(w=>{w.rotation.z=0;w.steering.rotation.y=0;});camera.position.set(4,2.6,side*6);camera.lookAt(0,.8,0);key.position.set(-4,8,-3);key.target.position.set(0,0,0);renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png');}
window.producao={prepare,frame,exportGLB,counts,previaCarro,resolucao:(w,h)=>renderer.setSize(w,h)};
