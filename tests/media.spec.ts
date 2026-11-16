import { access } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { site } from '../src/lib/content/index.js';

const exists = async (path: string) => {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
};

const html = [
	site.header,
	site.footer,
	site.ageCheck,
	site.order,
	...site.pages.map((page) => page.html)
].join('\n');

describe('mirrored media', () => {
	it('uses WebP for every image reference', () => {
		const refs = [...html.matchAll(/\/media\/[^"')\s]+/g)].map((match) => match[0]);
		expect(refs.length).toBeGreaterThan(0);
		expect(refs.some((ref) => /\.(jpe?g|png)(\?|$)/i.test(ref))).toBe(false);
	});

	it('ships every referenced image', async () => {
		const refs = new Set([...html.matchAll(/\/media\/[^"')\s]+\.webp/g)].map((match) => match[0]));
		expect(refs.size).toBeGreaterThan(0);
		for (const ref of refs) {
			expect(await exists(`static${decodeURIComponent(ref)}`)).toBe(true);
		}
	});

	it('cuts the gin bottles out with transparency', async () => {
		const sharp = (await import('sharp')).default;
		for (const name of ['Ginn_200ml', 'Ginnie_200ml', 'Ginn_500ml', 'Ginnie_500ml']) {
			const path = `static/media/2017/11/${name}.webp`;
			const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({
				resolveWithObject: true
			});
			expect(info.width).toBeGreaterThan(400);
			expect(data[3]).toBe(0);
		}
	});
});
