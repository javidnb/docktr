<script lang="ts">
	import { session } from '$lib/session';
	import { auth, messaging } from '$lib/firebase.client';
	import {
		signInWithEmailAndPassword,
		type UserCredential,
		type ConfirmationResult,
		createUserWithEmailAndPassword,
		updateProfile
	} from 'firebase/auth';
	import { getToken } from 'firebase/messaging';
	import { onMount } from 'svelte';
	import {
		dataLoading,
		loginModal,
		putData,
		appointments,
		appointmentsLoading
	} from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { _ } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import Select from 'svelte-select';
	import { parsePhoneNumber, isValidNumber } from 'libphonenumber-js';
	import { goto } from '$app/navigation';

	let email: string = '';
	let password: string = '';
	let phoneNumber: string = '';
	let displayName: string;
	let confirmationNumber: string = '';
	let disabled = true;
	let showError: boolean = false; // display login error
	let showConfimationInput: boolean = false;
	let confResult: ConfirmationResult;

	let type: string = 'login';
	let method: string = 'mobile';

	let selectItems = [
		{ value: '+994', label: '+994' },
		{ value: '+90', label: '+90' }
	];

	let selecedItem = selectItems[0];

	$: if ($loginModal == false) {
		disabled = false;
		showError = false;
	}

	onMount(() => {
		showError = false;
		showConfimationInput = false;
		if (browser) {
			const asyncFunction = async () => {};
			asyncFunction();
		}

		// if ($session.loggedIn) {
		// 	goto('./profile');
		// }
	});

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
			session.set({
				user: userData,
				loggedIn: true,
				loading: false
			});
			dataLoading.set(false);
			registerCM();
		} else {
			console.error('Failed to post data');
			dataLoading.set(false);
		}
	}

	async function getUser(user: any) {
		document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${7 * 24 * 60 * 60}`;
		try {
			let time = new Date().getTime();
			const response = await fetch(
				`https://tekoplast.az/docktr/api/?user&id=${user.user.uid}&t=${time}`
			);
			const result = await response.json();
			if (result?.doctor) goto('./doctor');
			if (!result) {
				let usr = user.user;
				let data = {
					uid: usr.uid,
					displayName: usr.displayName,
					email: !usr.email.endsWith('@sehiyye.online') ? usr.email : null,
					phoneNumber: usr.email.endsWith('@sehiyye.online')
						? usr.email.substring(0, usr.email.length - 15)
						: null,
					photoURL: usr?.photoURL,
					fcmToken: usr?.fcmToken || null
				};
				postData(data);
				dataLoading.set(false);
				return;
			} else {
				session.set({
					user: result,
					loggedIn: true,
					loading: false
				});
				dataLoading.set(false);
				getAppointments(result);
				registerCM();
			}
			return response;
		} catch (error) {
			console.error(error);
			dataLoading.set(false);
		}
	}

	async function login() {
		dataLoading.set(true);
		disabled = true;
		showError = false;

		// MOBILE NUMBER LOGIN
		if (method == 'mobile') {
			const country = selecedItem.value == '+994' ? 'AZ' : 'TR';
			email = parsePhoneNumber(phoneNumber, country).number.slice(1) + '@sehiyye.online';
		}
		// EMAIL LOGIN
		if (type == 'register') {
			createUserWithEmailAndPassword(auth, email, password)
				.then(async (userCredential: UserCredential) => {
					// Signed up
					const user = userCredential;
					updateProfile(user.user, { displayName });
					dataLoading.set(false);
					await getUser(user);
					toast.push(`Xoş gəldiniz ${user.user.displayName ?? ''}!`, {
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
					dataLoading.set(false);
					const errorCode = error.code;
					const errorMessage = error.message;
					// ..
				});
		} else {
			await signInWithEmailAndPassword(auth, email, password)
				.then(async (result) => {
					const { user }: UserCredential = result;
					dataLoading.set(false);
					closeModal();
					toast.push(`Xoş gəldiniz ${result.user.displayName ?? ''}!`, {
						duration: 2000,
						theme: {
							'--toastColor': 'mintcream',
							'--toastBackground': 'rgb(91 144 77)',
							'--toastBarBackground': '#1d5b3c'
						}
					});
					await getUser(result);
				})
				.catch((error) => {
					disabled = false;
					showError = true;
					dataLoading.set(false);
					return error;
				});
		}
	}

	// REGISTER FOR PUSH NOTIFICATIONS
	function registerCM() {
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
								let tokens: any = $session.user?.fcmToken
									? JSON.parse($session.user?.fcmToken)
									: [];

								if (!tokens?.includes(currentToken) && $session.user?.uid) {
									tokens.push(currentToken);
									await putData('users', 'uid', $session.user?.uid, {
										fcmToken: JSON.stringify(tokens)
									});
								}
							} else {
								console.log('error');
							}
						})
						.catch((err) => {
							console.log(err);
						});
				}
			});
	}

	// RETRIEVE EXISTING APPOINTMENTS OF LOGGED IN USER
	async function getAppointments(user: any) {
		try {
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
				appointmentsLoading.set(false);
				dataLoading.set(false);
				return null;
			}
			return response;
		} catch (error) {
			console.error(error);
			appointmentsLoading.set(false);
			dataLoading.set(false);
			return null;
		}
	}

	function confirm(event: any) {
		event.target.disabled = true;
		event.target.innerText = $_('actions.wait');
		confResult
			.confirm(confirmationNumber)
			.then(async (result) => {
				// User signed in successfully.
				const user = result.user;
				await getUser(result);
				toast.push(`Xoş gəldiniz ${result.user.displayName ?? ''}!`, {
					duration: 2000,
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgb(91 144 77)',
						'--toastBarBackground': '#1d5b3c'
					}
				});
				showConfimationInput = false;
				showError = false;
				closeModal();
			})
			.catch((error) => {
				console.log(error);
				event.target.disabled = false;
				event.target.innerText = $_('actions.confirm');
				showError = true;
			});
	}

	function closeModal() {
		loginModal.set(false);
		disabled = false;
		showError = false;
		showConfimationInput = false;
	}

	// PHONE NUMBER INPUT FORMATTING
	function handleInput(event: Event) {
		if (method == 'mobile') {
			const target = event.target as HTMLInputElement;
			target.value = target.value.replace(/[^0-9]/g, '');
			phoneNumber = target.value;
		}

		if (phoneNumber.length > 3) {
			const country = selecedItem.value == '+994' ? 'AZ' : 'TR';
			let num = parsePhoneNumber(phoneNumber, country);
			if (num.isValid()) {
				phoneNumber = num.formatNational().slice(1);
				disabled = false;
			} else {
				disabled = true;
			}
		}
	}

	// ANIMATION
	function scaleFade(node: HTMLElement, { duration = 70 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => {
				const scale = 1.05 - 0.05 * t; // from 1.1 to 1
				const opacity = t; // from 0 to 1
				const x = -100 + 100 * t;
				return `
				 	transform: scale(${scale});					
                    opacity: ${opacity};
                `;
			}
		};
	}
