<script lang="ts">
	import type { Rich } from '#lib/content/types.js';

	let { paragraphs, class: className = '' }: { paragraphs: Rich[]; class?: string } = $props();

	const external = (href: string) => /^https?:/.test(href);
</script>

{#each paragraphs as paragraph, index (index)}
	<p class={className}>
		{#each paragraph as run, runIndex (runIndex)}
			{#if typeof run === 'string'}
				{run}
			{:else if run.href}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- content links are root-relative paths or external URLs -->
				<a
					href={run.href}
					class:strong={run.strong}
					target={external(run.href) ? '_blank' : undefined}
					rel={external(run.href) ? 'noopener noreferrer' : undefined}>{run.text}</a
				>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{:else if run.strong}
				<strong>{run.text}</strong>
			{:else if run.em}
				<em>{run.text}</em>
			{:else}
				{run.text}
			{/if}
		{/each}
	</p>
{/each}

<style>
	p {
		white-space: pre-line;
	}

	a {
		color: var(--mystic-gold);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
	}

	.strong {
		font-weight: 600;
	}
</style>
