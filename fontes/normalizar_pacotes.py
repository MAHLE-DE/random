from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree as E
import re
import sys
root=Path.cwd()
items=[('entrega/final/do-defeito-ao-efeito.pptx','principal'),('entrega/seguranca-sem-animacoes-final.pptx','seguranca'),('entrega/contingencia-reduzida-final.pptx','reduzida')]
if '--reproducao' in sys.argv:items=[('.producao/principal-reproducao.pptx','principal-reproducao')]
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
for source,name in items:
    count=0
    with ZipFile(root/source) as zin, ZipFile(root/'.producao'/f'{name}-normalizado.pptx','w',ZIP_DEFLATED) as zout:
        for entry in zin.infolist():
            raw=zin.read(entry.filename)
            if re.fullmatch(r'ppt/slides/slide\d+\.xml',entry.filename):
                tree=E.fromstring(raw);sp=tree.find('p:cSld/p:spTree',ns)
                for el in tree.iter():
                    for key,value in list(el.attrib.items()):
                        if key.startswith('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}') and not value:del el.attrib[key]
                frames=[];bases=[]
                for o in sp:
                    props=o.find('.//p:cNvPr',ns)
                    if props is None:continue
                    label=props.get('name','')
                    if label=='Espaco_para_imagem_real_aprovada':frames.append(o)
                    if label.startswith('Base_legenda_'):bases.append(o)
                if frames and bases:
                    for f in frames:
                        sp.remove(f);sp.insert(list(sp).index(bases[0]),f);count+=1
                raw=E.tostring(tree,xml_declaration=True,encoding='UTF-8',standalone=True)
            zout.writestr(entry,raw)
    print(name,'molduras ordenadas',count)
