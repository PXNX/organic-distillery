<script lang="ts">
	import { onMount } from 'svelte';
	import { trackEvent } from '#lib/features/telemetry.js';
	import { applyTheme, nextTheme, storedTheme, type Theme } from '#lib/features/theme.js';

	const year = new Date().getFullYear();

	const productLinks = [
		{ href: '/organic-distillery', label: 'Organic Distillery' },
		{ href: '/ginn-ginnie', label: 'Ginn & Ginnie' },
		{ href: '/essenzen', label: 'Essenzen' },
		{ href: '/brand-geist', label: 'Brand & Geist' }
	];
	const serviceLinks = [
		{ href: '/bezug', label: 'Bezug & Preisliste' },
		{ href: '/kontakt', label: 'Kontakt' },
		{ href: '/ueber-uns', label: 'Über uns' }
	];
	const legalLinks = [
		{ href: '/agb', label: 'AGB' },
		{ href: '/impressum', label: 'Impressum' },
		{ href: '/datenschutz', label: 'Datenschutz' }
	];

	let theme = $state<Theme>('light');

	onMount(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const sync = () => {
			const saved = storedTheme();
			theme = saved === 'light' || saved === 'dark' ? saved : media.matches ? 'dark' : 'light';
			applyTheme(theme, false);
		};
		sync();
		media.addEventListener('change', sync);
		return () => media.removeEventListener('change', sync);
	});

	function toggleTheme() {
		theme = nextTheme(theme);
		applyTheme(theme);
		trackEvent('theme_change', { theme });
	}
</script>

<footer class="site-footer">
	<div class="footer container">
		<div class="footer__brand">
			<span class="footer__mark" aria-hidden="true">◇</span>
			<a class="footer__wordmark" href="/">Organic Distillery</a>
			<p>Handwerk &amp; Sensorik am Bodensee.<br />Biologische Destillate und Essenzen.</p>
			<p class="footer__address">Dornierstr. 139<br />88048 Friedrichshafen<br />Deutschland</p>
			<a class="footer__mail" href="mailto:contact@organic-distillery.com">
				contact@organic-distillery.com
			</a>
		</div>

		<nav class="footer__column" aria-label="Produkte">
			<h2>Produkte</h2>
			<ul>
				{#each productLinks as link (link.href)}
					<li><a href={link.href}>{link.label}</a></li>
				{/each}
			</ul>
		</nav>

		<nav class="footer__column" aria-label="Service">
			<h2>Service</h2>
			<ul>
				{#each serviceLinks as link (link.href)}
					<li><a href={link.href}>{link.label}</a></li>
				{/each}
			</ul>
		</nav>

		<nav class="footer__column" aria-label="Rechtliches">
			<h2>Rechtliches</h2>
			<ul>
				{#each legalLinks as link (link.href)}
					<li><a href={link.href}>{link.label}</a></li>
				{/each}
			</ul>
		</nav>

		<div class="footer__column footer__follow">
			<h2>Folgen</h2>
			<ul>
				<li>
					<a
						href="https://www.facebook.com/Organic-Distillery-298807533647030/"
						target="_blank"
						rel="noopener noreferrer">Facebook</a
					>
				</li>
				<li>
					<a
						href="https://www.instagram.com/organic_distillery/"
						target="_blank"
						rel="noopener noreferrer">Instagram</a
					>
				</li>
			</ul>
			<p class="footer__visit">Kein Hofladen – Besuche nur nach Voranmeldung.</p>
		</div>
	</div>

	<div class="footer__seals" aria-label="Zertifizierungen">
		<img
			src="/icons/seal-bio.svg"
			alt="Biologisch zertifiziert"
			width="72"
			height="72"
			loading="lazy"
		/>
		<img
			src="/icons/seal-demeter.svg"
			alt="Demeter biodynamisch"
			width="72"
			height="72"
			loading="lazy"
		/>
	</div>

	<div class="footer__bottom container">
		<span>© {year} Organic Distillery GmbH</span>
		<span>Bodensee · Germany</span>
		<button
			type="button"
			class="footer__theme"
			onclick={toggleTheme}
			aria-label={theme === 'dark'
				? 'Zum hellen Farbschema wechseln'
				: 'Zum dunklen Farbschema wechseln'}
		>
			{#key theme}
				<span class="footer__theme-icon" aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
			{/key}
			{theme === 'dark' ? 'Hell' : 'Dunkel'}
		</button>
	</div>
</footer>
