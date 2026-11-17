import { error, redirect } from '@sveltejs/kit';
import { findEssence } from '#lib/content/catalog.js';
import { essences } from '#lib/content/products.js';
import type { EntryGenerator, PageLoad } from './$types';

/** Old WordPress slugs that now live under a readable URL. */
const MOVED: Record<string, string> = { '137-2': 'koriander-geist' };

export const entries: EntryGenerator = () => [
	...essences.map((essence) => ({ slug: essence.slug })),
	...Object.keys(MOVED).map((slug) => ({ slug }))
];

export const load: PageLoad = ({ params }) => {
	const moved = MOVED[params.slug];
	if (moved) redirect(308, `/essenzen/${moved}`);
	const essence = findEssence(params.slug);
	if (!essence) error(404, 'Diese Essenz gibt es nicht.');
	return { essence };
};
