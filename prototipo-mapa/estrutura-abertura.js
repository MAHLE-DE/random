// Grade isométrica compartilhada. Cada triângulo inicial permanece no mesmo cubo.
function construirEstruturaAbertura(T){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),Q=()=>new T.Quaternion(),key=p=>p.join(','),N=3,side=.5;
 const polygons=[
  ['#7069e6',[[0,-1],[0,-2],[1,-2],[2,-1]]],['#95a3c3',[[0,0],[0,-1],[1,-1],[1,0]]],
  ['#1B267D',[[0,0],[1,0],[2,1],[2,2],[1,2],[1,1]]],['#d3dbe8',[[1,0],[1,-1],[2,-1],[2,0],[2,1]]],
  ['#445292',[[2,2],[2,1],[2,0],[3,1],[3,2]]],['#bfc7d8',[[2,-1],[3,-1],[4,0],[4,1],[3,1],[2,0]]],
  ['#1B267D',[[3,2],[3,1],[4,1],[4,2]]],['#716ae7',[[2,2],[3,2],[4,2],[4,3],[3,3]]],['#95a4c4',[[4,2],[4,1],[5,2],[5,3]]]
 ];
 function inside(p,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
 const tiles=[];for(let j=-3*N;j<4*N;j++)for(let i=-N;i<6*N;i++)for(let type=0;type<2;type++){const u=i/N+(type?1:2)/(3*N),v=j/N+(type?2:1)/(3*N),p=polygons.find(([,poly])=>inside([u,v],poly));if(p)tiles.push({i,j,type,color:p[0]})}
 if(tiles.length!==252)throw Error('A grade deve conter exatamente 252 triângulos');
 const entries=[],bigRolls=[{center:[0,0,3],dirs:[[0,0,-1]]},{center:[3,0,-9],dirs:[[-1,0,0],[0,0,1],[0,0,1]]}],schedule={rollStart:1.8,tick:.045};
 const random=n=>{const x=Math.sin(n*127.1+71.7)*43758.5453123;return x-Math.floor(x)};
 function action(c,dir,kind='flat',perp=null){
  const d=V(...dir),up=V(0,1,0);let pivot=V(...c).addScaledVector(d,.5),axis=up.clone().cross(d),angle=Math.PI/2,delta=d.clone(),ticks=1,support=null;
  if(kind==='flat')pivot.y-=.5;
  if(kind==='up'){pivot.y+=.5;angle=Math.PI;delta.y=1;ticks=2;support=dir}
  if(kind==='down'||kind==='under'){pivot.y-=.5;angle=kind==='under'?-Math.PI:Math.PI;delta.y=-1;ticks=2}
  if(kind==='side'){
   const p=V(...perp);pivot=V(...c).addScaledVector(d,.5).addScaledVector(p,.5);axis=up;const rel=V(...c).sub(pivot),a=rel.clone().applyAxisAngle(axis,Math.PI/2).add(pivot).sub(V(...c));angle=a.distanceTo(d)<.01?Math.PI/2:-Math.PI/2;support=perp;
  }
  return{kind,axis:axis.toArray(),pivot:pivot.toArray(),angle,delta:delta.toArray(),ticks,support};
 }
 const palette=['#435092','#7069e6','#858fc5','#d3dbe8','#323c6c','#95a3c3'];
 for(let b=0;b<2;b++){
  let center=V(...bigRolls[b].center),q=Q();const moves=[];
  for(const dir of bigRolls[b].dirs){const a=action(center.toArray(),dir);a.pivot=V(...a.pivot).sub(center).multiplyScalar(3).add(center).toArray();const r=Q().setFromAxisAngle(V(...a.axis),a.angle);center.sub(V(...a.pivot)).applyQuaternion(r).add(V(...a.pivot));q.premultiply(r);moves.push({...a,end:center.toArray()})}
  bigRolls[b].moves=moves;bigRolls[b].startTime=1.05;bigRolls[b].stepDuration=.23;bigRolls[b].stepInterval=.24;bigRolls[b].endTime=1.05+(moves.length-1)*.24+.23;
  for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){
   const initial=V(...bigRolls[b].center).add(V(x,y,z)),end=V(x,y,z).applyQuaternion(q).add(center);entries.push({id:entries.length,big:b,initial:initial.toArray(),cell:end.toArray().map(Math.round),q:q.toArray(),colors:palette,ready:0,pace:random(entries.length+5)<.16?2:1});
  }
 }
 const byType=[tiles.filter(t=>t.type===0),tiles.filter(t=>t.type===1)],ordered=[];for(let i=0;i<126;i++)ordered.push(byType[0][i],byType[1][i]);
 // Espalhamento determinístico em anel irregular, incluindo três apoios superiores.
 const occupied=new Set(entries.map(e=>key(e.cell))),scatter=[],candidates=[];
 for(let x=-7;x<=7;x++)for(let z=-10;z<=7;z++){const r=Math.hypot(x,(z+1.5)*.85);if(r<2.7||r>7.2||occupied.has(key([x,-1,z]))||(x>=-11&&x<=-4&&z>=4&&z<=7))continue;candidates.push([x,-1,z])}
 candidates.sort((a,b)=>random((a[0]+11)*31+a[2]+27)-random((b[0]+11)*31+b[2]+27));
 for(const c of candidates)if(scatter.every(p=>Math.hypot(c[0]-p[0],c[2]-p[2])>=2.15)){scatter.push(c);if(scatter.length===18)break}
 if(scatter.length!==18)throw Error('Espalhamento insuficiente');scatter.push([-1,2,-3],[1,2,-1],[0,2,1]);
 scatter.sort((a,b)=>random((a[0]+8)*47+(a[2]+12)*3+a[1])-random((b[0]+8)*47+(b[2]+12)*3+b[1]));
 for(let i=0;i<21;i++){const foldStart=.90+random(i+163)*.22,foldEnd=1.68+random(i+271)*.83;entries.push({id:entries.length,big:-1,cell:scatter[i],q:[0,0,0,1],tiles:ordered.slice(i*12,i*12+12),foldStart,foldEnd,ready:Math.max(0,Math.ceil((foldEnd-schedule.rollStart)/schedule.tick)),pace:random(i+97)<.16?2:1})}
 const goals=[];for(const x of[-11,-10,-5,-4])for(const z of[4,7])goals.push([x,-2,z]);for(const x of[-9,-8,-7])goals.push([x,-2,5]);
 for(let x=-11;x<=-4;x++)for(let z=4;z<=7;z++)goals.push([x,-1,z]);
 for(let y=0;y<=1;y++)for(let x=-10;x<=-7;x++)for(let z=4;z<=7;z++)goals.push([x,y,z]);
 // Colisão conservada em coordenadas de grade, incluindo o volume varrido a cada rolamento.
 function touches(a){const axis=V(...a.axis),pivot=V(...a.pivot),plane=[0,1,2].filter(i=>Math.abs(axis.getComponent(i))<.5),result=[];for(let x=-2;x<=2;x++)for(let y=-2;y<=2;y++)for(let z=-2;z<=2;z++){
   const p=V(x,y,z);if(Math.abs(p.dot(axis))>.01)continue;let hit=false;
   for(let s=0;s<=24&&!hit;s++){const q=Q().setFromAxisAngle(axis,a.angle*s/24),c=V().sub(pivot).applyQuaternion(q).add(pivot),u=V().setComponent(plane[0],1).applyQuaternion(q),v=V().setComponent(plane[1],1).applyQuaternion(q),delta=p.clone().sub(c),axes=[V().setComponent(plane[0],1),V().setComponent(plane[1],1),u,v];hit=axes.every(n=>.5*(Math.abs(n.dot(u))+Math.abs(n.dot(v)))+.5*(Math.abs(n.getComponent(plane[0]))+Math.abs(n.getComponent(plane[1])))-Math.abs(delta.dot(n))>1e-5)}
   if(hit)result.push([x,y,z]);
  }return result;
 }
 const dirs=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]],actions=[];for(const dir of dirs){for(const kind of['flat','up','down','under']){const a=action([0,0,0],dir,kind);a.mask=touches(a);actions.push(a)}const p=[-dir[2],0,dir[0]];for(const sign of[-1,1]){const a=action([0,0,0],dir,'side',p.map(n=>n*sign));a.mask=touches(a);actions.push(a)}}
 const reserved=new Map(),plans=[],remaining=new Set(entries.map(e=>e.id));let cache=new Map();
 function occupancy(t){if(cache.has(t))return cache.get(t);const map=new Map();for(const e of entries){const p=e.departure===undefined||t<e.departure?e.cell:t>=e.arrival?e.goal:null;if(p)map.set(key(p),e.id)}for(const [k,id]of reserved.get(t)||[])map.set(k,id);cache.set(t,map);return map}
 class Heap{constructor(){this.a=[]}push(n){const a=this.a;a.push(n);let i=a.length-1;while(i){const p=(i-1)>>1;if(a[p].f<=n.f)break;a[i]=a[p];i=p}a[i]=n}pop(){const a=this.a,n=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let k=i*2+1;if(k+1<a.length&&a[k+1].f<a[k].f)k++;if(a[k].f>=last.f)break;a[i]=a[k];i=k}a[i]=last}return n}}
 const heuristic=(p,g)=>Math.abs(p[0]-g[0])+Math.abs(p[2]-g[2])+Math.abs(p[1]-g[1])*1.8;
 function find(e,goal,start){let safeAfter=-1;for(const [t,cells]of reserved)if(cells.has(key(goal)))safeAfter=Math.max(safeAfter,t);const heap=new Heap(),seen=new Map();heap.push({p:e.cell,t:start,g:0,f:heuristic(e.cell,goal),prev:null,a:null});let loops=0;
  while(heap.a.length&&loops++<220000){const n=heap.pop(),k=key(n.p)+':'+n.t;if(seen.has(k)&&seen.get(k)<n.g-1e-6)continue;if(key(n.p)===key(goal)&&n.t>safeAfter)return n;if(n.t>start+160)continue;
   for(const base of [...actions,{kind:'wait',delta:[0,0,0],ticks:1,mask:[[0,0,0]]}]){const a=base.kind==='wait'||e.pace===1?base:{...base,ticks:base.ticks*e.pace};const p=n.p.map((v,i)=>v+a.delta[i]),t=n.t+a.ticks;if(p[0]<-15||p[0]>15||p[2]<-13||p[2]>23||p[1]<-2||p[1]>2)continue;
    const fixed=occupancy(n.t),get=(v)=>{const id=fixed.get(key(v));return id!==undefined&&id!==e.id};
    if(a.kind==='up'&&!get(n.p.map((v,i)=>v+(i===1?0:a.delta[i]))))continue;
    if(a.kind==='under'&&!get(n.p.map((v,i)=>v+(i===1?0:a.delta[i]))))continue;
    if(a.kind==='side'&&!get(n.p.map((v,i)=>v+a.support[i])))continue;
    if(a.kind==='down'&&n.p[1]===-2)continue;
    let blocked=false;for(let tick=n.t;tick<=t&&!blocked;tick++){const occ=occupancy(tick);for(const d of a.mask){const id=occ.get(key(n.p.map((v,i)=>v+d[i])));if(id!==undefined&&id!==e.id){blocked=true;break}}}if(blocked)continue;
    const cost=n.g+a.ticks+(a.kind==='wait'?.1:a.kind==='side'?-.08:0),sk=key(p)+':'+t;if(seen.has(sk)&&seen.get(sk)<=cost)continue;seen.set(sk,cost);heap.push({p,t,g:cost,f:cost+heuristic(p,goal)*1.2,prev:n,a});
   }
  }return null;
 }
 for(const [order,goal]of goals.entries()){
  const available=[...remaining].map(id=>entries[id]).filter(e=>![...remaining].some(id=>id!==e.id&&entries[id].cell[0]===e.cell[0]&&entries[id].cell[2]===e.cell[2]&&entries[id].cell[1]>e.cell[1]));const release=Math.floor(order*.28);available.sort((a,b)=>(heuristic(a.cell,goal)-a.cell[1]*1.3+Math.max(0,a.ready-release)*.7+random(a.id+order*43)*5.5)-(heuristic(b.cell,goal)-b.cell[1]*1.3+Math.max(0,b.ready-release)*.7+random(b.id+order*43)*5.5));let chosen=null,path=null;
  for(const e of available.slice(0,12)){path=find(e,goal,Math.max(release,e.ready));if(path){chosen=e;break}}if(!chosen)throw Error('Sem percurso de rolamento para '+goal+' (peça '+order+')');
  const chain=[];for(let p=path;p.prev;p=p.prev)chain.push({from:p.prev.p,to:p.p,start:p.prev.t,end:p.t,...p.a});chain.reverse();chosen.departure=Math.max(release,chosen.ready);chosen.arrival=path.t;chosen.goal=goal;chosen.route=chain;remaining.delete(chosen.id);plans.push(chosen.id);
  for(const a of chain)for(let t=a.start;t<=a.end;t++){if(!reserved.has(t))reserved.set(t,new Map());for(const d of a.mask)reserved.get(t).set(key(a.from.map((v,i)=>v+d[i])),chosen.id)}cache=new Map();
 }
 const axes={x:0,y:0,z:0},kinds={};for(const e of entries){let q=new T.Quaternion().fromArray(e.q);for(const a of e.route){a.q=q.toArray();a.pivot=a.pivot?a.pivot.map((v,i)=>v+a.from[i]):a.from;if(a.kind!=='wait'){q.premultiply(Q().setFromAxisAngle(V(...a.axis),a.angle));const axis=['x','y','z'][a.axis.findIndex(n=>Math.abs(n)>.5)];axes[axis]++;kinds[a.kind]=(kinds[a.kind]||0)+1}a.qEnd=q.toArray()}e.finalQ=q.toArray()}
 return{edge:2*81.35/Math.SQRT2,cellSide:side,origin:[-7.5,-2.5,5.5],entries,bigRolls,schedule,scatter,rollTicks:Math.max(...entries.map(e=>e.arrival)),axes,kinds,polygons,triangleCount:252};
}
