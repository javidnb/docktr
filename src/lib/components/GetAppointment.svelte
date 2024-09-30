<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		loginModal,
		selectedAppointmentDate,
		appointmentModal,
		appointments,
		dataLoading,
		termsAccepted,
		showTermsModal,
		comission
	} from '$lib/store/dataStore';
	import { session } from '$lib/session';
	import DatePicker from '$lib/helpers/DatePicker.svelte';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import { toast } from '@zerodevx/svelte-toast';
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { _ } from 'svelte-i18n';
	import Modal from '$lib/helpers/Modal.svelte';
	import Legal from '../../routes/appointments/Legal.svelte';

	export let doc: any;

	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
	let init = true;
	let disabled: boolean = false;
	let payment: boolean = false;
	let showTermsError: boolean = false;
	let docAppointments: any = [];

	onMount(async () => {
		init = true;
		selectedAppointmentDate.set({ day: null, time: null, start: null, end: null });
		appointmentModal.set(false);

		let time = new Date().getTime();
		let response = await fetch(
			`https://tekoplast.az/docktr/api/?appointments&id=${doc.id}&type=doctor&t=${time}&upcoming=true`
		);
		docAppointments = await response.json();
	});

	onDestroy(() => {
		termsAccepted.set(false);
	});

	// after user logs in launches appointment modal again, if it was launched earlier
	$: if ($session.user && $selectedAppointmentDate.day && !init) {
		appointmentModal.set(true);
	}

	async function pay() {
		init = false;
		if (!$termsAccepted) {
			showTermsError = true;
			return;
		}
		if (!$session.user) {
			appointmentModal.set(false);
			loginModal.set(true);
			return;
		}
		dataLoading.set(true);

		let order_id = await postAppointment();

		let body = {
			public_key: import.meta.env.VITE_EPOINT_KEY,
			amount: 0.01,
			currency: 'AZN',
			language: 'az',
			description: `${$_('titles.' + doc.title)} ${doc.name || ''}`,
			order_id: order_id.id,
			other_attr: [doc.uid]
		};
		// amount: parseFloat((doc.price + $comission).toFixed(2)),

		const response = await fetch('https://sehiyye.net/api/sendPaymentRequest', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const result = await response.json();
		if (result.status == 'success') {
			window.location.href = result.redirect_url;
		} else {
			toast.push('Xəta! Zəhmət olmasa yenidən cəhd edin.', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(176 24 24)',
					'--toastBarBackground': '#5b1010'
				}
			});
		}
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
				userId: $session.user?.uid,
				doctorId: doc.id,
				startTime: jsDateToSQL($selectedAppointmentDate.start),
				endTime: jsDateToSQL($selectedAppointmentDate.end),
				status: 1,
				amount: parseFloat((doc.price + $comission).toFixed(2)),
				comission: $comission
			};
			let dataToPost = { table: 'appointments', data: { ...data } };
			const response = await fetch('https://sehiyye.net/api/postData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...dataToPost })
			});

			if (response.ok) {
				appointments.set([...$appointments, data]);
				return response.json();
			} else {
				dataLoading.set(false);
				toast.push('Xəta! Zəhmət olmasa yenidən cəhd edin.', {
					duration: 2000,
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgb(176 24 24)',
						'--toastBarBackground': '#5b1010'
					}
				});
				return 'error';
			}
		}
	}
</script>

<section class="container">
	<div class="pt-3 appointmentContainer d-flex flex-column">
		{#if !payment}
			<div
				class="card p-3 mx-1 mb-3 d-flex flex-column"
				style="color: var(--primaryText); flex:0; min-width: min(400px,90vw)"
			>
				<div class="d-flex align-items-center">
					<span style="font-size: small;">Görüş müddəti:</span>
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
					<DatePicker {doc} {docAppointments} />
				</div>
			{:else}
				<div class="row d-flex h-100">
					<div class="d-flex flex-column ps-3">
						<div
							class="d-flex flex-column my-auto px-2"
							style="color: rgb(165 3 3); text-align: justify; font-weight: 500; font-size: 15px"
						>
							<span>{$_('legal.1')}</span>
							<span
								style="max-width: 527px;
    							margin-block: 5px;"
							>
								{$_('legal.2')}
							</span>
						</div>

						<div class="d-flex flex-column px-2 py-2">
							<button
								class="btn btn-outline-primary"
								style="font-weight: 600; text-decoration: underline"
								on:click|preventDefault={() => {
									showTermsModal.set(true);
								}}
							>
								İstifadə şərtlərini oxu
							</button>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								class="form-check d-flex align-items-center mt-2 gap-2"
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
									on:click={() => {
										termsAccepted.set(!$termsAccepted);
									}}
								/>
								<label class="form-check-label w-100" for="usage">
									<span>Oxudum və qəbul edirəm.</span>
								</label>
							</div>
						</div>

						<div class="d-flex gap-3 mt-3 mx-2">
							<button
								{disabled}
								class="btn btn-secondary w-100 d-flex"
								on:click={() =>
									selectedAppointmentDate.set({ day: null, time: null, start: null, end: null })}
								><span class="material-symbols-outlined"> replay </span>
								<span class="mx-auto">{$_('actions.change')}</span></button
							>
							<button
								class="btn btn-primary w-100 d-flex"
								on:click={pay}
								disabled={$dataLoading}
								style="position: relative;"
								><span class="material-symbols-outlined"> check </span>
								{#if $dataLoading}
									<div class="loader" style="left:40%;"></div>{:else}
									<span class="mx-auto">{$_('actions.pay')}</span>
								{/if}
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
			height: calc(100dvh - 130px);
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
		transition-duration: 0.2s;
		padding-inline: 2rem;
		gap: 5px;
		justify-content: center;
	}
	.btn-outline-primary:not(:hover) {
		background-color: white;
	}
	.btn:disabled {
		background-color: var(--primaryColor) !important;
	}
</style>
