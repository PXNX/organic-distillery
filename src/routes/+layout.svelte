<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { site } from '#lib/content/index.js';
	import { shopMockMode } from '#lib/shop/config.js';
	import { attachMockOrder } from '#lib/shop/mock-client.js';
	import '../styles/app.css';

	let { children } = $props();
	let isFrontPage = $derived(page.url.pathname === '/');

	onMount(() => (shopMockMode ? attachMockOrder() : undefined));
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<link rel="stylesheet" href="/vendor/styles.min.css" />
	<link rel="stylesheet" href="/vendor/cf7.min.css" />
</svelte:head>

<div class="o-age-check">{@html site.ageCheck}</div>

<div class="js-site site" class:site--no-padding={isFrontPage} class:is-front-page={isFrontPage}>
	<header class="site-head">{@html site.header}</header>
	{@render children()}
	<footer class="site-footer">{@html site.footer}</footer>
</div>

<div class="js-order-popup o-order">{@html site.order}</div>

{#if shopMockMode}
	<div class="shop-mock-banner" role="status">
		Shop-Mock-Modus aktiv – Bestellungen werden nicht versendet.
	</div>
{/if}
