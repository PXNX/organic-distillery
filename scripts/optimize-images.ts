/**
 * Converts mirrored imagery to WebP and cuts the gin bottles out of their
 * white studio backgrounds. Run after `bun run mirror` (or via `bun run images`).
 */
import sharp from 'sharp';

const SITE_JSON = 'src/lib/content/site.json';
const CUTOUTS = [
	'media/2017/11/Ginn_200ml.jpg',
	'media/2017/11/Ginnie_200ml.jpg',
	'media/2017/11/Ginn_500ml.jpg',
	'media/2017/11/Ginnie_500ml.jpg'
];

const luminance = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
const saturation = (r: number, g: number, b: number) => Math.max(r, g, b) - Math.min(r, g, b);

/** Flood-fills the white background from the image borders. */
async function cutout(src: string, dest: string): Promise<void> {
	const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const { width: w, height: h, channels } = info;
	const pixels = w * h;
	const background = new Uint8Array(pixels);
	const queue = new Int32Array(pixels);
	let head = 0;
	let tail = 0;

	const isBackground = (i: number) => {
		const o = i * channels;
		const r = data[o] ?? 0;
		const g = data[o + 1] ?? 0;
		const b = data[o + 2] ?? 0;
		return luminance(r, g, b) > 185 && saturation(r, g, b) < 25;
	};
	const visit = (i: number) => {
		if (i < 0 || i >= pixels || background[i]) return;
		if (!isBackground(i)) return;
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
	for (let i = 0; i < pixels; i++) {
		const o = i * channels;
		const r = data[o] ?? 0;
		const g = data[o + 1] ?? 0;
		const b = data[o + 2] ?? 0;
		if (background[i]) {
			alpha[i] = 0;
			continue;
		}
		const x = i % w;
		const touching =
			(x > 0 && background[i - 1]) ||
			(x < w - 1 && background[i + 1]) ||
			(i >= w && background[i - w]) ||
			(i < pixels - w && background[i + w]);
		// Antialias the silhouette against white; keep saturated details (cork, label) solid.
		alpha[i] =
			touching && saturation(r, g, b) < 25
				? Math.max(0, Math.min(255, Math.round(((255 - luminance(r, g, b)) / 215) * 255)))
				: 255;
	}

	const blurred = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } })
		.blur(0.5)
		.raw()
		.toBuffer();
	const stride = blurred.length / pixels;
	const softAlpha = Buffer.from(
		Array.from({ length: pixels }, (_, i) => blurred[i * stride] ?? 255)
	);

	const rgba = Buffer.alloc(pixels * 4);
	for (let i = 0; i < pixels; i++) {
		rgba[i * 4] = data[i * channels] ?? 0;
		rgba[i * 4 + 1] = data[i * channels + 1] ?? 0;
		rgba[i * 4 + 2] = data[i * channels + 2] ?? 0;
		rgba[i * 4 + 3] = softAlpha[i] ?? 255;
	}

	await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
		.resize(w * 2, h * 2, { kernel: 'lanczos3' })
		.sharpen({ sigma: 0.6 })
		.webp({ quality: 84, effort: 5, alphaQuality: 90 })
		.toFile(dest);
	console.log(`cutout ${src} -> ${dest}`);
}

/** Converts a regular image, upscaling small product shots moderately. */
async function convert(src: string, dest: string): Promise<void> {
	const meta = await sharp(src).metadata();
	let image = sharp(src);
	if (meta.width && meta.width < 600) {
		image = image
			.resize({ width: Math.round(meta.width * 1.6), kernel: 'lanczos3' })
			.sharpen({ sigma: 0.5 });
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
	for (const match of html.matchAll(/\/media\/[^"')\s]+\.(?:jpg|jpeg|png)/gi)) {
		refs.add(match[0]);
	}
}

const renamed = new Map<string, string>();
for (const ref of refs) {
	renamed.set(ref, ref.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
}

const sources = new Set<string>([
	...CUTOUTS,
	...[...refs].map((ref) => decodeURIComponent(ref).replace(/^\//, ''))
]);
for (const relative of sources) {
	const source = `static/${relative}`;
	if (!(await Bun.file(source).exists())) continue;
	const dest = `static/${relative.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
	if (CUTOUTS.includes(relative)) await cutout(source, dest);
	else if (!(await Bun.file(dest).exists())) await convert(source, dest);
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
