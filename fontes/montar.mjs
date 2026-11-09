import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import sharp from 'sharp';
if(!process.env.RUNTIME_NODE_MODULES) throw new Error("Informe RUNTIME_NODE_MODULES pelo ambiente de producao.");
const ROOT=path.resolve('.');const SKILL=process.env.PRESENTATIONS_SKILL_DIR;
const PY=process.env.RUNTIME_PYTHON;
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')));
const data=JSON.parse(await fs.readFile('roteiros/cenas.json','utf8'));const blue='#0043BC',navy='#022954',muted='#435A70';
const techIds=[3,4,12,13,14,15,16,20,21,22];
const vector=(await fs.readFile('midias/mahle-vetor.svg','utf8')).replace(/<\?xml[^?]*\?>/g,'').replace(/<!DOCTYPE[^>]*>/g,'').replace('fill:#1e2a63','fill:#0043BC');
await fs.writeFile('midias/mahle-azul.svg',vector);
function text(sl,name,txt,x,y,w,h,size,color=navy,bold=false){const o=sl.shapes.add({geometry:'textbox',name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});o.text=txt;o.text.style={fontFamily:'Arial',fontSize:size,color,bold};o.text.insets=0;return o;}
function rect(sl,name,x,y,w,h,fill,line='none'){return sl.shapes.add({geometry:'rect',name,position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:line==='none'?0:1.4}});}
const sevcolor=s=>s>=9?'#CA3643':s>=7?'#B7551C':s>=4?'#98600A':blue;
function mainTitle(it){if(it.id===16)return 'ÁGUA NO CILINDRO';return it.titulo;}
const labels={3:[['CORPO DE BORBOLETA',1410,470],['DUTOS DE ADMISSÃO',1130,570],['CABEÇOTE',1280,770]],4:[['PLENUM',1320,460],['LINHA DE SOLDAGEM',1100,590],['VEDAÇÃO E INSERTOS',1250,760]],10:[['ARQUITETURA ILUSTRATIVA',1170,470]],11:[['RECURSO AUXILIAR INATIVO',1140,470]],12:[['INSERTO DESLOCADO',1170,480]],13:[['RESTRIÇÃO EM UM DUTO',1150,480]],14:[['CONTATO IRREGULAR DA JUNTA',1120,460]],15:[['PARTÍCULA NO CAMINHO DO AR',1100,470]],16:[['LÍQUIDO ACUMULADO',1200,480]],19:[['CORTE ILUSTRATIVO DA PAREDE',1090,450]],20:[['PULSO DE PRESSÃO',1200,460]],21:[['TRINCA E CAMINHO DE FUGA',1120,450]]};
const relevant=new Set([6,7,8,9,12,13,14,15,16,17,19,20,21,27]);
let elapsed=0;const guide=['# Roteiro do apresentador — 60 minutos','', 'Todos os cenários técnicos são genéricos e ilustrativos. As notas de severidade do workshop não revisam o DFMEA aprovado. O ritmo inclui perguntas, observação e discussão, sem avanço automático de slides.',''];
for(const it of data){const start=elapsed;elapsed+=it.tempo;const mm=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`;guide.push(`## Cena ${it.id} — ${mainTitle(it)}`,``,`${mm(start)}–${mm(elapsed)} · ${it.tempo/60} min`, ``, it.fala,``, `Condução: aproximadamente 20% do tempo para observar o visual, 40% para explicar o mecanismo, 30% para ouvir e discutir e 10% para conectar à próxima cena. A dinâmica da cena 27 tem divisão própria.`, ``,it.pergunta?`Pergunta ao público: ${it.pergunta}`:`Pergunta ao público: ${it.barreira?'Em que ponto sua área pode prevenir ou detectar esta condição?':'Como esta etapa se conecta ao trabalho da sua área?'}`,``,it.barreira?`Barreira em foco: ${it.barreira}.`:'',it.fonte?`Referência: ${it.fonte}`:'',``,`Operação: avançar as etapas da cadeia por clique. Pausar a fala antes de cada efeito. Para repetir do início, voltar à cena anterior e avançar novamente.`,` `);}
await fs.writeFile('roteiros/roteiro-60-minutos.md',guide.join('\n').replace(/[ \t]+$/gm,'').trimEnd()+'\n');
const amostra=process.argv.includes('--amostra');
const configurations=amostra?[{name:'amostra',all:data.slice(0,4),final:'amostra.pptx'}]:[{name:'base-principal',all:data,final:'base-principal.pptx'},{name:'seguranca',all:data,final:'seguranca-sem-animacoes.pptx'},{name:'reduzida',all:data.filter(d=>[1,3,4,5,6,9,13,14,16,18,21,24,27,28].includes(d.id)),final:'contingencia-reduzida.pptx'}];
const summary=[];
for(const cfg of configurations){
 const p=Presentation.create({slideSize:{width:1920,height:1080}});
 for(const [ix,it] of cfg.all.entries()){
  const sl=p.slides.add();sl.background.fill='#FFFFFF';
  const file=(cfg.name==='base-principal'&&it.id===22)?'midias/cenas/cena-22-inicio.png':`midias/cenas/cena-${String(it.id).padStart(2,'0')}.png`;
  const b=await sharp(file).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toBuffer();const plate=sl.images.add({blob:new Uint8Array(b),contentType:'image/jpeg',alt:'Ambiente tridimensional genérico e ilustrativo',position:{left:0,top:0,width:1920,height:1080}});plate.name='Plano_3d';
  // Respiro branco mantém o conteúdo legível, sem painel ou moldura.
  rect(sl,'Respiro_titulo',0,0,1920,385,'linear(90deg, #FFFFFF 0%, #FFFFFF 70%, #FFFFFF/0 100%)');
  rect(sl,'Respiro_texto',0,320,830,580,'linear(0deg, #FFFFFF 0%, #FFFFFF 95%, #FFFFFF/0 100%)');
  rect(sl,'Respiro_cadeia',0,900,1920,180,'#FFFFFF');
  sl.images.add({svg:vector,alt:'Logotipo MAHLE azul, elemento vetorial independente',position:{left:1620,top:57,width:205,height:48}});
  const kicker=it.id===1?'SEMANA DA QUALIDADE · MOGI GUAÇU':it.id===12?'EFEITOS NA FÁBRICA':it.s?`SEVERIDADE ${String(it.s).padStart(2,'0')}`:'A JORNADA DA QUALIDADE';
  text(sl,'Contexto',kicker,96,68,1390,44,27,it.s?sevcolor(it.s):blue,true);
  const title=mainTitle(it);let size=title.length>40?63:title.length>24?68:78;
  text(sl,'Titulo',title,96,151,1330,174,size,navy,true);
  text(sl,'Mensagem',it.mensagem,98,340,780,145,36,muted);
  if(it.criterio)text(sl,'Criterio_severidade',it.criterio,98,510,680,84,31,sevcolor(it.s),true);
  if(it.barreira&&it.id!==22){text(sl,'Rotulo_barreira','BARREIRA EM FOCO',98,637,630,40,24,blue,true);text(sl,'Barreira',it.barreira,98,685,660,96,31,navy);}
  else if(it.pergunta&&![5,27,28].includes(it.id))text(sl,'Pergunta',it.pergunta,98,it.id===1?525:625,700,144,36,blue,true);
  if(it.id===3){text(sl,'Definicao','Plenum: câmara comum\nDuto: passagem para um cilindro',98,535,690,120,31,navy);}
  if(it.id===4){text(sl,'Definicao','Estanqueidade: impedir passagens de ar não previstas',98,535,690,120,31,navy);}
  if(it.id===5){text(sl,'Definicao','Severidade: gravidade do efeito\nOcorrência: chance de acontecer\nDetecção: capacidade dos controles',98,520,760,185,31,navy);}
  if([10,11].includes(it.id))text(sl,'Condicao','Hipótese: propulsão normal preservada',98,810,950,45,27,muted);
  if(it.id===12)text(sl,'Distincao','Efeito industrial e efeito no veículo exigem análises distintas',98,800,1040,70,28,muted);
  if([19,20,21,22,23].includes(it.id))text(sl,'Condicao','Cenário potencial sob condições específicas',98,821,1040,45,28,'#B33342',true);
  if(it.id===22)text(sl,'Esclarecimento','A parada não implica perda automática de direção ou frenagem',98,625,710,150,31,navy);
  if(it.id===24){const teams=[['Engenharia e fornecedores','Requisitos e material corretos'],['Produção e apoio técnico','Processo capaz e reação ao desvio'],['Logística e áreas administrativas','Proteção, identificação e rastreabilidade'],['Operadores e liderança','Contenção e aprendizado']];teams.forEach(([a,b],j)=>{text(sl,`Equipe_${j}`,a,100,495+j*85,940,40,28,blue,true);text(sl,`Contribuicao_${j}`,b,100,529+j*85,1020,40,27,navy);});}
  if(it.id===25){text(sl,'Rota_correta','DESVIO ENCONTRADO\nIdentificar e segregar o lote',1080,450,690,110,34,blue,true);text(sl,'Rota_escape','DESVIO NÃO DETECTADO\nPossível impacto ao cliente',1080,715,690,110,30,'#B33342',true);}
  if(it.id===26){text(sl,'Controles','Requisito e fornecedor\nRecebimento e processo\nEnsaio e inspeção\nLiberação e rastreabilidade',98,505,880,250,34,navy);}
  if(it.id===27){text(sl,'Dinamica','1 min: origem\n1 min: mecanismo e efeito\n1 min: barreiras por área\n1 min: primeira ação e evidência',98,490,800,270,34,navy);}
  for(const [label,x,y] of labels[it.id]||[]){rect(sl,'Base_legenda_'+label,x-8,y-4,Math.min(620,Math.max(190,label.length*17+25)),42,'#FFFFFF/96');text(sl,'Legenda_'+label,label,x,y,640,44,23,navy,true);}
  if(relevant.has(it.id)){
    const f=sl.shapes.add({geometry:'rect',name:'Espaco_para_imagem_real_aprovada',position:{left:1100,top:490,width:665,height:380},fill:'none',line:{fill:'#88CAFC',width:1,style:'dashed'}});
    if((labels[it.id]||[]).length){f.sendBackward();f.sendBackward();}
    text(sl,'Indicacao_imagem_real','Representação ilustrativa. Espaço para imagem aprovada',98,1036,1500,32,21,muted);
  }else text(sl,'Indicacao_ilustracao','Representação genérica e ilustrativa',98,1036,1400,32,21,muted);
  const nodes=[];const n=it.cadeia.length;
  if(n){const full=1720,w=(full-(n-1)*70)/n;it.cadeia.forEach((word,j)=>{const x=98+j*(w+70);const o=text(sl,`Etapa_${j+1}`,word,x,941,w,82,31,j===n-1&&it.s>=7?sevcolor(it.s):navy,true);nodes.push(o);if(j>0)sl.shapes.add({geometry:it.id===23?'leftArrow':'rightArrow',name:`Conexao_${j}`,position:{left:x-61,top:956,width:43,height:16},fill:blue,line:{fill:'none',width:0}});});}
  if(it.id===28)text(sl,'Pergunta_final',it.pergunta,98,937,1580,84,44,blue,true);
  text(sl,'Numero_cena',`${String(ix+1).padStart(2,'0')} / ${cfg.all.length}`,1740,1037,100,30,21,muted);
  const extra=`\nDuração estimada: ${it.tempo} segundos.\n${it.barreira?'Barreira: '+it.barreira+'.':''}\n${it.pergunta?'Pergunta: '+it.pergunta:''}\nOperação: ${cfg.name==='base-principal'?([24,25,26,28].includes(it.id)?'transição nativa de transformação de 1,2 s':'deslocamento ambiental automático de 1,5 s')+'; etapas da cadeia por clique; '+(techIds.includes(it.id)?'um clique adicional reproduz o mecanismo técnico de 3 s.':''):'imagem estática, cadeia completa visível, avanço manual.'}\nSubstituição de evidência: a moldura nomeada Espaco_para_imagem_real_aprovada admite foto, resultado ou especificação aprovados. Remover a ilustração da região se ela competir com a evidência. Não inserir dados não validados.\n${it.fonte?'Referência pública: '+it.fonte:''}\nCritério: escala didática fornecida no prompt2. Notas originais do DFMEA preservadas na matriz complementar. Cenários não representam falhas reais de produto MAHLE.\n`;
  sl.speakerNotes.text=it.fala+extra;
  if(cfg.name==='base-principal')summary.push({id:it.id,titulo:title,tempo:it.tempo,etapas:n,video_tecnico:techIds.includes(it.id),carga_grafica:[3,4,20,22].includes(it.id)?'maior':'normal'});
 }
 const suffix=process.argv.includes('--final')?'-final':process.argv.includes('--revisao4')?'-v4':process.argv.includes('--revisao3')?'-v3':process.argv.includes('--revisao2')?'-v2':'';
 const candidate=path.join(ROOT,'.producao','rascunho-'+cfg.name+suffix+'.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
 const finalPath=path.join(ROOT,['base-principal','amostra'].includes(cfg.name)?'.producao/bases':'entrega',cfg.final.replace('.pptx',suffix+'.pptx'));
 await fs.mkdir(path.dirname(finalPath),{recursive:true});
 const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath,pythonExecutable:PY,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','18288000,10287000','--validate-heading-fit'],explicitTotalSlideCount:cfg.all.length,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:path.join(ROOT,'.producao',cfg.name+suffix+'.validacao.json')});
 console.log('FINALIZADO',cfg.name,JSON.stringify(result).slice(0,120));
}
await fs.writeFile('roteiros/mapa-cenas.json',JSON.stringify(summary,null,2));
