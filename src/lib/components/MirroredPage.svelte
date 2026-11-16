<script lang="ts">
	import site from '#lib/content/site.json';

	let { path }: { path: string } = $props();
	let page = $derived(site.pages.find((entry) => entry.path === path));
</script>

<svelte:head>
	<title>{page?.title}</title>
	<meta name="description" content={page?.description} />
</svelte:head>

{@html page?.html ?? ''}
