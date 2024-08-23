<script lang="ts">
	import { dataLoading, selectedUser } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let contactMessages: any = writable([]);


	onMount(() => {
		if (browser) {
			const receivedContactMsgs = localStorage.getItem('receivedContactMsgs');
			contactMessages.set(receivedContactMsgs ? JSON.parse(receivedContactMsgs) : []);
		}
		getData();
	});

	async function getData() {
		dataLoading.set(true);
		try {
			let response = await fetch(`https://tekoplast.az/docktr/api/?contactMessages`);

			const result = await response.json();
			if (result) {
				contactMessages.set(result);
				localStorage.setItem('receivedContactMsgs', JSON.stringify(result));
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

<div class="d-flex gap-3 flex-column">
	{#each $contactMessages as msg}
		<div class="card p-3">
			<div class="d-flex flex-wrap gap-3">
				<div style="color: #52694b">
					{#if msg.name}
						<div class="d-flex align-items-center gap-1">
							<span class="material-symbols-outlined icon-fill"> person </span>
							<span>{msg.name}</span>
						</div>
					{/if}
					{#if msg.contact}
						<div class="d-flex align-items-center gap-1 mt-1">
							<span class="material-symbols-outlined icon-fill"> call </span>

							<span>{msg.contact}</span>
						</div>
					{/if}
				</div>

				<div class="d-flex flex-column row-gap-2 align-items-center justify-content-end ms-auto">
					{#if msg.uid}
						<button
							on:click={() => {
								selectedUser.set(msg.uid);
								goto('/messages');
							}}
							class="btn btn-outline-primary w-100">Mesaj yaz</button
						>
					{/if}
					<span style="font-size: small; text-align: right">{formatDate(new Date(msg.date))}</span>
				</div>
			</div>
			<hr class="w-100" />
			<span class="px-3">{msg.message}</span>
		</div>
	{/each}
</div>
