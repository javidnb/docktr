<script lang="ts">
	import { logout } from '$lib/firebase.client.js';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { _ } from 'svelte-i18n';

	import ProfDetails from '$lib/components/profile/ProfDetails.svelte';
	import History from '$lib/components/profile/History.svelte';
	import { dataLoading, loginModal, mobile } from '$lib/store/dataStore';
	import Chat from '$lib/components/chat/Chat.svelte';
	import Documents from '$lib/components/profile/Documents.svelte';

	export let data;
	let userEmail: any = '';
	let component: any = ProfDetails;

	$: dataLoading.set($session.user ? false : true);

	onMount(async () => {
		const user: any = await data.getAuthUser();
		if (!user) {
			loginModal.set(true);
			dataLoading.set(false);
		}
		userEmail = user.email;
	});

	let mobileComponent: any = null;

	function changeComponent(comp: any, mobile?: boolean) {
		if (mobile) {
			mobileComponent = comp;
		} else {
			component = comp;
		}
	}

	function handleChangeValue(event: Event) {
		console.log(event);
		changeComponent(Chat);
	}
</script>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		{#if mobileComponent}
			<button
				class="btn mobileOnly"
				style="position: absolute;
				top: 10px;
				left: 1rem;
				color: rgb(213, 228, 209);
				border: 1px solid #ffffff36 !important;
				text-align: center;
				width: 56px;
				padding-left: 20px;
				display: flex; height: 40px"
				class:d-none={!mobileComponent}
				on:click={() => {
					changeComponent(null, true);
				}}><span class="material-symbols-outlined"> arrow_back_ios </span></button
			>
		{/if}
		<h1 class="display-4">{$_('nav.account')}</h1>
	</div>
</section>
{#if $session.loggedIn}
	<section>
		<div class="container mobileCont">
			<div class="row mt-3 pb-5">
				<div class="col-12 col-md-4 col-lg-3">
					{#if !mobileComponent}
						<ul class="list-group pcOnly w-100 h-100 bg-white d-flex" style="min-height: 400px;">
							<button
								class="list-group-item w-100"
								on:click={() => {
									changeComponent(ProfDetails);
								}}
								class:active={component == ProfDetails}
							>
								<span class="material-symbols-outlined"> for_you </span>Hesap Bilgileri
							</button>
							<button
								class="list-group-item w-100"
								on:click={() => {
									changeComponent(History);
								}}
								class:active={component == History}
							>
								<span class="material-symbols-outlined"> history </span>Görüşlərim
							</button>
							<button
								class="list-group-item w-100"
								on:click={() => {
									changeComponent(Documents);
								}}
								class:active={component == Documents}
							>
								<span class="material-symbols-outlined"> draft </span>Analizlərim və Reseptlərim
							</button>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> clinical_notes </span>Həkimlərim
							</li>
							<a
								class="list-group-item mt-auto bg-secondary text-white"
								on:click={logout}
								href="../"
								style="margin: 1rem; border-radius: 10px"
							>
								<span class="material-symbols-outlined"> logout </span>
								<span class="mx-auto" style="padding-right: 1rem;">Hesabdan Çıxış</span>
							</a>
						</ul>
						<div class="d-flex flex-column mobileList mobileOnly w-100">
							<button
								class="card btn btn-outline-primary d-flex flex-row w-100"
								on:click={() => {
									changeComponent(ProfDetails, true);
								}}
							>
								<span class="material-symbols-outlined"> for_you </span>Hesap Bilgileri
							</button>
							<button
								class="card btn btn-outline-primary d-flex flex-row w-100"
								on:click={() => {
									changeComponent(History, true);
								}}
							>
								<span class="material-symbols-outlined"> history </span>Görüşlərim
							</button>
							<button
								class="card btn btn-outline-primary d-flex flex-row w-100"
								on:click={() => {
									changeComponent(Documents, true);
								}}
							>
								<span class="material-symbols-outlined"> draft </span>Analizlərim və Reseptlərim
							</button>
							<li class="card btn btn-outline-primary d-flex flex-row w-100">
								<span class="material-symbols-outlined"> clinical_notes </span>Həkimlərim
							</li>
							<a class="card btn btn-outline-primary d-flex flex-row w-100" href="./admin">
								<span class="material-symbols-outlined"> admin_panel_settings </span>Admin
							</a>
							<a
								class="card btn btn-outline-primary d-flex flex-row w-100rd"
								on:click={logout}
								href="../"
							>
								<span class="material-symbols-outlined"> logout </span>Çıxış
							</a>
						</div>
					{/if}
				</div>

				{#if mobileComponent}
					<div class="col-md-9 col-lg-9 kont px-0 mobileOnly">
						<div class="container">
							<div class="row">
								<div class="col-12 mobileOnly" style="background-color: unset">
									<div class="container">
										<svelte:component this={mobileComponent} on:changeValue={handleChangeValue} />
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="col-md-8 col-lg-9 kont pcOnly">
						<div class="container h-100">
							<div class="row h-100">
								<div class="col pcOnly">
									<svelte:component this={component} on:changeValue={handleChangeValue} />
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>
{:else}
	<div
		class="d-flex w-100 h-100 align-items-center justify-content-center"
		style="min-height: calc(100dvh - 300px);"
	>
		<h6 style="color: gray;">Sehiyye.online</h6>
	</div>
{/if}

<style>
	.kont {
		background-color: #fbfbfb;
		border-radius: 10px;
		padding: 1rem;
		box-shadow: 0px 0px 5px #00000012;
	}
	.list-group {
		border-radius: 10px;
		border: 0px;
		box-shadow: 0px 0px 5px #00000012;
	}
	.list-group-item {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 0px;
		cursor: pointer;
		border-radius: 8px;
	}
	.list-group-item:hover {
		background-color: rgb(161 195 152 / 22%);
	}
	.list-group .active {
		background-color: var(--primaryColor);
		border: 0px;
		font-weight: 450;
		width: 100%;
	}
	@media screen and (max-width: 768px) {
		.list-group {
			border-radius: 0px;
		}
		.mt-3 {
			margin-top: 0 !important;
		}
		.list-group {
			box-shadow: none;
			font-size: large;
		}
		.list-group .active {
			background-color: white;
			color: black;
			font-weight: 400;
		}
		.kont {
			background-color: unset;
			box-shadow: unset;
		}
		.pcOnly {
			display: none !important;
		}
		.mobileList {
			display: inline-flex !important;
			margin-top: 1rem;
			gap: 0.5rem;
		}
		.mobileList > * {
			padding-block: 0.8rem;
			background-color: white;
			color: black;
			gap: 0.3rem;
			box-shadow: 0px 0px 5px #00000012 !important;
		}
	}
	@media screen and (min-width: 768px) {
		.pcOnly {
			display: inline-block;
		}
		.mobileOnly {
			display: none !important;
		}
	}
</style>
