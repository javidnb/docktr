<script lang="ts">
	import {
		appointments,
		confirmationModal,
		dataLoading,
		appointmentsLoading,
		doctors,
		loginModal,
		putData,
		showBtnEndCall,
		joinVideoCall,
		ongoingAppointment,
		selectedUser
	} from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { session } from '$lib/session';
	import ConfirmationModal from '$lib/helpers/AppointConfirmation.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import VideoCall from '$lib/components/VideoCall.svelte';
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { tooltip } from 'svooltip';

	let confirmationData: any = {};
	let showDatePicker: boolean = false;
	let upcomingAppointments;
	let appointmentId: any = null;

	$: if (!$session.user) appointments.set([]);

	$: upcomingAppointments = $session?.user?.doctor
		? $appointments
				.filter((ap) => new Date(ap.endTime) > new Date() && ap.purchased)
				.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
		: $appointments
				.filter((ap) => new Date(ap.endTime) > new Date())
				.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

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

		if ($appointments.length) {
			updateRemainingTime();
		}
		const interval = setInterval(updateRemainingTime, 1000);

		return () => clearInterval(interval);
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

			sendNotif(customisedApp);
			dataLoading.set(false);
			confirmationModal.set(false);
		} else {
			dataLoading.set(false);
		}
	}

	async function sendNotif(appointment: any) {
		let time = new Date().getTime();
		let uid = appointment.userId;
		const fcmToken = await fetch(`https://tekoplast.az/docktr/api/?getTokens&uid=${uid}&t=${time}`);
		const fcmTokens = await fcmToken.json();

		let requestData = {
			tokens: JSON.stringify(fcmTokens[0].fcmToken),
			title: null,
			body: appointment.changed
				? 'Randevu yeni saata keçirilib.'
				: 'Randevu saatınız həkim tərəfindən təsdiq edilib',
			url: 'https://sehiyye.online/appointment'
		};

		await fetch(`https://tekoplast.az/docktr/api/?pushNotification`, {
			method: 'POST',
			cache: 'no-store',
			body: JSON.stringify({ ...requestData })
		});
	}

	function joinCall(appointment: any) {
		ongoingAppointment.set(appointment);
		dataLoading.set(true);
		appointmentId = appointment.id;
		joinVideoCall.set(true);
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

	function sendMsg(appointment: any, doctor?: boolean) {
		console.log(appointment);
		if (doctor) {
			let doc = $doctors.find((d) => d.id == appointment.doctorId);
			if (doc) {
				selectedUser.set(doc.uid);
				goto('./messages');
			}
		}
	}
</script>

<div class="container">
	{#if !$joinVideoCall}
		<div class="row mb-5 pb-5">
			{#if $appointmentsLoading}
				<!-- APOINTMENTS LOADING -->
				<div class="d-flex flex-column justify-content-center align-items-center my-5">
					<div class="lds-ellipsis mt-5">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<!-- <span style="color: gray; margin-top: -20px; margin-bottom: 2rem">Yüklənir ..</span> -->
				</div>
			{:else if upcomingAppointments.length && upcomingAppointments}
				{#each upcomingAppointments as appointment}
					<div class="col-md-6 col-lg-4">
						{#if $session?.user?.doctor}
							<!-- APPOINTMENTS OF A DOCTOR -->
							<div class="card mt-3 p-3 h-100">
								<div class="card-body d-flex flex-column" style="padding: .5rem;">
									<div
										class="d-flex gap-3 align-items-center"
										style="border-bottom: 1px solid rgb(236, 236, 236); 
										padding-bottom: 1rem;
										min-height: 100px"
									>
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
									<div class="d-flex align-items-center gap-2 mt-3">
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
									<div
										class="d-flex align-items-center gap-2 mb-3 mt-2"
										style="border-bottom: 1px solid rgb(236, 236, 236); padding-bottom: 1rem;"
									>
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
								<!-- CONFIRM APPOINTMENT -->
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

								{#if new Date(appointment?.startTime) > new Date() && appointment.status == 2}
									<button
										class="btn btn-outline-primary mt-3 mb-2 d-flex align-items-center"
										on:click={() => joinCall(appointment)}
									>
										<span class="material-symbols-outlined"> schedule </span>
										{#if appointment.remainingTime}
											<span class="mx-auto"
												>{appointment.remainingTime?.days != 0
													? appointment.remainingTime?.days +
														' gün ' +
														appointment.remainingTime?.hours +
														':' +
														appointment.remainingTime?.minutes +
														':' +
														appointment.remainingTime?.seconds
													: appointment.remainingTime?.hours +
														':' +
														appointment.remainingTime?.minutes +
														':' +
														appointment.remainingTime?.seconds +
														''}</span
											>
										{/if}
									</button>
								{:else if appointment.status == 2}
									<button
										on:click={() => joinCall(appointment)}
										class="btn btn-outline-primary mt-3 mb-2 d-flex align-items-center"
										style="background: var(--primaryColor);
										color: white;"
									>
										<span class="material-symbols-outlined"> video_call </span>
										<span class="mx-auto"
											>{!$joinVideoCall ? 'Video görüşə qoşul' : 'Gözləyin'}</span
										>
									</button>

									<!-- ALTDAKINI SIL, USTDEKINI KOMMENTDEN CIXART -->
									<!-- <button
										on:click={() => joinCall(appointment)}
										class="btn btn-outline-primary mt-3 d-flex align-items-center"
										style="background: var(--primaryColor);
										color: white;"
									>
										<span class="material-symbols-outlined"> schedule </span>
										<span class="mx-auto"
											>{!$joinVideoCall ? 'Video görüşə qoşul' : 'Gözləyin'}</span
										>
									</button> -->
								{/if}
							</div>
						{:else}
							<!-- APPOINTMENTS OF A USER -->
							<div class="card mt-3 p-3 h-100">
								<div
									class="d-flex gap-3 align-items-center"
									style="border-bottom: 1px solid #ececec; padding-bottom: 1rem"
								>
									<img
										src={$doctors.find((d) => d.id == appointment.doctorId)?.img}
										style="max-height: 80px; 
											aspect-ratio: 1.5/1;
											max-width: 120px; 
											border-radius: 6px; 
											object-fit: cover;
											object-position: top"
										alt="dok pic"
									/>
									<div class="d-flex align-items-center w-100 docDetails">
										<a
											href="/doctors/{$doctors.find((d) => d.id == appointment.doctorId)?.slug}"
											style="font-size: 1.2rem;
												text-align: center;
												text-decoration: none;
												color: #37592e;
												font-weight: 500;
												margin-inline: auto;"
										>
											{$doctors.find((d) => d.id == appointment.doctorId)?.name}
										</a>
										{#if appointment.purchased}
											<button
												on:click={() => {
													sendMsg(appointment, true);
												}}
												class="btn btn-outline-primary d-flex align-items-center"
												style="width: fit-content;
													align-self: center;
													gap: 10px;"
												use:tooltip={{
													content: $_('actions.send_msg'),
													placement: 'right'
												}}
											>
												<span class="material-symbols-outlined"> send </span>
												<span class="mobileOnly mx-auto">{$_('actions.send_msg')}</span>
											</button>
										{/if}
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
								<div
									class="d-flex align-items-center gap-2 mb-1"
									style="border-bottom: 1px solid #ececec; padding-bottom: 1rem"
								>
									<span class="material-symbols-outlined"> calendar_month </span>
									<span
										><span
											>{new Date(appointment.endTime).getDate()}
											{monthNames[new Date(appointment.endTime).getMonth()]}</span
										></span
									>
								</div>
								<!-- PAYMENT -->
								{#if appointment.purchased}
									<div class="d-flex align-items-center gap-1 mt-2" style="color: green">
										<span class="material-symbols-outlined"> check </span>
										<span>Uğurlu ödəniş</span>
									</div>
								{/if}
								{#if !appointment.purchased}
									<div
										class="d-flex align-items-center gap-1 mt-2"
										style="color: {appointment.purchased ? 'green' : '#c00909'}"
									>
										<span class="material-symbols-outlined"> error </span>
										<span>Ödəniş edilməmişdir</span>
									</div>
								{:else if appointment.status == 1}
									<span class="d-flex mt-2 gap-1" style="color: #93930a"
										><span class="material-symbols-outlined"> pending </span>
										<span>Həkimin təsdiqi gözlənilir</span>
									</span>
								{:else if appointment.status == 2}
									<span class="d-flex mt-2 gap-1" style="color: green"
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

								{#if !appointment.purchased}
									<button class="btn btn-outline-primary mt-auto mb-2 d-flex align-items-center">
										<span class="material-symbols-outlined"> shopping_cart </span>
										<span class="mx-auto">Ödəniş et</span>
									</button>
								{/if}

								{#if appointment.status == 2}
									{#if new Date(appointment?.startTime) > new Date()}
										<button
											class="btn btn-outline-primary mt-auto mb-2 d-flex align-items-center"
											on:click={() => joinCall(appointment)}
										>
											<span class="material-symbols-outlined"> schedule </span>
											{#if appointment.remainingTime}
												<span class="mx-auto"
													>{appointment.remainingTime?.days != 0
														? appointment.remainingTime?.days +
															' gün ' +
															appointment.remainingTime?.hours +
															':' +
															appointment.remainingTime?.minutes +
															':' +
															appointment.remainingTime?.seconds
														: appointment.remainingTime?.hours +
															':' +
															appointment.remainingTime?.minutes +
															':' +
															appointment.remainingTime?.seconds +
															''}</span
												>
											{/if}
										</button>
									{:else}
										<button
											on:click={() => joinCall(appointment)}
											class="btn btn-outline-primary mt-auto mb-2 d-flex align-items-center"
										>
											<span class="material-symbols-outlined"> video_call </span>
											<span class="mx-auto"
												>{!$joinVideoCall ? 'Video görüşə qoşul' : 'Gözləyin'}</span
											>
										</button>
									{/if}
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			{:else if $session.loggedIn && $appointmentsLoading}
				<!-- APOINTMENTS LOADING -->
				<div class="card mt-3 p-3">Loading</div>
			{:else if $session.loggedIn}
				<div class="container">
					<div class="card mt-3 p-3">{$_('appointment.no_appointment')}</div>
				</div>
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
					joinVideoCall.set(false);
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
				<!-- VIDEO CALL LOADING-->
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

	.lds-ellipsis,
	.lds-ellipsis div {
		box-sizing: border-box;
		color: var(--primaryColor);
	}
	.lds-ellipsis {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-ellipsis div {
		position: absolute;
		top: 33.33333px;
		width: 13.33333px;
		height: 13.33333px;
		border-radius: 50%;
		background: currentColor;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>
