<script lang="ts">
	import { dataLoading } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import { browser } from '$app/environment';

	let contactMessages: any = writable([]);

	onMount(() => {
		if (browser) {
			const receivedContactMsgs = localStorage.getItem('videoCallReviews');
			contactMessages.set(receivedContactMsgs ? JSON.parse(receivedContactMsgs) : []);
		}
		getData();
	});

	async function getData() {
		dataLoading.set(true);
		try {
			let response = await fetch(`https://tekoplast.az/docktr/api/?callReviews`);

			const result = await response.json();
			if (result) {
				contactMessages.set(result);
				localStorage.setItem('videoCallReviews', JSON.stringify(result));
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
</script>

<div class="d-flex gap-3 flex-wrap">
	{#each $contactMessages as msg}
		<div class="card p-3 flex-1" style="width: fit-content;">
			<span style="font-weight: 500;">appointment: {msg.appointmentId}</span>
			<span>point: {msg.callQuality}</span>
			<span>{msg.message}</span>
			<span style="font-size: small; margin-top: 1rem">{formatDate(new Date(msg.date))}</span>
			{#if msg.userId}
				<span style="font-size: small; color: gray;">{msg.userId}</span>
			{/if}
		</div>
	{/each}
</div>
