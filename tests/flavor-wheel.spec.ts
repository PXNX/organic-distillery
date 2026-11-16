import { describe, expect, it } from 'vitest';
import { buildWheel, flavorFamilies, sectorPath } from '../src/lib/features/flavor-wheel.js';

describe('flavorFamilies', () => {
	it('contains the five colour-coded families with ten essences', () => {
		expect(flavorFamilies.map((family) => family.name)).toEqual([
			'ZITRUS',
			'FRUCHTIG',
			'FLORAL',
			'GRÜN',
			'HERBAL'
		]);
		expect(flavorFamilies.flatMap((family) => family.essences)).toHaveLength(10);
	});
});

describe('sectorPath', () => {
	it('builds a closed annular sector', () => {
		const path = sectorPath(200, 200, 180, 130, -90, -18);
		expect(path.startsWith('M ')).toBe(true);
		expect(path.endsWith('Z')).toBe(true);
		expect(path).toContain('A 180 180');
		expect(path).toContain('A 130 130');
	});
});

describe('buildWheel', () => {
	it('creates five outer and ten inner segments with local links', () => {
		const wheel = buildWheel();
		expect(wheel.outer).toHaveLength(5);
		expect(wheel.inner).toHaveLength(10);
		for (const segment of wheel.inner) {
			expect(segment.essence?.path).toMatch(/^\/essenzen\//);
			expect(segment.rotation).toBeGreaterThanOrEqual(-90);
		}
	});
});
