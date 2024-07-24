<script lang="ts">
	import Header from "../lib/Header.svelte";
	import Image from "$lib/Image.svelte";

	const paths = ['myface.jpg', 'ClubImages/img1.png', 'ClubImages/img2.png', 'ClubImages/img3.jpg', 'ClubImages/img4.jpg', 'ClubImages/img5.jpg'];

</script>

<Header> About</Header>
<div class="flex flex-row justify-center text-left grid-cols-3">
    <ul class="display-block list-disc list-inside">
        <p class="">
            Hello! I'm Arnab Ghosh, a student passionate about technology and coding!
        </p>
        <li>
            I'm a <span class="font-bold">Freshman</span> at Cornell University in Ithaca, NY!
        </li>
        <li>
            I have <span class="font-bold">4 years</span> of coding experience, mostly in JS/TS, Kotlin, Java, and C++!
        </li>
        <li>
            I have experience with <span class="font-bold">React, Next.js, Svelte, and Express</span>, and have knowledge of other JavaScript frameworks!
        </li>
        <li>
            I have miscellaneous experience with <span class="font-bold">Java, Kotlin, C++, and Python</span>, for a variety of reasons, including School!
        </li>
        <li>
            I have tutored in <span class="font-bold">Math, English, Science, and Computer Science</span> to other students!
        </li>
    </ul>
</div>
<div class="flex flex-row justify-center text-left grid-cols-3">
    <div class="container columns-3 ">
        {#each paths as src}
            <div class="">
                <Image src={src} alt="" />
            </div>
        {/each}
    </div>
</div>
