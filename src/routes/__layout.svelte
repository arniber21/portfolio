<script lang="ts">
    import '../app.css';
	import Navbar from "../lib/Navbar/Navbar.svelte";
</script>

<Navbar />

<div class="text-center p-3">
    <slot />
</div>