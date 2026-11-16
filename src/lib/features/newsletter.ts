export const NEWSLETTER_STORAGE_KEY = 'organic-distillery:newsletter-email';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a German error message, or null when the address is usable. */
export function validateNewsletterEmail(email: string): string | null {
	const value = email.trim();
	if (!value) return 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
	if (!emailPattern.test(value)) return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
	return null;
}

/** Remembers the address locally so the form can confirm on repeat visits. */
export function rememberNewsletterEmail(email: string): void {
	try {
		localStorage.setItem(NEWSLETTER_STORAGE_KEY, email.trim());
	} catch {
		// Storage may be unavailable; the current session still confirms.
	}
}

/** Prefilled email used when the visitor wants to actually subscribe. */
export function buildNewsletterMailto(email: string): string {
	return `mailto:contact@organic-distillery.com?subject=${encodeURIComponent('Newsletter-Anmeldung')}&body=${encodeURIComponent(`Bitte nehmen Sie mich in Ihren Newsletter auf.\n\nE-Mail: ${email.trim()}`)}`;
}
