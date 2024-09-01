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
	let payment: boolean = false;

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
	<div
		class="container-fluid"
		style="height: calc(100dvh - 150px);
			display: flex;
			flex-direction: column;"
	>
		{#if !payment}
			<div class="card p-3 mb-3 d-flex flex-column" style="color: var(--primaryText); flex:0">
				<div class="d-flex align-items-center">
					<span style="font-size: small;">Randevu müddəti:</span>
					{#if doc.appointmentDuration}
						<span style="font-weight: 500; margin-left: auto">{doc.appointmentDuration}</span>
						<span style="font-size: small;">dq.</span>
					{/if}
				</div>
				<div class="d-flex align-items-center">
					<span style="font-size: small;">Qiymət:</span>
					{#if doc.price}
						<span style="font-weight: 500; margin-left: auto"
							>{(doc.price + 15.0).toFixed(2) ?? ''}</span
						>
						<span style="font-size: small;">₼</span>
					{/if}
				</div>
				{#if $selectedAppointmentDate.day}
					<hr />
					<div class="d-flex align-items-center">
						<span style="font-size: small;">Görüş tarixi:</span>
						<span style="font-weight: 500; margin-left: auto"
							>{new Date($selectedAppointmentDate.end ?? '').getDate()}
							{monthNames[new Date($selectedAppointmentDate.end ?? '').getMonth()]}</span
						>
					</div>
					<div class="d-flex align-items-center">
						<span style="font-size: small;">Görüş saatı:</span>
						<span style="font-weight: 500; margin-left: auto"
							>{new Date($selectedAppointmentDate.start ?? '').getHours()}:{new Date(
								$selectedAppointmentDate.start ?? ''
							).getMinutes() > 9
								? new Date($selectedAppointmentDate.start ?? '').getMinutes()
								: new Date($selectedAppointmentDate.start ?? '').getMinutes() + '0'}</span
						>
					</div>
				{/if}
			</div>
			{#if !$selectedAppointmentDate.day}
				<div class="row">
					<DatePicker />
				</div>
			{:else}
				<div class="row d-flex mt-auto">
					<div class="d-flex flex-column ps-3" style="width: fit-content;">
						<div class="d-flex flex-column mt-auto" style="font-size: small; width: fit-content">
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
							<button
								{disabled}
								class="btn btn-primary w-100 d-flex"
								on:click={() => {
									payment = true;
								}}
								><span class="material-symbols-outlined"> check </span>
								<span class="mx-auto">{$_('actions.pay')}</span>
							</button>
						</div>
					</div>
				</div>
			{/if}
			<!-- PAYMENT -->
		{:else}
			<h1>Pay biacth</h1>
		{/if}
	</div>
</section>

<style>
</style>
