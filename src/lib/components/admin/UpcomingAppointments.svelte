<script lang="ts">
	import { dataLoading, doctors } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import { browser } from '$app/environment';

	let contactMessages: any = writable([]);

	onMount(() => {
		if (browser) {
			const receivedContactMsgs = localStorage.getItem('upcomingAppointments');
			contactMessages.set(receivedContactMsgs ? JSON.parse(receivedContactMsgs) : []);
		}
		getData();
	});

	async function getData() {
		dataLoading.set(true);
		try {
			let response = await fetch(`https://tekoplast.az/docktr/api/?appointments`);

			const result = await response.json();
			if (result) {
				contactMessages.set(result);
				localStorage.setItem('upcomingAppointments', JSON.stringify(result));
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
		<div class="card p-3 gap-1" style="color: #4a5e44">
			<div class="d-flex gap-2 align-items-center">
				<span class="material-symbols-outlined icon-fill">person</span>
				<span style="font-weight: 500;">{$doctors.find((d) => d.id == msg.doctorId)?.name}</span>
			</div>

			{#if $doctors.find((d) => d.id == msg.doctorId)?.contact}
				<div class="d-flex gap-2 flex-wrap">
					<span class="material-symbols-outlined icon-fill">call</span>
					<span>{$doctors.find((d) => d.id == msg.doctorId)?.contact}</span>
				</div>
			{/if}

			<div class="d-flex gap-2 align-items-center">
				<span class="material-symbols-outlined icon-fill">calendar_month</span>
				<span>{formatDate(new Date(msg.startTime))}</span>
			</div>

			<div class="d-flex mt-1">
				{#if msg.status == 1}
					<span class="d-flex my-auto py-2 gap-1" style="color: #93930a">
						<span class="material-symbols-outlined">pending</span>
						<span>Həkimin təsdiqi gözlənilir</span>
					</span>
				{:else if msg.status == 2}
					<span class="d-flex my-auto py-2 gap-1" style="color: green">
						<span class="material-symbols-outlined">{msg.changed ? 'change_circle' : 'check'}</span>
						<span
							>{msg.changed
								? 'Randevu yeni saata keçirilib.'
								: 'Randevu saatı təsdiq edilib.'}</span
						>
					</span>
				{/if}
			</div>
			<!-- {#if msg.userId}
				<span style="font-size: small; color: gray;">{msg.userId}</span>
			{/if} -->
		</div>
	{/each}
</div>
