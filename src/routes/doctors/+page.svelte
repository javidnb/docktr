<script async script lang="ts">
	import { getData } from '$lib/firebase.client';
	import { onMount } from 'svelte';
	import { diseases } from '$lib/diseases';

	let dataLoading: boolean = true;
	let doctors: any = [];

	onMount(async () => {
		try {
			doctors = await getData('doctors');
			dataLoading = false;
			console.log(doctors);
		} catch (error) {
			console.error('Error fetching data:', error);
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
	<div class="container">
		<div class="row">
			<div class="col">
				<div class="d-flex gap-3">
					{#if dataLoading}
						{#each [1, 2] as doctor}
							<div class="card">
								<div
									class="card-body d-flex flex-column align-items-center justify-content-center"
									style="min-height: 15rem; background-color: #ececec"
								>
									Loading
								</div>
							</div>
						{/each}
					{:else}
						{#each doctors as doctor, i}
							<div class="card">
								<div class="card-body d-flex flex-column align-items-center">
									<img src={doctor.img} alt="Some Doc" />
									<a
										class="card-link"
										href="./"
										style="text-decoration: none; text-align: center;
					margin-block: auto;">{doctor.name}</a
									>
									<div class="branch">
										{#each doctor.branches as br}
											<span>{getBranchName(br)}</span>
										{/each}
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
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
	}
	.card img {
		max-height: 10rem;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		object-position: top;
	}
	.branch {
		display: flex;
		gap: 10px;
	}
</style>
