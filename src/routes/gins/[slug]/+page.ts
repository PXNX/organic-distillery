import { error, redirect } from '@sveltejs/kit';
import { findGin } from '#lib/content/catalog.js';
import { gins } from '#lib/content/products.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	gins.flatMap((gin) => [{ slug: gin.slug }, { slug: `${gin.slug}-2` }]);

export const load: PageLoad = ({ params }) => {
	// WordPress had a second page per gin for the 200 ml bottle; sizes are now picked on one page.
	if (params.slug.endsWith('-2')) redirect(308, `/gins/${params.slug.slice(0, -2)}`);
	const gin = findGin(params.slug);
	if (!gin) error(404, 'Diesen Gin gibt es nicht.');
	return { gin };
};
