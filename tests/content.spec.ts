import { access, readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { catalog, essencePath } from '../src/lib/content/catalog.js';
import { datenschutz, impressum } from '../src/lib/content/legal.js';
import * as pages from '../src/lib/content/pages.js';
import { press } from '../src/lib/content/press.js';
import { essences, gins } from '../src/lib/content/products.js';
import { retailerSections } from '../src/lib/content/retailers.js';
import { flavorFamilies } from '../src/lib/features/flavor-wheel.js';

const exists = async (path: string) => {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
};

const contentFiles = ['pages', 'products', 'retailers', 'press', 'legal'].map(
	(name) => `src/lib/content/${name}.ts`
);

describe('site content', () => {
	it('has ten essences and two gins with unique slugs', () => {
		expect(essences).toHaveLength(10);
		expect(gins.map((gin) => gin.slug)).toEqual(['ginn', 'ginnie']);
		expect(new Set(essences.map((essence) => essence.slug)).size).toBe(10);
		expect(essences.some((essence) => /^\d/.test(essence.slug))).toBe(false);
	});

	it('keeps the aroma wheel in step with the essences', () => {
		const wheelPaths = flavorFamilies.flatMap((family) => family.essences.map((e) => e.path));
		expect(wheelPaths.sort()).toEqual(essences.map(essencePath).sort());
	});

	it('gives every essence a recipe card and a drawing', () => {
		for (const essence of essences) {
			expect(essence.recipe.pdf).toMatch(/\.pdf$/);
			expect(essence.recipe.letter.length).toBeGreaterThan(100);
			expect(essence.drawing).toMatch(/\.webp$/);
		}
	});

	it('lists retailers, press and legal texts', () => {
		const retailers = retailerSections.flatMap((s) => s.groups.flatMap((g) => g.retailers));
		expect(retailers.length).toBeGreaterThan(50);
		expect(press.length).toBeGreaterThanOrEqual(6);
		expect(impressum.sections[0]?.paragraphs.length).toBeGreaterThan(2);
		expect(datenschutz.sections.length).toBeGreaterThan(0);
		expect(pages.home.blocks.length).toBeGreaterThan(3);
	});

	it('never says Flaschengeist and holds no WordPress markup', async () => {
		for (const file of contentFiles) {
			const text = await readFile(file, 'utf8');
			expect(text).not.toMatch(/Flaschengeist/);
			expect(text).not.toMatch(/<(?:div|span|p|br)\b/);
			expect(text).not.toMatch(/https?:\/\/(?:www\.)?organic-distillery\.com/);
		}
	});

	it('ships every referenced media file, all images as WebP', async () => {
		const refs = new Set<string>();
		for (const file of contentFiles) {
			for (const match of (await readFile(file, 'utf8')).matchAll(/\/media\/[^"'\s)]+/g)) {
				refs.add(match[0]);
			}
		}
		for (const entry of catalog) refs.add(entry.image);
		expect(refs.size).toBeGreaterThan(40);
		for (const ref of refs) {
			expect(ref).not.toMatch(/\.(jpe?g|png)$/i);
			expect(await exists(`static${decodeURIComponent(ref)}`), ref).toBe(true);
		}
	});

	it('cuts the gin bottles out with transparency', async () => {
		const sharp = (await import('sharp')).default;
		for (const gin of gins) {
			for (const src of Object.values(gin.bottles)) {
				const { data, info } = await sharp(`static${src}`).ensureAlpha().raw().toBuffer({
					resolveWithObject: true
				});
				expect(info.width).toBeGreaterThan(400);
				expect(data[3]).toBe(0);
			}
		}
	});
});
