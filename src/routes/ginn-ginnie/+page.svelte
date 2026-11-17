<script lang="ts">
	import GinLineup from '#lib/ui/GinLineup.svelte';
	import GinProcess from '#lib/ui/GinProcess.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import Blocks from '#lib/ui/blocks/Blocks.svelte';
	import { ginnGinnie } from '#lib/content/pages.js';

	const [intro, perception, ...story] = ginnGinnie.blocks;
</script>

<PageHead
	title="Ginn & Ginnie"
	description="Zwei Gins, die den Geniesser sensorisch in den Orient entführen – Ginnie für Nasenmenschen, Ginn für Gaumenmenschen."
/>

<Blocks blocks={[intro, perception].filter((block) => block !== undefined)} />
<GinLineup />
<Blocks blocks={story} />
<GinProcess />
