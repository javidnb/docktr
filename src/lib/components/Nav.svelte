<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import { session } from '$lib/session';
	import { dataLoading } from '$lib/store/dataStore';

	let currentDate = new Date();

	onMount(async () => {
		setInterval(() => {
			currentDate = new Date();
		}, 60000);
	});
	console.log('page: ', $page);
	let websiteName = $page.url.host;
	let curPage: string | null = '/';
	$: curPage = $page.route.id;
</script>

{#if $dataLoading}
	<div class="progress-bar">
		<div class="progress-animation"></div>
	</div>
{/if}

<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: var(--primaryColor);">
	<div
		class="container-fluid"
		style="display: flex;flex-wrap: inherit;
    align-items: center;
    justify-content: space-between; width:100%"
	>
		<p class="d-flex align-items mb-0 time" style="color: white;">{formatDate(currentDate)}</p>
		<a class="navbar-brand mx-auto" style="margin-left: auto;" href="../"
			>
			Səhiyyə<span style="font-size: x-large; color: rgb(0 0 0 / 70%)"
				>.{websiteName.endsWith('.net') ? 'net' : 'online'}</span
			></a
		>
		<button
			class="navbar-toggler d-none"
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
				{#if !$session.loggedIn}
					<li class="nav-item">
						<a class="nav-link" href="login">Giriş yap</a>
					</li>
				{:else}
					<li class="nav-item">
						<a class="nav-link" href="../admin" class:icon-fill={curPage == '/admin'}>
							<span>Admin</span></a
						>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="../profile">Hesabım</a>
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
				<a style="height: 100%;" class="nav-link" href="../" class:active={curPage == '/'}
					><span class="material-symbols-outlined" class:icon-fill={curPage == '/'}> home </span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/doctors" class:active={curPage == '/doctors'}
					><span class="material-symbols-outlined" class:icon-fill={curPage == '/doctors'}>
						physical_therapy
					</span><span class="pcOnly">Doktorlar</span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/branches" class:active={curPage?.includes('/branches')}
					><span class="material-symbols-outlined" class:icon-fill={curPage?.includes('/branches')}>
						category
					</span><span class="pcOnly">Branşlar</span></a
				>
			</li>
			<li class="nav-item pcOnly">
				<a class="nav-link" href="/diseases" class:active={curPage == '/diseases'}
					><span class="material-symbols-outlined" class:icon-fill={curPage == '/diseases'}>
						microbiology
					</span>
					<span class="pcOnly">Hastalıklar</span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/appointment" class:active={curPage == '/appointment'}
					><span class="material-symbols-outlined" class:icon-fill={curPage == '/appointment'}>
						local_library
					</span>
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

			<li class="nav-item mobileOnly">
				<a class="nav-link" href={$session.loggedIn ? '/profile' : '/login'}
					><span
						class="material-symbols-outlined"
						class:icon-fill={curPage == '/profile' || curPage == '/login' || curPage == '/register'}
					>
						account_circle
					</span>
					<span class="pcOnly">Profile</span></a
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

<style>
	.navbar-brand {
		font-family: 'Alumni Sans', sans-serif;
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
		border-radius: 40px;
		background: white;
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
			background-color: unset;
		}
		.homeNav .nav-item:not(:last-child) {
			border-right: 1px solid #dedede;
		}
		.homeNavContainer .nav-item .nav-link {
			padding: 9px 15px;
		}
		.homeNavContainer .nav-link .material-symbols-outlined {
			font-size: 30px;
			color: var(--primaryColor);
		}
		.nav-item,
		.active,
		.nav-link {
			border-radius: 0px !important;
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
		background-color: #007bff; /* adjust color as needed */
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
</style>
