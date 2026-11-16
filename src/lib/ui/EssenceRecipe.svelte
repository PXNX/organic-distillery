<script lang="ts">
	import { trackEvent } from '#lib/features/telemetry.js';
	import { structureRecipe, titleCase } from '#lib/features/recipe-text.js';
	import type { RecipeLink } from '#lib/mirror/embellish.js';

	let {
		recipe,
		title,
		accent = '#b08d57',
		essence = title,
		family = ''
	}: {
		recipe: RecipeLink;
		title: string;
		accent?: string | undefined;
		essence?: string;
		family?: string | undefined;
	} = $props();

	let structured = $derived(
		recipe.text ? structureRecipe(recipe.text, essence, family ?? '') : null
	);
</script>

<section class="recipe-section" style={`--accent: ${accent}`} aria-labelledby="recipe-title">
	<header class="recipe-section__header">
		<span class="recipe-section__ornament" aria-hidden="true">◇</span>
		<div>
			<p class="recipe-section__eyebrow">
				Rezept &amp; Inspiration{#if family}<span class="recipe-section__family">{family}</span
					>{/if}
			</p>
			<h2 id="recipe-title">{title}</h2>
		</div>
	</header>

	{#if structured?.intro}
		<p class="recipe-section__text">{structured.intro}</p>
	{/if}

	{#if recipe.images && recipe.images.length > 0}
		<div class="recipe-section__gallery">
			{#each recipe.images as image (image)}
				<img src={image} alt={`${title} – Rezeptmotiv`} loading="lazy" decoding="async" />
			{/each}
		</div>
	{/if}

	{#if structured && structured.sections.length > 0}
		<div class="recipe-section__steps">
			{#each structured.sections as section, index (index)}
				<article class="recipe-step" style:--stagger={`${index * 60}ms`}>
					<h3>{titleCase(section.heading)}</h3>
					{#if section.dish}
						<p class="recipe-step__dish">{titleCase(section.dish)}</p>
					{/if}
					<p>{section.body}</p>
				</article>
			{/each}
		</div>
	{/if}

	<a
		class="o-button recipe-section__download"
		href={recipe.href}
		download
		onclick={() => trackEvent('recipe_download', { essence: title, file: recipe.href })}
	>
		Rezeptkarte als PDF ↓
	</a>
</section>
