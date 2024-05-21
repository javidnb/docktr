<script lang="ts">
	import { appointments, confirmationModal, doctors, loginModal } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { session } from '$lib/session';
	import ConfirmationModal from '$lib/helpers/ConfirmationModal.svelte';

	let confirmationData: any = {};
	let showDatePicker: boolean = false;

	onMount(async () => {
		console.log('appointment: ', $appointments);
		console.log('session: ', $session);
	});

	function openAppConfirmModal(appointment: any, showDP?: boolean) {
		let data = `${new Date(appointment.endTime).getDate()}
		${monthNames[new Date(appointment.endTime).getMonth()]}
		 , 
			${new Date(appointment.startTime).getHours()}:${
				new Date(appointment.startTime).getMinutes() > 9
					? new Date(appointment.startTime).getMinutes()
					: new Date(appointment.startTime).getMinutes() + '0'
			}
		- ${new Date(appointment.endTime).getHours()}:${
			new Date(appointment.endTime).getMinutes() > 9
				? new Date(appointment.endTime).getMinutes()
				: new Date(appointment.endTime).getMinutes() + '0'
		}`;
		data += '<br/> tarixli randevunu təsdiq edirsiniz?';
		showDatePicker = showDP == true ? true : false;
		confirmationData = { text: data };
		confirmationModal.set(true);
	}

	function appointmentConfirmed(){
		confirmationModal.set(false);
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Randevu</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<div class="container">
	<div class="row">
		{#if $appointments.length}
			{#each $appointments as appointment}
				<div class="col col-md-6 col-lg-4">
					{#if $session?.user?.doctor}
						<!-- APPOINTMENTS OF A DOCTOR -->
						<div class="card mt-3 p-3">
							<div class="card-body" style="padding: .5rem;">
								<div class="d-flex gap-3 align-items-center">
									{#if appointment.photoURL}
										<img
											src={appointment.photoURL}
											style="max-height: 80px; 
												aspect-ratio: 1.5/1;
												max-width: 120px; 
												border-radius: 6px; 
												object-fit: cover"
											alt="dok pic"
										/>
									{:else}
										<div
											style="width: 60px; 
											height: 60px;
											color: var(--primaryColor);
											border-radius: 100%;
											border: 3px solid var(--primaryColor);
											display: flex; align-items: center; justify-content: center;"
										>
											<span class="material-symbols-outlined icon-fill" style="font-size: 3rem">
												person
											</span>
										</div>
									{/if}
									<div class="d-flex flex-column">
										<span>{appointment.displayName}</span>
										<span>{appointment.email}</span>
									</div>
								</div>
								<div class="mt-3">
									<span
										>{new Date(appointment.startTime).getHours()}:{new Date(
											appointment.startTime
										).getMinutes() > 9
											? new Date(appointment.startTime).getMinutes()
											: new Date(appointment.startTime).getMinutes() + '0'}</span
									>
									-
									<span
										>{new Date(appointment.endTime).getHours()}:{new Date(
											appointment.endTime
										).getMinutes() > 9
											? new Date(appointment.endTime).getMinutes()
											: new Date(appointment.endTime).getMinutes() + '0'}</span
									>
								</div>
								<span class="mb-3"
									><span
										>{new Date(appointment.endTime).getDate()}
										{monthNames[new Date(appointment.endTime).getMonth()]}</span
									></span
								>
								<span class="d-flex mt-3 gap-1"
									><span class="material-symbols-outlined"> pending </span>
									<span>Həkimin təsdiqi gözlənilir</span>
								</span>
							</div>
							{#if appointment.status == 1}
								<button
									class="btn btn-outline-primary mt-3 d-flex align-items-center"
									on:click={() => openAppConfirmModal(appointment, true)}
								>
									<span class="material-symbols-outlined"> schedule </span>
									<span class="mx-auto">Vaxtı dəyiş</span>
								</button>
								<button
									class="btn btn-outline-primary mt-3 d-flex align-items-center"
									on:click={() => openAppConfirmModal(appointment)}
								>
									<span class="material-symbols-outlined"> check </span>
									<span class="mx-auto">Təsdiq et</span>
								</button>
							{/if}
						</div>
					{:else}
						<!-- APPOINTMENTS OF A USER -->
						<div class="card mt-3 p-3">
							<img
								src={$doctors.find((d) => d.id == appointment.doctorId)?.img}
								style="max-height: 80px; max-width: 120px; border-radius: 6px; object-fit: cover"
								alt="dok pic"
							/>
							<span>{$doctors.find((d) => d.id == appointment.doctorId)?.name}</span>
							<div>
								<span
									>{new Date(appointment.startTime).getHours()}:{new Date(
										appointment.startTime
									).getMinutes() > 9
										? new Date(appointment.startTime).getMinutes()
										: new Date(appointment.startTime).getMinutes() + '0'}</span
								>
								-
								<span
									>{new Date(appointment.endTime).getHours()}:{new Date(
										appointment.endTime
									).getMinutes() > 9
										? new Date(appointment.endTime).getMinutes()
										: new Date(appointment.endTime).getMinutes() + '0'}</span
								>
							</div>
							<span
								><span
									>{new Date(appointment.endTime).getDate()}
									{monthNames[new Date(appointment.endTime).getMonth()]}</span
								></span
							>
							<span
								>{appointment.status == 1
									? 'Həkimin Təsdiqi gözlənilir'
									: 'appointment status'}</span
							>
						</div>
					{/if}
				</div>
			{/each}
		{:else if $session.loggedIn}
			<div class="card mt-3 p-3">Planlaşdırılmış görüş yoxdur ..</div>
		{:else}
			<div
				class="card mt-3 p-3"
				style="display: flex;
						flex-direction: row;
						align-items: baseline;
						gap: .5rem;"
			>
				Randevuları görmək üçün hesaba
				<button
					on:click={() => loginModal.set(true)}
					class="btn btn-outline-primary"
					style="height: 40px"
				>
					giriş et
				</button>
			</div>
		{/if}
	</div>
</div>

<ConfirmationModal bind:confirmationData {showDatePicker} on:confirmed={appointmentConfirmed} />

<style>
	.card {
		cursor: auto;
	}
</style>
