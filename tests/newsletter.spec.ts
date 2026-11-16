import { describe, expect, it } from 'vitest';
import {
	buildNewsletterMailto,
	NEWSLETTER_STORAGE_KEY,
	validateNewsletterEmail
} from '../src/lib/features/newsletter.js';

describe('validateNewsletterEmail', () => {
	it('accepts a valid address', () => {
		expect(validateNewsletterEmail(' ada@example.com ')).toBeNull();
	});

	it('rejects empty and malformed addresses', () => {
		expect(validateNewsletterEmail('')).toContain('E-Mail-Adresse');
		expect(validateNewsletterEmail('nope')).toContain('gültige');
	});
});

describe('buildNewsletterMailto', () => {
	it('prefills the subscription email', () => {
		const url = new URL(buildNewsletterMailto('ada@example.com'));
		expect(url.searchParams.get('subject')).toBe('Newsletter-Anmeldung');
		expect(url.searchParams.get('body')).toContain('ada@example.com');
	});

	it('uses a namespaced storage key', () => {
		expect(NEWSLETTER_STORAGE_KEY).toContain('organic-distillery');
	});
});
