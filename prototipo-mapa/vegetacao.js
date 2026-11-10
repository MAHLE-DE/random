// Modelos originais, procedurais e reproduzíveis. Geometria compartilhada por instâncias.
function criarBibliotecaFlorestal(T){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),up=V(0,1,0);
 function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}
 const bark=new T.MeshStandardMaterial({vertexColors:true,roughness:.96,flatShading:true});
 const leaves=new T.MeshStandardMaterial({vertexColors:true,roughness:.91,flatShading:true});
 const wind={value:0};
 const windShader=shader=>{shader.uniforms.forestTime=wind;shader.vertexShader='uniform float forestTime;\n'+shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
vec3 windRoot;
#ifdef USE_INSTANCING
windRoot=instanceMatrix[3].xyz;
#else
windRoot=modelMatrix[3].xyz;
#endif
float windWeight=pow(clamp(position.y/9.0,0.0,1.0),2.0);
transformed.x+=sin(forestTime*0.85+windRoot.x*0.13+windRoot.z*0.09)*windWeight*0.065;
transformed.z+=cos(forestTime*0.73+windRoot.z*0.12)*windWeight*0.035;`)};
 leaves.onBeforeCompile=windShader;
 const depth=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking});depth.onBeforeCompile=windShader;
 function merge(parts){const pos=[],normal=[],color=[];for(const {g,m,c}of parts){const geo=g.index?g.toNonIndexed():g.clone();geo.applyMatrix4(m);const p=geo.getAttribute('position'),n=geo.getAttribute('normal');for(let i=0;i<p.count;i++){pos.push(p.getX(i),p.getY(i),p.getZ(i));normal.push(n.getX(i),n.getY(i),n.getZ(i));const shade=.90+.10*Math.sin(p.getY(i)*3.1+p.getX(i)*2.4);color.push(c.r*shade,c.g*shade,c.b*shade)}geo.dispose()}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(normal,3));g.setAttribute('color',new T.Float32BufferAttribute(color,3));g.computeBoundingSphere();return g}
 function matrix(p,scale=V(1,1,1),q=new T.Quaternion()){return new T.Matrix4().compose(p,q,scale)}
 function limb(parts,a,b,r0,r1,c,segments=7){const d=b.clone().sub(a);parts.push({g:new T.CylinderGeometry(r1,r0,d.length(),segments,1,false),m:matrix(a.clone().add(b).multiplyScalar(.5),V(1,1,1),new T.Quaternion().setFromUnitVectors(up,d.normalize())),c})}
 function create(type,seed,lod=false){
  const random=rng(seed),wood=[],foliage=[],height=type==='conifera'?6.8+random()*3.2:6.2+random()*2.4;
  const radius=.27+random()*.18,lean=V((random()-.5)*.45,0,(random()-.5)*.45);
  const brown=new T.Color('#69513b').lerp(new T.Color('#3b3327'),random()*.4);
  const green=new T.Color(type==='conifera'?'#274a37':'#42683a').lerp(new T.Color('#74954a'),random()*.45);
  const trunkPoints=[];for(let j=0;j<=6;j++){const t=j/6;trunkPoints.push(V(lean.x*t*t+Math.sin(t*7+seed)*.055*t,height*t,lean.z*t*t+Math.sin(t*6+seed)*.06*t))}
  for(let j=0;j<6;j++)limb(wood,trunkPoints[j],trunkPoints[j+1],radius*(1-j/6*.87),radius*(1-(j+1)/6*.87),brown,lod?6:9);
  if(!lod)for(let j=0;j<5;j++){const a=j*6.28/5+seed;limb(wood,V(Math.cos(a)*radius*2.3,.015,Math.sin(a)*radius*2.3),V(Math.cos(a)*radius*.6,.55,Math.sin(a)*radius*.6),radius*.36,.06,brown,5)}
  if(type==='conifera'){
   const tiers=lod?4:7,radial=lod?9:15;
   for(let layer=0;layer<tiers;layer++){
    const t=layer/tiers,y=1.45+t*(height-2),width=(2.1+random()*.55)*(1-t*.85),phase=random()*6.28,span=(height-1.4)/tiers*1.65;
    const center=V(lean.x*t+(random()-.5)*.30,y,lean.z*t+(random()-.5)*.28),positions=[],indices=[];
    const rings=[{r:.13,y:-.1},{r:1,y:.12},{r:.72,y:span*.38},{r:.12,y:span}];
    for(let k=0;k<rings.length;k++)for(let j=0;j<radial;j++){
     const a=j/radial*6.28+phase,scallop=1+.13*Math.sin(j*3.7+seed+layer)+.10*(random()-.5),r=rings[k].r*width*scallop;
     positions.push(center.x+Math.cos(a)*r,center.y+rings[k].y+(k===1?-.20*Math.abs(Math.sin(a*4+seed)):0)+(random()-.5)*.11,center.z+Math.sin(a)*r);
    }
    for(let k=0;k<3;k++)for(let j=0;j<radial;j++){const a=k*radial+j,b=k*radial+(j+1)%radial,c=(k+1)*radial+j,d=(k+1)*radial+(j+1)%radial;indices.push(a,c,b,b,c,d)}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();foliage.push({g,m:new T.Matrix4(),c:green.clone().multiplyScalar(.83+random()*.30)});
    if(!lod)for(let branch=0;branch<4;branch++){const a=phase+branch*1.57;limb(wood,center.clone().add(V(0,.17,0)),center.clone().add(V(Math.cos(a)*width*.84,-.10,Math.sin(a)*width*.84)),.065*(1-t*.6),.018,brown,5)}
   }
  }else{
   const branches=lod?4:8;
   for(let j=0;j<branches;j++){
    const a=j*2.39996+seed,y=3.1+random()*2,origin=V(lean.x*y/height,y,lean.z*y/height),end=V(Math.cos(a)*(1.1+random()*1.6),height-1.9+random()*1.0,Math.sin(a)*(1.1+random()*1.5));
    const fork=origin.clone().lerp(end,.60).add(V(0,.15,0));limb(wood,origin,fork,.14,.075,brown,lod?5:8);limb(wood,fork,end,.075,.025,brown,6);
    if(!lod)limb(wood,fork,end.clone().add(V(Math.cos(a+.7)*.65,.45,Math.sin(a+.7)*.65)),.06,.012,brown,6);
    if(type!=='seca'){
     const g=new T.IcosahedronGeometry(1,lod?0:1),p=g.getAttribute('position');for(let k=0;k<p.count;k++){const x=p.getX(k),y=p.getY(k),z=p.getZ(k),f=1+.11*Math.sin(x*7+z*5+seed)+.08*Math.cos(y*9-x*3);p.setXYZ(k,x*f,y*f,z*f)}g.computeVertexNormals();
     foliage.push({g,m:matrix(end,V(1.1+random()*.7,.9+random()*.7,1.0+random()*.6)),c:green.clone().multiplyScalar(.85+random()*.3)});
    }
   }
  }
  return{wood:merge(wood),leaves:foliage.length?merge(foliage):null,height,type,seed};
 }
 const variants=Array.from({length:20},(_,i)=>{const type=i<12?'conifera':i<18?'frondosa':'seca',seed=927+i*173;return{...create(type,seed),low:create(type,seed,true)}});
 function tree(index=12){const v=variants[index],root=new T.Group();root.name='Arvore_'+v.type+'_'+index;for(const [g,m]of [[v.wood,bark],[v.leaves,leaves]])if(g){const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;if(m===leaves)o.customDepthMaterial=depth;root.add(o)}return root}
 return{variants,bark,leaves,depth,wind,tree};
}
