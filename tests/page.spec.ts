import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ContactForm from '../src/lib/ui/ContactForm.svelte';
import EssenceRecipe from '../src/lib/ui/EssenceRecipe.svelte';
import EssenceFamilies from '../src/lib/ui/EssenceFamilies.svelte';
import FlavorWheel from '../src/lib/ui/FlavorWheel.svelte';
import BasketButton from '../src/lib/ui/BasketButton.svelte';
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

	it('renders a working contact form with a roomy message field', () => {
		const { body } = render(ContactForm);
		expect(body).toContain('your-name');
		expect(body).toContain('name@beispiel.de');
		expect(body).toContain('rows="12"');
		expect(body).toContain('Zeichen');
		expect(body).toContain('Nachricht vorbereiten');
	});

	it('renders the redesigned footer with navigation and theme toggle', () => {
		const { body } = render(SiteFooter);
		expect(body).toContain('Organic Distillery GmbH');
		expect(body).toContain('Farbschema wechseln');
		expect(body).toContain('/datenschutz');
		expect(body).toContain('Kein Hofladen');
		expect(body).toContain('/icons/seal-bio.svg');
		expect(body).toContain('/icons/seal-demeter.svg');
	});

	it('explains the gin-making process in four steps', () => {
		const { body } = render(GinProcess);
		expect(body).toContain('Vom Kraut zur Ginnie');
		expect(body).toContain('Aroma infundieren');
		expect(body).toContain('Schonende Destillation');
		expect(body.match(/gin-process__step/g)).toHaveLength(5);
	});

	it('renders a basket button with a shop label', () => {
		const { body } = render(BasketButton);
		expect(body).toContain('Shop');
		expect(body).toContain('Shop öffnen');
	});

	it('renders an always-visible coloured recipe section with images', () => {
		const { body } = render(EssenceRecipe, {
			props: {
				title: 'Eucalyptus Geist',
				recipe: {
					href: '/media/recipe.pdf',
					label: 'Rezeptkarte',
					text: 'Lamm und Kräuter.',
					images: ['/media/recipes/eucalyptus-1.webp']
				}
			}
		});
		expect(body).toContain('recipe-section');
		expect(body).toContain('Lamm und Kräuter.');
		expect(body).toContain('/media/recipes/eucalyptus-1.webp');
		expect(body).not.toContain('recipe-section__toggle');
	});

	it('renders essence pages as a product stage with a shimmering drawing', () => {
		const { body } = render(MirroredPage, { props: { path: '/essenzen/mandarine-geist' } });
		expect(body).toContain('stage__shimmer');
		expect(body).toContain(
			"--outline: url('/media/2017/10/Citrus_Nobilis_Mandarine-outline.webp')"
		);
		expect(body).toContain('Citrus Nobilis');
		expect(body).toContain('Passt zu');
		expect(body).toContain('In den Warenkorb');
		expect(body).not.toContain('js-show-order');
	});

	it('renders gin pages with an ornament stage and the other gin', () => {
		const { body } = render(MirroredPage, { props: { path: '/gins/ginnie' } });
		expect(body).toContain('stage__ornament');
		expect(body).toContain('Ginnie_500ml.webp');
		expect(body).toContain('Der zweite Gin');
	});

	it('renders the aroma compass with every essence', () => {
		const { body } = render(FlavorWheel);
		expect(body).toContain('Aromarad');
		expect(body).toContain('Mandarine');
		expect(body.match(/class="compass__segment/g)).toHaveLength(10);
		expect(body.match(/class="compass__family/g)).toHaveLength(5);
	});

	it('lists all essences by family on the overview', () => {
		const { body } = render(EssenceFamilies);
		expect(body).toContain('Alle Essenzen');
		expect(body.match(/class="essence-tile"/g)).toHaveLength(10);
		expect(body).toContain('in den Warenkorb');
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
