<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { basket, basketUi } from '#lib/features/basket.svelte.js';
	import { buildOrderMailto, formatEuro } from '#lib/features/basket.js';
	import { shopMockMode } from '#lib/features/shop/config.js';
	import { trackEvent } from '#lib/features/telemetry.js';

	const mailto = $derived(buildOrderMailto(basket.items));
	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const motion = (duration: number) => (reduceMotion ? 0 : duration);

	let closeButton = $state<HTMLButtonElement | null>(null);

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
			<h2 id="basket-title">Ihr Warenkorb</h2>
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

		{#if basket.items.length === 0}
			<div class="basket__empty" in:fade={{ duration: motion(180) }}>
				<span class="basket__empty-ornament" aria-hidden="true">◇</span>
				<p>Noch nichts ausgewählt.<br />Stellen Sie sich ein Destillat zusammen.</p>
				<div class="basket__empty-links">
					<a class="btn" href="/ginn-ginnie/" onclick={close}>Ginn &amp; Ginnie</a>
					<a class="btn" href="/essenzen/" onclick={close}>Essenzen</a>
				</div>
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
					class="btn basket__checkout"
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
