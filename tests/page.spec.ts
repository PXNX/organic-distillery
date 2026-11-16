import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import MirroredPage from '../src/lib/components/MirroredPage.svelte';

describe('MirroredPage', () => {
	it('renders the content and metadata of the requested page', () => {
		const { body, head } = render(MirroredPage, { props: { path: '/ginn-ginnie' } });
		expect(body).toContain('Sensorische Wahrnehmung');
		expect(head).toContain('Ginn');
		expect(head).toContain('description');
	});
});
