import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ContactForm from '../src/lib/components/ContactForm.svelte';
import GinProcess from '../src/lib/components/GinProcess.svelte';
import MirroredPage from '../src/lib/components/MirroredPage.svelte';
import Newsletter from '../src/lib/components/Newsletter.svelte';
import SiteFooter from '../src/lib/components/SiteFooter.svelte';
import RecipeCard from '../src/lib/components/RecipeCard.svelte';

describe('MirroredPage', () => {
	it('renders a recipe card as a real PDF download', () => {
		const { body } = render(RecipeCard, {
			props: {
				recipe: { href: '/media/card.pdf', label: 'Rezeptkarte herunterladen' },
				title: 'Eucalyptus Geist'
			}
		});
		expect(body).toContain('/media/card.pdf');
		expect(body).toContain('download');
		expect(body).toContain('Eucalyptus Geist');
	});

	it('renders a working contact form with labelled fields', () => {
		const { body } = render(ContactForm);
		expect(body).toContain('your-name');
		expect(body).toContain('EMAIL');
		expect(body).toContain('NACHRICHT');
		expect(body).toContain('Abschicken');
	});

	it('renders the redesigned footer with navigation and theme toggle', () => {
		const { body } = render(SiteFooter);
		expect(body).toContain('Organic Distillery GmbH');
		expect(body).toContain('Farbschema wechseln');
		expect(body).toContain('/datenschutz');
		expect(body).toContain('Kein Hofladen');
	});

	it('explains the gin-making process in four steps', () => {
		const { body } = render(GinProcess);
		expect(body).toContain('Vom Kraut zum Flaschengeist');
		expect(body).toContain('Aroma infundieren');
		expect(body).toContain('Schonende Destillation');
		expect(body.match(/gin-process__step/g)).toHaveLength(5);
	});

	it('renders a newsletter signup form', () => {
		const { body } = render(Newsletter);
		expect(body).toContain('newsletter-email');
		expect(body).toContain('Anmelden');
		expect(body).toContain('Neuigkeiten aus der Brennerei');
	});

	it('renders the content and metadata of the requested page', () => {
		const { body, head } = render(MirroredPage, { props: { path: '/ginn-ginnie' } });
		expect(body).toContain('Sensorische Wahrnehmung');
		expect(head).toContain('Ginn');
		expect(head).toContain('description');
	});
});
