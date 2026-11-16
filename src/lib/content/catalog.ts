import { productForPath, type Product } from '../features/basket.js';
import { site } from './index.js';

export interface CatalogEntry {
	product: Product;
	path: string;
	image: string | null;
	group: 'Gin' | 'Essenz';
}

const bottleImage = /src="([^"]*(?:_front_FIN_schatten|Ginn_500ml|Ginnie_500ml)[^"]*)"/;

/** Every orderable product, derived once from the mirrored detail pages. */
export const catalog: CatalogEntry[] = (() => {
	const seen = new Set<string>();
	const entries: CatalogEntry[] = [];
	for (const page of site.pages) {
		const product = productForPath(page.path, page.title);
		if (!product || seen.has(product.id)) continue;
		seen.add(product.id);
		entries.push({
			product,
			path: page.path.replace(/-2$/, ''),
			image: page.html.match(bottleImage)?.[1] ?? null,
			group: page.path.startsWith('/gins/') ? 'Gin' : 'Essenz'
		});
	}
	return entries.sort(
		(a, b) => b.group.localeCompare(a.group) || a.product.name.localeCompare(b.product.name, 'de')
	);
})();
