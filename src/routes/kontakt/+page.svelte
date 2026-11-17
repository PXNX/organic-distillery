<script lang="ts">
	import ContactCard from '#lib/ui/ContactCard.svelte';
	import ContactForm from '#lib/ui/ContactForm.svelte';
	import Newsletter from '#lib/ui/Newsletter.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
</script>

<PageHead title="Kontakt" description="Organic Distillery GmbH, Friedrichshafen am Bodensee." />

<ContactCard level={1} />
<ContactForm />
<Newsletter />
