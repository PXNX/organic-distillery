/**
 * Converts the imagery to WebP and cuts the bottles out of their white
 * studio backgrounds (`bun run images`).
 */
import { readdir } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import sharp from 'sharp';
import { cutoutBottle } from './bottle-cutout.js';

const force = process.env.FORCE === '1';
/** `ONLY=drawings` re-cuts just the botanical drawings. */
const only = process.env.ONLY;
const CUTOUTS = [
	'media/2017/11/Ginn_200ml.jpg',
	'media/2017/11/Ginnie_200ml.jpg',
	'media/2017/11/Ginn_500ml.jpg',
	'media/2017/11/Ginnie_500ml.jpg',
	'media/2017/10/organicdistillery-minze_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-eucalyptus_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-rosen-monarde_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-koriander_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-silber-wermut_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-cistrose_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-mandarine_front_FIN_schatten.jpg',
	'media/2017/11/organicdistillery-zitronen-verbena_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-brombeer_front_FIN_schatten.jpg',
	'media/2017/10/organicdistillery-vogelbeere_front_FIN_schatten.jpg'
];

const DRAWING_CUTOUTS = [
	'media/2017/10/Coriandrum_Sativum_Koriander.jpg',
	'media/2017/10/Lippiapoly_Stacha_ArgMinze.jpg',
	'media/2017/10/Rubus_Fruticosus_Brombeere.jpg',
	'media/2017/10/Cistus_Ladanifer_Cistrose.jpg',
	'media/2017/10/Eucalyptus_Globulus_Eucalyptus.jpg',
	'media/2017/10/Citrus_Nobilis_Mandarine.jpg',
	'media/2017/10/Monarda_Fistulosa_Rosenmonarde.jpg',
	'media/2017/10/Artemisia_Ludoviciana_Silberwermut.jpg',
	'media/2017/10/Sorbus_Aucuparia_Vogelbeere.jpg',
	'media/2017/11/Aloysia_Citriodora_Zitronenverbena.jpg'
];


/** Recipe PDFs embed the essence bottles larger than the mirrored product shots. */
const ESSENCE_PDF: Record<string, string> = {
	minze: 'Grün_Arg-Minze',
	eucalyptus: 'Grün_Eucalyptus',
	'rosen-monarde': 'Floral_Rosenmonarde',
	koriander: 'Floral_Koriander',
	'silber-wermut': 'Herbal_Silber-Wermut',
	cistrose: 'Herbal_Cistrose',
	mandarine: 'Zitrus_Mandarine',
	'zitronen-verbena': 'Zitrus_Verbena',
	brombeer: 'Fruchtig_Brombeere',
	vogelbeere: 'Fruchtig_Vogelbeere'
};

const pdfFiles = (await readdir('static/media/2017/10')).filter((name) => name.endsWith('.pdf'));

/** Returns the tall bottle image embedded in an essence's recipe PDF, if any. */
async function pdfBottle(relative: string): Promise<Buffer | null> {
	const key = relative.match(/organicdistillery-(.+)_front_FIN_schatten/)?.[1];
	const pdfName = key ? ESSENCE_PDF[key] : undefined;
	if (!pdfName) return null;
	const file = pdfFiles.find((name) => name.normalize('NFC').includes(pdfName.normalize('NFC')));
	if (!file) return null;
	const parser = new PDFParse(
		new Uint8Array(await Bun.file(`static/media/2017/10/${file}`).arrayBuffer())
	);
	const images = await parser.getImage({ imageBuffer: true, imageThreshold: 50 });
	await parser.destroy();
	for (const page of images.pages ?? []) {
		for (const image of page.images ?? []) {
			if (image.data && image.height > image.width * 2.5) return Buffer.from(image.data);
		}
	}
	return null;
}

async function cutout(relative: string, dest: string): Promise<void> {
	const fromPdf = await pdfBottle(relative);
	if (fromPdf) await cutoutBottle(fromPdf, dest, { scale: 3 });
	else await cutoutBottle(`static/${relative}`, dest, { scale: 4 });
	console.log(`cutout ${fromPdf ? 'pdf' : relative} -> ${dest}`);
}

/**
 * Lifts a pencil drawing off its paper: darkness becomes opacity, so the paper
 * disappears everywhere (also between leaves) and the shading keeps its gradation.
 */
async function cutoutDrawing(src: string, dest: string): Promise<void> {
	const { data, info } = await sharp(src)
		.flatten({ background: '#ffffff' })
		.greyscale()
		.extractChannel(0)
		.raw()
		.toBuffer({ resolveWithObject: true });
	const { width: w, height: h } = info;
	// Paper is not perfectly white; everything brighter than PAPER is fully transparent.
	const PAPER = 238;
	const INK = 40;
	const rgba = Buffer.alloc(w * h * 4);
	for (let i = 0; i < w * h; i++) {
		const l = data[i] ?? 255;
		const t = Math.min(1, Math.max(0, (PAPER - l) / (PAPER - INK)));
		const alpha = Math.round(255 * Math.pow(t, 0.85));
		// Graphite ink: a warm dark grey, the lightness lives in the alpha.
		rgba[i * 4] = 34;
		rgba[i * 4 + 1] = 31;
		rgba[i * 4 + 2] = 28;
		rgba[i * 4 + 3] = alpha;
	}
	await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
		.resize(Math.round(w * 1.3), Math.round(h * 1.3), { kernel: 'mks2021' })
		.webp({ quality: 90, effort: 5, alphaQuality: 100 })
		.toFile(dest);
	console.log(`drawing ${src} -> ${dest}`);
}

/** Converts a regular image, upscaling small product shots with mks2021. */
async function convert(src: string, dest: string): Promise<void> {
	const meta = await sharp(src).metadata();
	let image = sharp(src);
	if (meta.width && meta.width < 600) {
		image = image
			.resize({ width: Math.round(meta.width * 2.5), kernel: 'mks2021' })
			.sharpen({ sigma: 0.4 });
	}
	await image.webp({ quality: 80, effort: 5 }).toFile(dest);
	console.log(`webp ${src} -> ${dest}`);
}

// Every JPEG/PNG under static/media gets a WebP sibling; the site only references the WebPs.
const sources = new Set<string>(
	only === 'drawings' ? DRAWING_CUTOUTS : [...CUTOUTS, ...DRAWING_CUTOUTS]
);
for (const entry of only ? [] : await readdir('static/media', { recursive: true })) {
	if (/\.(jpe?g|png)$/i.test(entry)) sources.add(`media/${entry}`);
}

let converted = 0;
for (const relative of sources) {
	const source = `static/${relative}`;
	if (!(await Bun.file(source).exists())) continue;
	const dest = `static/${relative.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
	if (CUTOUTS.includes(relative)) await cutout(relative, dest);
	else if (DRAWING_CUTOUTS.includes(relative)) await cutoutDrawing(source, dest);
	else if (force || !(await Bun.file(dest).exists())) await convert(source, dest);
	else continue;
	converted++;
}
console.log(`\nOptimized ${converted} images.`);
