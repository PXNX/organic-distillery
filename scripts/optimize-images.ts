/**
 * Converts mirrored imagery to WebP and cuts the bottles out of their white
 * studio backgrounds. Run after `bun run mirror` (or via `bun run images`).
 */
import { readdir } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import sharp from 'sharp';
import { cutoutBottle } from './bottle-cutout.js';

const SITE_JSON = 'src/lib/content/site.json';
const force = process.env.FORCE === '1';
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

const luminance = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
const saturation = (r: number, g: number, b: number) => Math.max(r, g, b) - Math.min(r, g, b);

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

/** Removes the white paper from a botanical drawing, keeping the pencil lines. */
async function cutoutDrawing(src: string, dest: string): Promise<void> {
	const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const { width: w, height: h, channels } = info;
	const pixels = w * h;
	const background = new Uint8Array(pixels);
	const queue = new Int32Array(pixels);
	let head = 0;
	let tail = 0;

	const isPaper = (i: number) => {
		const o = i * channels;
		const r = data[o] ?? 0;
		const g = data[o + 1] ?? 0;
		const b = data[o + 2] ?? 0;
		return luminance(r, g, b) > 205 && saturation(r, g, b) < 20;
	};
	const visit = (i: number) => {
		if (i < 0 || i >= pixels || background[i] || !isPaper(i)) return;
		background[i] = 1;
		queue[tail++] = i;
	};
	for (let x = 0; x < w; x++) {
		visit(x);
		visit((h - 1) * w + x);
	}
	for (let y = 0; y < h; y++) {
		visit(y * w);
		visit(y * w + w - 1);
	}
	while (head < tail) {
		const i = queue[head++] ?? 0;
		const x = i % w;
		if (x > 0) visit(i - 1);
		if (x < w - 1) visit(i + 1);
		if (i >= w) visit(i - w);
		if (i < pixels - w) visit(i + w);
	}

	const alpha = Buffer.alloc(pixels);
	for (let i = 0; i < pixels; i++) alpha[i] = background[i] ? 0 : 255;

	// A thin outline mask lets the shimmer glow along the pencil strokes only.
	const outline = Buffer.alloc(pixels);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const i = y * w + x;
			const solid = (alpha[i] ?? 0) > 128;
			const neighbours = [
				x > 1 ? alpha[i - 2] : 0,
				x < w - 2 ? alpha[i + 2] : 0,
				y > 1 ? alpha[i - 2 * w] : 0,
				y < h - 2 ? alpha[i + 2 * w] : 0
			];
			if (neighbours.some((n) => (n ?? 0) > 128) !== solid) outline[i] = 255;
		}
	}
	const outlineRgba = Buffer.alloc(pixels * 4);
	for (let i = 0; i < pixels; i++) {
		outlineRgba[i * 4] = 255;
		outlineRgba[i * 4 + 1] = 255;
		outlineRgba[i * 4 + 2] = 255;
		outlineRgba[i * 4 + 3] = outline[i] ?? 0;
	}
	await sharp(outlineRgba, { raw: { width: w, height: h, channels: 4 } })
		.resize(Math.round(w * 1.3), Math.round(h * 1.3), { kernel: 'mks2021' })
		.webp({ quality: 90, effort: 5, alphaQuality: 100 })
		.toFile(dest.replace(/\.webp$/i, '-outline.webp'));

	const soft = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } })
		.blur(0.4)
		.raw()
		.toBuffer();
	const stride = soft.length / pixels;
	const softAlpha = Buffer.from(Array.from({ length: pixels }, (_, i) => soft[i * stride] ?? 255));

	const rgba = Buffer.alloc(pixels * 4);
	for (let i = 0; i < pixels; i++) {
		rgba[i * 4] = data[i * channels] ?? 0;
		rgba[i * 4 + 1] = data[i * channels + 1] ?? 0;
		rgba[i * 4 + 2] = data[i * channels + 2] ?? 0;
		rgba[i * 4 + 3] = softAlpha[i] ?? 255;
	}
	await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
		.resize(Math.round(w * 1.3), Math.round(h * 1.3), { kernel: 'mks2021' })
		.webp({ quality: 86, effort: 5, alphaQuality: 92 })
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

const site = await Bun.file(SITE_JSON).json();
const htmlParts = [
	site.header,
	site.footer,
	site.ageCheck,
	site.order,
	...site.pages.map((page: { html: string }) => page.html)
];
const refs = new Set<string>();
for (const html of htmlParts) {
	for (const match of html.matchAll(/\/media\/[^"')\s]+\.(?:jpg|jpeg|png|webp)/gi)) {
		refs.add(match[0]);
	}
}

const renamed = new Map<string, string>();
for (const ref of refs) {
	renamed.set(ref, ref.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
}

const sources = new Set<string>([...CUTOUTS, ...DRAWING_CUTOUTS]);
for (const ref of refs) {
	const relative = decodeURIComponent(ref).replace(/^\//, '');
	if (relative.endsWith('.webp')) {
		for (const ext of ['.jpg', '.png']) {
			const candidate = relative.replace(/\.webp$/i, ext);
			if (await Bun.file(`static/${candidate}`).exists()) sources.add(candidate);
		}
	} else {
		sources.add(relative);
	}
}

for (const relative of sources) {
	const source = `static/${relative}`;
	if (!(await Bun.file(source).exists())) continue;
	const dest = `static/${relative.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
	if (CUTOUTS.includes(relative)) await cutout(relative, dest);
	else if (DRAWING_CUTOUTS.includes(relative)) await cutoutDrawing(source, dest);
	else if (force || !(await Bun.file(dest).exists())) await convert(source, dest);
}

const rewriteRefs = (html: string) => {
	let out = html;
	for (const [from, to] of renamed) out = out.split(from).join(to);
	return out;
};

site.header = rewriteRefs(site.header);
site.footer = rewriteRefs(site.footer);
site.ageCheck = rewriteRefs(site.ageCheck);
site.order = rewriteRefs(site.order);
site.pages = site.pages.map((page: { html: string }) => ({
	...page,
	html: rewriteRefs(page.html)
}));
await Bun.write(SITE_JSON, JSON.stringify(site, null, 2) + '\n');
console.log(`\nOptimized ${renamed.size} images.`);
