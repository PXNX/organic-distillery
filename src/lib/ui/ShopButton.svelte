<script lang="ts">
	import { trackEvent } from '#lib/features/telemetry.js';

	function openShop() {
		document.querySelector('.js-order-popup')?.classList.add('is-open');
		trackEvent('shop_open', { source: 'floating_button' });
		requestAnimationFrame(() => {
			document.querySelector<HTMLInputElement>('.js-order-popup input')?.focus();
		});
	}
</script>

<button type="button" class="shop-button" onclick={openShop} aria-label="Online-Shop öffnen">
	<span class="shop-button__icon" aria-hidden="true">◇</span>
	<span class="shop-button__label">Shop</span>
</button>
