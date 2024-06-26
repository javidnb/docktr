<script lang="ts">
	import { session } from '$lib/session';
	import { auth, messaging, provider } from '$lib/firebase.client';
	import {
		signInWithEmailAndPassword,
		type UserCredential,
		signInWithRedirect,
		signInWithCustomToken
	} from 'firebase/auth';
	import { getToken } from 'firebase/messaging';
	import { onMount } from 'svelte';
	import { dataLoading, loginModal, putData, appointments } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { _ } from 'svelte-i18n';

	let email: string = '';
	let password: string = '';
	let phoneNumber: string = '';
	let displayName: string;
	let disabled = false;
	let showError: boolean = false;

	let type: string = 'login';
	let method: string = 'mobile';

	function closeModal() {
		loginModal.set(false);
		disabled = false;
		showError = false;
	}

	$: if ($loginModal == false) {
		disabled = false;
		showError = false;
	}

	onMount(async () => {
		showError = false;
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

	async function login() {
		dataLoading.set(true);
		disabled = true;
		showError = false;
		if (method == 'mobile') {
			dataLoading.set(true);
			const response = await fetch('https://tekoplast.az/docktr/api/?authToken', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ phoneNumber })
			});
			const data = await response.json();
			try {
				const userCredential = await signInWithCustomToken(auth, data.customToken);
				await getUser(userCredential);
				toast.push(`Xoş gəldiniz ${userCredential.user.displayName ?? ''}!`, {
					duration: 2000,
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgb(91 144 77)',
						'--toastBarBackground': '#1d5b3c'
					}
				});
				dataLoading.set(false);
				disabled = false;
				closeModal();
				return;
			} catch (error) {
				console.error('Error logging in:', error);
				dataLoading.set(false);
				disabled = false;
				return;
			}
		}
		await signInWithEmailAndPassword(auth, email, password)
			.then(async (result) => {
				const { user }: UserCredential = result;
				localStorage.setItem('user', JSON.stringify(user));
				await getUser(result);
				toast.push(`Xoş gəldiniz ${result.user.displayName ?? ''}!`, {
					duration: 2000,
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgb(91 144 77)',
						'--toastBarBackground': '#1d5b3c'
					}
				});
				closeModal();
			})
			.catch((error) => {
				disabled = false;
				showError = true;
				dataLoading.set(false);
				return error;
			});
	}

	async function loginWithGoogle() {
		try {
			await signInWithRedirect(auth, provider);
		} catch (error) {
			console.error('Error logging in with Google', error);
		}
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

<div class="login-form" style="max-width: 100%; overflow-x:hidden">
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
		<form on:submit={login}>
			<h5 class="text-center mb-0">
				{type == 'login' ? $_('login.login_header') : $_('login.register')}
			</h5>
			{#if type == 'register'}
				<input
					class="form-control"
					style="padding: .5rem; min-width: 300px"
					bind:value={displayName}
					type="text"
					placeholder={$_('login.name_surname')}
					required
				/>
			{/if}
			{#if method == 'email'}
				<input
					class="form-control"
					style="padding: .5rem; min-width: 300px"
					bind:value={email}
					type="text"
					placeholder={$_('login.email')}
					required
				/>
			{:else if method == 'mobile'}
				<input
					class="form-control"
					style="padding: .5rem; min-width: 300px"
					bind:value={phoneNumber}
					type="number"
					placeholder={$_('login.mobile')}
					required
				/>
			{/if}
			<input
				class="form-control"
				style="padding: .5rem;"
				bind:value={password}
				type="password"
				placeholder={$_('login.pass')}
				required
			/>
			{#if showError}
				<span style="color:#c40f0f">{$_('login.error')} <br />{$_('login.try_again')}</span>
			{/if}
			<button
				class="btn"
				id="btnLogin"
				{disabled}
				type="submit"
				style="padding: 0.5rem;
			border-radius: 10px;
			background: var(--primaryColor);
			color: white;
			border: 0px;
			font-size: 1.05rem;
			cursor: pointer;"
				>{type == 'login' ? $_('login.login') : $_('login.register')}
				{#if $dataLoading}
					<div class="loader"></div>
				{/if}
			</button>
		</form>

		<hr style="margin-top: 1rem" />
		<div style="display: flex; flex-direction: column; gap: 1rem; align-items: center; padding:0">
			<span>{type == 'login' ? $_('login.no_account') : $_('login.yes_account')}</span>
			<button
				on:click={() => (type = type == 'login' ? 'register' : 'login')}
				class="btn btn-outline-primary w-100"
			>
				{type == 'login' ? $_('login.register') : $_('login.login_account')}
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

	/* LOADER */
	.loader {
		width: 25px;
		padding: 8px !important;
		aspect-ratio: 1;
		border-radius: 50%;
		background: #25b09b;
		--_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
		-webkit-mask: var(--_m);
		mask: var(--_m);
		-webkit-mask-composite: source-out;
		mask-composite: subtract;
		animation: l3 1s infinite linear;
		display: inline-block;
		margin-left: 1rem;
		position: absolute;
		right: 3rem;
	}
	@keyframes l3 {
		to {
			transform: rotate(1turn);
		}
	}
</style>
