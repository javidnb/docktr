<script lang="ts">
	import { onMount } from 'svelte';
	import { getMessaging, getToken } from 'firebase/messaging';
	import { app } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { dataLoading, putData } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';

	const messaging = getMessaging(app);
	let hideBtn: boolean = false;

	onMount(async () => {});

	function registerCM() {
		dataLoading.set(true);
		navigator.serviceWorker
			.register('/service-worker.js', {
				type: 'module'
			})
			.then((registration) => {
				console.log('sw: ', registration);
				if (registration.active) {
					getToken(messaging, {
						vapidKey:
							'BJmtPB9yoTqRrplyE77d1lPptyYd1nn-1evh8lqs2QIg28Kb4Hlq-8qUa1zglHUhgT0VP6dJ3C2bm_pQyQWa79Y',
						serviceWorkerRegistration: registration
					})
						.then(async (currentToken) => {
							if (currentToken) {
								console.log('Token is: ' + currentToken);

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

	function requestNotificationPermission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
			}
		});
	}

	function handleClick() {
		// postData({ uid: 1, displayName: 'Cavka' });
		// registerSw();
		// requestPermission();
		registerCM();
	}
</script>

<section>
	<h5>Hastalık Geçmişi</h5>
	<button class="btn btn-primary w-50" on:click={handleClick}>push token</button>

	{#if Notification.permission !== 'granted'}
		<button
			class="btn btn-primary w-50 mt-3"
			class:d-none={hideBtn}
			on:click={requestNotificationPermission}>Notification Perm</button
		>
	{/if}
</section>
