<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { diseases } from '$lib/store/diseases';
	import { _ } from 'svelte-i18n';
	import { selectedSymptoms, selectedBranch } from '$lib/store/dataStore';
	import Search from '$lib/helpers/Search.svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import Select from 'svelte-select';

	onDestroy(() => {
		selectedSymptoms.set([]);
	});

	let selectedDiseases: any = writable([]);
	let items = [];

	onMount(() => {
		if (diseases.length) {
			for (const category of diseases) {
				for (const [conditionName, symptoms] of Object.entries(category.conditions)) {
					symptoms.forEach((sm) => items.push(sm));
				}
			}
			items = Array.from(new Set(items));
		}
	});

	function filterCategories(searchString: string[]) {
		selectedDiseases.set([]);
		for (const category of diseases) {
			for (const [conditionName, symptoms] of Object.entries(category.conditions)) {
				if (searchString.every((value: any) => symptoms.includes(value))) {
					selectedDiseases.set([
						...$selectedDiseases,
						{ id: category.id, name: category.name, condition: conditionName }
					]);
				}
			}
		}
	}

	function handleSelect(event) {
		if (event.detail?.length) {
			let selected = event.detail.map((a) => a.value);
			selectedSymptoms.set(selected);
		} else {
			selectedSymptoms.set([]);
		}
	}

	$: if ($selectedSymptoms.length) {
		filterCategories($selectedSymptoms);
	}

	const charMap: any = {
		ç: 'c',
		ğ: 'g',
		ı: 'i',
		ö: 'o',
		ş: 's',
		ü: 'u',
		Ç: 'C',
		Ğ: 'G',
		İ: 'I',
		Ö: 'O',
		Ş: 'S',
		Ü: 'U',
		Ə: 'e',
		ə: 'e'
	};

	function latinize(str: string) {
		return str
			.replace(/[çğıöşüÇĞİÖŞÜƏə]/g, (match) => charMap[match])
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/\s+/g, '')
			.toLowerCase();
	}

	function customFilter(options, searchTerm) {
		if (!searchTerm) {
			return options;
		}
		return latinize(options).includes(latinize(searchTerm));
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.diseases')}</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>
<div class="container-fluid mb-3">
	<div class="container">
		{#if $selectedSymptoms.length}
			<!-- <div class="row mt-3">
				<div class="col">
					<div
						class="d-flex align-items-center"
						style="background: #0000000f;
							border-radius: 8px;
							padding-left: 1rem;"
					>
						<h5 style="margin-bottom: 0;">{$_('home.symptoms')}</h5>
						<button
							class="symptom d-flex align-items-center gap-2 ms-4"
							style="border: 0px;"
							on:click={() => {
								selectedSymptoms.set([]);
								selectedDiseases.set([]);
							}}
							><span class="material-symbols-outlined"> contract_delete </span>{$_(
								'actions.clear'
							)}</button
						>
					</div>
					<div class="d-flex">
						{#each $selectedSymptoms as sym}
							<span class="symptom">
								{sym}
							</span>
						{/each}
					</div>
				</div>
			</div> -->
			<div class="row mt-3">
				<div class="col">
					<!-- <div
						class="d-flex align-items-center"
						style="background: #0000000f;
							border-radius: 8px;
							padding-left: 1rem; height: 50px"
					>
						<h5 style="margin-bottom: 0">{$_('nav.diseases')}</h5>
					</div> -->

					<div class="d-flex flex-wrap gap-3 mt-3">
						{#each $selectedDiseases as item}
							<button
								class="diseases p-2 px-4"
								on:click={() => {
									selectedBranch.set(item.id);
									goto('doctors');
								}}
							>
								<h5 style="margin:0">{item.condition}</h5>
								<h6 style="margin:0; color: var(--primaryColor)">{item.name}</h6>
								<!-- {#each Object.entries(item.conditions) as [key, value]}
									<span>{key}</span>
								{/each} -->
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
		<div class="row mt-3">
			<div class="col">
				<Select
					class="form-control"
					{items}
					isMulti={true}
					on:select={handleSelect}
					closeListOnChange={false}
					itemFilter={customFilter}
					placeholder={$_('home.search')}
					noOptionsMessage={$_('other.notFound')}
				/>
			</div>
		</div>
	</div>
</div>

<style type="text/css">
	.diseases {
		text-decoration: none;
		width: fit-content;
		min-width: 250px;
		border: 0px;
		box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.34);
		border-radius: 6px;
		background-color: white;
	}
	.symptom {
		padding: 5px 15px;
		border-radius: 20px;
		margin: 5px;
		margin-top: 10px;
		box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.34);
		background-color: white;
		width: max-content;
	}
	:global(.clearSelect) {
		display: flex;
	}
	/* :global(.selectContainer) {
		border-radius: 8px;
		border-color: var(--primaryColor);
	} */
</style>
