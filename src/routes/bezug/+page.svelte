<script lang="ts">
	import IconMail from '~icons/lucide/mail';
	import IconCart from '~icons/lucide/shopping-bag';
	import DownloadButton from '#lib/ui/DownloadButton.svelte';
	import PageHead from '#lib/ui/PageHead.svelte';
	import Teaser from '#lib/ui/blocks/Teaser.svelte';
	import { openBasket } from '#lib/features/basket.svelte.js';
	import { retailerPdf, retailerSections } from '#lib/content/retailers.js';
	import { contact } from '#lib/content/site.js';
</script>

<PageHead
	title="Bezug"
	description="Unsere Produkte sind in über 50 Geschäften erhältlich – oder direkt bei uns."
/>

<Teaser
	title="Bezugsquellen"
	level={1}
	body={[
		[
			'Unsere Produkte sind in über 50 Geschäften erhältlich. Im Folgenden finden Sie eine Liste unserer Händler.'
		]
	]}
/>

<div class="buy container">
	<section class="buy__direct" aria-labelledby="direct-title">
		<h2 id="direct-title">Direkt bei uns bestellen</h2>
		<p>Mit Postversand – über den Warenkorb oder per E-Mail.</p>
		<div class="buy__actions">
			<button type="button" class="btn btn--solid" onclick={() => openBasket()}>
				<IconCart aria-hidden="true" /> Zum Warenkorb
			</button>
			<a class="btn" href={`mailto:${contact.email}`}><IconMail aria-hidden="true" /> Per E-Mail</a>
		</div>
	</section>

	{#each retailerSections as section (section.title)}
		<section class="buy__section" aria-labelledby={`section-${section.title}`}>
			<h2 id={`section-${section.title}`} class="ornate">{section.title}</h2>
			{#each section.groups as group (group.label)}
				<details class="buy__country" open>
					<summary>
						<span>{group.label}</span>
						<small>{group.retailers.length}</small>
					</summary>
					<ul>
						{#each group.retailers as retailer (retailer.name + retailer.street)}
							<li>
								<span class="buy__city">{retailer.city}</span>
								<strong>{retailer.name}</strong>
								<span>{retailer.street}</span>
								<span>{retailer.zip}</span>
							</li>
						{/each}
					</ul>
				</details>
			{/each}
		</section>
	{/each}

	<div class="buy__download">
		<DownloadButton
			href={retailerPdf}
			title="Bezugsquellen DACH"
			meta="PDF · Händler & Preisliste"
		/>
	</div>
</div>

<style>
	.buy {
		padding-block: 3rem 1rem;
	}

	.buy__direct {
		margin-bottom: 3rem;
		padding: 1.75rem;
		border: 1px solid var(--mystic-gold);
		background: var(--plate-bg);
		text-align: center;
	}

	.buy__direct h2 {
		margin-bottom: 0.25rem;
	}

	.buy__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
	}

	.buy__section + .buy__section {
		margin-top: 3rem;
	}

	.buy__section > h2 {
		text-align: center;
	}

	.buy__country {
		border-top: 2px solid var(--text);
	}

	.buy__country + .buy__country {
		margin-top: 1.75rem;
	}

	summary {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 0.6rem 0;
		border-bottom: 1px solid var(--hairline);
		font-weight: 600;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary small {
		color: var(--muted);
		font-weight: 400;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 9rem 2fr 1.4fr 1.2fr;
		gap: 0.25rem 1rem;
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--hairline);
	}

	li strong {
		font-weight: 500;
	}

	.buy__city {
		color: var(--mystic-gold);
	}

	.buy__download {
		display: flex;
		justify-content: center;
		margin-top: 3rem;
	}

	@media (max-width: 760px) {
		li {
			grid-template-columns: 1fr;
		}

		.buy__city {
			font-size: 0.75rem;
			letter-spacing: 0.14em;
			text-transform: uppercase;
		}
	}
</style>
