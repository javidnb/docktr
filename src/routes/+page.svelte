<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	let loggedIn: boolean = false;
	session.subscribe((cur: any) => {
		loggedIn = cur?.loggedIn;
	});
	onMount(async () => {});
</script>

<section class="homeNavContainer" style="background-color: #e2e9ef;">
	<div class="container pt-3">
		<ul class="nav nav-pills nav-fill homeNav">
			<li class="nav-item">
				<a class="nav-link active" href="./"
					><span class="material-symbols-outlined"> home </span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/"
					><span class="material-symbols-outlined"> physical_therapy </span><span class="pcOnly"
						>Doktorlar</span
					></a
				>
			</li>
			<li class="nav-item pcOnly">
				<a class="nav-link" href="/diseases"
					><span class="material-symbols-outlined"> category </span><span class="pcOnly"
						>Bölümler</span
					></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/diseases"
					><span class="material-symbols-outlined"> microbiology </span>
					<span class="pcOnly">Hastalıklar</span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/"
					><span class="material-symbols-outlined"> meeting_room </span>
					<span class="pcOnly">Randevu</span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/"
					><span class="material-symbols-outlined"> rss_feed </span>
					<span class="pcOnly">Blog</span></a
				>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/"
					><span class="material-symbols-outlined"> dialpad </span>
					<span class="pcOnly">İletişim</span></a
				>
			</li>

			{#if loggedIn}
				<li class="nav-item">
					<a class="nav-link" href="/admin"
						><span class="material-symbols-outlined"> admin_panel_settings </span>
						<span class="pcOnly">Admin</span></a
					>
				</li>
			{/if}
		</ul>
	</div>
</section>

<section>
	<div class="jumbotron" style="padding-top: 5rem; background-color: #e2e9ef">
		<h1 class="display-4">Find a doctor</h1>
		<p class="lead">We connect you to doctors around the world!</p>
		<hr class="my-4" />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<style>
	.homeNav {
		/* border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px; */
		border-radius: 40px;
		background: white;
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
		}
		.homeNavContainer .active {
			border-radius: 0;
		}
		.homeNavContainer .nav-link .material-symbols-outlined {
			font-size: 30px;
			color: #a1c398;
		}
		.active .material-symbols-outlined {
			color: white !important;
		}
	}
</style>
