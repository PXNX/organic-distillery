<script lang="ts">
	import IconMail from '~icons/lucide/mail';
	import IconPhone from '~icons/lucide/phone';
	import IconPin from '~icons/lucide/map-pin';
	import { contact } from '#lib/content/site.js';

	let { level = 2, cta = false }: { level?: 1 | 2; cta?: boolean } = $props();
</script>

<section class="contact-card lattice">
	<img class="contact-card__logo" src="/icons/brand-mark.svg" alt="" width="88" height="88" />
	<svelte:element this={level === 1 ? 'h1' : 'h2'} class="ornate">Kontakt</svelte:element>
	<p class="contact-card__company">{contact.company}</p>
	<ul>
		<li>
			<IconPin aria-hidden="true" />
			<span>{contact.street}<br />{contact.city} / {contact.region}<br />{contact.country}</span>
		</li>
		<li>
			<IconPhone aria-hidden="true" />
			<a href={contact.phoneHref}>{contact.phone}</a>
		</li>
		<li>
			<IconMail aria-hidden="true" />
			<a href={`mailto:${contact.email}`}>{contact.email}</a>
		</li>
	</ul>
	<p class="contact-card__visits">{contact.visits}</p>
	{#if cta}<a class="btn" href="/kontakt">Nachricht schreiben</a>{/if}
</section>

<style>
	.contact-card {
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		padding: clamp(2.5rem, 7vw, 4rem) var(--gutter);
		background: var(--mystic-ink);
		border-block: 1px solid var(--mystic-gold);
		color: var(--mystic-parchment);
		text-align: center;
	}

	.contact-card__logo {
		width: 5.5rem;
		height: 5.5rem;
		margin-bottom: 1rem;
	}

	h1,
	h2 {
		color: var(--mystic-parchment);
	}

	.contact-card__company {
		margin-bottom: 1rem;
		font-family: var(--font-display);
		font-size: 1.3rem;
		color: var(--mystic-gold);
	}

	ul {
		display: grid;
		gap: 0.75rem;
		margin: 0 0 1.25rem;
		padding: 0;
		list-style: none;
		text-align: left;
	}

	li {
		display: grid;
		grid-template-columns: 1.25rem 1fr;
		gap: 0.75rem;
		align-items: start;
	}

	li :global(svg) {
		margin-top: 0.25rem;
		color: var(--mystic-gold);
	}

	a {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: rgb(201 168 106 / 50%);
		text-underline-offset: 0.2em;
	}

	a.btn {
		margin-top: 0.5rem;
		text-decoration: none;
	}

	.contact-card__visits {
		color: rgb(233 227 211 / 70%);
		font-size: 0.85rem;
		font-style: italic;
	}
</style>
