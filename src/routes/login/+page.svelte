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

	let email: string = '';
	let password: string = '';

	async function loginWithMail() {
		await signInWithEmailAndPassword(auth, email, password)
			.then((result) => {
				const { user }: UserCredential = result;
				session.set({
					loggedIn: true,
					user: {
						displayName: user?.displayName,
						email: user?.email,
						photoURL: user?.photoURL,
						uid: user?.uid
					}
				});
				goto('/');
			})
			.catch((error) => {
				return error;
			});
	}

	async function loginWithGoogle() {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider)
			.then((result) => {
				const { displayName, email, photoURL, uid } = result?.user;
				session.set({
					loggedIn: true,
					user: {
						displayName,
						email,
						photoURL,
						uid
					}
				});

				goto('/');
			})
			.catch((error) => {
				return error;
			});
	}
</script>

<div class="login-form">
	<div>
		<h1
			style="color: #A1C398;
		font-family: math;
		text-align: center;"
		>
			Giriş
		</h1>
		<form on:submit={loginWithMail}>
			<input
				style="padding: .5rem; min-width: 300px"
				bind:value={email}
				type="text"
				placeholder="Email"
			/>
			<input style="padding: .5rem;" bind:value={password} type="password" placeholder="Şifrə" />
			<button
				type="submit"
				style="padding: 0.5rem;
			border-radius: 10px;
			background: #A1C398;
			color: white;
			border: 0px;
			font-size: 1.05rem;
			cursor: pointer;">Daxil Ol</button
			>
		</form>

		<hr style="margin-top: 1rem" />
		<button
			on:click={loginWithGoogle}
			style="margin-block: 0.5rem;
			padding: 0.4rem;
			border-radius: 10px;
			width: 100%;
			background: #4285f4;
			color: white;
			border: 0px;">Google</button
		>
		<div style="display: flex; flex-direction: column; gap: .5rem; align-items: center">
			Hesabınız yoxdur? <a href="/register"> Qeydiyyat</a>
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
