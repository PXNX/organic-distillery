<script lang="ts">
	import GinBotanicals from '#lib/ui/GinBotanicals.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import ProductPage from '#lib/ui/ProductPage.svelte';
	import { ginPath, ginProduct } from '#lib/content/catalog.js';
	import { ginPage } from '#lib/content/product-page.js';

	let { data } = $props();
	const gin = $derived(data.gin);
</script>

<PageHead title={gin.name} description={gin.lead} />

<ProductPage page={ginPage(gin)} product={ginProduct(gin)} path={ginPath(gin)}>
	<GinBotanicals variant={gin.slug} />
</ProductPage>
