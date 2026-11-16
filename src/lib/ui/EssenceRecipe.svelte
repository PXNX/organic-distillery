<script lang="ts">
	import { trackEvent } from '#lib/features/telemetry.js';
	import type { RecipeLink } from '#lib/mirror/embellish.js';

	let {
		recipe,
		title,
		accent = '#b08d57'
	}: { recipe: RecipeLink; title: string; accent?: string | undefined } = $props();
</script>

<section class="recipe-section" style={`--accent: ${accent}`} aria-labelledby="recipe-title">
	<header class="recipe-section__header">
		<span aria-hidden="true">◇</span>
		<div>
			<p class="recipe-section__eyebrow">Rezept &amp; Inspiration</p>
			<h2 id="recipe-title">{title}</h2>
		</div>
	</header>

	{#if recipe.text}
		<p class="recipe-section__text">{recipe.text}</p>
	{/if}

	{#if recipe.images && recipe.images.length > 0}
		<div class="recipe-section__gallery">
			{#each recipe.images as image (image)}
				<img src={image} alt={`${title} – Rezeptmotiv`} loading="lazy" decoding="async" />
			{/each}
		</div>
	{/if}

	<a
		class="o-button recipe-section__download"
		href={recipe.href}
		download
		onclick={() => trackEvent('recipe_download', { essence: title, file: recipe.href })}
	>
		PDF herunterladen ↓
	</a>
</section>
