<script lang="ts">
	import {
		appointments,
		confirmationModal,
		dataLoading,
		appointmentsLoading,
		doctors,
		loginModal,
		putData,
		joinVideoCall,
		ongoingAppointment,
		selectedUser,
		reviewModal
	} from '$lib/store/dataStore';
	import { onMount, tick } from 'svelte';
	import { monthNames } from '$lib/helpers/dateFormatter';
	import { session } from '$lib/session';
	import ConfirmationModal from '$lib/helpers/AppointConfirmation.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import VideoCall from '$lib/components/VideoCall.svelte';
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { tooltip } from 'svooltip';
	import 'svooltip/styles.css';
	import ReviewCall from '$lib/components/ReviewCall.svelte';
	import Modal from '$lib/helpers/Modal.svelte';

	let confirmationData: any = {};
	let showDatePicker: boolean = false;
	let upcomingAppointments: any, pastAppointments: any;
	let filteredAppointments: any = [];
	let appointmentId: any = null;
	let pastAppointmentsActive: boolean = false; // for showing active in the nav

	$: if (!$session.user) appointments.set([]);

	$: upcomingAppointments = $session?.user?.doctor
		? $appointments
				.filter((ap) => new Date(ap.endTime) > new Date() && ap.purchased)
				.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
				.map((ap) => {
					if (ap.email?.endsWith('@sehiyye')) {
						ap.phoneNumber = ap.email.substring(0, ap.email.length - 15);
						ap.email = '';
					}
					return ap;
				})
		: $session?.user
			? $appointments
					.filter((ap) => new Date(ap.endTime) > new Date())
					.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
			: [];

	$: filteredAppointments = upcomingAppointments;

	$: pastAppointments = $session?.user?.doctor
		? $appointments
				.filter((ap) => new Date(ap.endTime) < new Date() && ap.purchased)
				.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
				.map((ap) => {
					if (ap.email?.endsWith('@sehiyye')) {
						ap.phoneNumber = ap.email.substring(0, ap.email.length - 15);
						ap.email = '';
					}
					return ap;
				})
		: $session?.user
			? $appointments
					.filter((ap) => new Date(ap.endTime) < new Date())
					.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
			: [];

	onMount(() => {
		const updateRemainingTime = () => {
			if (filteredAppointments?.length) {
				filteredAppointments = filteredAppointments.map((appointment: any) => {
					return {
						...appointment,
						remainingTime: checkTime(appointment)
					};
				});
			}
		};

		if ($appointments.length) {
			updateRemainingTime();
		}
		const interval = setInterval(updateRemainingTime, 1000);

		filteredAppointments = upcomingAppointments;

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
		if ($session.user) {
			if (appointment.userId == $session.user.uid) {
				selectedUser.set($doctors.find((doc) => doc.id == appointment.doctorId)?.uid);
			} else {
				selectedUser.set(appointment.userId);
			}
		}
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

	function scaleFade(node: HTMLElement, { duration = 70 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => {
				const opacity = t; // from 0 to 1
				return `				
                    opacity: ${opacity};
                `;
			}
		};
	}
</script>

<div class="container" class:blur={$joinVideoCall}>
	<div class="row mb-5 pb-5 row-gap-3">
		<ul class="nav nav-tabs pc-mt">
			<li class="nav-item">
				<button
					class="nav-link"
					class:active={!pastAppointmentsActive}
					aria-current="page"
					on:click={() => {
						pastAppointmentsActive = false;
						filteredAppointments = upcomingAppointments;
					}}>Planlanan Görüşlər</button
				>
			</li>
			<li class="nav-item">
				<button
					class="nav-link"
					class:active={pastAppointmentsActive}
					on:click={() => {
						pastAppointmentsActive = true;
						filteredAppointments = pastAppointments;
					}}>Keçmiş Görüşlər</button
				>
			</li>
		</ul>
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
		{:else if filteredAppointments?.length && filteredAppointments}
			{#key pastAppointmentsActive}
				<div in:scaleFade>
					{#each filteredAppointments as appointment, index}
						<div class="col-md-6 col-lg-4">
							<div class="card mt-3 p-3 h-100">
								<!-- Section 1: Image and Name -->
								<div
									class="d-flex gap-3 align-items-center"
									style="border-bottom: 1px solid rgb(236, 236, 236); padding-bottom: 1rem; min-height: 100px"
								>
									{#if $session?.user?.doctor}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<div
											class="d-flex align-items-center gap-3 cursor-pointer w-100"
											on:click={() => {
												selectedUser.set(appointment.userId);
											}}
										>
											<!-- Doctor View: Show Patient Info -->
											{#if appointment.photoURL}
												<img
													src={appointment.photoURL}
													style="max-height: 80px; aspect-ratio: 1.5/1; max-width: 120px; border-radius: 6px; object-fit: cover"
													alt="user pic"
												/>
											{:else}
												<div
													style="width: 60px; height: 60px; color: var(--primaryColor); border-radius: 100%; border: 3px solid var(--primaryColor); display: flex; align-items: center; justify-content: center;"
												>
													<span class="material-symbols-outlined icon-fill" style="font-size: 3rem"
														>person</span
													>
												</div>
											{/if}
											<div class="d-flex flex-column flex-1 gap-2" style="min-height: 80px;">
												<div class="d-flex flex-column h-100">
													<span>{appointment.displayName}</span>
													<span>{appointment.email}</span>
												</div>

												<button class="btn btn-outline-primary w-100 mt-auto"
													>{$_('nav.messages')}</button
												>
											</div>
										</div>
									{:else}
										<!-- User View: Show Doctor Info -->
										<img
											src={$doctors.find((d) => d.id == appointment.doctorId)?.img}
											style="max-height: 80px; aspect-ratio: 1.5/1; max-width: 120px; border-radius: 6px; object-fit: cover; object-position: top"
											alt="doctor pic"
										/>
										<div class="d-flex align-items-center w-100 docDetails">
											<a
												href="/doctors/{$doctors.find((d) => d.id == appointment.doctorId)?.slug}"
												style="font-size: 1.2rem; text-align: center; text-decoration: none; color: #37592e; font-weight: 500; margin-inline: auto;"
											>
												{$doctors.find((d) => d.id == appointment.doctorId)?.name}
											</a>
											{#if appointment.purchased}
												<button
													on:click={() => sendMsg(appointment, true)}
													class="btn btn-outline-primary d-flex align-items-center"
													style="width: fit-content; align-self: center; gap: 10px;"
													use:tooltip={{ content: $_('actions.send_msg'), placement: 'right' }}
												>
													<span class="material-symbols-outlined">send</span>
													<span class="mobileOnly mx-auto">{$_('actions.send_msg')}</span>
												</button>
											{/if}
										</div>
									{/if}
								</div>

								<!-- Section 2: Appointment Date -->
								<div class="d-flex align-items-center gap-2 mt-3">
									<span class="material-symbols-outlined">schedule</span>
									<div>
										<span
											>{new Date(appointment.startTime).getHours()}:{new Date(appointment.startTime)
												.getMinutes()
												.toString()
												.padStart(2, '0')}</span
										>
										-
										<span
											>{new Date(appointment.endTime).getHours()}:{new Date(appointment.endTime)
												.getMinutes()
												.toString()
												.padStart(2, '0')}</span
										>
									</div>
								</div>
								<div
									class="d-flex align-items-center gap-2 mt-2"
									style="border-bottom: 1px solid rgb(236, 236, 236); padding-bottom: 1rem;"
								>
									<span class="material-symbols-outlined">calendar_month</span>
									<span
										>{new Date(appointment.endTime).getDate()}
										{monthNames[new Date(appointment.endTime).getMonth()]}</span
									>
								</div>

								{#if !appointment.ended && new Date(appointment.endTime) > new Date()}
									<!-- Section 3: Appointment Status -->
									{#if appointment.purchased}
										{#if appointment.status == 1}
											<span class="d-flex my-auto py-2 gap-1" style="color: #93930a">
												<span class="material-symbols-outlined">pending</span>
												<span>Həkimin təsdiqi gözlənilir</span>
											</span>
										{:else if appointment.status == 2}
											<span class="d-flex my-auto py-2 gap-1" style="color: green">
												<span class="material-symbols-outlined"
													>{appointment.changed ? 'change_circle' : 'check'}</span
												>
												<span
													>{appointment.changed
														? 'Randevu yeni saata keçirilib.'
														: 'Randevu saatı təsdiq edilib.'}</span
												>
											</span>
										{/if}
									{/if}

									<!-- Section 4: Action Buttons -->
									{#if $session?.user?.doctor}
										<!-- Doctor Actions -->
										{#if appointment.status == 1}
											<button
												class="btn btn-outline-primary mt-1 d-flex align-items-center"
												on:click={() => openAppConfirmModal(appointment, true)}
											>
												<span class="material-symbols-outlined">schedule_send</span>
												<span class="mx-auto">Vaxtı dəyiş</span>
											</button>
											<button
												class="btn btn-outline-primary mt-3 d-flex align-items-center"
												on:click={() => openAppConfirmModal(appointment)}
											>
												<span class="material-symbols-outlined">check</span>
												<span class="mx-auto">Təsdiq et</span>
											</button>
										{/if}
									{:else}
										<!-- User Actions -->
										{#if !appointment.purchased}
											<button
												class="btn btn-outline-primary mt-auto mb-2 d-flex align-items-center"
											>
												<span class="material-symbols-outlined">shopping_cart</span>
												<span class="mx-auto">Ödəniş et</span>
											</button>
										{/if}
									{/if}

									<!-- Section 5: Join Appointment Button -->
									{#if appointment.status == 2 && new Date(appointment?.startTime) > new Date()}
										<button
											class="btn btn-outline-primary mt-auto mb-2 d-flex align-items-center"
											on:click={() => joinCall(appointment)}
										>
											<span class="material-symbols-outlined">schedule</span>
											{#if appointment.remainingTime}
												<span class="mx-auto">
													{appointment.remainingTime.days != 0
														? appointment.remainingTime.days +
															' gün ' +
															appointment.remainingTime.hours +
															':' +
															appointment.remainingTime.minutes +
															':' +
															appointment.remainingTime.seconds
														: appointment.remainingTime.hours +
															':' +
															appointment.remainingTime.minutes +
															':' +
															appointment.remainingTime.seconds}
												</span>
											{/if}
										</button>
									{:else if appointment.status == 2}
										<button
											on:click={() => joinCall(appointment)}
											class="btn btn-outline-primary mt-3 mb-2 d-flex align-items-center"
											style="background: var(--primaryColor); color: white;"
										>
											<span class="material-symbols-outlined">video_call</span>
											<span class="mx-auto"
												>{!$joinVideoCall ? 'Video görüşə qoşul' : 'Gözləyin'}</span
											>
										</button>
									{/if}
								{:else}
									<div
										class="d-flex justify-content-center my-auto mt-2"
										style="color: #375935;
									font-weight: 500;"
									>
										Görüş başa çatıb
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/key}
		{:else if $session.loggedIn && $appointmentsLoading}
			<!-- APOINTMENTS LOADING -->
			<div class="card mt-3 p-3">Loading</div>
		{:else if $session.loggedIn}
			<div class="container px-3">
				<span>{$_('appointment.no_appointment')}</span>
			</div>
		{:else}
			<div class="px-3">
				<div
					class="card mt-3 p-3"
					style="display: flex;
					flex-direction: row;
					align-items: baseline;
					gap: .5rem;"
				>
					{$_('appointment.loginToSee')}
					<button on:click={() => loginModal.set(true)} class="btn btn-outline-primary h-100">
						{$_('appointment.login')}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if $joinVideoCall}
	<VideoCall {appointmentId} />
{/if}

<ConfirmationModal bind:confirmationData {showDatePicker} on:confirmed={appointmentConfirmed} />

{#if $reviewModal}
	<Modal bind:showModal={$reviewModal}>
		<div class="p-3" style="background-color: rgb(240 240 240 / 45%);">
			<ReviewCall />
		</div>
	</Modal>
{/if}

<style>
	.card {
		cursor: auto;
	}
	.blur {
		filter: blur(2px);
	}
	.nav-link:not(.active) {
		color: var(--primaryText);
	}
	.nav-tabs .nav-item,
	.nav-tabs .active,
	.nav-tabs .nav-item:hover .nav-link {
		border-radius: 0;
	}
	.nav-tabs .nav-item .nav-link {
		border: 0;
		outline: 0;
	}
	.nav-tabs .nav-item .nav-link {
		color: var(--primaryColor);
	}
	.nav-tabs .active {
		border: 0;
		border-bottom: 3px solid !important;
		background-color: unset;
		color: var(--primaryText) !important;
	}

	.transition-enter {
		animation: enter 0.3s forwards;
	}

	.transition-exit {
		animation: exit 0.3s forwards;
	}

	@keyframes enter {
		from {
			transform: translateX(var(--direction, 0));
		}
		to {
			transform: translateX(0);
		}
	}

	@keyframes exit {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(var(--direction, 0));
		}
	}
</style>
