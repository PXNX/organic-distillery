<script lang="ts">
	import EssenceRecipe from '#lib/ui/EssenceRecipe.svelte';
	import FlavorWheel from '#lib/ui/FlavorWheel.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import ProductPage from '#lib/ui/ProductPage.svelte';
	import { essencePath, essenceProduct } from '#lib/content/catalog.js';
	import { essencePage } from '#lib/content/product-page.js';

	let { data } = $props();
	const essence = $derived(data.essence);
	const path = $derived(essencePath(essence));
</script>

<PageHead title={essence.name} description={essence.lead} />

<ProductPage page={essencePage(essence)} product={essenceProduct(essence)} {path}>
	<EssenceRecipe {essence} />
</ProductPage>

<FlavorWheel highlight={path} />
