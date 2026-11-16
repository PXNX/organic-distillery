export const AGE_STORAGE_KEY = 'organic-distillery:age-confirmed';

/** Pure predicate for the stored age confirmation. */
export function isAgeConfirmed(value: string | null): boolean {
	return value === 'true';
}

/** Marks the document so CSS can dismiss the gate without a hydration mismatch. */
export function confirmAge(): void {
	try {
		localStorage.setItem(AGE_STORAGE_KEY, 'true');
	} catch {
		// Storage can be unavailable (private mode); the session still works.
	}
	document.documentElement.dataset.ageConfirmed = 'true';
}

/** Wires the mirrored age form to local storage instead of a WordPress POST. */
export function attachAgeGate(): () => void {
	const form = document.querySelector<HTMLFormElement>('.o-age-check form');
	if (!form) return () => {};

	const onSubmit = (event: Event) => {
		event.preventDefault();
		confirmAge();
	};
	form.addEventListener('submit', onSubmit);
	return () => form.removeEventListener('submit', onSubmit);
}
