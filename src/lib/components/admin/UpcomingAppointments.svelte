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
			console.log(result);
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
		<div class="card p-3 gap-1" style="color: #4a5e44; min-width: unset">
			<div style="border-bottom: 1px solid #ececec; padding-bottom: 10px">
				<div class="d-flex gap-2 align-items-center">
					<span class="material-symbols-outlined icon-fill">stethoscope</span>
					<span style="font-weight: 500;">{$doctors.find((d) => d.id == msg.doctorId)?.name}</span>
				</div>

				{#if $doctors.find((d) => d.id == msg.doctorId)?.contact}
					<div class="d-flex gap-2 flex-wrap">
						<span class="material-symbols-outlined icon-fill">call</span>
						<span>{$doctors.find((d) => d.id == msg.doctorId)?.contact}</span>
					</div>
				{/if}
			</div>

			<div style="border-bottom: 1px solid #ececec; padding-bottom: 10px">
				<div class="d-flex gap-2 align-items-center">
					<span class="material-symbols-outlined icon-fill">person</span>
					<span style="font-weight: 500;">{msg.displayName}</span>
				</div>
				{#if msg.phoneNumber}
					<div class="d-flex gap-2 flex-wrap">
						<span class="material-symbols-outlined icon-fill">call</span>
						<span>{msg.phoneNumber}</span>
					</div>
				{/if}
				{#if msg.email}
					<div class="d-flex gap-2 flex-wrap">
						<span class="material-symbols-outlined icon-fill">alternate_email</span>
						<span>{msg.email}</span>
					</div>
				{/if}
			</div>

			<div class="d-flex gap-2 align-items-center mt-2">
				<span class="material-symbols-outlined icon-fill">calendar_month</span>
				<span class="mx-auto">{formatDate(new Date(msg.startTime))}</span>
			</div>

			<div class="d-flex my-auto" style="border-block: 1px solid #ececec">
				{#if msg.status == 1}
					<div
						class="d-flex my-auto py-2 gap-1 w-100 align-items-center text-center"
						style="color: #93930a"
					>
						<span class="material-symbols-outlined">pending</span>
						<span class="mx-auto">Həkimin təsdiqi gözlənilir</span>
					</div>
				{:else if msg.status == 10}
					<div
						class="d-flex my-auto py-2 gap-1 w-100 align-items-center text-center"
						style="color: rgb(175 0 0)"
					>
						<span class="material-symbols-outlined icon-fill">cancel</span>
						<span class="mx-auto">Görüş həkim tərəfindən ləğv edilib</span>
					</div>
				{/if}
			</div>
			<span class="mt-auto ms-auto" style="color: gray; font-size: smaller"># {msg.id}</span>
			<!-- {#if msg.userId}
				<span style="font-size: small; color: gray;">{msg.userId}</span>
			{/if} -->
		</div>
	{/each}
</div>
