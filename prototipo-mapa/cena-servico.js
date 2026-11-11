// Acesso de serviço: montagem ilustrativa ao redor da flange real do coletor.
// A chave em L tem soquete paralelo ao eixo do parafuso; a travessa bloqueia sua inserção.
function criarCenaServico(T,model,host,id,stage){
 if(id!=='servico')return null;
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x)},textures=new Set(),ownedMaterials=new Set(),fades=[];
 const red='#d74432',amber='#dc9d28',steel='#b3c0c9',boltPoint=V(1.8,1.66,-3.035),contactOffset=1.603,stroke=.94;
 const info={id,stage,didatico:true,fixador:boltPoint.toArray(),eixoFixador:[0,0,1],eixoSoquete:[0,0,1],folgaParafuso:.16,apertoPendente:true,acessoBloqueado:stage===1,montagemCompleta:false,ciclos:0},details={};let elapsed=0;
 function group(name,parent=host){const g=new T.Group();g.name=name;parent.add(g);return g}
 function mat(color,opts={}){const m=new T.MeshStandardMaterial({color,roughness:.5,metalness:.22,side:T.DoubleSide,...opts});ownedMaterials.add(m);return m}
 function mesh(geo,m,p=V(),parent=host,name=''){const o=new T.Mesh(geo,m);o.position.copy(p);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 function box(p,s,m,parent=host,name=''){return mesh(new T.BoxGeometry(...s),m,V(...p),parent,name)}
 function rounded(p,s,m,parent=host,name='',bevel=.1){const [w,h,d]=s,r=Math.min(bevel,w/4,h/4,d/4),shape=new T.Shape();shape.moveTo(-w/2+r,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(-w/2+r,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,-h/2+r);shape.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const o=mesh(new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,steps:1}),m,V(...p),parent,name);o.geometry.translate(0,0,-d/2+r);return o}
 function rod(a,b,r,m,parent=host,segments=16){const start=V(...a),end=V(...b),delta=end.clone().sub(start),o=mesh(new T.CylinderGeometry(r,r,delta.length(),segments),m,start.add(end).multiplyScalar(.5),parent);o.quaternion.setFromUnitVectors(V(0,1,0),delta.normalize());return o}
 function tube(points,r,m,parent=host){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p))),48,r,12,false),m,V(),parent)}
 function ring(p,r,m,parent=host){return mesh(new T.TorusGeometry(r,.026,9,56),m,V(...p),parent)}
 function sprite(text,p,size,color=red,parent=host){const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#fffdf8';ctx.beginPath();ctx.roundRect(5,5,758,182,32);ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=8;ctx.stroke();ctx.fillStyle=color;ctx.font='bold 65px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,100);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;textures.add(texture);const o=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false}));o.position.copy(V(...p));o.scale.set(size,size/4,1);o.renderOrder=12;parent.add(o);return o}
 function cross(p,size,parent){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#fff9f1';ctx.beginPath();ctx.arc(128,128,116,0,2*Math.PI);ctx.fill();ctx.strokeStyle=red;ctx.lineWidth=15;ctx.stroke();ctx.lineCap='round';ctx.lineWidth=28;ctx.beginPath();ctx.moveTo(80,80);ctx.lineTo(176,176);ctx.moveTo(176,80);ctx.lineTo(80,176);ctx.stroke();const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;textures.add(texture);const s=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false}));s.position.copy(V(...p));s.scale.set(size,size,1);s.renderOrder=13;parent.add(s);return s}
 function fade(g,start,duration=.75){const materials=new Map();g.traverse(o=>{if(!o.material)return;const local=m=>{if(!materials.has(m))materials.set(m,m.clone());return materials.get(m)};o.material=Array.isArray(o.material)?o.material.map(local):local(o.material)});const entry={g,start,duration,q:0,materials:[...materials.values()].map(m=>({m,opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite}))};fades.push(entry);return entry}
 // Fixadores nos furos existentes. Só o último superior tem folga e rosca exposta.
 const fix=group('Fixador_com_aperto_pendente'),metal=mat(steel,{metalness:.88,roughness:.23}),dark=mat('#3f4e58'),gold=mat(amber,{emissive:amber,emissiveIntensity:.16});
 const holes=[[-2.63,.69],[-2.63,1.61],[2.63,.69],[2.63,1.61],...[-1.8,-.6,.6,1.8].map(x=>[x,1.66])];
 holes.forEach(([x,y])=>{const loose=x===1.8&&y===1.66,z=loose?-2.91:-3.07;const head=mesh(new T.CylinderGeometry(loose?.15:.095,loose?.15:.095,.105,6),metal,V(x,y,z),fix,loose?'Parafuso_solto':'Parafuso_apertado');head.rotation.x=Math.PI/2;ring([x,y,-3.09],loose?.17:.10,dark,fix);if(loose){rod([x,y,-3.27],[x,y,-2.96],.057,metal,fix);for(let i=0;i<6;i++)ring([x,y,-3.07+i*.022],.06,dark,fix)}});
 const halo=ring([1.8,1.66,-2.835],.29,gold,fix);ring([1.8,1.66,-2.825],.38,mat(amber,{transparent:true,opacity:.35,depthWrite:false}),fix);
 const warning=sprite('APERTO PENDENTE',[.8,2.65,-1.8],2.65,'#ae7015',fix);
 let tool=null,xMark=null,collision=null,toolFade=null;
 const assembly=group('Motor_e_compartimento');
 if(stage===1){
  // A face de admissão do cabeçote termina junto à flange (z=-3,26).
  const engine=group('01_Bloco_e_cabecote',assembly),alloy=mat('#9daeb8',{metalness:.72,roughness:.37}),cast=mat('#738a98',{metalness:.5,roughness:.62}),cover=mat('#315970',{metalness:.5,roughness:.36}),black=mat('#273b45',{roughness:.8});
  rounded([0,-.83,-4.47],[5.75,2.25,2.30],cast,engine,'Bloco_motor_4_cilindros');
  rounded([0,1.13,-4.27],[5.95,1.75,2.02],alloy,engine,'Cabecote_face_admissao_alinhada');
  rounded([0,2.13,-4.28],[5.72,.48,1.92],cover,engine,'Tampa_valvulas');
  rounded([0,-2.08,-4.45],[4.9,.35,1.85],black,engine,'Carter');
  for(const x of [-2.3,-1.15,0,1.15,2.3]){box([x,-.8,-3.265],[.11,1.7,.07],alloy,engine);box([x,2.40,-4.28],[.07,.055,1.45],alloy,engine)}
  for(const x of [-1.8,-.6,.6,1.8]){const coil=rounded([x,2.47,-4.28],[.55,.20,.74],black,engine);const screw=mesh(new T.CylinderGeometry(.055,.055,.055,6),metal,V(x,2.59,-4.28),engine);}
  mesh(new T.CylinderGeometry(.25,.25,.14,24),black,V(-2.20,2.47,-4.28),engine,'Tampa_oleo');
  const gasket=box([0,.18,-4.44],[5.65,.045,2.22],dark,engine,'Junta_bloco');
  // Quatro canais coincidem com os runners e reforçam a montagem na face correta.
  for(const x of [-1.8,-.6,.6,1.8])ring([x,1.12,-3.255],.32,dark,engine);
  fade(engine,.10,.85);
  const accessories=group('02_Acessorios_e_mangueiras',assembly),rubber=mat('#31434d',{roughness:.9}),body=mat('#8296a2',{metalness:.7,roughness:.42});
  const alt=mesh(new T.CylinderGeometry(.64,.64,.95,24),alloy,V(-3.33,-.55,-4.35),accessories,'Alternador');alt.rotation.z=Math.PI/2;
  for(let i=0;i<10;i++){const a=i*Math.PI/5;box([-3.83,-.55+Math.cos(a)*.46,-4.35+Math.sin(a)*.46],[.055,.12,.12],black,accessories)}
  for(const [y,z,r]of [[-.55,-4.35,.42],[-1.4,-4.9,.68],[.45,-4.9,.40]]){const pulley=mesh(new T.CylinderGeometry(r,r,.14,32),black,V(-3.91,y,z),accessories);pulley.rotation.z=Math.PI/2;const hub=mesh(new T.CylinderGeometry(r*.38,r*.38,.17,12),metal,V(-4.0,y,z),accessories);hub.rotation.z=Math.PI/2}
  tube([[-4.06,-.58,-4.72],[-4.06,-1.68,-5.15],[-4.06,.46,-5.22],[-4.06,-.12,-4.40]],.045,rubber,accessories);
  rounded([-4.25,.80,.06],[1.16,1.40,2.05],rubber,accessories,'Caixa_filtro_ar');
  tube([[-4.18,1.1,-.34],[-4.3,.8,.65],[-3.36,.67,.65]],.29,rubber,accessories);
  for(let i=0;i<7;i++){const o=ring([-3.5-i*.09,.69,.65],.30,body,accessories);o.rotation.y=Math.PI/2}
  tube([[3.0,.9,-4.8],[3.35,.5,-3.35],[3.45,-.45,-1.7]],.16,rubber,accessories);
  fade(accessories,.95,.75);
  // Componente obstrutor sólido: duas fixações e uma travessa acima do corredor.
  const obstacle=group('03_Travessa_obstrutora',assembly),braceMat=mat('#bf8952',{metalness:.68,roughness:.39});
  rounded([0,2.90,-2.55],[9.20,.34,1.30],braceMat,obstacle,'Travessa_acima_do_coletor',.07);
  for(const x of [-4.4,4.4]){rounded([x,2.70,-2.40],[.65,.25,1.25],body,obstacle);for(const z of [-2.75,-2.05])mesh(new T.CylinderGeometry(.09,.09,.08,6),metal,V(x,2.87,z),obstacle);rod([x,2.66,-2.40],[x,1.3,-3.8],.11,body,obstacle)}
  const caution=mat('#f5cb65',{roughness:.55});for(let i=0;i<6;i++){const stripe=box([1.17+i*.24,3.077,-2.40],[.12,.016,.88],i%2?dark:caution,obstacle);stripe.rotation.y=-.25}
  fade(obstacle,1.80,.85);
  const bay=group('04_Limites_do_compartimento',assembly),ghost=mat('#7f9eb4',{transparent:true,opacity:.075,depthWrite:false,roughness:.9}),edge=mat('#718fa7',{transparent:true,opacity:.34,depthWrite:false});
  box([0,.55,-5.72],[10.4,5.15,.09],ghost,bay,'Parede_corta_fogo');
  for(const x of [-5.15,5.15]){box([x,.35,-1.3],[.08,4.3,8.9],ghost,bay,'Limite_lateral_cofre');tube([[x,-1.8,3.1],[x,1.65,3.1],[x,2.5,-2.4],[x,3.1,-5.72]],.028,edge,bay);const tower=mesh(new T.CylinderGeometry(.72,.92,1.1,28),ghost,V(x,1.9,-3.3),bay);ring([x,2.46,-3.3],.53,edge,bay).rotation.x=-Math.PI/2;}
  tube([[-5.15,1.65,3.1],[0,1.8,3.3],[5.15,1.65,3.1]],.038,edge,bay);
  tube([[-5.15,3.1,-5.72],[0,3.45,-5.72],[5.15,3.1,-5.72]],.035,edge,bay);
  fade(bay,2.70,.85);
  // Chave de roda em L: haste vertical, punho e soquete de boca sextavada.
  tool=group('05_Chave_em_L_bloqueada');tool.position.set(1.8,contactOffset+stroke,-2.11);
  const chrome=mat('#d9e5ed',{metalness:.95,roughness:.19}),grip=mat('#192f3c',{roughness:.85}),socketDark=mat('#243b49',{metalness:.55,roughness:.55});
  rod([0,1.66,0],[0,3.26,0],.085,chrome,tool);rod([0,1.66,0],[0,1.66,-.72],.085,chrome,tool);
  mesh(new T.SphereGeometry(.09,16,12),chrome,V(0,1.66,0),tool);rod([0,2.6,0],[0,3.27,0],.135,grip,tool);
  for(let i=0;i<5;i++){const collar=ring([0,2.65+i*.12,0],.14,chrome,tool);collar.rotation.x=Math.PI/2}
  const socket=new T.Shape();socket.absarc(0,0,.185,0,Math.PI*2,false);const hex=new T.Path();for(let i=0;i<=6;i++){const a=-i*Math.PI/3;i?hex.lineTo(Math.cos(a)*.158,Math.sin(a)*.158):hex.moveTo(.158,0)}socket.holes.push(hex);
  const socketMesh=mesh(new T.ExtrudeGeometry(socket,{depth:.29,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2,curveSegments:32}),chrome,V(0,1.66,-1.02),tool,'Soquete_sextavado_real');
  toolFade=fade(tool,3.60,.55);
  const signals=group('06_Indicadores_de_bloqueio'),signal=mat(red,{transparent:true,opacity:.7,depthWrite:false,emissive:red,emissiveIntensity:.28});
  for(let i=0;i<7;i++)rod([1.8,1.88+i*.155,-2.11],[1.8,1.94+i*.155,-2.11],.035,signal,signals);
  rod([2.52,4.38,-1.85],[2.52,3.56,-1.85],.035,signal,signals);const arrow=mesh(new T.ConeGeometry(.13,.26,16),signal,V(2.52,3.45,-1.85),signals);arrow.rotation.z=Math.PI;
  xMark=cross([2.75,3.3,-1.65],.73,signals);collision=ring([1.8,3.085,-2.91],.28,signal,signals);collision.rotation.x=-Math.PI/2;
  sprite('SEM PASSAGEM',[-1.3,4.15,-2.0],3.20,red,signals);fade(signals,4.15,.45);
  details.motor={cilindros:4,faceAdmissaoZ:-3.26,flangeColetorZ:-3.26,posicaoBloco:[0,-.83,-4.47]};details.obstaculo={nome:'Travessa superior',centro:[0,2.9,-2.55],topo:3.07};details.ferramenta={tipo:'Chave de roda em L',alturaContato:3.263,curso:stroke,offsetMinimo:contactOffset};
 }else assembly.visible=false;
 const presentation={direction:stage===0?[-.42,.66,1.35]:[-1.0,1.2,1.35],duration:stage===1?2.65:0,zoom:stage===1?1.25:1.1,large:true};
 // Enquadramento por volumes de cada componente, sem os cantos vazios de uma caixa
 // global. O contorno transparente do cofre pode se prolongar até a borda do visor.
 const finalPoints=[];
 if(stage===1){model.root.updateWorldMatrix(true,true);const inverse=model.root.matrixWorld.clone().invert();host.traverse(o=>{if(!o.geometry)return;for(let p=o;p&&p!==host;p=p.parent)if(p.name==='04_Limites_do_compartimento')return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox,matrix=new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld);for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const p=V(x,y,z).applyMatrix4(matrix);finalPoints.push(p);if(o.parent===tool)finalPoints.push(p.clone().add(V(0,-stroke,0)))}});for(const x of [-2.9,.3])for(const y of [3.75,4.55])finalPoints.push(V(x,y,-2));}
 if(stage===1)finalPoints.push(V(5.15,1.65,2.6));
 const initialBox=new T.Box3(V(-3.5,-.12,-3.35),V(3.35,2.95,1.95));
 function framingPoints(){if(stage!==1)return null;const q=smooth(elapsed/2.65);model.root.updateWorldMatrix(true,true);return finalPoints.map(p=>p.clone().lerp(initialBox.clampPoint(p,V()),1-q).applyMatrix4(model.root.matrixWorld))}
 // Limites constantes do curso completo: o loop não causa aproximação/afastamento.
 function bounds(){model.root.updateWorldMatrix(true,true);const q=stage===0?0:smooth(elapsed/2.65);return new T.Box3(V(-3.5,-.12,-3.35).lerp(V(-5.3,-2.3,-5.85),q),V(3.35,2.95,1.95).lerp(V(5.3,5.8,3.35),q)).applyMatrix4(model.root.matrixWorld)}
 function update(t){
  elapsed=t;
  halo.scale.setScalar(1+.075*Math.sin(t*3));gold.emissiveIntensity=.2+.14*Math.sin(t*3);warning.visible=stage===0||t<3.6;
  for(const f of fades){f.q=smooth((t-f.start)/f.duration);f.g.visible=f.q>0;for(const a of f.materials){a.m.opacity=a.opacity*f.q;a.m.transparent=f.q<1||a.transparent;a.m.depthWrite=f.q===1&&a.depthWrite}}
  if(tool){const u=Math.max(0,t-4.2),cycle=u%2.4;let offset=contactOffset+stroke;if(t>=4.2){if(cycle<.9)offset=contactOffset+stroke*(1-smooth(cycle/.9));else if(cycle<1.15)offset=contactOffset;else if(cycle<2)offset=contactOffset+stroke*smooth((cycle-1.15)/.85)}tool.position.y=offset;const contact=t>=4.2&&cycle>=.9&&cycle<=1.15;xMark.scale.setScalar(.73*(contact?1.18:1));collision.material.opacity=contact?.95:.25;info.ferramentaOffset=offset;info.ferramentaEmContato=contact;info.penetracaoObstaculo=Math.max(0,3.07-(1.66+offset-.193));info.ciclos=Math.floor(u/2.4);info.montagemCompleta=t>=3.55;info.fases=fades.map(f=>({nome:f.g.name,inicio:f.start,opacidade:f.q}));info.soquetePosicao=[1.8,1.66+offset,-3.13];}
  return true;
 }
 update(0);
 return{presentation,animated:true,update,bounds,framingPoints,targets:()=>stage===0?[[1.8,1.66,-2.82],[-2.63,1.61,-3.06],[.6,1.66,-3.06]]:[[1.8,1.66,-2.82],[1.8,3.1,-2.4],[5.15,1.65,2.6]],info:()=>({...info,detalhes:details}),dispose:()=>{textures.forEach(t=>t.dispose());ownedMaterials.forEach(m=>m.dispose())}};
}
