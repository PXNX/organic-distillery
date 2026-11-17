<script lang="ts">
	import LegalPage from '#lib/ui/LegalPage.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import { contact } from '#lib/content/site.js';
</script>

<PageHead title="AGB" />
<LegalPage text={{ title: 'AGB', sections: [] }}>
	<p class="agb-note">
		Bei Fragen zu Bestellung, Versand und Zahlung erreichen Sie uns unter
		<a href={`mailto:${contact.email}`}>{contact.email}</a>.
	</p>
</LegalPage>

<style>
	.agb-note {
		text-align: center;
	}

	.agb-note a {
		color: var(--mystic-gold);
	}
</style>
