// Condensação, ingestão e calço hidráulico: sequência didática sem escala física.
function criarCenaAgua(T,model,host,id,stage){
 if(id!=='agua')return null;
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x)},xs=[-1.8,-.6,.6,1.8],textures=new Set(),droplets=[],entry=[],routes=[],cylinders=[];
 const water=new T.MeshPhysicalMaterial({color:'#1aafda',roughness:.17,metalness:.04,clearcoat:1,clearcoatRoughness:.12,transparent:true,opacity:.83,depthWrite:false,side:T.DoubleSide});
 const alloy=new T.MeshStandardMaterial({color:'#97adba',metalness:.68,roughness:.35,side:T.DoubleSide}),inner=new T.MeshStandardMaterial({color:'#526f82',metalness:.48,roughness:.48,side:T.DoubleSide}),dark=new T.MeshStandardMaterial({color:'#2d485a',metalness:.52,roughness:.49}),red=new T.MeshStandardMaterial({color:'#cb4c38',metalness:.34,roughness:.52}),amber=new T.MeshBasicMaterial({color:'#d69c39',transparent:true,opacity:.65});
 let elapsed=0,front=0,fill=0,lock=0,tilt=0;
 function mesh(geometry,material,p=V(),parent=host,name=''){const o=new T.Mesh(geometry,material);o.position.copy(p);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 function group(name,parent=host){const g=new T.Group();g.name=name;parent.add(g);return g}
 function box(p,s,m,parent=host,name=''){return mesh(new T.BoxGeometry(...s),m,V(...p),parent,name)}
 function rod(a,b,r,m,parent=host){const p=V(...a),q=V(...b),d=q.clone().sub(p),o=mesh(new T.CylinderGeometry(r,r,d.length(),14),m,p.add(q).multiplyScalar(.5),parent);o.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());return o}
 function ring(p,r,t,m,parent=host){const o=mesh(new T.TorusGeometry(r,t,9,56),m,V(...p),parent);return o}
 function badge(title,subtitle,p,w=3.7,color='#167aab'){const c=document.createElement('canvas');c.width=1024;c.height=220;const ctx=c.getContext('2d');ctx.fillStyle='#fcfeff';ctx.beginPath();ctx.roundRect(7,7,1010,206,30);ctx.fill();ctx.lineWidth=9;ctx.strokeStyle=color;ctx.stroke();ctx.fillStyle=color;ctx.textAlign='center';ctx.font='bold 66px Arial';ctx.fillText(title,512,95);ctx.font='43px Arial';ctx.fillText(subtitle,512,165);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.add(t);const o=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,depthTest:false,depthWrite:false}));o.position.copy(V(...p));o.scale.set(w,w*220/1024,1);o.renderOrder=12;host.add(o);return o}
 function xMark(p,parent){const c=document.createElement('canvas');c.width=c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#fff8ef';ctx.beginPath();ctx.arc(96,96,84,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c74634';ctx.lineWidth=11;ctx.stroke();ctx.lineCap='round';ctx.lineWidth=19;ctx.beginPath();ctx.moveTo(62,62);ctx.lineTo(130,130);ctx.moveTo(130,62);ctx.lineTo(62,130);ctx.stroke();const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.add(t);const o=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,depthTest:false,depthWrite:false}));o.position.copy(V(...p));o.scale.set(.35,.35,1);o.renderOrder=11;parent.add(o);return o}
 // Interpolação da parede interna real; as gotas aderem à superfície, sem flutuar no pleno.
 const wall=model.root.getObjectByName('Plenum_parede_interna_inferior').geometry.getAttribute('position'),edge=new Map();for(let i=0;i<wall.count;i++){const x=wall.getX(i),z=wall.getZ(i);if(z>1.1)edge.set(x,Math.max(edge.get(x)??-Infinity,z))}const outline=[...edge].sort((a,b)=>a[0]-b[0]);
 function wallZ(x){for(let i=1;i<outline.length;i++){const a=outline[i-1],b=outline[i];if(x>=a[0]&&x<=b[0])return T.MathUtils.lerp(a[1],b[1],(x-a[0])/(b[0]-a[0]))}return 1.72}
 const dropGeo=new T.SphereGeometry(.047,12,9);let seed=245;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<46;i++){const x=-2.30+random()*4.6,y=.25+random()*.76,size=.35+random()*.7,o=mesh(dropGeo.clone(),water,V(x,y,wallZ(x)-.022),host,'Gota_condensada_na_parede');o.scale.set(.85*size,1.45*size,.43*size);droplets.push({o,x,y,phase:random()*6,size,roof:false})}
 for(let i=0;i<18;i++){const x=-2.2+random()*4.4,z=.15+random()*1.23,o=mesh(dropGeo.clone(),water,V(x,1.085,z),host,'Gota_sob_a_tampa');o.scale.set(.45+random()*.6,.4,.45+random()*.6);droplets.push({o,x,y:1.085,z,phase:i*.31,roof:true})}dropGeo.dispose();
 const filmGeo=new T.PlaneGeometry(4.75,.94,48,8),fp=filmGeo.attributes.position;for(let i=0;i<fp.count;i++){const x=fp.getX(i);fp.setXYZ(i,x,fp.getY(i)+.61,wallZ(x)-.015)}filmGeo.computeVertexNormals();mesh(filmGeo,new T.MeshBasicMaterial({color:'#5ad1ef',transparent:true,opacity:.10,depthWrite:false,side:T.DoubleSide}),V(),host,'Filme_umido_na_parede');
 const pool=mesh(model.root.getObjectByName('Plenum_fundo').geometry.clone(),water,V(0,.105,0),host,'Agua_acumulada_no_pleno');pool.rotation.x=-Math.PI/2;pool.scale.set(.91,.87,1);const poolPos=pool.geometry.attributes.position,poolOriginal=Array.from(poolPos.array),depths=poolOriginal.filter((_,i)=>i%3===2),minDepth=Math.min(...depths),maxDepth=Math.max(...depths);
 const sourceCurve=new T.CatmullRomCurve3([V(-3.92,.81,.65),V(-3.38,.67,.65),V(-2.85,.58,.65),V(-2.15,.28,.72)]);
 for(let i=0;i<10;i++){const o=mesh(new T.SphereGeometry(.036+(i%3)*.007,10,8),water,sourceCurve.getPoint(i/10),host,'Entrada_leve_pelo_bocal');o.scale.set(1.35,.85,.85);entry.push(o)}
 const initialBadge=badge('GOTAS + ENTRADA DE ÁGUA','O acúmulo começa no pleno.',[0,2.60,-2.4],3.65);
 const tiltBadge=badge('INCLINOU. A ÁGUA AVANÇA.','Os quatro runners levam ao motor.',[0,2.05,-.9],4.45);
 const finalBadge=badge('CALÇO HIDRÁULICO','Água não comprime. O pistão para.',[0,2.24,-4.5],4.1,'#bc4130');
 const engine=group('Motor_em_corte_com_quatro_camaras');
 // Quatro câmaras em corte, ligadas à flange. A abertura frontal expõe água e pistão.
 const theta=1.30*Math.PI,span=1.40*Math.PI,boreTop=1.20,waterHeight=.45,pistonH=.25,stop=boreTop-waterHeight-pistonH/2;
 for(const [index,x]of xs.entries()){
  const g=group('Camara_de_combustao_'+(index+1),engine);g.position.set(x,0,-4.48);
  mesh(new T.CylinderGeometry(.515,.515,2.04,56,1,true,theta,span),alloy,V(0,.18,0),g,'Camisa_externa_em_corte');mesh(new T.CylinderGeometry(.445,.445,2.04,56,1,true,theta,span),inner,V(0,.18,0),g,'Parede_interna_do_cilindro');
  for(const y of [-.84,1.20]){const rim=mesh(new T.RingGeometry(.445,.515,56,1,Math.PI/2-(theta+span),span),alloy,V(0,y,0),g);rim.rotation.x=Math.PI/2}
  for(const a of [theta,theta+span])rod([Math.sin(a)*.48,-.84,Math.cos(a)*.48],[Math.sin(a)*.48,1.2,Math.cos(a)*.48],.035,alloy,g);
  const piston=group('Pistao_'+(index+1),g);mesh(new T.CylinderGeometry(.413,.413,pistonH,48),alloy,V(),piston,'Coroa_do_pistao');for(const y of [-.06,.025,.075])ring([0,y,0],.414,.011,dark,piston).rotation.x=Math.PI/2;
  const rodMesh=mesh(new T.CylinderGeometry(.065,.085,1,14),alloy,V(0,-.5,0),g,'Biela');ring([0,-1.15,0],.15,.045,alloy,g);
  const liquid=mesh(new T.CylinderGeometry(.423,.423,1,48),water,V(0,boreTop,0),g,'Agua_na_camara');liquid.scale.y=.001;
  const surface=ring([0,boreTop+.005,0],.36,.013,new T.MeshBasicMaterial({color:'#91eaff',transparent:true,opacity:.75,depthWrite:false}),g);surface.rotation.x=Math.PI/2;
  const limit=ring([0,boreTop-waterHeight,0],.454,.018,new T.MeshBasicMaterial({color:'#dc5542',transparent:true,opacity:0}),g);limit.rotation.x=Math.PI/2;
  const symbol=xMark([0,.89,-.57],g);const port=new T.CatmullRomCurve3([V(x,1.12,-3.26),V(x,1.16,-3.65),V(x,1.29,-4.20),V(x,1.18,-4.48)]);mesh(new T.TubeGeometry(port,40,.22,16,false),new T.MeshStandardMaterial({color:'#758f9f',metalness:.55,roughness:.43,transparent:true,opacity:.25,depthWrite:false,side:T.DoubleSide}),V(),engine,'Porta_de_admissao_'+(index+1));
  cylinders.push({g,piston,rod:rodMesh,liquid,surface,limit,symbol});
 }
 box([0,-.98,-4.70],[5.45,.21,.54],dark,engine,'Apoio_do_bloco');rod([-2.77,-1.15,-4.48],[2.77,-1.15,-4.48],.13,alloy,engine);ring([-2.83,-1.15,-4.48],.46,.075,dark,engine).rotation.y=Math.PI/2;
 for(const x of xs)for(const dx of [-.44,.44]){const bolt=mesh(new T.CylinderGeometry(.053,.053,.07,6),alloy,V(x+dx,1.24,-4.65),engine);}
 // A frente líquida percorre os runners reais e entra na região das válvulas de admissão.
 const frontUniform={value:0},clockUniform={value:0},alphaUniform={value:1};
 const flowMaterial=new T.ShaderMaterial({uniforms:{front:frontUniform,time:clockUniform,alpha:alphaUniform},transparent:true,depthWrite:false,side:T.DoubleSide,vertexShader:'varying vec2 waterUV;varying vec3 waterNormal;void main(){waterUV=uv;waterNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform float front,time,alpha;varying vec2 waterUV;varying vec3 waterNormal;void main(){if(waterUV.x>front)discard;float wave=.5+.5*sin(waterUV.x*45.-time*5.);float shine=pow(1.-abs(waterNormal.z),2.);vec3 c=mix(vec3(.015,.37,.63),vec3(.24,.86,.98),.35*wave+.65*shine);gl_FragColor=vec4(c,alpha*(.70+.20*wave));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 for(const x of xs){const curve=new T.CatmullRomCurve3([V(x,.58,0),V(x,.63,-.17),V(x,.67,-.28),V(x,.68,-.65),V(x,.84,-1.65),V(x,1.10,-2.70),V(x,1.12,-3.26),V(x,1.17,-3.70),V(x,1.29,-4.20),V(x,1.02,-4.48)]);const tube=mesh(new T.TubeGeometry(curve,160,.075,10,false),flowMaterial,V(),host,'Agua_entrando_no_runner');tube.renderOrder=4;const beads=[];for(let j=0;j<8;j++)beads.push(mesh(new T.SphereGeometry(.068,10,8),water,V(),host,'Volume_de_agua_em_movimento'));routes.push({curve,tube,beads})}
 const engineMaterials=new Map();engine.traverse(o=>{for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])if(!engineMaterials.has(m))engineMaterials.set(m,{opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite})});
 // Materiais compartilhados com o coletor de água não recebem o fade do bloco.
 engineMaterials.delete(water);
 const framing=[V(-4.03,.95,.75),V(-3.9,.5,.5),...[-1.95,1.95].flatMap(x=>[V(x,3.05,-2.4)])],enginePoints=[];
 for(const x of xs)for(const dx of [-.55,.55])for(const y of [-1.28,1.45])for(const z of [-5.03,-3.65])enginePoints.push(V(x+dx,y,z));for(const x of [-2.18,2.18])for(const y of [1.82,2.69])enginePoints.push(V(x,y,-4.5));
 const initialBox=new T.Box3(V(-3.55,-.1,-3.35),V(3,2.2,1.95));
 function framingPoints(){model.root.updateWorldMatrix(true,true);const points=framing.map(p=>p.clone());if(stage===1){const q=smooth(elapsed/2.7);for(const p of enginePoints)points.push(p.clone().lerp(V(0,.6,-.5),1-q))}return points.map(p=>model.root.localToWorld(p))}
 function closeup(index=-1){model.root.updateWorldMatrix(true,true);let points=enginePoints;if(index>=0&&(stage===0||index<2)){const a=V(...(stage===0?initialTargets:finalTargets)[index]),b=new T.Box3(a.clone().add(V(-.8,-.65,-.7)),a.clone().add(V(.8,.7,.7)));points=[];for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])points.push(V(x,y,z))}return{amount:stage===1?smooth((elapsed-4.65)/2.45):0,points:points.map(p=>model.root.localToWorld(p.clone()))}}
 const initialTargets=[[-1.25,.78,wallZ(-1.25)-.02],[-3.35,.67,.65],[.6,.26,.9]],finalTargets=[[-.6,.84,-1.65],[1.8,1.12,-3.26],[.6,.90,-4.48]];
 function update(t){elapsed=t;clockUniform.value=t;tilt=stage===1?-.42*smooth(t/2.2):0;model.root.rotation.x=tilt;front=stage===1?smooth((t-1.15)/3.15):0;fill=stage===1?smooth((t-3.4)/1.9):0;lock=stage===1?smooth((t-5.35)/1.35):0;frontUniform.value=front;alphaUniform.value=1-.63*lock;
  initialBadge.visible=stage===0;tiltBadge.visible=stage===1&&t<5.1;finalBadge.visible=stage===1&&t>=5.1;
  for(const d of droplets){if(d.roof){d.o.position.y=1.085-.012*Math.sin(t+d.phase)}else{const u=(t*.13+d.phase)%1;d.o.position.set(d.x,d.y-.085*u,wallZ(d.x)-.022);d.o.scale.y=d.size*(1.45+.12*Math.sin(t*1.4+d.phase))}}
  for(const [i,o]of entry.entries()){const u=(t*.25+i/10)%1;o.position.copy(sourceCurve.getPoint(u));o.visible=stage===0||t<5.3}
  const tiltQ=smooth(t/2.2);for(let i=0;i<poolPos.count;i++){const x=poolOriginal[i*3],z=-poolOriginal[i*3+1]*.87,layer=(poolOriginal[i*3+2]-minDepth)/(maxDepth-minDepth),h=Math.max(.005,(.27+(stage===1?.30*tiltQ:0)-z*Math.tan(-tilt)-.105)*(1-.91*front));poolPos.setZ(i,layer*(h+.005*Math.sin(t*2+x*4+z*3)))}poolPos.needsUpdate=true;pool.geometry.computeVertexNormals();
  engine.visible=stage===1&&t>.55;const fade=smooth((t-.55)/2.15);for(const [m,b]of engineMaterials){m.opacity=b.opacity*fade;m.transparent=fade<1||b.transparent;m.depthWrite=fade===1&&b.depthWrite}
  routes.forEach(r=>{r.tube.visible=stage===1&&front>0;for(const [j,b]of r.beads.entries()){const u=(t*.25+j/8)%1;b.position.copy(r.curve.getPoint(u));b.visible=stage===1&&u<front&&t<5.65}});
  for(const c of cylinders){const p=lock===1?stop-.02*(.5+.5*Math.sin((t-6.7)*5)):-.22+lock*(stop+.22);c.piston.position.y=p;c.rod.position.y=(p-1.15)/2;c.rod.scale.y=p+1.15;c.rod.material=lock>.65?red:alloy;const h=waterHeight*fill;c.liquid.scale.y=Math.max(.001,h);c.liquid.position.y=boreTop-h/2;c.liquid.visible=c.surface.visible=fill>0;c.surface.scale.setScalar(.97+.025*Math.sin(t*2.2));c.symbol.visible=lock>.65;c.symbol.scale.setScalar(.35*(1+.07*Math.sin(t*5)));c.limit.material.opacity=lock*(.45+.25*Math.sin(t*5)**2)}
  return true;
 }
 update(0);
 const presentation={direction:[-.60,.82,1.38],fromDirection:[-.60,.82,1.38],focusDirections:stage===1?[[0,.85,1.35],[.5,.8,-1.3],[-.56,.46,-1.4]]:null,duration:stage===1?2.2:0,zoom:1.13,large:true};
 return{presentation,animated:true,update,framingPoints,closeup,view:()=>stage===1?{direction:[-.56,.46,-1.4],amount:smooth((elapsed-4.4)/2.7)}:null,bounds:()=>null,targets:()=>stage===0?initialTargets:finalTargets,info:()=>({id,stage,didatico:true,gotasNasParedes:droplets.length,entradaLeve:entry.filter(o=>o.visible).length,inclinacao:tilt,eixoInclinacao:'x_lateral',frenteAgua:front,enchimento:fill,compressao:lock,concluido:stage===0||tFinal(),fase:stage===0?'condensacao':elapsed<2.2?'inclinacao':elapsed<5.35?'ingestao':'calco_hidraulico',runnersComAgua:routes.map(r=>r.tube.visible),camaras:cylinders.map((c,i)=>({cilindro:i+1,aguaAltura:waterHeight*fill,aguaTopo:boreTop,aguaFundo:boreTop-waterHeight*fill,pistaoTopo:c.piston.position.y+pistonH/2,bloqueado:lock>.65,intersecaoAgua:Math.max(0,c.piston.position.y+pistonH/2-(boreTop-waterHeight*fill))})),tempo:elapsed}),dispose:()=>{model.root.rotation.x=0;textures.forEach(t=>t.dispose());for(const m of [water,alloy,inner,dark,red,amber,flowMaterial])m.dispose()}};
 function tFinal(){return elapsed>=7.15}
}
