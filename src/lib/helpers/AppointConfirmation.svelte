<script lang="ts">
	import Modal from '$lib/helpers/Modal.svelte';
	import { confirmationModal, dataLoading } from '$lib/store/dataStore';
	import DatePicker from './DatePicker.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { selectedAppointmentDate } from '$lib/store/dataStore';

	const dispatch = createEventDispatcher();
	export let cancelModal = false;

	export let confirmationData: any;
	export let showDatePicker: boolean = false;
	$: showModal = !!$confirmationModal;
	$: if (showModal == false) {
		confirmationModal.set(false);
	}

	onMount(() => {
		console.log(confirmationData);
	});

	$: if ($selectedAppointmentDate.start && $selectedAppointmentDate.end) {
		let data = `${new Date($selectedAppointmentDate.end).getDate()}
		${monthNames[new Date($selectedAppointmentDate.end).getMonth()]}
		 , 
			${new Date($selectedAppointmentDate.start).getHours()}:${
				new Date($selectedAppointmentDate.start).getMinutes() > 9
					? new Date($selectedAppointmentDate.start).getMinutes()
					: new Date($selectedAppointmentDate.start).getMinutes() + '0'
			}
		- ${new Date($selectedAppointmentDate.end).getHours()}:${
			new Date($selectedAppointmentDate.end).getMinutes() > 9
				? new Date($selectedAppointmentDate.end).getMinutes()
				: new Date($selectedAppointmentDate.end).getMinutes() + '0'
		}`;
		data += '<br/> tarixli randevunu təsdiq edirsiniz?';

		confirmationData = {
			text: data,
			data: {
				startTime: $selectedAppointmentDate.start,
				endTime: $selectedAppointmentDate.end,
				appointmentId: confirmationData?.data?.appointmentId ?? null,
				changed: true
			}
		};
	}
</script>

<div>
	<Modal bind:showModal>
		{#if !showDatePicker}
			<h4 class="px-3 pt-2">{confirmationData?.cancelModal ? 'Görüşü ləğv et?' : 'Təsdiq et'}</h4>

			<div class="container">
				<div class="col">
					<div class="row text-center pb-2">
						{#if cancelModal}
							<h1>Cancel</h1>
						{/if}
						<span>{@html confirmationData.text ?? ''}</span>
						<div class="d-flex gap-3 mt-3">
							{#if confirmationData.button1}
								<button
									class="btn btn-secondary w-100 d-flex"
									on:click={() => {
										confirmationModal.set(false);
									}}
									><span class="material-symbols-outlined">
										{confirmationData.button1_icon ?? 'replay'}
									</span>
									<span class="mx-auto">{confirmationData.button1 ?? 'Dəyişdir'}</span></button
								>
							{:else}
								<!-- <button
									class="btn btn-secondary w-100 d-flex"
									on:click={() => {
										if (confirmationData.button1_fn) {
											confirmationData.button1_fn;
											return;
										}
										showDatePicker = true;
									}}
									><span class="material-symbols-outlined">
										{confirmationData.button1_icon ?? 'replay'}
									</span>
									<span class="mx-auto">{confirmationData.button1 ?? 'Dəyişdir'}</span></button
								> -->
								<button
									class="btn btn-secondary w-100 d-flex"
									on:click={() =>
										dispatch('cancelled', {
											text: confirmationData.text,
											data: confirmationData.data ?? null
										})}
									><span class="material-symbols-outlined">
										{confirmationData.button1_icon ?? 'cancel'}
									</span>
									<span class="mx-auto">{confirmationData.button1 ?? 'Bağla'}</span></button
								>
							{/if}
							<button
								class="btn btn-primary w-100 d-flex"
								on:click={() =>
									dispatch('confirmed', {
										text: confirmationData.text,
										data: confirmationData.data ?? null,
										confData: confirmationData
									})}
								disabled={$dataLoading}
								><span class="material-symbols-outlined"> check </span>
								<span class="mx-auto"
									>{confirmationData.button2 ?? confirmationData.cancelModal
										? 'Görüşü ləğv et'
										: 'Təsdiqlə'}</span
								>
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<h4 class="px-3 pt-2">Randevu tarixini seçin</h4>
			<DatePicker bind:showDatePicker appointmentDate={confirmationData?.data ?? null} />
		{/if}
	</Modal>
</div>
