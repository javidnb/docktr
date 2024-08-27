<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { diseases } from '$lib/store/diseases';
	import { _ } from 'svelte-i18n';
	import { selectedSymptoms, selectedBranch, doctors } from '$lib/store/dataStore';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import Select from 'svelte-select';

	onDestroy(() => {
		selectedSymptoms.set([]);
	});

	let selectedDiseases: any = writable([]);
	let items: any = [];
	let diss = diseases
		.map((branch) => {
			const doctorCount = $doctors.filter((doctor: any) =>
				doctor.branches.includes(branch.id)
			).length;
			return { ...branch, doctorCount };
		})
		.filter((b) => b.doctorCount > 0);

	onMount(() => {
		if (diss.length) {
			for (const category of diss) {
				for (const [conditionName, symptoms] of Object.entries(category.conditions)) {
					symptoms.forEach((sm: any) => items.push(sm));
				}
			}
			items = Array.from(new Set(items));
		}
	});

	function filterCategories(searchString: string[]) {
		selectedDiseases.set([]);
		for (const category of diss) {
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

	function handleSelect(event: any) {
		if (event.type == 'clear') {
			if (event.detail.length) {
				selectedSymptoms.set([]);
			} else {
				let arr = $selectedSymptoms;
				arr.splice(arr.indexOf(event.detail.value), 1);
				selectedSymptoms.set([...arr]);
			}
		} else {
			selectedSymptoms.set([...$selectedSymptoms, event.detail.value]);
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

	function customFilter(options: any, searchTerm: any) {
		if (!searchTerm) {
			return options;
		}
		return latinize(options).includes(latinize(searchTerm));
	}
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.diseases')}</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>
<div class="container-fluid mb-3">
	<div class="container">
		<div class="row mt-3">
			<div class="col">
				<!-- closeListOnChange={false} -->
				<Select
					class="form-control"
					{items}
					multiple
					on:select={handleSelect}
					on:clear={handleSelect}
					itemFilter={customFilter}
					value={$selectedSymptoms}
					placeholder={$_('other.search_symptoms')}
					placeholderAlwaysShow
					--border-radius="8px"
					--border-focused="1px solid var(--primaryColor)"
				>
					<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
						<span class="material-symbols-outlined"> search </span>
					</div>
				</Select>
				<!-- noOptionsMessage={$_('other.notFound')} -->
			</div>
		</div>
		{#if $selectedSymptoms.length}
			<div class="row mt-3">
				<div class="col">
					<div class="d-flex flex-wrap gap-3 mt-3">
						{#each $selectedDiseases as item}
							<button
								class="card diseases p-2 px-4 align-items-center"
								on:click={() => {
									selectedBranch.set({ value: item.id });
									goto('doctors');
								}}
							>
								<h5 style="margin:0">{item.condition}</h5>
								<h6 style="margin:0; color: var(--primaryColor)">{item.name}</h6>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style type="text/css">
	.diseases {
		text-decoration: none;
		width: fit-content;
		min-width: 250px;
		border: 0px;
		border-radius: 14px;
		background-color: white;
		flex: 1;
		max-width: 500px;
	}
	/* .symptom {
		padding: 5px 15px;
		border-radius: 20px;
		margin: 5px;
		margin-top: 10px;
		box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.34);
		background-color: white;
		width: max-content;
	} */
	:global(.clearSelect) {
		display: flex;
	}
	/* :global(.selectContainer) {
		border-radius: 8px;
		border-color: var(--primaryColor);
	} */
</style>
