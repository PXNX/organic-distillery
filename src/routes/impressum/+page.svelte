<script lang="ts">
	import LegalPage from '#lib/ui/LegalPage.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import { impressum } from '#lib/content/legal.js';
</script>

<PageHead title="Impressum" />
<LegalPage text={impressum} />
