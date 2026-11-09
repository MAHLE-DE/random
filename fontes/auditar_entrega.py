"""Inventário verificável dos três arquivos de apresentação."""
from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E
import hashlib, json, re

root=Path.cwd()
records=[]
for p in sorted((root/'entrega').glob('*.pptx')):
    with ZipFile(p) as z:
        names=z.namelist()
        external=[]
        for n in names:
            if n.endswith('.rels'):
                for rel in E.fromstring(z.read(n)):
                    if rel.get('TargetMode')=='External':external.append(rel.get('Target'))
        records.append({
            'arquivo':p.name,
            'bytes':p.stat().st_size,
            'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),
            'cenas':sum(bool(re.fullmatch(r'ppt/slides/slide\d+\.xml',n)) for n in names),
            'possui_vba':any('vbaProject' in n for n in names),
            'partes_de_fontes_incorporadas':sum(n.startswith('ppt/fonts/') for n in names),
            'vinculos_externos':external,
        })
(root/'fontes'/'manifesto-entrega.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(records,ensure_ascii=False,indent=2))
