export const INSTALL_DISMISSAL_KEY = 'organic-distillery:install-dismissed';

/** The hint is shown once, until the visitor dismisses it or installs the app. */
export function shouldShowInstallHint(value: string | null): boolean {
	return value !== 'true';
}
