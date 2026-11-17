import { ESSENCE_VARIANTS, GIN_VARIANTS, type Product } from '../features/basket.js';
import { essences, gins } from './products.js';
import type { Essence, Gin } from './types.js';

export interface CatalogEntry {
	product: Product;
	path: string;
	image: string;
	group: 'Gin' | 'Essenz';
}

export const essencePath = (essence: Pick<Essence, 'slug'>) => `/essenzen/${essence.slug}`;
export const ginPath = (gin: Pick<Gin, 'slug'>) => `/gins/${gin.slug}`;

export const essenceProduct = (essence: Essence): Product => ({
	id: essencePath(essence),
	name: essence.name,
	variants: ESSENCE_VARIANTS
});

export const ginProduct = (gin: Gin): Product => ({
	id: ginPath(gin),
	name: gin.name,
	variants: GIN_VARIANTS
});

/** Every orderable product: the gins first, then the essences by name. */
export const catalog: CatalogEntry[] = [
	...gins.map((gin) => ({
		product: ginProduct(gin),
		path: ginPath(gin),
		image: gin.bottles['500ml'],
		group: 'Gin' as const
	})),
	...[...essences]
		.sort((a, b) => a.name.localeCompare(b.name, 'de'))
		.map((essence) => ({
			product: essenceProduct(essence),
			path: essencePath(essence),
			image: essence.bottle,
			group: 'Essenz' as const
		}))
];

export const findEssence = (slug: string) => essences.find((essence) => essence.slug === slug);
export const findGin = (slug: string) => gins.find((gin) => gin.slug === slug);
