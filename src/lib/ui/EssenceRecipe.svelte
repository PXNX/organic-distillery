<script lang="ts">
	import { trackEvent } from '#lib/features/telemetry.js';
	import type { RecipeLink } from '#lib/mirror/embellish.js';

	let { recipe, title }: { recipe: RecipeLink; title: string } = $props();

	let open = $state(false);

	function toggle() {
		open = !open;
		if (open) trackEvent('recipe_open', { essence: title });
	}
</script>

<section class="essence-recipe" aria-labelledby="essence-recipe-title">
	<button type="button" class="essence-recipe__toggle" onclick={toggle} aria-expanded={open}>
		<span class="essence-recipe__icon" aria-hidden="true">◇</span>
		<span id="essence-recipe-title">Rezept &amp; Inspiration: {title}</span>
		<span class="essence-recipe__arrow" aria-hidden="true">{open ? '−' : '+'}</span>
	</button>

	<div class="essence-recipe__body" hidden={!open}>
		{#if recipe.text}
			<p>{recipe.text}</p>
		{/if}
		<a
			class="o-button essence-recipe__download"
			href={recipe.href}
			download
			onclick={() => trackEvent('recipe_download', { essence: title, file: recipe.href })}
		>
			PDF herunterladen ↓
		</a>
	</div>
</section>
