import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ContactForm from '../src/lib/ui/ContactForm.svelte';
import FlavorWheel from '../src/lib/ui/FlavorWheel.svelte';
import GinAroma from '../src/lib/ui/GinAroma.svelte';
import GinProcess from '../src/lib/ui/GinProcess.svelte';
import MirroredPage from '../src/lib/ui/MirroredPage.svelte';
import Newsletter from '../src/lib/ui/Newsletter.svelte';
import SiteFooter from '../src/lib/ui/SiteFooter.svelte';
import RecipeCard from '../src/lib/ui/RecipeCard.svelte';

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

	it('renders the colour-coded flavour wheel', () => {
		const { body } = render(FlavorWheel);
		expect(body).toContain('Aromarad');
		expect(body).toContain('ZITRUS');
		expect(body).toContain('Mandarine');
		expect(body.match(/class="flavor-wheel__slice"/g)).toHaveLength(10);
	});

	it('renders distinct aroma profiles for Ginn and Ginnie', () => {
		const ginn = render(GinAroma, { props: { variant: 'ginn' } }).body;
		const ginnie = render(GinAroma, { props: { variant: 'ginnie' } }).body;
		expect(ginn).toContain('Wacholder');
		expect(ginn).toContain('Gaumenmensch');
		expect(ginnie).toContain('Kardamom');
		expect(ginnie).toContain('Nasenmensch');
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
