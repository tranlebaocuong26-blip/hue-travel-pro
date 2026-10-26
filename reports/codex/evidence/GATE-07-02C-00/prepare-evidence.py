from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
root=Path(r'A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro\reports\codex\evidence\GATE-07-02C-00')
crops=[('kham-pha-detail-1366.png','P1-KP01-thumbnail-crop.png',(288,248,617,622)),('kham-pha-detail-1366.png','P1-KP02-map-crop.png',(996,196,1320,500)),('05-ve-hue-1440.png','P1-LS01-topic-crop.png',(288,536,1393,801)),('cam-nang-1366-full.png','P1-DC01-cards-crop.png',(288,715,965,1210)),('luu-tru-1366-full.png','P1-LT01-cards-crop.png',(288,786,965,1080))]
for source,target,rect in crops:
    Image.open(root/source).crop(rect).save(root/target)
pairs=[('02_VE_HUE.png','01-ve-hue-1366.png','compare-ve-hue.png'),('03_KHAM_PHA.png','02-kham-pha-1366.png','compare-kham-pha.png'),('04_CAM_NANG.png','03-cam-nang-1366.png','compare-cam-nang.png'),('05_LUU_TRU.png','04-luu-tru-1366.png','compare-luu-tru.png')]
for reference,current,target in pairs:
    a=Image.open(root/reference).convert('RGB');b=Image.open(root/current).convert('RGB')
    aw=680;ah=round(a.height*aw/a.width);bh=round(b.height*aw/b.width)
    out=Image.new('RGB',(1380,max(ah,bh)+40),'#eeeeee');d=ImageDraw.Draw(out)
    d.text((10,10),'OWNER MOCKUP (normalized width)',fill='black');d.text((700,10),'CURRENT 1366x768 - 2026-10-25 (normalized width)',fill='black')
    out.paste(a.resize((aw,ah)),(0,40));out.paste(b.resize((aw,bh)),(700,40));out.save(root/target)
print('5 evidence crops and 4 normalized comparison sheets saved; originals unchanged.')
