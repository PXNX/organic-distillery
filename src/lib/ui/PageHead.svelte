<script lang="ts">
	import { TAGLINE } from '#lib/content/site.js';

	let {
		title,
		description = ''
	}: { title?: string | undefined; description?: string | undefined } = $props();

	const fullTitle = $derived(title ? `${title} – ${TAGLINE}` : TAGLINE);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta property="og:title" content={fullTitle} />
	{#if description}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
	{/if}
</svelte:head>
