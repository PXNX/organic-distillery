import { describe, expect, it } from 'vitest';
import { INSTALL_DISMISSAL_KEY, shouldShowInstallHint } from '../src/lib/features/pwa.js';

describe('shouldShowInstallHint', () => {
	it('shows the hint by default and after a fresh install', () => {
		expect(shouldShowInstallHint(null)).toBe(true);
		expect(shouldShowInstallHint('false')).toBe(true);
	});

	it('stays hidden once dismissed', () => {
		expect(shouldShowInstallHint('true')).toBe(false);
	});

	it('uses a namespaced storage key', () => {
		expect(INSTALL_DISMISSAL_KEY).toContain('organic-distillery');
	});
});
