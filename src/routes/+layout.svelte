<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { auth } from '$lib/firebase.client';
	import { formatDate } from '$lib/dateFormatter';
	import Nav from '$lib/Nav.svelte';

	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';
	export let data: LayoutData;

	let loading: boolean = true;
	let currentDate = new Date();
	let userr: any = null;

	onMount(async () => {
		if (browser) {
			userr = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? '') : null;
		}
		setInterval(() => {
			currentDate = new Date();
		}, 60000);

		const user: any = await data.getAuthUser();

		const loggedIn = user ? true : false;

		session.update((cur: any) => {
			loading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false
			};
		});

		// if (!loggedIn) {
		// 	goto('/');
		// }
	});

	function logout() {
		auth
			.signOut()
			.then(() => {
				// loggedIn = false;
				session.set({ user: null });
				localStorage.removeItem('user');
				// Redirect or perform any other actions after logout
				// navigate('/login');
			})
			.catch((error) => {
				console.error('Error logging out:', error);
			});
	}
</script>

<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #a1c398;">
	<div
		class="container-fluid"
		style="display: flex;flex-wrap: inherit;
    align-items: center;
    justify-content: space-between; width:100%"
	>
		<p class="d-flex align-items mb-0 time" style="color: white;">{formatDate(currentDate)}</p>
		<a class="navbar-brand tac-one-regular mx-auto" style="margin-left: auto;" href="./">Docktr</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
			style="position: absolute;
			right: 1rem;
			top: 9px;"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav ml-auto" style="margin-left: auto;">
				<!-- <li class="nav-item active">
					<a class="nav-link" href="./">Ana Səhifə</a>
				</li> -->
				{#if !$session.loggedIn}
					<li class="nav-item">
						<a class="nav-link" href="login">Giriş yap</a>
					</li>
				{:else}
					<li class="nav-item">
						<a class="nav-link" href="./profile">Hesabım</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="./" on:click={logout}>Çıkış</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>

<Nav />

<div>
	<slot />
</div>

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
			display: none !important;
		}
	}
	@media screen and (min-width: 992px) {
		.navbar-collapse {
			flex: none !important;
		}
	}
</style>
