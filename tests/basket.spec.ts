import { describe, expect, it } from 'vitest';
import {
	addItem,
	basketCount,
	basketTotal,
	buildOrderMailto,
	formatEuro
} from '../src/lib/features/basket.js';
import { essenceProduct, findEssence, findGin, ginProduct } from '../src/lib/content/catalog.js';
import type { BasketItem } from '../src/lib/features/basket.js';

const eucalyptus = findEssence('eucalyptus-geist');
const ginn = findGin('ginn');
const essence = eucalyptus ? essenceProduct(eucalyptus) : null;
const gin = ginn ? ginProduct(ginn) : null;

describe('products', () => {
	it('derives basket products with variants from the content', () => {
		expect(essence?.id).toBe('/essenzen/eucalyptus-geist');
		expect(essence?.variants).toHaveLength(1);
		expect(gin?.variants).toHaveLength(2);
	});
});

describe('basket math', () => {
	const items: BasketItem[] = essence
		? addItem(addItem([], essence, '50ml', 2), essence, '50ml', 1)
		: [];

	it('merges quantities and computes count/total', () => {
		expect(items).toHaveLength(1);
		expect(items[0]?.quantity).toBe(3);
		expect(basketCount(items)).toBe(3);
		expect(basketTotal(items)).toBe(67.5);
		expect(formatEuro(67.5)).toBe('67,50 €');
	});

	it('builds a prefilled order email', () => {
		const url = new URL(buildOrderMailto(items));
		expect(url.searchParams.get('subject')).toContain('Bestellung');
		expect(url.searchParams.get('body')).toContain('Eucalyptus Geist');
		expect(url.searchParams.get('body')).toContain('67,50 €');
	});
});

describe('gin variants', () => {
	it('offers the 500 ml bottle first', () => {
		expect(gin?.variants.map((variant) => variant.id)).toEqual(['500ml', '200ml']);
	});
});
