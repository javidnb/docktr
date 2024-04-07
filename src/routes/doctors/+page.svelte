<script async script lang="ts">
	import { getData } from '$lib/firebase.client';
	import { onMount } from 'svelte';
	import { diseases } from '$lib/diseases';
	import { doctors } from '$lib/data';

	let dataLoading: boolean;

	onMount(async () => {
		if (!$doctors.length) {
			dataLoading = true;
			try {
				let docs = await getData('doctors');
				doctors.set(docs);
				dataLoading = false;
			} catch (error) {
				console.error('Error fetching data:', error);
				dataLoading = false;
			}
		}
	});

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 3rem; background-color: #e2e9ef">
		<h1 class="display-4">Doktorlar</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr class="my-4" />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<section class="py-5" style="background-color: aliceblue;">
	<div class="container pb-5">
		<div class="row row-gap-3">
			{#if dataLoading}
				{#each [1, 2] as doctor}
					<div class="col col-md-6 col-lg-4">
						<div class="card skeleton">
							<div
								class="card-body d-flex flex-column align-items-center justify-content-center"
								style="min-height: 15rem;"
							></div>
						</div>
					</div>
				{/each}
			{:else}
				{#each $doctors as doctor, i}
					<div class="col col-md-6 col-lg-4">
						<a href="/doctors/{doctor.slug}" class="card" style="text-decoration: none;">
							<div class="card-body d-flex flex-column align-items-center">
								<div class="row">
									<div class="col-5 d-flex flex-column">
										<img src={doctor.img} alt="Some Doc" />
										<span style="color: #rgb(99 141 88)" class="d-flex justify-content-center mt-2"
											>5 <span class="material-symbols-outlined"> star_rate </span> | 0 Yorum</span
										>
									</div>
									<div class="col-7 text-center d-flex flex-column">
										<span
											style="text-decoration: none;
											text-align: center;
											margin-block: 10px 5px;
											font-size: large;
											font-weight: 600;">{doctor.name}</span
										>
										<div class="branch">
											{#each doctor.branches as br}
												<span>{getBranchName(br)}</span>
											{/each}
										</div>
									</div>
								</div>

								<div class="row mt-2 w-100">
									<div class="col">
										<p>{doctor.details}</p>
									</div>
								</div>

								<div class="row w-100">
									<div class="col"></div>
								</div>
							</div>
						</a>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	.card {
		min-width: 20rem;
		min-height: 10rem;
		border: 0px;
		box-shadow: 0px 0px 5px #00000012;
		border-radius: 20px;
		text-decoration: none;
	}
	.card:hover {
		box-shadow: 0px 0px 5px #00000032;
	}
	.card img {
		max-width: 100%;
		aspect-ratio: 2 / 1.5;
		object-fit: cover;
		object-position: top;
		border-radius: 10px;
	}
	.branch {
		display: flex;
		gap: 10px;
		color: #444444;
		font-size: small;
	}

	.skeleton {
		animation: skeleton-loading 1s linear infinite alternate;
	}

	@keyframes skeleton-loading {
		0% {
			background-color: hsl(200deg 21.42% 87.98%);
		}
		100% {
			background-color: hsl(200, 20%, 95%);
		}
	}
</style>
