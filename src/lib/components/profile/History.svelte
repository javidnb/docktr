<script lang="ts">
	import { session } from '$lib/session';
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
								// ...
							}
						})
						.catch((err) => {
							console.log(err);
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

	async function postData(userData: any) {
		let dataToPost = { table: 'users', data: { ...userData } };
		const response = await fetch('https://tekoplast.az/docktr/api/?postData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...dataToPost }),
			cache: 'no-cache'
		});

		if (response.ok) {
			session.update((cur: any) => {
				return {
					...cur,
					userData,
					loggedIn: true,
					loading: false
				};
			});
			console.log('Data posted successfully', response);
		} else {
			// Handle error response
			console.error('Failed to post data');
			session.update((cur: any) => {
				return {
					...cur,
					userData,
					loggedIn: true,
					loading: false
				};
			});
		}
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
	<button class="btn btn-primary w-50" on:click={handleClick}>Post</button>
	<input type="text" class="form-control mt-3" bind:value={cmToken} />
</section>
