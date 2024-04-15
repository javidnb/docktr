<script lang="ts">
	import { auth } from '$lib/firebase.client';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';
	import { onMount } from 'svelte';

	let email: string = '';
	let password: string = '';
	let disabled: boolean = false;
	let buttonText: string = 'Kayıt ol';

	onMount(async () => {
		if ($session.loggedIn) {
			goto('./profile');
		}
	});

	async function handleRegister() {
		buttonText = 'Bekleyin..';
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

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Kayıt ol</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<div class="register-form">
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<form
					on:submit={handleRegister}
					class="d-flex flex-column p-5"
					style="gap: 1rem; background: #e2e9ef; "
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
				background: var(--primaryColor);
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
