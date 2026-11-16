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
		const order: MockOrder = {
			lines,
			name: value('order-name'),
			email: value('order-email'),
			reference: crypto.randomUUID().slice(0, 8).toUpperCase()
		};

		let dialog = document.querySelector<HTMLDialogElement>('.mock-order-confirmation');
		if (!dialog) {
			dialog = document.createElement('dialog');
			dialog.className = 'mock-order-confirmation';
			const content = document.createElement('pre');
			const close = document.createElement('button');
			close.type = 'button';
			close.textContent = 'Schließen';
			close.addEventListener('click', () => dialog?.close());
			dialog.append(content, close);
			form.parentElement?.appendChild(dialog);
		}
		const content = dialog.querySelector('pre');
		if (content) content.textContent = formatMockOrder(order);
		if (!dialog.open) dialog.showModal();
	};

	form.addEventListener('submit', handleSubmit, true);
	return () => form.removeEventListener('submit', handleSubmit, true);
}
