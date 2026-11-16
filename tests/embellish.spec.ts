import { describe, expect, it } from 'vitest';
import {
	DOCUMENTARY_URL,
	addDocumentaryPress,
	botanicalPlate,
	essenceName,
	extractRecipeLink,
	insertHerbBackdrop,
	latinNameFromSrc,
	wrapBotanicalPlates
} from '../src/lib/mirror/embellish.js';

const drawing =
	'<div class="l-col l-6/12@tablet single-column"><img class="single-column__img" src="/media/2017/10/Eucalyptus_Globulus_Eucalyptus.jpg" alt=""></div>';

describe('latinNameFromSrc', () => {
	it('derives a readable botanical name from the filename', () => {
		expect(latinNameFromSrc('/media/2017/10/Eucalyptus_Globulus_Eucalyptus.jpg')).toBe(
			'Eucalyptus Globulus Eucalyptus'
		);
	});
});

describe('essenceName', () => {
	it('strips the site tagline from a page title', () => {
		expect(essenceName('Eucalyptus Geist – Von der Natur begeistert')).toBe('Eucalyptus Geist');
	});
});

describe('wrapBotanicalPlates', () => {
	it('replaces a bare drawing with a captioned figure', () => {
		const html = wrapBotanicalPlates(drawing, 'Eucalyptus Geist – Von der Natur begeistert');
		expect(html).toContain('<figure class="l-col l-6/12@tablet single-column botanical-plate">');
		expect(html).toContain('Eucalyptus Globulus Eucalyptus');
		expect(html).toContain('Eucalyptus Geist');
		expect(html).toContain('<figcaption');
	});

	it('is idempotent', () => {
		const once = wrapBotanicalPlates(drawing, 'Eucalyptus Geist');
		expect(wrapBotanicalPlates(once, 'Eucalyptus Geist')).toBe(once);
	});
});

describe('extractRecipeLink', () => {
	it('extracts a PDF link and removes the bare markup', () => {
		const html =
			'<p>Some text</p><p><a href="/media/2017/10/card.pdf">Rezeptkarte herunterladen</a></p>';
		const result = extractRecipeLink(html);
		expect(result.recipe).toEqual({
			href: '/media/2017/10/card.pdf',
			label: 'Rezeptkarte herunterladen'
		});
		expect(result.html).not.toContain('card.pdf');
		expect(result.html).toContain('Some text');
	});

	it('leaves pages without a recipe untouched', () => {
		expect(extractRecipeLink('<p>Hello</p>').recipe).toBeNull();
	});
});

describe('insertHerbBackdrop', () => {
	const page =
		'<div class="o-product__img-wrapper"><img class="single-column__img" src="/media/herb.webp"><img src="/media/bottle.webp" class="wp-post-image"></div>';

	it('places the herb behind the bottle with a shimmer layer', () => {
		const html = insertHerbBackdrop(page);
		expect(html).toContain('essence-herb__shimmer');
		expect(html).toContain("--herb: url('/media/herb.webp')");
		expect(html.indexOf('essence-herb')).toBeLessThan(html.indexOf('wp-post-image'));
	});

	it('is idempotent', () => {
		const once = insertHerbBackdrop(page);
		expect(insertHerbBackdrop(once)).toBe(once);
	});
});

describe('addDocumentaryPress', () => {
	const pressHtml =
		'<div class="o-module o-press o-wrapper"><div class="o-press__title o-press__item"><span>Presse</span></div><ul><li>Alt</li></ul></div>';

	it('adds the documentary as a press item', () => {
		const html = addDocumentaryPress(pressHtml);
		expect(html).toContain(DOCUMENTARY_URL);
		expect(html).toContain('20.08.2021');
		expect(html).toContain('SWR / ARD Mediathek');
		expect(html.indexOf(DOCUMENTARY_URL)).toBeLessThan(html.indexOf('Alt'));
	});

	it('is idempotent', () => {
		const once = addDocumentaryPress(pressHtml);
		expect(addDocumentaryPress(once)).toBe(once);
	});
});

describe('botanicalPlate', () => {
	it('finds the drawing on an essence detail page', () => {
		const page = {
			path: '/essenzen/eucalyptus-geist',
			title: 'Eucalyptus Geist – Von der Natur begeistert',
			html: drawing
		};
		expect(botanicalPlate(page)).toMatchObject({
			name: 'Eucalyptus Geist',
			latin: 'Eucalyptus Globulus Eucalyptus'
		});
	});

	it('ignores other pages', () => {
		expect(
			botanicalPlate({ path: '/ginn-ginnie', title: 'Ginn & Ginnie', html: drawing })
		).toBeNull();
	});
});
