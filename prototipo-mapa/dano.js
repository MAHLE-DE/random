// Deformação visual original em coordenadas do carro; não representa um ensaio estrutural.
function criarCarroAmassado(T,original){
 const root=original.clone(true);root.name='Carro_com_amassamento_frontal';
 root.position.set(0,0,0);root.quaternion.identity();root.scale.set(1,1,1);root.updateMatrixWorld(true);
 const meshes=[];
 root.traverse(o=>{
  if(!o.isMesh)return;
  o.geometry=o.geometry.clone();o.material=o.material.clone();
  const geometry=o.geometry,source=geometry.getAttribute('position'),target=source.clone();
  const inverse=o.matrixWorld.clone().invert();let wheel=false,preserve=false,hood=false,part=o;
  while(part&&part!==root){if(/Roda_|Manga_/.test(part.name))wheel=true;if(/no_capo/.test(part.name))hood=true;if(/Cabine|Vidro|Para_brisa|Logotipo|Marca_MAHLE|Retrovisor/.test(part.name))preserve=true;part=part.parent}
  if(hood)preserve=false;
  const v=new T.Vector3();
  for(let i=0;i<source.count;i++){
   v.fromBufferAttribute(source,i).applyMatrix4(o.matrixWorld);
   const x=v.x,y=v.y,z=v.z,w=T.MathUtils.smoothstep(x,.32,1.72);
   if(wheel){if(x>.45){v.x-=.30;v.y+=.025}}
   else if(x>.32&&!preserve){
    const center=Math.exp(-(z*z)/.20);
    v.x=.32+(x-.32)*.36-.20*center*w;
    const hood=T.MathUtils.smoothstep(y,.40,.85)*(1-T.MathUtils.smoothstep(y,1.10,1.65));
    v.y+=hood*(.16+.26*Math.sin((x-.32)*4.8))*w;
    // Laterais mantidas no seu plano para preservar vidros, portas e marca legíveis.
    if(y>1.1){v.y-=.09*w;v.x-=.045*w}
   }
   v.applyMatrix4(inverse);target.setXYZ(i,v.x,v.y,v.z);
  }
  geometry.morphAttributes.position=[target];geometry.morphTargetsRelative=false;o.updateMorphTargets();o.morphTargetInfluences[0]=0;
  meshes.push(o);
 });
 root.userData.tipo='Representação didática de impacto frontal';
 return{root,aplicar(amount){for(const m of meshes)m.morphTargetInfluences[0]=amount},
  exportar(){
   const baked=root.clone(true);baked.visible=true;baked.position.set(0,0,0);baked.quaternion.identity();
   baked.getObjectByName('Fogo_pos_impacto')?.removeFromParent();
   baked.traverse(o=>{if(!o.isMesh)return;o.geometry=o.geometry.clone();o.geometry.setAttribute('position',o.geometry.morphAttributes.position[0].clone());o.geometry.morphAttributes={};o.morphTargetInfluences=[];o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere()});
   return baked;
  }};
}
