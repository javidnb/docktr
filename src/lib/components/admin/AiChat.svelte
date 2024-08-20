<script lang="ts">
	import { dataLoading } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { formatDate } from '$lib/helpers/dateFormatter';

	let contactMessages: any = writable([]);

	onMount(() => {
		getData();
	});

	async function getData() {
		dataLoading.set(true);
		try {
			let response = await fetch(`https://tekoplast.az/docktr/api/?gptChatMessages`);

			const result = await response.json();
			if (result) {
				contactMessages.set(result);
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

<div class="d-flex align-items-center w-100 ps-3" style="height: 36px;">
	<h5 style="margin-bottom: 0; min-width: 150px; color: #52694b">GPT Chat</h5>
</div>

<hr class="w-100" />

<div class="d-flex gap-3 flex-column">
	{#each $contactMessages as msg}
		<div class="card p-3">
			<span style="font-weight: 500;">{msg.user}</span>
			<span>{msg.assistant}</span>
			{#if msg.userId}
				<span style="font-size: small; color: gray; margin-top: 1rem">{msg.userId}</span>
			{/if}
		</div>
	{/each}
</div>
