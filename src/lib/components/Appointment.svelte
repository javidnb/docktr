<script lang="ts">
	import { onMount } from 'svelte';
	import { dataLoading } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { modul, selectedAppointmentDate } from '$lib/store/dataStore';
	import DatePicker from '$lib/helpers/DatePicker.svelte';

	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');
	const tomorrow = `${year}-${month}-${day}`;
	let btnText: string = 'Randevu al';
	let btnDisabled: boolean = false;

	onMount(async () => {});

	function handleSubmit(e: SubmitEvent) {
		dataLoading.set(true);
		btnDisabled = true;
		btnText = 'Gözləyin ..';
		const formData = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(data);
		setTimeout(() => {
			dataLoading.set(false);
			modul.set(!$modul);
			toast.push('Uğurlu!', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(91 144 77)',
					'--toastBarBackground': '#1d5b3c'
				}
			});
			btnText = 'Randevu al';
			btnDisabled = false;
		}, 3000);
		// let profession = diseases.find((d) => d.name == data.profession);
		// console.log(profession?.id);
	}
</script>

<section>
	<div class="container-fluid">
		<!-- <div class="row">
			<div class="col">
				<form
					class="d-flex flex-column row-gap-3 p-3"
					on:submit|preventDefault={handleSubmit}
					style="min-width: min(420px, 100vw);"
				>
					<label for="date">Tarix</label>
					<input
						name="date"
						class="form-control cursor-pointer"
						type="date"
						id="date"
						value={tomorrow}
						min={tomorrow}
						required
					/>
					<div class="d-flex gap-3">
						<div class="d-flex flex-column flex-1">
							<label for="startTime">Başlanğıc saatı</label>
							<input
								name="startTime"
								class="form-control w-100 cursor-pointer"
								type="time"
								id="startTime"
								min="09:00"
								max="21:00"
								required
								data-errormessage-value-missing="Please input something"
							/>
						</div>
						<div class=" d-flex flex-column flex-1">
							<label for="endTime">Bitiş saatı</label>
							<input
								name="endTime"
								class="form-control w-100 cursor-pointer"
								type="time"
								id="endTime"
								min="09:00"
								max="21:00"
								required
							/>
						</div>
					</div>

					<button type="submit" class="btn btn-primary" disabled={btnDisabled}>{btnText}</button>
				</form>
			</div>
		</div> -->

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
						class="btn btn-secondary w-100"
						on:click={() => selectedAppointmentDate.set({ day: null, time: null })}>Dəyişdir</button
					>
					<button
						class="btn btn-primary w-100"
						on:click={() => selectedAppointmentDate.set({ day: null, time: null })}>Təsdiqlə</button
					>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
</style>
