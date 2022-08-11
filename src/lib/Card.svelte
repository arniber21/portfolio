<script lang="ts">
    export let header: string;
	export let path: string;
	export let img: string;
	export let alt: string;
</script>

<div id="card" class="m-3 max-w-sm min-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
    <a href={path}>
        <img class="rounded-t-lg" src={img} alt={alt} />
    </a>
    <div class="p-5">
        <a href={path}>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{header}</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"><slot /></p>
        <a href={path} class="inline-flex items-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            Open
        </a>
    </div>
</div>
