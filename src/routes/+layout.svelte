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

<div class="nav">
	<div class="brand">
		<h3>Docktr</h3>
	</div>
	<div class="navContent">
		<a href="./">Ana Səhifə</a>
		{#if !loggedIn}
			<a href="login">İstifadəçi girişi</a>
		{:else}
			<a href="./profile">Hesabım</a>
			<a href="./" on:click={logout}>Çıxış</a>
		{/if}
	</div>
</div>

{#if loading}
	<div>Yüklənir...</div>
{:else}
	<div>
		<slot />
	</div>
{/if}

<style type="text/css">
	.nav {
		display: flex;
		background: #a1c398;
		color: white;
		justify-content: space-between;
		font-family: math;
		padding-inline: 2rem;
		align-items: center;
		border-radius: 20px;
		box-shadow: 1px 1px 2px 2px #00000017;
	}

	.nav .navContent {
		display: flex;
		font-size: 1.15rem;
	}

	.navbar-brand * {
		font-size: 1.3rem;
		padding-block: 1rem;
		margin: 0;
	}

	.nav a {
		color: #fefded;
		text-decoration: none;
		padding: 1rem;
	}

	.nav a:hover {
		background-color: rgba(0, 0, 0, 0.432);
	}
</style>
