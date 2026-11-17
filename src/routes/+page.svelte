<script lang="ts">
	import ContactCard from '#lib/ui/ContactCard.svelte';
	import Newsletter from '#lib/ui/Newsletter.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import Feature from '#lib/ui/blocks/Feature.svelte';
	import Teaser from '#lib/ui/blocks/Teaser.svelte';
	import { home } from '#lib/content/pages.js';
	import type { Block } from '#lib/content/types.js';

	const features = home.blocks.filter(
		(block): block is Extract<Block, { kind: 'feature' }> => block.kind === 'feature'
	);
	const buyAt = home.blocks.find(
		(block): block is Extract<Block, { kind: 'teaser' }> => block.kind === 'teaser'
	);
	const [intro, ...rest] = features;
	const about = rest.pop();
</script>

<PageHead description="Biologische Gins und Essenzen aus der kleinen Brennerei am Bodensee." />

{#if intro}<Feature image={intro.image} first />{/if}
{#each rest as feature (feature.image)}
	<Feature title={feature.title} text={feature.text} image={feature.image} link={feature.link} />
{/each}

{#if buyAt}
	<Teaser
		title={buyAt.title}
		body={buyAt.body}
		actions={[
			{ href: '/bezug', label: 'Zur Übersicht' },
			{ href: '/essenzen', label: 'Zum Online-Shop' }
		]}
	/>
{/if}

{#if about}
	<Feature title={about.title} image={about.image} link={about.link} />
{/if}

<ContactCard cta />

<aside class="visit-note container" aria-label="Hinweis für Besucher">
	<span aria-hidden="true">◇</span>
	<p>
		<strong>Besuch geplant?</strong> Es gibt keinen Hofladen – wenn Sie persönlich vorbeikommen möchten,
		kontaktieren Sie Christine bitte vorab.
	</p>
</aside>

<Newsletter />

<style>
	.visit-note {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		max-width: 44rem;
		margin-block: 2.5rem;
		text-align: center;
	}

	.visit-note span {
		color: var(--mystic-gold);
	}

	.visit-note p {
		margin: 0;
	}
</style>
