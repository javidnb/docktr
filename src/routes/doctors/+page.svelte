<script async script lang="ts">
	import { doctors } from '$lib/store/dataStore';
	import DoctorCard from '$lib/components/DoctorCard.svelte';
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Doktorlar</h1>
		<hr />
	</div>
</section>

<section class="py-5" style="background-color: aliceblue;">
	<div class="container pb-5">
		<div class="row row-gap-3">
			{#if !$doctors.length}
				{#each [1, 2, 3] as doctor}
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
				{#each $doctors as doctor}
					<div class="col col-md-6 col-lg-4">
						<DoctorCard props={doctor} />
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
