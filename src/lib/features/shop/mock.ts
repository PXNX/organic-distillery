export interface MockOrderLine {
	description: string;
	quantity: number;
}

export interface MockOrder {
	lines: MockOrderLine[];
	name: string;
	email: string;
	reference?: string;
}

/** Pure formatter so the mock receipt can be unit tested without a DOM. */
export function formatMockOrder(order: MockOrder): string {
	const lines = order.lines.length
		? order.lines.map((line) => `• ${line.quantity} × ${line.description}`).join('\n')
		: '• (keine Artikel ausgewählt)';
	const reference = order.reference ? `Referenz: ${order.reference}\n` : '';
	return `Mock-Bestellung – es wird nichts versendet\n${reference}\n${lines}\n\n${order.name || '–'} / ${order.email || '–'}`;
}
