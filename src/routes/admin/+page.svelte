<script lang="ts">
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import DoctorList from '$lib/components/admin/DoctorList.svelte';
	import Contacts from '$lib/components/admin/Contacts.svelte';
	import AwaitingComments from '$lib/components/admin/AwaitingComments.svelte';
	import AiChat from '$lib/components/admin/AiChat.svelte';
	import { dataLoading, hideNav, mobile } from '$lib/store/dataStore';
	import Reviews from '$lib/components/admin/Reviews.svelte';
	import Home from '$lib/components/admin/Home.svelte';
	import UpcomingAppointments from '$lib/components/admin/UpcomingAppointments.svelte';
	import Errors from '$lib/components/admin/Errors.svelte';

	// export let data;
	let pageTitle: string = 'Ana Səhifə';
	let component = Home;
	let isCollapsed = false;

	onMount(async () => {
		hideNav.set(true);
		if ((!$session?.loggedIn || !$session.user?.admin) && !dataLoading) {
			goto('../');
		}
	});

	onDestroy(() => {
		hideNav.set(false);
	});

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}

	async function emailNoti() {
		let body = { to: 'cavidnebi@gmail.com', body: 'salam brad necesen' };
		const response = await fetch('https://tekoplast.az/docktr/api/?emailNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, // Make sure the content type is JSON
			body: JSON.stringify(body) // Convert body to JSON string
		});
	}

	async function smsNoti() {
		let body = { to: '+994502803233', message: 'salam brad necesen' };
		const response = await fetch('https://tekoplast.az/docktr/api/?smsNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, // Make sure the content type is JSON
			body: JSON.stringify(body) // Convert body to JSON string
		});

		const result = await response.json();
		console.log(result);
	}

	async function pushNoti() {
		let body = {
			uid: '1TgHpEOspfZmDhanm8m1XLgm29u1',
			body: 'test message',
			url: 'https://sehiyye.net/messages'
		};
		const response = await fetch('https://sehiyye.net/api/pushNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const result = await response.json();
		console.log(result);
	}

	async function sendNoti() {
		let body = { to: '+994502803233', message: 'salam brad necesen' };
		const response = await fetch('https://tekoplast.az/docktr/api/?wpNotification', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }, // Make sure the content type is JSON
			body: JSON.stringify(body) // Convert body to JSON string
		});

		const result = await response.json();
		console.log(result);
	}
</script>

{#if $session?.loggedIn && $session?.user?.admin}
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
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="d-flex justify-content-center title gap-2 cursor-pointer"
					on:click={() => {
						goto('/');
					}}
				>
					<img
						src="https://ik.imagekit.io/d2nwsj0ktvh/logo_hyRmOQCNQ.png?updatedAt=1722624724577"
						alt="Sehiyye logo"
						style="width: 24px;"
					/>
					<span
						>Səhiyyə<span style="font-size: smaller; color: rgb(0 0 0 / 70%)">.online</span></span
					>
				</div>
				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = Home;
						pageTitle = 'Ana Səhifə';
					}}
					class:active={component == Home}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> home </span>
					<span class="navtext">Ana Səhifə</span>
				</button>
				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = DoctorList;
						pageTitle = 'Həkimlər';
					}}
					class:active={component == DoctorList}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> physical_therapy </span>
					<span class="navtext">Həkimlər</span>
				</button>
				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = UpcomingAppointments;
						pageTitle = 'Randevular';
					}}
					class:active={component == UpcomingAppointments}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> local_library </span>
					<span class="navtext">Randevular</span>
				</button>

				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = Contacts;
						pageTitle = 'Bizimlə Əlaqə';
					}}
					class:active={component == Contacts}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> dialpad </span>
					<span class="navtext">Bizimlə Əlaqə</span>
				</button>
				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = AwaitingComments;
						pageTitle = 'Təsdiq Gözləyən Şərhlər';
					}}
					class:active={component == AwaitingComments}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> comment </span>
					<span class="navtext">Şərh Təsdiq</span>
				</button>
				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = Reviews;
						pageTitle = 'Reviews';
					}}
					class:active={component == Reviews}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> automation </span>
					<span class="navtext">Reviews</span>
				</button>
				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = AiChat;
						pageTitle = 'GPT Chat';
					}}
					class:active={component == AiChat}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> automation </span>
					<span class="navtext">GPT Chat</span>
				</button>
				<button
					class="btn d-flex flex-row align-items-center gap-2"
					on:click={() => {
						component = Errors;
						pageTitle = 'Developer';
					}}
					class:active={component == Errors}
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> api </span>
					<span class="navtext">Developer</span>
				</button>
				<!-- <button
					class="btn d-flex flex-row align-items-center gap-2 mt-auto"
					data-bs-toggle={$mobile ? 'collapse' : ''}
					data-bs-target={$mobile ? '#sideCollapse' : ''}
				>
					<span class="material-symbols-outlined"> settings </span>
					<span class="navtext">Ayarlar</span>
				</button>
				<button class="btn mb-2 d-flex flex-row align-items-center gap-2 cursor-pointer">
					<span class="material-symbols-outlined"> logout </span>
					<span class="navtext">Çıxış</span>
				</button> -->
			</div>
		</div>
		<div class="content" style="background-color: #f8f8f8; min-height: calc(100dvh - 30px)">
			<!-- {#if $selectedUser && component == Chat}
				<button
					class="btn btn-outline-primary mb-3 px-3 d-flex btnClose pcOnly"
					style="width: fit-content; position: absolute; top: 5px;"
					on:click={() => {
						selectedUser.set(null);
					}}
					><span class="material-symbols-outlined">arrow_back_ios</span>
					<span class="s-FdJNS9dGDztw">{$_('actions.back')}</span></button
				>
			{/if} -->
			<h5 class="ps-5 title">
				{pageTitle}
			</h5>
			<button class="btn btn-outline-primary m-3 ms-4" on:click={sendNoti}>WP Notify</button>
			<button class="btn btn-outline-primary m-3 ms-2" on:click={pushNoti}>Push Notify</button>
			<button class="btn btn-outline-primary m-3 ms-2" on:click={smsNoti}>SMS Notify</button>
			<button class="btn btn-outline-primary m-3 ms-2" on:click={emailNoti}>Email Notify</button>
			<div class="container">
				<div class="row p-3" style="max-height: calc(100vh - 47px); overflow-y: scroll;">
					<svelte:component this={component} />
				</div>
			</div>
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
			margin-bottom: 10px;
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
			width: 250px;
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
