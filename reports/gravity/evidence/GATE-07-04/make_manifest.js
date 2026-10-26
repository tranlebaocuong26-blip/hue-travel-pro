const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const base = 'A:\\trí tuệ nhân tạo\\BAI_3\\hue-travel-pro';
const files = [
  'src/app/page.tsx',
  'src/app/an-uong/page.tsx',
  'src/components/navigation/AdaptiveNavigation.tsx',
  'src/data/foods.ts',
  'src/lib/search.ts',
  'src/types/content.ts',
  'src/types/navigation.ts',
  'src/components/layout/Shell.tsx',
  'public/images/cards/card_di_tich.png',
  'public/images/cards/card_van_hoa.png',
  'public/images/cards/card_am_thuc.png'
];

let csv = 'file,sha256,size_bytes\n';
for (const f of files) {
  const p = path.join(base, f);
  if (fs.existsSync(p)) {
    const buf = fs.readFileSync(p);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    csv += `${f},${hash},${buf.length}\n`;
  }
}

fs.writeFileSync(path.join(base, 'reports/gravity/evidence/GATE-07-04/manifest.csv'), csv, 'utf8');
console.log(csv);
