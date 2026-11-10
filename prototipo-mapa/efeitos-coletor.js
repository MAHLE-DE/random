// Efeitos didáticos presos à superfície do coletor. Textura e ilustrações são próprias.
function criarEfeitosColetor(T,model){
 const root=model.root,mode={value:0},meshes=[];root.updateMatrixWorld(true);const inverse=new T.Matrix4().copy(root.matrixWorld).invert();
 root.traverse(o=>{if(o.isMesh&&o.material.isMeshPhysicalMaterial)meshes.push(o)});
 const skin=meshes[0].material.clone(),baseColor=skin.color.clone(),canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d'),data=ctx.createImageData(256,256);let seed=71;
 for(let i=0;i<256*256;i++){seed=(seed*1664525+1013904223)>>>0;const x=(i%256)>>3,y=Math.floor(i/256)>>3,coarse=((Math.imul(x+83,374761393)^Math.imul(y+19,668265263))>>>16)&255,tone=40+coarse*.64+(seed>>>24)*.13;data.data.set([tone,tone,tone,255],i*4)}ctx.putImageData(data,0,0);
 const grain=new T.CanvasTexture(canvas);grain.wrapS=grain.wrapT=T.RepeatWrapping;skin.bumpMap=grain;skin.bumpScale=0;
 for(const o of meshes){o.material=skin;const position=o.geometry.getAttribute('position'),matrix=new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld),coords=[],uv=[];for(let i=0;i<position.count;i++){const p=new T.Vector3().fromBufferAttribute(position,i).applyMatrix4(matrix);coords.push(p.x,p.y,p.z);uv.push(p.x*.8+p.z*.23,p.y*1.8+p.z*.9)}o.geometry.setAttribute('surfaceLocal',new T.Float32BufferAttribute(coords,3));o.geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2))}
 skin.onBeforeCompile=shader=>{shader.uniforms.effectKind=mode;shader.vertexShader='attribute vec3 surfaceLocal; varying vec3 effectPosition;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\neffectPosition=surfaceLocal;');shader.fragmentShader='uniform float effectKind; varying vec3 effectPosition;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 if(effectKind>0.5&&effectKind<1.5){
  vec3 p=effectPosition;float front=smoothstep(1.35,1.60,p.z);
  float stain=1.0-smoothstep(0.30,0.68,length((p.xy-vec2(-1.1,0.54))*vec2(1.35,2.9))+0.06*sin(p.x*37.0+p.y*23.0));
  float mark=(1.0-smoothstep(0.018,0.035,abs(p.y-0.58-0.048*sin(p.x*8.0))))*smoothstep(0.2,0.4,p.x)*(1.0-smoothstep(1.8,2.2,p.x));
  float variation=(1.0-smoothstep(0.25,0.60,length((p.xy-vec2(0.35,0.36))*vec2(1.7,4.3))));
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.28,0.21,0.13),front*stain*0.8);
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.48,0.53,0.56),front*mark*0.65);
  diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.12,0.19,0.24),front*variation*0.6);
 }
`)};
 const rim=root.getObjectByName('Plenum_borda_inferior'),edges=new T.LineSegments(new T.EdgesGeometry(rim.geometry,30),new T.LineBasicMaterial({color:'#b77d24'}));edges.name='Cantos_destacados_para_o_toque';root.add(edges);
 // Relevo externo irregular, com bordas que se encontram com a parede real.
 const wall=root.getObjectByName('Plenum_parede_externa_inferior').geometry.getAttribute('position'),front=new Map();
 for(let i=0;i<wall.count;i++){const x=wall.getX(i),z=wall.getZ(i);if(z>1.1)front.set(x,Math.max(front.get(x)??-Infinity,z))}
 const outline=[...front].sort((a,b)=>a[0]-b[0]),surfaceZ=x=>{for(let i=1;i<outline.length;i++){const a=outline[i-1],b=outline[i];if(x>=a[0]&&x<=b[0])return T.MathUtils.lerp(a[1],b[1],(x-a[0])/(b[0]-a[0]))}return 1.8};
 const patchGeo=new T.PlaneGeometry(3.5,.39,54,12),pos=patchGeo.getAttribute('position'),colors=[];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i)+.39,u=Math.abs(x)/1.75,v=Math.abs(y-.39)/.195,edge=Math.max(0,1-u**6)*Math.max(0,1-v**6),noise=(Math.sin(i*73.31)*43758.54)%1,h=Math.abs(noise),c=new T.Color('#47575e').lerp(new T.Color('#a8ada5'),h*.82);pos.setXYZ(i,x,y,surfaceZ(x)+.003+edge*(.012+h*.065));colors.push(c.r,c.g,c.b)}
 patchGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));patchGeo.computeVertexNormals();const patch=new T.Mesh(patchGeo,new T.MeshStandardMaterial({vertexColors:true,roughness:.98,flatShading:true,side:T.DoubleSide}));patch.name='Relevo_didatico_de_alta_rugosidade';root.add(patch);
 const marking=root.getObjectByName('Superficies_de_marcacao_sem_gravacao'),highlight=root.getObjectByName('Destaques_didaticos_das_marcacoes');
 function set(index){mode.value=index;marking.visible=highlight.visible=index===0;edges.visible=patch.visible=index===2;skin.color.copy(index===2?new T.Color('#6b7477'):baseColor);skin.roughness=index===2?.96:.36;skin.bumpScale=index===2?.095:0;skin.clearcoat=index===2?0:.20;skin.emissive.set(index===3?'#123d6e':'#000000');skin.emissiveIntensity=index===3?.22:0}
 set(0);return{set,nomes:['marcacoes','aparencia','tatil','ruido']};
}
