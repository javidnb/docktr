<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
	import Search from '$lib/helpers/Search.svelte';
	import { _ } from 'svelte-i18n';
	import Modal from '$lib/helpers/Modal.svelte';
	import Gpt from '$lib/components/Gpt.svelte';
	import { loginModal, mobile, showGPT, zoomIn, zoomOut } from '$lib/store/dataStore';
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';
	import Legal from './appointments/Legal.svelte';
	import Usage from './usage/Usage.svelte';
</script>

<div style="overflow-x: hidden;">
	<div>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<section style="overflow-x: hidden; position: relative">
			<div
				class="jumbotron homeJumbo"
				style="padding-block: 3rem;
					background-color: #e2e9ef;
					background-image: url('https://tekoplast.az/img/docktrbg.png');
					background-size: cover;
					background-blend-mode: overlay;"
			>
				<div class="container">
					<div class="row justify-content-center" in:zoomIn>
						<div class="col col-md-8 d-flex align-items-center flex-column text-center">
							<div style="min-height: 180px;">
								<img
									src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
									alt="Sehiyye logo"
									class="s-kraNrqFQQjoV mt-auto"
									style="width: 200px; margin-top: -1rem!important"
								/>
							</div>

							<!-- <h1
								class="display-4"
								style="font-size: 19px; color: #008037; font-family: 'Nunito', sans-serif"
							>
								{$_('home.hero')}
							</h1> -->
							<p
								class="lead mb-0 py-2"
								style="color: #008037;
								font-size: clamp(0.8rem, 4vw, 1.2rem);
								font-family: 'DM Sans';
								white-space: nowrap;
								margin-top: -10px;"
							>
								{$_('home.lead')}
							</p>
							<div class="col-12 col-md-10">
								<div class="pcOnly w-100">
									<Search />
								</div>
								<div class="w-100 mobileOnly">
									<button
										class="btn btn-outline-primary bg-white w-100 mt-3"
										style="position: relative;
											border-radius: 20px;
											padding-left: 1rem;
											background-color: #639057 !important;
											color: white;
											padding-block: 15px !important;
											font-family: 'Alumni Sans';
											display: flex;"
										on:click={() => {
											goto('/search');
										}}
									>
										<div class="d-flex flex-column" style="width: calc(100% - 50px)">
											<div class="d-flex gap-2 align-items-center w-100" style="font-size: 24px;">
												<span class="mx-auto">Yeni Görüş Al</span>
											</div>
											<img
												src="https://ik.imagekit.io/d2nwsj0ktvh/online_VP_k7pe75.png"
												alt="Get Appointment"
												style="width: 85px;
													max-width: 20vw;
													position: absolute;
													right: 1rem;
													top: 50%;
													transform: translateY(-50%);"
											/>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					$session.user ? goto('/profile') : loginModal.set(true);
				}}
				class="mobileOnly"
				style="position: absolute; right: 10px; top: 10px;"
			>
				{#if $session.user?.photoURL}
					<div
						class="d-flex"
						style="min-height: 60px; 
						min-width: 60px; display: flex; 
						align-items: center; 
						justify-content: center"
					>
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<img
							src={$session.user?.photoURL}
							alt="Profile Photo"
							style="max-height: 40px;
							border-radius: 35%;
							background: rgb(248 248 248);
							box-shadow: 0px 0px 5px #00000012;
							padding: 2px;
							aspect-ratio: 1 / 1;
							object-fit: cover;
							object-position: center;"
						/>
					</div>
				{:else}
					<span
						style="font-size: 30px !important;
							color: rgb(150 199 137);
							background: rgb(248 248 248);
							border-radius: 35%;
							box-shadow: 0px 0px 5px #00000012;
							padding: 7px;"
						class="material-symbols-outlined icon-fill">person</span
					>
				{/if}
			</div>
		</section>
		<section class="categories py-5">
			<div class="container">
				<div class="row">
					<div class="col">
						<h5
							class="text-center"
							style="color: var(--primaryText); font-family: 'Montserrat', sans-serif; margin-top: -2rem; padding-left: 10px"
						>
							Həkimlər və {$_('nav.branches')}
						</h5>
						<BranchSlider />
					</div>
				</div>
			</div>
		</section>
		<section class="faq pb-5 pt-4" style="background-color: #0000000a;">
			<div class="container pb-3">
				<div class="row">
					<div class="col">
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
									style="max-height: 300px; overflow-y: scroll"
								>
									<div class="accordion-body">
										<Usage />
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
									style="max-height: 300px; overflow-y: scroll"
								>
									<div class="accordion-body">
										{@html $_('faq.faqs')}
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
									style="max-height: 300px; overflow-y: scroll"
								>
									<div class="accordion-body">
										<Legal termsOnly />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>

{#if !$showGPT}
	<button
		class="btn btn-outline-primary btnContact pcOnly"
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
