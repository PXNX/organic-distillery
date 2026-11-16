<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly, slide } from 'svelte/transition';
	import { basket, basketUi } from '#lib/features/basket.svelte.js';
	import { buildOrderMailto, formatEuro, type Product } from '#lib/features/basket.js';
	import { shopMockMode } from '#lib/features/shop/config.js';
	import { trackEvent } from '#lib/features/telemetry.js';
	import { catalog } from '#lib/content/catalog.js';

	const mailto = $derived(buildOrderMailto(basket.items));
	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const motion = (duration: number) => (reduceMotion ? 0 : duration);

	/** Selected variant per product in the catalog (gins come in two sizes). */
	let chosen = $state<Record<string, string>>({});
	/** Product id that was just added, for a brief confirmation tick. */
	let justAdded = $state<string | null>(null);
	let addedTimer: ReturnType<typeof setTimeout> | undefined;
	let closeButton = $state<HTMLButtonElement | null>(null);

	function variantOf(product: Product) {
		return chosen[product.id] ?? product.variants[0]?.id ?? '';
	}

	function quickAdd(product: Product) {
		const variantId = variantOf(product);
		basket.add(product, variantId, 1);
		trackEvent('basket_add', {
			product: product.id,
			variant: variantId,
			quantity: 1,
			from: 'shop'
		});
		justAdded = product.id;
		clearTimeout(addedTimer);
		addedTimer = setTimeout(() => (justAdded = null), 1400);
	}

	function close() {
		basketUi.open = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (basketUi.open && event.key === 'Escape') close();
	}

	$effect(() => {
		if (!basketUi.open) return;
		const root = document.documentElement;
		const previous = root.style.overflow;
		root.style.overflow = 'hidden';
		const focusTarget = document.activeElement as HTMLElement | null;
		queueMicrotask(() => closeButton?.focus());
		return () => {
			root.style.overflow = previous;
			focusTarget?.focus?.({ preventScroll: true });
		};
	});
</script>

<svelte:window onkeydown={onKeydown} />

