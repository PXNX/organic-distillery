<script lang="ts">
	import { buildWheel, flavorFamilies, type WheelEssence } from '#lib/features/flavor-wheel.js';

	let { highlight }: { highlight?: string | undefined } = $props();

	const wheel = buildWheel();
	let hovered = $state<string | null>(null);
	const active = $derived(hovered ?? highlight ?? null);

	const isDimmed = (essence: WheelEssence | undefined) =>
		Boolean(active && essence && essence.path !== active);
</script>

<section class="flavor-wheel" aria-labelledby="flavor-wheel-title">
	<span class="flavor-wheel__ornament" aria-hidden="true">◇</span>
	<h2 id="flavor-wheel-title">Das Aromarad der Essenzen</h2>
	<p class="flavor-wheel__intro">
		Fünf Aroma-Familien, zehn Essenzen – jede mit ihrer eigenen sensorischen Signatur und passenden
		Aromen in Küche und Bar.
	</p>

	<div class="flavor-wheel__layout">
		<svg
			class="flavor-wheel__svg"
			viewBox="0 0 400 400"
			role="img"
			aria-label="Aromarad der Organic Distillery Essenzen"
		>
			{#each wheel.outer as segment (segment.family)}
				<path
					d={segment.path}
					fill={segment.color}
					stroke="var(--mystic-parchment)"
					stroke-width="2"
				/>
				<text
					x={segment.labelX}
					y={segment.labelY}
					transform={`rotate(${segment.rotation} ${segment.labelX} ${segment.labelY})`}
					text-anchor="middle"
					dominant-baseline="middle"
					class="flavor-wheel__family"
					fill="#1d1d1b"
				>
					{segment.family}
				</text>
			{/each}

			{#each wheel.inner as segment (segment.essence?.path)}
				<path
					d={segment.path}
					fill={segment.color}
					stroke="var(--mystic-parchment)"
					stroke-width="2"
					class="flavor-wheel__slice"
					class:flavor-wheel__slice--dim={isDimmed(segment.essence)}
					class:flavor-wheel__slice--active={active === segment.essence?.path}
					role="button"
					tabindex="0"
					aria-label={segment.essence?.name ?? ''}
					onmouseenter={() => segment.essence && (hovered = segment.essence.path)}
					onmouseleave={() => (hovered = null)}
					onfocus={() => segment.essence && (hovered = segment.essence.path)}
					onblur={() => (hovered = null)}
				/>
				{#if segment.essence}
					<text
						x={segment.labelX}
						y={segment.labelY}
						transform={`rotate(${segment.rotation} ${segment.labelX} ${segment.labelY})`}
						text-anchor="middle"
						dominant-baseline="middle"
						class="flavor-wheel__essence"
						class:flavor-wheel__essence--dim={isDimmed(segment.essence)}
					>
						{segment.essence.name}
					</text>
				{/if}
			{/each}

			<circle cx="200" cy="200" r="72" fill="var(--mystic-parchment)" stroke="var(--mystic-gold)" />
			<text x="200" y="182" text-anchor="middle" class="flavor-wheel__center-small"
				>Das Organic Distillery</text
			>
			<text x="200" y="202" text-anchor="middle" class="flavor-wheel__center">Aromarad</text>
			<text x="200" y="222" text-anchor="middle" class="flavor-wheel__center-small"
				>der ersten Essenzen</text
			>
		</svg>

		<div class="flavor-wheel__legend">
			{#each flavorFamilies as family (family.name)}
				<div class="flavor-wheel__legend-group">
					<h3><span style={`background:${family.color}`}></span>{family.name}</h3>
					<ul>
						{#each family.essences as essence (essence.path)}
							<li class:flavor-wheel__legend-item--active={active === essence.path}>
								<a href={essence.path}>{essence.name}</a>
								<span>{essence.pairings.join(' · ')}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
