<script lang="ts">
	import { onMount } from 'svelte';
	import { getMessaging, getToken } from 'firebase/messaging';
	import { app } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { dataLoading, putData } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';

	const messaging = getMessaging(app);
	let hideBtn: boolean = false;
	let inputToken = '';

	onMount(async () => {});

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

<section>
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
</section>
