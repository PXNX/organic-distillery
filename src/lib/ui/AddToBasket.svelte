<script lang="ts">
	import { basket, basketUi } from '#lib/features/basket.svelte.js';
	import { formatEuro, type Product } from '#lib/features/basket.js';
	import { trackEvent } from '#lib/features/telemetry.js';

	let { product }: { product: Product } = $props();

	let selected = $state<string | undefined>(undefined);
	let variantId = $derived(selected ?? product.variants[0]?.id ?? '');
	let quantity = $state(1);
	let added = $state(false);

	let variant = $derived(product.variants.find((entry) => entry.id === variantId));

	function add() {
		basket.add(product, variantId, quantity);
		added = true;
		trackEvent('basket_add', { product: product.id, variant: variantId, quantity });
		setTimeout(() => (added = false), 1800);
	}
</script>

<section class="add-to-basket" aria-label={`${product.name} bestellen`}>
	<div class="add-to-basket__controls">
		{#if product.variants.length > 1}
			<label>
				<span>Größe</span>
				<select bind:value={selected}>
					{#each product.variants as option (option.id)}
						<option value={option.id}>{option.label}</option>
					{/each}
				</select>
			</label>
		{/if}
		<label>
			<span>Anzahl</span>
			<input type="number" min="1" max="99" bind:value={quantity} />
		</label>
	</div>

	<button type="button" class="o-button add-to-basket__button" onclick={add}>
		{added ? '✓ Hinzugefügt' : `In den Warenkorb · ${variant ? formatEuro(variant.price) : ''}`}
	</button>
	<button type="button" class="add-to-basket__view" onclick={() => (basketUi.open = true)}>
		Warenkorb ansehen ({basket.count})
	</button>
</section>
