// Volumes conservadores por faixa de altura: protegem carro e marcador sem
// tratar o espaço vazio sob a copa como se fosse uma parede de folhas.
function criarVisibilidadeMapa(T,{vegetation,forestPoints,carCorners,labels,stops,orient,crashQuaternion,tree,wreckPosition}){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),corners=b=>{const p=[];for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])p.push(V(x,y,z));return p};
 const bands=vegetation.variants.map(v=>{const parts=[];for(const [g,folhas]of [[v.wood,false],[v.leaves,true]])if(g){const rows=new Map(),p=g.getAttribute('position');for(let i=0;i<p.count;i+=3){const tri=[0,1,2].map(j=>V().fromBufferAttribute(p,i+j)),lo=Math.floor(Math.min(...tri.map(p=>p.y))/1.2),hi=Math.floor(Math.max(...tri.map(p=>p.y))/1.2);for(let k=lo;k<=hi;k++){if(!rows.has(k))rows.set(k,new T.Box3());for(const a of tri)rows.get(k).expandByPoint(a)}}for(const b of rows.values())parts.push({box:b.expandByScalar(.13),folhas})}return parts});
 const temp=V();let camera;
 function project(points){const r={x0:Infinity,x1:-Infinity,y0:Infinity,y1:-Infinity,d0:Infinity,d1:-Infinity};for(const p of points){temp.copy(p).applyMatrix4(camera.matrixWorldInverse);const d=-temp.z;r.d0=Math.min(r.d0,d);r.d1=Math.max(r.d1,d);temp.applyMatrix4(camera.projectionMatrix);r.x0=Math.min(r.x0,temp.x);r.x1=Math.max(r.x1,temp.x);r.y0=Math.min(r.y0,temp.y);r.y1=Math.max(r.y1,temp.y)}if(r.d1<camera.near)return null;if(r.d0<camera.near){r.x0=r.y0=-100;r.x1=r.y1=100}return r}
 function overlap(a,b){return a&&b&&a.d0<b.d1+.05&&a.x0<b.x1+.012&&a.x1>b.x0-.012&&a.y0<b.y1+.012&&a.y1>b.y0-.012}
 function worldParts(t){if(!t.visionParts){const all=new T.Box3();t.visionParts=bands[t.variant].map(({box,folhas})=>{const b=box.clone().applyMatrix4(t.matrix);all.union(b);return{points:corners(b),folhas}});t.visionBounds=corners(all)}return t.visionParts}
 tree.updateMatrixWorld(true);const impact={variant:12,matrix:tree.matrixWorld.clone()};
 function targets(p,i,crash){const matrix=new T.Matrix4().compose(p.clone().add(V(0,-.06,0)),crash?crashQuaternion():orient(stops[i]),V(1,1,1)),car=project(carCorners.map(c=>c.clone().applyMatrix4(matrix))),m=labels[i].base.position,b=new T.Box3(V(m.x-2.55,m.y-.1,m.z-2.55),V(m.x+2.55,m.y+.3,m.z+2.55));return{car,numero:project(corners(b))}}
 function audit(pose,i,{crash=false,nearby=forestPoints,targetPoint=null}={}){
  camera=pose.camera;const p=targetPoint||(crash?wreckPosition.clone().add(V(0,.06,0)):pose.point),rect=targets(p,i,crash),blockers=[];let car=0,numero=0;
  for(const t of nearby){if(t.reserved)continue;worldParts(t);const broad=project(t.visionBounds);if(!overlap(broad,rect.car)&&!overlap(broad,rect.numero))continue;let c=false,n=false;for(const part of t.visionParts){const r=project(part.points);c||=overlap(r,rect.car);n||=overlap(r,rect.numero)}if(c||n){blockers.push(t);if(c)car++;if(n)numero++}}
  let fixed=0;for(const part of worldParts(impact)){if(crash&&!part.folhas)continue;const r=project(part.points);if(overlap(r,rect.car)||overlap(r,rect.numero))fixed++}
  const inside=r=>r&&r.x0>-.94&&r.x1<.94&&r.y0>-.78&&r.y1<.88;
  return{blockers,car,numero,fixed,inside:inside(rect.car)&&inside(rect.numero),rect};
 }
 function nearby(p){return forestPoints.filter(t=>!t.reserved&&Math.hypot(t.p.x-p.x,t.p.z-p.z)<78)}
 return{audit,nearby};
}
