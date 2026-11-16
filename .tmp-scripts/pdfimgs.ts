import { PDFParse } from 'pdf-parse';
import sharp from 'sharp';
const out = process.argv[2]!;
for (const path of process.argv.slice(3)) {
  const parser = new PDFParse(new Uint8Array(await Bun.file(path).arrayBuffer()));
  const images = await parser.getImage({ imageBuffer: true, imageThreshold: 50 });
  await parser.destroy();
  let i = 0;
  for (const p of images.pages ?? []) for (const im of p.images ?? []) {
    i++;
    const name = `${out}/${path.split('/').pop()!.replace('.pdf','')}-${i}.png`;
    await sharp(Buffer.from(im.data)).png().toFile(name);
    const m = await sharp(name).metadata();
    console.log(name.split('/').pop(), m.width, m.height, m.channels);
  }
}
