<!-- Sidenav.svelte -->
<script lang="ts">
	import Login from '$lib/components/login/Login.svelte';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { logout } from '$lib/firebase.client';
	import { writable } from 'svelte/store';
	import Appointments from '../appointment/Appointments.svelte';
	import { _ } from 'svelte-i18n';
	import { appointmentsLoading } from '$lib/store/dataStore';

	let isCollapsed = false;
	export let data;
	let dataLoading = writable(true);
	let usr: any;

	onMount(() => {
		fetchData();
	});

	async function fetchData() {
		dataLoading.set(true);
		try {
			usr = await data.getAuthUser();
		} finally {
			if (!usr) appointmentsLoading.set(false);
		}
	}

	// $: if ($appointmentsLoading == false) dataLoading.set(false);

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}
</script>

{#if !$appointmentsLoading}
	{#if $session.loggedIn && $session?.user?.doctor}
		<div>
			<!-- svelte-ignore a11y-missing-attribute -->
			<div class="sidenav pt-5 d-flex flex-column" class:collapsed={isCollapsed}>
				<a href="javascript:void(0)" class="closebtn" on:click={toggleCollapse}> &times; </a>

				<a class="mt-3 d-flex align-items-center gap-2" href="#">
					<span class="material-symbols-outlined"> home </span>
					<span>Home</span>
				</a>
				<a href="#" class="d-flex align-items-center gap-2">
					<span class="material-symbols-outlined"> home </span>
					<span>Profile</span>
				</a>
				<a href="#" class="d-flex align-items-center gap-2">
					<span class="material-symbols-outlined"> home </span>
					<span>Settings</span>
				</a>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<a on:click={logout} class="mt-auto mb-2 d-flex align-items-center gap-2 cursor-pointer">
					<span class="material-symbols-outlined"> logout </span>
					<span>Çıxış</span>
				</a>
			</div>
			<div class="content" style="background-color: #f0f0f0; min-height: 100dvh">
				<div class="container">
					<h5>{$_('nav.appointments')}</h5>
					<Appointments />
				</div>
			</div>
		</div>
	{:else}
		<div
			class="d-flex flex-column w-100 align-items-center"
			style="height: 100dvh; background: #f0f0f0"
		>
			<div class="img-responsive">
				<img
					src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
					alt="Sehiyye logo"
					style="width: 150px; margin-top: 1rem"
				/>
			</div>

			<div class="my-auto">
				<Login></Login>
			</div>
		</div>
	{/if}
{:else}
	<div
		class="d-flex flex-column justify-content-center align-items-center w-100 no-scrollbar"
		style="height: 100dvh; max-height: 100dvh; overflow-y: hidden; background: #f0f0f0"
	>
		<img
			src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
			alt="Sehiyye logo"
			style="width: 150px; margin-top: 1rem"
		/>
		<div class="d-flex flex-column justify-content-center align-items-center my-auto">
			<div class="lds-ellipsis mt-auto">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<!-- <span style="color: gray; margin-top: -20px; margin-bottom: 2rem">Yüklənir ..</span> -->
		</div>
	</div>
{/if}

<style>
	.sidenav {
		height: 100%;
		width: 250px;
		position: fixed;
		top: 0;
		left: 0;
		background: rgb(98, 126, 90);
		background: linear-gradient(45deg, rgba(98, 126, 90, 1) 0%, rgba(161, 195, 152, 1) 100%);
		background:
			linear-gradient(45deg, rgb(98 126 90 / 90%) 0%, rgb(161 195 152 / 90%) 100%),
			url(https://tekoplast.az/img/docktrbg.png) center center;
		overflow-x: hidden;
		transition: 0.5s;
		padding-top: 20px;
	}

	.sidenav a {
		padding: 8px 8px 8px 16px;
		text-decoration: none;
		font-size: 20px;
		color: #0f3c22;
		display: block;
		transition: 0.3s;
	}

	.sidenav a:hover {
		color: #f1f1f1;
	}

	.sidenav .closebtn {
		position: absolute;
		top: 0;
		right: 25px;
		font-size: 36px;
		margin-left: 50px;
	}

	.collapsed {
		width: 80px;
	}

	.collapsed .closebtn {
		margin-right: 6px;
	}

	.collapsed a {
		text-align: center;
		font-size: 18px;
		padding-inline: 0;
		justify-content: center;
	}

	.collapsed a span {
		display: none;
	}

	.collapsed .material-symbols-outlined {
		display: flex;
		justify-content: center;
		padding-inline: 0;
	}

	.collapsed a .material-symbols-outlined {
		font-size: 25px;
	}

	.content {
		margin-left: 250px; /* Adjust according to the width of your sidenav */
		padding: 20px;
		flex-grow: 1;
		transition: margin-left 0.5s;
	}

	.collapsed ~ .content {
		margin-left: 80px; /* Adjust according to the width of your collapsed sidenav */
	}

	.lds-ellipsis,
	.lds-ellipsis div {
		box-sizing: border-box;
		color: var(--primaryColor);
	}
	.lds-ellipsis {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-ellipsis div {
		position: absolute;
		top: 33.33333px;
		width: 13.33333px;
		height: 13.33333px;
		border-radius: 50%;
		background: currentColor;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}

	.no-scrollbar ::-webkit-scrollbar {
		width: 6px;
		background: transparent;
		display: none;
		transition: 0.3s ease;
	}
</style>
