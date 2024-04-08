<script lang="ts">
	import { logout } from '$lib/firebase.client.js';
	import { onMount } from 'svelte';
	import ProfDetails from '$lib/components/profile/ProfDetails.svelte';
	export let data;
	let userEmail: any = '';

	onMount(async () => {
		const user: any = await data.getAuthUser();
		userEmail = user.email;
	});
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Hesabım</h1>
		<!-- <p class="lead">{userEmail}</p> -->
		<hr />
		<!-- <p>
				It uses utility classes for typography and spacing to space content out within the larger
				container.
			</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<section>
	<div class="container mb-3">
		<div class="row mt-3 pb-5">
			<div class="col-12 col-md-3 cl-lg-2">
				<ul class="list-group">
					<li class="list-group-item active">
						<span class="material-symbols-outlined"> for_you </span>Hesap Bilgileri
					</li>
					<li class="list-group-item">
						<span class="material-symbols-outlined"> history </span>Hastalık Geçmişi
					</li>
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
			<div class="col-12 col-md-9 col-lg-9">
				<ProfDetails />
			</div>
		</div>
	</div>
</section>

<style>
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
	}
</style>
