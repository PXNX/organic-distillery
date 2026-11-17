<script lang="ts">
	import Newsletter from '#lib/ui/Newsletter.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import PressList from '#lib/ui/PressList.svelte';
	import Blocks from '#lib/ui/blocks/Blocks.svelte';
	import { ueberUns } from '#lib/content/pages.js';
	import { credits, press } from '#lib/content/press.js';

	const [intro, portrait, family] = ueberUns.blocks;
</script>

<PageHead
	title="Über uns"
	description="Christine Brugger, Sensorik-Wissenschaftlerin und Destillateurin am Bodensee."
/>

<Blocks blocks={[intro, portrait].filter((block) => block !== undefined)} />
<PressList items={press} />
{#if family}<Blocks blocks={[family]} />{/if}

<ul class="credits container">
	{#each credits as credit (credit.names)}
		<li><strong>{credit.names}</strong> <span>{credit.role}</span></li>
	{/each}
</ul>

<Newsletter />

<style>
	.credits {
		display: grid;
		gap: 0.75rem;
		margin-block: 2.5rem;
		padding: 0;
		list-style: none;
		text-align: center;
	}

	.credits strong {
		display: block;
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 400;
	}

	.credits span {
		color: var(--muted);
		font-size: 0.8rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
</style>
