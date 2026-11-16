<script lang="ts">
	import { onMount } from 'svelte';
	import { INSTALL_DISMISSAL_KEY, shouldShowInstallHint } from '#lib/pwa.js';

	interface BeforeInstallPromptEvent extends Event {
		prompt(): Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	let { raised = false }: { raised?: boolean } = $props();

	let deferred = $state<BeforeInstallPromptEvent | null>(null);
	let visible = $state(false);
	let dismissed = $state(false);

	onMount(() => {
		if (!shouldShowInstallHint(localStorage.getItem(INSTALL_DISMISSAL_KEY))) return;

		const onPrompt = (event: Event) => {
			event.preventDefault();
			deferred = event as BeforeInstallPromptEvent;
			visible = true;
		};
		const onInstalled = () => {
			visible = false;
			deferred = null;
		};
		window.addEventListener('beforeinstallprompt', onPrompt);
		window.addEventListener('appinstalled', onInstalled);
		return () => {
			window.removeEventListener('beforeinstallprompt', onPrompt);
			window.removeEventListener('appinstalled', onInstalled);
		};
	});

	function dismiss() {
		visible = false;
		dismissed = true;
		try {
			localStorage.setItem(INSTALL_DISMISSAL_KEY, 'true');
		} catch {
			// Private mode: the hint stays hidden for this session only.
		}
	}

	async function install() {
		if (!deferred) return;
		await deferred.prompt();
		const choice = await deferred.userChoice;
		visible = false;
		deferred = null;
		if (choice.outcome === 'dismissed') dismiss();
	}
</script>

{#if visible && !dismissed}
	<div class="install-hint" class:install-hint--raised={raised} role="status">
		<span class="install-hint__ornament" aria-hidden="true">◇</span>
		<span class="install-hint__text">Organic Distillery installieren</span>
		<button type="button" class="install-hint__button" onclick={install}>Installieren</button>
		<button
			type="button"
			class="install-hint__close"
			onclick={dismiss}
			aria-label="Hinweis schließen"
		>
			×
		</button>
	</div>
{/if}
