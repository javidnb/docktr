<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GetAppointment from '$lib/components/GetAppointment.svelte';
	import { doctors, selectedAppointmentDate } from '$lib/store/dataStore';

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);
</script>

{#if doctor}
	<button
		on:click={() => {
			if ($selectedAppointmentDate.day) {
				selectedAppointmentDate.set({ day: null, time: null, start: null, end: null });
			} else {
				history.back();
			}
		}}
		class="btnBack mobileOnly btn"
		type="button"
		style="position: absolute;
		top: 10px;
		left: 5px;
		color: rgb(41 71 41);
		border: none;
		text-align: center;
		width: 56px;
		padding-left: 20px;
		height: 40px;"
	>
		<span class="material-symbols-outlined"> arrow_back_ios </span>
	</button>
	<section>
		<div
			class="jumbotron jumboHeader mobile-left-padding"
			style="padding-block: 1rem; background-color: #e2e9ef"
		>
			<h1 class="display-4">{doctor?.name || ''}</h1>
		</div>
	</section>
	<div class="mt-3">
		<GetAppointment doc={doctor} />
	</div>
{:else}
	<div class="d-flex flex-column align-items-center mt-5">
		<span>Həkim tapılmadı</span>
		<button
			class="btn btn-primary mt-3"
			on:click={() => {
				goto('/doctors');
			}}
		>
			Həkimlər
		</button>
	</div>
{/if}
