from pathlib import Path
import csv, json, hashlib, math, re
from PIL import Image, ImageChops

ROOT=Path(__file__).resolve().parents[4]
OUT=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest().upper()
lockups=[]
matrix=[]
heading=[]
for width,height in [(1366,768),(1440,900),(1650,786),(1920,1080),(390,844)]:
    for route in ['home','ve-hue','kham-pha','cam-nang','luu-tru']:
        a=json.loads((OUT/f'before-{route}-{width}.json').read_text('utf-8'))
        b=json.loads((OUT/f'after-{route}-{width}.json').read_text('utf-8'))
        ia=Image.open(OUT/f'before-{route}-{width}.png').convert('RGB')
        ib=Image.open(OUT/f'after-{route}-{width}.png').convert('RGB')
        visible=[x for x in a['items'] if x['visible'] and x['tag']=='SPAN' and x['text']=='HUẾ']
        for span in visible:
            match=[x for x in a['brands'] if abs(span['x']-(x['rect'][0]+int(re.search(r'width="(\d+)"',x['html']).group(1))+(10 if 'gap-2.5' in x['html'] else 12)))<0.01 and x['rect'][1]<=span['y']<x['rect'][1]+x['rect'][3]]
            assert len(match)==1
            index=a['brands'].index(match[0]);r=match[0]['rect']
            box=(math.floor(r[0]),math.floor(r[1]),math.ceil(r[0]+r[2]),math.ceil(r[1]+r[3]))
            ca,cb=ia.crop(box),ib.crop(box)
            lockups.append({'route':route,'width':width,'boundsEqual':r==b['brands'][index]['rect'],'pixelIdentical':ImageChops.difference(ca,cb).getbbox() is None,'bounds':r})
            if route=='home' and width in [1366,390] or route=='ve-hue' and width==1366:
                ca.save(OUT/f'logo-lockup-before-{route}-{width}.png');cb.save(OUT/f'logo-lockup-after-{route}-{width}.png')
        x=next(x for x in a['items'] if x['tag']=='H1' and x['visible'])
        y=next(x for x in b['items'] if x['tag']=='H1' and x['visible'])
        heading.append({'route':route,'width':width,'sizeBefore':x['size'],'sizeAfter':y['size'],'lineBefore':x['line'],'lineAfter':y['line'],'heightBefore':x['h'],'heightAfter':y['h'],'yBefore':x['y'],'yAfter':y['y'],'familyBefore':x['family'],'familyAfter':y['family']})
        matrix.append({'route':route,'viewport':f'{width}x{height}','actualBefore':a['vp'],'actualAfter':b['vp'],'fontStatus':b['fontStatus'],'overflowBefore':a['doc'][1]-a['doc'][0],'overflowAfter':b['doc'][1]-b['doc'][0],'h1HeightDelta':y['h']-x['h'],'evidenceBefore':f'before-{route}-{width}.png','evidenceAfter':f'after-{route}-{width}.png'})
(OUT/'brand-lockup-comparison.json').write_text(json.dumps(lockups,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'final-25-case-matrix.json').write_text(json.dumps(matrix,indent=2),encoding='utf-8')
(OUT/'h1-computed-before-after.json').write_text(json.dumps(heading,ensure_ascii=False,indent=2),encoding='utf-8')
compiled=[]
source_fonts={sha(p):p.name for p in (ROOT/'src/app/fonts').glob('*') if p.suffix in {'.ttf','.woff'}}
for p in (ROOT/'.next/static/media').glob('*'):
    if p.is_file() and sha(p) in source_fonts:
        compiled.append({'productionSource':source_fonts[sha(p)],'runtimeURL':'/_next/static/media/'+p.name,'Bytes':p.stat().st_size,'SHA256':sha(p)})
(OUT/'compiled-font-media.json').write_text(json.dumps(compiled,indent=2),encoding='utf-8')
faces=[]
for p in (ROOT/'.next/static/css').rglob('*.css'):
    faces.extend(re.findall(r'@font-face\s*\{[^}]+\}',p.read_text('utf-8')))
(OUT/'compiled-font-face-rules.txt').write_text('\n'.join(faces),encoding='utf-8')
tables={}
tables['matrix']='\n'.join('| `'+('/' if r['route']=='home' else '/'+r['route'])+'` | '+r['viewport'].replace('x','×')+' | '+r['fontStatus']+' | '+str(r['overflowBefore'])+' → '+str(r['overflowAfter'])+' | '+str(r['h1HeightDelta'])+' | [Before](evidence/GATE-07-03B/'+r['evidenceBefore']+') / [After](evidence/GATE-07-03B/'+r['evidenceAfter']+') |' for r in matrix)
manifest=list(csv.DictReader((OUT/'rollback-manifest.csv').open(encoding='utf-8-sig')))
tables['hashes']='\n'.join('| `'+r['File']+'` | `'+(r['SHA256Before'] or 'NEW')+'` | `'+r['SHA256After']+'` |' for r in manifest)
tables['fonts']='\n'.join('| `'+r['File']+'` | '+str((ROOT/r['File']).stat().st_size)+' | `'+r['SHA256After']+'` |' for r in manifest if r['ExistedBefore']=='False')
(OUT/'report-tables.json').write_text(json.dumps(tables,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'brandLockups':len(lockups),'brandAllBoundsAndPixelsEqual':all(x['boundsEqual'] and x['pixelIdentical'] for x in lockups),'cases':len(matrix),'overflowCases':sum(x['overflowAfter']>0 for x in matrix),'headingHeightChanges':sum(x['h1HeightDelta']!=0 for x in matrix),'compiledMatchingFontFiles':len(compiled)}))
