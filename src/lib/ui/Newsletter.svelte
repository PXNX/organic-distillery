<script lang="ts">
	import { onMount } from 'svelte';
	import {
		NEWSLETTER_STORAGE_KEY,
		buildNewsletterMailto,
		rememberNewsletterEmail,
		validateNewsletterEmail
	} from '#lib/features/newsletter.js';
	import { trackEvent } from '#lib/features/telemetry.js';

	let email = $state('');
	let error = $state<string | null>(null);
	let registered = $state(false);

	const mailto = $derived(buildNewsletterMailto(email));

	onMount(() => {
		try {
			const saved = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
			if (saved) {
				email = saved;
				registered = true;
			}
		} catch {
			// Ignore unavailable storage.
		}
	});

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		error = validateNewsletterEmail(email);
		if (!error) {
			trackEvent('newsletter_signup');
			registered = true;
			rememberNewsletterEmail(email);
		}
	}
</script>

<section class="newsletter" aria-labelledby="newsletter-title">
	<span class="newsletter__ornament" aria-hidden="true">◇</span>
	<h2 id="newsletter-title">Neuigkeiten aus der Brennerei</h2>
	<p>Erfahren Sie von neuen Destillaten, Essenzen und Verkostungen.</p>

	{#if registered}
		<p class="newsletter__confirmation" role="status">
			Vielen Dank! Ihre Anmeldung ist vorbereitet. Bitte senden Sie sie noch ab:
			<a class="btn" href={mailto}>Anmeldung per E-Mail senden</a>
		</p>
	{:else}
		<form class="newsletter__form" onsubmit={onSubmit} novalidate>
			<label class="sr-only" for="newsletter-email">E-Mail-Adresse</label>
			<input
				id="newsletter-email"
				type="email"
				name="email"
				placeholder="IHRE E-MAIL-ADRESSE"
				maxlength="400"
				bind:value={email}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? 'newsletter-error' : undefined}
			/>
			<button class="btn" type="submit">Anmelden</button>
		</form>
		{#if error}<span class="newsletter__error" id="newsletter-error">{error}</span>{/if}
	{/if}
</section>
