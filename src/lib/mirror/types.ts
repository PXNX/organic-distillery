/** A single page crawled from the live site. */
import type { RecipeLink } from './embellish.js';

export interface MirroredPage {
	path: string;
	title: string;
	description: string;
	html: string;
	recipe?: RecipeLink;
}

/** All content needed to render the mirrored site. */
export interface MirroredSite {
	pages: MirroredPage[];
	header: string;
	footer: string;
	ageCheck: string;
	order: string;
}
