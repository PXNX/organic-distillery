<script lang="ts">
	let { images }: { images: string[] } = $props();
</script>

<section class="gallery container">
	{#each images as image (image)}
		<figure>
			<img src={image} alt="" loading="lazy" decoding="async" />
		</figure>
	{/each}
</section>

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.5rem;
		padding-block: 3rem;
	}

	figure {
		margin: 0;
		overflow: hidden;
		border: 1px solid var(--mystic-gold);
	}

	img {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}
</style>
