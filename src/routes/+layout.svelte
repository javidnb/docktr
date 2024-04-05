<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase.client';

	import type { LayoutData } from './$types';
	export let data: LayoutData;

	let loading: boolean = true;
	let loggedIn: boolean = false;
	let currentDate = new Date();

	session.subscribe((cur: any) => {
		loading = cur?.loading;
		loggedIn = cur?.loggedIn;
	});

	onMount(async () => {
		const user: any = await data.getAuthUser();

		const loggedIn = !!user && user?.emailVerified;
		session.update((cur: any) => {
			loading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false
			};
		});

		if (loggedIn) {
			goto('/');
		}
	});

	function logout() {
		auth
			.signOut()
			.then(() => {
				loggedIn = false;
				// Redirect or perform any other actions after logout
				// navigate('/login');
			})
			.catch((error) => {
				console.error('Error logging out:', error);
			});
	}
</script>

<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #a1c398;">
	<p class="d-flex align-items mb-0 time" style="color: white;">{currentDate.toLocaleString()}</p>
	<a class="navbar-brand tac-one-regular mx-auto" href="./">Docktr</a>
	<button
		class="navbar-toggler"
		type="button"
		data-toggle="collapse"
		data-target="#navbarText"
		aria-controls="navbarText"
		aria-expanded="false"
		aria-label="Toggle navigation"
	>
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" style="flex: none;" id="navbarText">
		<ul class="navbar-nav ml-auto">
			<li class="nav-item active">
				<a class="nav-link" href="./">Ana Səhifə</a>
			</li>

			{#if !loggedIn}
				<li class="nav-item">
					<a class="nav-link" href="login">İstifadəçi girişi</a>
				</li>
			{:else}
				<li class="nav-item">
					<a class="nav-link" href="./profile">Hesabım</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="./" on:click={logout}>Çıxış</a>
				</li>
			{/if}
		</ul>
	</div>
</nav>

{#if loading}
	<div>Yüklənir...</div>
{:else}
	<div>
		<slot />
	</div>
{/if}

<style type="text/css">
	.tac-one-regular {
		font-family: 'Tac One', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 2rem;
		line-height: 1;
	}
	@media screen and (max-width: 769px) {
		.time {
			display: none!important;;
		}
	}
</style>
