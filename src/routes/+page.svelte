<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
	import Search from '$lib/helpers/Search.svelte';
	import { _ } from 'svelte-i18n';
	import Modal from '$lib/helpers/Modal.svelte';
	import Gpt from '$lib/components/Gpt.svelte';
	import { hideNav, mobile, showGPT } from '$lib/store/dataStore';
	import { goto } from '$app/navigation';
</script>

<section>
	<div
		class="jumbotron homeJumbo"
		style="padding-block: 3rem;
			background-color: #e2e9ef;
			background-image: url('https://tekoplast.az/img/docktrbg.png');
			background-size: cover;
			background-blend-mode: overlay;"
	>
		<div class="container">
			<div class="row justify-content-center">
				<div class="col col-md-8 d-flex align-items-center flex-column text-center">
					<img
						src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
						alt="Sehiyye logo"
						class="s-kraNrqFQQjoV mt-auto"
						style="width: 150px; margin-top: -1rem!important"
					/>
					<h1 class="display-4" style="font-size: 19px; color: #008037">{$_('home.hero')}</h1>
					<!-- <p class="lead">{$_('home.lead')}</p> -->
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
<section class="faq pb-5 pt-4" style="background-color: #0000000a;">
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

{#if !$showGPT}
	<button
		class="btn btn-outline-primary btnContact"
		on:click={() => {
			if ($mobile) {
				goto('/gpt');
				return;
			}
			showGPT.set(!$showGPT);
		}}
	>
		<span style="font-size: 30px" class="material-symbols-outlined icon-fill"> sms </span>
	</button>
{/if}

{#if !$mobile}
	<Modal bind:showModal={$showGPT}>
		<Gpt />
	</Modal>
{/if}

<style>
	.btnContact {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		padding: 0.8rem;
		box-shadow: 0px 0px 5px #00000035;
		background: white;
		color: var(--primaryColor);
		border-radius: 100%;
		display: flex;
		align-items: center;
	}

	.btnContact:hover {
		box-shadow: 0px 0px 6px #00000050;
	}

	@media screen and (max-width: 992px) {
		.btnContact {
			bottom: 4rem;
			right: 1rem;
		}
	}
</style>
