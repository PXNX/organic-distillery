<script lang="ts">
	import RichText from './RichText.svelte';
	import type { Rich } from '#lib/content/types.js';

	let {
		title,
		image,
		background,
		columns
	}: {
		title: string;
		image?: string | undefined;
		background?: string | undefined;
		columns: Rich[][];
	} = $props();
</script>

{#if background}
	<section class="text-band reveal-target">
		<img class="text-band__bg" src={background} alt="" loading="lazy" decoding="async" />
		<div class="text-band__content container">
			<h2 class="ornate">{title}</h2>
			<div class="text-band__columns">
				{#each columns as column, index (index)}
					<div><RichText paragraphs={column} /></div>
				{/each}
			</div>
		</div>
	</section>
{:else}
	<section class="text-card reveal-target">
		<div class="text-card__inner">
			{#if image}
				<figure class="text-card__image">
					<img src={image} alt="" loading="lazy" decoding="async" />
				</figure>
			{/if}
			<h2 class="ornate">{title}</h2>
			{#each columns as column, index (index)}
				<RichText paragraphs={column} />
			{/each}
		</div>
	</section>
{/if}

<style>
	/* Full-bleed photo with the text on a dark veil. */
	.text-band {
		position: relative;
		display: grid;
		min-height: clamp(26rem, 70vh, 40rem);
		align-items: center;
		overflow: hidden;
		color: var(--mystic-parchment);
		background: var(--mystic-ink);
	}

	.text-band__bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.55;
	}

	.text-band::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgb(12 12 12 / 35%), rgb(12 12 12 / 70%));
	}

	.text-band__content {
		position: relative;
		z-index: 1;
		padding-block: clamp(3rem, 8vw, 5rem);
	}

	.text-band h2 {
		color: var(--mystic-parchment);
		text-align: center;
		margin-bottom: 1.75rem;
	}

	.text-band__columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: clamp(1.5rem, 4vw, 3rem);
		line-height: 1.75;
		text-shadow: 0 1px 12px rgb(0 0 0 / 50%);
	}

	.text-band__columns :global(a) {
		color: var(--mystic-gold);
	}

	/* Photo above a centred column. */
	.text-card {
		padding: clamp(2.5rem, 7vw, 4.5rem) var(--gutter);
	}

	.text-card__inner {
		max-width: 32rem;
		margin-inline: auto;
		text-align: center;
	}

	.text-card__image {
		position: relative;
		margin: 0 0 1.75rem;
	}

	.text-card__image::after {
		content: '';
		position: absolute;
		inset: 0.75rem -0.75rem -0.75rem 0.75rem;
		z-index: -1;
		border: 1px solid var(--mystic-gold);
	}

	.text-card__image img {
		display: block;
		width: 100%;
		box-shadow: 0 16px 36px var(--shadow);
	}

	.text-card__inner :global(p) {
		line-height: 1.75;
	}
</style>
