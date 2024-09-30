<script lang="ts">
	import { logout } from '$lib/firebase.client.js';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { _, locale } from 'svelte-i18n';

	import ProfDetails from '$lib/components/profile/ProfDetails.svelte';
	import {
		loginModal,
		mobile,
		mobileComponent,
		putData,
		mobileHeader,
		dataLoading
	} from '$lib/store/dataStore';
	import Chat from '$lib/components/chat/Chat.svelte';
	import Documents from '$lib/components/profile/Documents.svelte';
	import Favourites from '$lib/components/profile/Favourites.svelte';
	import NotificationSettings from '$lib/components/profile/NotificationSettings.svelte';
	import PasswordReset from '$lib/components/profile/PasswordReset.svelte';
	import Confirm from '$lib/helpers/Confirm.svelte';
	import { goto } from '$app/navigation';

	let userEmail: any = '';
	let component: any = $mobile ? null : ProfDetails;
	let showModal: boolean = false;

	// $: dataLoading.set($session.user ? false : true);

	onMount(async () => {
		if ($session?.user) {
			userEmail = $session.user.email;
		}
		mobileHeader.set($_('nav.menu'));
	});

	function changeComponent(comp: any, mobile?: boolean) {
		if (mobile) {
			mobileComponent.set(comp);
			mobileHeader.set($_('nav.menu'));
		} else {
			component = comp;
		}
	}

	function handleChangeValue(event: Event) {
		console.log(event);
		changeComponent(Chat);
	}

	const changeLocale = async (newLocale: string) => {
		let local = $locale;
		locale.set(newLocale);
		if ($session.user?.uid && local != newLocale) {
			await putData('users', 'uid', $session.user?.uid, { lang: newLocale }, true);
		}
	};
</script>

