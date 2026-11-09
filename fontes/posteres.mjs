import fs from 'node:fs/promises';import sharp from 'sharp';
await fs.mkdir('midias/posteres',{recursive:true});
for(let i=1;i<=28;i++){const id=String(i).padStart(2,'0');await sharp(`.producao/quadros/${id}/000.png`).resize(1280,720).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(`midias/posteres/transicao-${id}.jpg`);}
for(const i of [3,4,12,13,14,15,16,20,21,22])await sharp(`.producao/quadros/tecnica-${i}/000.png`).resize(1280,720).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(`midias/posteres/mecanismo-${i}.jpg`);
