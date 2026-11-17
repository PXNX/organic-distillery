<script lang="ts">
	import IconExternal from '~icons/lucide/external-link';
	import IconFilm from '~icons/lucide/clapperboard';
	import DownloadButton from './DownloadButton.svelte';
	import type { PressItem } from '#lib/content/types.js';

	let { items }: { items: PressItem[] } = $props();
</script>

<section class="press container" aria-labelledby="press-title">
	<h2 id="press-title" class="ornate">Presse</h2>
	<ul>
		{#each items as item (item.href)}
			<li>
				<time>{item.date}</time>
				<strong>{item.title}</strong>
				<span class="press__source">{item.source}</span>
				<span class="press__action">
					{#if item.kind === 'pdf'}
						<DownloadButton href={item.href} title="Artikel" meta="PDF · Lesen" compact />
					{:else}
						<a class="btn" href={item.href} target="_blank" rel="noopener noreferrer">
							{#if item.kind === 'film'}<IconFilm aria-hidden="true" /> Film{:else}<IconExternal
									aria-hidden="true"
								/> Link{/if}
						</a>
					{/if}
				</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.press {
		padding-block: 3rem;
	}

	h2 {
		text-align: center;
	}

	ul {
		margin: 0;
		padding: 0;
		border-top: 2px solid var(--text);
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 7rem 2fr 1.2fr auto;
		align-items: center;
		gap: 0.5rem 1.25rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--hairline);
	}

	time {
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	strong {
		font-weight: 500;
	}

	.press__source {
		color: var(--muted);
	}

	.press__action {
		justify-self: end;
	}

	.press__action .btn {
		min-height: 2.4rem;
		padding-block: 0.4rem 0.3rem;
	}

	@media (max-width: 760px) {
		li {
			grid-template-columns: 1fr auto;
		}

		strong,
		.press__source {
			grid-column: 1;
		}

		.press__action {
			grid-column: 2;
			grid-row: 1 / span 3;
		}
	}
</style>