{#if basketUi.open}
	<div
		class="basket-overlay"
		role="presentation"
		onclick={close}
		transition:fade={{ duration: motion(200) }}
	></div>
	<div
		class="basket"
		role="dialog"
		aria-modal="true"
		aria-labelledby="basket-title"
		transition:fly={{ x: 420, duration: motion(320), opacity: 1 }}
	>
		<header class="basket__header">
			<span class="basket__ornament" aria-hidden="true">◇</span>
			<h2 id="basket-title">{basketUi.view === 'shop' ? 'Sortiment' : 'Ihr Warenkorb'}</h2>
			<button
				type="button"
				class="basket__close"
				onclick={close}
				aria-label="Schließen"
				bind:this={closeButton}
			>
				×
			</button>
		</header>

		<div class="basket__tabs" role="tablist" aria-label="Ansicht">
			<button
				type="button"
				role="tab"
				aria-selected={basketUi.view === 'shop'}
				class:is-active={basketUi.view === 'shop'}
				onclick={() => (basketUi.view = 'shop')}>Sortiment</button
			>
			<button
				type="button"
				role="tab"
				aria-selected={basketUi.view === 'basket'}
				class:is-active={basketUi.view === 'basket'}
				onclick={() => (basketUi.view = 'basket')}
			>
				Warenkorb
				{#if basket.count > 0}
					{#key basket.count}
						<span class="basket__tab-count">{basket.count}</span>
					{/key}
				{/if}
			</button>
		</div>

		{#if basketUi.view === 'shop'}
			<ul class="basket__catalog" in:fade={{ duration: motion(180) }}>
				{#each catalog as entry, index (entry.product.id)}
					{@const product = entry.product}
					{@const variant = product.variants.find((v) => v.id === variantOf(product))}
					<li class="catalog-item" style:--stagger={`${Math.min(index, 12) * 30}ms`}>
						<a class="catalog-item__image" href={entry.path} onclick={close} tabindex="-1">
							{#if entry.image}
								<img src={entry.image} alt="" loading="lazy" decoding="async" />
							{/if}
						</a>
						<div class="catalog-item__info">
							<span class="catalog-item__group">{entry.group}</span>
							<a class="catalog-item__name" href={entry.path} onclick={close}>{product.name}</a>
							{#if product.variants.length > 1}
								<div class="catalog-item__sizes" role="radiogroup" aria-label="Größe">
									{#each product.variants as option (option.id)}
										<button
											type="button"
											role="radio"
											aria-checked={variantOf(product) === option.id}
											class:is-active={variantOf(product) === option.id}
											onclick={() => (chosen[product.id] = option.id)}>{option.label}</button
										>
									{/each}
								</div>
							{:else}
								<span class="catalog-item__size">{product.variants[0]?.label}</span>
							{/if}
						</div>
						<div class="catalog-item__buy">
							<span class="catalog-item__price">{variant ? formatEuro(variant.price) : ''}</span>
							<button
								type="button"
								class="catalog-item__add"
								class:is-added={justAdded === product.id}
								onclick={() => quickAdd(product)}
								aria-label={`${product.name} in den Warenkorb`}
							>
								{justAdded === product.id ? '✓' : '+'}
							</button>
						</div>
					</li>
				{/each}
			</ul>

			{#if basket.count > 0}
				<div
					class="basket__footer basket__footer--shop"
					transition:slide={{ duration: motion(200) }}
				>
					<button
						type="button"
						class="o-button basket__checkout"
						onclick={() => (basketUi.view = 'basket')}
					>
						Zum Warenkorb · {formatEuro(basket.total)}
					</button>
				</div>
			{/if}
		{:else if basket.items.length === 0}
			<div class="basket__empty" in:fade={{ duration: motion(180) }}>
				<span class="basket__empty-ornament" aria-hidden="true">◇</span>
				<p>Noch nichts ausgewählt.<br />Stellen Sie sich ein Destillat zusammen.</p>
				<button type="button" class="o-button" onclick={() => (basketUi.view = 'shop')}>
					Zum Sortiment
				</button>
			</div>
		{:else}
			<ul class="basket__items" in:fade={{ duration: motion(180) }}>
				{#each basket.items as item, index (item.productId + item.variantId)}
					<li
						animate:flip={{ duration: motion(220) }}
						out:fly={{ x: 60, duration: motion(200) }}
						in:fly={{ y: -8, duration: motion(220) }}
					>
						<div class="basket__item-info">
							<strong>{item.name}</strong>
							<span>{item.label} · {formatEuro(item.price)}</span>
						</div>
						<div class="basket__quantity">
							<button
								type="button"
								onclick={() => basket.setQuantity(index, item.quantity - 1)}
								aria-label="Menge verringern">−</button
							>
							{#key item.quantity}
								<span class="basket__qty" in:fly={{ y: -6, duration: motion(160) }}
									>{item.quantity}</span
								>
							{/key}
							<button
								type="button"
								onclick={() => basket.setQuantity(index, item.quantity + 1)}
								aria-label="Menge erhöhen">+</button
							>
						</div>
						<strong class="basket__line-total">{formatEuro(item.price * item.quantity)}</strong>
						<button
							type="button"
							class="basket__remove"
							onclick={() => basket.remove(index)}
							aria-label={`${item.name} entfernen`}>×</button
						>
					</li>
				{/each}
			</ul>

			<div class="basket__footer">
				<div class="basket__total">
					<span>Gesamt</span>
					{#key basket.total}
						<strong in:fade={{ duration: motion(200) }}>{formatEuro(basket.total)}</strong>
					{/key}
				</div>
				<p class="basket__note">
					Die Bestellung wird als E-Mail vorbereitet – Versandkosten und Zahlung stimmen wir
					persönlich mit Ihnen ab.
				</p>
				{#if shopMockMode}
					<p class="basket__mock">Mock-Modus – es wird keine echte Bestellung versendet.</p>
				{/if}
				<a
					class="o-button basket__checkout"
					href={mailto}
					onclick={() => trackEvent('basket_checkout', { items: basket.count })}
					>Bestellung per E-Mail senden</a
				>
				<button type="button" class="basket__clear" onclick={() => basket.clear()}
					>Warenkorb leeren</button
				>
			</div>
		{/if}
	</div>
{/if}
