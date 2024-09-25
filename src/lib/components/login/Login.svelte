<script lang="ts">
	import { session } from '$lib/session';
	import { auth, messaging } from '$lib/firebase.client';
	import {
		signInWithEmailAndPassword,
		type UserCredential,
		createUserWithEmailAndPassword,
		updateProfile,
		signInWithCustomToken
	} from 'firebase/auth';
	import { getToken } from 'firebase/messaging';
	import { onMount } from 'svelte';
	import { dataLoading, loginModal, putData, slideIn } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { _ } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import Select from 'svelte-select';
	import { parsePhoneNumber, isValidNumber } from 'libphonenumber-js';
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import PasswordReset from '../profile/PasswordReset.svelte';

	let email: string = '';
	let password: string = '';
	let repeatPassword: string = '';
	let phoneNumber: string = '';
	let whatsappNumber: string = '';
	let displayName: string;
	let disabled = true;
	let showError: boolean = false; // display login error
	let showRecoveryError: boolean = false;
	let showPassRecoveryInput: boolean = false;
	let inputType: string = 'password';
	let numberInput: any;

	export let type: string = 'login';
	let method: string = 'mobile';

	let whatsappNotifications: boolean = false; // enable wp when registering

	let selectItems = [
		{ value: '+994', label: '+994' },
		{ value: '+90', label: '+90' }
	];

	let selecedItem = selectItems[0];

	// on modal close
	$: if ($loginModal == false) {
		disabled = false;
		showError = false;
		type = 'login';
		showPassRecoveryInput = false;
		showRecoveryError = false;
	}

	onMount(() => {
		showError = false;
		if (browser) {
			const asyncFunction = async () => {};
			asyncFunction();
		}
	});

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
					await getUser(user);
					dataLoading.set(false);
					toast.push(`Xoş gəldiniz ${user.user.displayName ?? ''}!`, {
						duration: 2000,
						theme: {
							'--toastColor': 'mintcream',
							'--toastBackground': 'rgb(91 144 77)',
							'--toastBarBackground': '#1d5b3c'
						}
					});
					loginModal.set(false);
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
					loginModal.set(false);
					toast.push(`Xoş gəldiniz ${result.user.displayName ?? ''}!`, {
						duration: 2000,
						theme: {
							'--toastColor': 'mintcream',
							'--toastBackground': 'rgb(91 144 77)',
							'--toastBarBackground': '#1d5b3c'
						}
					});
				})
				.catch((error) => {
					disabled = false;
					showError = true;
					dataLoading.set(false);
					return error;
				});
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
			if (!result) {
				// CREATE NEW USER
				let usr = user.user;
				let data = {
					uid: usr.uid,
					displayName: usr.displayName,
					email: !usr.email.endsWith('@sehiyye.online') ? usr.email : null,
					phoneNumber: usr.email.endsWith('@sehiyye.online')
						? '+' + usr.email.substring(0, usr.email.length - 15)
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

	// PHONE NUMBER INPUT FORMATTING
	function handleInput(event: Event) {
		const target = event.target ? (event.target as HTMLInputElement) : numberInput;
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

	let confimationCode: string | null = null;
	let uid: string | null = null;
	let changePassword: boolean = false;
	async function passRecovery(confirm?: boolean) {
		dataLoading.set(true);
		showRecoveryError = false;
		let body: any;
		if (confirm) {
			body = { code: confimationCode, uid };
		} else {
			body = { getToken: true };
			if (method == 'mobile') {
				body.phoneNumber = parsePhoneNumber(selecedItem.value + phoneNumber).number;
			} else {
				body.email = email;
			}
		}
		const response = await fetch('https://sehiyye.net/api/authToken', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		const result = await response.json();
		console.log(result);
		if (result.success) {
			if (confirm) {
				await signInWithCustomToken(auth, result.success);
				changePassword = true;
			} else {
				uid = result.uid;
				showPassRecoveryInput = true;
			}
		}
		if (result.noUser || result.error) {
			showRecoveryError = true;
		}

		dataLoading.set(false);
	}
</script>

<div class="login-form" style="max-width: 100%; overflow-x:hidden; transition-duration: .2s">
	<div class="formContainer">
		<h5
			class="text-center my-0"
			style="padding-block: .5rem;
				background: white;
				box-shadow: 0px 0px 6px #0000000a;
				border-radius: 6px;
				color: #465543;"
		>
			{type == 'login'
				? $_('login.login_header')
				: type == 'pass_recovery'
					? $_('login.forgot_pass')
					: $_('login.register')}
		</h5>
		{#if !showPassRecoveryInput}
			<div class="d-flex flex-wrap px-0 gap-2 socials w-100" style="padding: 1rem 1.5rem;">
				<button
					on:click={() => {
						method = 'mobile';
						phoneNumber = '';
						email = '';
						password = '';
						disabled = true;
						showError = false;
						showRecoveryError = false;
					}}
					class="btn btn-outline-primary d-flex flex-row gap-2"
					class:active={method == 'mobile'}
					><span class="material-symbols-outlined icon-fill"> call </span>
					<span class="mx-auto" style="white-space: nowrap;">Mobil Nömrə</span>
				</button>
				<button
					on:click={() => {
						method = 'email';
						phoneNumber = '';
						email = '';
						password = '';
						disabled = true;
						showError = false;
						showRecoveryError = false;
					}}
					style="min-width: 150px"
					class="btn btn-outline-primary bg-white d-flex flex-row gap-2"
					class:active={method == 'email'}
					><span class="material-symbols-outlined icon-fill"> mail </span>
					<span class="mx-auto">Email</span>
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
							on:change={handleInput}
						></Select>
						<div class="form-floating p-0">
							<input
								class="form-control"
								style="margin-left: -5px; width: calc(100% + 5px)"
								bind:value={phoneNumber}
								on:input={handleInput}
								type="text"
								placeholder={$_('login.mobile')}
								required
								id="phoneInput"
								bind:this={numberInput}
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
				{#if type !== 'pass_recovery'}
					<div class="form-floating p-0" style="z-index: 0;">
						{#if inputType == 'password'}
							<input
								class="form-control"
								bind:value={password}
								type="password"
								placeholder={$_('login.pass')}
								required
								id="passwInput"
							/>
						{:else}
							<input
								class="form-control"
								bind:value={password}
								type="text"
								placeholder={$_('login.pass')}
								required
								id="passwInput"
							/>
						{/if}
						<label for="passwInput" style="color: gray">{$_('login.pass')}</label>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<span
							class="material-symbols-outlined"
							style="position: absolute; right: 10px; top: 17px; cursor: pointer"
							on:click={() => {
								if (inputType == 'password') {
									inputType = 'text';
								} else {
									inputType = 'password';
								}
							}}
						>
							{inputType == 'password' ? 'visibility' : 'visibility_off'}
						</span>
					</div>
					{#if type == 'register'}
						<div class="form-floating p-0" style="z-index: 0;">
							{#if inputType == 'password'}
								<input
									class="form-control"
									bind:value={repeatPassword}
									type="password"
									placeholder="Şifrəni Təkrarla"
									required
									id="passwInput"
								/>
							{:else}
								<input
									class="form-control"
									bind:value={repeatPassword}
									type="text"
									placeholder="Şifrəni Təkrarla"
									required
									id="passwInput"
								/>
							{/if}
							<label for="passwInput" style="color: gray">Şifrəni Təkrarla</label>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<span
								class="material-symbols-outlined"
								style="position: absolute; right: 10px; top: 17px; cursor: pointer"
								on:click={() => {
									if (inputType == 'password') {
										inputType = 'text';
									} else {
										inputType = 'password';
									}
								}}
							>
								{inputType == 'password' ? 'visibility' : 'visibility_off'}
							</span>
						</div>
					{/if}
				{/if}
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
									style="margin-left: -5px; width: calc(100% + 5px)"
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
				{#if type == 'pass_recovery'}
					<button
						on:click|preventDefault={() => passRecovery()}
						class="btn d-flex align-items-center"
						style="padding: 0.5rem;
							border-radius: 10px;
							background: var(--primaryColor);
							color: white;
							border: 0px;
							font-size: 1.05rem;
							cursor: pointer;"
						disabled={$dataLoading ||
							(method == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
							(method == 'mobile' && !isValidNumber(selecedItem.value + phoneNumber))}
					>
						<span class="material-symbols-outlined"> chevron_right </span>
						<span class="mx-auto">Sorğu göndər</span>
						{#if $dataLoading}
							<div class="loader"></div>
						{/if}
					</button>
					{#if showRecoveryError}
						<span style="color:#c40f0f"
							>{uid ? 'Xətalı kod, yenidən cəhd edin' : 'İstifadəçi tapılmadı'}</span
						>
						<span>Hesabınıza bərpa edə bilməzsəniz,</span>
						<button
							class="btn btn-outline-primary d-flex align-items-center justify-content-center"
							on:click|preventDefault={() => {
								loginModal.set(false);
								goto('/contact');
							}}
						>
							Bizə yazın
						</button>
					{/if}
				{:else}
					<button
						class="btn"
						id="btnLogin"
						disabled={disabled ||
							password.length < 6 ||
							(type == 'register' && (!displayName || displayName.length < 3)) ||
							(type == 'register' && password != repeatPassword)}
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
					{#if type == 'login'}
						<button
							class="btn p-0"
							style="color: var(--primaryText)"
							on:click|preventDefault={() => {
								type = 'pass_recovery';
								showError = false;
							}}>{$_('login.forgot_pass')}</button
						>
					{/if}
				{/if}
			</form>
		{:else}
			<div class="mt-2 px-0" in:slideIn>
				{#if changePassword}
					<PasswordReset />
				{:else}
					<span>6 rəqəmli kodu daxil edin</span>
					<input
						bind:value={confimationCode}
						type="text"
						class="form-control mt-3"
						style="min-width: 250px;"
						maxlength="6"
					/>
					<button
						on:click|preventDefault={() => passRecovery(true)}
						disabled={$dataLoading || confimationCode?.length != 6}
						class="btn btn-primary mt-3 w-100"
					>
						<span>Daxil et</span>
						{#if $dataLoading}
							<div class="loader"></div>
						{/if}
					</button>
				{/if}
			</div>

			{#if showRecoveryError}
				<div class="d-flex flex-column gap-1 p-0">
					<span style="color:#c40f0f; text-align: center"
						>{@html uid ? 'Xətalı kod<br/>Kodu düzgün daxil edin' : 'İstifadəçi tapılmadı'}</span
					>
					<button
						class="btn btn-outline-primary d-flex align-items-center justify-content-center mt-3 mb-1"
						on:click|preventDefault={() => {
							loginModal.set(false);
							goto('/contact');
						}}
					>
						Bizə yazın
					</button>
				</div>
			{/if}
		{/if}

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
				on:click={() => {
					type = type == 'login' ? 'register' : 'login';
					showPassRecoveryInput = false;
				}}
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

	.formContainer {
		background-color: #f7f7f7;
		padding: 1.5rem 2rem;
		margin-top: 0;
		max-width: 100%;
		overflow-x: hidden;
	}

	@media screen and (max-width: 768px) {
		.formContainer {
			padding: 15px !important;
		}
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
