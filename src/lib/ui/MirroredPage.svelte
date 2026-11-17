<script lang="ts">
	import ContactForm from './ContactForm.svelte';
	import EssenceRecipe from './EssenceRecipe.svelte';
	import EssenceFamilies from './EssenceFamilies.svelte';
	import FlavorWheel from './FlavorWheel.svelte';
	import ProductPage from './ProductPage.svelte';
	import GinBotanicals from './GinBotanicals.svelte';
	import GinProcess from './GinProcess.svelte';
	import Newsletter from './Newsletter.svelte';
	import RecipeCard from './RecipeCard.svelte';
	import { recipeCards } from '#lib/content/recipes.js';
	import { site } from '#lib/content/index.js';
	import { essenceName, replaceContactLogo, standardizeDownloads } from '#lib/mirror/embellish.js';
	import { productPage } from '#lib/content/product-page.js';
	import { productForPath } from '#lib/features/basket.js';
	import { familyForPath } from '#lib/features/flavor-wheel.js';
	import { findPage } from '#lib/mirror/site.js';

	let { path }: { path: string } = $props();
	let page = $derived(findPage(site, path));
	let detail = $derived(productPage(page));
	// The essence overview replaces the mirrored product grid with the aroma compass and family grid.
	let essenceSplit = $derived.by(() => {
		if (path !== '/essenzen') return null;
		const start = html.indexOf('<div class="o-essences');
		const end = start >= 0 ? html.indexOf('<div class="o-teaser', start) : -1;
		if (start < 0 || end <= start) return null;
		// Lift the "Aromafamilien" introduction above the wheel it explains.
		let after = html.slice(end);
		let families = '';
		const heading = after.indexOf('>Aromafamilien</h2>');
		const block = heading >= 0 ? after.lastIndexOf('<div class="o-text o-module', heading) : -1;
		if (block >= 0) {
			families = after.slice(block);
			after = after.slice(0, block);
		}
		return { before: html.slice(0, start), families, after };
	});
	let product = $derived(productForPath(path, page.title));
	// Render-time clean-up of WordPress leftovers: empty spacer paragraphs and the
	// dead contact form on the home page (the working form lives on /kontakt).
	let html = $derived(
		standardizeDownloads(replaceContactLogo(page.html))
			.replace(/<p>(?:&nbsp;|\s|\u00a0)*<\/p>/g, '')
			.replace(
				/<div class="wpcf7 no-js"[\s\S]*?<\/form>\s*<\/div>/,
				'<p class="o-contact__cta"><a class="o-button" href="/kontakt">Nachricht schreiben</a></p>'
			)
	);
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

{#if detail}
	<ProductPage page={detail} {product} {path}>
		{#if path.startsWith('/gins/')}
			<GinBotanicals variant={path.includes('ginnie') ? 'ginnie' : 'ginn'} />
		{/if}
		{#if page.recipe}
			{@const family = familyForPath(path)}
			<EssenceRecipe
				recipe={page.recipe}
				title={essenceName(page.title)}
				{path}
				accent={family?.color}
				essence={family?.essences.find((entry) => entry.path === path)?.name ??
					essenceName(page.title)}
				family={family?.name}
			/>
		{/if}
	</ProductPage>
{:else if essenceSplit}
	{@html essenceSplit.before}
	<div class="essence-intro">{@html essenceSplit.families}</div>
	<FlavorWheel />
	<EssenceFamilies />
	{@html essenceSplit.after}
{:else}
	{@html html}
{/if}

{#if path === '/kontakt'}
	<ContactForm />
{/if}

{#if path === '/ginn-ginnie'}
	<GinProcess />
{/if}

{#if path.startsWith('/essenzen/')}
	<FlavorWheel highlight={path} />
{/if}

{#if path === '/' || path === '/kontakt' || path === '/ueber-uns'}
	<Newsletter />
{/if}

{#if path === '/datenschutz'}
	<aside class="privacy-note" aria-label="Hinweis zur Analyse">
		<h2>Hinweis zur Reichweitenmessung</h2>
		<p>
			Diese Website verwendet Vercel Analytics zur cookiefreien Reichweitenmessung. Es werden keine
			Werbe-Cookies gesetzt und keine personenbezogenen Profile gebildet. Die Messung ist in der
			lokalen Entwicklung deaktiviert.
		</p>
	</aside>
{/if}

{#if path === '/'}
	<aside class="visit-note" aria-label="Hinweis für Besucher">
		<span class="visit-note__ornament" aria-hidden="true">◇</span>
		<p>
			<strong>Besuch geplant?</strong> Es gibt keinen Hofladen – wenn Sie persönlich vorbeikommen möchten,
			kontaktieren Sie Christine bitte vorab.
		</p>
		<a class="o-button" href="/kontakt">Kontakt aufnehmen</a>
	</aside>
{/if}

{#if path === '/essenzen'}
	<section class="recipe-library" aria-labelledby="recipe-library-title">
		<h2 id="recipe-library-title">Rezeptkarten</h2>
		<div class="recipe-library__grid">
			{#each recipeCards as card (card.path)}
				<RecipeCard recipe={card} title={card.name} compact />
			{/each}
		</div>
	</section>
{/if}
