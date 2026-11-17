<script lang="ts">
	import { goto } from '$app/navigation';
	import { essences } from '#lib/content/products.js';
	import { catalog, essencePath } from '#lib/content/catalog.js';
	import {
		aromaCompass,
		familyForPath,
		flavorFamilies,
		type WheelEssence
	} from '#lib/features/flavor-wheel.js';

	let { highlight }: { highlight?: string | undefined } = $props();

	const compass = aromaCompass(600);
	const drawingFor = (path: string) => {
		const essence = essences.find((entry) => essencePath(entry) === path);
		return essence ? { src: essence.drawing } : undefined;
	};
	const bottleFor = (path: string) => catalog.find((entry) => entry.path === path)?.image ?? null;

	let hovered = $state<string | null>(null);
	let pinned = $state<string | null>(null);
	let family = $state<string | null>(null);
	let lastPointer = 'mouse';

	const active = $derived(hovered ?? pinned ?? highlight ?? null);
	const activeEssence = $derived(
		active ? flavorFamilies.flatMap((f) => f.essences).find((e) => e.path === active) : undefined
	);
	const activeFamily = $derived(active ? familyForPath(active) : undefined);

	const isDim = (essence: WheelEssence, familyName: string) =>
		(family !== null && family !== familyName) || (active !== null && essence.path !== active);

	function onSegmentClick(event: MouseEvent, essence: WheelEssence) {
		// On touch the first tap previews the essence in the centre, the second opens it.
		if (lastPointer === 'touch' && pinned !== essence.path) {
			event.preventDefault();
			pinned = essence.path;
			return;
		}
		event.preventDefault();
		goto(essence.path);
	}

	function toggleFamily(name: string) {
		family = family === name ? null : name;
		pinned = null;
	}
</script>

<section class="aroma-compass" aria-label="Aromarad: fünf Aroma-Familien, zehn Essenzen">
	<div class="aroma-compass__stage">
		<div class="aroma-compass__wheel">
			<div class="aroma-compass__sheen" aria-hidden="true"></div>
			<svg
				viewBox={`0 0 ${compass.size} ${compass.size}`}
				role="group"
				aria-label="Aromarad der Organic Distillery Essenzen"
				onpointerdown={(event) => (lastPointer = event.pointerType)}
			>
				<defs>
					{#each compass.familyArcs as arc, index (arc.family.name)}
						<path id={`compass-family-${index}`} d={arc.label} />
					{/each}
					{#each compass.segments as segment, index (segment.essence.path)}
						<path id={`compass-essence-${index}`} d={segment.label} />
					{/each}
				</defs>

				{#each compass.familyArcs as arc, index (arc.family.name)}
					<g
						class="compass__family"
						class:is-dim={family !== null && family !== arc.family.name}
						role="button"
						tabindex="-1"
						aria-label={`${arc.family.name} filtern`}
						onclick={() => toggleFamily(arc.family.name)}
						onkeydown={(event) => event.key === 'Enter' && toggleFamily(arc.family.name)}
					>
						<path d={arc.path} style={`fill: ${arc.family.color}`} />
						<text>
							<textPath href={`#compass-family-${index}`} startOffset="50%" text-anchor="middle"
								>{arc.family.name}</textPath
							>
						</text>
					</g>
				{/each}

				{#each compass.segments as segment, index (segment.essence.path)}
					{@const drawing = drawingFor(segment.essence.path)}
					<a
						href={segment.essence.path}
						class="compass__segment"
						class:is-dim={isDim(segment.essence, segment.family.name)}
						class:is-active={active === segment.essence.path}
						aria-label={`${segment.essence.name}: ${segment.essence.pairings.join(', ')}`}
						onmouseenter={() => (hovered = segment.essence.path)}
						onmouseleave={() => (hovered = null)}
						onfocus={() => (hovered = segment.essence.path)}
						onblur={() => (hovered = null)}
						onclick={(event) => onSegmentClick(event, segment.essence)}
					>
						<path d={segment.path} style={`fill: ${segment.family.light}`} />
						{#if drawing}
							<image
								href={drawing.src}
								x={segment.x - 34}
								y={segment.y - 30}
								width="68"
								height="68"
								preserveAspectRatio="xMidYMid meet"
							/>
						{/if}
						<text class="compass__name">
							<textPath href={`#compass-essence-${index}`} startOffset="50%" text-anchor="middle"
								>{segment.essence.name}</textPath
							>
						</text>
					</a>
				{/each}

				<circle
					class="compass__hub"
					cx={compass.center}
					cy={compass.center}
					r={compass.rings.essence - 6}
				/>
			</svg>

			<div class="aroma-compass__center" aria-live="polite">
				{#if activeEssence && activeFamily}
					{#key activeEssence.path}
						<div class="compass-card" style={`--family: ${activeFamily.color}`}>
							{#if bottleFor(activeEssence.path)}
								<img src={bottleFor(activeEssence.path)} alt="" />
							{/if}
							<div>
								<span class="compass-card__family">{activeFamily.name}</span>
								<strong>{activeEssence.name}</strong>
								<span class="compass-card__pairs">{activeEssence.pairings.join(' · ')}</span>
								<a href={activeEssence.path}>Zur Essenz →</a>
							</div>
						</div>
					{/key}
				{:else}
					<div class="compass-card compass-card--idle">
						<span class="compass-card__glyph" aria-hidden="true">◇</span>
						<strong>Wählen Sie ein Aroma</strong>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
