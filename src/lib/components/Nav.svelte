<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { navigating } from '$app/stores';
	import { page } from '$app/stores';
	import { auth } from '$lib/firebase.client';
	import { formatDate } from '$lib/dateFormatter';

	let currentDate = new Date();

	function logout() {
		auth
			.signOut()
			.then(() => {
				// loggedIn = false;
				session.set({ user: null });
				localStorage.removeItem('user');
				// Redirect or perform any other actions after logout
				// navigate('/login');
			})
			.catch((error) => {
				console.error('Error logging out:', error);
			});
	}

	onMount(async () => {
		setInterval(() => {
			currentDate = new Date();
		}, 60000);
		// const user: any = await data.getAuthUser();
		// console.log("user: ", user);
	});
	let currentPage: any = '/';
	navigating.subscribe((r) => (currentPage = $page.route.id));
</script>

<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #a1c398;">
	<div
		class="container-fluid"
		style="display: flex;flex-wrap: inherit;
    align-items: center;
    justify-content: space-between; width:100%"
	>
		<p class="d-flex align-items mb-0 time" style="color: white;">{formatDate(currentDate)}</p>
		<a class="navbar-brand tac-one-regular mx-auto" style="margin-left: auto;" href="../">Docktr</a>
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
			<ul class="navbar-nav ml-auto" style="margin-left: auto;">
				<!-- <li class="nav-item active">
					<a class="nav-link" href="./">Ana Səhifə</a>
				</li> -->
				{#if !$session.loggedIn}
					<li class="nav-item">
						<a class="nav-link" href="login">Giriş yap</a>
					</li>
				{:else}
					<li
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						class="nav-item mobileOnly"
					>
						<a class="nav-link" href="./admin" class:active={currentPage == '/admin'}>
							<span>Admin</span></a
						>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="./profile">Hesabım</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="../" on:click={logout}>Çıkış</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>

<section class="homeNavContainer" style="background-color: #e2e9ef;">
	<div class="container pt-3">
		<ul class="nav nav-pills nav-fill homeNav">
			<li class="nav-item">
				<a class="nav-link" href="../" class:active={currentPage == '/'}
					><span class="material-symbols-outlined"> home </span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/doctors" class:active={currentPage == '/doctors'}
					><span class="material-symbols-outlined"> physical_therapy </span><span class="pcOnly"
						>Doktorlar</span
					></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/branches" class:active={currentPage.includes('/branches')}
					><span class="material-symbols-outlined"> category </span><span class="pcOnly"
						>Branşlar</span
					></a
				>
			</li>
			<li class="nav-item pcOnly">
				<a class="nav-link" href="/diseases" class:active={currentPage == '/diseases'}
					><span class="material-symbols-outlined"> microbiology </span>
					<span class="pcOnly">Hastalıklar</span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/appointment" class:active={currentPage == '/appointment'}
					><span class="material-symbols-outlined"> local_library </span>
					<span class="pcOnly">Randevu</span></a
				>
			</li>
			<li class="nav-item pcOnly">
				<a class="nav-link" href="/"
					><span class="material-symbols-outlined"> rss_feed </span>
					<span class="pcOnly">Blog</span></a
				>
			</li>
			<li class="nav-item pcOnly">
				<a class="nav-link" href="/"
					><span class="material-symbols-outlined"> dialpad </span>
					<span class="pcOnly">İletişim</span></a
				>
			</li>

			{#if $session.loggedIn}
				<li class="nav-item mobileOnly">
					<a class="nav-link" href="/profile" class:active={currentPage == '/profile'}
						><span class="material-symbols-outlined"> account_circle </span>
						<span class="pcOnly">Profile</span></a
					>
				</li>

				<li class="nav-item pcOnly">
					<a class="nav-link" href="/admin" class:active={currentPage == '/admin'}
						><span class="material-symbols-outlined"> admin_panel_settings </span>
						<span class="pcOnly">Admin</span></a
					>
				</li>
			{/if}
		</ul>
	</div>
</section>

<style>
	.tac-one-regular {
		font-family: 'Tac One', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 2rem;
		line-height: 1;
	}
	@media screen and (max-width: 769px) {
		.time {
			display: none !important;
		}
	}
	@media screen and (min-width: 992px) {
		.navbar-collapse {
			flex: none !important;
		}
	}
	.homeNav {
		/* border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px; */
		border-radius: 40px;
		background: white;
		flex-wrap: nowrap;
		overflow: hidden;
	}
	.homeNav a {
		color: #415d3a;
		padding-block: 15px;
	}
	.active {
		background-color: #a1c398;
		color: white !important;
		border-radius: 40px;
		transition-duration: 0.3s;
	}
	.nav-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		transition-duration: 0.3s;
	}
	@media screen and (max-width: 992px) {
		.homeNavContainer {
			position: fixed;
			width: 100%;
			bottom: 0;
			background-color: unset !important;
			z-index: 99;
			border-top: 1px solid #dedede;
		}
		.homeNavContainer .container {
			padding: 0;
			margin: 0;
			padding-top: 0px !important;
		}
		.homeNavContainer ul {
			width: 100vw;
			border-radius: 0px;
			margin-left: 1px;
		}
		.homeNavContainer .active {
			border-radius: 0;
		}
		.nav-item {
			border-inline: 1px solid #dedede;
			margin-left: -1px;
		}
		.homeNavContainer .nav-item .nav-link {
			padding: 9px 15px;
		}
		.homeNavContainer .nav-link .material-symbols-outlined {
			font-size: 30px;
			color: #a1c398;
		}
		.active .material-symbols-outlined {
			color: white !important;
		}
	}
	@media screen and (min-width: 992px) {
		.nav-link:hover {
			background-color: #415d3a1c;
			border-radius: 40px;
		}
		.active:hover {
			background-color: #a1c398;
		}
	}
</style>
