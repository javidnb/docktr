<!-- Sidenav.svelte -->
<script lang="ts">
	import Login from '$lib/components/login/Login.svelte';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { logout } from '$lib/firebase.client';
	import { writable } from 'svelte/store';
	import Appointments from '../appointments/Appointments.svelte';
	import { _ } from 'svelte-i18n';
	import {
		appointmentsLoading,
		selectedUser,
		joinVideoCall,
		mobile,
		appointments
	} from '$lib/store/dataStore';
	import { goto } from '$app/navigation';
	import History from '$lib/components/profile/History.svelte';
	import Chat from '$lib/components/chat/Chat.svelte';
	import Documents from '$lib/components/profile/Documents.svelte';
	import ContactForm from '../contact/ContactForm.svelte';

	let component = Appointments;
	let isCollapsed = false;
	export let data;
	let pageTitle: string = $_('nav.appointments');
	let dataLoading = writable(true);
	let usr: any;

	onMount(() => {
		appointmentsLoading.set(true);
		if (data.user) {
			dataLoading.set(true);
		} else {
			appointmentsLoading.set(false);
			dataLoading.set(false);
		}
		// fetchData();
	});

	$: if ($appointments?.length) {
		dataLoading.set(false);
	}

	// async function fetchData() {
	// 	dataLoading.set(true);
	// 	try {
	// 		usr = await data.getAuthUser();
	// 	} finally {
	// 		if (!usr) appointmentsLoading.set(false);
	// 	}
	// }

	$: if (!$joinVideoCall && (component == Appointments || component == Chat)) {
		if ($selectedUser) component = Chat;
		else component = Appointments;
	}

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}
</script>

{#if !$dataLoading}
	{#if $session.loggedIn && $session?.user?.doctor}
		<div class="sidenavContainer">
			<button
				class="closebtn btn mobileOnly"
				on:click={toggleCollapse}
				data-bs-toggle="collapse"
				data-bs-target="#sideCollapse"
				aria-expanded="false"
				aria-controls="sideCollapse"
				style="z-index: 999;
					position: absolute;
					right: 1rem;
					top: 10px;
					color: rgb(213, 228, 209);
					border: 1px solid rgba(255, 255, 255, 0.21) !important;
					height: 38px;
					box-shadow: 0px 0px 5px 0px #a1c398a1"
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
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<img
							src="https://ik.imagekit.io/d2nwsj0ktvh/logo_hyRmOQCNQ.png?updatedAt=1722624724577"
							alt="Sehiyye logo"
							style="width: 24px;"
							on:click={() => {
								goto('/');
							}}
						/>
						<span
							>Səhiyyə<span style="font-size: smaller; color: rgb(0 0 0 / 70%)">.online</span></span
						>
					</div>
					<button
						class="btn d-flex flex-row align-items-center gap-2"
						on:click={() => {
							component = Appointments;
							pageTitle = $_('nav.appointments');
							selectedUser.set(null);
						}}
						class:active={component == Appointments}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#sideCollapse' : ''}
					>
						<span class="material-symbols-outlined"> home </span>
						<span class="navtext">Görüşlər</span>
					</button>
					<button
						class="btn d-flex flex-row align-items-center gap-2"
						on:click={() => {
							component = Documents;
							pageTitle = $_('doctor.documents');
						}}
						class:active={component == Documents}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#sideCollapse' : ''}
					>
						<span class="material-symbols-outlined"> draft </span>
						<span class="navtext">{$_('doctor.documents')}</span>
					</button>
					<button
						class="btn d-flex flex-row align-items-center gap-2"
						on:click={() => {
							component = History;
							pageTitle = $_('doctor.history');
						}}
						class:active={component == History}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#sideCollapse' : ''}
					>
						<span class="material-symbols-outlined"> history </span>
						<span class="navtext">{$_('doctor.history')}</span>
					</button>
					<button
						class="btn d-flex flex-row align-items-center gap-2"
						on:click={() => {
							component = ContactForm;
							pageTitle = $_('nav.contact');
						}}
						class:active={component == ContactForm}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#sideCollapse' : ''}
					>
						<span class="material-symbols-outlined"> mail </span>
						<span class="navtext">{$_('nav.contact')}</span>
					</button>
					<button
						class="btn d-flex flex-row align-items-center gap-2 mt-auto"
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#sideCollapse' : ''}
					>
						<span class="material-symbols-outlined"> settings </span>
						<span class="navtext">Ayarlar</span>
					</button>
					<button
						on:click={() => {
							logout();
						}}
						class="btn mb-2 d-flex flex-row align-items-center gap-2 cursor-pointer"
					>
						<span class="material-symbols-outlined"> logout </span>
						<span class="navtext">Çıxış</span>
					</button>
				</div>
			</div>
			<div class="content" style="background-color: #f8f8f8; min-height: 100dvh">
				{#if $selectedUser && component == Chat}
					<button
						class="btn btn-outline-primary mb-3 px-3 d-flex btnClose pcOnly"
						style="width: fit-content; position: absolute; top: 5px;"
						on:click={() => {
							selectedUser.set(null);
						}}
						><span class="material-symbols-outlined">arrow_back_ios</span>
						<span class="s-FdJNS9dGDztw">{$_('actions.back')}</span></button
					>
				{/if}
				<h5 class="ps-5 title">
					{pageTitle}
				</h5>
				<div class="container">
					<div class="row pt-2" style="max-height: 100vh; overflow-y: scroll;">
						<svelte:component this={component} />
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
				<button
					class="btn"
					on:click={() => {
						goto('./');
					}}
				>
					<img
						src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
						alt="Sehiyye logo"
						style="width: 150px; margin-top: 1rem; cursor: pointer"
					/>
				</button>
			</div>

			{#if !$dataLoading || !$appointmentsLoading}
				<div class="my-auto">
					<Login></Login>
				</div>
			{/if}
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
		background: #95af8e;
		color: white;
		padding-block: 0.7rem;
		text-align: center;
		box-shadow: 0px 4px 6px -2px rgba(0, 0, 0, 0.1);
		font-family: 'Cabin', sans-serif;
		font-weight: 400;
		margin-bottom: 0;
	}

	.btnClose:not(:hover) {
		background-color: #00000024;
		color: white;
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

	.sidenav .btn {
		border: 0 !important;
		padding: 0.55rem;
	}

	.sidenav .btn:hover,
	.sidenav .btn:focus,
	.sidenav .btn:active,
	.sidenav .active {
		background-color: rgba(0, 0, 0, 0.25);
		color: #f1f1f1;
		border-radius: 0;
	}

	@media screen and (max-width: 992px) {
		.title {
			height: 58px;
			align-items: center;
			display: flex;
			justify-content: center;
			padding-left: 0 !important;
		}
		.sidenav {
			position: absolute;
			top: 14px;
			left: 0;
			z-index: 99;
			padding-top: 44px;
		}
		.sidenavContent {
			height: calc(100vh - 59px);
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
