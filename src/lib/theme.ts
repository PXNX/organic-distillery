export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'organic-distillery:theme';

/** Resolves 'auto' to the operating system preference. */
export function resolveTheme(value: string | null, prefersDark: boolean): Theme {
	if (value === 'light' || value === 'dark') return value;
	return prefersDark ? 'dark' : 'light';
}

/** Reads the saved preference without throwing in private mode. */
export function storedTheme(): string | null {
	try {
		return localStorage.getItem(THEME_STORAGE_KEY);
	} catch {
		return null;
	}
}

/** Applies the theme to the document root and persists an explicit choice. */
export function applyTheme(theme: Theme, persist = true): void {
	document.documentElement.dataset.theme = theme;
	document.documentElement.style.colorScheme = theme;
	if (persist) {
		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			// Private mode: the choice still applies to this page view.
		}
	}
}

/** Toggles between the two concrete themes. */
export function nextTheme(current: Theme): Theme {
	return current === 'dark' ? 'light' : 'dark';
}
