<script lang="ts">
	import { trackEvent } from '#lib/features/telemetry.js';

	interface Props {
		href: string;
		title: string;
		/** Small caps line under the title. */
		meta?: string;
		compact?: boolean;
		/** Telemetry label; defaults to the title. */
		track?: string;
	}

	let { href, title, meta = 'PDF · Herunterladen', compact = false, track }: Props = $props();
</script>

<a
	class="download-button"
	class:download-button--compact={compact}
	{href}
	download
	aria-label={`${title} – ${meta}`}
	onclick={() => trackEvent('recipe_download', { essence: track ?? title, file: href })}
>
	<span class="download-button__icon" aria-hidden="true">
		<svg viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="1.3">
			<path d="M3 1h11l7 7v19H3z" />
			<path d="M14 1v7h7" />
			<text x="5.2" y="21" font-size="6" stroke="none" fill="currentColor">PDF</text>
		</svg>
	</span>
	<span class="download-button__text">
		<span class="download-button__title">{title}</span>
		<span class="download-button__meta">{meta}</span>
	</span>
	<span class="download-button__arrow" aria-hidden="true">
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6">
			<path d="M8 2v9M4 7.5 8 11.5 12 7.5M3 14h10" />
		</svg>
	</span>
</a>
