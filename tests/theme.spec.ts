import { describe, expect, it } from 'vitest';
import { nextTheme, resolveTheme, THEME_STORAGE_KEY } from '../src/lib/theme.js';

describe('resolveTheme', () => {
	it('follows the OS preference when no choice is saved', () => {
		expect(resolveTheme(null, true)).toBe('dark');
		expect(resolveTheme(null, false)).toBe('light');
	});

	it('honours an explicit choice over the OS preference', () => {
		expect(resolveTheme('light', true)).toBe('light');
		expect(resolveTheme('dark', false)).toBe('dark');
	});

	it('uses a namespaced storage key', () => {
		expect(THEME_STORAGE_KEY).toContain('organic-distillery');
	});
});

describe('nextTheme', () => {
	it('toggles both ways', () => {
		expect(nextTheme('light')).toBe('dark');
		expect(nextTheme('dark')).toBe('light');
	});
});
