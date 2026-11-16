import { describe, expect, it } from 'vitest';
import { catalog } from '../src/lib/content/catalog.js';

describe('catalog', () => {
	it('lists every product once, gins first, each with a bottle image', () => {
		const ids = catalog.map((entry) => entry.product.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(catalog.filter((entry) => entry.group === 'Gin')).toHaveLength(2);
		expect(catalog.filter((entry) => entry.group === 'Essenz')).toHaveLength(10);
		expect(catalog[0]?.group).toBe('Gin');
		expect(catalog.every((entry) => entry.image)).toBe(true);
	});
});
