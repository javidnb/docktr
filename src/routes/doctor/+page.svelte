<!-- Sidenav.svelte -->
<script lang="ts">
	import Login from '$lib/components/login/Login.svelte';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { logout } from '$lib/firebase.client';
	import { writable } from 'svelte/store';
	import Appointments from '../appointment/Appointments.svelte';
	import { _ } from 'svelte-i18n';
	import { appointmentsLoading, selectedUser } from '$lib/store/dataStore';
	import { goto } from '$app/navigation';
	import Messages from '$lib/components/chat/Messages.svelte';
	import Chat from '$lib/components/chat/Chat.svelte';

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
		<div class="sidenavContainer">
			<button
				class="closebtn btn mobileOnly"
				on:click={toggleCollapse}
				data-bs-toggle="collapse"
				data-bs-target="#sideCollapse"
				aria-expanded="false"
				aria-controls="sideCollapse"
				style="z-index: 999; position: absolute; left: 3px"
			>
				<span class="material-symbols-outlined"> menu </span>
			</button>
			<!-- svelte-ignore a11y-missing-attribute -->
			<div
				class="sidenav flex-column collapse collapse-horizontal"
				id="sideCollapse"
				class:collapsed={isCollapsed}
			>
				<div class="d-flex flex-column sidenavContent">
					<div class="d-flex justify-content-center title gap-2">
						<img
							src="https://ik.imagekit.io/d2nwsj0ktvh/logo_hyRmOQCNQ.png?updatedAt=1722624724577"
							alt="Sehiyye logo"
							style="width: 24px;"
						/>
						<span
							>Səhiyyə<span style="font-size: smaller; color: rgb(0 0 0 / 70%)">.online</span></span
						>
					</div>
					<a class="mt-3 d-flex align-items-center gap-2" href="#">
						<span class="material-symbols-outlined"> home </span>
						<span class="navtext">Görüşlər</span>
					</a>
					<a href="#" class="d-flex align-items-center gap-2">
						<span class="material-symbols-outlined"> mail </span>
						<span class="navtext">Mesajlar</span>
					</a>
					<a href="#" class="d-flex align-items-center gap-2">
						<span class="material-symbols-outlined"> settings </span>
						<span class="navtext">Ayarlar</span>
					</a>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<a on:click={logout} class="mt-auto mb-2 d-flex align-items-center gap-2 cursor-pointer">
						<span class="material-symbols-outlined"> logout </span>
						<span class="navtext">Çıxış</span>
					</a>
				</div>
			</div>
			<div class="content" style="background-color: #f0f0f0; min-height: 100dvh">
				<h5 class="ps-5 title">
					{$_('nav.appointments')}
				</h5>
				<div class="container">
					<div class="row" style="max-height: 100vh; overflow-y: scroll; padding-top: 10px">
						<Appointments />
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div
			class="d-flex flex-column w-100 align-items-center"
			style="height: 100dvh; background: #f0f0f0; "
		>
			<div class="img-responsive">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<img
					src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
					alt="Sehiyye logo"
					style="width: 150px; margin-top: 1rem; cursor: pointer"
					on:click={() => {
						goto('./');
					}}
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
	@import url('https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400..700;1,400..700&display=swap');

	.title {
		background: white;
		color: #749675;
		padding-block: 0.7rem;
		text-align: center;
		box-shadow: 0px 4px 6px -2px rgba(0, 0, 0, 0.1);
		font-family: 'Cabin', sans-serif;
		font-weight: 400;
	}
	.sidenavContent {
		height: 100dvh;
		background-color: white;
		background: rgb(98, 126, 90);
		background: linear-gradient(45deg, rgba(98, 126, 90, 1) 0%, rgba(161, 195, 152, 1) 100%);
		background:
			linear-gradient(45deg, rgb(98 126 90 / 90%) 0%, rgb(161 195 152 / 90%) 100%),
			url(https://tekoplast.az/img/docktrbg.png) center center;
	}
	.sidenav a {
		text-decoration: none;
		color: green;
		padding: 8px 8px 8px 16px;
		text-decoration: none;
		/* font-size: 20px; */
		color: #0f3c22;
		display: block;
		transition: 0.3s;
		font-family: 'Cabin', sans-serif;
	}

	.sidenav a:hover {
		color: #f1f1f1;
	}

	@media screen and (max-width: 992px) {
		.sidenav {
			position: absolute;
			top: 15px;
			left: 0;
			z-index: 99;
			padding-top: 2rem;
		}
		.sidenavContent {
			height: calc(100vh - 47px);
			width: 80vw;
		}
	}
	@media screen and (min-width: 992px) {
		.sidenavContainer {
			display: flex;
		}
		.sidenav {
			display: block;
			width: 190px;
		}
		.content {
			flex: 1;
		}
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
</style>
