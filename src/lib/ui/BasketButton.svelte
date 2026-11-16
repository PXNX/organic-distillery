<script lang="ts">
	import { basket, basketUi } from '#lib/features/basket.svelte.js';
</script>

<button
	type="button"
	class="shop-button"
	onclick={() => (basketUi.open = !basketUi.open)}
	aria-label="Warenkorb öffnen"
>
	<span class="shop-button__icon" aria-hidden="true">◇</span>
	<span class="shop-button__label">Shop</span>
	{#if basket.count > 0}
		<span class="shop-button__badge">{basket.count}</span>
	{/if}
</button>
