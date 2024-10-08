<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ReviewCall from '$lib/components/ReviewCall.svelte';
	import VideoCall from '$lib/components/VideoCall.svelte';
	import Modal from '$lib/helpers/Modal.svelte';
	import { session } from '$lib/session';
	import {
		appointments,
		dataLoading,
		doctors,
		ongoingAppointment,
		reviewModal,
		selectedUser
	} from '$lib/store/dataStore';
	import { onMount } from 'svelte';

	let app = $appointments.find((a) => a.id == $page.params.slug);
	let appointmentId: number | null = null;
	onMount(() => {
		if (app) {
			appointmentId = app.id;
			ongoingAppointment.set(app);
			dataLoading.set(true);
			if ($session.user) {
				if (app.userId == $session.user.uid) {
					selectedUser.set($doctors.find((doc) => doc.id == app.doctorId)?.uid);
				} else {
					selectedUser.set(app.userId);
				}
			}
			dataLoading.set(false);
		} else {
			goto('../appointments');
		}
	});
</script>

<div class="d-flex justify-content-center">
	<button
		class="btn"
		on:click={() => {
			goto('/appointments');
		}}
	>
		<img
			src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
			alt="Sehiyye logo"
			style="width: 150px; margin-top: 1rem; cursor: pointer"
		/>
	</button>
</div>

<div class="d-flex justify-content-center">
	<div class="lds-ellipsis" style="position: fixed; top: 50%; transform: translateY(-50%)">
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</div>
</div>

{#if appointmentId}
	<VideoCall {appointmentId} />
{/if}

{#if $reviewModal}
	<Modal bind:showModal={$reviewModal}>
		<div class="p-3" style="background-color: rgb(240 240 240 / 45%);">
			<ReviewCall />
		</div>
	</Modal>
{/if}
