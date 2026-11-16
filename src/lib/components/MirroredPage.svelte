<script lang="ts">
	import { botanicalPlates } from '#lib/content/plates.js';
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

{#if path === '/essenzen'}
	<section class="botanical-gallery" aria-labelledby="botanical-gallery-title">
		<h2 id="botanical-gallery-title">Botanische Studien</h2>
		<div class="botanical-gallery__grid">
			{#each botanicalPlates as plate (plate.path)}
				<a class="botanical-gallery__item" href={plate.path}>
					<img src={plate.src} alt={plate.latin} loading="lazy" decoding="async" />
					<span class="botanical-gallery__latin">{plate.latin}</span>
					<span class="botanical-gallery__name">{plate.name}</span>
				</a>
			{/each}
		</div>
	</section>
{/if}
