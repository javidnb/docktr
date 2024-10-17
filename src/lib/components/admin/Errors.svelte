<script lang="ts">
	import { dataLoading } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';

	let errors: any = writable([]);

	onMount(() => {
		if (browser) {
			const errorsLS = localStorage.getItem('errors');
			errors.set(errorsLS ? JSON.parse(errorsLS) : []);
		}
		getData();
	});

	async function getData() {
		dataLoading.set(true);
		try {
			let response = await fetch(`https://tekoplast.az/docktr/api/?errors`);

			const result = await response.json();
			if (result) {
				let errs = result.map((r: any) => ({
					id: r.id,
					...JSON.parse(r.error)
				}));

				errors.set(errs);
				localStorage.setItem('errors', JSON.stringify(errs));
				dataLoading.set(false);
				return null;
			}
			dataLoading.set(false);
			return response;
		} catch (error) {
			dataLoading.set(false);
			return null;
		}
	}

	async function emailNoti() {
		let body = { to: 'cavidnebi@gmail.com', body: 'salam brad necesen' };
		const response = await fetch('https://tekoplast.az/docktr/api/?emailNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, // Make sure the content type is JSON
			body: JSON.stringify(body) // Convert body to JSON string
		});
	}

	async function smsNoti() {
		let body = { to: '+994502803233', message: 'salam brad necesen' };
		const response = await fetch('https://tekoplast.az/docktr/api/?smsNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, // Make sure the content type is JSON
			body: JSON.stringify(body) // Convert body to JSON string
		});

		const result = await response.json();
		console.log(result);
	}

	async function pushNoti() {
		let body = {
			uid: '1TgHpEOspfZmDhanm8m1XLgm29u1',
			body: 'test message',
			url: 'https://sehiyye.net/messages',
			sms: true
		};
		const response = await fetch('https://sehiyye.net/api/pushNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const result = await response.json();
		console.log(result);
	}

	async function sendNoti() {
		let body = { to: '+994502803233', message: 'salam brad necesen' };
		const response = await fetch('https://tekoplast.az/docktr/api/?wpNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, // Make sure the content type is JSON
			body: JSON.stringify(body) // Convert body to JSON string
		});

		const result = await response.json();
		console.log(result);
	}

	async function passReset() {
		let body = { phoneNumber: '994502803233', getToken: true };
		const response = await fetch('https://tekoplast.az/docktr/api/?authToken', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const result = await response.json();
		console.log(result);
	}
</script>

<div class="d-flex gap-3 mb-3 w-100 flex-wrap">
	<button class="btn btn-outline-primary flex-1" on:click={sendNoti}>WP Notify</button>
	<button class="btn btn-outline-primary flex-1" on:click={pushNoti}>Push Notify</button>
	<button class="btn btn-outline-primary flex-1" on:click={smsNoti}>SMS Notify</button>
	<button class="btn btn-outline-primary flex-1" on:click={emailNoti}>Email Notify</button>
	<button class="btn btn-outline-primary flex-1" on:click={passReset}>Pass Reset</button>
</div>

<div class="d-flex gap-3 flex-wrap">
	{#each $errors as err}
		<div class="card p-3" style="min-width: fit-content;">
			<span style="font-weight: 500;">{err.message}</span>
			<span style="font-weight: 500;">{err.source}</span>
		</div>
	{/each}
</div>

<style>
	.btn-outline-primary:not(:hover) {
		background: white;
	}
</style>