</script>

<div class="login-form" style="max-width: 100%; overflow-x:hidden">
	<div class="col pb-4" style="margin-top: 0; padding-top:0">
		<div class="d-flex px-0 gap-2 socials w-100" style="padding: 1.5rem;">
			<button
				on:click={() => {
					method = 'mobile';
					phoneNumber = '';
					email = '';
					password = '';
					disabled = true;
					showError = false;
				}}
				class="btn btn-outline-primary d-flex justify-content-center"
				class:active={method == 'mobile'}
				><span class="material-symbols-outlined icon-fill"> call </span></button
			>
			<button
				on:click={() => {
					method = 'email';
					phoneNumber = '';
					email = '';
					password = '';
					disabled = true;
					showError = false;
				}}
				class="btn btn-outline-primary bg-white d-flex justify-content-center"
				class:active={method == 'email'}
				><span class="material-symbols-outlined icon-fill"> mail </span></button
			>
		</div>
		<form on:submit={login}>
			<h5
				class="text-center mb-0"
				style="padding-block: .5rem;
				background: white;
				box-shadow: 0px 0px 6px #0000000a;
				border-radius: 6px;
				color: #465543;"
			>
				{type == 'login' ? $_('login.login_header') : $_('login.register')}
			</h5>
			{#if type == 'register'}
				<div class="form-floating p-0">
					<input
						class="form-control"
						style="min-width: 300px"
						bind:value={displayName}
						type="text"
						placeholder={$_('login.name_surname')}
						required
						id="nameInput"
					/>
					<label for="nameInput" style="color: gray">{$_('login.name_surname')}</label>
				</div>
			{/if}
			{#if method == 'email'}
				<div class="form-floating p-0">
					<input
						class="form-control"
						bind:value={email}
						on:input={() => {
							if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
								disabled = false;
							} else {
								disabled = true;
							}
						}}
						type="text"
						placeholder={$_('login.email')}
						required
						id="emailInput"
						style="min-width: 270px"
					/>
					<label for="emailInput" style="color: gray">{$_('login.email')}</label>
				</div>
			{:else if method == 'mobile'}
				{#if !showConfimationInput}
					<div class="p-0 input-group">
						<!-- {#if type != 'register'}
							{#if selecedItem.value == '+994'}
								<div class="d-flex p-1 align-items-center">
									<img
										style="width:30px;height:30px"
										src="https://ik.imagekit.io/d2nwsj0ktvh/img/az.png"
										alt="Azerbaijan Flag"
									/>
								</div>
							{:else}
								<div class="d-flex p-1 align-items-center">
									<img
										style="width:30px;height:30px"
										src="https://ik.imagekit.io/d2nwsj0ktvh/turkey_dBbuCptvk.png?updatedAt=1719140350211"
										alt="Turkish Flag"
									/>
								</div>
							{/if}
						{/if} -->

						<Select
							class="form-control"
							items={selectItems}
							--width="80px"
							--border-top-left-radius="10px"
							--border-focused="1px solid var(--primaryColor)"
							--item-is-active-bg="var(--primaryColor)"
							--item-hover-bg="#d9e1d7"
							bind:value={selecedItem}
							clearable={false}
						></Select>
						<div class="form-floating p-0">
							<input
								class="form-control"
								style="margin-left: -5px"
								bind:value={phoneNumber}
								on:input={handleInput}
								type="text"
								placeholder={$_('login.mobile')}
								required
								id="phoneInput"
							/>
							<label for="phoneInput" style="color: gray">{$_('login.mobile')}</label>
						</div>
					</div>
				{:else}
					<div class="d-flex flex-column gap-3 p-0" in:scaleFade>
						<input
							class="form-control"
							style="padding: .5rem; min-width: 300px"
							bind:value={confirmationNumber}
							type="number"
							placeholder="123456"
							required
						/>
						<button class="btn btn-outline-primary" on:click|preventDefault={confirm}>
							{$_('actions.confirm')}
						</button>
					</div>
				{/if}
				<!-- <div
					id="recap"
					style="background: white;
					border-radius: 6px;
					padding: 0"
				></div> -->
			{/if}
			<div class="form-floating p-0">
				<input
					class="form-control"
					bind:value={password}
					type="password"
					placeholder={$_('login.pass')}
					required
					id="passwInput"
				/>
				<label for="passwInput" style="color: gray">{$_('login.pass')}</label>
			</div>
			{#if type == 'register'}
				<div
					class="p-0"
					style="min-height: 24px;
							margin-top: -15px;
							margin-bottom: -10px;
							padding-left: 5px !important;"
				>
					{#if !password || password.length < 6}
						<span style="font-size: small; color: gray"
							>Şifrə ən az 6 simvoldar ibarət olmalıdır</span
						>
					{/if}
				</div>
			{/if}
			{#if showError}
				<span style="color:#c40f0f">{$_('login.error')} <br />{$_('login.try_again')}</span>
			{/if}
			{#if !showConfimationInput}
				<button
					class="btn"
					id="btnLogin"
					disabled={disabled ||
						password.length < 6 ||
						(type == 'register' && (!displayName || displayName.length < 3))}
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
			{/if}
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
	.socials .active,
	.socials button:hover {
		background-color: #a5a5a5 !important;
		border-radius: 8px !important;
	}
	.socials .active .material-symbols-outlined {
		color: white !important;
	}
</style>
