<script lang="ts">
	import '../styles/app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<link rel="stylesheet" href="/vendor/block-library.min.css" />
	<link rel="stylesheet" href="/vendor/styles.min.css" />
	<link rel="stylesheet" href="/vendor/cf7.min.css" />
</svelte:head>

{@render children()}
