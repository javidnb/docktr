<script async script lang="ts">
	import { doctors } from '$lib/store/dataStore';
	import DoctorCard from '$lib/components/DoctorCard.svelte';
	import Search from '$lib/helpers/Search.svelte';
	import { diseases } from '$lib/store/diseases';
	import { _ } from 'svelte-i18n';

	let selectedOption: any;

	$: filteredDocs =
		selectedOption != 0
			? $doctors.filter((doc: any) => doc.branches.includes(selectedOption))
			: $doctors;

	function handleChange(event: any) {
		// console.log(event.target.value);
		// console.log($doctors);
		// console.log(selectedOption);
	}

	// clear input on escape
	function handleKeydown(event: any) {
		if (event.key === 'Escape') {
			selectedOption = 0;
		}
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.docs')}</h1>
		<hr />
	</div>
</section>

<section class="pt-3 pb-5" style="background-color: aliceblue;">
	<div class="container pb-5">
		<div class="row mb-3">
			<div class="col-sm-12 col-md-4">
				<div class="input-group input-group-lg mb-3 mt-2">
					<div class="input-group-text" style="background-color: var(--primaryColor); color: white">
						<span class="material-symbols-outlined">category </span>
					</div>
					<select
						class="form-control"
						id="cars"
						bind:value={selectedOption}
						on:change={handleChange}
						on:keydown={handleKeydown}
						placeholder="Şöbələr"
					>
						<option disabled selected value="0">{$_('nav.branches')}</option>
						{#each diseases as option}
							<option value={option.id}>{option.name}</option>
						{/each}
					</select>
					{#if selectedOption != 0}
						<button class="input-group-text" on:click={() => (selectedOption = 0)}>
							<span class="material-symbols-outlined">close </span>
						</button>
					{/if}
				</div>
			</div>
			<div class="col-sm-12 col-md-8"><Search /></div>
		</div>
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
			{:else if filteredDocs.length}
				{#each filteredDocs as doctor}
					<div class="col col-md-6 col-lg-4">
						<DoctorCard props={doctor} />
					</div>
				{/each}
			{:else}
				<div class="col col-md-6 col-lg-4"><h4>{$_('other.notFound')}</h4></div>
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
