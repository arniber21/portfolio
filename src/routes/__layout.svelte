<script lang="ts">
    import '../app.css';
	import Navbar from "../lib/Navbar/Navbar.svelte";
</script>

<svelte:head>
    <title>Arnab Ghosh</title>
</svelte:head>

<Navbar />
<div class="text-center grid py-5 px-10 flex flex-col items-stretch text-black dark:text-white">
    <slot />
</div>