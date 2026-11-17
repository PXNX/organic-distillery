<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/env';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { site } from '#lib/content/index.js';
	import { shopMockMode } from '#lib/features/shop/config.js';
	import { basket, openBasket } from '#lib/features/basket.svelte.js';
	import AgeGate from '#lib/ui/AgeGate.svelte';
	import InstallHint from '#lib/ui/InstallHint.svelte';
	import Basket from '#lib/ui/Basket.svelte';
	import BasketButton from '#lib/ui/BasketButton.svelte';
	import SiteFooter from '#lib/ui/SiteFooter.svelte';
	import { attachMockOrder } from '#lib/features/shop/mock-client.js';
	import { initTelemetry } from '#lib/features/telemetry.js';
	import '../styles/app.css';

	let { children } = $props();
	let isFrontPage = $derived(page.url.pathname === '/');
	let isError = $derived(page.status >= 400);

	onMount(() => {
		basket.restore();
		initTelemetry();
		const cleanupShop = shopMockMode ? attachMockOrder() : undefined;
		// The mirrored "order" links used to open a bare WordPress form; route them to the shop drawer.
		const onOrderClick = (event: MouseEvent) => {
			const link = (event.target as Element | null)?.closest?.('.js-show-order');
			if (!link || link.getAttribute('href')?.startsWith('mailto:')) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			openBasket();
		};
		document.addEventListener('click', onOrderClick, true);
		if (!dev && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js').catch(() => {});
		}
		return () => {
			cleanupShop?.();
			document.removeEventListener('click', onOrderClick, true);
		};
	});

	// Mark the current section in the mirrored header menu.
	$effect(() => {
		const path = page.url.pathname.replace(/\/$/, '') || '/';
		for (const link of document.querySelectorAll<HTMLAnchorElement>('.site-head .menu-item a')) {
			const target = new URL(link.href).pathname.replace(/\/$/, '');
			const active =
				path === target ||
				path.startsWith(`${target}/`) ||
				(target === '/ginn-ginnie' && path.startsWith('/gins/'));
			if (active) link.setAttribute('aria-current', 'page');
			else link.removeAttribute('aria-current');
		}
		document.body.classList.remove('is-menu-open');

		const hamburger = document.querySelector<HTMLButtonElement>('.site-head .hamburger');
		hamburger?.setAttribute('aria-label', 'Menü');
		hamburger?.setAttribute('aria-expanded', 'false');

		// Sections below the fold drift in as they are scrolled into view.
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
			const targets = document.querySelectorAll(
				'.site .o-section, .site .o-text, .site .o-buyat, .site .o-contact, .site .o-press, .flavor-wheel, .recipe, .gin-botanicals, .gin-process, .newsletter, .visit-note, .botanical-gallery, .recipe-library'
			);
			for (const target of targets) {
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

	// Keep the hamburger's expanded state in sync with the mirrored menu toggle.
	$effect(() => {
		const sync = new MutationObserver(() => {
			document
				.querySelector('.site-head .hamburger')
				?.setAttribute('aria-expanded', String(document.body.classList.contains('is-menu-open')));
		});
		sync.observe(document.body, { attributes: true, attributeFilter: ['class'] });
		return () => sync.disconnect();
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

{#if isError}
	{@render children()}
{:else}
	<AgeGate />

	<div class="js-site site" class:site--no-padding={isFrontPage} class:is-front-page={isFrontPage}>
		<header class="site-head">{@html site.header}</header>
		{@render children()}
		<SiteFooter />
	</div>

	<div class="js-order-popup o-order">{@html site.order}</div>

	<BasketButton />
	<Basket />
	<InstallHint raised />

	{#if shopMockMode}
		<div class="shop-mock-banner" role="status">
			Shop-Mock-Modus aktiv – Bestellungen werden nicht versendet.
		</div>
	{/if}
{/if}
