// Efeitos didáticos presos à superfície do coletor. Textura e ilustrações são próprias.
function criarEfeitosColetor(T,model){
 const root=model.root,mode={value:0},meshes=[];root.updateMatrixWorld(true);const inverse=new T.Matrix4().copy(root.matrixWorld).invert();
 root.traverse(o=>{if(o.isMesh&&o.material.isMeshPhysicalMaterial)meshes.push(o)});
 const skin=meshes[0].material.clone(),baseColor=skin.color.clone(),canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d'),data=ctx.createImageData(256,256);let seed=71;
 for(let i=0;i<256*256;i++){seed=(seed*1664525+1013904223)>>>0;const x=(i%256)>>3,y=Math.floor(i/256)>>3,coarse=((Math.imul(x+83,374761393)^Math.imul(y+19,668265263))>>>16)&255,tone=40+coarse*.64+(seed>>>24)*.13;data.data.set([tone,tone,tone,255],i*4)}ctx.putImageData(data,0,0);
 const grain=new T.CanvasTexture(canvas);grain.wrapS=grain.wrapT=T.RepeatWrapping;skin.bumpMap=grain;skin.bumpScale=0;
 for(const o of meshes){o.material=skin;const position=o.geometry.getAttribute('position'),matrix=new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld),coords=[],uv=[];for(let i=0;i<position.count;i++){const p=new T.Vector3().fromBufferAttribute(position,i).applyMatrix4(matrix);coords.push(p.x,p.y,p.z);uv.push(p.x*.8+p.z*.23,p.y*1.8+p.z*.9)}o.geometry.setAttribute('surfaceLocal',new T.Float32BufferAttribute(coords,3));o.geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2))}
 skin.onBeforeCompile=shader=>{shader.uniforms.effectKind=mode;shader.vertexShader='attribute vec3 surfaceLocal; varying vec3 effectPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\neffectPosition=surfaceLocal;');shader.fragmentShader=`uniform float effectKind; varying vec3 effectPosition;
 float appearanceHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float appearanceNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(appearanceHash(i),appearanceHash(i+vec2(1,0)),f.x),mix(appearanceHash(i+vec2(0,1)),appearanceHash(i+vec2(1,1)),f.x),f.y);}
 `+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 if(effectKind>0.5&&effectKind<1.5){
  vec3 p=effectPosition;
  // 1. Nuvens orgânicas de pigmentação, restritas à lateral esquerda.
  float front=smoothstep(1.60,1.76,p.z)*(1.0-smoothstep(1.08,1.14,p.y));
  vec2 stainUV=(p.xy-vec2(-1.50,0.56))*vec2(1.25,3.5);
  float noise=appearanceNoise(p.xy*11.0),edgeNoise=appearanceNoise(p.xy*7.0)*0.19;
  float stain=(1.0-smoothstep(0.46,0.86,length(stainUV)+edgeNoise))*front;
  float islands=(1.0-smoothstep(0.14,0.29,length((p.xy-vec2(-0.76,0.40))*vec2(1.2,3.5))))*front;
  vec3 stainColor=mix(vec3(0.10,0.085,0.07),vec3(0.22,0.18,0.14),noise);
  diffuseColor.rgb=mix(diffuseColor.rgb,stainColor,stain*(0.62+0.18*noise)+islands*0.30);
  // 2. Quatro frentes curvas de escoamento do polímero, somente no topo central.
  float top=smoothstep(1.15,1.18,p.y);
  float extent=smoothstep(-1.35,-1.04,p.x)*(1.0-smoothstep(0.30,0.55,p.x));
  float wave=p.z-0.14*sin((p.x+0.4)*2.4)-0.025*sin(p.x*6.0);
  float bands=exp(-pow((wave-0.22)/0.016,2.0))+0.85*exp(-pow((wave-0.43)/0.020,2.0))+0.70*exp(-pow((wave-0.65)/0.024,2.0))+0.55*exp(-pow((wave-0.87)/0.027,2.0));
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.12,0.15,0.17),top*extent*min(bands,1.0)*0.56);
  // 3. Uma faixa ampla de tonalidade uniforme, sem textura de mancha.
  float toneArea=smoothstep(0.68,1.30,p.x)*smoothstep(-0.34,-0.28,p.z)*top;
  vec3 tone=mix(vec3(0.048,0.064,0.079),vec3(0.084,0.107,0.128),smoothstep(0.9,2.4,p.x));
  diffuseColor.rgb=mix(diffuseColor.rgb,tone,toneArea*0.88);
 }
