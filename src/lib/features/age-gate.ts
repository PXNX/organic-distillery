export const AGE_STORAGE_KEY = 'organic-distillery:age-confirmed';

/** Pure predicate for the stored age confirmation. */
export function isAgeConfirmed(value: string | null): boolean {
	return value === 'true';
}

const isConfirmed = () => document.documentElement.dataset.ageConfirmed === 'true';

const visibleButtons = (gate: HTMLElement) =>
	[...gate.querySelectorAll<HTMLButtonElement>('button')].filter(
		(button) => button.offsetParent !== null
	);

/**
 * Keeps keyboard focus and assistive tech inside the age dialog while it is open.
 * The answers themselves are handled by the inline script in app.html, which runs
 * before hydration so the buttons never feel dead on a slow connection.
 */
export function attachAgeGate(gate: HTMLElement): () => void {
	if (isConfirmed()) return () => {};
	const site = document.querySelector<HTMLElement>('.site');
	site?.setAttribute('inert', '');
	visibleButtons(gate)[0]?.focus({ preventScroll: true });

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Tab') return;
		const buttons = visibleButtons(gate);
		const first = buttons[0];
		const last = buttons.at(-1);
		if (!first || !last) return;
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};
	// The inline script flips this attribute once the visitor confirms.
	const observer = new MutationObserver(() => {
		if (!isConfirmed()) return;
		site?.removeAttribute('inert');
		cleanup();
	});
	observer.observe(document.documentElement, { attributeFilter: ['data-age-confirmed'] });
	gate.addEventListener('keydown', onKeydown);

	function cleanup() {
		observer.disconnect();
		gate.removeEventListener('keydown', onKeydown);
	}
	return () => {
		cleanup();
		site?.removeAttribute('inert');
	};
}
