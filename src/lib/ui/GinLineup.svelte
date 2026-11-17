<script lang="ts">
	import { formatEuro, GIN_VARIANTS } from '#lib/features/basket.js';
	import { ginPath } from '#lib/content/catalog.js';
	import { gins } from '#lib/content/products.js';

	const focus = { ginn: 'Für Gaumenmenschen', ginnie: 'Für Nasenmenschen' } as const;
</script>

<section class="gin-lineup container" aria-label="Unsere Gins">
	{#each gins as gin (gin.slug)}
		<a class="gin-card" href={ginPath(gin)}>
			<span class="gin-card__stage">
				<img src={gin.bottles['500ml']} alt="" loading="lazy" decoding="async" />
			</span>
			<span class="gin-card__text">
				<span class="eyebrow">{focus[gin.slug]}</span>
				<strong>{gin.name}</strong>
				<small>Organic unfiltered Dry Gin · {gin.abv} % Vol.</small>
				<span class="gin-card__sizes">
					{#each GIN_VARIANTS as variant (variant.id)}
						<span>{variant.label} · {formatEuro(variant.price)}</span>
					{/each}
				</span>
			</span>
		</a>
	{/each}
</section>

<style>
	.gin-lineup {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 1.5rem;
		padding-block: 3rem;
	}

	.gin-card {
		display: grid;
		grid-template-columns: 8rem 1fr;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem;
		border: 1px solid var(--mystic-gold);
		background: var(--plate-bg);
		transition: box-shadow 0.3s ease;
	}

	.gin-card:hover {
		box-shadow: 0 18px 40px var(--shadow);
	}

	.gin-card__stage {
		display: grid;
		place-items: center;
		height: 13rem;
		background: radial-gradient(circle at 50% 55%, rgb(201 168 106 / 22%), transparent 65%);
	}

	.gin-card__stage img {
		height: 100%;
		width: auto;
		transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.25, 1.2);
	}

	.gin-card:hover .gin-card__stage img {
		transform: translateY(-6px) rotate(-2deg);
	}

	.gin-card__text {
		display: grid;
		gap: 0.3rem;
	}

	.gin-card__text .eyebrow {
		margin: 0;
	}

	strong {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 400;
	}

	small {
		color: var(--muted);
	}

	.gin-card__sizes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.5rem;
	}

	.gin-card__sizes span {
		padding: 0.2rem 0.6rem;
		border: 1px solid var(--hairline);
		font-size: 0.8rem;
	}
</style>
