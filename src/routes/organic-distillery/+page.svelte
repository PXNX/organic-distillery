<script lang="ts">
	import PageHead from '#lib/ui/PageHead.svelte';
	import Blocks from '#lib/ui/blocks/Blocks.svelte';
	import { organicDistillery } from '#lib/content/pages.js';
</script>

<PageHead
	title="Organic Distillery"
	description="Die richtungsweisende Brennerei mit rein biologischen Wurzeln am Bodensee."
/>
<Blocks blocks={organicDistillery.blocks} />
