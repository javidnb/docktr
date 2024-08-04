<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import { session } from '$lib/session';
	import {
		dataLoading,
		loginModal,
		appointments,
		showBtnEndCall,
		putData,
		selectedUser,
		mobile,
		hideNav
	} from '$lib/store/dataStore';
	import Modal from '$lib/helpers/Modal.svelte';
	import Login from './login/Login.svelte';
	import { goto } from '$app/navigation';
	import { locale, _ } from 'svelte-i18n';

	let currentDate = new Date();
	let showModal: boolean = false;
	$: upcomingAppointments = $appointments.filter((ap) => new Date(ap.startTime) > new Date());

	onMount(async () => {
		setInterval(() => {
			currentDate = new Date();
		}, 60000);
	});

	const changeLocale = async (newLocale: string) => {
		let local = $locale;
		locale.set(newLocale);
		if ($session.user?.uid && local != newLocale) {
			await putData('users', 'uid', $session.user?.uid, { lang: newLocale }, true);
		}
	};
	let websiteName = $page.url.host;
	let curPage: string | null = '/';
	$: curPage = $page.route.id;

	$: showModal = !!$loginModal;

	let contactModal = false;

	$: if (showModal == false) loginModal.set(false);
</script>

{#if $dataLoading}
	<div class="progress-bar">
		<div class="progress-animation"></div>
	</div>
{/if}

{#if !$showBtnEndCall}
	<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: var(--primaryColor);">
		<div
			class="container-fluid"
			style="display: flex;
			flex-wrap: inherit;
			align-items: center;
			justify-content: space-between; 
			width:100%"
		>
			{#if curPage == '/messages' && !$mobile}
				<button
					on:click={() => {
						history.back();
					}}
					class="d-flex nav-link topnavlink btnBack"
					type="button"
					style="color: rgb(213, 228, 209);
						padding: 5px 10px;
						gap: 0;"
				>
					<span class="material-symbols-outlined"> arrow_back_ios </span>
					<span>Geri</span>
				</button>
			{:else}
				<p class="d-flex align-items mb-0 time" style="color: white;"></p>
			{/if}
			<!-- <img
				src="https://ik.imagekit.io/d2nwsj0ktvh/logo_hyRmOQCNQ.png?updatedAt=1722624724577"
				style="width: 30px; filter: grayscale(1) brightness(2)"
				alt="Sehiyye Logo"
			/> -->
			<a class="navbar-brand mx-auto" style="margin-left: auto;" href="../">
				Səhiyyə<span style="font-size: x-large; color: rgb(0 0 0 / 70%)"
					>.{websiteName.endsWith('.net') ? 'net' : 'online'}</span
				></a
			>
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
				<div class="collapseContainer d-flex align-items-center justify-content-center">
					<div class="dropdown dropstart">
						<button
							class="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-1 langSelector"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							style="#d5e4d1"
						>
							<span class="material-symbols-outlined"> globe </span>{$locale
								?.toUpperCase()
								.slice(0, 2)}
						</button>
						<ul class="dropdown-menu">
							<li>
								<button
									class="dropdown-item"
									on:click={() => changeLocale('az')}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
									><img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/img/az.png"
										alt="Azerbaijan Flag"
									/>Azərbaycan dili</button
								>
							</li>
							<li>
								<button
									class="dropdown-item"
									on:click={() => changeLocale('tr')}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
								>
									<img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/turkey_dBbuCptvk.png?updatedAt=1719140350211"
										alt="Turkish Flag"
									/>Türkçe</button
								>
							</li>
							<li>
								<button
									class="dropdown-item"
									on:click={() => changeLocale('ru')}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
								>
									<img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/img/ru.png"
										alt="Russian Flag"
									/>Русский</button
								>
							</li>
							<li>
								<button
									class="dropdown-item"
									on:click={() => changeLocale('en')}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
								>
									<img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/img/en.png"
										alt="English Flag"
									/>English</button
								>
							</li>
						</ul>
					</div>
					<ul
						class="navbar-nav ml-auto topNav"
						style="margin-left: auto;display: flex;
							flex-direction: row;"
					>
						{#if !$session.loggedIn}
							<li class="nav-item">
								<button
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
									class="nav-link d-flex flex-row gap-1"
									on:click|preventDefault={() => loginModal.set(true)}
								>
									<span class="material-symbols-outlined"> input </span>
									{$_('nav.login') ?? 'Login'}
								</button>
							</li>
						{:else}
							{#if $session.user?.admin}
								<li class="nav-item">
									<button
										class="nav-link topnavlink"
										on:click={() => goto('../admin')}
										data-bs-toggle={$mobile ? 'collapse' : ''}
										data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
									>
										<span class="material-symbols-outlined icon-fill"> admin_panel_settings </span>
										<span>Admin</span></button
									>
								</li>
							{/if}
							<li class="nav-item">
								<button
									class="nav-link topnavlink"
									on:click={() => goto('../messages')}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
								>
									<span class="material-symbols-outlined icon-fill"> mail </span>
									{$_('nav.messages')}
								</button>
							</li>
							<li class="nav-item">
								<button
									class="nav-link topnavlink"
									on:click={() => goto('../profile')}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
								>
									<span class="material-symbols-outlined icon-fill"> account_circle </span>
									<span>{$_('nav.account') ?? 'Login'}</span>
								</button>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
	</nav>

	<section class="homeNavContainer {$hideNav ? 'd-none' : ''}" style="background-color: #e2e9ef;">
		<div class="container pt-3">
			<ul class="nav nav-pills nav-fill homeNav">
				<li class="nav-item">
					<a style="height: 100%;" class="nav-link" href="../" class:active={curPage == '/'}>
						<span class="material-symbols-outlined" class:icon-fill={curPage == '/'}> home </span>
						<span class="mobileOnly navLinkText">{$_('nav.home')}</span>
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="/doctors" class:active={curPage?.includes('/doctors')}
						><span
							class="material-symbols-outlined"
							class:icon-fill={curPage?.includes('/doctors')}
						>
							physical_therapy
						</span><span class="navLinkText">{$_('nav.docs')}</span></a
					>
				</li>
				<li class="nav-item pcOnly">
					<a class="nav-link" href="/branches" class:active={curPage?.includes('/branches')}
						><span
							class="material-symbols-outlined"
							class:icon-fill={curPage?.includes('/branches')}
						>
							category
						</span><span class="navLinkText">{$_('nav.branches')}</span></a
					>
				</li>
				<li class="nav-item pcOnly">
					<a class="nav-link" href="/diseases" class:active={curPage == '/diseases'}
						><span class="material-symbols-outlined" class:icon-fill={curPage == '/diseases'}>
							microbiology
						</span>
						<span class="navLinkText">{$_('nav.diseases')}</span></a
					>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						href="/appointment"
						class:active={curPage == '/appointment'}
						style="position: relative;"
						><span class="material-symbols-outlined" class:icon-fill={curPage == '/appointment'}>
							local_library
						</span>
						<span class="navLinkText">{$_('nav.appointments')}</span>
						{#if upcomingAppointments.length && curPage !== '/appointment'}
							<span
								class="redDot"
								style="background: rgb(196, 15, 15);
									width: 7px;
									height: 7px;
									border-radius: 50%;
									align-self: baseline;"
							></span>
						{/if}
					</a>
				</li>
				<li class="nav-item mobileOnly">
					<button
						class="nav-link"
						on:click={() => ($session.loggedIn ? goto('/messages') : loginModal.set(true))}
						class:active={curPage == '/messages'}
						style="position: relative;"
						><span class="material-symbols-outlined" class:icon-fill={curPage == '/messages'}>
							mail
						</span>
						<span class="navLinkText">{$_('nav.messages')}</span>
					</button>
				</li>
				<li class="nav-item pcOnly">
					<a class="nav-link" href="/"
						><span class="material-symbols-outlined"> rss_feed </span>
						<span class="navLinkText">{$_('nav.blog')}</span></a
					>
				</li>
				<li class="nav-item pcOnly">
					<button
						class="nav-link"
						on:click={() => {
							selectedUser.set('1TgHpEOspfZmDhanm8m1XLgm29u1');
							contactModal = true;
						}}
						><span class="material-symbols-outlined"> dialpad </span>
						<span class="navLinkText">{$_('nav.contact')}</span></button
					>
				</li>

				<li class="nav-item mobileOnly">
					<button
						class="nav-link"
						on:click={() => ($session.loggedIn ? goto('/profile') : loginModal.set(true))}
						><span
							class="material-symbols-outlined"
							class:icon-fill={curPage == '/profile' ||
								curPage == '/login' ||
								curPage == '/register'}
						>
							account_circle
						</span>
						<span class="navLinkText">{$_('nav.account')}</span></button
					>
				</li>

				<!-- {#if $session.loggedIn}
				<li class="nav-item pcOnly" class:active={curPage == '/admin'}>
					<a class="nav-link" href="/admin"
						><span class="material-symbols-outlined"  class:icon-fill={curPage == '/admin'}> admin_panel_settings </span>
						<span class="pcOnly">Admin</span></a
					>
				</li>
			{/if} -->
			</ul>
		</div>
	</section>
{/if}

<Modal bind:showModal>
	<Login />
</Modal>

<style>
	.navbar-brand {
		font-family: 'Alumni Sans', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 2rem;
		line-height: 1;
	}
	.navbar-toggler:focus-within {
		box-shadow: none;
		background: #0000002e;
	}
	@media screen and (max-width: 769px) {
		.time,
		.pcOnly {
			display: none !important;
		}
		.btnBack {
			position: absolute;
			top: 12px;
		}
	}
	@media screen and (min-width: 992px) {
		.navbar-collapse {
			flex: none !important;
		}
		.nav-link {
			gap: 0.3rem;
		}
		.navbar-brand {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.homeNav {
		border-radius: 40px;
		background: #fffffff0;
		flex-wrap: nowrap;
		overflow: hidden;
		box-shadow: 0px 0px 5px #00000012;
	}
	.homeNav a {
		color: #415d3a;
		padding-block: 15px;
	}
	.active {
		color: white !important;
		border-radius: 40px;
		transition-duration: 0.3s;
		font-weight: 450;
	}
	.nav-link {
		display: flex;
		align-items: center;
		justify-content: center;
		transition-duration: 0.3s;
	}
	@media screen and (max-width: 992px) {
		.homeNavContainer {
			position: fixed;
			width: 100%;
			bottom: -1px;
			background-color: unset !important;
			z-index: 99;
			border-top: 1px solid #dedede;
			left: 0;
		}
		.homeNavContainer .container {
			padding: 0;
			margin: 0;
			padding-top: 0px !important;
		}
		.homeNavContainer ul {
			width: 100dvw;
			border-radius: 0px;
		}
		.homeNavContainer .active {
			border-radius: 0;
			background-color: unset;
		}
		.homeNav .nav-item:not(:last-child) {
			border-right: 1px solid #dedede;
		}
		.homeNavContainer .nav-item .nav-link {
			padding: 5px 0px !important;
			gap: 0;
		}
		.homeNavContainer .nav-link .material-symbols-outlined {
			font-size: 30px;
			color: var(--primaryColor);
		}
		.topNav {
			margin-left: 0 !important;
			text-wrap: nowrap;
		}
		.collapseContainer {
			flex-direction: row-reverse;
		}
		.nav-item {
			flex: 1 !important;
		}
		.nav-item,
		.active,
		.nav-link {
			border-radius: 0px !important;
			display: flex;
			flex-direction: column;
		}
		.topnavlink {
			flex-direction: unset;
		}
		.topnavlink .icon-fill {
			background: unset;
		}
		.navLinkText {
			font-size: x-small;
			color: var(--primaryColor);
			margin-top: 0px;
		}
		.material-symbols-outlined {
			font-size: 25px !important;
		}
		.icon-fill {
			background: #f3f3f3;
			border-radius: 10px;
			padding: 0px 7px;
		}
		.redDot {
			position: absolute;
			right: 10px;
			top: 10px;
		}
	}
	@media screen and (min-width: 992px) {
		.nav-link:hover {
			background-color: #415d3a1c;
			border-radius: 40px;
		}
		.active:hover {
			background-color: var(--primaryColor);
		}
		.nav-item {
			border-radius: 40px;
			overflow: hidden;
		}
	}

	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1011;
	}

	.progress-animation {
		width: 30%; /* width of the line */
		height: 3px; /* adjust height as needed */
		background-color: #597153; /* adjust color as needed */
		animation: progress 2.5s linear infinite;
	}

	@keyframes progress {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(300%);
		}
	}

	.langSelector {
		background-color: unset !important;
		color: rgb(213 228 209);
	}

	.langSelector:active,
	.langSelector:hover {
		background-color: #415d3a1c !important;
		border-radius: 40px !important;
	}
	.langSelector::before {
		display: none;
	}
	.dropdown-menu {
		top: 35px;
		right: 0;
	}
</style>
