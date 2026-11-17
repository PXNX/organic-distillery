<script lang="ts">
	import DownloadButton from './DownloadButton.svelte';
	import { flavorFamilies } from '#lib/features/flavor-wheel.js';
	import type { Essence } from '#lib/content/types.js';

	let { essence }: { essence: Essence } = $props();

	const view = $derived(essence.recipe);
	const accent = $derived(
		flavorFamilies.find((family) => family.name === essence.family)?.color ?? '#b08d57'
	);
	const familyLabel = $derived(essence.family.charAt(0) + essence.family.slice(1).toLowerCase());
	const dish = $derived(view.feature?.dish ?? view.cocktail?.name);
	const media = $derived({
		photo: view.photo,
		portrait: view.portrait,
		signature: view.signature
	});
	const title = $derived(essence.name);
</script>

<section class="recipe" style={`--accent: ${accent}`} aria-labelledby="recipe-title">
	<header class="recipe__header">
		<p class="recipe__eyebrow">
			<span aria-hidden="true">◇</span> Rezept &amp; Inspiration
			{#if familyLabel}<span class="recipe__family">{familyLabel}</span>{/if}
		</p>
		<h2 id="recipe-title">Genießen mit {essence.short}</h2>
	</header>

	<div class="recipe__feature" class:recipe__feature--no-photo={!media.photo}>
		{#if media.photo}
			<figure class="recipe__photo" class:recipe__photo--portrait={media.portrait}>
				<img
					src={media.photo}
					alt={dish ?? `${title} – Rezeptidee`}
					loading="lazy"
					decoding="async"
				/>
				{#if dish}<figcaption>{dish}</figcaption>{/if}
			</figure>
		{/if}

		<div class="recipe__ideas">
			{#if view.feature}
				<div class="recipe__inspiration">
					<span class="recipe__label">Inspiration</span>
					{#if view.feature.dish && view.feature.dish !== view.cocktail?.name}<h3>
							{view.feature.dish}
						</h3>{/if}
					<p>{view.feature.text}</p>
				</div>
			{/if}

			{#if view.cocktail}
				<div class="recipe__cocktail">
					<div class="recipe__cocktail-head">
						<span class="recipe__label">Drink</span>
						<strong>{view.cocktail.name}</strong>
						{#if view.cocktail.credit}<small>by {view.cocktail.credit}</small>{/if}
					</div>
					<ul>
						{#each view.cocktail.ingredients as ingredient, index (index)}
							<li class:is-essence={ingredient.amount.includes('Tropfen')}>
								<span class="recipe__amount">{ingredient.amount}</span>
								<span>{ingredient.name}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if view.uses.length > 0}
				<ol class="recipe__uses">
					{#each view.uses as use, index (index)}
						<li>
							<div class="recipe__use-head">
								<h3>{use.title}</h3>
								{#if use.drops}
									<span class="recipe__drops">
										<svg viewBox="0 0 12 16" aria-hidden="true"
											><path d="M6 1C6 1 1 7 1 10.5a5 5 0 0 0 10 0C11 7 6 1 6 1Z" /></svg
										>
										{use.drops}
									</span>
								{/if}
							</div>
							<p>{use.text}</p>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</div>

	{#if view.letter}
		<blockquote class="recipe__letter">
			<p>{view.letter}</p>
			<footer>
				{#if media.signature}
					<img src={media.signature} alt="Christine Brugger" loading="lazy" decoding="async" />
				{:else}
					<span>Christine Brugger</span>
				{/if}
			</footer>
		</blockquote>
	{/if}

	<div class="recipe__download">
		<DownloadButton
			href={view.pdf}
			title={`Rezeptkarte ${essence.short}`}
			meta="PDF · Alle Rezepte zum Ausdrucken"
			track={title}
		/>
	</div>
</section>
