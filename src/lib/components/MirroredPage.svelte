<script lang="ts">
	import site from '#lib/content/site.json';

	let { path }: { path: string } = $props();
	let page = $derived(site.pages.find((entry) => entry.path === path));
</script>

<svelte:head>
	<title>{page?.title}</title>
	<meta name="description" content={page?.description} />
</svelte:head>

<div class="js-site site" class:site--no-padding={path === '/'} class:is-front-page={path === '/'}>
	<header class="site-head">{@html site.header}</header>
	{@html page?.html ?? ''}
	<footer class="site-footer">{@html site.footer}</footer>
</div>

<div class="o-age-check">{@html site.ageCheck}</div>
<div class="js-order-popup o-order">{@html site.order}</div>
