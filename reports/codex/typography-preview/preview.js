
const params=new URLSearchParams(location.search);let view=params.get('view')||'overview';document.body.className=view+'-view';
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.body.className=view+'-view';history.replaceState(null,'','?view='+view);});
document.querySelectorAll('.norm').forEach(e=>e.dataset.original=e.innerHTML);
document.querySelector('#normalization').onchange=e=>{document.querySelectorAll('.norm').forEach(n=>n.innerHTML=n.dataset.original.normalize(e.target.value));};
document.querySelector('#size').onchange=e=>{document.documentElement.style.setProperty('--scale',e.target.value);};
async function validate(){
  const families=['CurrentGeist','BeVietnamPro','NotoSans','NotoSerif'];
  await Promise.all(families.flatMap(f=>[400,500,600,700].map(w=>document.fonts.load(w+' 20px '+f,'HUẾ Ắ Ệ Ữ'))));
  await Promise.all(['BeVietnamPro','NotoSans','NotoSerif'].map(f=>document.fonts.load('italic 400 20px '+f,'Huế có chi hay?')));
  await document.fonts.ready;
  const corpus=await (await fetch('corpus.json')).json();const c=document.createElement('canvas'),ctx=c.getContext('2d');
  const metrics=families.map(f=>{ctx.font='400 32px '+f;return {family:f,check:document.fonts.check('400 20px '+f,'HUẾ Ắ Ệ Ữ'),runs:corpus.tone_rows_nfc.flat().map(s=>{const n=s.normalize('NFD'),a=ctx.measureText(s),b=ctx.measureText(n);return {nfc:s,nfd:n,widthNFC:a.width,widthNFD:b.width,ascent:a.actualBoundingBoxAscent,descent:a.actualBoundingBoxDescent};})};});
  const data={status:document.fonts.status,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight,style:f.style})),metrics,note:'font.check và cmap không chứng minh per-glyph rendered face; canvas metrics không thay quan sát ink trên ảnh.'};
  document.querySelector('#metrics').textContent=JSON.stringify(data,null,2);document.querySelector('#status').textContent='READY · '+document.fonts.status+' · NFC/NFD corpus sẵn sàng · 3 family ứng viên tải local, chưa áp dụng production.';
}
validate().catch(e=>document.querySelector('#status').textContent='FONT ERROR: '+e.message);
