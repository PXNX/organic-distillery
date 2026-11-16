<script lang="ts">
	let { src, outline }: { src: string; outline: string } = $props();
</script>

<div
	class="herb-backdrop"
	style={`--herb: url('${src}'); --outline: url('${outline}')`}
	aria-hidden="true"
>
	<img {src} alt="" loading="lazy" decoding="async" />
	<span class="herb-backdrop__shimmer"></span>
</div>
