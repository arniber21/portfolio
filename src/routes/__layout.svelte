<script lang="ts">
    import '../app.css';
	import Navbar from "../lib/Navbar/Navbar.svelte";
</script>

<Navbar />

<div class="text-center p-3 flex flex-col items-center items-stretch text-black dark:text-white">
    <slot />
</div>