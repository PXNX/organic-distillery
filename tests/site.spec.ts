import { describe, expect, it } from 'vitest';
import { findPage, parseSite } from '../src/lib/mirror/site.js';
import { site } from '../src/lib/content/index.js';

describe('parseSite', () => {
	it('accepts the committed mirror structure', () => {
		expect(parseSite(site).pages).toHaveLength(site.pages.length);
	});

	it('rejects malformed input', () => {
		expect(() => parseSite(null)).toThrow(TypeError);
		expect(() => parseSite({ pages: 'nope' })).toThrow(TypeError);
		expect(() => parseSite({ ...site, header: 42 })).toThrow(TypeError);
		expect(() => parseSite({ ...site, pages: [{ path: '/x' }] })).toThrow(TypeError);
	});
});

describe('findPage', () => {
	it('returns the page for a known path', () => {
		expect(findPage(site, '/agb').title).toContain('AGB');
	});

	it('throws for an unknown path', () => {
		expect(() => findPage(site, '/does-not-exist')).toThrow(/No mirrored content/);
	});
});
