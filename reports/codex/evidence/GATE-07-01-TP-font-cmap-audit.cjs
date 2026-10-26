const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const root = process.cwd();
function table(buffer, tag) {
  if (buffer.toString('ascii', 0, 4) === 'wOFF') {
    for (let i = 0; i < buffer.readUInt16BE(12); i++) {
      const p = 44 + 20 * i;
      if (buffer.toString('ascii', p, p + 4) !== tag) continue;
      const start = buffer.readUInt32BE(p + 4), compressed = buffer.readUInt32BE(p + 8), original = buffer.readUInt32BE(p + 12);
      const bytes = buffer.subarray(start, start + compressed);
      return compressed < original ? zlib.inflateSync(bytes) : bytes;
    }
  } else {
    for (let i = 0; i < buffer.readUInt16BE(4); i++) {
      const p = 12 + 16 * i;
      if (buffer.toString('ascii', p, p + 4) === tag) return buffer.subarray(buffer.readUInt32BE(p + 8), buffer.readUInt32BE(p + 8) + buffer.readUInt32BE(p + 12));
    }
  }
  throw new Error('Missing table ' + tag);
}
function has(cmap, c) {
  for (let i = 0; i < cmap.readUInt16BE(2); i++) {
    const s = cmap.readUInt32BE(8 + 8 * i), format = cmap.readUInt16BE(s);
    if (format === 12) {
      for (let j = 0; j < cmap.readUInt32BE(s + 12); j++) {
        const p = s + 16 + 12 * j, start = cmap.readUInt32BE(p), end = cmap.readUInt32BE(p + 4);
        if (c >= start && c <= end && cmap.readUInt32BE(p + 8) + c - start) return true;
      }
    }
    if (format === 4 && c <= 65535) {
      const n = cmap.readUInt16BE(s + 6) / 2, ends = s + 14, starts = ends + 2 * n + 2, deltas = starts + 2 * n, ranges = deltas + 2 * n;
      for (let j = 0; j < n; j++) {
        const start = cmap.readUInt16BE(starts + 2 * j);
        if (c < start || c > cmap.readUInt16BE(ends + 2 * j)) continue;
        const range = cmap.readUInt16BE(ranges + 2 * j), delta = cmap.readInt16BE(deltas + 2 * j);
        let glyph = range ? cmap.readUInt16BE(ranges + 2 * j + range + 2 * (c - start)) : (c + delta) & 65535;
        if (range && glyph) glyph = (glyph + delta) & 65535;
        if (glyph) return true;
      }
    }
  }
  return false;
}
const sample = 'ăâêôơưđĂÂÊÔƠƯĐ HUẾ Huế có chi hay? Về Huế Khám phá Huế Cẩm nang Lưu trú Di tích - Lịch sử Văn hoá - Tâm linh Di sản Trải nghiệm';
const required = [...new Set([...sample])];
const combining = [...new Set([...sample.normalize('NFD')])];
const allVietnamese = [...new Set([...required, ...Array.from({length: 90}, (_, i) => String.fromCodePoint(0x1EA0 + i))])];
const files = ['src/app/fonts/GeistVF.woff', 'C:/Windows/Fonts/arial.ttf', 'C:/Windows/Fonts/arialbd.ttf', 'C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/seguisb.ttf', 'C:/Windows/Fonts/segoeuib.ttf', 'C:/Windows/Fonts/pala.ttf', 'C:/Windows/Fonts/palai.ttf', 'C:/Windows/Fonts/times.ttf'];
const result = files.map(file => {
  const buffer = fs.readFileSync(path.isAbsolute(file) ? file : path.join(root, file));
  const cmap = table(buffer, 'cmap');
  return {file, container: buffer.toString('ascii', 0, 4), sample, missingSample: required.filter(c => !has(cmap, c.codePointAt(0))), missingNFD: combining.filter(c => !has(cmap, c.codePointAt(0))), missingVietnameseBlock: allVietnamese.filter(c => !has(cmap, c.codePointAt(0))).map(c => ({char:c,code:'U+'+c.codePointAt(0).toString(16).toUpperCase()}))};
});
fs.writeFileSync(path.join(root, 'reports/codex/evidence/GATE-07-01-TP-font-cmap-results.json'), JSON.stringify({method:'Read cmap from installed/project font files. Missing codepoints alone do not prove per-character browser fallback or a shaping failure.',result}, null, 2));
console.log(JSON.stringify(result.map(r => ({file:r.file,missingSample:r.missingSample,missingNFD:r.missingNFD,vietnameseMissingCount:r.missingVietnameseBlock.length})), null, 2));
