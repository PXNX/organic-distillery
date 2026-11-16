<script lang="ts">
	import type { RecipeLink } from '#lib/mirror/embellish.js';
	import { trackEvent } from '#lib/features/telemetry.js';

	interface Props {
		recipe: RecipeLink;
		title?: string;
		compact?: boolean;
	}

	let { recipe, title = 'Rezeptkarte', compact = false }: Props = $props();
</script>

<a
	class="recipe-card"
	class:recipe-card--compact={compact}
	href={recipe.href}
	download
	aria-label={`${title} – ${recipe.label}`}
	onclick={() => trackEvent('recipe_download', { essence: title, file: recipe.href })}
>
	<span class="recipe-card__icon" aria-hidden="true">
		<svg
			width="24"
			height="28"
			viewBox="0 0 24 28"
			fill="none"
			stroke="currentColor"
			stroke-width="1.3"
		>
			<path d="M3 1h11l7 7v19H3z" />
			<path d="M14 1v7h7" />
			<text x="5.5" y="21" font-size="6" stroke="none" fill="currentColor">PDF</text>
		</svg>
	</span>
	<span class="recipe-card__body">
		<span class="recipe-card__title">{title}</span>
		<span class="recipe-card__meta">PDF · Rezeptkarte herunterladen</span>
	</span>
	<span class="recipe-card__action" aria-hidden="true">↓</span>
</a>
