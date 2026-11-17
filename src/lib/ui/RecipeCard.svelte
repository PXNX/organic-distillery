<script lang="ts">
	import DownloadButton from './DownloadButton.svelte';
	import type { RecipeLink } from '#lib/mirror/embellish.js';

	interface Props {
		recipe: RecipeLink;
		title?: string;
		compact?: boolean;
	}

	let { recipe, title = 'Rezeptkarte', compact = false }: Props = $props();
</script>

<DownloadButton href={recipe.href} {title} meta="PDF · Rezeptkarte" {compact} />
