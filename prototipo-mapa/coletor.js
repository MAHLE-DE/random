// Reconstrução didática original, inspirada no modelo público K24 do tutorial indicado.
// Dimensões relativas para visualização: não usar como desenho de fabricação.
function criarColetorK24(T,{espessura=.055}={}){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),root=new T.Group();root.name='Coletor_K24_didatico';
 const upper=new T.Group();upper.name='Metade_superior';root.add(upper);
 const shell=new T.MeshPhysicalMaterial({color:'#263039',roughness:.36,metalness:.18,clearcoat:.20,clearcoatRoughness:.45,side:T.DoubleSide});
 const interior=new T.MeshStandardMaterial({color:'#45545d',roughness:.48,metalness:.15,side:T.DoubleSide});
 const cutMaterial=new T.MeshStandardMaterial({color:'#96a8b2',metalness:.5,roughness:.35,side:T.DoubleSide});
 const flangeMaterial=new T.MeshStandardMaterial({color:'#38454d',metalness:.38,roughness:.40,side:T.DoubleSide});
 const cutOnly=[],fullOnly=[],runners=[];
 function mesh(g,m,name,parent=root){const o=new T.Mesh(g,m);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 function surface(vertices,indices,material,name,parent=root){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return mesh(g,material,name,parent)}
 function polygon(points){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s}
 function plate(shape,depth,z,name,material=flangeMaterial,parent=root){const o=mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:2,bevelSize:.009,bevelThickness:.009,curveSegments:48}),material,name,parent);o.position.z=z;return o}
 const footprint=new T.Shape();footprint.moveTo(-2.72,.30);footprint.lineTo(2.60,.30);footprint.quadraticCurveTo(2.85,.30,2.85,-.05);footprint.lineTo(2.78,-1.32);footprint.quadraticCurveTo(2.72,-1.68,2.35,-1.73);footprint.quadraticCurveTo(0,-1.90,-2.48,-1.65);footprint.quadraticCurveTo(-2.86,-1.58,-2.86,-1.25);footprint.lineTo(-2.86,-.02);footprint.quadraticCurveTo(-2.86,.30,-2.72,.30);footprint.closePath();
 const base=mesh(new T.ExtrudeGeometry(footprint,{depth:.085,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,curveSegments:48}),shell,'Plenum_fundo');base.rotation.x=-Math.PI/2;
 const outline=footprint.getPoints(72).map(p=>V(p.x,0,-p.y));
 function walls(y0,y1,parent,suffix){const outer=[],inner=[],rim=[],ids=[];let n=0;
  for(let i=0;i<outline.length-1;i++){const a=outline[i],b=outline[i+1];if((Math.abs(a.z+.30)<1e-6&&Math.abs(b.z+.30)<1e-6)||(a.x+b.x)/2< -2.73)continue;const ai=V(a.x*(1-espessura/2.85),0,.65+(a.z-.65)*(1-espessura/1.05)),bi=V(b.x*(1-espessura/2.85),0,.65+(b.z-.65)*(1-espessura/1.05));
   outer.push(a.x,y0,a.z,b.x,y0,b.z,b.x,y1,b.z,a.x,y1,a.z);inner.push(ai.x,y0,ai.z,ai.x,y1,ai.z,bi.x,y1,bi.z,bi.x,y0,bi.z);rim.push(a.x,y1,a.z,b.x,y1,b.z,bi.x,y1,bi.z,ai.x,y1,ai.z);ids.push(n,n+1,n+2,n,n+2,n+3);n+=4;
  }
  surface(outer,ids,shell,'Plenum_parede_externa_'+suffix,parent);surface(inner,ids,interior,'Plenum_parede_interna_'+suffix,parent);surface(rim,ids,cutMaterial,'Plenum_borda_'+suffix,parent);
 }
 walls(.07,.67,root,'inferior');walls(.67,1.12,upper,'superior');
 const lid=mesh(new T.ExtrudeGeometry(footprint,{depth:.065,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,curveSegments:48}),shell,'Tampa_do_plenum',upper);lid.rotation.x=-Math.PI/2;lid.position.y=1.12;
 const xs=[-1.80,-.60,.60,1.80],outerRadius=.35,innerRadius=outerRadius-espessura;
 function hollow(curve,r0,r1,theta0,theta1,name,parent){const vertices=[],innerVertices=[],indices=[],edgeVertices=[],edgeIndices=[],n=56,m=40;
  for(let j=0;j<=n;j++){const c=curve.getPoint(j/n),d=curve.getTangent(j/n).normalize(),right=V().crossVectors(V(0,1,0),d).normalize(),up=V().crossVectors(d,right).normalize();for(let k=0;k<=m;k++){const angle=theta0+(theta1-theta0)*k/m,radial=right.clone().multiplyScalar(Math.cos(angle)).addScaledVector(up,Math.sin(angle));vertices.push(...c.clone().addScaledVector(radial,r0).toArray());innerVertices.push(...c.clone().addScaledVector(radial,r1).toArray())}}
  for(let j=0;j<n;j++)for(let k=0;k<m;k++){const a=j*(m+1)+k,b=a+m+1;indices.push(a,b,a+1,a+1,b,b+1)}
  const g=new T.Group();g.name=name;parent.add(g);surface(vertices,indices,shell,name+'_exterior',g);surface(innerVertices,indices,interior,name+'_interior',g);
  for(const k of [0,m])for(let j=0;j<n;j++){const a=j*(m+1)+k,b=(j+1)*(m+1)+k,base=edgeVertices.length/3;edgeVertices.push(...vertices.slice(a*3,a*3+3),...vertices.slice(b*3,b*3+3),...innerVertices.slice(b*3,b*3+3),...innerVertices.slice(a*3,a*3+3));edgeIndices.push(base,base+1,base+2,base,base+2,base+3)}
  for(const j of [0,n])for(let k=0;k<m;k++){const a=j*(m+1)+k,b=a+1,base=edgeVertices.length/3;edgeVertices.push(...vertices.slice(a*3,a*3+3),...vertices.slice(b*3,b*3+3),...innerVertices.slice(b*3,b*3+3),...innerVertices.slice(a*3,a*3+3));edgeIndices.push(base,base+1,base+2,base,base+2,base+3)}
  surface(edgeVertices,edgeIndices,cutMaterial,name+'_espessura',g);return g;
 }
 xs.forEach((x,i)=>{const curve=new T.CatmullRomCurve3([V(x,.67,-.28),V(x,.68,-.65),V(x,.84,-1.65),V(x,1.10,-2.70),V(x,1.12,-3.12)]);runners.push(hollow(curve,outerRadius,innerRadius,Math.PI,Math.PI*2,'Duto_'+(i+1)+'_inferior',root));hollow(curve,outerRadius,innerRadius,0,Math.PI,'Duto_'+(i+1)+'_superior',upper)});
 // Parede traseira em corte com quatro recortes semicirculares, alinhados aos dutos.
 const backPoints=[[-2.73,.07],[2.73,.07],[2.73,.67]];
 for(const x of [...xs].reverse()){backPoints.push([x+innerRadius,.67]);for(let j=0;j<=36;j++){const a=j*Math.PI/36;backPoints.push([x+innerRadius*Math.cos(a),.67-innerRadius*Math.sin(a)])}}
 backPoints.push([-2.73,.67]);const backCut=plate(polygon(backPoints),.065,-.34,'Parede_traseira_em_corte');cutOnly.push(backCut);
 const backShape=polygon([[-2.73,.07],[2.73,.07],[2.73,1.12],[-2.73,1.12]]);for(const x of xs){const hole=new T.Path();hole.absellipse(x,.67,innerRadius,innerRadius,0,Math.PI*2,true);backShape.holes.push(hole)}fullOnly.push(plate(backShape,.065,-.34,'Parede_traseira_inteira'));
 // Entrada lateral do plenum, aberta no corte, com parede e colar próprios.
 const leftPoints=[[-.25,.07],[1.56,.07],[1.56,.67],[1.08,.67]];for(let j=0;j<=48;j++){const a=j*Math.PI/48;leftPoints.push([.65+.43*Math.cos(a),.67-.43*Math.sin(a)])}leftPoints.push([-.25,.67]);
 function leftWall(shape,name){const o=plate(shape,.07,0,name,shell);o.position.set(-2.73,0,0);o.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(V(0,0,1),V(0,1,0),V(-1,0,0)));return o}
 cutOnly.push(leftWall(polygon(leftPoints),'Entrada_parede_em_corte'));
 const leftFull=polygon([[-.25,.07],[1.56,.07],[1.56,1.12],[-.25,1.12]]),inletHole=new T.Path();inletHole.absellipse(.65,.67,.43,.43,0,Math.PI*2,true);leftFull.holes.push(inletHole);fullOnly.push(leftWall(leftFull,'Entrada_parede_inteira'));
 const inletCurve=new T.LineCurve3(V(-3.36,.67,.65),V(-2.71,.67,.65));hollow(inletCurve,.485,.43,Math.PI,Math.PI*2,'Entrada_lateral_inferior',root);hollow(inletCurve,.485,.43,0,Math.PI,'Entrada_lateral_superior',upper);
 // Flange de fixação com passagens e furos reais, sem discos pintados simulando abertura.
 const flange=new T.Shape();flange.moveTo(-2.9,.50);flange.lineTo(2.9,.50);flange.lineTo(2.9,1.80);flange.lineTo(-2.9,1.80);flange.closePath();
 for(const x of xs){const hole=new T.Path();hole.absellipse(x,1.12,innerRadius,innerRadius,0,Math.PI*2,true);flange.holes.push(hole)}
 for(const [x,y]of [[-2.63,.69],[-2.63,1.61],[2.63,.69],[2.63,1.61],...xs.map(x=>[x,1.66])]){const hole=new T.Path();hole.absellipse(x,y,.065,.065,0,Math.PI*2,true);flange.holes.push(hole)}
 plate(flange,.14,-3.26,'Flange_de_fixacao_com_furos');
 for(let i=0;i<4;i++){const ring=mesh(new T.TorusGeometry(.353,.027,8,56),flangeMaterial,'Assento_duto_'+(i+1));ring.position.set(xs[i],1.12,-3.10)}
 // Superfícies moldadas lisas: os campos estão fisicamente vazios, sem códigos fictícios.
 const marking=new T.Group();marking.name='Superficies_de_marcacao_sem_gravacao';root.add(marking);
 const highlight=new T.Group();highlight.name='Destaques_didaticos_das_marcacoes';root.add(highlight);
 const padMaterial=new T.MeshStandardMaterial({color:'#455560',roughness:.65,metalness:.06});
 for(const [i,name]of ['Data_de_injecao','Numero_do_componente','Numero_da_cavidade'].entries()){
  const geometry=new T.BoxGeometry(.57,.19,.055),pad=mesh(geometry,padMaterial,name+'_ausente',marking);pad.position.set(-.93+i*.66,.31,1.80);pad.userData.gravacao=null;
  const line=new T.LineSegments(new T.EdgesGeometry(geometry),new T.LineBasicMaterial({color:'#d48a20',transparent:true,opacity:.95}));line.position.copy(pad.position);line.name='Contorno_'+name;highlight.add(line);
 }
 function corte(active=false){upper.visible=!active;cutOnly.forEach(o=>o.visible=active);fullOnly.forEach(o=>o.visible=!active);root.userData.corte=active}
 root.userData={tipo:'Reconstrução didática de coletor K24',referencia:'K24 Intake Manifold - EP6 YOUTUBE',espessuraRelativa:espessura,dutos:4};corte(false);
 return{root,upper,runners,corte,alvoMarcacoes:V(-.27,.31,1.84),exportar(cut=false){const r=root.clone(true);r.position.set(0,0,0);r.quaternion.identity();r.getObjectByName('Destaques_didaticos_das_marcacoes')?.removeFromParent();r.getObjectByName('Metade_superior').visible=!cut;for(const o of cutOnly)r.getObjectByName(o.name).visible=cut;for(const o of fullOnly)r.getObjectByName(o.name).visible=!cut;r.userData.corte=cut;return r}};
}
