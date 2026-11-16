<script lang="ts">
	import { basket, basketUi } from '#lib/features/basket.svelte.js';
	import { buildOrderMailto, formatEuro } from '#lib/features/basket.js';
	import { shopMockMode } from '#lib/features/shop/config.js';

	const mailto = $derived(buildOrderMailto(basket.items));
</script>

{#if basketUi.open}
	<div class="basket-overlay" role="presentation" onclick={() => (basketUi.open = false)}></div>
	<div class="basket" role="dialog" aria-modal="true" aria-label="Warenkorb">
		<header class="basket__header">
			<span aria-hidden="true">◇</span>
			<h2>Ihr Warenkorb</h2>
			<button
				type="button"
				class="basket__close"
				onclick={() => (basketUi.open = false)}
				aria-label="Schließen"
			>
				×
			</button>
		</header>

		{#if basket.items.length === 0}
			<p class="basket__empty">Noch nichts ausgewählt. Stellen Sie sich ein Destillat zusammen.</p>
		{:else}
			<ul class="basket__items">
				{#each basket.items as item, index (item.productId + item.variantId)}
					<li>
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
							<span>{item.quantity}</span>
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
							aria-label="Entfernen">×</button
						>
					</li>
				{/each}
			</ul>

			<div class="basket__footer">
				<div class="basket__total">
					<span>Gesamt</span>
					<strong>{formatEuro(basket.total)}</strong>
				</div>
				{#if shopMockMode}
					<p class="basket__mock">Mock-Modus – es wird keine echte Bestellung versendet.</p>
				{/if}
				<a class="o-button basket__checkout" href={mailto}>Bestellung per E-Mail senden</a>
				<button type="button" class="basket__clear" onclick={() => basket.clear()}
					>Warenkorb leeren</button
				>
			</div>
		{/if}
	</div>
{/if}
