import { describe, expect, it } from 'vitest';
import {
	buildContactMailto,
	formatContactMessage,
	validateContact,
	type ContactValues
} from '../src/lib/contact.js';

const valid: ContactValues = {
	name: 'Ada Lovelace',
	place: 'Friedrichshafen',
	email: 'ada@example.com',
	message: 'Ich interessiere mich für eine Führung.'
};

describe('validateContact', () => {
	it('accepts a complete message', () => {
		expect(validateContact(valid)).toEqual({});
	});

	it('reports all invalid fields', () => {
		const errors = validateContact({ name: '', place: '', email: 'nope', message: '' });
		expect(errors.name).toBeDefined();
		expect(errors.email).toBeDefined();
		expect(errors.message).toBeDefined();
		expect(errors.place).toBeUndefined();
	});
});

describe('buildContactMailto', () => {
	it('prefills recipient, subject and body', () => {
		const url = new URL(buildContactMailto(valid));
		expect(url.protocol).toBe('mailto:');
		expect(url.pathname).toBe('contact@organic-distillery.com');
		expect(url.searchParams.get('subject')).toContain('Ada Lovelace');
		expect(url.searchParams.get('body')).toContain('Ich interessiere mich');
	});
});

describe('formatContactMessage', () => {
	it('includes sender details and message', () => {
		const text = formatContactMessage(valid);
		expect(text).toContain('ada@example.com');
		expect(text).toContain('Friedrichshafen');
	});
});
