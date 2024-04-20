<script lang="ts">
	// login/+page.svelte
	import { session } from '$lib/session';
	import { auth } from '$lib/firebase.client';
	import {
		GoogleAuthProvider,
		signInWithPopup,
		signInWithEmailAndPassword,
		type UserCredential
	} from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { dataLoading } from '$lib/store/dataStore';
	import firebase from 'firebase/compat/app';

	let email: string = '';
	let password: string = '';
	let buttonText: string = 'Giriş yap';
	let disabled = false;

	onMount(async () => {
		if ($session.loggedIn) {
			goto('./profile');
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
			console.log('Data posted successfully: ', $session);
		} else {
			// Handle error response
			console.error('Failed to post data');
			session.set({
				user: userData,
				loggedIn: true,
				loading: false
			});
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
		buttonText = 'Bekleyin..';
		disabled = true;
		await signInWithEmailAndPassword(auth, email, password)
			.then(async (result) => {
				const { user }: UserCredential = result;
				localStorage.setItem('user', JSON.stringify(user));
				await getUser(result);
				goto('/');
				dataLoading.set(false);
			})
			.catch((error) => {
				dataLoading.set(false);
				return error;
			});
	}

	async function loginWithGoogle() {
		dataLoading.set(true);
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider)
			.then(async (result) => {
				const { displayName, email, photoURL, uid } = result?.user;
				localStorage.setItem('user', JSON.stringify(result?.user));
				await getUser(result);
				goto('/');
				dataLoading.set(false);
			})
			.catch((error) => {
				dataLoading.set(false);
				return error;
			});
	}

	function gogil() {
		const provider = new GoogleAuthProvider();
		firebase
			.auth()
			.signInWithPopup(provider)
			.then((result) => {
				/** @type {firebase.auth.OAuthCredential} */
				var credential = result.credential;

				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = credential?.toJSON;
				console.log(token);
				// The signed-in user info.
				var user = result.user;
				// IdP data available in result.additionalUserInfo.profile.
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// The email of the user's account used.
				var email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				var credential = error.credential;
				// ...
			});
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Giriş Yap</h1>
		<hr />
	</div>
</section>

<div class="login-form">
	<div class="pt-5 pb-4">
		<form on:submit={loginWithMail}>
			<input
				class="form-control"
				style="padding: .5rem; min-width: 300px"
				bind:value={email}
				type="text"
				placeholder="Email"
			/>
			<input
				class="form-control"
				style="padding: .5rem;"
				bind:value={password}
				type="password"
				placeholder="Şifrə"
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
			cursor: pointer;">{buttonText}</button
			>
		</form>

		<hr style="margin-top: 1rem" />
		<button
			class="btn"
			on:click={gogil}
			style="margin-block: 0.5rem;
			padding: 0.4rem;
			border-radius: 10px;
			width: 100%;
			background: #4285f4;
			color: white;
			border: 0px;">Google</button
		>
		<div style="display: flex; flex-direction: column; gap: .5rem; align-items: center">
			Hesabın yok mu? <a href="/register"> Hemen Kaydol</a>
		</div>
	</div>
</div>

<style type="text/css">
	.login-form {
		display: grid;
		place-content: center;
	}

	.login-form div {
		background-color: #ececec;
		border-radius: 10px;
		padding: 1rem 2rem;
		margin-top: 1rem;
	}

	.login-form div form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
