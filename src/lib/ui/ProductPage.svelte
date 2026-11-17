<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import AddToBasket from './AddToBasket.svelte';
	import { catalog } from '#lib/content/catalog.js';
	import type { ProductPage } from '#lib/content/product-page.js';
	import type { Product } from '#lib/features/basket.js';

	let {
		page,
		product,
		path,
		children
	}: { page: ProductPage; product: Product; path: string; children?: Snippet } = $props();

	let reduceMotion = $state(false);
	onMount(() => {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	const familyLabel = (name: string) => name.charAt(0) + name.slice(1).toLowerCase();
	const siblings = $derived(
		catalog.filter(
			(entry) => entry.group === (page.kind === 'gin' ? 'Gin' : 'Essenz') && entry.path !== path
		)
	);
	const parent = $derived(
		page.kind === 'gin'
			? { href: '/ginn-ginnie', label: 'Ginn & Ginnie' }
			: { href: '/essenzen', label: 'Essenzen' }
	);
</script>

<article
	class={`product product--${page.kind}`}
	style={`--family: ${page.family?.color ?? 'var(--mystic-gold)'}`}
>
	<nav class="product__crumbs" aria-label="Brotkrumen">
		<a href={parent.href}>{parent.label}</a>
		{#if page.family}
			<span aria-hidden="true">◇</span>
			<span>{familyLabel(page.family.name)}</span>
		{/if}
		<span aria-hidden="true">◇</span>
		<span aria-current="page">{page.name}</span>
	</nav>

	<section class="product__hero">
		<div class="product__stage">
			<div class="stage__frame" aria-hidden="true"></div>

			{#if page.drawing}
				<div
					class="stage__drawing"
					style={`--drawing: url('${page.drawing.src}'); --outline: url('${page.drawing.outline}')`}
					aria-hidden="true"
				>
					<img src={page.drawing.src} alt="" decoding="async" />
					<span class="stage__gold"></span>
					<span class="stage__shimmer"></span>
				</div>
			{:else}
				<svg class="stage__ornament" viewBox="-200 -200 400 400" aria-hidden="true">
					<defs>
						<linearGradient id="ornament-gold" x1="0" y1="0" x2="1" y2="1">
							<stop offset="0" stop-color="#7a5a2a" />
							<stop offset="0.45" stop-color="#c9a86a" />
							<stop offset="0.5" stop-color="#fff1c8" />
							<stop offset="0.55" stop-color="#c9a86a" />
							<stop offset="1" stop-color="#7a5a2a" />
							{#if !reduceMotion}
								<animateTransform
									attributeName="gradientTransform"
									type="translate"
									values="-1 -1; 1 1"
									dur="6s"
									repeatCount="indefinite"
								/>
							{/if}
						</linearGradient>
					</defs>
					<g fill="none" stroke="url(#ornament-gold)" stroke-width="1.2">
						{#each [60, 95, 130, 170] as r (r)}
							<circle {r} stroke-dasharray={r === 95 ? '2 5' : undefined} />
						{/each}
						{#each Array.from({ length: 24 }, (_, i) => i * 15) as angle (angle)}
							<g transform={`rotate(${angle})`}>
								<path d="M0 -95 C 14 -110, 14 -124, 0 -130 C -14 -124, -14 -110, 0 -95 Z" />
								<path d="M0 -130 C 6 -146, 18 -152, 0 -170" />
								<circle cy="-150" r="3" />
							</g>
						{/each}
						{#each [0, 45] as angle (angle)}
							<rect x="-85" y="-85" width="170" height="170" transform={`rotate(${angle})`} />
						{/each}
						<path d="M0 -60 L60 0 L0 60 L-60 0 Z" />
					</g>
				</svg>
			{/if}

			<div class="stage__glow" aria-hidden="true"></div>
			{#if page.bottle}
				<img
					class="stage__bottle"
					src={page.bottle}
					alt={`${page.name} Flasche`}
					decoding="async"
					fetchpriority="high"
				/>
			{/if}
			<div class="stage__shadow" aria-hidden="true"></div>

			{#if page.prev}
				<a class="stage__arrow stage__arrow--prev" href={page.prev} aria-label="Vorheriges Produkt">
					<span aria-hidden="true">‹</span>
				</a>
			{/if}
			{#if page.next}
				<a class="stage__arrow stage__arrow--next" href={page.next} aria-label="Nächstes Produkt">
					<span aria-hidden="true">›</span>
				</a>
			{/if}
		</div>

		<div class="product__intro">
			<p class="product__eyebrow">
				{#if page.family}
					<span class="product__family">{page.family.name}</span>
				{/if}
				<span>{page.kind === 'gin' ? 'Organic Dry Gin' : 'Organic Essenz'}</span>
			</p>
			<h1 class="product__name">{page.name}</h1>
			{#if page.drawing}
				<p class="product__latin">{page.drawing.latin}</p>
			{/if}
			<ul class="product__meta">
				{#each page.meta as entry (entry)}
					<li>{entry}</li>
				{/each}
			</ul>
			<p class="product__lead">{page.lead}</p>

			{#if product}
				<AddToBasket {product} />
			{/if}

			<ul class="product__promises">
				<li><span aria-hidden="true">◇</span> Biologisch</li>
				<li><span aria-hidden="true">◇</span> Von Hand destilliert</li>
				<li><span aria-hidden="true">◇</span> Bodensee</li>
			</ul>
		</div>
	</section>

	{#if page.aroma || page.pairings.length > 0}
		<section class="product__details">
			{#if page.aroma}
				<div class="detail-card">
					<h2>Aromabeschreibung</h2>
					<p>{page.aroma}</p>
				</div>
			{/if}

			{#if page.pairings.length > 0}
				<div class="detail-card detail-card--pairings">
					<h2>Passt zu</h2>
					<ul>
						{#each page.pairings as pairing (pairing.group)}
							<li>
								<span class="pairing__group">{pairing.group}</span>
								<span class="pairing__items">
									{#each pairing.items as item (item)}
										<span class="pairing__chip">{item}</span>
									{/each}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</section>
	{/if}

	{@render children?.()}

	{#if siblings.length > 0}
		<section class="product__siblings" aria-labelledby="siblings-title">
			<h2 id="siblings-title">
				{page.kind === 'gin' ? 'Der zweite Gin' : 'Weitere Essenzen'}
			</h2>
			<ul>
				{#each siblings as entry (entry.path)}
					<li>
						<a href={entry.path}>
							{#if entry.image}
								<img src={entry.image} alt="" loading="lazy" decoding="async" />
							{/if}
							<span>{entry.product.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</article>
