<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.about')}</h1>
	</div>
</section>

<div class="px-4 pb-5">
	<div class="container" style="text-align: justify;">
		<div class="row">
			<div class="d-flex justify-content-center mt-3" style="height: 136px;">
				<img
					src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
					alt="Sehiyye logo"
					style="width: 150px;"
				/>
			</div>
		</div>
		<div class="row mt-3 gap-3 align-items-center justify-content-center">
			<div class="col-12 col-md-4">
				<span>{@html $_('legal.about_1')}</span>
			</div>
			<div class="col-12 col-md-2">
				<img
					style="width: 100%; border-radius: 6px; max-height: 350px; aspect-ratio: 1 / 1.1;
					object-fit: cover;
					object-position: center;"
					src="https://ik.imagekit.io/d2nwsj0ktvh/about1_geR7iRjqu.jpg"
					alt="About"
				/>
			</div>
		</div>
		<div class="row mt-3 gap-3 align-items-center justify-content-center reversed">
			<div class="col-12 col-md-4">
				<span>{@html $_('legal.about_2')}</span>
			</div>
			<div class="col-12 col-md-2">
				<img
					style="width: 100%; border-radius: 6px; max-height: 350px; aspect-ratio: 1 / 1.1;
					object-fit: cover;
					object-position: center;"
					src="https://ik.imagekit.io/d2nwsj0ktvh/about2_xriv_VUbE.jpg"
					alt="About"
				/>
			</div>
		</div>
		<div class="row my-3 gap-3 align-items-center justify-content-center">
			<div class="col-12 col-md-4">
				<span>{@html $_('legal.about_3')}</span>
			</div>
			<div class="col-12 col-md-2">
				<img
					style="width: 100%; border-radius: 6px; max-height: 350px; aspect-ratio: 1 / 1.1;
					object-fit: cover;
					object-position: center;"
					src="https://ik.imagekit.io/d2nwsj0ktvh/about3_IKJnzDjr3.jpg"
					alt="About"
				/>
			</div>
		</div>
	</div>
</div>

<style>
	@media screen and (min-width: 992px) {
		.reversed {
			flex-direction: row-reverse;
		}
	}
</style>
