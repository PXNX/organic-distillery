import sharp from 'sharp';
const [src, out, l, t, w, h] = process.argv.slice(2);
const piece = await sharp(src!).extract({ left: +l!, top: +t!, width: +w!, height: +h! }).png().toBuffer();
await sharp({ create: { width: +w!, height: +h!, channels: 4, background: '#3a2f22' } }).composite([{ input: piece }]).png().toFile(out!);
