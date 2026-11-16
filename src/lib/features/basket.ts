export interface ProductVariant {
	id: string;
	label: string;
	price: number;
}

export interface Product {
	id: string;
	name: string;
	variants: ProductVariant[];
}

export interface BasketItem {
	productId: string;
	variantId: string;
	name: string;
	label: string;
	price: number;
	quantity: number;
}

const essence: ProductVariant[] = [{ id: '50ml', label: '50 ml', price: 22.5 }];
const gin: ProductVariant[] = [
	{ id: '200ml', label: '200 ml', price: 55 },
	{ id: '500ml', label: '500 ml', price: 115 }
];

/** Derives a product from a mirrored detail page. */
export function productForPath(path: string, title: string): Product | null {
	const name = title.replace(/\s*[–—-]\s*Von der Natur.*$/i, '').trim();
	if (path.startsWith('/essenzen/')) {
		return { id: path, name, variants: essence };
	}
	if (path.startsWith('/gins/')) {
		// "/gins/ginn" shows the 500 ml bottle, "/gins/ginn-2" the 200 ml one.
		const variants = path.endsWith('-2') ? gin : [...gin].reverse();
		return { id: path.replace(/-2$/, ''), name, variants };
	}
	return null;
}

export function basketCount(items: BasketItem[]): number {
	return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function basketTotal(items: BasketItem[]): number {
	return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addItem(
	items: BasketItem[],
	product: Product,
	variantId: string,
	quantity = 1
): BasketItem[] {
	const variant = product.variants.find((entry) => entry.id === variantId);
	if (!variant || quantity < 1) return items;
	const key = `${product.id}:${variantId}`;
	const existing = items.find((item) => `${item.productId}:${item.variantId}` === key);
	if (existing) {
		return items.map((item) =>
			item === existing ? { ...item, quantity: item.quantity + quantity } : item
		);
	}
	return [
		...items,
		{
			productId: product.id,
			variantId,
			name: product.name,
			label: variant.label,
			price: variant.price,
			quantity
		}
	];
}

export function formatEuro(value: number): string {
	return `${value.toFixed(2).replace('.', ',')} €`;
}

/** Plain-text order used for the mailto checkout. */
export function formatOrder(items: BasketItem[]): string {
	const lines = items.map(
		(item) =>
			`${item.quantity} × ${item.name} (${item.label}) – ${formatEuro(item.price * item.quantity)}`
	);
	return `Guten Tag,\n\nich möchte bestellen:\n\n${lines.join('\n')}\n\nGesamt: ${formatEuro(basketTotal(items))}\n\nVielen Dank!`;
}

export function buildOrderMailto(items: BasketItem[]): string {
	return `mailto:contact@organic-distillery.com?subject=${encodeURIComponent('Bestellung Organic Distillery')}&body=${encodeURIComponent(formatOrder(items))}`;
}
