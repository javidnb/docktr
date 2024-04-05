<script lang="ts">
	import { auth } from '$lib/firebase.client';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';

	let email: string = '';
	let password: string = '';
	let disabled: boolean = false;
	let buttonText: string = 'Qeydiyyat';

	async function handleRegister() {
		buttonText = 'Gözləyin..';
		disabled = true;
		await createUserWithEmailAndPassword(auth, email, password)
			.then((result) => {
				const { user } = result;
				session.update((cur: any) => {
					return {
						...cur,
						user,
						loggedIn: true,
						loading: false
					};
				});
				goto('/');
			})
			.catch((error) => {
				throw new Error(error);
			});
	}
</script>

<div class="register-form">
	<div class="container">
		<div class="row justify-content-center mt-5">
			<div class="col-md-6 w-100">
				<form
					on:submit={handleRegister}
					class="d-flex flex-column p-5"
					style="gap: 1rem; background: #ececec; border-radius: 10px"
				>
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
				background: #A1C398;
				color: white;
				border: 0px;
				font-size: 1.05rem;
				cursor: pointer;">{buttonText}</button
					>
				</form>
			</div>
		</div>
	</div>
</div>
