export interface ContactValues {
	name: string;
	place: string;
	email: string;
	message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates the contact form without relying on a server round-trip. */
export function validateContact(values: ContactValues): ContactErrors {
	const errors: ContactErrors = {};
	if (!values.name.trim()) errors.name = 'Bitte geben Sie Ihren Namen ein.';
	if (!values.email.trim()) errors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
	else if (!emailPattern.test(values.email.trim())) {
		errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
	}
	if (!values.message.trim()) errors.message = 'Bitte geben Sie Ihre Nachricht ein.';
	return errors;
}

/** Prepares a real, prefilled email so the static form still reaches the studio. */
export function buildContactMailto(values: ContactValues): string {
	const subject = `Kontaktanfrage von ${values.name.trim()}`;
	const body = [
		`Name: ${values.name.trim()}`,
		`Ort: ${values.place.trim() || '–'}`,
		`E-Mail: ${values.email.trim()}`,
		'',
		values.message.trim()
	].join('\n');
	return `mailto:contact@organic-distillery.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Plain-text copy used by the clipboard fallback. */
export function formatContactMessage(values: ContactValues): string {
	return `${values.name.trim()} (${values.place.trim() || '–'}) <${values.email.trim()}>\n\n${values.message.trim()}`;
}
