<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		loginModal,
		selectedAppointmentDate,
		appointmentModal,
		postData,
		appointments,
		dataLoading,
		sha1,
		termsAccepted,
		showTermsModal
	} from '$lib/store/dataStore';
	import { session } from '$lib/session';
	import DatePicker from '$lib/helpers/DatePicker.svelte';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import { toast } from '@zerodevx/svelte-toast';
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import Modal from '$lib/helpers/Modal.svelte';
	import Legal from '../../routes/appointment/Legal.svelte';

	export let doc: any;

	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
	let init = true;
	let disabled: boolean = false;
	let payment: boolean = false;
	let apiUrl: string = 'https://sandbox-api-gateway.tokenpay.com.tr';
	let showTermsError: boolean = false;

	onMount(async () => {
		init = true;
		selectedAppointmentDate.set({ day: null, time: null, start: null, end: null });
		appointmentModal.set(false);
	});

	onDestroy(() => {
		termsAccepted.set(false);
	});

	// after user logs in launches appointment modal again, if it was launched earlier
	$: if ($session.user && $selectedAppointmentDate.day && !init) {
		appointmentModal.set(true);
	}

	async function pay() {
		if (!$termsAccepted) {
			showTermsError = true;
			return;
		}
		dataLoading.set(true);
		let responseMessage;

		let body = {
			price: parseFloat((doc.price + 15.0).toFixed(2)),
			paidPrice: parseFloat((doc.price + 15.0).toFixed(2)),
			currency: 'AZN',
			paymentGroup: 'LISTING_OR_SUBSCRIPTION',
			callbackUrl: 'https://sehiyye.online'
		};

		try {
			const response = await fetch(apiUrl + '/payment/v1/checkout-payments/init', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					body
				})
			});

			if (response.ok) {
				const data = await response.json();
				responseMessage = 'Success: ' + data.message;
			} else {
				responseMessage = 'Failed to post data';
			}
		} catch (error: any) {
			responseMessage = error;
			console.log(error);
		}
		// console.log(responseMessage);
		dataLoading.set(false);
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

<section class="container">
	<div class="pt-3 appointmentContainer d-flex flex-column">
		{#if !payment}
			<div
				class="card p-3 mb-3 d-flex flex-column"
				style="color: var(--primaryText); flex:0; min-width: 400px"
			>
				<div class="d-flex align-items-center">
					<span style="font-size: small;">Randevu müddəti:</span>
					{#if doc.appointmentDuration}
						<span style="font-weight: 500; margin-left: auto">{doc.appointmentDuration}</span>
						<span style="font-size: small; padding-top: 3px">dq.</span>
					{/if}
				</div>
				<div class="d-flex align-items-center">
					<span style="font-size: small;">Qiymət:</span>
					{#if doc.price}
						<span style="font-weight: 500; margin-left: auto"
							>{(doc.price + 15.0).toFixed(2) ?? ''}</span
						>
						<span style="font-size: small; padding-top: 3px">₼</span>
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
						</div>

						<div class="d-flex flex-column ps-2 py-2">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								class="form-check d-flex align-items-center"
								class:errorBorder={showTermsError}
								on:click={() => {
									showTermsError = false;
								}}
								style="transition-duration: .2s;"
							>
								<input
									class="form-check-input"
									type="radio"
									id="usage"
									style="margin-bottom: 4px;"
									bind:value={$termsAccepted}
									checked={$termsAccepted}
								/>
								<label class="form-check-label" for="usage">
									<button
										class="p-0 ms-2"
										on:click|preventDefault={() => {
											showTermsModal.set(true);
										}}
										style="color: var(--primaryText); border:0; background: unset"
										>İstifadə şərtlərini</button
									> <span class="mt-1">oxudum və qəbul edirəm.</span>
								</label>
							</div>
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
							<button class="btn btn-primary w-100 d-flex" on:click={pay}
								><span class="material-symbols-outlined"> check </span>
								<span class="mx-auto">{$_('actions.pay')}</span>
							</button>
						</div>
					</div>
				</div>
			{/if}
			<!-- PAYMENT -->
		{:else}
			<div class="card"></div>
		{/if}
	</div>
</section>

<Modal bind:showModal={$showTermsModal}>
	<Legal />
</Modal>

<style>
	@media screen and (max-width: 992px) {
		.appointmentContainer {
			height: calc(100dvh - 150px);
		}
	}
	.form-check-input:checked {
		background-color: var(--primaryColor);
		border-color: var(--primaryColor);
	}
	.errorBorder {
		border: 1px solid red;
		border-radius: 6px;
		justify-content: center;
		padding-block: 5px;
	}
</style>
