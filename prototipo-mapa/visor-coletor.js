// Inspeção 3D sob demanda. O enquadramento acompanha giro, corte, zoom e tamanho do visor.
function criarVisorColetor(T,{visivel=()=>true}={}){
 const $=id=>document.getElementById(id),V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),clamp=T.MathUtils.clamp;
 const host=$('coletor-viewport'),studio=new T.Scene(),model=criarColetorK24(T),pivot=new T.Group();studio.add(pivot);pivot.add(model.root);
 const box=new T.Box3().setFromObject(model.root),center=box.getCenter(V());model.root.position.sub(center);
 studio.add(new T.HemisphereLight('#ffffff','#afbecb',2.4));const key=new T.DirectionalLight('#fff4e5',3.1);key.position.set(-4,8,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5,far:30});key.shadow.normalBias=.014;studio.add(key);
 const fill=new T.DirectionalLight('#bddbff',1.8);fill.position.set(5,3,-4);studio.add(fill);
 const ground=new T.Mesh(new T.PlaneGeometry(18,18),new T.ShadowMaterial({opacity:.10,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-center.y-.03;ground.receiveShadow=true;studio.add(ground);
 const r=new T.WebGLRenderer({antialias:true,alpha:true});r.setClearColor(0xffffff,0);r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.shadowMap.autoUpdate=false;r.toneMapping=T.ACESFilmicToneMapping;r.outputColorSpace=T.SRGBColorSpace;host.prepend(r.domElement);
 r.domElement.setAttribute('aria-label','Coletor 3D: arraste para girar e use a roda do mouse para aproximar');
 const c=new T.PerspectiveCamera(34,1,.1,120),initialDirection=V(-.42,.30,1.35).normalize(),direction=initialDirection.clone(),target=V();
 let width=0,height=0,cut=true,drag=null,rendered=0,zoom=1.1,focus=false,framing=null;
 // A nuvem usa os vértices reais de todas as peças visíveis. É preparada uma vez
 // por versão (corte/completa) e reutilizada, evitando caixas vazias que diminuiriam o modelo.
 const pointCache=new Map(),projected=V();
 function modelPoints(){
  model.root.updateWorldMatrix(true,true);let cache=pointCache.get(cut);
  if(!cache){const local=[],unique=new Set(),inverse=new T.Matrix4().copy(pivot.matrixWorld).invert();model.root.traverseVisible(o=>{if(!o.geometry)return;const attr=o.geometry.getAttribute('position'),matrix=new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld);for(let i=0;i<attr.count;i++){const p=V().fromBufferAttribute(attr,i).applyMatrix4(matrix),key=p.x+','+p.y+','+p.z;if(!unique.has(key)){unique.add(key);local.push(p)}}});cache={local,world:local.map(()=>V())};pointCache.set(cut,cache)}
  for(let i=0;i<cache.local.length;i++)cache.world[i].copy(cache.local[i]).applyMatrix4(pivot.matrixWorld);return cache.world;
 }
 function position(){
  if(width<1||height<1)return;
  const points=modelPoints(),right=V(direction.z,0,-direction.x).normalize(),up=V().crossVectors(direction,right).normalize();
  const padding=Math.min(26,width*.06,height*.06),limitX=1-padding*2/width,limitY=1-padding*2/height,tan=Math.tan(T.MathUtils.degToRad(c.fov/2)),kx=tan*c.aspect*limitX,ky=tan*limitY;
  let rightPlus=-Infinity,rightMinus=Infinity,upPlus=-Infinity,upMinus=Infinity,minZ=Infinity,maxZ=-Infinity,minGround=Infinity;
  for(const p of points){const x=p.dot(right),y=p.dot(up),z=p.dot(direction);rightPlus=Math.max(rightPlus,x+kx*z);rightMinus=Math.min(rightMinus,x-kx*z);upPlus=Math.max(upPlus,y+ky*z);upMinus=Math.min(upMinus,y-ky*z);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);minGround=Math.min(minGround,p.y)}
  ground.position.y=minGround-.03;
  // Resolve os quatro planos laterais da câmera em perspectiva. O centro também
  // é ajustado: o plenum mais próximo não precisa deixar uma faixa vazia acima da flange.
  const centerZ=(minZ+maxZ)/2,safeZ=Math.max(maxZ+.2,(rightPlus-rightMinus)/(2*kx),(upPlus-upMinus)/(2*ky));
  target.copy(right).multiplyScalar((rightPlus+rightMinus)/2).addScaledVector(up,(upPlus+upMinus)/2).addScaledVector(direction,centerZ);
  // A aproximação máxima conserva a margem de segurança. Ao girar, a distância
  // é recalculada antes de desenhar, sem permitir que o modelo atravesse a borda.
  const distance=(safeZ-centerZ+.02)/(.8*zoom);c.position.copy(target).addScaledVector(direction,distance);c.lookAt(target);c.updateMatrixWorld();
  framing={x0:Infinity,x1:-Infinity,y0:Infinity,y1:-Infinity,z0:Infinity,z1:-Infinity,margemPx:padding,pontos:points.length};
  for(const p of points){const q=projected.copy(p).project(c);framing.x0=Math.min(framing.x0,q.x);framing.x1=Math.max(framing.x1,q.x);framing.y0=Math.min(framing.y0,q.y);framing.y1=Math.max(framing.y1,q.y);framing.z0=Math.min(framing.z0,q.z);framing.z1=Math.max(framing.z1,q.z)}
  $('coletor-zoom').textContent=Math.round(zoom*100)+'%';$('coletor-menos').disabled=zoom<=.6001;$('coletor-mais').disabled=zoom>=1.2499;
 }
 function updatePin(){model.root.updateWorldMatrix(true,true);const p=model.root.localToWorld(model.alvoMarcacoes.clone()),normal=V(0,0,1).transformDirection(model.root.matrixWorld),front=normal.dot(c.position.clone().sub(p))>0,v=p.project(c),pin=$('marcacao-alvo');pin.classList.toggle('hidden',!front||Math.abs(v.x)>.94||Math.abs(v.y)>.92||v.z< -1||v.z>1);pin.style.left=((v.x*.5+.5)*width-13)+'px';pin.style.top=((-v.y*.5+.5)*height-34)+'px'}
 function render(){if(!visivel()||host.clientWidth<1)return;r.shadowMap.needsUpdate=true;r.render(studio,c);rendered++;updatePin()}
 function refresh(){position();render()}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(w<1||h<1)return;if(w!==width||h!==height){width=w;height=h;r.setSize(w,h);c.aspect=w/h;c.updateProjectionMatrix();refresh()}}
 function reset(){pivot.rotation.set(0,0,0);zoom=1.1;focus=false;direction.copy(initialDirection);refresh()}
 function zoomBy(factor){zoom=clamp(zoom*factor,.6,1.25);refresh()}
 function focusMarkings(){pivot.rotation.set(0,0,0);direction.copy(V(-.03,.14,1).normalize());zoom=1.25;focus=true;refresh()}
 r.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};r.domElement.setPointerCapture(e.pointerId);e.stopPropagation()});
 r.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;pivot.rotation.y+=dx*.009;pivot.rotation.x=clamp(pivot.rotation.x+dy*.007,-.60,.60);drag={x:e.clientX,y:e.clientY};refresh()});
 r.domElement.addEventListener('pointerup',()=>{drag=null});r.domElement.addEventListener('pointercancel',()=>{drag=null});r.domElement.addEventListener('wheel',e=>{e.preventDefault();zoomBy(Math.exp(-e.deltaY*.0012))},{passive:false});
 $('coletor-menos').addEventListener('click',()=>zoomBy(1/1.2));$('coletor-mais').addEventListener('click',()=>zoomBy(1.2));$('coletor-marcas').addEventListener('click',focusMarkings);
 $('coletor-corte').addEventListener('click',()=>{cut=!cut;model.corte(cut);$('coletor-corte').setAttribute('aria-pressed',String(!cut));$('coletor-corte').textContent=cut?'Vista completa':'Vista em corte';refresh()});
 $('coletor-restaurar').addEventListener('click',reset);new ResizeObserver(resize).observe(host);
 return{resize,reset,exportar:cut=>model.exportar(cut),estado:()=>({cut,rendered,width,height,zoom,focus,enquadramento:framing,marcacoesAusentes:3,dutos:model.runners.length,rotation:pivot.rotation.toArray().slice(0,3)})};
}
