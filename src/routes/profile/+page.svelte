<script lang="ts">
	import { logout } from '$lib/firebase.client.js';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { _ } from 'svelte-i18n';

	import ProfDetails from '$lib/components/profile/ProfDetails.svelte';
	import History from '$lib/components/profile/History.svelte';
	import { dataLoading, loginModal } from '$lib/store/dataStore';
	import Chat from '$lib/components/chat/Chat.svelte';
	import Messages from '$lib/components/chat/Messages.svelte';

	export let data;
	let userEmail: any = '';

	$: dataLoading.set($session.user ? false : true);

	onMount(async () => {
		const user: any = await data.getAuthUser();
		if (!user) {
			loginModal.set(true);
			dataLoading.set(false);
		}
		userEmail = user.email;
	});

	let component = ProfDetails;
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

{#if $session.loggedIn}
	<section>
		<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
			<button
				class="btn mobileOnly"
				style="position: absolute;
			left: 15px;
			top: 9px;
			background: #00000054;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-inline: 14px 5px;
			color: var(--primaryColor);"
				class:d-none={!mobileComponent}
				on:click={() => {
					changeComponent(null, true);
				}}><span class="material-symbols-outlined"> arrow_back_ios </span></button
			>
			<h1 class="display-4">{$_('nav.account')}</h1>
		</div>
	</section>
	<section>
		<div class="container mobileCont">
			<div class="row mt-3 pb-5">
				<div class="col-12 col-md-4 col-lg-3 col-xxl-2">
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
								<span class="material-symbols-outlined"> history </span>Hastalık Geçmişi
							</button>
							<button class="list-group-item w-100">
								<span class="material-symbols-outlined"> draft </span>Dökümanlarım
							</button>
							<button
								class="list-group-item w-100"
								on:click={() => {
									changeComponent(Messages);
								}}
								class:active={component == Messages || component == Chat}
							>
								<span class="material-symbols-outlined"> draft </span>Mesajlar
							</button>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> description </span>Kayıtlarım
							</li>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> medication </span>İlaçlarım
							</li>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> event </span>İlaç hatırlatıcı
							</li>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> clinical_notes </span>Doktorlarım
							</li>
							<a
								class="list-group-item mt-auto bg-secondary text-white"
								on:click={logout}
								href="../"
								style="margin: 1rem; border-radius: 10px"
							>
								<span class="material-symbols-outlined"> logout </span>
								<span class="mx-auto" style="padding-right: 1rem;">Çıkış</span>
							</a>
						</ul>
						<ul class="list-group mobileList mobileOnly w-100">
							<button
								class="list-group-item w-100"
								on:click={() => {
									changeComponent(ProfDetails, true);
								}}
							>
								<span class="material-symbols-outlined"> for_you </span>Hesap Bilgileri
							</button>
							<button
								class="list-group-item w-100"
								on:click={() => {
									changeComponent(History, true);
								}}
							>
								<span class="material-symbols-outlined"> history </span>Hastalık Geçmişi
							</button>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> draft </span>Dökümanlarım
							</li>
							<button
								class="list-group-item w-100"
								on:click={() => {
									changeComponent(Messages, true);
								}}
							>
								<span class="material-symbols-outlined"> draft </span>Mesajlar
							</button>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> description </span>Kayıtlarım
							</li>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> medication </span>İlaçlarım
							</li>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> event </span>İlaç hatırlatıcı
							</li>
							<li class="list-group-item">
								<span class="material-symbols-outlined"> clinical_notes </span>Doktorlarım
							</li>
							<a class="list-group-item" href="./admin">
								<span class="material-symbols-outlined"> admin_panel_settings </span>Admin
							</a>
							<a class="list-group-item" on:click={logout} href="../">
								<span class="material-symbols-outlined"> logout </span>Çıkış
							</a>
						</ul>
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
					<div class="col-md-8 col-lg-9 col-xxl-10 kont pcOnly">
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
{/if}

<style>
	.kont {
		background-color: white;
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
	.mobileList,
	.mobileList .list-group-item {
		background-color: unset;
	}
	.mobileList .list-group-item {
		padding-inline: 0;
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
