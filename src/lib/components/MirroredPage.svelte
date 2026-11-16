<script lang="ts">
	import { site } from '#lib/content/index.js';
	import { findPage } from '#lib/mirror/site.js';

	let { path }: { path: string } = $props();
	let page = $derived(findPage(site, path));
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
</svelte:head>

{@html page.html}
