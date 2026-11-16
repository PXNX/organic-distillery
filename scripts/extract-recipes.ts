/** Reads the mirrored recipe PDFs into site.json, including their images. */
import { mkdir } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import sharp from 'sharp';

const SITE_JSON = 'src/lib/content/site.json';
const OUT_DIR = 'static/media/recipes';

const clean = (text: string): string =>
	text
		.replace(/(\w)-\n(\w)/g, '$1$2')
		.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '')
		.replace(/www\.organic-distillery\.com[^\n]*/g, '')
		.replace(/Weitere Inspirationen, Informationen und Bestellungen:/g, '')
		.replace(/[ \t]+/g, ' ')
		.replace(/\n+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();

await mkdir(OUT_DIR, { recursive: true });
const site = await Bun.file(SITE_JSON).json();
let count = 0;

for (const page of site.pages) {
	const recipe = page.recipe;
	if (!recipe?.href) continue;
	const path = `static${decodeURIComponent(recipe.href)}`;
	if (!(await Bun.file(path).exists())) {
		console.error('missing', path);
		continue;
	}

	const parser = new PDFParse(new Uint8Array(await Bun.file(path).arrayBuffer()));
	const { text } = await parser.getText();
	const images = await parser.getImage({ imageBuffer: true, imageThreshold: 160 });
	await parser.destroy();

	recipe.text = clean(text);
	recipe.images = [];

	const slug = page.path.replace(/^\/essenzen\//, '').replace(/[^a-z0-9-]/gi, '-');
	let index = 0;
	for (const pdfPage of images.pages ?? []) {
		for (const image of pdfPage.images ?? []) {
			if (!image.data) continue;
			const dest = `${OUT_DIR}/${slug}-${++index}.webp`;
			if (await Bun.file(dest).exists()) {
				recipe.images.push(`/media/recipes/${slug}-${index}.webp`);
				continue;
			}
			try {
				let pipeline = sharp(Buffer.from(image.data));
				const meta = await pipeline.metadata();
				if (meta.width && meta.width > 900) {
					pipeline = pipeline.resize({ width: 900, kernel: 'mks2021' });
				}
				await pipeline.webp({ quality: 82, effort: 5 }).toFile(dest);
				recipe.images.push(`/media/recipes/${slug}-${index}.webp`);
			} catch (error) {
				console.error('image failed', dest, error);
			}
		}
	}
	count++;
	console.log(
		`extracted ${page.path}: ${recipe.text.length} chars, ${recipe.images.length} images`
	);
}

await Bun.write(SITE_JSON, JSON.stringify(site, null, 2) + '\n');
console.log(`\nExtracted ${count} recipes.`);
