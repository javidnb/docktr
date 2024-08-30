<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { session } from '$lib/session';
	import {
		dataLoading,
		loginModal,
		appointments,
		showBtnEndCall,
		putData,
		mobile,
		hideNav,
		showGPT,
		mobileComponent,
		mobileHeader
	} from '$lib/store/dataStore';
	import Modal from '$lib/helpers/Modal.svelte';
	import Login from './login/Login.svelte';
	import { goto } from '$app/navigation';
	import { locale, _ } from 'svelte-i18n';
	import { logout } from '$lib/firebase.client';

	let currentDate = new Date();
	let showModal: boolean = false;
	$: upcomingAppointments = $appointments.length
		? $appointments.filter((ap) => new Date(ap.startTime) > new Date())
		: [];

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

	$: if (showModal == false) loginModal.set(false);
</script>

{#if $dataLoading}
	<div class="progress-bar">
		<div class="progress-animation"></div>
	</div>
{/if}

{#if !$showBtnEndCall}
	<nav
		class="navbar navbar-expand-lg navbar-dark pcOnly"
		style="background-color: var(--primaryColor);"
	>
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
					<span>{$_('actions.back')}</span>
				</button>
			{:else}
				<p class="d-flex align-items mb-0 time" style="color: white;"></p>
			{/if}
			<!-- <img
				src="https://ik.imagekit.io/d2nwsj0ktvh/logo_hyRmOQCNQ.png?updatedAt=1722624724577"
				style="width: 30px; filter: grayscale(1) brightness(2)"
				alt="Sehiyye Logo"
			/> -->
			<a
				class="navbar-brand mx-auto"
				style="margin-left: auto;"
				href="../"
				on:click={() => {
					showGPT.set(false);
				}}
			>
				Səhiyyə<span style="font-size: x-large; color: rgb(0 0 0 / 70%)">.net</span></a
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
					<div class="dropdown drowpown-end">
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
						<ul class="dropdown-menu" style="width: 180px;">
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
							{#if $session.user && $session.user.admin}
								<li class="nav-item">
									<button
										class="nav-link topnavlink"
										on:click={() => goto('/admin')}
										class:active={curPage == '/admin'}
										data-bs-toggle={$mobile ? 'collapse' : ''}
										data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
									>
										<span class="material-symbols-outlined icon-fill"> admin_panel_settings </span>
										<span>Admin</span></button
									>
								</li>
							{/if}
							<li class="nav-item mobileOnly">
								<button
									class="nav-link topnavlink"
									on:click={() => goto('/contact')}
									class:active={curPage == '/contact'}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
									><span class="material-symbols-outlined icon-fill"> contacts_product </span>
									<span>{$_('nav.contact')}</span></button
								>
							</li>
							<li class="nav-item pcOnly">
								<button
									class="nav-link topnavlink"
									on:click={() => goto('/messages')}
									class:active={curPage == '/messages'}
									><span class="material-symbols-outlined icon-fill"> mail </span>
									<span>{$_('nav.messages')}</span></button
								>
							</li>
							<li class="nav-item pcOnly">
								<button
									class="nav-link topnavlink"
									on:click={() => goto('/profile')}
									class:active={curPage == '/profile'}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
								>
									<span class="material-symbols-outlined icon-fill"> account_circle </span>
									<span
										>{$session.user?.displayName
											? $session.user.displayName
											: $_('nav.account')}</span
									>
								</button>
							</li>
							<li class="nav-item mobileOnly">
								<button
									class="nav-link topnavlink"
									on:click={logout}
									data-bs-toggle={$mobile ? 'collapse' : ''}
									data-bs-target={$mobile ? '#navbarSupportedContent' : ''}
								>
									<span class="material-symbols-outlined icon-fill"> logout </span>
									<span>{$_('nav.logout')}</span>
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
				<li class="nav-item mobileOnly midButton">
					<button
						class="nav-link h-100 d-flex justify-content-center"
						data-bs-toggle="collapse"
						data-bs-target="#moreBtns"
						aria-expanded="false"
						aria-controls="moreBtns"
						class:active={curPage == '/messages'}
					>
						<img
							src="https://ik.imagekit.io/d2nwsj0ktvh/logo_hyRmOQCNQ.png?updatedAt=1722624724577"
							alt="Sehiyye logo"
							style="width: 25px;"
						/>
					</button>
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

				<!-- <li class="nav-item mobileOnly">
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
				</li> -->
				<li class="nav-item pcOnly">
					<a class="nav-link" href="/"
						><span class="material-symbols-outlined"> rss_feed </span>
						<span class="navLinkText">{$_('nav.blog')}</span></a
					>
				</li>
				<li class="nav-item pcOnly">
					<a class="nav-link" href="/contact" class:active={curPage == '/contact'}
						><span class="material-symbols-outlined" class:icon-fill={curPage == '/contact'}>
							dialpad
						</span>
						<span class="navLinkText">{$_('nav.contact')}</span></a
					>
				</li>

				<li class="nav-item mobileOnly">
					<button
						class="nav-link"
						class:active={curPage == '/profile'}
						on:click={() => {
							mobileComponent.set(null);
							mobileHeader.set($_('nav.menu'));
							goto('/profile');
						}}
						><span class="material-symbols-outlined" class:icon-fill={curPage == '/profile'}>
							menu
						</span>
						<span class="navLinkText">{$_('nav.menu')}</span></button
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

			<div
				class="collapse"
				id="moreBtns"
				style="position: absolute;
				bottom: 4rem;
				background: white;
				border-radius: 14px;
				box-shadow:  0px 0px 5px #00000012;
				padding: 10px;
				width: 75%;
				left: 50%;
				transform: translateX(-50%);
				z-index: 99;"
			>
				<div class="d-flex flex-column gap-3 p-2 w-100 justify-content-around">
					<button
						class="btn btn-outline-primary bg-white w-100 mt-3"
						style="position: relative;
						border-radius: 20px;
						background-color: #639057 !important;
						color: white;
						font-family: 'Alumni Sans';
						display: flex;"
						on:click={() => {
							goto('/search');
						}}
					>
						<div class="d-flex flex-column" style="width: calc(100% - 50px)">
							<div class="d-flex gap-2 align-items-center w-100" style="font-size: 24px;">
								<span class="mx-auto">Yeni Görüş Al</span>
							</div>
							<img
								src="https://ik.imagekit.io/d2nwsj0ktvh/online_VP_k7pe75.png"
								alt="Get Appointment"
								style="width: 85px;
									max-width: 20vw;
									position: absolute;
									right: 5px;
									top: 50%;
									transform: translateY(-50%);"
							/>
						</div>
					</button>
					<button
						class="btn btn-outline-primary d-flex mt-2"
						disabled={$dataLoading}
						data-bs-toggle="collapse"
						data-bs-target="#moreBtns"
						on:click={() => {
							goto('/gpt');
						}}
					>
						<span
							class="material-symbols-outlined s-y_bCXRrkrYfP"
							style="font-size: 30px;">contact_support</span
						>
						<span class="mx-auto"> Bizə Sual Ver </span>
					</button>
				</div>
			</div>
		</div>
	</section>
{/if}

<Modal bind:showModal>
	<Login />
</Modal>
