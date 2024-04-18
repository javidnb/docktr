<script lang="ts">
	import { page } from '$app/stores';
	import { doctors } from '$lib/store/dataStore';
	import { diseases } from '$lib/store/diseases';
	import { onMount } from 'svelte';

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);
	// $: console.log('brenc: ', doctor?.branches);

	onMount(async () => {});

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{doctor?.name || ''}</h1>
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<section class="my-3">
	<div class="container">
		<div class="row">
			<div class="col-md-8">
				<div class="row">
					<div class="col col-md-4">
						<img
							src={doctor?.img}
							alt={doctor?.name}
							style="max-width: 250px;
							aspect-ratio: 2 / 1.5;
							object-fit: cover;
							object-position: top;
							border-radius: 10px;"
						/>
					</div>
					<div class="col col-md-8">
						{#if doctor?.branches}
							<div class="branch d-flex gap-3">
								{#each doctor.branches as br}
									<span>{getBranchName(br)}</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div class="row mt-3">
					<div class="card p-3">
						<div class="card-title">Həkim haqqında</div>
						<div class="card-body">
							{doctor?.details}
						</div>
					</div>
				</div>
				<div class="row mt-3">
					<div class="card p-3">
						<div class="card-title">Yorumlar</div>
						<div class="card-body">Yorumlar</div>
					</div>
				</div>
			</div>
			<div class="col-md-4 h-100">
				<div class="card p-3 h-100">
					<h4>Randevu al</h4>
				</div>
			</div>
		</div>
	</div>
</section>
