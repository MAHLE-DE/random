// Streamlines ilustrativas, sem resultados CFD ou valores de vazão/desempenho.
function criarCenaDistribuicao(T,model,host,id,stage){
 if(id!=='distribuicao')return null;
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x)},streams=[],textures=new Set(),xs=[-1.8,-.6,.6,1.8];
 const charts=document.getElementById('fluxo-paineis'),bar4=document.getElementById('fluxo-r4'),performance=document.getElementById('fluxo-desempenho'),viewport=document.getElementById('coletor-viewport');
 const clock={value:0},progress={value:0};let elapsed=0,reserve=0,sideLayout=true;
 function mesh(geometry,material,p=V(),parent=host,name=''){const m=new T.Mesh(geometry,material);m.position.copy(p);m.name=name;parent.add(m);return m}
 const vertex=`varying vec2 flowUV;void main(){flowUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
 const fragment=`uniform float clock,strength,weight,rate,pitch,offset;uniform vec3 blue,cyan;varying vec2 flowUV;
  void main(){float p=fract(flowUV.x*pitch-clock*rate+offset),span=.31*(.55+.45*strength);if(p>span)discard;
   float head=1.-p/span,edge=sin(3.14159265*clamp(p/span,0.,1.));vec3 col=mix(blue,cyan,pow(head,2.));
   float alpha=pow(edge,.55)*weight*(.55+.45*strength);gl_FragColor=vec4(col,alpha);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
  }`;
 for(let i=0;i<4;i++)for(let j=0;j<6;j++){
  const angle=j*Math.PI/3+.2,dx=Math.cos(angle)*.145,dy=Math.sin(angle)*.125,dz=Math.cos(angle)*.14,x=xs[i];
  const points=[V(-3.47,.67+dy,.65+dz),V(-2.85,.67+dy,.65+dz),V(Math.min(x-.65,-1.9),.66+dy,.57+dz),V(x-.28,.67+dy,.34+dz),V(x+dx,.67+dy,-.30),V(x+dx,.74+dy,-1.12),V(x+dx,.96+dy,-2.12),V(x+dx,1.12+dy,-3.13)];
  const curve=new T.CatmullRomCurve3(points,false,'centripetal'),geometry=new T.TubeGeometry(curve,128,.018,7,false),uniforms={clock,strength:{value:1},weight:{value:.94},rate:{value:1.05},pitch:{value:curve.getLength()/1.02},offset:{value:j*.157+i*.19},blue:{value:new T.Color('#0866b2')},cyan:{value:new T.Color('#50c6ef')}};
  const material=new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,depthTest:true,side:T.DoubleSide});
  const path=mesh(geometry,material,V(),host,`Streamline_R${i+1}_${j+1}`);path.renderOrder=4;streams.push({path,curve,uniforms,runner:i,lane:j});
 }
 function runnerTag(i){const c=document.createElement('canvas');c.width=160;c.height=92;const ctx=c.getContext('2d');ctx.fillStyle=i===3&&stage===1?'#ae3b2c':'#075799';ctx.beginPath();ctx.roundRect(3,3,154,86,24);ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=6;ctx.stroke();ctx.font='bold 53px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='white';ctx.fillText('R'+(i+1),80,49);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;textures.add(texture);const o=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false}));o.position.set(xs[i],1.17,-3.50);o.scale.set(.45,.26,1);o.renderOrder=10;host.add(o)}
 xs.forEach((_,i)=>runnerTag(i));
 // Corte transversal perpendicular à tangente do quarto runner, dentro do raio útil.
 const runner4=new T.CatmullRomCurve3([V(1.8,.67,-.28),V(1.8,.68,-.65),V(1.8,.84,-1.65),V(1.8,1.10,-2.70),V(1.8,1.12,-3.12)]),section=new T.Group(),point=runner4.getPointAt(.59),normal=runner4.getTangentAt(.59).normalize();section.name='Secao_transversal_runner_4';section.position.copy(point);section.quaternion.setFromUnitVectors(V(0,0,1),normal);host.add(section);
 const ringMaterial=new T.MeshBasicMaterial({color:'#df3c2f',transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide}),diskMaterial=new T.MeshBasicMaterial({color:'#ee4935',transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide});
 const ring=mesh(new T.RingGeometry(.278,.317,64),ringMaterial,V(),section,'Contorno_do_deficit'),disk=mesh(new T.CircleGeometry(.277,64),diskMaterial,V(),section,'Deficit_de_ar_ilustrativo');ring.renderOrder=disk.renderOrder=5;
 const spokes=[];for(let i=0;i<4;i++){const a=i*Math.PI/4,points=[V(Math.cos(a)*-.27,Math.sin(a)*-.27,.003),V(Math.cos(a)*.27,Math.sin(a)*.27,.003)],g=new T.BufferGeometry().setFromPoints(points),line=new T.Line(g,new T.LineBasicMaterial({color:'#c12e25',transparent:true,opacity:0,depthWrite:false}));section.add(line);spokes.push(line)}
 const targets=[[-3.32,.67,.65],point.toArray(),[-.6,1.17,-3.48]];
 // Limites fixos: a pulsação vermelha e o percurso dos traços não movem a câmera.
 function bounds(){model.root.updateWorldMatrix(true,true);return new T.Box3(V(-3.55,-.02,-3.7),V(2.97,1.83,1.95)).applyMatrix4(model.root.matrixWorld)}
 const framing=[];for(const s of streams)for(let j=0;j<=16;j++)framing.push(s.curve.getPoint(j/16));for(const x of xs)for(const dx of [-.23,.23])for(const dy of [-.14,.14])for(const dz of [-.12,.12])framing.push(V(x+dx,1.17+dy,-3.5+dz));
 function framingPoints(){model.root.updateWorldMatrix(true,true);return framing.map(p=>model.root.localToWorld(p.clone()))}
 function update(t){elapsed=t;clock.value=t;const q=stage===1?smooth(t/1.8):0;progress.value=q;
  for(const s of streams){const affected=s.runner===3;s.uniforms.strength.value=affected?1-.68*q:1;s.uniforms.rate.value=affected?1.05*(1-.64*q):1.05;s.uniforms.weight.value=affected&&s.lane>=2?.94*(1-q):.94;s.path.visible=s.uniforms.weight.value>.001;if(affected){s.uniforms.blue.value.set('#0866b2').lerp(new T.Color('#ac6d27'),q*.72);s.uniforms.cyan.value.set('#50c6ef').lerp(new T.Color('#e2aa55'),q*.65)}}
  const pulse=.5+.5*Math.sin(t*5.2);section.visible=q>0;ring.scale.setScalar(1+.055*pulse);ringMaterial.opacity=q*(.58+.4*pulse);diskMaterial.opacity=q*(.12+.19*pulse);spokes.forEach(l=>l.material.opacity=q*(.25+.35*pulse));
  sideLayout=viewport.clientWidth/viewport.clientHeight>1.45;charts.classList.toggle('bottom-layout',!sideLayout);charts.classList.toggle('hidden',q===0);charts.style.opacity=q;charts.style.transform=sideLayout?`translate(${(1-q)*8}px,-50%)`:`translateY(${(1-q)*8}px)`;bar4.style.transform=`scaleY(${1-.68*q})`;performance.style.opacity=q;
  const h=Math.min(106,viewport.clientHeight*.26),w=Math.min(186,viewport.clientWidth*.28);charts.style.setProperty('--air-chart-height',h+'px');charts.style.width=sideLayout?w+'px':'auto';reserve=q*(sideLayout?w+24:h+22);
  return true;
 }
 const presentation={direction:[-.48,1.12,1.24],zoom:1.16,large:true};update(0);
 return{presentation,animated:true,update,bounds,framingPoints,targets:()=>targets,insets:()=>sideLayout?{right:reserve}:{bottom:reserve},info:()=>({id,stage,didatico:true,streamlines:streams.length,segmentosCurtos:true,progresso:progress.value,fluxoRelativo:xs.map((_,i)=>i===3?1-.68*progress.value:1),linhasAtivas:xs.map((_,i)=>streams.filter(s=>s.runner===i&&s.path.visible).length),velocidades:xs.map((_,i)=>i===3?1.05*(1-.64*progress.value):1.05),secao:{runner:4,posicao:section.position.toArray(),normal:normal.toArray(),visivel:section.visible,opacidade:diskMaterial.opacity,escala:ring.scale.x},graficosVisiveis:progress.value>0,margemGraficos:reserve,posicaoGraficos:sideLayout?'lateral':'inferior',tempo:elapsed}),dispose:()=>{charts.classList.add('hidden');textures.forEach(t=>t.dispose())}};
}
