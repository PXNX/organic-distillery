import { formatMockOrder, type MockOrder, type MockOrderLine } from './mock.js';

/**
 * Prevents the mirrored WordPress form from posting and shows a local receipt.
 * Returns a cleanup function for Svelte's onMount.
 */
export function attachMockOrder(): () => void {
	const form = document.querySelector<HTMLFormElement>('.js-order-form');
	if (!form) return () => {};

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		event.stopImmediatePropagation();

		const lines: MockOrderLine[] = [];
		for (const input of form.querySelectorAll<HTMLInputElement>('input[name^="item-"]')) {
			const quantity = Number(input.value);
			if (!Number.isFinite(quantity) || quantity <= 0) continue;
			const description =
				input
					.closest('li')
					?.querySelector('.o-order__description')
					?.textContent?.trim()
					.replace(/^x\s*/, '') ?? 'Unbekannt';
			lines.push({ description, quantity });
		}

		const value = (name: string) =>
			form.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value.trim() ?? '';
		const order: MockOrder = { lines, name: value('order-name'), email: value('order-email') };

		let panel = document.querySelector<HTMLElement>('.mock-order-confirmation');
		if (!panel) {
			panel = document.createElement('div');
			panel.className = 'mock-order-confirmation';
			form.parentElement?.appendChild(panel);
		}
		panel.textContent = formatMockOrder(order);
		panel.hidden = false;
		panel.scrollIntoView({ block: 'nearest' });
	};

	form.addEventListener('submit', handleSubmit, true);
	return () => form.removeEventListener('submit', handleSubmit, true);
}
