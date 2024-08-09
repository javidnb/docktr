<script lang="ts">
	import { onMount } from 'svelte';
	import { getMessaging, getToken } from 'firebase/messaging';
	import { app } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { appointments, dataLoading, putData, doctors } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { formatDate } from '$lib/helpers/dateFormatter';

	const messaging = getMessaging(app);
	let hideBtn: boolean = false;
	let inputToken = '';

	$: apps = $appointments.sort(
		(a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
	);

	onMount(async () => {
		console.log($appointments);
	});

	function registerCM() {
		dataLoading.set(true);
		navigator.serviceWorker
			.register('/service-worker.js', {
				type: 'module'
			})
			.then((registration) => {
				if (registration.active) {
					getToken(messaging, {
						vapidKey:
							'BJmtPB9yoTqRrplyE77d1lPptyYd1nn-1evh8lqs2QIg28Kb4Hlq-8qUa1zglHUhgT0VP6dJ3C2bm_pQyQWa79Y',
						serviceWorkerRegistration: registration
					})
						.then(async (currentToken) => {
							if (currentToken) {
								console.log('Token is: ' + currentToken);
								inputToken = currentToken;

								let tokens: any = $session.user?.fcmToken
									? JSON.parse($session.user?.fcmToken)
									: [];
								if (!tokens?.includes(currentToken) && $session.user?.uid) {
									tokens.push(currentToken);
									await putData('users', 'uid', $session.user?.uid, {
										fcmToken: JSON.stringify(tokens)
									});
									hideBtn = true;
								}
								dataLoading.set(false);
								// Send the token to your server and update the UI if necessary
								// ...
							} else {
								// Show permission request UI
								toast.push('Xəta!', {
									duration: 2000,
									theme: {
										'--toastColor': 'mintcream',
										'--toastBackground': 'rgb(176 24 24)',
										'--toastBarBackground': '#5b1010'
									}
								});
								dataLoading.set(false);
								// ...
							}
						})
						.catch((err) => {
							console.log(err);
							toast.push('Xəta!', {
								duration: 2000,
								theme: {
									'--toastColor': 'mintcream',
									'--toastBackground': 'rgb(176 24 24)',
									'--toastBarBackground': '#5b1010'
								}
							});
							// ...
						});
				}
			});
	}

	async function sendMsg() {
		let requestData = {
			tokens: JSON.stringify($session.user?.fcmToken),
			title: null,
			body: null,
			url: null
		};
		const response = await fetch(`https://tekoplast.az/docktr/api/?pushNotification`, {
			method: 'POST',
			cache: 'no-store',
			body: JSON.stringify({ ...requestData })
		});

		if (response.ok) {
			toast.push('Uğurlu!', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(91 144 77)',
					'--toastBarBackground': '#1d5b3c'
				}
			});
			dataLoading.set(false);
		} else {
			toast.push('Xəta!', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(176 24 24)',
					'--toastBarBackground': '#5b1010'
				}
			});
			dataLoading.set(false);
		}
	}

	function requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
			}
		});
	}
</script>

<!-- <section>
	<h5>Hastalık Geçmişi</h5>
	<button class="btn btn-primary w-50" class:d-none={hideBtn} on:click={registerCM}
		>push token</button
	>
	<input class="form-control mt-3 w-50" type="text" bind:value={inputToken} />

	{#if Notification.permission !== 'granted'}
		<button
			class="btn btn-primary w-50 mt-3"
			class:d-none={hideBtn}
			on:click={requestNotificationPermission}>Notification Perm</button
		>
	{/if}

	<button class="btn btn-primary w-50 mt-3" on:click={sendMsg}>send notification</button>
</section> -->

<section>
	<div class="d-flex flex-column gap-3">
		{#each apps as appointment}
			<div class="card py-2 px-3 d-flex flex-row gap-3" style="background-color: white; box-shadow: 0px 0px 5px #00000012">
				<div>
					<img
						src={$doctors.find((d) => d.id == appointment.doctorId)?.img}
						style="max-height: 80px; 
						aspect-ratio: 1.5/1;
						max-width: 100px; 
						border-radius: 6px; 
						object-fit: cover;
						object-position: top"
						alt="dok pic"
					/>
				</div>
				<div class="d-flex flex-column justify-content-center">
					<a
						href="/doctors/{$doctors.find((d) => d.id == appointment.doctorId)?.slug}"
						style="font-size: 1.2rem;
								text-decoration: none;
								color: #37592e;
								font-weight: 500;"
					>
						{$doctors.find((d) => d.id == appointment.doctorId)?.name}
					</a>
					<span style="font-size: small">{formatDate(new Date(appointment.startTime))}</span>
				</div>
				<div
					class="d-flex align-items-center ms-auto"
					style="color: {(appointment.status == 1 || appointment.status == 2) &&
					appointment.purchased == 1
						? 'var(--primaryColor)'
						: new Date(appointment.startTime) > new Date()
							? 'rgb(76 55 55)'
							: '#bd3939'}"
				>
					<span class="material-symbols-outlined icon-fill">
						{(appointment.status == 1 || appointment.status == 2) && appointment.purchased == 1
							? 'check_circle'
							: new Date(appointment.startTime) > new Date()
								? 'pending'
								: 'error'}
					</span>
				</div>
			</div>
		{/each}
	</div>
</section>
