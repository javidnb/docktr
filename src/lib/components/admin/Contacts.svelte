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
			let response = await fetch(`https://tekoplast.az/docktr/api/?contactMessages`);

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

<div class="d-flex align-items-center w-100">
	<h5 style="margin-bottom: 0; min-width: 150px">Gələn Mesajlar</h5>
</div>

<hr class="w-100" />

<div class="d-flex gap-3 flex-column">
	{#each $contactMessages as msg}
		<div class="card p-3">
			<div class="d-flex flex-wrap gap-3">
				<div>
					<div class="d-flex align-items-center gap-1">
						<span class="material-symbols-outlined"> person </span>
						<span>{msg.name}</span>
					</div>
					<div class="d-flex align-items-center gap-1 mt-1">
						<span class="material-symbols-outlined"> call </span>
						<span>{msg.contact}</span>
					</div>
				</div>

				<div class="d-flex align-items-center ms-auto">
					<span style="font-size: small; text-align: right">{formatDate(new Date(msg.date))}</span>
				</div>
			</div>
			<hr class="w-100" />
			<span>{msg.message}</span>
		</div>
	{/each}
</div>
