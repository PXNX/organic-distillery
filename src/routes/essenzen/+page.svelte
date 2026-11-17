<script lang="ts">
	import DownloadButton from '#lib/ui/DownloadButton.svelte';
	import EssenceFamilies from '#lib/ui/EssenceFamilies.svelte';
	import FlavorWheel from '#lib/ui/FlavorWheel.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import Blocks from '#lib/ui/blocks/Blocks.svelte';
	import { essences } from '#lib/content/products.js';
	import { essenzen } from '#lib/content/pages.js';

	const [intro, inspiration, usage, families] = essenzen.blocks;
	const recipes = [...essences].sort((a, b) => a.name.localeCompare(b.name, 'de'));
</script>

<PageHead
	title="Essenzen"
	description="Biologisch hergestellte Essenzen und Schlüsselaromen – eingeteilt in fünf Aromafamilien."
/>

<Blocks blocks={[intro, families].filter((block) => block !== undefined)} />
<FlavorWheel />
<EssenceFamilies />
<Blocks blocks={[inspiration, usage].filter((block) => block !== undefined)} />

<section class="recipe-library container" aria-labelledby="recipe-library-title">
	<h2 id="recipe-library-title" class="ornate">Rezeptkarten</h2>
	<div class="recipe-library__grid">
		{#each recipes as essence (essence.slug)}
			<DownloadButton
				href={essence.recipe.pdf}
				title={essence.name}
				meta="PDF · Rezeptkarte"
				compact
			/>
		{/each}
	</div>
</section>

<style>
	.recipe-library {
		padding-block: 3rem;
		max-width: 72rem;
	}

	h2 {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.recipe-library__grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 0.75rem;
	}

	.recipe-library__grid :global(.download-button) {
		width: 100%;
	}
</style>
