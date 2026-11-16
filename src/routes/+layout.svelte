<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/env';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { site } from '#lib/content/index.js';
	import { shopMockMode } from '#lib/shop/config.js';
	import { attachAgeGate } from '#lib/age-gate.js';
	import InstallHint from '#lib/components/InstallHint.svelte';
	import { attachMockOrder } from '#lib/shop/mock-client.js';
	import '../styles/app.css';

	let { children } = $props();
	let isFrontPage = $derived(page.url.pathname === '/');

	onMount(() => {
		const cleanupAgeGate = attachAgeGate();
		const cleanupShop = shopMockMode ? attachMockOrder() : undefined;
		if (!dev && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js').catch(() => {});
		}
		return () => {
			cleanupAgeGate();
			cleanupShop?.();
		};
	});

	onNavigate((navigation) => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion || !document.startViewTransition) return;

		return new Promise<void>((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="icon" href="/icons/favicon-32.png" sizes="32x32" type="image/png" />
	<link rel="apple-touch-icon" href="/icons/icon-192.png" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#111110" />
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

<InstallHint raised={shopMockMode} />

{#if shopMockMode}
	<div class="shop-mock-banner" role="status">
		Shop-Mock-Modus aktiv – Bestellungen werden nicht versendet.
	</div>
{/if}
