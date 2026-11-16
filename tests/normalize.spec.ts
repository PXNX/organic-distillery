import { describe, expect, it } from 'vitest';
import {
	addImageHints,
	localPath,
	rewriteHtml,
	routeDir,
	routeSource,
	SITE_ORIGIN
} from '../src/lib/mirror/normalize.js';

describe('localPath', () => {
	it('maps internal URLs to root-relative paths', () => {
		expect(localPath(`${SITE_ORIGIN}/media/a.jpg`)).toBe('/media/a.jpg');
		expect(localPath('https://www.organic-distillery.com/agb/')).toBe('/agb');
		expect(localPath('/ginn-ginnie')).toBe('/ginn-ginnie');
	});

	it('rejects external and malformed URLs', () => {
		expect(localPath('https://example.com/foo')).toBeNull();
		expect(localPath('mailto:contact@organic-distillery.com')).toBeNull();
	});
});

describe('rewriteHtml', () => {
	it('rewrites absolute URLs and trims padded attributes', () => {
		expect(
			rewriteHtml(
				'<a href="https://www.organic-distillery.com/agb/ "><img src="https://www.organic-distillery.com/media/x.jpg"></a>'
			)
		).toBe('<a href="/agb/"><img src="/media/x.jpg"></a>');
	});
});

describe('addImageHints', () => {
	it('makes the first image eager and the rest lazy', () => {
		const html = addImageHints('<img src="/a.jpg"><img src="/b.jpg">');
		expect(html).toContain('<img decoding="async" fetchpriority="high" src="/a.jpg">');
		expect(html).toContain('<img loading="lazy" decoding="async" src="/b.jpg">');
	});

	it('is idempotent and replaces existing hints', () => {
		const once = addImageHints('<img src="/a.jpg" fetchpriority="high"><img src="/b.jpg">');
		expect(addImageHints(once)).toBe(once);
	});
});

describe('route generation', () => {
	it('maps the homepage and nested paths to route directories', () => {
		expect(routeDir('/')).toBe('src/routes');
		expect(routeDir('/essenzen/137-2')).toBe('src/routes/essenzen/137-2');
	});

	it('generates a route that renders MirroredPage with the right path', () => {
		const source = routeSource('/kontakt');
		expect(source).toContain("from '#lib/components/MirroredPage.svelte'");
		expect(source).toContain('path="/kontakt"');
	});
});
