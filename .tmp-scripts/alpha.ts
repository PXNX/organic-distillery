import sharp from 'sharp';
for (const f of process.argv.slice(2)) {
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let t = 0, partial = 0, white = 0; const n = info.width * info.height;
  for (let i = 0; i < n; i++) { const a = data[i*4+3]!; if (a === 0) t++; else if (a < 255) partial++; if (a>200 && data[i*4]!>245 && data[i*4+1]!>245 && data[i*4+2]!>245) white++; }
  console.log(f.split('/').pop(), info.width, info.height, 'transparent', (t/n*100).toFixed(1)+'%', 'partial', (partial/n*100).toFixed(1)+'%', 'opaque-white', (white/n*100).toFixed(1)+'%');
}
