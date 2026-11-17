<script lang="ts">
	import LegalPage from '#lib/ui/LegalPage.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import { datenschutz } from '#lib/content/legal.js';
</script>

<PageHead title="Datenschutz" />
<LegalPage text={datenschutz}>
	<aside class="privacy-note" aria-label="Hinweis zur Analyse">
		<h2>Hinweis zur Reichweitenmessung</h2>
		<p>
			Diese Website verwendet Vercel Analytics zur cookiefreien Reichweitenmessung. Es werden keine
			Werbe-Cookies gesetzt und keine personenbezogenen Profile gebildet. Die Messung ist in der
			lokalen Entwicklung deaktiviert.
		</p>
	</aside>
</LegalPage>

<style>
	.privacy-note {
		margin-top: 2.5rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--mystic-gold);
		background: var(--plate-bg);
	}

	.privacy-note h2 {
		margin: 0 0 0.5rem;
		font-size: 1.15rem;
	}

	.privacy-note p {
		margin: 0;
	}
</style>
