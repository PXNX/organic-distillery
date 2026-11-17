<script lang="ts">
	import RichText from './blocks/RichText.svelte';
	import type { LegalText } from '#lib/content/legal.js';
	import type { Snippet } from 'svelte';

	let { text, children }: { text: LegalText; children?: Snippet } = $props();
</script>

<article class="legal container">
	<h1 class="ornate">{text.title}</h1>
	{#each text.sections as section, index (index)}
		<section>
			{#if section.heading}<h2>{section.heading}</h2>{/if}
			<RichText paragraphs={section.paragraphs} />
		</section>
	{/each}
	{@render children?.()}
</article>

<style>
	.legal {
		max-width: 46rem;
		padding-block: clamp(2.5rem, 7vw, 4.5rem);
		line-height: 1.75;
	}

	h1 {
		margin-bottom: 2rem;
		text-align: center;
	}

	h2 {
		margin-top: 2.25rem;
		font-size: 1.35rem;
	}

	section + section {
		border-top: 1px solid var(--hairline);
		margin-top: 2rem;
	}
</style>
