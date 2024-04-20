<script lang="ts">
	import { onMount } from 'svelte';
	import { getMessaging, getToken } from 'firebase/messaging';
	import { app } from '$lib/firebase.client';

	const messaging = getMessaging(app);
	let cmToken = '';

	onMount(async () => {
		if ('serviceWorker' in navigator) {
			addEventListener('load', function () {
				console.log('yo');
			});
		}
	});

	function registerCM() {
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
						.then((currentToken) => {
							if (currentToken) {
								console.log('Token is: ' + currentToken);
								cmToken = currentToken;
								// Send the token to your server and update the UI if necessary
								// ...
							} else {
								// Show permission request UI
								console.log('No registration token available. Request permission to generate one.');
								cmToken = 'error';
								// ...
							}
						})
						.catch((err) => {
							console.log(err);
							cmToken = 'error';
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
	<input type="text" class="form-control mt-3 w-50" bind:value={cmToken} />

	{#if Notification.permission !== 'granted'}
		<button class="btn btn-primary w-50 mt-3" on:click={requestNotificationPermission}
			>Notification Perm</button
		>
	{/if}
</section>
