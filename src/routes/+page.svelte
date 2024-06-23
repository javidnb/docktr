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
				<div class="accordion mt-3" id="accordionExample">
					<div class="accordion-item">
						<h2 class="accordion-header">
							<button
								class="accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#collapseOne"
								aria-expanded="true"
								aria-controls="collapseOne"
							>
								Accordion Item #1
							</button>
						</h2>
						<div
							id="collapseOne"
							class="accordion-collapse collapse show"
							data-bs-parent="#accordionExample"
						>
							<div class="accordion-body">
								<strong>This is the first item's accordion body.</strong> It is shown by default,
								until the collapse plugin adds the appropriate classes that we use to style each
								element. These classes control the overall appearance, as well as the showing and
								hiding via CSS transitions. You can modify any of this with custom CSS or overriding
								our default variables. It's also worth noting that just about any HTML can go within
								the <code>.accordion-body</code>, though the transition does limit overflow.
							</div>
						</div>
					</div>
					<div class="accordion-item">
						<h2 class="accordion-header">
							<button
								class="accordion-button collapsed"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#collapseTwo"
								aria-expanded="false"
								aria-controls="collapseTwo"
							>
								Accordion Item #2
							</button>
						</h2>
						<div
							id="collapseTwo"
							class="accordion-collapse collapse"
							data-bs-parent="#accordionExample"
						>
							<div class="accordion-body">
								<strong>This is the second item's accordion body.</strong> It is hidden by default,
								until the collapse plugin adds the appropriate classes that we use to style each
								element. These classes control the overall appearance, as well as the showing and
								hiding via CSS transitions. You can modify any of this with custom CSS or overriding
								our default variables. It's also worth noting that just about any HTML can go within
								the <code>.accordion-body</code>, though the transition does limit overflow.
							</div>
						</div>
					</div>
					<div class="accordion-item">
						<h2 class="accordion-header">
							<button
								class="accordion-button collapsed"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#collapseThree"
								aria-expanded="false"
								aria-controls="collapseThree"
							>
								Accordion Item #3
							</button>
						</h2>
						<div
							id="collapseThree"
							class="accordion-collapse collapse"
							data-bs-parent="#accordionExample"
						>
							<div class="accordion-body">
								<strong>This is the third item's accordion body.</strong> It is hidden by default,
								until the collapse plugin adds the appropriate classes that we use to style each
								element. These classes control the overall appearance, as well as the showing and
								hiding via CSS transitions. You can modify any of this with custom CSS or overriding
								our default variables. It's also worth noting that just about any HTML can go within
								the <code>.accordion-body</code>, though the transition does limit overflow.
							</div>
						</div>
					</div>
				</div>
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
