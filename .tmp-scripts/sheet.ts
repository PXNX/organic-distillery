import sharp from 'sharp';
const [out, ...files] = process.argv.slice(2);
const tiles = await Promise.all(files.map(async (f) => {
  const img = await sharp(f).resize({ height: 600, fit: 'inside' }).png().toBuffer();
  const m = await sharp(img).metadata();
  return { img, w: m.width!, h: m.height! };
}));
const W = tiles.reduce((s, t) => s + t.w + 20, 20), H = 640;
await sharp({ create: { width: W, height: H, channels: 4, background: '#2a2620' } })
  .composite(tiles.map((t, i) => ({ input: t.img, left: 20 + tiles.slice(0, i).reduce((s, u) => s + u.w + 20, 0), top: 20 })))
  .png().toFile(out!);
