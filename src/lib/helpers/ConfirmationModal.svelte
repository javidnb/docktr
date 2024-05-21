<script lang="ts">
	import Modal from '$lib/helpers/Modal.svelte';
	import { confirmationModal } from '$lib/store/dataStore';
	import DatePicker from './DatePicker.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let confirmationData: any;
	export let showDatePicker: boolean = false;
	$: showModal = !!$confirmationModal;
	$: if (showModal == false) {
		confirmationModal.set(false);
	}
	// $: if (confirmationData.showDatePicker !== undefined) {
	// 	showDatePicker = confirmationData.showDatePicker == true ? true : false;
	// }
</script>

<Modal bind:showModal>
	{#if !showDatePicker}
		<h4 class="px-3 pt-2">Təsdiq et</h4>

		<div class="container">
			<div class="col">
				<div class="row text-center pb-2">
					<span>{@html confirmationData.text ?? ''}</span>
					<div class="d-flex gap-3 mt-3">
						<button class="btn btn-secondary w-100 d-flex" on:click={() => (showDatePicker = true)}
							><span class="material-symbols-outlined"> replay </span>
							<span class="mx-auto">{confirmationData.button1 ?? 'Dəyişdir'}</span></button
						>
						<button class="btn btn-primary w-100 d-flex" on:click={() => dispatch('confirmed')}
							><span class="material-symbols-outlined"> check </span>
							<span class="mx-auto">{confirmationData.button2 ?? 'Təsdiqlə'}</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<h4 class="px-3 pt-2">Randevu tarixini seçin</h4>
		<DatePicker bind:showDatePicker />
	{/if}
</Modal>
