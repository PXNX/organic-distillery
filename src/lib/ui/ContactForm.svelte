<script lang="ts">
	import {
		buildContactMailto,
		formatContactMessage,
		validateContact,
		type ContactErrors,
		type ContactValues
	} from '#lib/features/contact.js';
	import { trackEvent } from '#lib/features/telemetry.js';

	const MAX_MESSAGE_LENGTH = 2000;

	let values = $state<ContactValues>({ name: '', place: '', email: '', message: '' });
	let errors = $state<ContactErrors>({});
	let submitted = $state(false);
	let copied = $state(false);

	const mailto = $derived(buildContactMailto(values));

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		errors = validateContact(values);
		submitted = Object.keys(errors).length === 0;
		if (submitted) trackEvent('contact_submit');
		copied = false;
	}

	async function copyMessage() {
		try {
			await navigator.clipboard.writeText(formatContactMessage(values));
			copied = true;
		} catch {
			copied = false;
		}
	}
</script>

<form class="contact-form" aria-label="Kontaktformular" onsubmit={onSubmit} novalidate>
	<div class="contact-form__row">
		<div class="contact-form__cell">
			<label class="contact-form__field">
				<span class="contact-form__label">Name *</span>
				<input
					type="text"
					name="your-name"
					autocomplete="name"
					placeholder="Ihr Name"
					maxlength="400"
					bind:value={values.name}
					aria-invalid={Boolean(errors.name)}
					aria-describedby={errors.name ? 'contact-name-error' : undefined}
				/>
			</label>
			{#if errors.name}<span class="contact-form__error" id="contact-name-error">{errors.name}</span
				>{/if}
		</div>

		<label class="contact-form__field">
			<span class="contact-form__label">Ort</span>
			<input
				type="text"
				name="place"
				autocomplete="address-level2"
				placeholder="Ihr Ort"
				maxlength="400"
				bind:value={values.place}
			/>
		</label>
	</div>

	<label class="contact-form__field">
		<span class="contact-form__label">E-Mail *</span>
		<input
			type="email"
			name="email"
			autocomplete="email"
			inputmode="email"
			placeholder="name@beispiel.de"
			maxlength="400"
			bind:value={values.email}
			aria-invalid={Boolean(errors.email)}
			aria-describedby={errors.email ? 'contact-email-error' : undefined}
		/>
	</label>
	{#if errors.email}<span class="contact-form__error" id="contact-email-error">{errors.email}</span
		>{/if}

	<label class="contact-form__field">
		<span class="contact-form__label">Nachricht *</span>
		<textarea
			name="message"
			rows="12"
			maxlength={MAX_MESSAGE_LENGTH}
			placeholder="Erzählen Sie uns, was Sie bewegt …"
			bind:value={values.message}
			aria-invalid={Boolean(errors.message)}
			aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-count'}
		></textarea>
		<span class="contact-form__count" id="contact-message-count">
			{values.message.length} / {MAX_MESSAGE_LENGTH} Zeichen
		</span>
	</label>
	{#if errors.message}<span class="contact-form__error" id="contact-message-error"
			>{errors.message}</span
		>{/if}

	<button class="o-button contact-form__submit" type="submit">Nachricht vorbereiten</button>
</form>

{#if submitted}
	<div class="contact-form__success" role="status">
		<p>Ihre Nachricht ist vorbereitet. Bitte senden Sie sie mit Ihrem E-Mail-Programm ab.</p>
		<a class="o-button" href={mailto}>E-Mail öffnen</a>
		<button type="button" class="o-button" onclick={copyMessage}>
			{copied ? 'Kopiert' : 'Nachricht kopieren'}
		</button>
	</div>
{/if}