`)};
 // Exemplos táteis reais e separados da lateral rugosa: um ressalto no topo
 // e o canto superior direito da flange, com contorno nas duas faces.
 const V=(x,y,z)=>new T.Vector3(x,y,z),seam=new T.Group(),corner=new T.Group();
 seam.name='Linha_de_particao_no_topo';corner.name='Canto_vivo_da_flange';model.upper.add(seam);root.add(corner);
 function raisedLine(points,radius,color,parent){const path=new T.CurvePath();for(let i=1;i<points.length;i++)path.add(new T.LineCurve3(points[i-1],points[i]));const m=new T.Mesh(new T.TubeGeometry(path,32,radius,8,false),new T.MeshStandardMaterial({color,roughness:.66,metalness:.12}));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 raisedLine([V(-1.95,1.208,.638),V(.30,1.208,.638)],.015,'#36434c',seam);
 raisedLine([V(-1.95,1.216,.60),V(.30,1.216,.60)],.018,'#c6a36c',seam);
 for(const z of [-3.095,-3.28])raisedLine([V(2.43,1.80,z),V(2.90,1.80,z),V(2.90,1.34,z)],.022,'#d8a542',corner);
 const seamTarget=V(-.75,1.234,.60),cornerTarget=V(2.90,1.80,-3.095);
 // Relevo externo irregular, com bordas que se encontram com a parede real.
 const wall=root.getObjectByName('Plenum_parede_externa_inferior').geometry.getAttribute('position'),front=new Map();
 for(let i=0;i<wall.count;i++){const x=wall.getX(i),z=wall.getZ(i);if(z>1.1)front.set(x,Math.max(front.get(x)??-Infinity,z))}
 const outline=[...front].sort((a,b)=>a[0]-b[0]),surfaceZ=x=>{for(let i=1;i<outline.length;i++){const a=outline[i-1],b=outline[i];if(x>=a[0]&&x<=b[0])return T.MathUtils.lerp(a[1],b[1],(x-a[0])/(b[0]-a[0]))}return 1.8};
 function roughPatch(y0,y1,parent){const g=new T.PlaneGeometry(5.42,y1-y0,100,16),pos=g.getAttribute('position'),colors=[];
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i)+(y0+y1)/2,u=Math.abs(x)/2.71,v=Math.abs(y-.59)/.51,edge=Math.max(0,1-u**12)*Math.max(0,1-v**12),noise=(Math.sin(x*127.1+y*311.7)*43758.54)%1,h=Math.abs(noise),c=new T.Color('#47575e').lerp(new T.Color('#a8ada5'),h*.82);pos.setXYZ(i,x,y,surfaceZ(x)+.003+edge*(.012+h*.045));colors.push(c.r,c.g,c.b)}
  g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.computeVertexNormals();const o=new T.Mesh(g,new T.MeshStandardMaterial({vertexColors:true,roughness:.98,flatShading:true,side:T.DoubleSide}));o.name='Relevo_didatico_de_alta_rugosidade';parent.add(o);return o}
 const patch=roughPatch(.08,.67,root),patchUpper=roughPatch(.67,1.1,model.upper);
 const marking=root.getObjectByName('Superficies_de_marcacao_sem_gravacao'),highlight=root.getObjectByName('Destaques_didaticos_das_marcacoes');
 const labels=[];
 for(const [i,label]of ['DATA','PEÇA','CAV.'].entries()){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=40;const ctx=canvas.getContext('2d');ctx.fillStyle='#c8d3da';ctx.font='bold 25px Arial';ctx.textAlign='center';ctx.fillText(label,64,29);const o=new T.Mesh(new T.PlaneGeometry(.52,.16),new T.MeshBasicMaterial({map:new T.CanvasTexture(canvas),transparent:true,side:T.DoubleSide}));o.position.set(-.93+i*.66,.31,1.834);root.add(o);labels.push(o)}
 function set(id,stage=0){const enabled=stage>0||['aparencia','tatil','ruido'].includes(id),index=enabled?['identificacao','aparencia','tatil','ruido'].indexOf(id):0;mode.value=index;marking.visible=highlight.visible=id==='identificacao'||id==='rastreabilidade';labels.forEach(o=>o.visible=id==='identificacao'&&stage===0);seam.visible=corner.visible=patch.visible=patchUpper.visible=id==='tatil'&&enabled;skin.color.copy(id==='tatil'&&enabled?new T.Color('#6b7477'):baseColor);skin.roughness=id==='tatil'&&enabled?.96:id==='aparencia'?.50:.36;skin.bumpScale=id==='tatil'&&enabled?.105:0;skin.clearcoat=id==='tatil'&&enabled?0:.20;skin.emissive.set(id==='ruido'&&enabled?'#123d6e':'#000000');skin.emissiveIntensity=id==='ruido'&&enabled?.22:0}
 function detalhesTateis(){return{linhaParticao:{visivel:seam.visible&&model.upper.visible,alvo:seamTarget.toArray(),malhas:seam.children.length},cantoVivo:{visivel:corner.visible,alvo:cornerTarget.toArray(),malhas:corner.children.length}}}
 set('identificacao',0);return{set,detalhesTateis,nomes:['marcacoes','aparencia','tatil','ruido']};
}
