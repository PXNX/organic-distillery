<script lang="ts">
	import { page } from '$app/state';

	const suggestions = [
		{ href: '/', label: 'Startseite' },
		{ href: '/ginn-ginnie', label: 'Ginn & Ginnie' },
		{ href: '/essenzen', label: 'Essenzen' },
		{ href: '/kontakt', label: 'Kontakt' }
	];

	let status = $derived(page.status);
	let title = $derived(
		status === 404 ? 'Diese Seite wurde nicht gefunden.' : 'Etwas ist schiefgelaufen.'
	);
	let description = $derived(
		status === 404
			? 'Der gesuchte Weg führt leider nicht zu einer Destillat-Kreation. Vielleicht finden Sie unten den richtigen Pfad.'
			: 'Beim Laden dieser Seite ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder nehmen Sie Kontakt auf.'
	);
</script>

<svelte:head>
	<title>{status} – Organic Distillery</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="error-page">
	<div class="error-page__card">
		<span class="error-page__ornament" aria-hidden="true">◇</span>
		<p class="error-page__status">{status}</p>
		<h1>{title}</h1>
		<p class="error-page__description">{description}</p>

		<nav class="error-page__links" aria-label="Weiter zur">
			{#each suggestions as link (link.href)}
				<a class="btn" href={link.href}>{link.label}</a>
			{/each}
		</nav>

		<a class="error-page__mail" href="mailto:contact@organic-distillery.com">
			contact@organic-distillery.com
		</a>
	</div>
</main>
