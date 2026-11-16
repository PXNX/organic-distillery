import { describe, expect, it } from 'vitest';
import { formatMockOrder } from '../src/lib/features/shop/mock.js';

describe('formatMockOrder', () => {
	it('lists quantities, descriptions and contact details', () => {
		const receipt = formatMockOrder({
			lines: [
				{ description: 'ZITRONEN VERBENA GEIST – Organic 50 ml', quantity: 2 },
				{ description: 'GINN – Organic Dry Gin 500 ml', quantity: 1 }
			],
			name: 'Ada',
			email: 'ada@example.com'
		});
		expect(receipt).toContain('Mock-Bestellung');
		expect(receipt).toContain('• 2 × ZITRONEN VERBENA GEIST');
		expect(receipt).toContain('• 1 × GINN');
		expect(receipt).toContain('Ada / ada@example.com');
	});

	it('handles an empty order and missing contact details', () => {
		const receipt = formatMockOrder({ lines: [], name: '', email: '' });
		expect(receipt).toContain('keine Artikel ausgewählt');
		expect(receipt).toContain('– / –');
		expect(receipt).not.toContain('Referenz');
	});

	it('includes a mock reference when provided', () => {
		const receipt = formatMockOrder({ lines: [], name: '', email: '', reference: 'AB12CD34' });
		expect(receipt).toContain('Referenz: AB12CD34');
	});
});
