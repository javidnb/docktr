<script lang="ts">
	import { dataLoading, doctors } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import { goto } from '$app/navigation';

	let contactMessages: any = writable([]);

	onMount(() => {
		getData();
	});

	async function getData() {
		dataLoading.set(true);
		try {
			let response = await fetch(`https://tekoplast.az/docktr/api/?awaitingComments`);

			const result = await response.json();

			console.log(result);

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

<div class="d-flex align-items-center w-100 ps-3">
	<h5 style="margin-bottom: 0; min-width: 150px; color: #52694b">Təsdiq Gözləyən Şərhlər</h5>
</div>

<hr class="w-100" />

<div class="d-flex gap-3 flex-column">
	{#each $contactMessages as msg}
		<div class="card p-3">
			<div class="d-flex flex-wrap gap-3">
				<div style="color: #52694b">
					{#if msg.displayName}
						<div class="d-flex align-items-center gap-1">
							<span class="material-symbols-outlined icon-fill"> person </span>
							<span>{msg.displayName}</span>
						</div>
					{/if}
					{#if msg.phoneNumber}
						<div class="d-flex align-items-center gap-1 mt-1">
							<span class="material-symbols-outlined icon-fill"> call </span>
							<span>{msg.phoneNumber}</span>
						</div>
					{/if}
					{#if msg.email}
						<div class="d-flex align-items-center gap-1 mt-1">
							<span class="material-symbols-outlined icon-fill"> mail </span>
							<span>{msg.email}</span>
						</div>
					{/if}
				</div>

				<div class="d-flex align-items-center flex-column ms-auto gap-2">
					<button
						class="btn btn-outline-primary w-100"
						on:click={() => {
							goto(`./doctors/${$doctors.find((d) => d.id == msg.doctorId)?.slug}`);
						}}>{$doctors.find((d) => d.id == msg.doctorId)?.name}</button
					>
					<span style="font-size: small; text-align: right">{formatDate(new Date(msg.date))}</span>
				</div>
			</div>
			<hr class="w-100" />
			<span class="px-3">{msg.comment}</span>
		</div>
	{/each}
</div>
