<script lang="ts">
	// login/+page.svelte
	import { session } from '$lib/session';
	import { auth, messaging } from '$lib/firebase.client';
	import {
		GoogleAuthProvider,
		signInWithEmailAndPassword,
		type UserCredential,
		signInWithRedirect,
		getAuth
	} from 'firebase/auth';
	import { getToken } from 'firebase/messaging';
	import { onMount } from 'svelte';
	import { dataLoading, loginModal, putData } from '$lib/store/dataStore';
	import { appointments } from '$lib/store/dataStore';

	let email: string = '';
	let password: string = '';
	let phoneNumber: string = '';
	let buttonText: string = 'Giriş';
	let displayName: string;
	let disabled = false;

	let type: string = 'login';
	let method: string = 'mobile';

	function closeModal() {
		loginModal.set(false);
		buttonText = 'Giriş';
		disabled = false;
	}

	onMount(async () => {
		if ($session.loggedIn) {
			// goto('./profile');
		}
	});

	async function postData(userData: any) {
		console.log('adding data: ', userData);
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
			session.set({
				user: userData,
				loggedIn: true,
				loading: false
			});
			registerCM();
			console.log('Data posted successfully: ', $session);
		} else {
			// Handle error response
			console.error('Failed to post data');
			// session.set({
			// 	user: userData,
			// 	loggedIn: true,
			// 	loading: false
			// });
		}
	}

	async function getUser(user: any) {
		try {
			let time = new Date().getTime();
			const response = await fetch(
				`https://tekoplast.az/docktr/api/?user&id=${user.user.uid}&t=${time}`
			);
			const result = await response.json();
			console.log('response: ', result);
			if (!result) {
				console.log('add user to db');
				let usr = user.user;
				let data = {
					uid: usr.uid,
					displayName: usr.displayName,
					email: usr.email,
					phoneNumber: usr.phoneNumber || null,
					photoURL: usr.photoURL,
					fcmToken: usr.fcmToken
				};
				postData(data);
				return;
			} else {
				console.log('getting appointments and registering for notifications');
				getAppointments(result);
				registerCM();
			}
			session.set({
				user: result,
				loggedIn: true,
				loading: false
			});
			return response;
		} catch (error) {
			console.error(error);
		}
	}

	async function loginWithMail() {
		dataLoading.set(true);
		buttonText = 'Gözləyin..';
		disabled = true;
		await signInWithEmailAndPassword(auth, email, password)
			.then(async (result) => {
				const { user }: UserCredential = result;
				localStorage.setItem('user', JSON.stringify(user));
				await getUser(result);
				closeModal();
			})
			.catch((error) => {
				dataLoading.set(false);
				return error;
			});
	}

	async function loginWithGoogle() {
		const provider = new GoogleAuthProvider();
		const auuth = getAuth();
		await signInWithRedirect(auuth, provider)
			.then(async (result: any) => {
				console.log(result);
				// const { displayName, email, photoURL, uid } = result?.user;
				localStorage.setItem('user', JSON.stringify(result?.user));
				await getUser(result);
				loginModal.set(true);
				closeModal();
			})
			.catch((error) => {
				dataLoading.set(false);
				return error;
			});
	}

	// REGISTER FOR PUSH NOTIFICATIONS
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
								console.log('Notification token: ' + currentToken);

								let tokens: any = $session.user?.fcmToken
									? JSON.parse($session.user?.fcmToken)
									: [];

								console.log('tokens: ', tokens);
								if (!tokens?.includes(currentToken) && $session.user?.uid) {
									console.log('current token exists? ', tokens?.includes(currentToken));
									console.log('pushing token');
									tokens.push(currentToken);
									await putData('users', 'uid', $session.user?.uid, {
										fcmToken: JSON.stringify(tokens)
									});
								}
							} else {
								dataLoading.set(false);
								console.log('error');
							}
						})
						.catch((err) => {
							dataLoading.set(false);
							console.log(err);
						});
				}
			});
	}

	// RETRIEVE EXISTING APPOINTMENTS OF LOGGED IN USER
	async function getAppointments(user: any) {
		try {
			console.log(user);
			let time = new Date().getTime();
			let response;
			if (user.doctor) {
				response = await fetch(
					`https://tekoplast.az/docktr/api/?appointments&id=${user.doctor}&type=doctor&t=${time}`
				);
			} else {
				response = await fetch(
					`https://tekoplast.az/docktr/api/?appointments&id=${user.uid}&t=${time}`
				);
			}

			const result = await response.json();
			if (result) {
				appointments.set(result);
				dataLoading.set(false);
				return null;
			}
			return response;
		} catch (error) {
			console.error(error);
			dataLoading.set(false);
			return null;
		}
	}
