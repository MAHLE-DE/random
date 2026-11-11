// Circuito pneumático ilustrativo: ar retirado do servofreio para a admissão.
// A obstrução impede renovar o vácuo; a assistência cai após consumir a reserva.
function criarCenaVacuo(T,model,host,id,stage){
 if(id!=='vacuo')return null;
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x)},lerp=T.MathUtils.lerp,textures=new Set(),cycleDuration=14;
 let elapsed=0,phase=0,obstruction=0,detail=0,flowSpeed=1;
 const metal=new T.MeshStandardMaterial({color:'#b3c6d1',metalness:.85,roughness:.24}),dark=new T.MeshStandardMaterial({color:'#263b49',metalness:.55,roughness:.42}),rubber=new T.MeshStandardMaterial({color:'#233a45',roughness:.72,metalness:.05}),blue=new T.MeshStandardMaterial({color:'#3cb9e7',emissive:'#085b86',emissiveIntensity:.5,metalness:.15,roughness:.22}),red=new T.MeshStandardMaterial({color:'#c53827',emissive:'#9c1e17',emissiveIntensity:.3,roughness:.66});
 function mesh(g,m,p=V(),parent=host,name=''){const o=new T.Mesh(g,m);o.name=name;o.position.copy(p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 function group(name,p=V()){const g=new T.Group();g.name=name;g.position.copy(p);host.add(g);return g}
 function axialCylinder(r0,r1,len,m,p,parent=host){const o=mesh(new T.CylinderGeometry(r0,r1,len,56),m,p,parent);o.rotation.z=Math.PI/2;return o}
 function ring(x,y,z,r,t,m,parent=host){const o=mesh(new T.TorusGeometry(r,t,10,64),m,V(x,y,z),parent);o.rotation.y=Math.PI/2;return o}
 function badge(title,subtitle,p,w,color){const c=document.createElement('canvas');c.width=1024;c.height=230;const ctx=c.getContext('2d');ctx.fillStyle='#fffffff5';ctx.beginPath();ctx.roundRect(7,7,1010,216,28);ctx.fill();ctx.lineWidth=7;ctx.strokeStyle=color;ctx.stroke();ctx.fillStyle=color;ctx.textAlign='center';ctx.font='bold 61px Arial';ctx.fillText(title,512,94);ctx.font='39px Arial';ctx.fillText(subtitle,512,168);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.add(t);const o=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true,depthTest:false,depthWrite:false}));o.position.copy(V(...p));o.scale.set(w,w*230/1024,1);o.renderOrder=12;host.add(o);return o}
 // Tomada ancorada na extremidade real do pleno; janela aberta só neste conector.
 const connector=group('Tomada_de_vacuo_com_janela_didatica');
 axialCylinder(.27,.24,.14,dark,V(2.79,.74,.70),connector);ring(2.87,.74,.70,.205,.035,metal,connector);
 const shell=mesh(new T.CylinderGeometry(.18,.18,.65,48,1,true,.12*Math.PI,1.35*Math.PI),dark,V(3.17,.74,.70),connector,'Conector_secionado_para_exibir_a_obstrucao');shell.rotation.z=Math.PI/2;
 for(const x of[2.90,3.46]){ring(x,.74,.70,.18,.024,metal,connector);ring(x+.035,.74,.70,.175,.012,dark,connector)}
 const plug=group('Obstrucao_no_conector',V(3.13,.74,.70));axialCylinder(.152,.158,.105,red,V(),plug);ring(0,0,0,.158,.018,red,plug);
 for(let i=0;i<17;i++){const a=i*2.39996,r=.11*Math.sqrt((i+.5)/17);const o=mesh(new T.IcosahedronGeometry(.035,1),i%3?red:dark,V((i%3-1)*.025,Math.cos(a)*r,Math.sin(a)*r),plug);o.scale.set(.6,1,1)}
 const path=new T.CatmullRomCurve3([V(5.68,1.05,.70),V(5.06,1.12,.70),V(4.45,1.32,.70),V(3.78,.90,.70),V(3.48,.74,.70),V(3.10,.74,.70),V(2.72,.74,.70)]);path.arcLengthDivisions=400;path.updateArcLengths();
 // Mangueira translúcida com bordas de borracha: o fluxo fica dentro da seção.
 const hose=mesh(new T.TubeGeometry(path,100,.145,24,false),new T.MeshPhysicalMaterial({color:'#3a667b',metalness:.1,roughness:.45,transparent:true,opacity:.24,depthWrite:false,side:T.DoubleSide}),V(),host,'Mangueira_do_masterback');
 for(const dz of[-.145,.145]){const edge=new T.CatmullRomCurve3(path.getPoints(100).slice(0,77).map(p=>p.add(V(0,0,dz))));mesh(new T.TubeGeometry(edge,84,.022,8,false),rubber)}
 for(const u of[.06,.74]){const p=path.getPointAt(u),r=ring(p.x,p.y,p.z,.159,.018,metal);r.quaternion.setFromUnitVectors(V(0,0,1),path.getTangentAt(u))}
 const booster=group('Masterback_servofreio',V(6.20,1.05,.70));axialCylinder(.79,.80,.45,dark,V(),booster);axialCylinder(.53,.75,.22,metal,V(-.30,0,0),booster);axialCylinder(.28,.52,.16,dark,V(-.48,0,0),booster);
 for(const x of[-.23,.23])ring(x,0,0,.79,.036,metal,booster);ring(-.40,0,0,.55,.022,dark,booster);
 // Prisioneiros, tampa estampada e haste dão leitura de um servofreio real.
 for(const a of[.55,2.59,3.69,5.73]){const y=.54*Math.cos(a),z=.54*Math.sin(a);axialCylinder(.032,.032,.22,metal,V(.34,y,z),booster);const nut=axialCylinder(.065,.065,.055,metal,V(.40,y,z),booster);nut.geometry.dispose();nut.geometry=new T.CylinderGeometry(.065,.065,.055,6)}
 axialCylinder(.13,.16,.36,metal,V(.49,0,0),booster);axialCylinder(.035,.035,.45,metal,V(.85,0,0),booster);
 const pedal=group('Pedal_com_assistencia');const lever=mesh(new T.BoxGeometry(.07,1.05,.07),metal,V(7.22,.53,.70),pedal);lever.rotation.z=-.18;const foot=mesh(new T.BoxGeometry(.18,.27,.37),rubber,V(7.30,.02,.70),pedal);for(let i=0;i<5;i++)mesh(new T.BoxGeometry(.017,.025,.31),dark,V(7.20+i*.034,.00,.70),pedal);
 const beads=[];for(let i=0;i<21;i++){const o=mesh(new T.SphereGeometry(.035,10,8),blue);beads.push(o)}
 const arrows=[];for(let i=0;i<5;i++){const o=new T.ArrowHelper(V(-1,0,0),V(),.24,'#21a9db',.10,.075);host.add(o);arrows.push(o)}
 const healthy=badge('AR → COLETOR','O vácuo mantém a assistência.',[4.55,2.35,.70],4.15,'#126f9e');
 const warning=badge('CONECTOR OBSTRUÍDO','Sem renovação de vácuo.',[3.15,1.96,.70],3.35,'#bc3025');
 const hardPedal=badge('PEDAL MAIS DURO','A reserva de vácuo se esgota.',[6.0,-.84,.70],3.5,'#bc3025');
 const warningCanvas=document.createElement('canvas');warningCanvas.width=warningCanvas.height=256;const wc=warningCanvas.getContext('2d');wc.fillStyle='#fffdf9';wc.beginPath();wc.arc(128,128,116,0,2*Math.PI);wc.fill();wc.strokeStyle='#c02721';wc.lineWidth=11;wc.stroke();wc.fillStyle='#c02721';wc.font='bold 205px Arial';wc.textAlign='center';wc.fillText('!',128,202);const warningTexture=new T.CanvasTexture(warningCanvas);warningTexture.colorSpace=T.SRGBColorSpace;textures.add(warningTexture);
 const sign=new T.Sprite(new T.SpriteMaterial({map:warningTexture,transparent:true,depthTest:false,depthWrite:false}));sign.name='Exclamacao_vermelha_na_obstrucao';sign.position.set(3.70,1.25,1.05);sign.scale.set(.49,.49,1);sign.renderOrder=13;host.add(sign);
 const signal=ring(3.13,.74,.70,.245,.014,new T.MeshBasicMaterial({color:'#e33624',transparent:true,opacity:.8,depthTest:false,depthWrite:false}));signal.renderOrder=10;
 const targets=[[3.15,.74,.93],[4.45,1.32,.70],[6.20,1.05,.70]],box=new T.Box3(V(-3.5,-1.3,-3.4),V(7.6,2.95,2.0)),macro=new T.Box3(V(1.35,.32,.08),V(4.95,2.47,1.3));
 function update(t){elapsed=t;phase=t%cycleDuration;obstruction=smooth((phase-4.6)/1.1)*(1-smooth((phase-10.3)/1.1));detail=smooth((phase-4)/2)*(1-smooth((phase-10)/2));flowSpeed=1-obstruction;plug.visible=obstruction>.005;plug.scale.setScalar(Math.max(.001,obstruction));healthy.visible=phase<4.5||phase>12;warning.visible=phase>5.1&&phase<11.3;hardPedal.visible=phase>6.5&&phase<10.5;sign.visible=phase>5.5&&phase<10.8;signal.visible=sign.visible;signal.scale.setScalar(1+Math.sin(t*4)*.10);signal.material.opacity=.60+.35*Math.sin(t*4)**2;
  // As partículas param antes da obstrução; nenhum ar atravessa o conector fechado.
  const blockU=.865;for(let i=0;i<beads.length;i++){const base=(i/beads.length+t*.31)%1;const u=obstruction>.98?Math.min(base,blockU-.045-(i%3)*.022):base;beads[i].position.copy(path.getPointAt(u));beads[i].visible=obstruction<.98||base<blockU;beads[i].scale.setScalar(lerp(1,.8,obstruction))}
  for(let i=0;i<arrows.length;i++){const u=(i/5+t*.24)%1,o=arrows[i];o.visible=obstruction<.98||u<blockU-.08;o.position.copy(path.getPointAt(obstruction>.98?Math.min(u,blockU-.08):u));o.setDirection(path.getTangentAt(u));o.setColor(obstruction>.7?'#a2b8c2':'#21a9db')}
  blue.emissiveIntensity=.5*(1-obstruction*.7);foot.rotation.z=obstruction>.8?Math.sin(t*2)*.025:Math.sin(t*1.5)*.10;return true;
 }
 function worldBox(b){model.root.updateWorldMatrix(true,true);const points=[];for(const x of[b.min.x,b.max.x])for(const y of[b.min.y,b.max.y])for(const z of[b.min.z,b.max.z])points.push(model.root.localToWorld(V(x,y,z)));return points}
 function closeup(index=-1){let b=macro;if(index>=0){const p=V(...targets[index]),radius=index===2?1.05:index===1?.65:.55;b=new T.Box3(p.clone().addScalar(-radius),p.clone().addScalar(radius))}return{amount:detail,points:worldBox(b)}}
 update(0);
 return{animated:true,update,presentation:{direction:[.45,.52,1.5],zoom:1.12,large:true,focusDirections:[[.7,.38,1.4],[.35,.6,1.4],[1,.4,1.35]]},bounds:()=>box,closeup,targets:()=>targets,targetVisibility:()=>detail>.7?[true,false,false]:[true,true,true],info:()=>({id,stage,tempo:elapsed,ciclo:Math.floor(elapsed/cycleDuration),tempoCiclo:phase,duracaoCiclo:cycleDuration,obstrucao:obstruction,detalhe:detail,fluxo:flowSpeed,sentido:'servofreio → coletor',conector:targets[0],limiteFluxo:.865,reserva:'a assistência diminui após consumir a reserva de vácuo',didatico:true}),dispose:()=>textures.forEach(t=>t.dispose())};
}
