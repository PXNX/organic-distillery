import { describe, expect, it } from 'vitest';
import { normalizeEventName } from '../src/lib/features/telemetry.js';

describe('normalizeEventName', () => {
	it('normalises spaces, dashes and case', () => {
		expect(normalizeEventName('Recipe Download')).toBe('recipe_download');
		expect(normalizeEventName('pwa-install-result')).toBe('pwa_install_result');
	});

	it('drops unsupported characters', () => {
		expect(normalizeEventName(' Ginn & Ginnie! ')).toBe('ginn_ginnie');
	});
});
