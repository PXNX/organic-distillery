<script lang="ts">
	import type { Link } from '#lib/content/types.js';

	let {
		title,
		text,
		image,
		link,
		first = false
	}: {
		title?: string | undefined;
		text?: string | undefined;
		image: string;
		link?: Link | undefined;
		first?: boolean;
	} = $props();
</script>

<section class="feature" class:feature--first={first}>
	<img
		class="feature__image"
		src={image}
		alt=""
		loading={first ? 'eager' : 'lazy'}
		fetchpriority={first ? 'high' : undefined}
		decoding="async"
	/>
	{#if title || text || link}
		<div class="feature__text">
			{#if title}<h2>{title}</h2>{/if}
			{#if text}<p>{text}</p>{/if}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- content links are root-relative paths or external URLs -->
			{#if link}<a class="btn btn--light btn--wide" href={link.href}>{link.label}</a>{/if}
		</div>
	{/if}
</section>

<style>
	.feature {
		position: relative;
		display: grid;
		height: calc(100svh - var(--header-height));
		min-height: 28rem;
		overflow: hidden;
		background: var(--mystic-ink);
	}

	.feature__image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 8s ease;
	}

	.feature:hover .feature__image {
		transform: scale(1.03);
	}

	.feature::after {
		content: '';
		position: absolute;
		inset: 45% 0 0;
		background: linear-gradient(180deg, transparent, rgb(12 12 12 / 65%));
		pointer-events: none;
	}

	.feature__text {
		position: relative;
		z-index: 1;
		align-self: end;
		max-width: 44rem;
		margin: 0 auto;
		padding: 0 var(--gutter) 10vh;
		color: var(--mystic-parchment);
		text-align: center;
		text-shadow: 0 2px 18px rgb(0 0 0 / 45%);
	}

	.feature__text h2 {
		color: inherit;
		font-size: clamp(1.6rem, 4vw, 2.2rem);
	}

	.feature__text p {
		margin-bottom: 2rem;
		font-family: var(--font-light);
		font-size: clamp(1.2rem, 3vw, 1.6rem);
		line-height: 1.3;
	}
</style>
