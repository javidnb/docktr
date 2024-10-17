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
		selectedUser,
		reviewModal,
		slideIn,
		cancelAppointment,
		zoomIn,
		users
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
	import 'svooltip/styles.css';
	import ReviewCall from '$lib/components/ReviewCall.svelte';
	import Modal from '$lib/helpers/Modal.svelte';
	import { page } from '$app/stores';

	export let showLatestAppointment = false;

	let confirmationData: any = {};
	let showDatePicker: boolean = false;
	let upcomingAppointments: any, pastAppointments: any;
	let filteredAppointments: any = [];
	let appointmentId: any = null;
	let pastAppointmentsActive: boolean = false; // for showing active in the nav
	let startX = 0;
	let endX = 0;
	$: curPage = $page.route.id;

	// $: if (!$session.user) appointments.set([]);

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

	function openAppConfirmModal(appointment: any, showDP?: boolean, cancelModal?: boolean) {
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
		data += cancelModal
			? '<br/> tarixli görüşü ləğv et?'
			: '<br/> tarixli randevunu təsdiq edirsiniz?';
		showDatePicker = showDP == true ? true : false;
		confirmationData = {
			text: data,
			data: {
				startTime: appointment.startTime,
				endTime: appointment.endTime,
				appointmentId: appointment.id
			},
			cancelModal
		};
		confirmationModal.set(true);
	}

	async function appointmentConfirmed(event: CustomEvent) {
		dataLoading.set(true);
		console.log(event.detail.confData);
		let data;
		if (event.detail.confData.cancelModal) {
			// APPOINTMENT CANCELLED BY DOC
			data = { status: 10 };
		} else {
			data = event.detail.data.changed
				? {
						status: 2,
						startTime: jsDateToSQL(event.detail.data.startTime),
						endTime: jsDateToSQL(event.detail.data.endTime),
						changed: true
					}
				: { status: 2 };
		}

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
			tokens: fcmTokens[0].fcmToken,
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
		if (doctor) {
			let doc = $doctors.find((d) => d.id == appointment.doctorId);
			if (doc) {
				selectedUser.set(doc.uid);
				goto('./messages');
			}
		}
	}

	function handleTouch(event: any) {
		const swipeThreshold = 50; // Minimum distance for a swipe
		if (event.type === 'touchstart') {
			startX = event.touches[0].clientX;
		} else if (event.type === 'touchend') {
			endX = event.changedTouches[0].clientX;
			if (startX - endX > swipeThreshold) {
				// Swipe Left
				pastAppointmentsActive = true;
				filteredAppointments = pastAppointments;
			} else if (endX - startX > swipeThreshold) {
				// Swipe right
				pastAppointmentsActive = false;
				filteredAppointments = upcomingAppointments;
			}
		}
	}

	function scaleFade(node: HTMLElement, { duration = 100 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => {
				const x = !pastAppointmentsActive ? -100 + 100 * t : 100 - 100 * t;
				return `transform: translateX(${x}px);`;
			}
		};
	}

	async function pay(appointmentId: any, amount: any) {
		dataLoading.set(true);

		let order_id = appointmentId;

		let body = {
			public_key: import.meta.env.VITE_EPOINT_KEY,
			amount,
			currency: 'AZN',
			language: 'az',
			order_id: order_id
		};
		// amount: parseFloat((doc.price + $comission).toFixed(2)),

		const response = await fetch('https://tekoplast.az/docktr/api/?sendPaymentRequest', {
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

	async function removeAppointment(appointmentId: any) {
		dataLoading.set(true);
		let result = await cancelAppointment(appointmentId, $session.user?.uid);
		if (result.status == 'success') {
			appointments.set($appointments.filter((item) => item.id !== appointmentId));
			dataLoading.set(false);
			goto('/appointments');
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

	// THIS FUNCTION IS FOR ADDING USER DETAILS FOR MESSAGES
	function checkUsers(appointment: any) {
		if (!$users.find((u: any) => u.uid == appointment.userId)) {
			let dd = $users;
			dd.push({
				uid: appointment.userId,
				displayName: appointment.displayName,
				photoURL: appointment.photoURL
			});
			users.set(dd);
		}
	}
</script>

<div
	class="container"
	class:blur={$joinVideoCall}
	on:touchstart={handleTouch}
	on:touchend={handleTouch}
	style="overflow-x: hidden;"
>
	<div class="mb-5 pb-5 row-gap-3" in:zoomIn>
		{#if !showLatestAppointment}
			<ul class="nav nav-tabs" class:pc-mt={curPage !== '/doctor'}>
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
		{/if}
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
				<div
					class="row row-gap-3"
					class:justify-content-center={showLatestAppointment}
					in:scaleFade
				>
					{#each showLatestAppointment ? filteredAppointments.slice(0, 1) : filteredAppointments as appointment}
						<div class="col-md-6 col-lg-4">
							<div class="card mt-3 p-3 h-100 w-100">
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
													style="width: 60px; height: 60px; color: var(--primaryText); border-radius: 100%; border: 3px solid var(--primaryColor); display: flex; align-items: center; justify-content: center;"
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

												<button
													on:click={() => {
														checkUsers(appointment);
													}}
													class="btn btn-outline-primary w-100 mt-auto">{$_('nav.messages')}</button
												>
											</div>
										</div>
									{:else}
										<!-- User View: Show Doctor Info -->
										<img
											src={$doctors.find((d) => d.id == appointment.doctorId)?.img}
											style="max-height: 80px; aspect-ratio: 1.5/1; max-width: 120px; border-radius: 6px; object-fit: cover; object-position: center"
											alt="doctor pic"
										/>
										<div class="d-flex align-items-center w-100 docDetails">
											<a
												href="/doctors/{$doctors.find((d) => d.id == appointment.doctorId)?.slug}"
												style="font-size: 1.2rem; text-align: center; text-decoration: none; color: var(--primaryText); font-weight: 500; margin-inline: auto;"
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
										>{new Date(appointment.startTime).getDate()}
										{monthNames[new Date(appointment.startTime).getMonth()]}</span
									>
								</div>

								{#if !appointment.ended && new Date(appointment.endTime) > new Date()}
									<!-- Section 3: Appointment Status -->
									{#if appointment.purchased && appointment.status !== 2}
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
										{:else if appointment.status == 10}
											<div class="d-flex my-auto py-2 gap-1 w-100" style="color: rgb(175 0 0)">
												<span class="material-symbols-outlined icon-fill">cancel</span>
												<span class="mx-auto">Görüş həkim tərəfindən ləğv edilib</span>
											</div>
											<span
												style="text-align: center;
													font-size: smaller;
													color: gray;">Yeni görüş vaxtı təyin etmək üçün tezliklə sizinlə əlaqə saxlanılacaq</span
											>
										{/if}
									{/if}

									<!-- Section 4: Action Buttons -->
									{#if $session?.user?.doctor}
										<!-- Doctor Actions -->
										{#if appointment.status == 1}
											<!-- <button
												class="btn btn-outline-primary mt-1 d-flex align-items-center"
												on:click={() => openAppConfirmModal(appointment, true)}
											>
												<span class="material-symbols-outlined">schedule_send</span>
												<span class="mx-auto">Vaxtı dəyiş</span>
											</button> -->
											<button
												class="btn btn-primary mt-1 d-flex align-items-center"
												on:click={() => openAppConfirmModal(appointment)}
											>
												<span class="material-symbols-outlined">check</span>
												<span class="mx-auto">Görüşü təsdiq et</span>
											</button>
											<button
												class="btn btn-outline-primary mt-3 d-flex align-items-center"
												on:click={() => openAppConfirmModal(appointment, false, true)}
											>
												<span class="material-symbols-outlined">cancel</span>
												<span class="mx-auto">Görüşü ləğv et</span>
											</button>
										{/if}
									{:else}
										<!-- User Actions -->
										{#if !appointment.purchased}
											<button
												class="btn btn-outline-primary mt-auto mb-2 d-flex align-items-center"
												disabled={$dataLoading}
												on:click={() => {
													pay(appointment.id, appointment.amount);
												}}
											>
												<span class="material-symbols-outlined">shopping_cart</span>
												<span class="mx-auto">{$_('actions.pay')}</span>
											</button>
											<button
												class="btn btn-outline-primary mt-2 d-flex align-items-center"
												disabled={$dataLoading}
												on:click={() => {
													removeAppointment(appointment.id);
												}}
											>
												<span class="material-symbols-outlined"> cancel </span>
												<span class="mx-auto">{$_('actions.cancel_appointment')}</span>
											</button>
										{/if}
									{/if}

									<!-- Section 5: Join Appointment Button -->
									{#if appointment.status == 2 && new Date(appointment?.startTime) > new Date()}
										<button
											class="btn btn-outline-primary my-auto d-flex align-items-center"
											on:click={() => {
												if ($session.user?.admin) goto(`./appointments/${appointment.id}`);
											}}
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
									{:else if appointment.status == 2 && appointment.purchased == 1}
										<button
											on:click={() => {
												goto(`./appointments/${appointment.id}`);
											}}
											class="btn btn-outline-primary my-auto py-2 d-flex align-items-center btnJoinCall"
											style="background: var(--primaryColor); color: white;"
										>
											<span class="material-symbols-outlined">video_call</span>
											<span class="mx-auto"
												>{!$joinVideoCall ? $_('call.join') : $_('call.wait')}</span
											>
										</button>
									{/if}
								{:else}
									<div
										class="d-flex justify-content-center my-auto"
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
			<div class="container p-3">
				{#key pastAppointmentsActive}
					<span in:scaleFade>{$_('appointment.no_appointment')}</span>
				{/key}
			</div>
		{:else}
			<div class="px-3">
				<div
					class="card mt-3 p-3"
					style="display: flex;
					flex-direction: column;
					align-items: center;
					gap: .5rem;"
				>
					{$_('appointment.loginToSee')}
					<button
						on:click={() => loginModal.set(true)}
						class="btn btn-outline-primary h-100 mt-3"
						style="min-width: 100px"
					>
						{$_('appointment.login')}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if $confirmationModal}
	<ConfirmationModal
		bind:confirmationData
		{showDatePicker}
		on:confirmed={appointmentConfirmed}
		on:cancelled={() => {
			showDatePicker = false;
			confirmationModal.set(false);
		}}
	/>
{/if}

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
	.btnJoinCall:hover {
		background-color: #87a47f !important;
	}
</style>
