import { describe, expect, it } from 'vitest';
import {
	addItem,
	basketCount,
	basketTotal,
	buildOrderMailto,
	formatEuro,
	productForPath
} from '../src/lib/features/basket.js';
import type { BasketItem } from '../src/lib/features/basket.js';

const essence = productForPath(
	'/essenzen/eucalyptus-geist',
	'Eucalyptus Geist – Von der Natur begeistert'
);
const gin = productForPath('/gins/ginn', 'Ginn – Von der Natur begeistert');

describe('productForPath', () => {
	it('derives products with variants from detail pages', () => {
		expect(essence?.variants).toHaveLength(1);
		expect(gin?.variants).toHaveLength(2);
		expect(productForPath('/kontakt', 'Kontakt')).toBeNull();
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
