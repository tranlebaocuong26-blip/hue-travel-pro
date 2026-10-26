import csv, hashlib, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
PRE = ROOT / 'reports/codex/typography-preview'
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest().upper()
baseline = list(csv.DictReader((OUT/'baseline.csv').open(encoding='utf-8-sig')))
integrity = []
for r in baseline:
    p = ROOT / r['Path']
    after = sha(p) if p.exists() else 'MISSING'
    integrity.append({'Path':r['Path'],'Before':r['SHA256'],'After':after,'Status':'UNCHANGED' if r['SHA256'].upper()==after else 'CHANGED'})
with (OUT/'integrity-before-after.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=['Path','Before','After','Status']);w.writeheader();w.writerows(integrity)
runtime=json.loads((OUT/'runtime-inventory.json').read_text('utf-8'))
with (OUT/'computed-font-inventory.csv').open('w',encoding='utf-8-sig',newline='') as f:
    fields=['route','viewport','tag','text','family','size','weight','line','spacing','overflow','whiteSpace','w','h','scrollWidth','clientWidth']
    w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
    for r in runtime:
        for x in r['inventory']:
            w.writerow({'route':r['url'],'viewport':'x'.join(map(str,r['vp'])),**{k:x.get(k,'') for k in fields[2:]}})
manifest=[]
for p in sorted(PRE.rglob('*')):
    if not p.is_file():continue
    rel=p.relative_to(PRE).as_posix();name=p.name
    family='bevietnampro' if name.startswith('BeVietnam') or name.startswith('bevietnam') else 'notosans' if name.startswith('NotoSans') or name.startswith('notosans') else 'notoserif' if name.startswith('NotoSerif') or name.startswith('notoserif') else ''
    if name.startswith('BeVietnamPro-'):
        source='https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/'+name
    elif name.startswith(('NotoSans-','NotoSerif-')):
        fam='NotoSans' if name.startswith('NotoSans') else 'NotoSerif'
        source='https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/'+fam+('-Italic' if 'Italic' in name else '')+'%5Bwdth,wght%5D.ttf'
    elif name.endswith('METADATA.pb') or name.endswith('OFL.txt'):
        source='https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/'+('METADATA.pb' if 'METADATA' in name else 'OFL.txt')
    elif name=='GeistVF.woff':source='local exact copy: src/app/fonts/GeistVF.woff'
    else:source='Generated isolated preview / evidence; no production import'
    manifest.append({'File':rel,'Bytes':p.stat().st_size,'SHA256':sha(p),'Source':source})
with (OUT/'preview-file-manifest.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=['File','Bytes','SHA256','Source']);w.writeheader();w.writerows(manifest)
coverage=json.loads((OUT/'font-coverage.json').read_text('utf-8'))
coverage_rows='\n'.join('| '+Path(r['file']).name+' | '+str(r['bytes'])+' | '+str(len(r['nfc_missing']))+'/178 | '+str(len(r['nfd_missing']))+'/54 |' for r in coverage)
runtime_rows=[]
for r in runtime:
    route=r['url'].replace('http://192.168.1.12:3000','') or '/'
    code={'/':'home','/ve-hue':'ve-hue','/kham-pha':'kham-pha','/cam-nang':'cam-nang','/luu-tru':'luu-tru'}[route]
    vp='×'.join(map(str,r['vp']))
    fn=f'production-{code}-{r["vp"][0]}.png'
    runtime_rows.append(f'| `{route}` | {vp} | {r["fontStatus"]} | {r["doc"][0]} / {r["doc"][1]} | [PNG](evidence/GATE-07-03A/{fn}) |')
computed=[]
for r in runtime:
    if r['vp'][0] not in [1366,390]:continue
    for x in r['inventory']:
        if x['tag']=='H1' or x['text'] in ['HUẾ','TRAVEL PRO','Huế có chi hay?']:
            computed.append('| `'+r['url'].replace('http://192.168.1.12:3000','')+'` | '+str(r['vp'][0])+' | '+x['text'][:30]+' | '+x['size']+' | '+x['weight']+' | '+x['line']+' | '+x['spacing']+' | '+('display' if 'Palatino' in x['family'] else 'editorial')+' |')
(OUT/'generated-tables.json').write_text(json.dumps({'coverage':coverage_rows,'runtime':'\n'.join(runtime_rows),'computed':'\n'.join(computed),'integrity_count':len(integrity),'integrity_changed':[r for r in integrity if r['Status']!='UNCHANGED'],'preview_files':len(manifest),'preview_font_bytes':sum(p.stat().st_size for p in (PRE/'fonts').iterdir())},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'baseline':len(integrity),'changed':sum(r['Status']!='UNCHANGED' for r in integrity),'preview_files':len(manifest),'runtime_cases':len(runtime),'inventory_rows':sum(len(r['inventory']) for r in runtime)}))
