<script lang="ts">
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
