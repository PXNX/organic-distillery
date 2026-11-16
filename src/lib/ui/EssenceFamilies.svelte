<script lang="ts">
	import { basket } from '#lib/features/basket.svelte.js';
	import { formatEuro } from '#lib/features/basket.js';
	import { flavorFamilies } from '#lib/features/flavor-wheel.js';
	import { trackEvent } from '#lib/features/telemetry.js';
	import { catalog } from '#lib/content/catalog.js';

	let justAdded = $state<string | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const entryFor = (path: string) => catalog.find((entry) => entry.path === path);

	function add(path: string) {
		const entry = entryFor(path);
		const variant = entry?.product.variants[0];
		if (!entry || !variant) return;
		basket.add(entry.product, variant.id, 1);
		trackEvent('basket_add', { product: entry.product.id, variant: variant.id, from: 'overview' });
		justAdded = path;
		clearTimeout(timer);
		timer = setTimeout(() => (justAdded = null), 1400);
	}
</script>

<section class="essence-families" aria-labelledby="essence-families-title">
	<h2 id="essence-families-title">Alle Essenzen</h2>
	<p class="essence-families__intro">50 ml · biologisch · von Hand mazeriert und destilliert</p>

	{#each flavorFamilies as family (family.name)}
		<div class="essence-family" style={`--family: ${family.color}; --family-light: ${family.light}`}>
			<h3 class="essence-family__name"><span aria-hidden="true"></span>{family.name}</h3>
			<ul>
				{#each family.essences as essence (essence.path)}
					{@const entry = entryFor(essence.path)}
					<li class="essence-tile">
						<a class="essence-tile__link" href={essence.path}>
							<span class="essence-tile__bottle">
								{#if entry?.image}
									<img src={entry.image} alt="" loading="lazy" decoding="async" />
								{/if}
							</span>
							<span class="essence-tile__text">
								<strong>{entry?.product.name ?? essence.name}</strong>
								<small>Passt zu {essence.pairings.join(', ')}</small>
							</span>
						</a>
						{#if entry}
							<button
								type="button"
								class="essence-tile__add"
								class:is-added={justAdded === essence.path}
								onclick={() => add(essence.path)}
								aria-label={`${entry.product.name} in den Warenkorb`}
							>
								<span>{formatEuro(entry.product.variants[0]?.price ?? 0)}</span>
								<span aria-hidden="true">{justAdded === essence.path ? '✓' : '+'}</span>
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</section>
