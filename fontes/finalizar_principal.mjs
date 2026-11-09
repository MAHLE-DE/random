import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';import JSZip from 'jszip';import sharp from 'sharp';
if(!process.env.RUNTIME_NODE_MODULES) throw new Error("Informe RUNTIME_NODE_MODULES pelo ambiente de producao.");
const root=path.resolve('.');const skill=process.env.PRESENTATIONS_SKILL_DIR;
const input=path.join(root,'.producao/principal-nativo-final.pptx');const zip=await JSZip.loadAsync(await fs.readFile(input));
// Somente os pôsteres de vídeo são reduzidos. Filmes e imagens de evidência
// permanecem Full HD; o texto segue nativo e editável.
const posters=new Set();
for(let i=1;i<=28;i++){
 const sx=await zip.file(`ppt/slides/slide${i}.xml`).async('string');const rx=await zip.file(`ppt/slides/_rels/slide${i}.xml.rels`).async('string');const rels=new Map();
 for(const tag of rx.match(/<Relationship\b[^>]*>/g)||[]){const id=tag.match(/\bId="([^"]+)"/),target=tag.match(/\bTarget="([^"]+)"/);if(id&&target)rels.set(id[1],target[1]);}
 for(const pic of sx.match(/<p:pic\b[\s\S]*?<\/p:pic>/g)||[]){if(!pic.includes('videoFile'))continue;const id=pic.match(/<a:blip\b[^>]*r:embed="([^"]+)"/);if(id&&rels.has(id[1]))posters.add(path.posix.normalize(path.posix.join('ppt/slides',rels.get(id[1]))));}
}
for(const name of posters){const bytes=await zip.file(name).async('nodebuffer');let image=sharp(bytes).resize({width:1280,height:720,fit:'inside',withoutEnlargement:true});image=/\.png$/i.test(name)?image.png():image.jpeg({quality:94,chromaSubsampling:'4:4:4'});zip.file(name,await image.toBuffer());}
console.log('POSTERES_OTIMIZADOS',posters.size);
// O PowerPoint grava r:id vazio em comandos locais de mídia. O atributo é
// opcional; removê-lo conserva ppaction://media e evita referência vazia.
for(let i=1;i<=28;i++){const name=`ppt/slides/slide${i}.xml`;const xml=await zip.file(name).async('string');zip.file(name,xml.replace(/\s+r:id=""/g,''));}
// Transformação nativa em cenas de síntese. Os demais deslocamentos são vídeos.
// p159 é a extensão do PowerPoint para Morph. A alternativa é uma transição suave.
const trans=`<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice Requires="p159" xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main"><p:transition spd="slow" advClick="1" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" p14:dur="1200"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow" advClick="1"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`;
for(const i of [24,25,26,28]){
 const name=`ppt/slides/slide${i}.xml`;let xml=await zip.file(name).async('string');
 xml=xml.replace(/<mc:AlternateContent\b[^>]*>[\s\S]*?<\/mc:AlternateContent>/g,block=>block.includes('transition')?'':block);
 xml=xml.replace(/<p:transition\b[^>]*(?:\/>|>[\s\S]*?<\/p:transition>)/g,'');
 if(xml.includes('<p:timing'))xml=xml.replace('<p:timing',trans+'<p:timing');else xml=xml.replace('</p:sld>',trans+'</p:sld>');
 zip.file(name,xml);
 const note=`ppt/notesSlides/notesSlide${i}.xml`;if(zip.file(note)){const n=await zip.file(note).async('string');zip.file(note,n.replace('deslocamento ambiental automático de 1,5 s','transição nativa de transformação de 1,2 s'));}
}
const candidate=path.join(root,'.producao/principal-candidato-final.pptx');await fs.writeFile(candidate,await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
await fs.mkdir('entrega/final',{recursive:true});
// A biblioteca tem limite de construção inferior ao pacote multimídia Full HD.
// As bases estáticas passam na importação. O pacote animado é verificado no
// PowerPoint nativo, além das checagens estruturais e de mídia.
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:path.join(root,'entrega/final/do-defeito-ao-efeito.pptx'),pythonExecutable:process.env.RUNTIME_PYTHON,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','18288000,10287000','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Arial']},explicitTotalSlideCount:28,verifyArtifactToolImport:false,receiptPath:path.join(root,'.producao/principal-final-validacao.json')});
console.log('PRINCIPAL_VALIDADO');
