/**
 * Traces the contours of a pencil drawing (leaf edges, fruit, petals, stems) with a
 * Canny edge detector, so a golden shimmer can run along the lines of the drawing.
 */
import sharp from 'sharp';

export interface OutlineOptions {
	/** Working width in pixels; the result is written at this width. */
	width?: number;
	/** Gaussian blur before the gradient – larger values ignore pencil hatching. */
	sigma?: number;
	/** Hysteresis thresholds as fractions of the strongest gradient. */
	low?: number;
	high?: number;
	/** Connected edge pieces shorter than this (in pixels) are dropped as texture. */
	minLength?: number;
	/** Final stroke width in pixels. */
	stroke?: number;
}

export async function drawingOutline(
	src: string | Buffer,
	dest: string,
	{
		width = 1400,
		sigma = 2.4,
		low = 0.085,
		high = 0.22,
		minLength = 110,
		stroke = 1.6
	}: OutlineOptions = {}
): Promise<void> {
	const { data, info } = await sharp(src)
		.flatten({ background: '#ffffff' })
		.resize({ width })
		.greyscale()
		.blur(sigma)
		.extractChannel(0)
		.raw()
		.toBuffer({ resolveWithObject: true });
	const w = info.width;
	const h = info.height;
	const at = (x: number, y: number) =>
		data[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))] ?? 255;

	// Sobel gradient.
	const mag = new Float32Array(w * h);
	const dir = new Uint8Array(w * h);
	let max = 0;
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const gx =
				-at(x - 1, y - 1) -
				2 * at(x - 1, y) -
				at(x - 1, y + 1) +
				at(x + 1, y - 1) +
				2 * at(x + 1, y) +
				at(x + 1, y + 1);
			const gy =
				-at(x - 1, y - 1) -
				2 * at(x, y - 1) -
				at(x + 1, y - 1) +
				at(x - 1, y + 1) +
				2 * at(x, y + 1) +
				at(x + 1, y + 1);
			const m = Math.hypot(gx, gy);
			const i = y * w + x;
			mag[i] = m;
			if (m > max) max = m;
			const angle = ((Math.atan2(gy, gx) * 180) / Math.PI + 180) % 180;
			dir[i] = angle < 22.5 || angle >= 157.5 ? 0 : angle < 67.5 ? 1 : angle < 112.5 ? 2 : 3;
		}
	}

	// Non-maximum suppression.
	const thin = new Float32Array(w * h);
	const offsets = [
		[1, 0],
		[1, 1],
		[0, 1],
		[-1, 1]
	] as const;
	for (let y = 1; y < h - 1; y++) {
		for (let x = 1; x < w - 1; x++) {
			const i = y * w + x;
			const [dx, dy] = offsets[dir[i] ?? 0]!;
			const m = mag[i] ?? 0;
			if (m >= (mag[i + dy * w + dx] ?? 0) && m >= (mag[i - dy * w - dx] ?? 0)) thin[i] = m;
		}
	}

	// Hysteresis, collecting connected pieces so short texture fragments can be dropped.
	const lo = low * max;
	const hi = high * max;
	const label = new Int32Array(w * h).fill(-1);
	const edge = new Uint8Array(w * h);
	const stack: number[] = [];
	for (let start = 0; start < w * h; start++) {
		if ((thin[start] ?? 0) < hi || label[start] !== -1) continue;
		const piece: number[] = [];
		stack.push(start);
		label[start] = start;
		while (stack.length) {
			const i = stack.pop()!;
			piece.push(i);
			const x = i % w;
			const y = (i - x) / w;
			for (let ny = y - 1; ny <= y + 1; ny++) {
				for (let nx = x - 1; nx <= x + 1; nx++) {
					if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
					const n = ny * w + nx;
					if (label[n] !== -1 || (thin[n] ?? 0) < lo) continue;
					label[n] = start;
					stack.push(n);
				}
			}
		}
		if (piece.length >= minLength) for (const i of piece) edge[i] = 255;
	}

	// Anti-aliased, slightly widened stroke as a white-on-transparent mask.
	const strokeMask = await sharp(edge, { raw: { width: w, height: h, channels: 1 } })
		.blur(Math.max(0.3, stroke / 2))
		.linear(2.2, 0)
		.extractChannel(0)
		.raw()
		.toBuffer();
	const rgba = Buffer.alloc(w * h * 4, 255);
	for (let i = 0; i < w * h; i++) rgba[i * 4 + 3] = strokeMask[i] ?? 0;
	await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
		.webp({ quality: 90, alphaQuality: 100, effort: 5 })
		.toFile(dest);
}
