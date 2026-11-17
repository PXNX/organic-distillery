<script lang="ts">
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { dev } from '$app/env';
	import { shopMockMode } from '#lib/features/shop/config.js';
	import { basket } from '#lib/features/basket.svelte.js';
	import { initTelemetry } from '#lib/features/telemetry.js';
	import AgeGate from '#lib/ui/AgeGate.svelte';
	import Basket from '#lib/ui/Basket.svelte';
	import BasketButton from '#lib/ui/BasketButton.svelte';
	import InstallHint from '#lib/ui/InstallHint.svelte';
	import SiteFooter from '#lib/ui/SiteFooter.svelte';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import '../styles/app.css';

	let { children } = $props();
	let isError = $derived(page.status >= 400);

	onMount(() => {
		basket.restore();
		initTelemetry();
		if (!dev && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js').catch(() => {});
		}
	});

	// Sections below the fold drift in as they are scrolled into view.
	$effect(() => {
		void page.url.pathname;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: '0px 0px -8% 0px' }
		);
		const frame = requestAnimationFrame(() => {
			for (const target of document.querySelectorAll('main > section, main > article > section')) {
				if (target.getBoundingClientRect().top < window.innerHeight) continue;
				target.classList.add('reveal');
				observer.observe(target);
			}
		});
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
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
</svelte:head>

{#if isError}
	{@render children()}
{:else}
	<AgeGate />

	<div class="site">
		<SiteHeader />
		<main id="main">
			{@render children()}
		</main>
		<SiteFooter />
	</div>

	<BasketButton />
	<Basket />
	<InstallHint raised />

	{#if shopMockMode}
		<div class="shop-mock-banner" role="status">
			Shop-Mock-Modus aktiv – Bestellungen werden nicht versendet.
		</div>
	{/if}
{/if}
