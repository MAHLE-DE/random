// Componentes ferrosos nos furos reais da flange. Evolução visual, sem escala de vida útil.
function criarCenaCorrosao(T,model,host,id,stage){
 if(id!=='quimica')return null;
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x)},textures=new Set(),parts=[],uniform={value:0},duration=4.4;
 const clock=document.getElementById('tempo-exposicao'),status=document.getElementById('tempo-status'),progress=document.getElementById('tempo-barra'),caption=document.getElementById('tempo-legenda');clock.classList.remove('hidden');
 const boreMaterial=new T.MeshStandardMaterial({color:'#263846',metalness:.35,roughness:.63,side:T.DoubleSide});
 function texture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);textures.add(t);return t}
 // Painéis claros e escuros refletem no metal novo como num estúdio, sem rede.
 const studio=texture(512,256,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#c4d7e7');g.addColorStop(.49,'#738e9f');g.addColorStop(.51,'#344655');g.addColorStop(1,'#a4b9c5');c.fillStyle=g;c.fillRect(0,0,w,h);for(const [x,y,ww,hh]of [[35,10,55,210],[235,20,85,190],[415,70,40,160]]){c.fillStyle='#ffffff';c.fillRect(x,y,ww,hh);c.fillStyle='#eff7ff';c.fillRect(x+5,y+4,ww-10,hh-8)}});studio.mapping=T.EquirectangularReflectionMapping;studio.colorSpace=T.SRGBColorSpace;
 const grain=texture(256,256,(c,w,h)=>{const d=c.createImageData(w,h);let seed=913;for(let i=0;i<w*h;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=seed>>>24;d.data.set([v,v,v,255],i*4)}c.putImageData(d,0,0)});grain.wrapS=grain.wrapT=T.RepeatWrapping;
 const metal=new T.MeshPhysicalMaterial({color:'#e6edf2',metalness:1,roughness:.16,clearcoat:.45,clearcoatRoughness:.12,envMap:studio,envMapIntensity:1.15,bumpMap:grain,bumpScale:0,side:T.DoubleSide});
 metal.onBeforeCompile=shader=>{
  shader.uniforms.oxidation=uniform;
  shader.vertexShader='varying vec3 corrosionPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncorrosionPosition=position;');
  shader.fragmentShader=`uniform float oxidation;varying vec3 corrosionPosition;
   float rustHash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
   float rustNoise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(rustHash(i),rustHash(i+vec3(1,0,0)),f.x),mix(rustHash(i+vec3(0,1,0)),rustHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(rustHash(i+vec3(0,0,1)),rustHash(i+vec3(1,0,1)),f.x),mix(rustHash(i+vec3(0,1,1)),rustHash(i+vec3(1,1,1)),f.x),f.y),f.z);}
   float rustMask;\n`+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec3 rp=corrosionPosition*22.;float n=rustNoise(rp)*.65+rustNoise(rp*2.9)*.35;
   rustMask=smoothstep(n-.09,n+.09,oxidation*.94)*smoothstep(0.,.07,oxidation);
   float fine=rustNoise(rp*7.);vec3 oxide=mix(vec3(.038,.008,.003),vec3(.23,.063,.015),n);
   oxide=mix(oxide,vec3(.42,.14,.033),smoothstep(.67,.93,fine)*.48);
   diffuseColor.rgb=mix(diffuseColor.rgb,oxide,rustMask);`)
   .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.94,rustMask);')
   .replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor=mix(metalnessFactor,.06,rustMask);');
 };
 metal.customProgramCacheKey=()=> 'corrosao-ferrosos-v1';
 function mesh(g,p,parent=host,name=''){const o=new T.Mesh(g,metal);o.position.copy(p);o.name=name;o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
 function hollow(outer,inner,depth,z,parent,hex=false){const s=new T.Shape();if(hex){for(let i=0;i<=6;i++){const a=i*Math.PI/3;i?s.lineTo(Math.cos(a)*outer,Math.sin(a)*outer):s.moveTo(outer,0)}}else s.absarc(0,0,outer,0,2*Math.PI,false);const hole=new T.Path();hole.absarc(0,0,inner,0,2*Math.PI,true);s.holes.push(hole);return mesh(new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:.003,bevelSize:.003,bevelSegments:2,curveSegments:56}),V(0,0,z),parent)}
 function part(x,y,kind){const g=new T.Group();g.name=kind==='inserto'?'Inserto_roscado_'+(x<0?'esquerdo':'direito'):'Limitador_'+parts.length;g.position.set(x,y,-3.26);host.add(g);
  hollow(.064,.039,.22,-.10,g);hollow(kind==='inserto'?.138:.108,.039,kind==='inserto'?.055:.035,-.16,g,kind==='inserto');
  const bore=new T.Mesh(new T.CylinderGeometry(.036,.036,.26,40,1,true),boreMaterial);bore.rotation.x=Math.PI/2;bore.position.z=-.018;g.add(bore);
  if(kind==='inserto'){
   const points=[];for(let i=0;i<=240;i++){const a=i/240*Math.PI*2*6;points.push(V(.043*Math.cos(a),.043*Math.sin(a),-.15+i/240*.18))}mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),240,.0035,5,false),V(),g,'Rosca_interna');
   for(let i=0;i<20;i++){const a=i*Math.PI/10,ridge=mesh(new T.CylinderGeometry(.003,.003,.17,5),V(Math.cos(a)*.066,Math.sin(a)*.066,.015),g);ridge.rotation.x=Math.PI/2}
  }else mesh(new T.TorusGeometry(.079,.013,10,48),V(0,0,-.16),g,'Borda_do_limitador');
  parts.push({g,kind});return g;
 }
 const xs=[-1.8,-.6,.6,1.8];for(const x of [-2.63,2.63]){part(x,1.61,'inserto');part(x,.69,'limitador')}for(const x of xs)part(x,1.66,'limitador');
 const highlightMaterial=new T.MeshBasicMaterial({color:'#d59d32',transparent:true,opacity:.8,depthWrite:false}),highlights=[];
 for(const y of [1.61,.69]){const o=new T.Mesh(new T.TorusGeometry(.193,.009,7,64),highlightMaterial);o.position.set(2.63,y,-3.44);host.add(o);highlights.push(o)}
 const targets=[[2.63,1.61,-3.43],[2.63,.69,-3.43],[1.8,1.66,-3.43]];
 const macroBox=new T.Box3(V(2.25,.42,-3.50),V(2.96,1.90,-3.03));
 let elapsed=0,lastKey='';
 function update(t){elapsed=t;const q=stage===0?0:smooth(Math.max(0,t-.55)/3.85);uniform.value=q;metal.bumpScale=q*.0015;metal.clearcoat=.45*(1-q);metal.clearcoatRoughness=.12+q*.7;boreMaterial.color.set(q>.6?'#2a130b':'#263846');highlightMaterial.color.set(q>.6?'#af4c29':'#d59d32');
  const percent=Math.round(q*100),key=percent+':'+(q===1?'final':q===0?'inicio':'evolucao');if(key!==lastKey){lastKey=key;status.textContent=q===0?'TEMPO ZERO · METAL NOVO':q===1?'APÓS EXPOSIÇÃO EM SERVIÇO':'TEMPO EM SERVIÇO → CORROSÃO';caption.textContent=q===0?'Insertos e limitadores íntegros, com acabamento metálico.':q===1?'Ferrugem, perda de brilho e superfície irregular.':'A exposição avança; o metal perde brilho e ganha pontos de ferrugem.';progress.style.transform=`scaleX(${q})`;progress.parentElement.setAttribute('aria-valuenow',percent);clock.classList.toggle('aged',q>.45)}
  return stage===1&&t<duration;
 }
 function closeup(index=-1){model.root.updateWorldMatrix(true,true);let b=macroBox;if(index>=0){const a=V(...targets[index]);b=new T.Box3(a.clone().add(V(-.32,-.35,-.20)),a.clone().add(V(.32,.35,.34)))}const points=[];for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])points.push(model.root.localToWorld(V(x,y,z)));return{amount:stage===1?smooth(elapsed/2.9):0,points}}
 const presentation={direction:[.62,.45,-1.55],fromDirection:[.62,.45,-1.55],duration:stage===1?2.9:0,zoom:stage===1?1.25:1.1,large:true};
 update(0);
 return{presentation,animated:stage===1,update,closeup,targets:()=>targets,bounds:()=>null,info:()=>({id,stage,didatico:true,progressoTempo:uniform.value,corrosao:uniform.value,concluido:stage===0||elapsed>=duration,escalaTemporal:'ilustrativa',insertos:parts.filter(p=>p.kind==='inserto').length,limitadores:parts.filter(p=>p.kind==='limitador').length,pecas:parts.map(p=>({tipo:p.kind,posicao:p.g.position.toArray(),malhas:p.g.children.length})),acabamento:{metalnessNovo:1,roughnessNovo:.16,bumpScale:metal.bumpScale,clearcoat:metal.clearcoat},centroDetalhe:macroBox.getCenter(V()).toArray()}),dispose:()=>{clock.classList.add('hidden');textures.forEach(t=>t.dispose());highlightMaterial.dispose()}};
}
