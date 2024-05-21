<script lang="ts">
	import { onMount } from 'svelte';
	import {
		loginModal,
		selectedAppointmentDate,
		appointmentModal,
		postData,
		appointments
	} from '$lib/store/dataStore';
	import { session } from '$lib/session';
	import DatePicker from '$lib/helpers/DatePicker.svelte';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import { toast } from '@zerodevx/svelte-toast';

	export let doc: any;

	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
	let init = true;
	let disabled: boolean = false;

	onMount(async () => {
		init = true;
		selectedAppointmentDate.set({ day: null, time: null, start: null, end: null });
		appointmentModal.set(false);
	});

	// after user logs in launches appointment modal again, if it was launched earlier
	$: if ($session.user && $selectedAppointmentDate.day && !init) {
		appointmentModal.set(true);
	}

	async function postAppointment() {
		init = false;
		if (!$session.user) {
			console.log('login');
			appointmentModal.set(false);
			loginModal.set(true);
			return;
		}
		if ($loginModal == false) {
			disabled = true;
			let data = {
				userId: $session.user.uid,
				doctorId: doc.id,
				startTime: jsDateToSQL($selectedAppointmentDate.start),
				endTime: jsDateToSQL($selectedAppointmentDate.end),
				status: 1
			};
			let post = await postData('appointments', data);
			if (post == 'ok') {
				appointments.set([...$appointments, data]);
				appointmentModal.set(false);
				toast.push('Randevu qeydə alındı!', {
					duration: 2000,
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgb(91 144 77)',
						'--toastBarBackground': '#1d5b3c'
					}
				});
			}
		}
	}
</script>

<section>
	<div class="container-fluid">
		{#if !$selectedAppointmentDate.day}
			<div class="row">
				<DatePicker />
			</div>
		{:else}
			<div class="row d-flex">
				<div class="d-flex flex-column ps-3">
					<span>Seçdiyiniz tarix:</span>
					<span> {$selectedAppointmentDate.day} - {$selectedAppointmentDate.time}</span>
				</div>

				<div class="d-flex gap-3 mt-3">
					<button
						{disabled}
						class="btn btn-secondary w-100 d-flex"
						on:click={() =>
							selectedAppointmentDate.set({ day: null, time: null, start: null, end: null })}
						><span class="material-symbols-outlined"> replay </span>
						<span class="mx-auto">Dəyişdir</span></button
					>
					<button {disabled} class="btn btn-primary w-100 d-flex" on:click={postAppointment}
						><span class="material-symbols-outlined"> check </span>
						<span class="mx-auto">Təsdiqlə</span>
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
</style>