</script>

<div class="login-form">
	<div class="col pb-4" style="margin-top: 0; padding-top:0">
		<div class="d-flex px-0 gap-2 socials w-100" style="padding: 1.5rem;">
			<button
				on:click={() => (method = 'mobile')}
				class="btn btn-outline-primary"
				class:active={method == 'mobile'}
				><span class="material-symbols-outlined icon-fill"> call </span></button
			>
			<button
				on:click={() => (method = 'email')}
				class="btn btn-outline-primary bg-white"
				class:active={method == 'email'}
				><span class="material-symbols-outlined icon-fill"> mail </span></button
			>
			<button class="btn btn-outline-primary bg-white" on:click={loginWithGoogle}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					x="0px"
					y="0px"
					width="25"
					height="25"
					viewBox="0 0 48 48"
				>
					<path
						fill="#FFC107"
						d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
					></path><path
						fill="#FF3D00"
						d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
					></path><path
						fill="#4CAF50"
						d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
					></path><path
						fill="#1976D2"
						d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
					></path>
				</svg></button
			>
		</div>
		<form on:submit={loginWithMail}>
			<h5 class="text-center mb-0">{type == 'login' ? 'Hesaba giriş' : 'Qeydiyyat'}</h5>
			{#if type == 'register'}
				<input
					class="form-control"
					style="padding: .5rem; min-width: 300px"
					bind:value={displayName}
					type="text"
					placeholder="Ad Soyad"
					required
				/>
			{/if}
			{#if method == 'email'}
				<input
					class="form-control"
					style="padding: .5rem; min-width: 300px"
					bind:value={email}
					type="text"
					placeholder="Email"
					required
				/>
			{:else if method == 'mobile'}
				<input
					class="form-control"
					style="padding: .5rem; min-width: 300px"
					bind:value={phoneNumber}
					type="number"
					placeholder="Mobil"
					required
				/>
			{/if}
			<input
				class="form-control"
				style="padding: .5rem;"
				bind:value={password}
				type="password"
				placeholder="Şifrə"
				required
			/>
			<button
				class="btn"
				{disabled}
				type="submit"
				style="padding: 0.5rem;
			border-radius: 10px;
			background: var(--primaryColor);
			color: white;
			border: 0px;
			font-size: 1.05rem;
			cursor: pointer;">{type == 'login' ? 'Giriş' : 'Qeydiyyat'}</button
			>
		</form>

		<hr style="margin-top: 1rem" />
		<div style="display: flex; flex-direction: column; gap: 1rem; align-items: center; padding:0">
			<span>{type == 'login' ? 'Hesabın yoxdur? ' : 'Hesabınız var? '}</span>
			<button
				on:click={() => (type = type == 'login' ? 'register' : 'login')}
				class="btn btn-outline-primary w-100"
			>
				{type == 'login' ? 'Qeydiyyat' : 'Hesaba giriş'}
			</button>
		</div>
	</div>
</div>

<style type="text/css">
	.login-form {
		display: grid;
		place-content: center;
	}

	.login-form div {
		background-color: #f7f7f7;
		padding: 1rem 2rem;
		margin-top: 0rem;
	}

	.login-form div form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.socials button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.active,
	.socials button:hover {
		background-color: var(--primaryColor) !important;
	}
</style>
