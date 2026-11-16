import { describe, expect, it } from 'vitest';
import { AGE_STORAGE_KEY, isAgeConfirmed } from '../src/lib/age-gate.js';

describe('isAgeConfirmed', () => {
	it('only accepts the explicit true value', () => {
		expect(isAgeConfirmed('true')).toBe(true);
		expect(isAgeConfirmed('false')).toBe(false);
		expect(isAgeConfirmed(null)).toBe(false);
	});

	it('uses a namespaced storage key', () => {
		expect(AGE_STORAGE_KEY).toContain('organic-distillery');
	});
});
