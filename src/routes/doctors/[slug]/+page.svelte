<script lang="ts">
	import { page } from '$app/stores';
	import { doctors } from '$lib/store/dataStore';
	import { diseases } from '$lib/store/diseases';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);
	// $: console.log('brenc: ', doctor?.branches);
	let truncate: boolean = true;
	let selectedStarPoint: number;

	onMount(async () => {});

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}

	function truncateString(str: string, maxLength: number) {
		return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
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
			<div class="col-12">
				<div class="row">
					<div class="col-12 col-md-3">
						<img
							src={doctor?.img}
							alt={doctor?.name}
							style="width: max(170px , 100%);
							aspect-ratio: 1/1;
							object-fit: cover;
							object-position: top;
							border-radius: 100%;"
						/>
					</div>
					<div class="col-12 col-md-9">
						{#if doctor?.branches}
							<div class="branch d-flex gap-3">
								{#each doctor.branches as br}
									<span>{getBranchName(br)}</span>
								{/each}
							</div>
						{/if}
						<button
							class="btn btn-outline-primary d-flex justify-content-center align-items-center py-3 mt-3"
							style="min-width: 250px; border-radius: 20px; font-size: large"
							><span class="material-symbols-outlined">local_library</span><span
								style="margin-inline: auto;">Randevu Al</span
							></button
						>
					</div>
				</div>
				<div class="row mt-3">
					<div class="card p-3">
						<div class="card-title">Həkim haqqında</div>
						<div class="card-body d-flex flex-column">
							{#if doctor?.details}
								{truncate ? truncateString(doctor?.details, 400) : doctor?.details}
								{#if doctor?.details.length > 400}
									<button
										class="btn btn-outline-primary mt-3 d-flex justify-content-center align-items-center"
										style="max-width: 200px;"
										on:click={() => {
											truncate = !truncate;
										}}
										>{@html truncate
											? `<span class="material-symbols-outlined">expand_all</span><span style='margin-inline:auto'>Daha çox</span>`
											: `<span class="material-symbols-outlined">collapse_all</span><span style='margin-inline:auto'>Azalt</span>`}</button
									>
								{/if}
							{/if}
						</div>
					</div>
				</div>
				<div class="row mt-3">
					<div class="card p-3">
						<div class="card-title">Yorumlar</div>
						{#if $session.loggedIn}
							<div class="col-12 col-md-8">
								<form class="d-flex flex-column">
									<div class="d-flex">
										{#each [1, 2, 3, 4, 5] as star, index}
											<button
												on:click|preventDefault={() => (selectedStarPoint = index + 1)}
												class="material-symbols-outlined star"
												class:icon-fill={selectedStarPoint >= star}
											>
												star
											</button>
										{/each}
									</div>

									<!-- <input
										class="form-control"
										type="number"
										name="point"
										id="point"
										min="1"
										max="5"
									/> -->
									<label for="comment">Yorumunuz</label>
									<textarea class="form-control" name="comment" id="comment" />
									<button class="btn btn-outline-primary mt-3" type="submit">Göndər</button>
								</form>
							</div>
						{/if}
						<div class="card-body">Yorumlar</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.card {
		cursor: auto;
	}
	.star {
		border: 0px;
		background: none;
		color: var(--primaryColor);
	}
</style>
