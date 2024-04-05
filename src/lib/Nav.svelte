<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { navigating } from '$app/stores';
	import { page } from '$app/stores';

	let loggedIn: boolean = false;
	session.subscribe((cur: any) => {
		loggedIn = cur?.loggedIn;
	});
	onMount(async () => {});
	let currentPage: any = '/';
	navigating.subscribe((r) => (currentPage = $page.route.id));
</script>

<section class="homeNavContainer" style="background-color: #e2e9ef;">
	<div class="container pt-3">
		<ul class="nav nav-pills nav-fill homeNav">
			<li class="nav-item">
				<a class="nav-link" href="./" class:active={currentPage == '/'}
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
			<li class="nav-item pcOnly">
				<a class="nav-link" href="/categories" class:active={currentPage == '/categories'}
					><span class="material-symbols-outlined"> category </span><span class="pcOnly"
						>Bölümler</span
					></a
				>
			</li>
			<li class="nav-item">
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

			{#if loggedIn}
				<li class="nav-item">
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
	}
	.nav-link {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
	}
	@media screen and (max-width: 992px) {
		.homeNavContainer {
			position: fixed;
			width: 100%;
			bottom: 0;
		}
		.homeNavContainer .container {
			padding: 0;
			margin: 0;
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
			padding: 6px 15px;
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
