// Propriedades observáveis da montagem: área, identidade, trajetos rígidos e colisões.
import fs from'node:fs/promises';import * as T from'../fontes/vendor/three.module.js';
const d=JSON.parse(await fs.readFile('prototipo-mapa/abertura-dados.json','utf8')),V=(...p)=>new T.Vector3(...p),Q=()=>new T.Quaternion(),assert=(v,m)=>{if(!v)throw Error(m)};
assert(d.entries.length===75&&new Set(d.entries.map(e=>e.id)).size===75,'Identidade das 75 peças');const tiles=d.entries.flatMap(e=>e.tiles||[]);assert(tiles.length===252&&new Set(tiles.map(t=>[t.i,t.j,t.type].join(','))).size===252,'Triângulos duplicados ou perdidos');assert(Object.values(d.axes).every(n=>n>0),'Devem existir rolamentos nos três eixos');
assert(d.targetFormat==='semantic-per-entry-v1','Formato de morfagem semântica inesperado');
assert(Number.isInteger(d.sampleCount)&&d.sampleCount>0,'Quantidade de amostras de morfagem inválida');
const sampleValues=Buffer.from(d.sampleValues,'base64');
assert(sampleValues.length===d.sampleCount*9*Float32Array.BYTES_PER_ELEMENT,'Dados de posição, normal ou cor de morfagem incompletos');
for(let i=0;i<sampleValues.length;i+=4)assert(Number.isFinite(sampleValues.readFloatLE(i)),'Amostra de morfagem contém valor não finito');
for(const e of d.entries){
  assert(Array.isArray(e.faceKinds)&&e.faceKinds.length===6&&e.faceKinds.every(kind=>typeof kind==='string'&&kind.length),'Classificação semântica incompleta: '+e.id);
  const indices=Buffer.from(e.targetIndices,'base64');
  assert(indices.length===1296*Uint32Array.BYTES_PER_ELEMENT,'A peça não possui 1296 índices de morfagem: '+e.id);
  for(let i=0;i<indices.length;i+=4)assert(indices.readUInt32LE(i)<d.sampleCount,'Índice de morfagem fora das amostras: '+e.id);
}
const {rollStart,tick}=d.schedule;
assert(Number.isFinite(rollStart)&&tick>0,'Cronograma de montagem inválido');
assert(new Set(d.entries.map(e=>e.cell.join(','))).size===75,'Posições iniciais duplicadas');
const firstMoves=new Map();
let edgeError=0,moves=0;
for(const e of d.entries){
  assert(e.route.length&&e.goal,'Peça sem destino: '+e.id);
  assert(Number.isInteger(e.ready)&&e.ready>=0&&e.departure>=e.ready,'Partida anterior à disponibilidade: '+e.id);
  assert(e.pace===1||e.pace===2,'Ritmo de peça inválido: '+e.id);
  let end=e.departure,cell=e.cell;
  for(const a of e.route){
    assert(a.start===end&&a.end-a.start===a.ticks,'Lacuna ou duração inválida na rota: '+e.id);
    assert(V(...a.from).distanceTo(V(...cell))<1e-8,'Salto entre apoios: '+e.id);
    end=a.end;cell=a.to;
    if(a.kind==='wait')continue;
    firstMoves.has(e.id)||firstMoves.set(e.id,a.start);moves++;
    assert(a.axis.filter(v=>Math.abs(v)>.001).length===1&&Math.abs(Math.hypot(...a.axis)-1)<1e-8,'Eixo de rolamento livre');
    const quarters=Math.abs(a.angle)/(Math.PI/2);
    assert(Math.abs(quarters-Math.round(quarters))<1e-8,'Ângulo não é múltiplo de 90 graus');
    assert([1,2,4].includes(a.ticks)&&a.ticks===Math.round(quarters)*e.pace,'Passo de rolamento incorreto');
    const r=Q().setFromAxisAngle(V(...a.axis),a.angle),p=V(...a.from).sub(V(...a.pivot)).applyQuaternion(r).add(V(...a.pivot));
    edgeError=Math.max(edgeError,p.distanceTo(V(...a.to)));
  }
  assert(end===e.arrival&&V(...cell).distanceTo(V(...e.goal))<1e-8,'Destino não corresponde ao fim da rota: '+e.id);
  assert(firstMoves.has(e.id),'Peça sem rolamento: '+e.id);
  if(e.big===-1){
    assert(Number.isFinite(e.foldStart)&&e.foldEnd>e.foldStart,'Fechamento de faces inválido: '+e.id);
    const ready=Math.max(0,Math.ceil((e.foldEnd-rollStart)/tick));
    assert(e.ready===ready,'Disponibilidade não corresponde ao fechamento: '+e.id);
    assert(rollStart+e.ready*tick+1e-8>=e.foldEnd,'Cubo liberado antes de fechar as faces: '+e.id);
    assert(rollStart+firstMoves.get(e.id)*tick+1e-8>=e.foldEnd,'Cubo rolando antes de fechar as faces: '+e.id);
  }
}
assert(edgeError<1e-8,'A aresta não leva exatamente ao próximo apoio');
assert(new Set(d.entries.map(e=>e.pace)).size>1,'As peças precisam de ritmos diferentes');
assert(d.bigRolls.every(g=>g.endTime<=rollStart+1e-8),'Rolamento dos grandes cubos ainda incompleto na desmontagem');
const folded=d.entries.filter(e=>e.big===-1),xs=new Set(folded.map(e=>e.cell[0])),zs=new Set(folded.map(e=>e.cell[2])),xz=new Set(folded.map(e=>[e.cell[0],e.cell[2]].join(',')));
assert(folded.length===21&&xs.size>3&&zs.size>3&&xz.size<xs.size*zs.size,'Dispersão voltou a formar uma grade regular');
assert(d.scatter.length===folded.length&&d.scatter.every((p,i)=>V(...p).distanceTo(V(...folded[i].cell))<1e-8),'Dispersão diverge das posições das peças');
const lastFoldEnd=Math.max(...folded.map(e=>e.foldEnd));
assert(rollStart+Math.min(...folded.map(e=>firstMoves.get(e.id)))*tick<lastFoldEnd,'Fechamento e montagem dos minicubos estão serializados');
assert(rollStart+Math.min(...d.entries.filter(e=>e.big>=0).map(e=>firstMoves.get(e.id)))*tick<lastFoldEnd,'Desmontagem dos grandes cubos não sobrepõe o fechamento das faces');
function pose(e,t){if(t<e.departure)return{p:V(...e.cell),q:Q().fromArray(e.q)};if(t>=e.arrival)return{p:V(...e.goal),q:Q().fromArray(e.finalQ)};const a=e.route.find(a=>t>=a.start&&t<a.end);if(a.kind==='wait')return{p:V(...a.from),q:Q().fromArray(a.q)};const x=(t-a.start)/(a.end-a.start),u=x*x*(3-2*x),r=Q().setFromAxisAngle(V(...a.axis),a.angle*u);return{p:V(...a.from).sub(V(...a.pivot)).applyQuaternion(r).add(V(...a.pivot)),q:r.multiply(Q().fromArray(a.q))}}
function overlaps(a,b){const delta=b.p.clone().sub(a.p);if(delta.lengthSq()>3.00001)return false;const aa=[V(1,0,0),V(0,1,0),V(0,0,1)].map(v=>v.applyQuaternion(a.q)),bb=[V(1,0,0),V(0,1,0),V(0,0,1)].map(v=>v.applyQuaternion(b.q)),axes=aa.concat(bb);for(const x of aa)for(const y of bb){const n=x.clone().cross(y);if(n.lengthSq()>1e-10)axes.push(n.normalize())}return axes.every(n=>.5*aa.reduce((s,a)=>s+Math.abs(a.dot(n)),0)+.5*bb.reduce((s,a)=>s+Math.abs(a.dot(n)),0)-Math.abs(delta.dot(n))>1e-5)}
let intersections=0,samples=0,peakMoving=0,first=null;for(let t=0;t<=d.rollTicks;t+=.25){const p=d.entries.map(e=>pose(e,t));peakMoving=Math.max(peakMoving,d.entries.filter(e=>e.route.some(a=>a.kind!=='wait'&&a.start<=t&&a.end>t)).length);samples++;for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++)if(overlaps(p[i],p[j])){intersections++;first||={t,i,j}}}assert(!intersections,'Peças se interpenetram: '+JSON.stringify(first));
assert(peakMoving>=Math.ceil(d.entries.length/2),'Montagem insuficientemente sobreposta');
assert(Math.max(...d.entries.map(e=>e.arrival))===d.rollTicks,'Prazo final diverge das rotas');
const timing={rollStart,tick,rollTicks:d.rollTicks,assembledAt:rollStart+d.rollTicks*tick,firstMoveRange:[Math.min(...firstMoves.values()),Math.max(...firstMoves.values())],lastFoldEnd,peakMoving,foldDeadlinesValid:true};
const scatter={cubes:folded.length,uniqueX:xs.size,uniqueZ:zs.size,regularGrid:false};
const morph={format:d.targetFormat,sampleCount:d.sampleCount,indicesPerPiece:1296,finiteValues:true};
const result={cubes:75,triangles:252,macroFaces:900,moves,axes:d.axes,samples,intersections,edgeError,side:d.cellSide,constantVolume:75*d.cellSide**3,timing,scatter,morph};await fs.mkdir('.producao/qa-construcao',{recursive:true});await fs.writeFile('.producao/qa-construcao/relatorio.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
