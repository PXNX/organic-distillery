<script lang="ts">
	import RichText from './RichText.svelte';
	import type { Link, Rich } from '#lib/content/types.js';

	let {
		title,
		level = 2,
		subtitle,
		body = [],
		actions = []
	}: {
		title?: string | undefined;
		level?: 1 | 2 | undefined;
		subtitle?: string | undefined;
		body?: Rich[];
		actions?: Link[] | undefined;
	} = $props();
</script>

<section class="teaser lattice">
	<div class="container">
		{#if title}
			<svelte:element this={level === 1 ? 'h1' : 'h2'} class="teaser__title ornate"
				>{title}</svelte:element
			>
		{/if}
		{#if subtitle}
			<p class="teaser__subtitle">{subtitle}</p>
		{/if}
		{#if body.length > 0}
			<div class="teaser__body">
				<RichText paragraphs={body} />
			</div>
		{/if}
		{#if actions.length > 0}
			<div class="teaser__actions">
				{#each actions as action (action.href)}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- content links are root-relative paths or external URLs -->
					<a class="btn" href={action.href}>{action.label}</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.teaser {
		padding-block: clamp(2.5rem, 6vw, 4rem);
		background: var(--mystic-ink);
		border-block: 1px solid var(--mystic-gold);
		color: var(--mystic-parchment);
		text-align: center;
	}

	.teaser__title {
		margin-bottom: 0.75rem;
		color: var(--mystic-parchment);
	}

	.teaser__subtitle {
		max-width: 40rem;
		margin: 0 auto 1.5rem;
		color: var(--mystic-gold);
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.6vw, 1.5rem);
		line-height: 1.35;
	}

	.teaser__body {
		max-width: 46rem;
		margin-inline: auto;
		font-family: var(--font-light);
		font-size: clamp(1.1rem, 2.2vw, 1.3rem);
		line-height: 1.55;
		text-align: left;
	}

	.teaser__body :global(p:last-child) {
		margin-bottom: 0;
	}

	.teaser__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.75rem;
	}

	.teaser__title,
	.teaser__subtitle,
	.teaser__body {
		animation: rise-in 0.6s ease-out both;
	}

	.teaser__subtitle {
		animation-delay: 0.08s;
	}

	.teaser__body {
		animation-delay: 0.16s;
	}
</style>
