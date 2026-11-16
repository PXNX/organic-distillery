<script lang="ts">
	import ContactForm from './ContactForm.svelte';
	import GinAroma from './GinAroma.svelte';
	import GinProcess from './GinProcess.svelte';
	import Newsletter from './Newsletter.svelte';
	import RecipeCard from './RecipeCard.svelte';
	import { botanicalPlates } from '#lib/content/plates.js';
	import { recipeCards } from '#lib/content/recipes.js';
	import { site } from '#lib/content/index.js';
	import { essenceName } from '#lib/mirror/embellish.js';
	import { findPage } from '#lib/mirror/site.js';

	let { path }: { path: string } = $props();
	let page = $derived(findPage(site, path));
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

{@html page.html}

{#if page.recipe}
	<RecipeCard recipe={page.recipe} title={essenceName(page.title)} />
{/if}

{#if path === '/kontakt'}
	<ContactForm />
{/if}

{#if path === '/ginn-ginnie'}
	<GinProcess />
{/if}

{#if path.startsWith('/gins/')}
	<GinAroma variant={path.includes('ginnie') ? 'ginnie' : 'ginn'} />
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
	<section class="botanical-gallery" aria-labelledby="botanical-gallery-title">
		<h2 id="botanical-gallery-title">Botanische Studien</h2>
		<div class="botanical-gallery__grid">
			{#each botanicalPlates as plate (plate.path)}
				<a class="botanical-gallery__item" href={plate.path}>
					<img src={plate.src} alt={plate.latin} loading="lazy" decoding="async" />
					<span class="botanical-gallery__latin">{plate.latin}</span>
					<span class="botanical-gallery__name">{plate.name}</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="recipe-library" aria-labelledby="recipe-library-title">
		<h2 id="recipe-library-title">Rezeptkarten</h2>
		<div class="recipe-library__grid">
			{#each recipeCards as card (card.path)}
				<RecipeCard recipe={card} title={card.name} compact />
			{/each}
		</div>
	</section>
{/if}
