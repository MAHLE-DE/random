// Uma rede de seis faces. Cada quadrado contém dois triângulos conservados.
function redeCuboAbertura(T,face,type,wall=1,lid=1){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),Q=()=>new T.Quaternion(),centers=[[0,-.5,0],[1,-.5,0],[-1,-.5,0],[0,-.5,1],[0,-.5,-1],[2,-.5,0]];
 const p=V(...centers[face]).add(V(type?-1/6:1/6,0,type?1/6:-1/6)),tri=type?Q().setFromAxisAngle(V(1,0,0),Math.PI):Q().setFromAxisAngle(V(0,0,1),Math.PI),q=tri.clone();
 function hinge(pivot,axis,angle){const r=Q().setFromAxisAngle(axis,angle);p.sub(pivot).applyQuaternion(r).add(pivot);q.premultiply(r)}
 if(face===5)hinge(V(1.5,-.5,0),V(0,0,1),lid*Math.PI/2);
 if(face===1||face===5)hinge(V(.5,-.5,0),V(0,0,1),wall*Math.PI/2);
 if(face===2)hinge(V(-.5,-.5,0),V(0,0,1),-wall*Math.PI/2);
 if(face===3)hinge(V(0,-.5,.5),V(1,0,0),-wall*Math.PI/2);
 if(face===4)hinge(V(0,-.5,-.5),V(1,0,0),wall*Math.PI/2);
 return{p,q};
}
function trianguloAbertura(subdivision=6){
 const out=[];for(let i=0;i<subdivision;i++)for(let j=0;j<subdivision-i;j++){
  out.push([i/subdivision,j/subdivision],[i/subdivision,(j+1)/subdivision],[(i+1)/subdivision,j/subdivision]);
  if(i+j<subdivision-1)out.push([(i+1)/subdivision,j/subdivision],[i/subdivision,(j+1)/subdivision],[(i+1)/subdivision,(j+1)/subdivision]);
 }return out;
}
