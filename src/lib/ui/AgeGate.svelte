<script lang="ts">
	import { onMount } from 'svelte';
	import { attachAgeGate } from '#lib/features/age-gate.js';

	let gate: HTMLElement;

	// The answer buttons are wired by a tiny inline script in app.html, so they work
	// before hydration; here we only keep focus and assistive tech inside the dialog.
	onMount(() => attachAgeGate(gate));
</script>

<div
	class="age-gate"
	bind:this={gate}
	role="dialog"
	aria-modal="true"
	aria-labelledby="age-gate-title"
	aria-describedby="age-gate-text"
>
	<div class="age-gate__backdrop" aria-hidden="true"></div>
	<div class="age-gate__card">
		<span class="age-gate__frame" aria-hidden="true"></span>
		<img class="age-gate__mark" src="/icons/brand-mark.svg" alt="" width="64" height="64" />
		<p class="age-gate__eyebrow">Organic Distillery · Bodensee</p>

		<div class="age-gate__ask">
			<h2 id="age-gate-title">Sind Sie mindestens 18&nbsp;Jahre alt?</h2>
			<p id="age-gate-text">
				Unsere Gins und Geiste enthalten Alkohol. Bitte bestätigen Sie Ihr Alter, um die Seite zu
				betreten.
			</p>
			<div class="age-gate__actions">
				<button type="button" class="age-gate__yes" data-age-answer="yes">
					Ja, ich bin über 18
				</button>
				<button type="button" class="age-gate__no" data-age-answer="no">Nein</button>
			</div>
		</div>

		<div class="age-gate__declined" aria-live="polite">
			<h2>Bis bald!</h2>
			<p>
				Unsere Destillate sind erst ab 18&nbsp;Jahren. Schauen Sie gerne wieder vorbei, wenn es so
				weit ist.
			</p>
			<button type="button" class="age-gate__no" data-age-answer="retry">Zurück</button>
		</div>

		<p class="age-gate__note">
			Diese Seite verwendet Cookies. Durch die weitere Nutzung der Webseite stimmen Sie der
			Verwendung von Cookies zu.
		</p>
	</div>
</div>
