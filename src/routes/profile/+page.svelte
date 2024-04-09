<script lang="ts">
	import { logout } from '$lib/firebase.client.js';
	import { onMount } from 'svelte';
	import ProfDetails from '$lib/components/profile/ProfDetails.svelte';
	import History from '$lib/components/profile/History.svelte';
	export let data;
	let userEmail: any = '';

	onMount(async () => {
		const user: any = await data.getAuthUser();
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
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
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
		<h1 class="display-4">Hesabım</h1>
		<hr />
	</div>
</section>

<section>
	<div class="container mb-3">
		<div class="row mt-3 pb-5">
			<div class="col-12 col-md-3 cl-lg-2">
				<ul class="list-group pcOnly w-100">
					<button
						class="list-group-item active w-100"
						on:click={() => {
							changeComponent(ProfDetails);
						}}
					>
						<span class="material-symbols-outlined"> for_you </span>Hesap Bilgileri
					</button>
					<button
						class="list-group-item w-100"
						on:click={() => {
							changeComponent(History);
						}}
					>
						<span class="material-symbols-outlined"> history </span>Hastalık Geçmişi
					</button>
					<li class="list-group-item">
						<span class="material-symbols-outlined"> draft </span>Dökümanlarım
					</li>
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
				<ul class="list-group mobileOnly w-100" class:d-none={mobileComponent}>
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
			</div>
			<div class="col-12 col-md-9 col-lg-9 kont">
				<div class="container">
					<div class="row">
						<div class="col pcOnly">
							<svelte:component this={component} />
						</div>
						<div class="col mobileOnly">
							<svelte:component this={mobileComponent} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.kont {
		background-color: white;
		border-radius: 10px;
		padding: 1rem;
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
		font-weight: 500;
		width: 100%;
	}
	@media screen and (max-width: 768px) {
		.col-12 {
			padding: 0;
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
	}
</style>
