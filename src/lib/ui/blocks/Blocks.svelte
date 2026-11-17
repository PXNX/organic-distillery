<script lang="ts">
	import Feature from './Feature.svelte';
	import Gallery from './Gallery.svelte';
	import Teaser from './Teaser.svelte';
	import TextBlock from './TextBlock.svelte';
	import type { Block } from '#lib/content/types.js';

	let { blocks }: { blocks: Block[] } = $props();
</script>

{#each blocks as block, index (index)}
	{#if block.kind === 'teaser'}
		<Teaser
			title={block.title}
			level={block.level}
			subtitle={block.subtitle}
			body={block.body}
			actions={block.actions}
		/>
	{:else if block.kind === 'text'}
		<TextBlock
			title={block.title}
			image={block.image}
			background={block.background}
			columns={block.columns}
		/>
	{:else if block.kind === 'feature'}
		<Feature
			title={block.title}
			text={block.text}
			image={block.image}
			link={block.link}
			first={index === 0}
		/>
	{:else if block.kind === 'gallery'}
		<Gallery images={block.images} />
	{/if}
{/each}
