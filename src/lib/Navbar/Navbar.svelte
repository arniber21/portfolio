<script lang="ts">
    import NavbarElement from "./NavbarElement.svelte";
	import NavbarHeader from "./NavbarHeader.svelte";
	import NavbarMobileMenu from "./NavbarMobileMenu.svelte";
</script>

<nav class="border-b border-gray-200 px-2 sm:px-4 py-2.5 rounded w-full sticky top-0 dark:bg-gray-900">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
        <!-- The thing at the start -->
        <NavbarHeader> Arnab Ghosh </NavbarHeader>
        <!-- Mobile menu -->
        <NavbarMobileMenu />
        <!-- The navbar items -->
        <div class="hidden w-full md:block md:w-auto" id="navbar-sticky">
            <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <NavbarElement path="/">Home</NavbarElement>
                <NavbarElement path="/about">About</NavbarElement>
                <NavbarElement path="/portfolio">Portfolio</NavbarElement>
                <NavbarElement path="/contact">Contact Me</NavbarElement>
            </ul>
        </div>
    </div>
</nav>