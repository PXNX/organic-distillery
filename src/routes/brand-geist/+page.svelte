<script lang="ts">
	import PageHead from '#lib/ui/PageHead.svelte';
	import Blocks from '#lib/ui/blocks/Blocks.svelte';
	import { brandGeist } from '#lib/content/pages.js';
</script>

<PageHead
	title="Brand & Geist"
	description="Brand & Geist aus der Organic Distillery – bald mehr."
/>
<Blocks blocks={brandGeist.blocks} />
