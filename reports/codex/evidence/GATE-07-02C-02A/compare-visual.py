from pathlib import Path
import json
p=Path(r'A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro');e=p/'reports/codex/evidence/GATE-07-02C-02A'
a=json.loads((e/'before-measurements.json').read_text());b=json.loads((e/'after-measurements.json').read_text());out=[]
for old,new in zip(a,b):
    keys=['x','y','w','h','bg','padding','font','text']
    cardEqual=all(all(o[k]==n[k] for k in keys) for o,n in zip(old['cards'],new['cards']))
    childEqual=all(all(all(c[k]==d[k] for k in ['x','y','w','h','font','line','color']) for c,d in zip(o['children'],n['children'])) for o,n in zip(old['cards'],new['cards']))
    out.append({'viewport':new['vp'],'cardNormalGeometryAndStylesEqual':cardEqual,'childrenGeometryAndStylesEqual':childEqual,'gridEqual':old['grid']==new['grid'],'heroBoundsEqual':old['hero']==new['hero'],'horizontalOverflow':new['doc'][0]!=new['doc'][1],'buttonTypes':[c['type'] for c in new['cards']],'nestedControls':[c['nested'] for c in new['cards']]})
(e/'visual-comparison.json').write_text(json.dumps(out,indent=2))
x=(e/'luu-tru.before.tsx').read_bytes();y=(p/'src/app/luu-tru/page.tsx').read_bytes();m='      {/* Gợi ý theo nhu cầu Row'.encode();n=b'      {/* Main Grid + Right Sidebar';strict={'beforeTargetByteIdentical':x[:x.index(m)]==y[:y.index(m)],'afterTargetByteIdentical':x[x.index(n):]==y[y.index(n):]};(e/'byte-integrity.json').write_text(json.dumps(strict,indent=2))
print(json.dumps({'visual':out,'byte':strict}))

