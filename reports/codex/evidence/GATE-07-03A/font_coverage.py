from pathlib import Path
import struct, zlib, json, unicodedata, hashlib, csv

ROOT=Path(r'A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro')
OUT=ROOT/'reports/codex/evidence/GATE-07-03A'
PRE=ROOT/'reports/codex/typography-preview'
u16=lambda b,o:struct.unpack_from('>H',b,o)[0]
u32=lambda b,o:struct.unpack_from('>I',b,o)[0]
s16=lambda b,o:struct.unpack_from('>h',b,o)[0]
def tables(path):
    b=path.read_bytes(); result={}
    if b[:4]==b'wOFF':
        for i in range(u16(b,12)):
            tag,off,cl,ol,cs=struct.unpack_from('>4sIIII',b,44+20*i)
            raw=b[off:off+cl];result[tag.decode()]=zlib.decompress(raw) if cl<ol else raw
    else:
        for i in range(u16(b,4)):
            tag,cs,off,l=struct.unpack_from('>4sIII',b,12+16*i)
            result[tag.decode()]=b[off:off+l]
    return result
def cmap(t):
    b=t['cmap']; points=set(); formats=[]
    for i in range(u16(b,2)):
        platform,enc,off=struct.unpack_from('>HHI',b,4+8*i)
        if platform!=0 and not(platform==3 and enc in (1,10)):continue
        f=u16(b,off);s=b[off:];formats.append(f)
        if f==4:
            n=u16(s,6)//2
            for j in range(n):
                end=u16(s,14+2*j);start=u16(s,16+2*n+2*j);delta=s16(s,16+4*n+2*j);ro=u16(s,16+6*n+2*j)
                for cp in range(start,end+1):
                    if cp==65535:continue
                    if ro:
                        pos=16+6*n+2*j+ro+2*(cp-start)
                        g=u16(s,pos) if pos+2<=len(s) else 0
                        if g:g=(g+delta)&65535
                    else:g=(cp+delta)&65535
                    if g:points.add(cp)
        elif f==12:
            for j in range(u32(s,12)):
                start,end,g=struct.unpack_from('>III',s,16+12*j)
                points.update(range(start+(g==0),end+1))
    return points,sorted(set(formats))
alphabet='A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y'
vowels='aăâeêioôơuưy';tones=['','\u0301','\u0300','\u0309','\u0303','\u0323']
tone_rows=[]
for base in vowels+vowels.upper():
    tone_rows.append([unicodedata.normalize('NFC',base+mark) for mark in tones])
nfc=alphabet+' '+alphabet.lower()+' '+' '.join(' '.join(row) for row in tone_rows)
nfd=unicodedata.normalize('NFD',nfc)
corpus={'alphabet_upper':alphabet,'alphabet_lower':alphabet.lower(),'vowels':vowels,'tones':['ngang','sắc','huyền','hỏi','ngã','nặng'],'tone_rows_nfc':tone_rows,'tone_rows_nfd':[[unicodedata.normalize('NFD',s) for s in row] for row in tone_rows],'nfc':nfc,'nfd':nfd,'nfc_points':sorted(set(ord(c) for c in nfc if not c.isspace())),'nfd_points':sorted(set(ord(c) for c in nfd if not c.isspace()))}
(OUT/'vietnamese-corpus.json').write_text(json.dumps(corpus,ensure_ascii=False,indent=2),encoding='utf-8')
(PRE/'corpus.json').write_text(json.dumps(corpus,ensure_ascii=False),encoding='utf-8')
files=list((PRE/'fonts').glob('*'))+[ROOT/'src/app/fonts/GeistMonoVF.woff']
for name in ['segoeui.ttf','segoeuib.ttf','arial.ttf','georgia.ttf','pala.ttf','times.ttf']:
    p=Path('C:/Windows/Fonts')/name
    if p.exists():files.append(p)
results=[]
for p in files:
    t=tables(p);points,formats=cmap(t)
    names=[]
    if 'name' in t:
        b=t['name'];offset=u16(b,4)
        for i in range(u16(b,2)):
            platform,enc,lang,nid,length,off=struct.unpack_from('>6H',b,6+12*i)
            if nid in (1,2,4,6):
                raw=b[offset+off:offset+off+length]
                try:value=raw.decode('utf-16-be' if platform in (0,3) else 'mac_roman')
                except UnicodeError:continue
                if value not in names:names.append(value)
    axes=[]
    if 'fvar' in t:
        b=t['fvar'];start=u16(b,4);count=u16(b,8);size=u16(b,10)
        for i in range(count):
            o=start+i*size
            axes.append({'tag':b[o:o+4].decode(),'min':struct.unpack_from('>i',b,o+4)[0]/65536,'default':struct.unpack_from('>i',b,o+8)[0]/65536,'max':struct.unpack_from('>i',b,o+12)[0]/65536})
    missing={mode:[{'cp':f'U+{cp:04X}','char':chr(cp),'name':unicodedata.name(chr(cp),'?')} for cp in corpus[mode+'_points'] if cp not in points] for mode in ['nfc','nfd']}
    results.append({'file':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'names':names,'axes':axes,'cmap_formats':formats,'coverage_count':len(points),'nfc_total':len(corpus['nfc_points']),'nfd_total':len(corpus['nfd_points']),'nfc_missing':missing['nfc'],'nfd_missing':missing['nfd'],'GPOS':'GPOS' in t,'GSUB':'GSUB' in t,'parser':'stdlib WOFF/SFNT cmap4/12 nonzero glyph IDs; not a shaping engine'})
(OUT/'font-coverage.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
with (OUT/'font-coverage-summary.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f);w.writerow(['File','Bytes','SHA256','NFC_Total','NFC_Missing','NFD_Total','NFD_Missing','Axes'])
    for r in results:w.writerow([r['file'],r['bytes'],r['sha256'],r['nfc_total'],len(r['nfc_missing']),r['nfd_total'],len(r['nfd_missing']),json.dumps(r['axes'])])
print(json.dumps([{'file':Path(r['file']).name,'NFC_missing':len(r['nfc_missing']),'NFD_missing':len(r['nfd_missing']),'NFC_total':r['nfc_total'],'NFD_total':r['nfd_total'],'axes':r['axes']} for r in results],ensure_ascii=False))
