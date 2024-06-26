<script lang="ts">
	import {
		appointments,
		confirmationModal,
		dataLoading,
		doctors,
		loginModal,
		putData,
		showBtnEndCall
	} from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { session } from '$lib/session';
	import ConfirmationModal from '$lib/helpers/ConfirmationModal.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import VideoCall from '$lib/components/VideoCall.svelte';
	import { _ } from 'svelte-i18n';

	let confirmationData: any = {};
	let showDatePicker: boolean = false;
	let upcomingAppointments;
	let joinCall: boolean = false;
	let appointmentId: any = null;

	$: upcomingAppointments = $appointments.filter((ap) => new Date(ap.startTime) > new Date());

	onMount(() => {
		const updateRemainingTime = () => {
			appointments.set(
				$appointments.map((appointment) => {
					return {
						...appointment,
						remainingTime: checkTime(appointment)
					};
				})
			);
		};

		updateRemainingTime();
		const interval = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(interval);
	});

	function openAppConfirmModal(appointment: any, showDP?: boolean) {
		console.log(appointment);
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
		confirmationData = {
			text: data,
			data: {
				startTime: appointment.startTime,
				endTime: appointment.endTime,
				appointmentId: appointment.id
			}
		};
		confirmationModal.set(true);
	}

	async function appointmentConfirmed(event: CustomEvent) {
		dataLoading.set(true);
		let data = event.detail.data.changed
			? {
					status: 2,
					startTime: jsDateToSQL(event.detail.data.startTime),
					endTime: jsDateToSQL(event.detail.data.endTime),
					changed: true
				}
			: { status: 2 };

		let result = await putData('appointments', 'id', event.detail.data.appointmentId, data);
		if (result) {
			// UPDATE THE APPOINTMENTS SIGNAL
			let app = $appointments.find((app) => app.id == event.detail.data.appointmentId);
			let customisedApp = { ...app, ...data };
			appointments.update((itemsArray) => {
				return itemsArray.map((item) =>
					item.id === event.detail.data.appointmentId ? customisedApp : item
				);
			});

			// SHOW TOASTR
			toast.push('Uğurlu!', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(91 144 77)',
					'--toastBarBackground': '#1d5b3c'
				}
			});

			sendNotification(customisedApp);
			dataLoading.set(false);
			confirmationModal.set(false);
		} else {
			dataLoading.set(false);
		}
	}

	async function sendNotification(appointment: any) {
		let time = new Date().getTime();
		console.log('appointment: ', appointment);
		let uid = appointment.userId;
		const fcmToken = await fetch(`https://tekoplast.az/docktr/api/?getTokens&uid=${uid}&t=${time}`);
		const fcmTokens = await fcmToken.json();

		console.log('fcmTokens: ', fcmTokens[0].fcmToken);

		let requestData = {
			tokens: JSON.stringify(fcmTokens[0].fcmToken),
			title: null,
			body: appointment.changed
				? 'Randevu yeni saata keçirilib.'
				: 'Randevu saatınız həkim tərəfindən təsdiq edilib',
			url: 'https://sehiyye.online/appointment'
		};

		const response = await fetch(`https://tekoplast.az/docktr/api/?pushNotification`, {
			method: 'POST',
			cache: 'no-store',
			body: JSON.stringify({ ...requestData })
		});
	}

	function joinVideoCall(appointment: any) {
		dataLoading.set(true);
		appointmentId = appointment.id;
		joinCall = true;
	}

	function checkTime(appointment: any) {
		const now: any = new Date();
		const startTime: any = new Date(appointment.startTime);
		const timeDifference = startTime - now;

		const seconds = Math.floor((timeDifference / 1000) % 60);
		const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
		const hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
		const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

		return {
			total: timeDifference,
			days,
			hours,
			minutes,
			seconds
		};
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.appointments')}</h1>
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
	{#if !joinCall}
		<div class="row">
			{#if upcomingAppointments.length}
				{#each upcomingAppointments as appointment}
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
									<div class="d-flex align-items-center gap-2 mt-3 mb-1">
										<span class="material-symbols-outlined"> schedule </span>
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
									</div>
									<div class="d-flex align-items-center gap-2 mb-3">
										<span class="material-symbols-outlined"> calendar_month </span>
										<span
											><span
												>{new Date(appointment.endTime).getDate()}
												{monthNames[new Date(appointment.endTime).getMonth()]}</span
											></span
										>
									</div>
									{#if appointment.status == 1}
										<span class="d-flex mt-3 gap-1" style="color: #93930a"
											><span class="material-symbols-outlined"> pending </span>
											<span>Həkimin təsdiqi gözlənilir</span>
										</span>
									{:else if appointment.status == 2}
										<span class="d-flex mt-3 gap-1" style="color: green"
											><span class="material-symbols-outlined">
												{appointment.changed ? 'change_circle' : 'check'}
											</span>
											<span
												>{appointment.changed
													? 'Randevu yeni saata keçirilib.'
													: 'Randevu saatı təsdiq edilib.'}</span
											>
										</span>
									{/if}
								</div>
								{#if appointment.status == 1}
									<button
										class="btn btn-outline-primary mt-3 d-flex align-items-center"
										on:click={() => openAppConfirmModal(appointment, true)}
									>
										<span class="material-symbols-outlined"> schedule_send </span>
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

								{#if appointment?.remainingTime?.total > 0}
									<!-- <button class="btn btn-outline-primary mt-3 d-flex align-items-center">
										<span class="material-symbols-outlined"> schedule </span>
										<span class="mx-auto"
											>{appointment.remainingTime.days +
												' gün ' +
												appointment.remainingTime.hours +
												' saat ' +
												appointment.remainingTime.minutes +
												' deq ' +
												appointment.remainingTime.seconds +
												' san qalıb'}</span
										>
									</button> -->

									<!-- ALTDAKINI SIL, USTDEKINI KOMMENTDEN CIXART -->
									<button
										on:click={() => joinVideoCall(appointment)}
										class="btn btn-outline-primary mt-3 d-flex align-items-center"
										style="background: var(--primaryColor);
										color: white;"
									>
										<span class="material-symbols-outlined"> schedule </span>
										<span class="mx-auto">{!joinCall ? 'Video görüşə qoşul' : 'Gözləyin'}</span>
									</button>
								{:else}
									<button
										on:click={() => joinVideoCall(appointment)}
										class="btn btn-outline-primary mt-3 d-flex align-items-center"
										style="background: var(--primaryColor);
										color: white;"
									>
										<span class="material-symbols-outlined"> schedule </span>
										<span class="mx-auto">{!joinCall ? 'Video görüşə qoşul' : 'Gözləyin'}</span>
									</button>
								{/if}
							</div>
						{:else}
							<!-- APPOINTMENTS OF A USER -->
							<div class="card mt-3 p-3">
								<div class="d-flex gap-3 align-items-center">
									<img
										src={$doctors.find((d) => d.id == appointment.doctorId)?.img}
										style="max-height: 80px; 
											aspect-ratio: 1.5/1;
											max-width: 120px; 
											border-radius: 6px; 
											object-fit: cover"
										alt="dok pic"
									/>
									<div class="d-flex flex-column w-100">
										<span style="font-size: 1.2rem; text-align: center"
											>{$doctors.find((d) => d.id == appointment.doctorId)?.name}</span
										>
									</div>
								</div>
								<div class="d-flex align-items-center gap-2 mt-3 mb-1">
									<span class="material-symbols-outlined"> schedule </span>
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
								</div>
								<div class="d-flex align-items-center gap-2 mb-3">
									<span class="material-symbols-outlined"> calendar_month </span>
									<span
										><span
											>{new Date(appointment.endTime).getDate()}
											{monthNames[new Date(appointment.endTime).getMonth()]}</span
										></span
									>
								</div>
								{#if appointment.status == 1}
									<span class="d-flex mt-3 gap-1" style="color: #93930a"
										><span class="material-symbols-outlined"> pending </span>
										<span>Həkimin təsdiqi gözlənilir</span>
									</span>
								{:else if appointment.status == 2}
									<span class="d-flex mt-3 gap-1" style="color: green"
										><span class="material-symbols-outlined">
											{appointment.changed ? 'change_circle' : 'check'}
										</span>

										<span
											>{appointment.changed
												? 'Randevu yeni saata keçirilib.'
												: 'Randevu saatı təsdiq edilib.'}</span
										>
									</span>
								{/if}
								<!-- PAYMENT -->
								<div
									class="d-flex align-items-center gap-1 mt-2"
									style="color: {appointment.purchased ? 'green' : '#c00909'}"
								>
									<span class="material-symbols-outlined">
										{appointment.purchased ? 'check' : 'error'}
									</span>
									<span>{appointment.purchased ? 'Ödəniş edilib' : 'Ödəniş edilməmişdir'}</span>
								</div>

								{#if !appointment.purchased}
									<button class="btn btn-outline-primary mt-3 d-flex align-items-center">
										<span class="material-symbols-outlined"> shopping_cart </span>
										<span class="mx-auto">Ödəniş et</span>
									</button>
									<!-- {:else if appointment?.remainingTime?.total > 0}
									<button class="btn btn-outline-primary mt-3 d-flex align-items-center">
										<span class="material-symbols-outlined"> schedule </span>
										<span class="mx-auto"
											>{appointment.remainingTime.days +
												' gün ' +
												appointment.remainingTime.hours +
												' saat ' +
												appointment.remainingTime.minutes +
												' deq ' +
												appointment.remainingTime.seconds +
												' san qalıb'}</span
										>
									</button> -->
								{:else}
									<button
										on:click={() => joinVideoCall(appointment)}
										class="btn btn-outline-primary mt-3 d-flex align-items-center"
										style="background: var(--primaryColor);
										color: white;"
									>
										<span class="material-symbols-outlined"> schedule </span>
										<span class="mx-auto">{!joinCall ? 'Video görüşə qoşul' : 'Gözləyin'}</span>
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			{:else if $session.loggedIn}
				<div class="card mt-3 p-3">{$_('appointment.no_appointment')}</div>
			{:else}
				<div
					class="card mt-3 p-3"
					style="display: flex;
						flex-direction: row;
						align-items: baseline;
						gap: .5rem;"
				>
					{$_('appointment.loginToSee')}
					<button
						on:click={() => loginModal.set(true)}
						class="btn btn-outline-primary"
						style="height: 40px"
					>
						{$_('appointment.login')}
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<!-- <div class="row">
			<div class="col col-md-8 col-lg-9"> -->

		<!-- END VIDEO CALL -->
		{#if $showBtnEndCall}
			<button
				style="position: absolute;
				bottom: 1rem;
				right: 50%;
				transform: translateX(50%);
				background: rgb(212, 19, 19);
				color: white;
				font-size: 2rem;
				border-radius: 100%;
				width: 60px;
				height: 60px;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 100"
				class="btn btn-outline-primary"
				on:click={() => {
					showBtnEndCall.set(false);
					joinCall = false;
				}}
				><span style="font-size: 2rem" class="material-symbols-outlined icon-fill">
					call_end
				</span></button
			>
		{:else}
			<div
				style="width: 100dvw; height: 100dvh; position:absolute; top:0; 
			left:0; 
			display: flex; align-items:center; justify-content:center; z-index: 1"
			>
				Loading
			</div>
		{/if}

		<VideoCall {appointmentId} />

		<!-- </div>
			<div class="col col-md-4 col-lg-3">
				<div class="card h-100 my-2 p-2">Chat</div>
			</div>
		</div> -->
	{/if}
</div>

<ConfirmationModal bind:confirmationData {showDatePicker} on:confirmed={appointmentConfirmed} />

<style>
	.card {
		cursor: auto;
	}
</style>
