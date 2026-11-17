import type { BasketItem, Product } from './basket.js';
import { addItem } from './basket.js';

const STORAGE_KEY = 'organic-distillery:basket';

class BasketState {
	items = $state<BasketItem[]>([]);

	get count() {
		return this.items.reduce((sum, item) => sum + item.quantity, 0);
	}

	get total() {
		return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	add(product: Product, variantId: string, quantity = 1) {
		const before = this.count;
		this.items = addItem(this.items, product, variantId, quantity);
		this.save();
		if (this.count > before) {
			basketUi.pulse += 1;
			basketUi.lastAdded = product.name;
		}
	}

	setQuantity(index: number, quantity: number) {
		if (quantity < 1) {
			this.remove(index);
			return;
		}
		const item = this.items[index];
		if (item) this.items[index] = { ...item, quantity };
		this.save();
	}

	remove(index: number) {
		this.items = this.items.filter((_, i) => i !== index);
		this.save();
	}

	clear() {
		this.items = [];
		this.save();
	}

	restore() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) this.items = JSON.parse(raw) as BasketItem[];
		} catch {
			// Ignore unavailable or corrupt storage.
		}
	}

	private save() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
		} catch {
			// Private mode: the basket still works for this session.
		}
	}
}

export const basket = new BasketState();

export const basketUi = $state({
	open: false,
	/** Increments on every successful add so the shop button can celebrate. */
	pulse: 0,
	lastAdded: ''
});

/** Opens the basket drawer. */
export function openBasket() {
	basketUi.open = true;
}
