<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
	import Search from '$lib/helpers/Search.svelte';
	import { _ } from 'svelte-i18n';
	import Modal from '$lib/helpers/Modal.svelte';

	let showModal: boolean = false;
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
						<div class="w-100">
							<Search />
						</div>
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
				<!-- <h5>{$_('nav.branches')}</h5> -->
				<BranchSlider />
			</div>
		</div>
	</div>
</section>

<section class="faq pb-5 pt-4" style="background-color: #f9f9f9;">
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
								{$_('faq.q1')}
							</button>
						</h2>
						<div
							id="collapseOne"
							class="accordion-collapse collapse show"
							data-bs-parent="#accordionExample"
						>
							<div class="accordion-body">
								{$_('faq.a1')}
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
								{$_('faq.q2')}
							</button>
						</h2>
						<div
							id="collapseTwo"
							class="accordion-collapse collapse"
							data-bs-parent="#accordionExample"
						>
							<div class="accordion-body">
								{$_('faq.a2')}
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
								{$_('faq.q3')}
							</button>
						</h2>
						<div
							id="collapseThree"
							class="accordion-collapse collapse"
							data-bs-parent="#accordionExample"
						>
							<div class="accordion-body">
								{$_('faq.a3')}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<Modal bind:showModal fullScreen={true}>
	<div class="d-flex flex-column h-100">
		<Search />
		<div class="d-flex my-auto justify-content-center">
			{$_('nav.docs')}, {$_('nav.branches')}, {$_('nav.diseases')}, {$_('home.symptoms')}
		</div>
	</div>
</Modal>

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
	.accordion-button {
		font-weight: 500;
		background-color: #a1c39854;
		color: #3a4138;
	}
	.accordion-button:not(.collapsed) {
		background-color: var(--primaryColor);
		color: white;
	}
	.accordion-button:focus {
		box-shadow: none;
	}
</style>
