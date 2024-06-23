<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
	import Search from '$lib/helpers/Search.svelte';
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div
		class="jumbotron"
		style="padding-block: 3rem;
		background-color: #e2e9ef;
		background-image: url('https://tekoplast.az/img/docktrbg.png');
		background-size: cover;
		background-blend-mode: overlay;"
	>
		<div class="container">
			<div class="row justify-content-center">
				<div class="col col-md-8 d-flex align-items-center flex-column text-center">
					<h1 class="display-4">{$_('home.hero')}</h1>
					<p class="lead">{$_('home.lead')}</p>
					<div class="col-12 col-md-10">
						<Search />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="categories py-5">
	<div class="container">
		<div class="row">
			<div class="col">
				<h5>{$_('nav.branches')}</h5>
				<BranchSlider />
			</div>
		</div>
	</div>
</section>

<section class="faq py-5" style="background-color: #f9f9f9;">
	<div class="container">
		<div class="row">
			<div class="col">
				<h5>{$_('home.faq')}</h5>
			</div>
		</div>
	</div>
</section>

<style>
	.categories {
		background-color: aliceblue;
	}
	.jumbotron {
		padding-block: 3rem;
		background-color: #e2e9ef;
		background-image: url('https://tekoplast.az/img/docktrbg.png');
		background-size: cover;
		background-blend-mode: overlay;
	}
</style>
