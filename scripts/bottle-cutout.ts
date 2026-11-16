/**
 * Cuts bottles out of white studio backgrounds at a higher output resolution.
 *
 * The silhouette is traced per row with sub-pixel edges taken from the
 * glass-to-paper luminance ramp. Rows where a white label reaches the glass
 * edge (so no contrast exists) are interpolated from the glass rows above and
 * below. Edge colours are pulled from just inside the glass so no white halo
 * survives the upscale.
 */
import sharp from 'sharp';

const luminance = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
const saturation = (r: number, g: number, b: number) => Math.max(r, g, b) - Math.min(r, g, b);
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

interface Edges {
	left: Float64Array;
	right: Float64Array;
	/** 1 when the row contains part of the bottle. */
	present: Uint8Array;
}

function traceEdges(data: Buffer, w: number, h: number, channels: number): Edges {
	const lum = (x: number, y: number) => {
		const o = (y * w + x) * channels;
		return luminance(data[o] ?? 255, data[o + 1] ?? 255, data[o + 2] ?? 255);
	};
	const sat = (x: number, y: number) => {
		const o = (y * w + x) * channels;
		return saturation(data[o] ?? 255, data[o + 1] ?? 255, data[o + 2] ?? 255);
	};
	// Glass, rubber, cork and label ink. Paper is bright and neutral.
	const isObject = (x: number, y: number) => {
		const l = lum(x, y);
		const s = sat(x, y);
		return (l < 160 && s < 95) || (s >= 22 && l < 238);
	};

	const left = new Float64Array(h).fill(Number.NaN);
	const right = new Float64Array(h).fill(Number.NaN);
	const glass = new Uint8Array(h);
	const present = new Uint8Array(h);

	for (let y = 0; y < h; y++) {
		let l = -1;
		let r = -1;
		for (let x = 0; x < w; x++) {
			if (!isObject(x, y)) continue;
			if (l < 0) l = x;
			r = x;
		}
		if (l < 0 || r - l < 2) continue;
		present[y] = 1;

		// Sub-pixel position from the paper→glass ramp around the first object pixel.
		const inner = (x: number) => lum(clamp(x, 0, w - 1), y);
		const paper = 250;
		const subEdge = (x: number, step: 1 | -1) => {
			const dark = Math.min(inner(x + step), inner(x + 2 * step));
			const span = Math.max(paper - dark, 40);
			const outside = x - step >= 0 && x - step < w ? inner(x - step) : paper;
			const coverOutside = clamp((paper - outside) / span);
			const coverEdge = clamp((paper - inner(x)) / span);
			// Boundary measured from the outer side of pixel x.
			return step === 1 ? x + 1 - coverEdge - coverOutside : x + coverEdge + coverOutside;
		};
		left[y] = subEdge(l, 1);
		right[y] = subEdge(r, -1);
		// A glass row is mostly dark; label rows only carry a little ink (logo, type).
		let darkCount = 0;
		for (let x = l; x <= r; x++) if (inner(x) < 120) darkCount++;
		glass[y] = inner(l + 1) < 120 && inner(r - 1) < 120 && darkCount > (r - l) * 0.6 ? 1 : 0;
	}

	// Only full-width body rows anchor the label bridge (not the neck or a dark logo).
	let bodyWidth = 0;
	for (let y = 0; y < h; y++) {
		if (glass[y]) bodyWidth = Math.max(bodyWidth, (right[y] ?? 0) - (left[y] ?? 0));
	}
	for (let y = 0; y < h; y++) {
		if (glass[y] && (right[y] ?? 0) - (left[y] ?? 0) < bodyWidth * 0.7) glass[y] = 0;
	}

	// Label rows: white label meets paper, so take the glass edge above and below.
	const glassRows = [...glass.keys()].filter((y) => glass[y]);
	for (let i = 0; i + 1 < glassRows.length; i++) {
		const a = glassRows[i] ?? 0;
		const b = glassRows[i + 1] ?? 0;
		if (b - a < 2) continue;
		const widthA = (right[a] ?? 0) - (left[a] ?? 0);
		const widthB = (right[b] ?? 0) - (left[b] ?? 0);
		// Only bridge straight body sections, never the shoulder or neck.
		if (Math.abs(widthA - widthB) > Math.max(widthA, widthB) * 0.08) continue;
		for (let y = a + 1; y < b; y++) {
			const t = (y - a) / (b - a);
			left[y] = (left[a] ?? 0) * (1 - t) + (left[b] ?? 0) * t;
			right[y] = (right[a] ?? 0) * (1 - t) + (right[b] ?? 0) * t;
			present[y] = 1;
		}
	}

	// Drop the cast shadow and stray specks: keep the tallest run of rows.
	let best: [number, number] = [0, -1];
	let start = -1;
	for (let y = 0; y <= h; y++) {
		if (y < h && present[y]) {
			if (start < 0) start = y;
		} else if (start >= 0) {
			if (y - 1 - start > best[1] - best[0]) best = [start, y - 1];
			start = -1;
		}
	}
	for (let y = 0; y < h; y++) if (y < best[0] || y > best[1]) present[y] = 0;

	// The shadow under the bottle reads as a wide, pale row: trim rows that suddenly widen.
	for (let y = best[1]; y > best[0] + 10; y--) {
		const above = (right[y - 3] ?? 0) - (left[y - 3] ?? 0);
		const here = (right[y] ?? 0) - (left[y] ?? 0);
		if (here > above * 1.06 || glass[y] === 0) present[y] = 0;
		else break;
	}

	// Gentle vertical smoothing where the outline is nearly straight.
	const smooth = (edge: Float64Array) => {
		const copy = Float64Array.from(edge);
		for (let y = 2; y < h - 2; y++) {
			if (!present[y] || !present[y - 2] || !present[y + 2]) continue;
			const values = [copy[y - 2], copy[y - 1], copy[y], copy[y + 1], copy[y + 2]].map(
				(v) => v ?? 0
			);
			const mean = values.reduce((s, v) => s + v, 0) / 5;
			if (Math.max(...values) - Math.min(...values) < 1.5) edge[y] = mean;
		}
	};
	smooth(left);
	smooth(right);
	return { left, right, present };
}

