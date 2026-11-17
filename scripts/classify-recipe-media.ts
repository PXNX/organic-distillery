/**
 * Sorts the images cut from each recipe PDF into photo, drawing, bottle and signature,
 * so the recipe section can show the dish photo and the handwritten sign-off only.
 */
import sharp from 'sharp';

const SITE_JSON = 'src/lib/content/site.json';
const OUT = 'src/lib/content/recipe-media.json';

type Kind = 'photo' | 'drawing' | 'bottle' | 'signature';

export function classify(width: number, height: number, saturation: number): Kind {
	const ratio = width / height;
	if (ratio > 2.5) return 'signature';
	if (saturation > 20) return 'photo';
	if (ratio < 0.5) return 'bottle';
	return 'drawing';
}

const site = await Bun.file(SITE_JSON).json();
const media: Record<string, { photo?: string; portrait?: boolean; signature?: string }> = {};

for (const page of site.pages) {
	const images: string[] = page.recipe?.images ?? [];
	if (images.length === 0) continue;
	const entry: (typeof media)[string] = {};
	for (const src of images) {
		const file = `static${src}`;
		const { width = 1, height = 1 } = await sharp(file).metadata();
		const [r, g, b] = (await sharp(file).flatten({ background: '#fff' }).stats()).channels;
		const saturation =
			Math.abs(r!.mean - g!.mean) + Math.abs(g!.mean - b!.mean) + Math.abs(r!.mean - b!.mean);
		const kind = classify(width, height, saturation);
		if (kind === 'photo' && !entry.photo) {
			entry.photo = src;
			entry.portrait = width < height;
		}
		if (kind === 'signature' && !entry.signature) entry.signature = src;
	}
	media[page.path] = entry;
}

await Bun.write(OUT, `${JSON.stringify(media, null, '\t')}\n`);
console.log(`classified ${Object.keys(media).length} recipes → ${OUT}`);