<section>
	<div
		class="jumbotron jumboHeader"
		style="padding-block: 1rem; background-color: #e2e9ef; position: relative;"
	>
		{#if $mobileComponent}
			<button
				class="btn btnBack mobileOnly"
				style="position: absolute;
					top: 10px!important;
					left: 5px;
					color: rgb(41 71 41);
					border: none;
					text-align: center;
					width: 56px;
					padding-left: 20px;
					height: 40px;"
				class:d-none={!$mobileComponent}
				on:click={() => {
					changeComponent(null, true);
				}}><span class="material-symbols-outlined"> arrow_back_ios </span></button
			>
		{/if}
		<h1 class="display-4 pcOnly">{$_('nav.account')}</h1>
		<h1
			class="display-4 mobileOnly"
			class:ps-4-5={$mobileComponent}
			style="white-space: nowrap;
					overflow-x: clip;
					max-width: 100%;
					font-size: clamp(1rem, 6.2vw, 1.5rem) !important;
    				line-height: 32px;"
		>
			{$mobileHeader}
		</h1>
		{#if $session.user && !$mobileComponent}
			<button
				class="btn btnSettings mobileOnly"
				style="position: absolute; top: 10px; right: 1rem; color: var(--primaryText)"
				data-bs-toggle="collapse"
				data-bs-target="#settings"
				aria-expanded="false"
				aria-controls="settings"
			>
				<span class="material-symbols-outlined icon-fill"> settings </span>
			</button>
		{/if}
		<div class="collapse w-100 px-2" id="settings">
			<button
				on:click={() => {
					changeComponent(NotificationSettings, true);
					if ($session.user) mobileHeader.set($_('profile.notifications'));
				}}
				class="btn btn-outline-primary d-flex align-items-center gap-2 w-100 mb-3"
				data-bs-toggle="collapse"
				data-bs-target="#settings"
			>
				<span class="material-symbols-outlined"> notifications </span>
				{$_('profile.notifications')}
			</button>
			<button
				on:click={() => {
					changeComponent(PasswordReset, true);
					if ($session.user) mobileHeader.set($_('login.change_pass'));
				}}
				class="btn btn-outline-primary d-flex align-items-center gap-2 w-100 mb-3"
				data-bs-toggle="collapse"
				data-bs-target="#settings"
			>
				<span class="material-symbols-outlined"> key </span>
				{$_('login.change_pass')}
			</button>
		</div>
	</div>
</section>

{#if !$dataLoading}
	<section style="overflow-x: hidden;">
		<div class="container mobileCont">
			<div class="row mt-3 pb-5 justify-content-center">
				<div class="col-12 col-md-4 col-lg-3">
					{#if !$mobileComponent}
						{#if $session.user}
							<ul
								class="list-group pcOnly w-100 bg-white d-flex"
								style="height: 400px; border-radius: 8px; overflow: hidden"
							>
								<button
									class="list-group-item w-100"
									on:click={() => {
										changeComponent(ProfDetails);
									}}
									class:active={component == ProfDetails}
								>
									<span class="material-symbols-outlined"> for_you </span>{$_('nav.account')}
								</button>

								<button
									class="list-group-item w-100"
									on:click={() => {
										changeComponent(Documents);
									}}
									class:active={component == Documents}
								>
									<span class="material-symbols-outlined"> draft </span>{$_('profile.docs')}
								</button>
								<button
									class="list-group-item w-100"
									on:click={() => {
										changeComponent(Favourites);
									}}
									class:active={component == Favourites}
								>
									<span class="material-symbols-outlined"> clinical_notes </span>{$_(
										'profile.doctors'
									)}
								</button>
								<button
									class="list-group-item w-100"
									on:click={() => {
										changeComponent(NotificationSettings);
									}}
									class:active={component == NotificationSettings}
								>
									<span class="material-symbols-outlined"> notifications </span>{$_(
										'profile.notifications'
									)}
								</button>
								<button
									class="list-group-item w-100"
									on:click={() => {
										changeComponent(PasswordReset);
									}}
									class:active={component == PasswordReset}
								>
									<span class="material-symbols-outlined"> notifications </span>Şifrəni dəyiş
								</button>
								{#if $session.user}
									<button
										class="list-group-item mt-auto bg-secondary text-white"
										on:click={() => {
											showModal = true;
										}}
										style="margin: 1rem; border-radius: 10px!important"
									>
										<span class="material-symbols-outlined"> logout </span>
										<span class="mx-auto" style="padding-right: 1rem;">{$_('profile.logout')}</span>
									</button>
								{/if}
							</ul>
						{/if}
						<div class="d-flex flex-column mobileList mobileOnly w-100">
							<button
								class="card btn btn-outline-primary d-flex flex-row w-100"
								style="background: rgb(150 199 137);
									color: white;
									padding-block: 1rem;"
								on:click={() => {
									$session.user ? changeComponent(ProfDetails, true) : loginModal.set(true);
									if ($session.user) mobileHeader.set($_('nav.account'));
								}}
							>
								<div class="d-flex gap-3 align-items-center">
									<!-- svelte-ignore a11y-img-redundant-alt -->
									{#if $session.user?.photoURL}
										<div
											style="min-height: 60px; min-width: 60px; display: flex; align-items: center; justify-content: center"
										>
											<img
												src={$session.user?.photoURL}
												alt="Profile Photo"
												style="max-height: 60px;  padding: 5px; border-radius: 100%; 
												background: #f6f6f6; 
												aspect-ratio: 1 / 1;
												object-fit: cover;
												object-position: center;"
											/>
										</div>
									{:else}
										<span
											style="font-size: 50px !important;
													color: rgb(150 199 137);
													background: rgb(246, 246, 246);
													border-radius: 100%;
													padding: 5px;"
											class="material-symbols-outlined icon-fill">person</span
										>
									{/if}
									<div class="d-flex flex-column align-items-start">
										{#if $session.user}
											<span style="font-size: small;">Profil</span>
											{#if $session.user?.displayName}
												<span style="margin-top: -5px">{$session.user?.displayName}</span>
											{/if}
										{:else}
											<span>{$_('login.login_header')}</span>
										{/if}
									</div>
								</div>
							</button>
							{#if $session.user}
								<a class="card btn btn-outline-primary d-flex flex-row w-100" href="/messages">
									<span class="material-symbols-outlined"> mail </span>{$_('nav.messages')}
								</a>

								<button
									class="card btn btn-outline-primary d-flex flex-row w-100"
									on:click={() => {
										changeComponent(Documents, true);
										if ($session.user) mobileHeader.set($_('profile.docs'));
									}}
								>
									<span class="material-symbols-outlined"> draft </span>{$_('profile.docs')}
								</button>
								<button
									class="card btn btn-outline-primary d-flex flex-row w-100"
									on:click={() => {
										changeComponent(Favourites, true);
										if ($session.user) mobileHeader.set($_('profile.doctors'));
									}}
								>
									<span class="material-symbols-outlined"> clinical_notes </span>{$_(
										'profile.doctors'
									)}
								</button>
								<button
									class="card btn btn-outline-primary d-flex flex-row w-100"
									style="border-radius: 20px!important;"
									on:click={() => {
										showModal = true;
									}}
								>
									<span class="material-symbols-outlined"> logout </span>{$_('profile.logout')}
								</button>
							{/if}
							<hr
								style="padding: 0;
								color: #a7a7a7;
								margin: 5px;"
							/>

							<button
								class="card btn btn-outline-primary dropdown-toggle d-flex flex-row align-items-center gap-1 btnLocale"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#localeSelector"
								aria-expanded="false"
								style="#d5e4d1"
							>
								<span class="material-symbols-outlined"> globe </span>
								<span>{$_('actions.lang_selection')}</span>
							</button>
							<ul
								class="collapse w-100 list-group list-group-flush"
								id="localeSelector"
								style="border-radius: 16px"
							>
								<li class="list-group-item">
									<button
										class="dropdown-item"
										on:click={() => changeLocale('az')}
										data-bs-toggle={$mobile ? 'collapse' : ''}
										data-bs-target={$mobile ? '#localeSelector' : ''}
										><img
											style="width:20px;height:20px;margin-right:.5rem"
											src="https://ik.imagekit.io/d2nwsj0ktvh/img/az.png"
											alt="Azerbaijan Flag"
										/>Azərbaycan dili</button
									>
								</li>
								<li class="list-group-item">
									<button
										class="dropdown-item"
										on:click={() => changeLocale('tr')}
										data-bs-toggle={$mobile ? 'collapse' : ''}
										data-bs-target={$mobile ? '#localeSelector' : ''}
									>
										<img
											style="width:20px;height:20px;margin-right:.5rem"
											src="https://ik.imagekit.io/d2nwsj0ktvh/turkey_dBbuCptvk.png?updatedAt=1719140350211"
											alt="Turkish Flag"
										/>Türkçe</button
									>
								</li>
								<li class="list-group-item">
									<button
										class="dropdown-item"
										on:click={() => changeLocale('ru')}
										data-bs-toggle={$mobile ? 'collapse' : ''}
										data-bs-target={$mobile ? '#localeSelector' : ''}
									>
										<img
											style="width:20px;height:20px;margin-right:.5rem"
											src="https://ik.imagekit.io/d2nwsj0ktvh/img/ru.png"
											alt="Russian Flag"
										/>Русский</button
									>
								</li>
								<li class="list-group-item">
									<button
										class="dropdown-item"
										on:click={() => changeLocale('en')}
										data-bs-toggle={$mobile ? 'collapse' : ''}
										data-bs-target={$mobile ? '#localeSelector' : ''}
									>
										<img
											style="width:20px;height:20px;margin-right:.5rem"
											src="https://ik.imagekit.io/d2nwsj0ktvh/img/en.png"
											alt="English Flag"
										/>English</button
									>
								</li>
							</ul>
							<a href="/contact" class="card btn btn-outline-primary d-flex flex-row w-100">
								<span class="material-symbols-outlined"> dialpad </span>{$_('actions.contact_us')}
							</a>
							<a href="/about" class="card btn btn-outline-primary d-flex flex-row w-100">
								<span class="material-symbols-outlined"> shield_question </span>{$_('nav.about')}
							</a>
							{#if $session.user && $session.user.admin}
								<a class="card btn btn-outline-primary d-flex flex-row w-100" href="./admin">
									<span class="material-symbols-outlined"> admin_panel_settings </span>Admin
								</a>
							{/if}
						</div>
					{/if}
				</div>

				{#if $mobileComponent}
					<div class="col-md-9 col-lg-9 kont px-0 mobileOnly">
						<div class="container">
							<div class="row">
								<div class="col-12 mobileOnly" style="background-color: unset">
									<div class="container">
										<svelte:component this={$mobileComponent} on:changeValue={handleChangeValue} />
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="col-md-8 col-lg-9 kont pcOnly">
						<div class="container h-100">
							<div class="row h-100">
								<div class="col pcOnly" style="position: relative;">
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
	<div class="d-flex justify-content-center">
		<div class="lds-ellipsis" style="position: fixed; top: 50%; transform: translateY(-50%)">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
{/if}

{#if showModal}
	<Confirm
		message={$_('profile.confirm_logout')}
		onConfirm={() => {
			showModal = false;
			logout();
			goto('/');
		}}
		onCancel={() => {
			showModal = false;
		}}
	/>
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
	.btnLocale::after {
		display: none;
	}
	.display-4 {
		transition-duration: 0.2s;
	}
	.ps-4-5 {
		padding-left: 2.5rem !important;
	}
	.btnSettings:active,
	.btnSettings:focus {
		background-color: unset !important;
		border: unset !important;
	}
	.btn-outline-primary:not(:hover) {
		background-color: white;
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
		.list-group-item {
			border-radius: 0 !important;
		}
	}
</style>
