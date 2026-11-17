<script lang="ts">
	import { page } from '$app/state';
	import IconMenu from '~icons/lucide/menu';
	import IconClose from '~icons/lucide/x';
	import IconFacebook from '~icons/simple-icons/facebook';
	import IconInstagram from '~icons/simple-icons/instagram';
	import { isCurrent, navigation, SITE_NAME, social } from '#lib/content/site.js';

	let open = $state(false);

	// Close the menu whenever the route changes.
	$effect(() => {
		void page.url.pathname;
		open = false;
	});

	$effect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => event.key === 'Escape' && (open = false);
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<header class="site-header" class:is-open={open}>
	<div class="site-header__bar">
		<a class="site-header__logo" href="/" aria-label={`${SITE_NAME} – Startseite`}>
			<img src="/icons/brand-mark.svg" alt="" width="36" height="36" />
		</a>

		<nav id="site-nav" class="site-header__nav" aria-label="Hauptnavigation">
			<ul>
				{#each navigation as item (item.href)}
					<li>
						<a
							href={item.href}
							aria-current={isCurrent(page.url.pathname, item.href) ? 'page' : undefined}
							>{item.label}</a
						>
					</li>
				{/each}
			</ul>
			<div class="site-header__social">
				<a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
					<IconFacebook aria-hidden="true" />
				</a>
				<a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
					<IconInstagram aria-hidden="true" />
				</a>
			</div>
		</nav>

		<button
			type="button"
			class="site-header__toggle"
			aria-expanded={open}
			aria-controls="site-nav"
			aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
			onclick={() => (open = !open)}
		>
			{#if open}<IconClose aria-hidden="true" />{:else}<IconMenu aria-hidden="true" />{/if}
		</button>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 4000;
		background: var(--mystic-ink);
		border-bottom: 1px solid var(--mystic-gold);
		view-transition-name: site-header;
	}

	.site-header__bar {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		height: var(--header-height);
		max-width: 80rem;
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	.site-header__logo {
		display: grid;
		flex: none;
	}

	.site-header__logo img {
		width: 2.25rem;
		height: 2.25rem;
		transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.2);
	}

	.site-header__logo:hover img {
		transform: rotate(-12deg);
	}

	.site-header__nav {
		display: flex;
		flex: 1;
		align-items: center;
	}

	.site-header__nav ul {
		display: flex;
		flex: 1;
		justify-content: center;
		gap: clamp(0.75rem, 2vw, 1.75rem);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.site-header__nav a {
		position: relative;
		display: block;
		padding-block: 0.5rem;
		color: var(--mystic-parchment);
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
		opacity: 0.8;
		transition: opacity 0.2s ease;
	}

	.site-header__nav ul a::after {
		content: '';
		position: absolute;
		inset: auto 0 0.2rem;
		height: 1px;
		background: var(--mystic-gold);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease;
	}

	.site-header__nav a:hover,
	.site-header__nav a[aria-current='page'] {
		opacity: 1;
	}

	.site-header__nav a:hover::after,
	.site-header__nav a[aria-current='page']::after {
		transform: scaleX(1);
	}

	.site-header__social {
		display: flex;
		gap: 0.9rem;
	}

	.site-header__social a {
		color: var(--mystic-gold);
		font-size: 1.05rem;
		opacity: 1;
	}

	.site-header__social :global(svg) {
		display: block;
		transition: transform 0.25s ease;
	}

	.site-header__social a:hover :global(svg) {
		transform: translateY(-2px);
	}

	.site-header__toggle {
		display: none;
		margin-left: auto;
		padding: 0.4rem;
		border: 0;
		background: none;
		color: var(--mystic-gold);
		font-size: 1.6rem;
		cursor: pointer;
	}

	.site-header__toggle :global(svg) {
		display: block;
	}

	@media (max-width: 1023px) {
		.site-header__toggle {
			display: block;
		}

		.site-header__nav {
			position: fixed;
			inset: var(--header-height) 0 auto;
			flex-direction: column;
			align-items: stretch;
			gap: 1.5rem;
			max-height: calc(100svh - var(--header-height));
			padding: 1.5rem var(--gutter) 2rem;
			overflow-y: auto;
			background: var(--mystic-ink);
			border-bottom: 1px solid var(--mystic-gold);
			visibility: hidden;
			opacity: 0;
			transform: translateY(-0.5rem);
			transition:
				opacity 0.25s ease,
				transform 0.25s ease,
				visibility 0s linear 0.25s;
		}

		.is-open .site-header__nav {
			visibility: visible;
			opacity: 1;
			transform: none;
			transition:
				opacity 0.25s ease,
				transform 0.25s ease;
		}

		.site-header__nav ul {
			flex-direction: column;
			gap: 0;
		}

		.site-header__nav ul a {
			padding-block: 0.85rem;
			border-bottom: 1px solid rgb(201 168 106 / 20%);
			font-size: 1rem;
		}

		.site-header__nav ul a::after {
			display: none;
		}

		.site-header__nav ul a[aria-current='page'] {
			color: var(--mystic-gold);
		}

		.site-header__social {
			justify-content: center;
			font-size: 1.2rem;
		}
	}
</style>
