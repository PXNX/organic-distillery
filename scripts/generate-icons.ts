/** Rasterises the PWA icon for the manifest. Run with `bun run icons`. */
import sharp from 'sharp';

const svg = Buffer.from(await Bun.file('static/icons/icon.svg').text());
for (const size of [32, 192, 512]) {
	const name = size === 32 ? 'favicon-32' : `icon-${size}`;
	await sharp(svg).resize(size, size).png().toFile(`static/icons/${name}.png`);
}
await Bun.write('static/favicon.svg', await Bun.file('static/icons/icon.svg').text());
console.log('Generated favicon and PWA icons (32, 192, 512).');
