<script lang="ts">
	import { basket, basketUi, openBasket } from '#lib/features/basket.svelte.js';

	let celebrating = $state(false);
	let toast = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;
	let seen = basketUi.pulse;

	$effect(() => {
		const pulse = basketUi.pulse;
		if (pulse === seen) return;
		seen = pulse;
		celebrating = false;
		// Restart the animation on the next frame so repeated adds re-trigger it.
		requestAnimationFrame(() => (celebrating = true));
		toast = basketUi.open ? '' : basketUi.lastAdded;
		clearTimeout(timer);
		timer = setTimeout(() => {
			celebrating = false;
			toast = '';
		}, 2200);
	});

	function toggle() {
		if (basketUi.open) basketUi.open = false;
		else openBasket();
	}
</script>

{#if toast}
	<div class="shop-toast" role="status">
		<span aria-hidden="true">✓</span>
		<span><strong>{toast}</strong> liegt im Warenkorb</span>
	</div>
{/if}

<button
	type="button"
	class="shop-button"
	class:is-celebrating={celebrating}
	onclick={toggle}
	aria-label={basket.count > 0 ? `Warenkorb öffnen, ${basket.count} Artikel` : 'Shop öffnen'}
	aria-expanded={basketUi.open}
>
	<span class="shop-button__icon" aria-hidden="true">◇</span>
	<span class="shop-button__label">Shop</span>
	{#if basket.count > 0}
		{#key basket.count}
			<span class="shop-button__badge">{basket.count}</span>
		{/key}
	{/if}
	{#if celebrating}
		<span class="shop-button__sparks" aria-hidden="true">
			<i></i><i></i><i></i><i></i><i></i><i></i>
		</span>
	{/if}
</button>
