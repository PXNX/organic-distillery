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

const paths = site.pages.map((page) => page.path);

describe('mirrored site content', () => {
	it('contains every crawled page', () => {
		expect(paths.length).toBeGreaterThanOrEqual(25);
		expect(paths).toContain('/');
		expect(paths).toContain('/ginn-ginnie');
		expect(paths).toContain('/essenzen/zitronen-verbena-geist');
	});

	it('has a unique path per page', () => {
		expect(new Set(paths).size).toBe(paths.length);
	});

	it('mirrors the site shell', () => {
		expect(site.header).toContain('site-logo');
		expect(site.footer).toContain('site-footer__company');
		expect(site.ageCheck).toContain('Sind Sie über 18');
		expect(site.order).toContain('o-order__item');
	});

	it('rewrites internal URLs to local paths', () => {
		for (const page of site.pages) {
			expect(page.html).not.toMatch(/https?:\/\/(?:www\.)?organic-distillery\.com/);
		}
	});

	it('ships every referenced media file', async () => {
		const refs = new Set<string>();
		for (const html of [site.header, site.footer, ...site.pages.map((page) => page.html)]) {
			for (const match of html.matchAll(/(?:href|src)="(\/media\/[^"]+)"/g)) {
				const ref = match[1];
				if (ref) refs.add(decodeURIComponent(ref));
			}
		}
		expect(refs.size).toBeGreaterThan(0);
		for (const ref of refs) expect(await exists(`static${ref}`)).toBe(true);
	});

	it('has a route component for every page', async () => {
		for (const path of paths) {
			expect(await exists(`src/routes${path === '/' ? '' : path}/+page.svelte`)).toBe(true);
		}
	});
});
