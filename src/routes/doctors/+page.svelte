<script async script lang="ts">
	import { onDestroy } from 'svelte';
	import { doctors, selectedBranch, langs, mobile } from '$lib/store/dataStore';
	import DoctorCard from '$lib/components/DoctorCard.svelte';
	import { diseases } from '$lib/store/diseases';
	import { _ } from 'svelte-i18n';
	import Select from 'svelte-select';
	import { writable } from 'svelte/store';

	$: filteredDocs = $doctors;

	let diss = diseases
		.map((branch) => {
			const doctorCount = $doctors.filter((doctor) => doctor.branches.includes(branch.id)).length;
			return { ...branch, doctorCount };
		})
		.filter((b) => b.doctorCount > 0)
		.map((d) => ({ value: d.id, label: d.name }))
		.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
	let selectedLangs: any = writable(null);
	let filterNo: number = 0;

	let orderBy = [
		{ value: 1, label: $_('doctor.order_by_point') },
		{ value: 2, label: 'Ada Görə' }
	];
	let selectedOrder: any = writable(null);

	$: if ($selectedLangs || $selectedBranch || $selectedOrder) filterDocs();

	function filterDocs() {
		filterNo = 0;
		if ($doctors.length) {
			let docs = $doctors;
			if ($selectedBranch) {
				docs = docs.filter((doc: any) => doc.branches.includes($selectedBranch.value));
				filterNo += 1;
			}
			if ($selectedLangs) {
				docs = docs.filter((doc: any) => {
					return doc.langs ? JSON.parse(doc.langs).includes($selectedLangs) : false;
				});
				filterNo += 1;
			}

			if ($selectedOrder == 1) {
				docs = docs.sort((a, b) => b.star - a.star);
				filterNo += 1;
			}
			if ($selectedOrder == 2) {
				docs = docs.sort((a, b) =>
					a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
				);
				filterNo += 1;
			}
			filteredDocs = docs;
		}
	}

	onDestroy(() => {
		selectedBranch.set(null);
	});
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.docs')}</h1>
	</div>
</section>

<section class="pt-3 pb-5">
	<div class="container pb-5">
		<div class="row mb-3">
			<div class="col">
				<!-- <button
					class="btn btn-outline-primary btnFilter d-flex w-100"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#collapseExample"
					aria-expanded="false"
					aria-controls="collapseExample"
					style="position: relative;
						box-shadow: rgba(0, 0, 0, 0.07) 0px 0px 5px;
						border-radius: 14px;
						padding-block: 8px;"
				>
					<span class="material-symbols-outlined"> filter_alt </span>
					<div class="mx-auto d-flex gap-1">
						<span>Filter</span>
						{#if filterNo != 0}
							<span
								style="background-color: rgb(0 0 0 / 41%);
								border-radius: 100%;
								font-size: 10px;
								width: 15px;
								height: 14px;
								display: inline-flex;
								color: white;
								justify-content: center;
								align-items: center;">{filterNo}</span
							>
						{/if}
					</div>
				</button> -->
				<div class="collapse filterCollapse show" id="collapseExample">
					<div class="row row-gap-2">
						<div class="col-md-4">
							<div class="input-group input-group-lg">
								<Select
									class="form-control"
									items={diss}
									placeholder={$_('nav.branches')}
									id="branches"
									value={$selectedBranch}
									--border-radius="14px"
									--border-focused="1px solid var(--primaryColor)"
									--item-is-active-bg="var(--primaryColor)"
									--item-hover-bg="#d9e1d7"
									on:change={(event) => {
										selectedBranch.set(event.detail);
									}}
									on:clear={() => {
										selectedBranch.set(null);
										filterDocs();
									}}
									searchable={$mobile ? false : true}
								>
									<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
										<span class="material-symbols-outlined"> arrow_drop_down </span>
									</div>
								</Select>
							</div>
						</div>
						<!-- <div class="col-md-4">
							<Select
								class="form-control"
								items={langs}
								placeholder={$_('doctor.langs_spoken')}
								id="langs"
								--border-radius="14px"
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
						</div> -->
						<div class="col-md-4">
							<Select
								class="form-control"
								items={orderBy}
								placeholder={$_('doctor.order_by')}
								id="orderBy"
								--border-radius="14px"
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

	.btnFilter:not(:hover) {
		background-color: white;
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
</style>
