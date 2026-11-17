import type { Link } from './types.js';

export const SITE_NAME = 'Organic Distillery';
export const TAGLINE = 'Von der Natur begeistert';

/** Main navigation, in header order. */
export const navigation: Link[] = [
	{ href: '/organic-distillery', label: 'Organic Distillery' },
	{ href: '/ginn-ginnie', label: 'Ginn & Ginnie' },
	{ href: '/essenzen', label: 'Essenzen' },
	{ href: '/brand-geist', label: 'Brand & Geist' },
	{ href: '/bezug', label: 'Bezug' },
	{ href: '/kontakt', label: 'Kontakt' },
	{ href: '/ueber-uns', label: 'Über uns' }
];

export const contact = {
	company: 'Organic Distillery GmbH',
	street: 'Dornierstrasse 139',
	city: '88048 Friedrichshafen',
	region: 'Bodensee',
	country: 'Germany',
	phone: '+49 (0) 178 172 47 73',
	phoneHref: 'tel:+491781724773',
	email: 'contact@organic-distillery.com',
	visits: 'Kein Hofladen – Besuche auf Voranmeldung'
} as const;

export const social = {
	facebook: 'https://www.facebook.com/Organic-Distillery-298807533647030/',
	instagram: 'https://www.instagram.com/organic_distillery/'
} as const;

/** Is `path` inside the section that `href` links to? */
export function isCurrent(path: string, href: string): boolean {
	const clean = path.replace(/\/$/, '') || '/';
	return (
		clean === href ||
		clean.startsWith(`${href}/`) ||
		(href === '/ginn-ginnie' && clean.startsWith('/gins/'))
	);
}