/** Writes a transparent, upscaled WebP cut-out of a bottle photographed on white. */
export async function cutoutBottle(
	src: string | Buffer,
	dest: string,
	{ scale = 4, crop }: { scale?: number; crop?: { top?: number; bottom?: number } } = {}
): Promise<void> {
	const { data, info } = await sharp(src)
		.flatten({ background: '#ffffff' })
		.raw()
		.toBuffer({ resolveWithObject: true });
	const { width: w, height: h, channels } = info;
	const edges = traceEdges(data, w, h, channels);
	if (crop?.top) for (let y = 0; y < crop.top; y++) edges.present[y] = 0;
	if (crop?.bottom) for (let y = h - crop.bottom; y < h; y++) edges.present[y] = 0;

	const W = Math.round(w * scale);
	const H = Math.round(h * scale);
	const up = await sharp(data, { raw: { width: w, height: h, channels } })
		.resize(W, H, { kernel: 'mks2021' })
		.raw()
		.toBuffer();
	const upChannels = up.length / (W * H);

	// Slight inset removes the anti-aliased paper rim.
	const inset = 0.45;
	const edgeAt = (edge: Float64Array, sy: number) => {
		const y0 = Math.floor(sy);
		const y1 = Math.min(h - 1, y0 + 1);
		const t = sy - y0;
		const p0 = edges.present[y0] === 1;
		const p1 = edges.present[y1] === 1;
		if (p0 && p1) return (edge[y0] ?? 0) * (1 - t) + (edge[y1] ?? 0) * t;
		if (p0 && t < 0.5) return edge[y0] ?? Number.NaN;
		if (p1 && t >= 0.5) return edge[y1] ?? Number.NaN;
		return Number.NaN;
	};

	const rgba = Buffer.alloc(W * H * 4);
	for (let Y = 0; Y < H; Y++) {
		const sy = clamp((Y + 0.5) / scale - 0.5, 0, h - 1);
		const l = edgeAt(edges.left, sy);
		const r = edgeAt(edges.right, sy);
		if (Number.isNaN(l) || Number.isNaN(r)) continue;
		const left = (l + inset) * scale;
		const right = (r - inset) * scale;
		// Colour donors sit about two source pixels inside the glass.
		const donorLeft = Math.min(Math.round(left + 2.2 * scale), W - 1);
		const donorRight = Math.max(Math.round(right - 2.2 * scale), 0);
		for (let X = Math.max(0, Math.floor(left)); X <= Math.min(W - 1, Math.ceil(right)); X++) {
			const cover = clamp(Math.min(X + 1 - left, right - X));
			if (cover <= 0) continue;
			const o = (Y * W + X) * 4;
			let from = (Y * W + X) * upChannels;
			if (X - left < 1.6 * scale && donorLeft < right) from = (Y * W + donorLeft) * upChannels;
			else if (right - X < 1.6 * scale && donorRight > left)
				from = (Y * W + donorRight) * upChannels;
			rgba[o] = up[from] ?? 0;
			rgba[o + 1] = up[from + 1] ?? 0;
			rgba[o + 2] = up[from + 2] ?? 0;
			rgba[o + 3] = Math.round(cover * 255);
		}
	}

	// Soften the top and bottom contours, which are traced per source row.
	const alpha = Buffer.alloc(W * H);
	for (let i = 0; i < W * H; i++) alpha[i] = rgba[i * 4 + 3] ?? 0;
	const soft = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
		.blur(Math.max(0.5, scale * 0.3))
		.raw()
		.toBuffer();
	const stride = soft.length / (W * H);
	for (let i = 0; i < W * H; i++) {
		const hard = alpha[i] ?? 0;
		const blurred = soft[i * stride] ?? 0;
		// Never grow the mask (that would bring paper back), only feather it.
		rgba[i * 4 + 3] = Math.min(hard, Math.max(blurred, hard === 255 ? 230 : 0));
	}

	await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
		.trim({ threshold: 0 })
		.sharpen({ sigma: 0.8, m1: 0.4, m2: 1.2 })
		.webp({ quality: 90, effort: 6, alphaQuality: 100, smartSubsample: true })
		.toFile(dest);
}
