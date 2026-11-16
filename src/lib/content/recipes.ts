import { essenceName, type RecipeLink } from '../mirror/embellish.js';
import { site } from './index.js';

export interface RecipeCard extends RecipeLink {
	path: string;
	name: string;
}

/** Every essence recipe card, linked back to its detail page. */
export const recipeCards: RecipeCard[] = site.pages
	.filter((page) => page.recipe)
	.map((page) => ({
		...(page.recipe as RecipeLink),
		path: page.path,
		name: essenceName(page.title)
	}));
