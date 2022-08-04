<!--suppress ALL -->
<script lang="ts">
    import {onMount} from "svelte";
	import Header from "../lib/Header.svelte";
	import FormEmailInput from "../lib/Form/FormEmailInput.svelte";
	import FormTextInput from "../lib/Form/FormTextInput.svelte";
	import {vars} from "../lib/vars";

	const errorInputClassList = 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500';
    let nameField = "";
	let emailField = "";
	let subjectField = "";
	let messageBody = "";
	let emailSent = false;

	$: sentMessage = emailSent ? "Message sent!" : null;

	$: emailError = String(emailField)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		) || emailField.length === 0 ? null : "Invalid Email";

	// On form submission
	const sendEmail = async () => {
		// The email to send
		const email = {
			accessKey: vars.staticFormsKey,
			name: nameField,
            email: emailField,
            subject: subjectField,
            message: messageBody
        }

		// Making request
		await fetch('https://api.staticforms.xyz/submit', {
			method: "POST",
			body: JSON.stringify(email),
			headers: { 'Content-Type': 'application/json' }
        });

		// Letting the user know
		alert("Email Sent!")
        emailSent = true;

        // CLearing the forms
        nameField = "";
		emailField = "";
		subjectField = "";
		messageBody = "";
    }
</script>

<Header>Contact Me</Header>
<div class="grow m-10">
    <form on:submit|preventDefault={sendEmail}>
        <div class="mb-6">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Name</label>
            <input type="text" name="name" id="name"
                   class=
                           "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   bind:value={nameField} required>
        </div>
        <div class="mb-6">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Email </label>
            <input type="email" name="email" id="email"
                   class={ emailError ? errorInputClassList :
                   "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
                   bind:value={emailField} placeholder="john.doe@company.com" required>
            {#if emailError}
                <p class="mt-2 text-sm text-red-600 dark:text-red-500"> {emailError} </p>
            {/if}
        </div>
        <div class="mb-6">
            <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Subject </label>
            <input type="text" name="subject" id="subject"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   bind:value={subjectField} required>
        </div>
        <div class="mb-6">
            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                Your message
            </label>
            <textarea id="message" rows="4" name="messagebody"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      bind:value={messageBody} placeholder="Your message..." />
        </div>
        <button type="submit"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Submit
        </button>
    </form>

</div>
