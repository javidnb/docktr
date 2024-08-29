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
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';

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
				sendNotification(doc.id);
				toast.push('Randevu qeydə alındı!', {
					duration: 2000,
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgb(91 144 77)',
						'--toastBarBackground': '#1d5b3c'
					}
				});
				goto('../appointment');
			}
		}
	}

	async function sendNotification(doctorId: any) {
		let time = new Date().getTime();
		const fcmToken = await fetch(
			`https://tekoplast.az/docktr/api/?getTokens&uid=${doctorId}&type=doctor&t=${time}`
		);
		const fcmTokens = await fcmToken.json();

		let requestData = {
			tokens: JSON.stringify(fcmTokens[0].fcmToken),
			title: null,
			body: 'Yeni randevu',
			url: 'https://sehiyye.online/appointment'
		};

		const response = await fetch(`https://tekoplast.az/docktr/api/?pushNotification`, {
			method: 'POST',
			cache: 'no-store',
			body: JSON.stringify({ ...requestData })
		});
	}
</script>

<section>
	<div class="container-fluid">
		{#if !$selectedAppointmentDate.day}
			<div class="row">
				<DatePicker />
			</div>
		{:else}
			<div class="row d-flex pt-3">
				<div class="d-flex flex-column ps-3" style="width: fit-content;">
					<div
						class="d-flex justify-content-center flex-column"
						style="font-size: large;
						background: rgb(243, 243, 243);
						border-radius: 6px;
						padding: 0px 15px;
						color: #6f8769;
						box-shadow: 0px 0px 7px 0px #6f876954;"
					>
						<div class="d-flex align-items-center gap-2 mt-3 mb-1">
							<span class="material-symbols-outlined"> schedule </span>
							<div>
								<span
									>{new Date($selectedAppointmentDate.start ?? '').getHours()}:{new Date(
										$selectedAppointmentDate.start ?? ''
									).getMinutes() > 9
										? new Date($selectedAppointmentDate.start ?? '').getMinutes()
										: new Date($selectedAppointmentDate.start ?? '').getMinutes() + '0'}</span
								>
								-
								<span
									>{new Date($selectedAppointmentDate.end ?? '').getHours()}:{new Date(
										$selectedAppointmentDate.end ?? ''
									).getMinutes() > 9
										? new Date($selectedAppointmentDate.end ?? '').getMinutes()
										: new Date($selectedAppointmentDate.end ?? '').getMinutes() + '0'}</span
								>
							</div>
						</div>
						<div class="d-flex align-items-center gap-2 mb-3">
							<span class="material-symbols-outlined"> calendar_month </span>
							<span
								><span
									>{new Date($selectedAppointmentDate.end ?? '').getDate()}
									{monthNames[new Date($selectedAppointmentDate.end ?? '').getMonth()]}</span
								></span
							>
						</div>
					</div>

					<div class="d-flex flex-column mt-3" style="font-size: small; width: fit-content">
						<span style="color: #bc0000;">* {$_('legal.1')}</span>
						<span style="color: #bc0000;padding-left: 10px;">{$_('legal.2')}</span>
						<span>* {$_('legal.3')} </span>
						<span>* {$_('legal.4')}</span><span style="padding-left: 10px;">{$_('legal.5')}</span>
					</div>

					<div class="d-flex gap-3 mt-3">
						<button
							{disabled}
							class="btn btn-secondary w-100 d-flex"
							on:click={() =>
								selectedAppointmentDate.set({ day: null, time: null, start: null, end: null })}
							><span class="material-symbols-outlined"> replay </span>
							<span class="mx-auto">{$_('actions.change')}</span></button
						>
						<button {disabled} class="btn btn-primary w-100 d-flex" on:click={postAppointment}
							><span class="material-symbols-outlined"> check </span>
							<span class="mx-auto">{$_('actions.confirm')}</span>
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
</style>
