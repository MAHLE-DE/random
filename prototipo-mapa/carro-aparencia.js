// A mesma pintura e a mesma placa são usadas no carro da abertura e no percurso.
// A marca é a geometria vetorial do GLB, sem fontes, imagens ou pedidos de rede.
function prepararCarroApresentacao(T,car){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),finalColor='#1B267D';
 const lateral=car.getObjectByName('Logotipo_vetorial_lateral_1')||car.getObjectByName('Logotipo_vetorial_lateral_-1');
 if(!lateral)throw new Error('A geometria vetorial MAHLE não foi encontrada no carro');
 // Clona antes de retirar as duas marcas laterais; mantém somente as letras cruas.
 const letters=lateral.clone(true);letters.position.set(0,0,0);letters.quaternion.identity();letters.scale.set(1,1,1);
 const removed=[];car.traverse(o=>{if(/^Logotipo_vetorial_lateral_|^Logotipo_MAHLE_no_capo$|^Placa_MAHLE_no_capo$/.test(o.name))removed.push(o)});removed.forEach(o=>o.removeFromParent());
 let sourcePaint=null;car.getObjectByName('Carroceria_com_caixas_de_roda')?.traverse(o=>{if(o.isMesh&&!sourcePaint)sourcePaint=Array.isArray(o.material)?o.material[0]:o.material});
 if(!sourcePaint)throw new Error('A pintura da carroceria não foi encontrada');
 const paint=sourcePaint.clone();paint.color.set(finalColor);paint.name='Pintura_azul_1B267D';
 const painted=[];car.traverse(o=>{if(!o.isMesh)return;let changed=false;if(Array.isArray(o.material))o.material=o.material.map(m=>{if(m!==sourcePaint)return m;changed=true;return paint});else if(o.material===sourcePaint){o.material=paint;changed=true}if(changed)painted.push(o.parent?.name||o.name)});
 const logoCapo=new T.Group();logoCapo.name='Placa_MAHLE_no_capo';logoCapo.userData.tipo='Placa vetorial branca sobre azul';logoCapo.userData.cor=finalColor;
 // Frente local XY, normal +Z. A placa se alinha à inclinação do capô original.
 const right=V(0,0,-1),up=V(-.9935,.1135,0).normalize(),normal=V().crossVectors(right,up).normalize();
 logoCapo.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(right,up,normal));logoCapo.position.set(1.045,1.053,0);
 const plateMaterial=new T.MeshBasicMaterial({color:finalColor,toneMapped:false,side:T.DoubleSide});plateMaterial.name='Azul_da_placa_no_capo';
 const plate=new T.Mesh(new T.BoxGeometry(1.14,.37,.008),plateMaterial);plate.name='Retangulo_azul_no_capo';logoCapo.add(plate);
 // Os vértices da marca vêm do SVG em Y para baixo. Converte para XY cartesiano,
 // centraliza a marca e conserva sua proporção de 113 por 25 unidades.
 const scale=1.02/113,letterMaterial=new T.MeshBasicMaterial({color:'#ffffff',side:T.DoubleSide,toneMapped:false});letterMaterial.name='Branco_MAHLE_no_capo';
 const transform=new T.Matrix4().makeScale(scale,-scale,1);transform.setPosition(-1.02/2,25*scale/2,.0055);
 letters.name='Marca_vetorial_branca_no_capo';letters.traverse(o=>{if(!o.isMesh)return;o.geometry=o.geometry.clone();o.geometry.applyMatrix4(transform);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();o.material=letterMaterial;o.castShadow=false;o.receiveShadow=false});
 logoCapo.add(letters);car.add(logoCapo);car.updateWorldMatrix(true,true);
 const localBox=new T.Box3();logoCapo.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();localBox.union(o.geometry.boundingBox)});
 const normalCar=normal.toArray(),info={corPintura:paint.color.getHexString(),materiaisPintura:1,pecasPintadas:painted,logosLateraisRemovidos:removed.filter(o=>/^Logotipo_vetorial_lateral_/.test(o.name)).length,logosLateraisRestantes:0,marcaSomenteNoCapo:true,placa:{nome:logoCapo.name,posicao:logoCapo.position.toArray(),quaternion:logoCapo.quaternion.toArray(),normal:normalCar,largura:1.14,altura:.37,espessura:.008,cor:finalColor,letras:5,proporcaoMarca:113/25,limitesLocais:{min:localBox.min.toArray(),max:localBox.max.toArray()}}};
 car.userData.aparenciaApresentacao=info;return{logoCapo,info};
}
