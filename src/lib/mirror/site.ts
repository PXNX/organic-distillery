import type { MirroredPage, MirroredSite } from './types.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

/** Validates the shape of the JSON committed by the mirror script. */
export function parseSite(value: unknown): MirroredSite {
	if (!isRecord(value)) throw new TypeError('Mirrored site must be an object');
	if (!Array.isArray(value.pages)) throw new TypeError('Mirrored site needs a pages array');
	for (const key of ['header', 'footer', 'ageCheck', 'order'] as const) {
		if (!isString(value[key])) throw new TypeError(`Mirrored site needs a string ${key}`);
	}
	for (const [index, page] of value.pages.entries()) {
		if (!isRecord(page)) throw new TypeError(`Page ${index} must be an object`);
		for (const key of ['path', 'title', 'description', 'html'] as const) {
			if (!isString(page[key])) throw new TypeError(`Page ${index} needs a string ${key}`);
		}
		if ('recipe' in page) {
			const recipe = page.recipe;
			if (!isRecord(recipe) || !isString(recipe.href) || !isString(recipe.label)) {
				throw new TypeError(`Page ${index} has an invalid recipe`);
			}
		}
	}
	return value as unknown as MirroredSite;
}

/** Looks up a mirrored page, failing loudly if the route and content drift apart. */
export function findPage(site: MirroredSite, path: string): MirroredPage {
	const page = site.pages.find((entry) => entry.path === path);
	if (!page) throw new Error(`No mirrored content for route: ${path}`);
	return page;
}
