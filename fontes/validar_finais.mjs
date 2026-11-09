import path from 'node:path';import {pathToFileURL} from 'node:url';
if(!process.env.RUNTIME_NODE_MODULES) throw new Error("Informe RUNTIME_NODE_MODULES pelo ambiente de producao.");
const root=path.resolve('.'),skill=process.env.PRESENTATIONS_SKILL_DIR;const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')));
for(const name of ['principal','seguranca','reduzida']){
 await finalizePresentation({workspaceDir:root,candidatePath:path.join(root,`.producao/${name}-normalizado.pptx`),finalPath:path.join(root,`entrega/final/${name}.pptx`),pythonExecutable:process.env.RUNTIME_PYTHON,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','18288000,10287000','--validate-heading-fit'],fontPolicy:{basis:'design',families:['Arial']},explicitTotalSlideCount:name==='reduzida'?14:28,verifyArtifactToolImport:name!=='principal',receiptPath:path.join(root,`.producao/${name}-definitivo-validacao.json`)});
 console.log('VERIFICADO',name);
}
