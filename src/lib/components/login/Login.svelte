<script lang="ts">
	import { session } from '$lib/session';
	import { auth, messaging } from '$lib/firebase.client';
	import {
		signInWithEmailAndPassword,
		type UserCredential,
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
		appointmentsLoading,
		slideIn
	} from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { _ } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import Select from 'svelte-select';
	import { parsePhoneNumber, isValidNumber } from 'libphonenumber-js';
	import { goto } from '$app/navigation';
	import { slide } from 'svelte/transition';

	let email: string = '';
	let password: string = '';
	let phoneNumber: string = '';
	let whatsappNumber: string = '';
	let displayName: string;
	let disabled = true;
	let showError: boolean = false; // display login error
	let showConfimationInput: boolean = false;

	let type: string = 'login';
	let method: string = 'mobile';

	let whatsappNotifications: boolean = false;

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
			if (!whatsappNotifications) {
				registerCM();
			}
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
			if (result?.doctor) {
				dataLoading.set(false);
				goto('./doctor');
			}
			if (!result) {
				// CREATE NEW USER
				let usr = user.user;
				let data = {
					uid: usr.uid,
					displayName: usr.displayName,
					email: !usr.email.endsWith('@sehiyye.online') ? usr.email : null,
					phoneNumber: usr.email.endsWith('@sehiyye.online')
						? usr.email.substring(0, usr.email.length - 15)
						: null,
					photoURL: usr?.photoURL,
					fcmToken: usr?.fcmToken || null,
					whatsapp: whatsappNotifications
						? (selecedItem.value + whatsappNumber).replace(/\s+/g, '')
						: null
				};
				postData(data);
				dataLoading.set(false);
				return;
			} else {
				console.log(result);
				session.set({
					user: result,
					loggedIn: true,
					loading: false
				});
				dataLoading.set(false);
				getAppointments(result);
				if (!result.whatsapp) {
					registerCM();
				}
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
					showError = true;
					// ..
				});
		} else {
			await signInWithEmailAndPassword(auth, email, password)
				.then(async (result) => {
					session.set({ user: result.user, loggedIn: true });
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
		appointmentsLoading.set(true);
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

	function closeModal() {
		loginModal.set(false);
		disabled = false;
		showError = false;
		showConfimationInput = false;
	}

	// PHONE NUMBER INPUT FORMATTING
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		target.value = target.value.replace(/[^0-9]/g, '');
		if (target.classList?.contains('whatsapp')) {
			whatsappNumber = target.value;
		} else {
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

		if (whatsappNotifications && whatsappNumber.length > 3) {
			const country = selecedItem.value == '+994' ? 'AZ' : 'TR';
			let num = parsePhoneNumber(whatsappNumber, country);
			if (num.isValid()) {
				whatsappNumber = num.formatNational().slice(1);
			}
		}
	}
</script>

<div class="login-form" style="max-width: 100%; overflow-x:hidden">
	<div class="col pb-4" style="margin-top: 0; padding-top:0">
		<h5
			class="text-center mb-0 mt-3"
			style="padding-block: .5rem;
				background: white;
				box-shadow: 0px 0px 6px #0000000a;
				border-radius: 6px;
				color: #465543;"
		>
			{type == 'login' ? $_('login.login_header') : $_('login.register')}
		</h5>
		<div class="d-flex px-0 gap-2 socials w-100" style="padding: 1rem 1.5rem;">
			<button
				on:click={() => {
					method = 'mobile';
					phoneNumber = '';
					email = '';
					password = '';
					disabled = true;
					showError = false;
				}}
				class="btn btn-outline-primary d-flex flex-row justify-content-center gap-2"
				class:active={method == 'mobile'}
				><span class="material-symbols-outlined icon-fill"> call </span>
				<span style="white-space: nowrap;">Mobil Nömrə</span>
			</button>
			<button
				on:click={() => {
					method = 'email';
					phoneNumber = '';
					email = '';
					password = '';
					disabled = true;
					showError = false;
				}}
				style="min-width: 150px"
				class="btn btn-outline-primary bg-white d-flex flex-row justify-content-center gap-2"
				class:active={method == 'email'}
				><span class="material-symbols-outlined icon-fill"> mail </span>
				<span>Email</span>
			</button>
		</div>
		<form on:submit={login}>
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
				<div class="p-0 input-group">
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
				<!-- <div
					id="recap"
					style="background: white;
					border-radius: 6px;
					padding: 0"
				></div> -->
			{/if}
			<div class="form-floating p-0" style="z-index: 0;">
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
					style="margin-top: -15px; margin-bottom: -10px; padding-left: 5px !important; transition-duration: .2s"
				>
					{#if !password || password.length < 6}
						<span
							style="font-size: small; color: gray"
							in:slide={{ duration: 200 }}
							out:slide={{ duration: 200 }}
						>
							Şifrə ən az 6 simvoldan ibarət olmalıdır
						</span>
					{/if}
				</div>

				<div class="d-flex align-items-center gap-2" style="padding: 5px 0px 0px 0px!important">
					<label class="switch">
						<input
							type="checkbox"
							bind:checked={whatsappNotifications}
							on:click={() => {
								whatsappNumber = phoneNumber;
							}}
						/>
						<span class="slider round"></span>
					</label>
					<span>WhatsApp ilə bildiriş al</span>
				</div>
				{#if whatsappNotifications}
					<div class="p-0 input-group" in:slideIn>
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
								class="form-control whatsapp"
								style="margin-left: -5px"
								bind:value={whatsappNumber}
								on:input={handleInput}
								type="text"
								placeholder={$_('login.mobile')}
								required
								id="wpInput"
							/>
							<label for="wpInput" style="color: gray">WhatsApp No</label>
						</div>
					</div>
				{/if}
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
		<div
			style="display: flex;
			flex-direction: column;
			gap: .5rem;
			align-items: center;
			padding: 0;
			margin-top: -.5rem;"
		>
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

	/* Chechbox */
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 28px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 22px;
		width: 26px;
		left: 4px;
		bottom: 3px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: var(--primaryColor);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
