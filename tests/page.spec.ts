import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ContactForm from '../src/lib/ui/ContactForm.svelte';
import EssenceRecipe from '../src/lib/ui/EssenceRecipe.svelte';
import EssenceFamilies from '../src/lib/ui/EssenceFamilies.svelte';
import FlavorWheel from '../src/lib/ui/FlavorWheel.svelte';
import AgeGate from '../src/lib/ui/AgeGate.svelte';
import BasketButton from '../src/lib/ui/BasketButton.svelte';
import GinBotanicals from '../src/lib/ui/GinBotanicals.svelte';
import GinProcess from '../src/lib/ui/GinProcess.svelte';
import DownloadButton from '../src/lib/ui/DownloadButton.svelte';
import BezugPage from '../src/routes/bezug/+page.svelte';
import EssencePage from '../src/routes/essenzen/[slug]/+page.svelte';
import GinPage from '../src/routes/gins/[slug]/+page.svelte';
import GinnGinniePage from '../src/routes/ginn-ginnie/+page.svelte';
import ImpressumPage from '../src/routes/impressum/+page.svelte';
import UeberUnsPage from '../src/routes/ueber-uns/+page.svelte';
import { findEssence, findGin } from '../src/lib/content/catalog.js';
import Newsletter from '../src/lib/ui/Newsletter.svelte';
import SiteFooter from '../src/lib/ui/SiteFooter.svelte';

const mandarine = findEssence('mandarine-geist');
const eucalyptus = findEssence('eucalyptus-geist');
const ginn = findGin('ginn');

describe('pages and components', () => {
	it('renders the standard download button as a real PDF download', () => {
		const { body } = render(DownloadButton, {
			props: { href: '/media/card.pdf', title: 'Eucalyptus Geist' }
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

	it('renders the recipe with dish photo, signature and the standard download', () => {
		const { body } = render(EssenceRecipe, { props: { essence: eucalyptus! } });
		expect(body).toContain('class="recipe"');
		expect(body).toContain('Genießen mit Eucalyptus');
		expect(body).toContain('/media/recipes/eucalyptus-geist-3.webp');
		expect(body).toContain('/media/recipes/eucalyptus-geist-4.webp');
		expect(body).not.toContain('eucalyptus-geist-2.webp');
		expect(body).toContain('download-button');
		expect(body).toContain(eucalyptus!.recipe.pdf);
	});

	it('shows the gin botanicals before the sibling gin', () => {
		const { body, head } = render(GinPage, { props: { data: { gin: ginn! } } as never });
		expect(body).toContain('stage__ornament');
		expect(body).toContain('Ginn_500ml.webp');
		expect(body.indexOf('gin-botanicals')).toBeGreaterThan(0);
		expect(body.indexOf('gin-botanicals')).toBeLessThan(body.indexOf('Der zweite Gin'));
		expect(head).toContain('<title>Ginn');
	});

	it('renders essence pages as a product stage with a shimmering drawing', () => {
		const { body } = render(EssencePage, { props: { data: { essence: mandarine! } } as never });
		expect(body).toContain('stage__shimmer');
		expect(body).toContain(
			"--outline: url('/media/2017/10/Citrus_Nobilis_Mandarine-outline.webp')"
		);
		expect(body).toContain('Citrus Nobilis');
		expect(body).toContain('Passt zu');
		expect(body).toContain('In den Warenkorb');
		expect(body).toContain('/essenzen/koriander-geist');
	});

	it('renders PDFs on Bezug and Über uns as standard download buttons', () => {
		const bezug = render(BezugPage).body;
		expect(bezug).toContain('Bezugsquellen DACH');
		expect(bezug).toContain('Manufactum Warenhaus im Chilehaus');
		const press = render(UeberUnsPage).body;
		expect(press.match(/download-button download-button--compact/g)?.length).toBe(4);
		expect(press).toContain('Studio Naroska');
	});

	it('renders the Ginn & Ginnie page with both gins and the process', () => {
		const { body, head } = render(GinnGinniePage);
		expect(body).toContain('Sensorische Wahrnehmung');
		expect(body).toContain('Aus 1001 Nacht');
		expect(body).toContain('/gins/ginnie');
		expect(body).toContain('Vom Kraut zur Ginnie');
		expect(head).toContain('description');
	});

	it('renders legal texts without raw HTML', () => {
		const { body } = render(ImpressumPage);
		expect(body).toContain('HRB 731086');
		expect(body).toContain('Urheberrecht');
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

	it('renders distinct botanicals for Ginn and Ginnie', () => {
		const ginn = render(GinBotanicals, { props: { variant: 'ginn' } }).body;
		const ginnie = render(GinBotanicals, { props: { variant: 'ginnie' } }).body;
		expect(ginn).toContain('Juniperus communis');
		expect(ginn).toContain('Gaumenmenschen');
		expect(ginnie).toContain('Kardamom');
		expect(ginnie).toContain('Nasenmenschen');
		expect(ginn).not.toContain('Ginn_500ml');
	});

	it('renders a newsletter signup form', () => {
		const { body } = render(Newsletter);
		expect(body).toContain('newsletter-email');
		expect(body).toContain('Anmelden');
		expect(body).toContain('Neuigkeiten aus der Brennerei');
	});

	it('renders the age gate as a modal dialog with both answers', () => {
		const { body } = render(AgeGate);
		expect(body).toContain('role="dialog"');
		expect(body).toContain('data-age-answer="yes"');
		expect(body).toContain('data-age-answer="no"');
		expect(body).toContain('18');
	});
});
