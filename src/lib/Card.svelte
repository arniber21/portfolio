<script lang="ts">
    export let header: string;
	export let path: string;
	export let img: string;
	export let alt: string;
</script>

<div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
    <a href={path}>
        <img class="rounded-t-lg" src={img} alt={alt} />
    </a>
    <div class="p-5">
        <a href={path}>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{header}</h5>
        </a>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"><slot /></p>
        <a href={path} class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Open
        </a>
    </div>
</div>