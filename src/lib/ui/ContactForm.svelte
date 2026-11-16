<script lang="ts">
	import {
		buildContactMailto,
		formatContactMessage,
		validateContact,
		type ContactErrors,
		type ContactValues
	} from '#lib/features/contact.js';

	let values = $state<ContactValues>({ name: '', place: '', email: '', message: '' });
	let errors = $state<ContactErrors>({});
	let submitted = $state(false);
	let copied = $state(false);

	const mailto = $derived(buildContactMailto(values));

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		errors = validateContact(values);
		submitted = Object.keys(errors).length === 0;
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

<form class="wpcf7-form init contact-form" aria-label="Kontaktformular" onsubmit={onSubmit}>
	<p>
		<label>
			<span class="contact-form__label">Name *</span>
			<input
				class="wpcf7-form-control wpcf7-text"
				type="text"
				name="your-name"
				placeholder="NAME"
				maxlength="400"
				bind:value={values.name}
				aria-invalid={Boolean(errors.name)}
				aria-describedby={errors.name ? 'contact-name-error' : undefined}
			/>
		</label>
		{#if errors.name}<span class="contact-form__error" id="contact-name-error">{errors.name}</span
			>{/if}

		<label>
			<span class="contact-form__label">Ort</span>
			<input
				class="wpcf7-form-control wpcf7-text"
				type="text"
				name="place"
				placeholder="ORT"
				maxlength="400"
				bind:value={values.place}
			/>
		</label>

		<label>
			<span class="contact-form__label">E-Mail *</span>
			<input
				class="wpcf7-form-control wpcf7-email"
				type="email"
				name="email"
				placeholder="EMAIL"
				maxlength="400"
				bind:value={values.email}
				aria-invalid={Boolean(errors.email)}
				aria-describedby={errors.email ? 'contact-email-error' : undefined}
			/>
		</label>
		{#if errors.email}<span class="contact-form__error" id="contact-email-error"
				>{errors.email}</span
			>{/if}

		<label>
			<span class="contact-form__label">Nachricht *</span>
			<textarea
				class="wpcf7-form-control wpcf7-textarea"
				name="message"
				placeholder="NACHRICHT"
				rows="8"
				maxlength="2000"
				bind:value={values.message}
				aria-invalid={Boolean(errors.message)}
				aria-describedby={errors.message ? 'contact-message-error' : undefined}></textarea>
		</label>
		{#if errors.message}<span class="contact-form__error" id="contact-message-error"
				>{errors.message}</span
			>{/if}

		<input class="wpcf7-form-control wpcf7-submit o-button" type="submit" value="Abschicken" />
	</p>
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
