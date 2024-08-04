<script async script lang="ts">
	import { onDestroy } from 'svelte';
	import { doctors, selectedBranch, langs } from '$lib/store/dataStore';
	import DoctorCard from '$lib/components/DoctorCard.svelte';
	import { diseases } from '$lib/store/diseases';
	import { _ } from 'svelte-i18n';
	import Select from 'svelte-select';
	import { writable } from 'svelte/store';

	$: filteredDocs = $doctors;

	let diss = diseases.map((d) => ({ value: d.id, label: d.name }));
	let selectedLangs: any = writable(null);

	let orderBy = [
		{ value: 1, label: $_('doctor.order_by_point') },
		{ value: 2, label: 'Ada Görə' }
	];
	let selectedOrder: any = writable(null);

	$: if ($selectedLangs || $selectedBranch || $selectedOrder) filterDocs();

	function filterDocs() {
		if ($doctors.length) {
			let docs = $doctors;
			if ($selectedBranch) {
				docs = docs.filter((doc: any) => doc.branches.includes($selectedBranch));
			}
			if ($selectedLangs) {
				docs = docs.filter((doc: any) => {
					return doc.langs ? JSON.parse(doc.langs).includes($selectedLangs) : false;
				});
			}

			if ($selectedOrder == 1) {
				docs = docs.sort((a, b) => b.star - a.star);
			}
			if ($selectedOrder == 2) {
				docs = docs.sort((a, b) =>
					a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
				);
			}
			console.log(docs);
			filteredDocs = docs;
		}
	}

	onDestroy(() => {
		selectedBranch.set(null);
	});
</script>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.docs')}</h1>
	</div>
</section>

<section class="pt-3 pb-5" style="background-color: aliceblue;">
	<div class="container pb-5">
		<div class="row mb-3">
			<div class="col">
				<button
					class="btn btn-outline-primary btnFilter d-flex w-100"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#collapseExample"
					aria-expanded="false"
					aria-controls="collapseExample"
				>
					<span class="material-symbols-outlined"> filter_alt </span>
					<span class="mx-auto">Filter</span>
				</button>
				<div class="collapse filterCollapse" id="collapseExample">
					<div class="row mt-md-3 row-gap-2">
						<div class="col-md-4">
							<div class="input-group input-group-lg">
								<Select
									class="form-control"
									items={diss}
									placeholder={$_('nav.branches')}
									id="branches"
									--border-radius="8px"
									--border-focused="1px solid var(--primaryColor)"
									--item-is-active-bg="var(--primaryColor)"
									--item-hover-bg="#d9e1d7"
									on:change={(event) => {
										selectedBranch.set(event.detail.value);
									}}
									on:clear={() => {
										selectedBranch.set(null);
										filterDocs();
									}}
								>
									<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
										<span class="material-symbols-outlined"> category </span>
									</div>
								</Select>
							</div>
						</div>
						<div class="col-md-4">
							<Select
								class="form-control"
								items={langs}
								placeholder={$_('doctor.langs_spoken')}
								id="langs"
								--border-radius="8px"
								--border-focused="1px solid var(--primaryColor)"
								--item-is-active-bg="var(--primaryColor)"
								--item-hover-bg="#d9e1d7"
								searchable={false}
								on:change={(event) => {
									selectedLangs.set(event.detail.value);
								}}
								on:clear={() => {
									selectedLangs.set(null);
									filterDocs();
								}}
							>
								<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
									<span class="material-symbols-outlined"> language </span>
								</div>
							</Select>
						</div>
						<div class="col-md-4">
							<Select
								class="form-control"
								items={orderBy}
								placeholder={$_('doctor.order_by')}
								id="orderBy"
								--border-radius="8px"
								--border-focused="1px solid var(--primaryColor)"
								--item-is-active-bg="var(--primaryColor)"
								--item-hover-bg="#d9e1d7"
								searchable={false}
								on:change={(event) => {
									selectedOrder.set(event.detail.value);
								}}
								on:clear={() => {
									selectedOrder.set(null);
									filterDocs();
								}}
							>
								<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
									<span class="material-symbols-outlined"> swap_vert </span>
								</div>
							</Select>
						</div>
					</div>
				</div>
			</div>
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

	@media screen and (min-width: 768px) {
		.filterCollapse {
			display: block;
			height: auto !important;
			visibility: visible;
		}
		.btnFilter {
			display: none !important;
		}
	}
	@media screen and (max-width: 768px) {
		.mt-md-3 {
			margin-top: 1rem;
		}
	}
</style>
