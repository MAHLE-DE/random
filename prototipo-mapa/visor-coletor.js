// Componente de inspeção 3D reutilizável: desenho sob demanda, giro, zoom e foco em detalhes.
function criarVisorColetor(T,{visivel=()=>true}={}){
 const $=id=>document.getElementById(id),V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),clamp=T.MathUtils.clamp;
 const host=$('coletor-viewport'),studio=new T.Scene(),model=criarColetorK24(T),pivot=new T.Group();studio.add(pivot);pivot.add(model.root);
 const box=new T.Box3().setFromObject(model.root),center=box.getCenter(V());model.root.position.sub(center);
 studio.add(new T.HemisphereLight('#ffffff','#afbecb',2.4));const key=new T.DirectionalLight('#fff4e5',3.1);key.position.set(-4,8,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5,far:30});key.shadow.normalBias=.014;studio.add(key);
 const fill=new T.DirectionalLight('#bddbff',1.8);fill.position.set(5,3,-4);studio.add(fill);
 const ground=new T.Mesh(new T.PlaneGeometry(18,18),new T.ShadowMaterial({opacity:.10}));ground.rotation.x=-Math.PI/2;ground.position.y=-center.y-.03;ground.receiveShadow=true;studio.add(ground);
 const r=new T.WebGLRenderer({antialias:true,alpha:true});r.setClearColor(0xffffff,0);r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.shadowMap.autoUpdate=false;r.toneMapping=T.ACESFilmicToneMapping;r.outputColorSpace=T.SRGBColorSpace;host.prepend(r.domElement);
 r.domElement.setAttribute('aria-label','Coletor 3D: arraste para girar e use a roda do mouse para aproximar');
 const c=new T.PerspectiveCamera(34,1,.1,60);let width=0,height=0,cut=true,drag=null,rendered=0,zoom=1.4,focus=false,baseDistance=8,target=V(),direction=V(-.66,.85,1.1).normalize();
 function position(){c.position.copy(target).addScaledVector(direction,baseDistance/zoom);c.lookAt(target);c.updateMatrixWorld();$('coletor-zoom').textContent=Math.round(zoom*100)+'%'}
 function fit(){const b=new T.Box3().setFromObject(model.root);target.copy(b.getCenter(V()));direction.copy(V(-.66,.85,1.1).normalize());let distance=6;
  for(let n=0;n<80;n++){c.position.copy(target).addScaledVector(direction,distance);c.lookAt(target);c.updateMatrixWorld();let ok=true;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const p=V(x,y,z).project(c);if(Math.abs(p.x)>.90||Math.abs(p.y)>.85)ok=false}if(ok)break;distance*=1.045}baseDistance=distance;position();
 }
 function updatePin(){model.root.updateWorldMatrix(true,true);const p=model.root.localToWorld(model.alvoMarcacoes.clone()),normal=V(0,0,1).transformDirection(model.root.matrixWorld),front=normal.dot(c.position.clone().sub(p))>0,v=p.project(c),pin=$('marcacao-alvo');pin.classList.toggle('hidden',!front||Math.abs(v.x)>.94||Math.abs(v.y)>.92||v.z<0||v.z>1);pin.style.left=((v.x*.5+.5)*width-10)+'px';pin.style.top=((-v.y*.5+.5)*height-26)+'px'}
 function render(){if(!visivel()||host.clientWidth<1)return;r.shadowMap.needsUpdate=true;r.render(studio,c);rendered++;updatePin()}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(w<1||h<1)return;if(w!==width||h!==height){width=w;height=h;r.setSize(w,h);c.aspect=w/h;c.updateProjectionMatrix();if(focus)focusMarkings();else{fit();render()}}}
 function reset(){pivot.rotation.set(0,0,0);zoom=1.4;focus=false;fit();render()}
 function zoomBy(factor){zoom=clamp(zoom*factor,.65,4.5);position();render()}
 function focusMarkings(){pivot.rotation.set(0,0,0);model.root.updateWorldMatrix(true,true);target.copy(model.root.localToWorld(model.alvoMarcacoes.clone()));direction.copy(V(-.03,.14,1).normalize());baseDistance=Math.max(2.8,2.6/(2*Math.tan(T.MathUtils.degToRad(17))*c.aspect));zoom=1;focus=true;position();render()}
 r.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};r.domElement.setPointerCapture(e.pointerId);e.stopPropagation()});
 r.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;pivot.rotation.y+=dx*.009;pivot.rotation.x=clamp(pivot.rotation.x+dy*.007,-.60,.60);drag={x:e.clientX,y:e.clientY};render()});
 r.domElement.addEventListener('pointerup',()=>{drag=null});r.domElement.addEventListener('pointercancel',()=>{drag=null});r.domElement.addEventListener('wheel',e=>{e.preventDefault();zoomBy(Math.exp(-e.deltaY*.0012))},{passive:false});
 $('coletor-menos').addEventListener('click',()=>zoomBy(1/1.2));$('coletor-mais').addEventListener('click',()=>zoomBy(1.2));$('coletor-marcas').addEventListener('click',focusMarkings);
 $('coletor-corte').addEventListener('click',()=>{cut=!cut;model.corte(cut);$('coletor-corte').setAttribute('aria-pressed',String(!cut));$('coletor-corte').textContent=cut?'Vista completa':'Vista em corte';if(!focus)fit();render()});
 $('coletor-restaurar').addEventListener('click',reset);new ResizeObserver(resize).observe(host);
 return{resize,reset,exportar:cut=>model.exportar(cut),estado:()=>({cut,rendered,width,height,zoom,focus,marcacoesAusentes:3,dutos:model.runners.length,rotation:pivot.rotation.toArray().slice(0,3)})};
}
