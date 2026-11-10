/* Cena única, percurso por comprimento de arco, carro e câmera independentes.
   Biblioteca e modelo são incorporados por gerar.mjs. Nenhuma requisição de rede. */
(() => {
'use strict';
__CONFIG_SOURCE__
const TRAVEL_DURATION=CONFIG.percurso.duracaoTransicao;
const $=id=>document.getElementById(id);
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const clamp=T.MathUtils.clamp;
const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
const ease=x=>x*x*x*(x*(x*6-15)+10);
const lerp=T.MathUtils.lerp;
__DANO_SOURCE__
__VEGETACAO_SOURCE__
__COLETOR_SOURCE__
__VISIBILITY_SOURCE__
__EFFECTS_SOURCE__
__VISOR_SOURCE__
try {
const scene=new T.Scene();scene.background=new T.Color('#b4c99b');
scene.fog=new T.Fog('#b4c99b',110,245);
const camera=new T.PerspectiveCamera(42,innerWidth/innerHeight,.8,1100);
const renderer=new T.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFShadowMap;$('mundo').appendChild(renderer.domElement);
renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
scene.add(new T.HemisphereLight('#c8e2eb','#303d29',1.25));
const sun=new T.DirectionalLight('#fff0ce',3.0);sun.position.set(-38,58,26);
sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);
Object.assign(sun.shadow.camera,{left:-48,right:48,top:48,bottom:-48,near:1,far:180});
sun.shadow.bias=-.00006;sun.shadow.normalBias=.022;sun.shadow.radius=2.2;scene.add(sun);scene.add(sun.target);
const fillLight=new T.DirectionalLight('#bdd9e9',.40);fillLight.position.set(30,16,-35);scene.add(fillLight);
const mat=(color,roughness=.7)=>new T.MeshStandardMaterial({color,roughness});
const white=mat('#ffffff'),blue=mat('#0043bc'),pale=mat('#30372f'),gray=mat('#8d8868');
function mesh(geo,m,parent=scene){const o=new T.Mesh(geo,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
// O percurso muda de direção livremente no plano e tem desníveis suaves.
function mapPoint(x,y,z){return V(18+(x-18)*CONFIG.percurso.escalaHorizontal,y,6+(z-6)*CONFIG.percurso.escalaHorizontal)}
const control=[[-43,.1,29],[-30,.2,17],[-13,.5,21],[1,1.1,11],[11,2.8,-6],[7,3.9,-24],[24,3.2,-39],[43,1.7,-31],[54,1.2,-13],[43,.6,5],[28,1.3,21],[35,2.7,39],[56,3.7,47],[77,2,34]].map(p=>mapPoint(...p));
const route=new T.CatmullRomCurve3(control,false,'centripetal');route.arcLengthDivisions=2500;route.updateArcLengths();
const total=route.getLength();
function at(u){return route.getPointAt(clamp(u,0,1))}
function tangent(u){return route.getTangentAt(clamp(u,0,1)).normalize()}
function side(u){const t=tangent(u);return V(-t.z,0,t.x).normalize()}
// Continuação exterior fechada: mantém o percurso original, mas elimina as duas pontas.
const extensionControl=[control.at(-2),control.at(-1),control.at(-1).clone().addScaledVector(tangent(1),35*CONFIG.percurso.escalaHorizontal),mapPoint(155,1,-4),mapPoint(200,.6,-70),mapPoint(155,.9,-150),mapPoint(50,1.3,-180),mapPoint(-55,.7,-165),mapPoint(-165,1.3,-115),mapPoint(-230,.8,-20),mapPoint(-175,.6,30),control[0].clone().addScaledVector(tangent(0),-35*CONFIG.percurso.escalaHorizontal),control[0],control[1]];
const extension=new T.CatmullRomCurve3(extensionControl,false,'centripetal');
const extensionAt=u=>extension.getPoint(lerp(1/(extensionControl.length-1),(extensionControl.length-2)/(extensionControl.length-1),u));
const groundRoute=[...Array.from({length:321},(_,i)=>at(i/320)),...Array.from({length:1000},(_,i)=>extensionAt((i+1)/1000))];
const groundCells=new Map(),cellSize=18;
for(let i=1;i<groundRoute.length;i++){const a=groundRoute[i-1],b=groundRoute[i];for(let x=Math.floor((Math.min(a.x,b.x)-26)/cellSize);x<=Math.floor((Math.max(a.x,b.x)+26)/cellSize);x++)for(let z=Math.floor((Math.min(a.z,b.z)-26)/cellSize);z<=Math.floor((Math.max(a.z,b.z)+26)/cellSize);z++){const key=x+','+z;if(!groundCells.has(key))groundCells.set(key,[]);groundCells.get(key).push(i)}}
function groundInfo(x,z){let best=1e10,h=0;for(const i of groundCells.get(Math.floor(x/cellSize)+','+Math.floor(z/cellSize))||[]){const a=groundRoute[i-1],b=groundRoute[i],dx=b.x-a.x,dz=b.z-a.z,t=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1),d=(x-a.x-dx*t)**2+(z-a.z-dz*t)**2;if(d<best){best=d;h=lerp(a.y,b.y,t)}}return{distance:Math.sqrt(best),road:h}}
const markerCenters=STOP_PARAMS.map(u=>at(u).addScaledVector(side(u),7.5));
function baseGroundHeight(x,z){const n=groundInfo(x,z),field=.25+Math.sin(x*.035)*.5+Math.cos(z*.042)*.4;return lerp(n.road-.16,field,smooth((n.distance-3.6)/19))}
function groundHeight(x,z){let h=baseGroundHeight(x,z);for(const p of markerCenters){const r=Math.hypot(x-p.x,z-p.z);if(r<4)h=lerp(baseGroundHeight(p.x,p.z),h,smooth(r-3))}return h}
const TERRAIN_WIDTH=1400,TERRAIN_DEPTH=1100,TERRAIN_SEGMENTS_X=500,TERRAIN_SEGMENTS_Z=400;
const landGeometry=new T.PlaneGeometry(TERRAIN_WIDTH,TERRAIN_DEPTH,TERRAIN_SEGMENTS_X,TERRAIN_SEGMENTS_Z);landGeometry.rotateX(-Math.PI/2);
const landPositions=landGeometry.getAttribute('position'),landColors=[];
for(let i=0;i<landPositions.count;i++){const x=landPositions.getX(i),z=landPositions.getZ(i);landPositions.setY(i,groundHeight(x,z));const tone=.5+.23*Math.sin(x*.15+Math.cos(z*.10))+.17*Math.cos(z*.18-x*.07)+.10*Math.sin(x*.63+z*.46),c=new T.Color('#527c36').lerp(new T.Color('#93ac4a'),clamp(tone,0,1));landColors.push(c.r,c.g,c.b)}
// Blocos compartilham exatamente as bordas. A GPU só recebe o terreno enquadrado,
// permitindo ampliar o cenário sem desenhar toda a superfície em cada viagem.
const floor=new T.Group();floor.name='Terreno_continuo_sob_a_estrada';scene.add(floor);
const terrainMaterial=new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true});
for(let tz=0;tz<TERRAIN_SEGMENTS_Z;tz+=100)for(let tx=0;tx<TERRAIN_SEGMENTS_X;tx+=100){
 const positions=[],colors=[],indices=[],nx=Math.min(100,TERRAIN_SEGMENTS_X-tx),nz=Math.min(100,TERRAIN_SEGMENTS_Z-tz);
 for(let z=0;z<=nz;z++)for(let x=0;x<=nx;x++){const i=(tz+z)*(TERRAIN_SEGMENTS_X+1)+tx+x;positions.push(landPositions.getX(i),landPositions.getY(i),landPositions.getZ(i));colors.push(...landColors.slice(i*3,i*3+3))}
 for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const a=z*(nx+1)+x,b=a+nx+1,c=b+1,d=a+1;indices.push(a,b,d,b,c,d)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();const tile=mesh(g,terrainMaterial,floor);tile.castShadow=false;
}
const roadPoints=[...Array.from({length:1201},(_,i)=>at(i/1200)),...Array.from({length:3600},(_,i)=>extensionAt((i+1)/3600))];
const roadDistances=[0];for(let i=1;i<roadPoints.length;i++)roadDistances.push(roadDistances[i-1]+roadPoints[i].distanceTo(roadPoints[i-1]));
function ribbon(width,height,material){
 const p=[],ix=[],uv=[],n=roadPoints.length-1;
 for(let i=0;i<=n;i++){const c=roadPoints[i],d=roadPoints[i===n?1:i+1].clone().sub(roadPoints[i===0?n-1:i-1]),s=V(-d.z,0,d.x).normalize();for(const sign of [-1,1]){p.push(...c.clone().addScaledVector(s,width*sign).add(V(0,height,0)).toArray());uv.push(width*sign,roadDistances[i])}}
 for(let i=0;i<n;i++){let a=i*2;ix.push(a,a+1,a+2,a+1,a+3,a+2)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();const m=mesh(g,material);m.castShadow=false;return m;
}
// Sinalização na mesma superfície do asfalto: sem camadas coplanares na vista distante.
pale.polygonOffset=true;pale.polygonOffsetFactor=-1;pale.polygonOffsetUnits=-2;
pale.onBeforeCompile=shader=>{shader.uniforms.roadYellow={value:new T.Color('#e8cd60')};shader.uniforms.roadEdge={value:new T.Color('#c8c8a7')};shader.vertexShader='varying vec2 roadUv;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nroadUv=uv;');shader.fragmentShader='varying vec2 roadUv; uniform vec3 roadYellow; uniform vec3 roadEdge;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float aa=max(fwidth(roadUv.x),0.009);float center=1.0-smoothstep(0.055-aa,0.055+aa,abs(roadUv.x));
float wave=sin(roadUv.y*1.7952);float dash=smoothstep(0.25-fwidth(wave),0.25+fwidth(wave),wave);
float edge=1.0-smoothstep(0.023-aa,0.023+aa,abs(abs(roadUv.x)-2.91));
float grain=sin(roadUv.y*11.0+roadUv.x*21.0)*0.015;
diffuseColor.rgb*=1.0+grain;diffuseColor.rgb=mix(diffuseColor.rgb,roadYellow,center*dash);diffuseColor.rgb=mix(diffuseColor.rgb,roadEdge,edge);`)};
ribbon(3.48,-.055,gray);const asphalt=ribbon(3.06,0,pale);asphalt.name='Asfalto_continuo_sinalizacao_integrada';
// Paisagem discreta: volumes claros preservam o fundo branco e a leitura da estrada.
const stops=STOP_PARAMS;
const crashOrigin=at(stops[LAST_STOP]),exitSide=side(stops[LAST_STOP]),exitTangent=tangent(stops[LAST_STOP]);
const treePosition=crashOrigin.clone().addScaledVector(exitTangent,14).addScaledVector(exitSide,9);
treePosition.y=groundHeight(treePosition.x,treePosition.z);
const crashDirection=treePosition.clone().sub(crashOrigin).setY(0).normalize();
const hitPosition=treePosition.clone().addScaledVector(crashDirection,-2.16);hitPosition.y=groundHeight(hitPosition.x,hitPosition.z)-.06;
const wreckPosition=treePosition.clone().addScaledVector(crashDirection,-1.38);wreckPosition.y=groundHeight(wreckPosition.x,wreckPosition.z)-.06;
const escapeCurve=new T.CubicBezierCurve3(crashOrigin.clone().add(V(0,-.06,0)),crashOrigin.clone().addScaledVector(exitTangent,3.6),hitPosition.clone().addScaledVector(crashDirection,-3),hitPosition.clone());
const vegetation=criarBibliotecaFlorestal(T);
const tree=vegetation.tree(12);tree.name='Arvore_do_impacto_tronco_livre';tree.position.copy(treePosition);scene.add(tree);
const escapeLength=escapeCurve.getLength();
let seed=42;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
for(let i=0;i<70;i++){
 const u=.02+rand()*.96,p=at(u).addScaledVector(side(u),(rand()>.5?1:-1)*(5.5+rand()*7));
 if(stops.some(v=>p.distanceTo(at(v).addScaledVector(side(v),7.5))<6))continue;
 if(p.distanceTo(treePosition)<7||p.distanceTo(escapeCurve.getPoint(.65))<4)continue;
 const h=.3+rand()*1.4;const o=mesh(new T.IcosahedronGeometry(1,0),mat(i%2?'#828472':'#a8a38a'));
 o.position.copy(p);o.position.y=groundHeight(p.x,p.z)+h*.76;o.scale.set(1.1+rand()*1.3,h,1.1+rand()*1.3);o.rotation.y=rand()*6;
}
const labels=[];
// Floresta ampla com instâncias compartilhadas: continuidade visual sem milhares de objetos.
const forestPoints=[],forestBins=new Map();
for(let gx=-110;gx<=86;gx++)for(let gz=-86;gz<=86;gz++){
 if((Math.abs(gx)>42||Math.abs(gz)>42)&&rand()>.60)continue;
 const x=18+gx*6.3+(rand()-.5)*6.3,z=6+gz*6.3+(rand()-.5)*6.3;
 if(x< -682||x>532||Math.abs(z)>532)continue;
 const grove=.65+.18*Math.sin(x*.035+Math.cos(z*.026)*1.7)+.14*Math.cos(z*.043-x*.012);
 if(rand()>grove||groundInfo(x,z).distance<5.1)continue;
 const bx=Math.floor(x/4),bz=Math.floor(z/4);let crowded=false;
 for(let a=bx-1;a<=bx+1;a++)for(let b=bz-1;b<=bz+1;b++)for(const point of forestBins.get(a+','+b)||[])if(Math.hypot(point.x-x,point.z-z)<3.1)crowded=true;
 if(crowded)continue;
 const p=V(x,groundHeight(x,z),z);
 if(Math.hypot(x-treePosition.x,z-treePosition.z)<6.5)continue;
 let blocked=false;for(let j=0;j<=16;j++){const c=escapeCurve.getPoint(j/16);if(Math.hypot(x-c.x,z-c.z)<3.2)blocked=true}if(blocked)continue;
 if(markerCenters.some(c=>Math.hypot(c.x-x,c.z-z)<6.2))continue;
 const choice=rand(),variant=choice<.69?Math.floor(rand()*12):choice<.96?12+Math.floor(rand()*6):18+Math.floor(rand()*2);
 const entry={p,scale:.68+rand()*.65,angle:rand()*Math.PI*2,variant,low:Math.hypot(x-18,z-6)>115};forestPoints.push(entry);
 const key=bx+','+bz;if(!forestBins.has(key))forestBins.set(key,[]);forestBins.get(key).push(p);
}
const forest=new T.Group();forest.name='Floresta_continua';scene.add(forest);
const dummy=new T.Object3D();
const forestLodGroups=[];
for(const t of forestPoints){dummy.position.copy(t.p);dummy.rotation.set(0,t.angle,0);dummy.scale.set(t.scale*(.9+.1*Math.sin(t.angle)),t.scale,t.scale);dummy.updateMatrix();t.matrix=dummy.matrix.clone()}
for(let k=0;k<vegetation.variants.length;k++){
 const points=forestPoints.filter(p=>p.variant===k);if(!points.length)continue;
 const group={points,high:[],low:[]};forestLodGroups.push(group);
 for(const low of [false,true]){const variant=low?vegetation.variants[k].low:vegetation.variants[k];for(const [geometry,material]of [[variant.wood,vegetation.bark],[variant.leaves,vegetation.leaves]])if(geometry){const inst=new T.InstancedMesh(geometry,material,points.length);inst.castShadow=true;inst.receiveShadow=true;inst.frustumCulled=false;inst.instanceMatrix.setUsage(T.DynamicDrawUsage);if(material===vegetation.leaves)inst.customDepthMaterial=vegetation.depth;forest.add(inst);group[low?'low':'high'].push(inst)}}
}
let lodFocus=V(1e6,0,1e6),lodAerial=false,lodCameraPosition=V(1e6,0,1e6),lodCameraQuaternion=new T.Quaternion(),lodAspect=0,visibleTrees=0;
const forestCullCamera=new T.PerspectiveCamera(64,camera.aspect*1.1,.8,1100),forestFrustum=new T.Frustum(),forestSphere=new T.Sphere();
function updateForestLOD(focus,aerial=false){
 if(lodFocus.distanceToSquared(focus)<36&&aerial===lodAerial&&lodCameraPosition.distanceToSquared(camera.position)<16&&lodCameraQuaternion.angleTo(camera.quaternion)<.04&&lodAspect===camera.aspect)return;
 lodFocus.copy(focus);lodAerial=aerial;lodCameraPosition.copy(camera.position);lodCameraQuaternion.copy(camera.quaternion);lodAspect=camera.aspect;
 forestCullCamera.position.copy(camera.position);forestCullCamera.quaternion.copy(camera.quaternion);forestCullCamera.aspect=camera.aspect*1.1;forestCullCamera.updateProjectionMatrix();forestCullCamera.updateMatrixWorld();forestFrustum.setFromProjectionMatrix(new T.Matrix4().multiplyMatrices(forestCullCamera.projectionMatrix,forestCullCamera.matrixWorldInverse));visibleTrees=0;
 function finish(meshes,count){for(const m of meshes){m.count=count;if(count){m.instanceMatrix.clearUpdateRanges();m.instanceMatrix.addUpdateRange(0,count*16);m.instanceMatrix.needsUpdate=true}}}
 for(const group of forestLodGroups){let near=0,far=0;for(const t of group.points){if(t.reserved)continue;const h=vegetation.variants[t.variant].height*t.scale;forestSphere.center.copy(t.p).add(V(0,h*.60,0));forestSphere.radius=h*.67;if(!forestFrustum.intersectsSphere(forestSphere))continue;visibleTrees++;const distant=aerial||Math.hypot(t.p.x-focus.x,t.p.z-focus.z)>63;for(const m of group[distant?'low':'high'])m.setMatrixAt(distant?far:near,t.matrix);if(distant)far++;else near++}finish(group.high,near);finish(group.low,far)}
}
updateForestLOD(at(stops[0]));
// Oclusão suave de contato complementa as sombras projetadas, especialmente na vista aérea.
const contactMaterial=new T.MeshBasicMaterial({color:'#172b1c',transparent:true,opacity:.19,depthWrite:false});
contactMaterial.onBeforeCompile=s=>{s.vertexShader='varying vec2 contactUv;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncontactUv=uv;');s.fragmentShader='varying vec2 contactUv;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a*=1.0-smoothstep(0.0,0.5,length(contactUv-0.5));')};
const contacts=new T.InstancedMesh(new T.PlaneGeometry(4.5,4.5),contactMaterial,forestPoints.length);scene.add(contacts);
forestPoints.forEach(({p,scale,angle},i)=>{dummy.position.copy(p).add(V(0,.018,0));dummy.rotation.set(-Math.PI/2,0,angle);dummy.scale.setScalar(scale);dummy.updateMatrix();contacts.setMatrixAt(i,dummy.matrix)});contacts.computeBoundingSphere();
const grassGeo=new T.BufferGeometry();grassGeo.setAttribute('position',new T.Float32BufferAttribute([-.16,0,0,0,.55,0,.07,0,0,0,0,-.14,0,.38,.03,0,0,.12,-.1,0,-.1,.13,.42,.12,.15,0,.1],3));grassGeo.computeVertexNormals();
const grass=new T.InstancedMesh(grassGeo,new T.MeshStandardMaterial({color:'#416729',side:T.DoubleSide,roughness:1}),36000);grass.receiveShadow=true;scene.add(grass);let grassCount=0;
function addGrass(x,z,scale){if(grassCount>=36000||groundInfo(x,z).distance<3.8||markerCenters.some(c=>Math.hypot(c.x-x,c.z-z)<3))return;dummy.position.set(x,groundHeight(x,z),z);dummy.rotation.set(0,rand()*Math.PI*2,0);dummy.scale.setScalar(scale);dummy.updateMatrix();grass.setMatrixAt(grassCount++,dummy.matrix)}
for(let i=0;i<14000;i++)addGrass(-160+rand()*370,-155+rand()*330,.45+rand()*1.3);
for(const t of forestPoints.slice().sort((a,b)=>(a.p.x-18)**2+(a.p.z-6)**2-(b.p.x-18)**2-(b.p.z-6)**2))for(let j=0;j<5;j++){const a=rand()*Math.PI*2,r=.65+rand()*2.1;addGrass(t.p.x+Math.cos(a)*r,t.p.z+Math.sin(a)*r,.5+rand()*.8)}
grass.count=grassCount;grass.instanceMatrix.needsUpdate=true;grass.computeBoundingSphere();
stops.forEach((u,i)=>{
 const p=at(u),s=side(u),d=tangent(u);
 // Discos fora da faixa: o carro para na própria estrada.
 const base=mesh(new T.CylinderGeometry(2.45,2.55,.18,64),white);base.position.copy(p).addScaledVector(s,7.5);base.position.y=groundHeight(base.position.x,base.position.z)+.08;
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
// A marca lateral já é geometria vetorial: reaproveitada sobre o capô, sem textura externa.
const sideLogo=car.getObjectByName('Logotipo_vetorial_lateral_1');
if(sideLogo){const hood=sideLogo.clone(true);hood.name='Logotipo_MAHLE_no_capo';hood.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(V(0,0,-1),V(.9935,-.1135,0).normalize(),V(-.1135,-.9935,0).normalize()));hood.scale.set(.010,.018,.010);hood.position.set(.82,1.087,.565);car.add(hood)}
const damaged=criarCarroAmassado(T,car);scene.add(damaged.root);damaged.root.visible=false;
// Sombras da floresta são estáveis e reutilizadas. O carro usa contato dinâmico próprio.
car.traverse(o=>{if(o.isMesh)o.castShadow=false});damaged.root.traverse(o=>{if(o.isMesh)o.castShadow=false});
const carContact=new T.Group(),carShadowMaterial=new T.MeshBasicMaterial({color:'#102015',transparent:true,opacity:.34,depthWrite:false});
carShadowMaterial.onBeforeCompile=s=>{s.vertexShader='varying vec2 shadowUv;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nshadowUv=uv;');s.fragmentShader='varying vec2 shadowUv;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a*=(1.0-smoothstep(0.30,0.50,abs(shadowUv.x-0.5)))*(1.0-smoothstep(0.24,0.50,abs(shadowUv.y-0.5)));')};
const carShadow=new T.Mesh(new T.PlaneGeometry(3.8,1.9),carShadowMaterial);carShadow.rotation.x=-Math.PI/2;carContact.add(carShadow);scene.add(carContact);
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
const skidCapacity=1024,skidTracks=[];let skidSamples=0;
for(const s of [-.785,.785]){const g=new T.BufferGeometry(),a=new Float32Array(skidCapacity*6),indices=[];for(let i=0;i<skidCapacity-1;i++){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2)}g.setAttribute('position',new T.BufferAttribute(a,3).setUsage(T.DynamicDrawUsage));g.setIndex(indices);g.setDrawRange(0,0);const m=new T.MeshBasicMaterial({color:'#20281c',transparent:true,opacity:.65,side:T.DoubleSide,depthWrite:false});const mark=mesh(g,m,skid);mark.castShadow=false;mark.frustumCulled=false;skidTracks.push({g,a,s})}
function appendSkids(){if(skidSamples>=skidCapacity)return;for(const track of skidTracks){for(let edge=0;edge<2;edge++){const p=V(-1.04,0,track.s+(edge?1:-1)*.06).applyQuaternion(car.quaternion).add(car.position),info=groundInfo(p.x,p.z);p.y=(info.distance<3.12?info.road:groundHeight(p.x,p.z))+.02;const k=skidSamples*6+edge*3;track.a.set(p.toArray(),k)}track.g.getAttribute('position').needsUpdate=true;track.g.setDrawRange(0,Math.max(0,skidSamples)*6)}skidSamples++;skid.visible=skidSamples>1}
const localCarBox=new T.Box3().setFromObject(car);
const carCorners=[];for(const x of [localCarBox.min.x,localCarBox.max.x])for(const y of [localCarBox.min.y,localCarBox.max.y])for(const z of [localCarBox.min.z,localCarBox.max.z])carCorners.push(V(x,y,z));
const wheels=[],steers=[];car.traverse(o=>{if(o.name.startsWith('Roda_giratoria'))wheels.push(o);if(o.name.startsWith('Manga_de_eixo'))steers.push(o)});
// O eixo longitudinal do modelo é +X; a base local acompanha a inclinação.
function orient(u){const x=tangent(u),z=new T.Vector3().crossVectors(x,V(0,1,0)).normalize(),y=new T.Vector3().crossVectors(z,x).normalize();return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z))}
let carU=stops[0],index=0,motion=null,lastTime=null,cameraTween=null,fade=null,crash=null,crashed=false,fireTime=0,impacts=0,crashPose=null;
let mapDirty=true,mapClock=0,lastMapDraw=-10,shadowAge=10,shadowAnchor=V(1e6,0,1e6),shadowAerial=null,shadowRenders=0,sceneRenders=0;
let look=V(),boom=V(),carTurn=orient(carU),wheelAngle=0;
const contentSides=CONFIG.paradas.map(p=>p.lado).concat('left');
const probeCamera=new T.PerspectiveCamera(42,camera.aspect,.1,1200);
const roadProbes=[];for(let j=0;j<=550;j++){const u=j/550;for(const s of [-3.4,-1.7,0,1.7,3.4])roadProbes.push(at(u).addScaledVector(side(u),s))}
let poses=[],layoutAudit=[];
let clearedTrees=0;
const visibility=criarVisibilidadeMapa(T,{vegetation,forestPoints,carCorners,labels,stops,orient,crashQuaternion:()=>directionQuaternion(crashDirection),tree,wreckPosition});
// O painel agora é central. Mantemos a composição cinematográfica já aprovada do mapa.
function contentRect(i){const p=CONFIG.composicaoMapa,x=contentSides[i]==='left'?p.margemLateral:1-p.margemLateral-p.largura;return{x0:x*2-1,x1:(x+p.largura)*2-1,y0:1-2*(p.topo+p.altura),y1:1-2*p.topo}}
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
function screenAt(point,pose){probeCamera.position.copy(pose.look).add(pose.boom);probeCamera.lookAt(pose.look);probeCamera.updateMatrixWorld();return point.clone().project(probeCamera)}
function framePoint(point,screenX,screenY){
 const axis=boom.clone().normalize(),right=V(boom.z,0,-boom.x).normalize(),up=V().crossVectors(axis,right),relative=point.clone().sub(look);
 const halfHeight=(boom.length()-relative.dot(axis))*Math.tan(T.MathUtils.degToRad(21));
 look.addScaledVector(right,relative.dot(right)-screenX*halfHeight*camera.aspect).addScaledVector(up,relative.dot(up)-screenY*halfHeight);
}
function fitPose(p,i,includeTree=false){
 const sign=contentSides[i]==='left'?1:-1,nearby=visibility.nearby(p),candidates=[];let best=null,bestCost=Infinity;
 for(const h of (includeTree?[8,11,14]:i===LAST_STOP?[16,20,24]:[27,31,35]))for(const distance of [26,30])for(let k=0;k<48;k++)for(const framing of (includeTree?[.20,.30,.40]:[.50,.60])){
  const yaw=k*Math.PI*2/48,offset=V(Math.sin(yaw)*distance,h,Math.cos(yaw)*distance),pose=compose(p,offset,sign*framing),eye=pose.look.clone().add(offset);
  if(includeTree&&eye.clone().sub(wreckPosition).setY(0).normalize().dot(crashDirection)>-.20)continue;
  if(i===LAST_STOP&&!includeTree&&eye.clone().sub(p).setY(0).normalize().dot(crashDirection)>-.20)continue;
  const hits=roadIntrusions(pose,i),preference=Math.abs(Math.atan2(Math.sin(yaw-i*.9),Math.cos(yaw-i*.9)));
  candidates.push({...pose,hits,yaw,screenX:sign*framing,point:p,roughCost:hits*.05+preference+(h-27)*.025+(distance-26)*.01});
 }
 candidates.sort((a,b)=>a.roughCost-b.roughCost);
 for(let k=0;k<candidates.length;k++){
  if(k>=24&&best?.audit.fixed===0&&best.audit.inside)break;
  const pose=candidates[k];probeCamera.position.copy(pose.look).add(pose.boom);probeCamera.lookAt(pose.look);probeCamera.updateMatrixWorld();
  const audit=visibility.audit({...pose,camera:probeCamera},i,{crash:includeTree,nearby}),cost=(audit.inside?0:1e8)+audit.fixed*1e7+audit.blockers.length*1000+pose.roughCost;
  if(cost<bestCost){bestCost=cost;best={...pose,audit}}
 }
 for(const t of best.audit.blockers)if(!t.reserved){t.reserved=true;clearedTrees++;const j=forestPoints.indexOf(t);contacts.setMatrixAt(j,new T.Matrix4().makeScale(0,0,0))}
 contacts.instanceMatrix.needsUpdate=true;lodFocus.set(1e6,0,1e6);renderer.shadowMap.needsUpdate=true;return best;
}
function auditPose(pose,i,crash=false){probeCamera.position.copy(pose.look).add(pose.boom);probeCamera.lookAt(pose.look);probeCamera.updateMatrixWorld();const a=visibility.audit({...pose,camera:probeCamera},i,{crash,nearby:visibility.nearby(pose.point)});return{carro:a.car,numero:a.numero,arvoreImpacto:a.fixed,enquadrado:a.inside}}
function verificarVisibilidade(){return{paradas:poses.slice(0,STOP_COUNT).map((p,i)=>auditPose(p,i)),acidente:auditPose(crashPose,LAST_STOP,true),arvoresSemFolhas:vegetation.variants.filter(v=>!v.leaves||!v.low.leaves).length,arvoresRetiradasDosCorredores:clearedTrees}}
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
 crashPose=fitPose(wreckPosition.clone().add(V(0,.06,0)),LAST_STOP,true);
 const aerialPoints=roadProbes.concat(stops.flatMap(u=>[-11,11].map(s=>at(u).addScaledVector(side(u),s))),[treePosition,treePosition.clone().add(V(0,7,0))]);
 let aerial=null,aerialCost=Infinity;
 for(let scale=.95;scale<=3.6;scale+=.05)for(let screenX=.40;screenX<=.60;screenX+=.025){
  const p=compose(V(18,0,6),V(-9,178,140).multiplyScalar(scale),screenX);
  probeCamera.position.copy(p.look).add(p.boom);probeCamera.lookAt(p.look);probeCamera.updateMatrixWorld();
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;const v=V();
  for(const point of aerialPoints){v.copy(point).project(probeCamera);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);y0=Math.min(y0,v.y);y1=Math.max(y1,v.y)}
  const cost=scale+Math.abs((x0+x1)/2-.49)*.1;
  if(x0>.17&&x1<.91&&y0>-.60&&y1<.70&&cost<aerialCost){aerial=p;aerialCost=cost}
 }
 poses.push(aerial||compose(V(18,0,6),V(-9,640,504),.48));
 layoutAudit=poses.map((p,i)=>({side:contentSides[i],roadIntrusions:roadIntrusions(p,i,0),yaw:p.yaw}));
}
makePoses();
function stopPose(i){return poses[i]}
function presentationPose(i){return i===LAST_STOP&&crashed?crashPose:stopPose(i)}
function place(u){car.position.copy(at(u)).add(V(0,-.06,0));car.quaternion.copy(carTurn)}
function directionQuaternion(d){const x=d.clone().normalize(),z=V().crossVectors(x,V(0,1,0)).normalize(),y=V().crossVectors(z,x).normalize();return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z))}
function syncDamaged(){damaged.root.position.copy(car.position);damaged.root.quaternion.copy(car.quaternion)}
function resetCrash(){crash=null;crashed=false;fireTime=0;impacts=0;skidSamples=0;skidTracks.forEach(t=>t.g.setDrawRange(0,0));damaged.aplicar(0);damaged.root.visible=false;car.visible=true;fire.visible=false;skid.visible=false}
function finishWreck(){car.position.copy(wreckPosition);car.quaternion.copy(directionQuaternion(crashDirection));syncDamaged();damaged.aplicar(1);damaged.root.visible=true;car.visible=false;fire.visible=true;skid.visible=true;crashed=true;fireTime=Math.max(fireTime,1)}
function beginCrash(rolling=false){const speed=rolling?(stops[LAST_STOP]-stops[LAST_STOP-1])*total/TRAVEL_DURATION:escapeLength/.85;crash={time:0,impacted:false,rolling,speed,contactTime:escapeLength/speed+(rolling?0:.08),travelled:0,initialLook:look.clone(),initialBoom:boom.clone()};appendSkids();ui()}
function setContent(){
 const end=index===FINAL_SLIDE,first=index===0,modelSlide=index<4,busy=!!motion||!!cameraTween||!!crash,s=first?CONFIG.primeiroSlide:CONFIG.slidesSensoriais[index+1];
 $('conteudo').className='content'+(contentSides[index]==='right'?' right':'')+(end?' conclusion':'')+(busy?' absent':'')+(modelSlide?' model-slide':'')+(modelSlide&&!first?' sensory-slide':'');
 $('titulo-parada').textContent=end?'CONCLUSÃO':`SEVERIDADE ${index+1} · EFEITO NO SISTEMA`;
 $('titulo').textContent=modelSlide?s.titulo:end?'Uma visão do caminho completo.':index===LAST_STOP&&crashed?'Perda de controle. Impacto frontal.':`Severidade ${index+1}`;
 $('descricao').textContent=modelSlide?s.funcao:end?'Aqui entra a conclusão da apresentação, com a jornada inteira ao lado.':index===LAST_STOP&&crashed?'Demonstração visual da batida. Selecione 10 novamente para repetir a sequência.':'Espaço reservado para o conteúdo desta severidade.';
 $('primeiro-conteudo').classList.toggle('hidden',!modelSlide);$('ferramentas-modelo').classList.toggle('hidden',!modelSlide);
 if(modelSlide){
  $('sistema-contexto').textContent=first?'NO SISTEMA · S1':`EFEITO NO SISTEMA · S${index+1}`;$('exemplos-contexto').textContent=first?'RESSALVA PARA A MAHLE':'EXEMPLOS · INTENSIDADE PERCEBIDA';
  $('sistema-titulo').textContent=s.sistemaTitulo;$('sistema-texto').textContent=s.sistemaTexto;
  $('mahle-titulo').textContent=first?s.mahleTitulo:s.exemplosTitulo;$('mahle-texto').textContent=first?s.mahleTexto:s.exemplosTexto;$('mahle-destaque').textContent=first?s.mahleDestaque:s.destaque;
  $('modelo-caption').textContent=first?'Três campos sem gravação · áreas destacadas no injetado':s.caption;
  (first?['Data de injeção','Número do componente','Número de cavidade']:s.legendas).forEach((label,i)=>$('legenda-'+i).textContent=label);
  manifoldView.mostrarSlide(index);requestAnimationFrame(()=>manifoldView.resize());
 }
}
function ensureSelectedVisible(){
 const list=$('numeros'),item=$('etapa-'+index),left=item.offsetLeft-list.offsetLeft;
 if(left<list.scrollLeft)list.scrollTo({left,behavior:'smooth'});
 else if(left+item.offsetWidth>list.scrollLeft+list.clientWidth)list.scrollTo({left:left+item.offsetWidth-list.clientWidth,behavior:'smooth'});
}
function ui(){
 mapDirty=true;
 const busy=!!motion||!!cameraTween||!!fade||!!crash;
 $('anterior').disabled=busy||index===0;$('proximo').disabled=busy||index===FINAL_SLIDE;
 $('proximo').textContent=index===LAST_STOP?'Conclusão →':'Avançar →';
 $('estado').innerHTML=fade?'Trocando slide <span>Transição suave</span>':crash?`Severidade 10 <span>${crash.impacted?'Impacto frontal':'Perda de controle'}</span>`:cameraTween?'Novo enquadramento <span>Câmera em movimento</span>':motion?`Percurso ${String(index+1).padStart(2,'0')} → ${String(motion.to+1).padStart(2,'0')} <span>Em movimento</span>`:index===FINAL_SLIDE?'Conclusão <span>Jornada completa</span>':`Severidade ${index+1} <span>${crashed?'Após o impacto':'Aguardando avanço'}</span>`;
 for(let i=0;i<=FINAL_SLIDE;i++){$('etapa-'+i).className='step'+(i===index?' current':i<index?' done':'');$('etapa-'+i).setAttribute('aria-current',i===index?'step':'false')}
 labels.forEach((label,i)=>{label.ring.material=i===index?blue:gray;label.label.rotation.z=i===LAST_STOP&&crashed?crashPose.yaw:poses[i].yaw});
 setContent();ensureSelectedVisible();
}
function setInstant(to){
 resetCrash();
 index=to;carU=stops[Math.min(to,LAST_STOP)];carTurn.copy(orient(carU));place(carU);steers.forEach(s=>s.rotation.y=0);
 if(to===FINAL_SLIDE)finishWreck();
 const pose=presentationPose(to);look.copy(pose.look);boom.copy(pose.boom);
}
function selectSlide(to){
 if(fade||to<0||to>FINAL_SLIDE||(index===to&&to!==LAST_STOP&&!motion&&!cameraTween&&!crash))return;
 // Um salto cancela o percurso atual; a troca de mundo acontece apenas no branco total.
 motion=null;cameraTween=null;crash=null;fade={to,time:0,switched:false};ui();
}
function advance(direction){
 if(motion||cameraTween||fade||crash)return;
 const to=index+direction;if(to<0||to>FINAL_SLIDE)return;
 if(index===LAST_STOP&&crashed&&direction<0){selectSlide(to);return}
 if(to===FINAL_SLIDE||index===FINAL_SLIDE){
  const pose=presentationPose(to);cameraTween={to,fromLook:look.clone(),fromBoom:boom.clone(),toLook:pose.look,toBoom:pose.boom,fromScreen:car.position.clone().project(camera),toScreen:screenAt(car.position,pose),time:0,duration:TRAVEL_DURATION};ui();return;
 }
 const from=carU,end=stops[to];
 // Um único relógio sincroniza carro, órbita e composição: todos chegam juntos.
 motion={from,end,to,direction,time:0,duration:TRAVEL_DURATION,initialLook:look.clone(),initialBoom:boom.clone(),startFrame:screenAt(at(from),{look,boom}).x,endPose:stopPose(to)};ui();
}
function fullscreen(){if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.().catch(()=>{})}
$('proximo').addEventListener('click',()=>advance(1));$('anterior').addEventListener('click',()=>advance(-1));
for(let i=0;i<=FINAL_SLIDE;i++)$('etapa-'+i).addEventListener('click',()=>selectSlide(i));
function scrollList(direction){$('numeros').scrollBy({left:direction*($('etapa-0').offsetWidth+8),behavior:'smooth'})}
$('rolar-anterior').addEventListener('click',()=>scrollList(-1));$('rolar-proximo').addEventListener('click',()=>scrollList(1));
$('numeros').addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();$('numeros').scrollLeft+=e.deltaY}},{passive:false});
addEventListener('keydown',e=>{
 if(e.repeat||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.target.closest?.('.model-tools')&&[' ','Enter'].includes(e.key))return;
 // Espaço e Enter conservam a semântica dos botões quando a lista tem foco.
 if(e.target.closest?.('.slide-nav')&&[' ','Enter','ArrowLeft','ArrowRight'].includes(e.key)){
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=clamp(Number(e.target.id.replace('etapa-',''))+(e.key==='ArrowRight'?1:-1),0,FINAL_SLIDE);$('etapa-'+next)?.focus()}return;
 }
 const key=e.key.toLowerCase();if([' ','arrowright','pagedown','arrowleft','pageup','f'].includes(key)){e.preventDefault();if([' ','arrowright','pagedown'].includes(key))advance(1);else if(['arrowleft','pageup'].includes(key))advance(-1);else fullscreen()}
});
let resizeTimer;
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{makePoses();if(!motion&&!cameraTween&&!fade&&!crash){const p=presentationPose(index);look.copy(p.look);boom.copy(p.boom)}else if(motion)motion.endPose=stopPose(motion.to);else if(cameraTween){const p=presentationPose(cameraTween.to);cameraTween.toLook=p.look;cameraTween.toBoom=p.boom}},150)});
const first=stopPose(0);look.copy(first.look);boom.copy(first.boom);place(carU);
const manifoldView=criarVisorColetor(T,{visivel:()=>index<4});
function update(dt){
 mapClock+=dt;shadowAge+=dt;
 vegetation.wind.value+=dt;
 if(fade){
  fade.time+=dt;const out=.27,hold=.08,into=.34;
  $('fade').style.opacity=fade.time<out?smooth(fade.time/out):fade.time<out+hold?1:1-smooth((fade.time-out-hold)/into);
  if(!fade.switched&&fade.time>=out){fade.switched=true;setInstant(fade.to);ui()}
  if(fade.time>=out+hold+into){fade=null;$('fade').style.opacity=0;if(index===LAST_STOP)beginCrash();else ui()}
 }
 if(cameraTween){const t=cameraTween;t.time+=dt;const u=ease(clamp(t.time/t.duration,0,1));look.lerpVectors(t.fromLook,t.toLook,u);boom.lerpVectors(t.fromBoom,t.toBoom,u);framePoint(car.position,lerp(t.fromScreen.x,t.toScreen.x,u),lerp(t.fromScreen.y,t.toScreen.y,u));if(u===1){look.copy(t.toLook);boom.copy(t.toBoom);index=t.to;cameraTween=null;ui()}}
 if(motion){
  const m=motion;m.time+=dt;const q=clamp(m.time/m.duration,0,1),u=m.to===LAST_STOP&&m.direction>0?q*q*(2-q):ease(q),v=ease(q),previousU=carU;
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
  const initialScreenX=m.startFrame;
  const yaw0=Math.atan2(m.initialBoom.x,m.initialBoom.z),yaw1=Math.atan2(m.endPose.boom.x,m.endPose.boom.z);
  const yaw=yaw0+Math.atan2(Math.sin(yaw1-yaw0),Math.cos(yaw1-yaw0))*v;
  const radius=lerp(Math.hypot(m.initialBoom.x,m.initialBoom.z),Math.hypot(m.endPose.boom.x,m.endPose.boom.z),v);
  const lift=Math.sin(v*Math.PI)**2*3;
  boom.set(Math.sin(yaw)*radius,lerp(m.initialBoom.y,m.endPose.boom.y,v)+lift,Math.cos(yaw)*radius);
  const endScreenX=m.endPose.screenX;
  // Composição lateral na saída/chegada; liberdade central durante a viagem.
  const framing=lerp(initialScreenX,endScreenX,v)*(1-Math.sin(v*Math.PI)**2*.75);
  look.copy(compose(at(carU),boom,framing).look);
  if(q===1){
   look.copy(m.endPose.look);boom.copy(m.endPose.boom);steers.forEach(s=>s.rotation.y=0);index=m.to;motion=null;if(index===LAST_STOP&&m.direction>0)beginCrash(true);else ui();
  }
 }
 if(crash){
  const c=crash;c.time+=dt;const contactTime=c.contactTime,crushTime=.16,duration=3;
  if(c.time<contactTime){
   const distance=c.rolling?c.time*c.speed:c.time<.16?.5*c.speed*c.time*c.time/.16:c.speed*(c.time-.08);
   const u=clamp(distance/escapeLength,0,1),d=escapeCurve.getTangentAt(u).normalize(),travelled=distance-c.travelled;c.travelled=distance;
   car.position.copy(escapeCurve.getPointAt(u));car.quaternion.copy(directionQuaternion(d));
   const surface=groundInfo(car.position.x,car.position.z);car.position.y=(surface.distance<3.1?surface.road:groundHeight(car.position.x,car.position.z))-.06;
   car.quaternion.multiply(new T.Quaternion().setFromAxisAngle(V(0,1,0),Math.sin(u*6*Math.PI)*Math.sin(u*Math.PI)**2*.25));
   wheelAngle+=travelled/.335;wheels.forEach(w=>w.rotation.z=-wheelAngle);steers.forEach(s=>{if(s.position.x>0)s.rotation.y=Math.sin(u*6*Math.PI)*.35});
   appendSkids();
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
  look.copy(compose(car.position.clone().add(V(0,.06,0)),boom,lerp(stopPose(LAST_STOP).screenX,crashPose.screenX,u)).look);
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
 scene.fog.near=110+aerialDistance*1.3;scene.fog.far=245+aerialDistance*2;
 const aerial=boom.length()>95;
 const lightFocus=aerial?V(18,0,6):look;
 if(shadowAnchor.distanceToSquared(lightFocus)>196||shadowAerial!==aerial||shadowAge>4){
  shadowAerial=aerial;shadowAge=0;shadowAnchor.copy(lightFocus);shadowAnchor.x=Math.round(shadowAnchor.x*8)/8;shadowAnchor.z=Math.round(shadowAnchor.z*8)/8;
  const extent=aerial?230:70;Object.assign(sun.shadow.camera,{left:-extent,right:extent,top:extent,bottom:-extent,far:aerial?560:220});sun.shadow.camera.updateProjectionMatrix();sun.position.copy(shadowAnchor).add(V(-38,58,26));sun.target.position.copy(shadowAnchor);sun.target.updateMatrixWorld();renderer.shadowMap.needsUpdate=true;
 }
 carContact.position.copy(car.position).add(V(0,.075,0));carContact.quaternion.copy(car.quaternion);carShadow.scale.x=damaged.root.visible?.82:1;
 camera.position.copy(look).add(boom);camera.lookAt(look);camera.updateMatrixWorld();
 updateForestLOD(car.position,boom.length()>95);
 const active=!!motion||!!cameraTween||!!crash||!!fade||fire.visible;
 if(active||mapDirty||mapClock-lastMapDraw>.125){if(renderer.shadowMap.needsUpdate)shadowRenders++;renderer.render(scene,camera);sceneRenders++;lastMapDraw=mapClock;mapDirty=false}
}
// Tempo real de apresentação, independente da taxa de quadros. Pausa quando a aba fica oculta.
document.addEventListener('visibilitychange',()=>{lastTime=null});
function tick(time){const dt=lastTime===null?0:Math.max((time-lastTime)/1000,0);lastTime=time;update(dt);requestAnimationFrame(tick)}
function verificarGeometria(){
 let minClearance=Infinity,negative=0;
 function meshHeight(x,z){const nx=TERRAIN_SEGMENTS_X,nz=TERRAIN_SEGMENTS_Z,fx=clamp((x+TERRAIN_WIDTH/2)/(TERRAIN_WIDTH/nx),0,nx-.001),fz=clamp((z+TERRAIN_DEPTH/2)/(TERRAIN_DEPTH/nz),0,nz-.001),i=Math.floor(fx),j=Math.floor(fz),u=fx-i,v=fz-j,a=landPositions.getY(j*(nx+1)+i),b=landPositions.getY((j+1)*(nx+1)+i),c=landPositions.getY((j+1)*(nx+1)+i+1),d=landPositions.getY(j*(nx+1)+i+1);return u+v<=1?a*(1-u-v)+b*v+d*u:b*(1-u)+d*(1-v)+c*(u+v-1)}
 for(let i=1;i<roadPoints.length-1;i++){const p=roadPoints[i],d=roadPoints[i+1].clone().sub(roadPoints[i-1]),s=V(-d.z,0,d.x).normalize();for(const offset of [-3.05,0,3.05]){const q=p.clone().addScaledVector(s,offset),clearance=p.y-meshHeight(q.x,q.z);minClearance=Math.min(minClearance,clearance);if(clearance<=0)negative++}}
 return{minClearance,negative,closureGap:roadPoints[0].distanceTo(roadPoints.at(-1)),roadLength:roadDistances.at(-1),forestCount:forestPoints.length-clearedTrees,comprimentoApresentacao:total,distanciasEntreParadas:stops.slice(1).map((u,i)=>(u-stops[i])*total),duracaoTransicao:TRAVEL_DURATION,escalaHorizontal:CONFIG.percurso.escalaHorizontal,variantStats:vegetation.variants.map(v=>({tipo:v.type,triangles:(v.wood.getAttribute('position').count+(v.leaves?.getAttribute('position').count||0))/3,altura:v.height})),contactTimeRolling:escapeLength/((stops[LAST_STOP]-stops[LAST_STOP-1])*total/TRAVEL_DURATION)};
}
// Diagnóstico local para validação: sem telemetria, sem persistência e sem rede.
window.prototipo={estado:()=>({index,paradas:STOP_COUNT,slides:FINAL_SLIDE+1,carU,sceneRenders,shadowRenders,coletor:manifoldView.estado(),skidSamples,skidDrawCounts:skidTracks.map(t=>t.g.drawRange.count),moving:!!motion||!!cameraTween||!!crash,fading:!!fade,tracking:!!motion,crashTime:crash?.time??null,contactTime:crash?.contactTime??null,crashTravelled:crash?.travelled??null,forestCount:forestPoints.length-clearedTrees,visibleTrees,treeVariants:vegetation.variants.length,roadClosed:roadPoints[0].distanceTo(roadPoints.at(-1))<.001,triangles:renderer.info.render.triangles,crashed,fire:fire.visible,impacts,damagedVisible:damaged.root.visible,tree:treePosition.toArray(),frontDirection:V(1,0,0).applyQuaternion(car.quaternion).toArray(),wreckPosition:wreckPosition.toArray(),crashLayout:roadIntrusions(crashPose,LAST_STOP,0),progress:motion?clamp(motion.time/motion.duration,0,1):cameraTween?clamp(cameraTween.time/cameraTween.duration,0,1):null,conclusion:index===FINAL_SLIDE,car:car.position.toArray(),screen:car.position.clone().project(camera).toArray(),carBounds:carCorners.map(p=>p.clone().applyMatrix4(car.matrixWorld).project(camera).toArray()),camera:camera.position.toArray(),look:look.toArray(),wheels:wheels.length,drawCalls:renderer.info.render.calls,layout:layoutAudit}),advance,selectSlide,verificarGeometria,verificarVisibilidade,exportarColetor:cut=>manifoldView.exportar(cut),exportarArvore:i=>vegetation.tree(i),exportarIntegro:()=>{const c=car.clone(true);c.position.set(0,0,0);c.quaternion.identity();c.visible=true;return c},exportarAmassado:()=>damaged.exportar()};
ui();requestAnimationFrame(tick);
} catch(error){console.error(error);$('erro').classList.remove('hidden');$('erro').textContent='Não foi possível iniciar a cena 3D. Abra este arquivo no Microsoft Edge ou Google Chrome com suporte a WebGL. Detalhe: '+error.message;$('estado').textContent='Cena indisponível';}
})();
