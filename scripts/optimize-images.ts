/**
 * Converts mirrored imagery to WebP and cuts the bottles out of their white
 * studio backgrounds. Run after `bun run mirror` (or via `bun run images`).
 */
import sharp from 'sharp';

const SITE_JSON = 'src/lib/content/site.json';
const force = process.env.FORCE === '1';
const CUTOUTS = [
	'media/2017/11/Ginn_200ml.jpg',
	'media/2017/11/Ginnie_200ml.jpg',
	'media/2017/11/Ginn_500ml.jpg',
	'media/2017/11/Ginnie_500ml.jpg'
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

/**
 * Cuts a bottle out using a per-row silhouette: the first and last non-white
 * pixel of each row define the object, so white labels stay fully intact.
 */
async function cutout(src: string, dest: string): Promise<void> {
	const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const { width: w, height: h, channels } = info;
	const pixels = w * h;
	const alpha = Buffer.alloc(pixels);
	const pixel = (x: number, y: number) => {
		const o = (y * w + x) * channels;
		return [data[o] ?? 0, data[o + 1] ?? 0, data[o + 2] ?? 0] as const;
	};
	const dark = (x: number, y: number) => {
		const [r, g, b] = pixel(x, y);
		return luminance(r, g, b) < 110 && saturation(r, g, b) < 60;
	};

	const rowLeft = new Int32Array(h).fill(w);
	const rowRight = new Int32Array(h).fill(-1);
	const leftAt = (y: number) => rowLeft[y] ?? w;
	const rightAt = (y: number) => rowRight[y] ?? -1;
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (!dark(x, y)) continue;
			if (x < leftAt(y)) rowLeft[y] = x;
			if (x > rightAt(y)) rowRight[y] = x;
		}
	}

	let maxWidth = 0;
	for (let y = 0; y < h; y++) {
		if (rightAt(y) > leftAt(y)) maxWidth = Math.max(maxWidth, rightAt(y) - leftAt(y));
	}
	const wide = Array.from({ length: h }, (_, y) =>
		rightAt(y) - leftAt(y) >= maxWidth * 0.6 ? y : -1
	).filter((y) => y >= 0);
	const firstWide = wide[0] ?? 0;
	const lastWide = wide[wide.length - 1] ?? h - 1;

	const nearestWide = (y: number) => {
		const below = wide.find((row) => row >= y);
		let above = -1;
		for (const row of wide) {
			if (row > y) break;
			above = row;
		}
		return { above, below: below ?? -1 };
	};

	for (let y = 0; y < h; y++) {
		let left = leftAt(y);
		let right = rightAt(y);
		if (right - left < maxWidth * 0.6 && y >= firstWide && y <= lastWide) {
			const { above, below } = nearestWide(y);
			if (above >= 0 && below >= 0 && above !== below) {
				const t = (y - above) / (below - above);
				left = Math.round(leftAt(above) + (leftAt(below) - leftAt(above)) * t);
				right = Math.round(rightAt(above) + (rightAt(below) - rightAt(above)) * t);
			} else if (y <= firstWide) {
				left = leftAt(firstWide);
				right = rightAt(firstWide);
			} else if (y >= lastWide) {
				left = leftAt(lastWide);
				right = rightAt(lastWide);
			}
		}
		const hasDark = rightAt(y) > leftAt(y);
		const inBottle = hasDark || y >= firstWide - 40;
		for (let x = 0; x < w; x++) {
			const i = y * w + x;
			if (!inBottle || left >= right || x < left || x > right) {
				alpha[i] = 0;
				continue;
			}
			alpha[i] = 255;
		}
	}

	const blurred = await sharp(alpha, { raw: { width: w, height: h, channels: 1 } })
		.blur(0.6)
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
		.resize(w * 2.5, h * 2.5, { kernel: 'mks2021' })
		.sharpen({ sigma: 0.4 })
		.webp({ quality: 84, effort: 5, alphaQuality: 90 })
		.toFile(dest);
	console.log(`cutout ${src} -> ${dest}`);
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
	if (CUTOUTS.includes(relative)) await cutout(source, dest);
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
