import { describe, expect, it } from 'vitest';
import { botanicalPlates } from '../src/lib/content/plates.js';

describe('botanicalPlates', () => {
	it('collects one drawing per essence detail page', () => {
		expect(botanicalPlates).toHaveLength(10);
		for (const plate of botanicalPlates) {
			expect(plate.path).toMatch(/^\/essenzen\//);
			expect(plate.src).toMatch(/^\/media\//);
			expect(plate.latin.length).toBeGreaterThan(0);
		}
	});
});
