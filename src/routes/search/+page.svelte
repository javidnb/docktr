<script lang="ts">
	import { diseases } from '$lib/store/diseases';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { doctors, selectedSymptoms, selectedBranch, searchQuery } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import BranchSlider from '$lib/components/BranchSlider.svelte';

	let inputElement: any;
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
	let symptoms: any = writable([]);

	let diss = diseases
		.map((branch) => {
			const doctorCount = $doctors.filter((doctor) => doctor.branches.includes(branch.id)).length;
			return { ...branch, doctorCount };
		})
		.filter((b) => b.doctorCount > 0);

	let selection = { doctors: false, branches: false, diseases: false, symptoms: false };

	onMount(() => {
		inputElement.focus();
	});

	$: filteredResults = combineArrays($doctors, diss).filter((item) => {
		const query = latinize($searchQuery);
		if (item.type === 'doctor') {
			symptoms.set(Array.from(new Set($symptoms)));
			return latinize(item.name).includes(query);
		} else if (item.type === 'disease') {
			item.filteredConditions = Object.keys(item.conditions).reduce((acc: any, key: any) => {
				if (key.toLowerCase().includes(query)) {
					acc[key] = item.conditions[key];
				} else {
					const matchingValues = item.conditions[key].filter((value: any) =>
						latinize(value.toLowerCase()).includes(query)
					);
					if (matchingValues.length > 0) {
						acc[key] = matchingValues;
						acc[key].forEach((element: any) => {
							symptoms.set([...$symptoms, element]);
						});
					}
				}
				symptoms.set(Array.from(new Set($symptoms)));
				return acc;
			}, {});
			symptoms.set(Array.from(new Set($symptoms)));
			return latinize(item.name).includes(query) || Object.keys(item.filteredConditions).length > 0;
		}
		return false;
	});

	function combineArrays(doctors: any, diseases: any) {
		return [
			...doctors.map((doctor: any) => ({ ...doctor, type: 'doctor' })),
			...diseases.map((disease: any) => ({ ...disease, type: 'disease' }))
		];
	}

	function latinize(str: string) {
		return str
			.replace(/[çğıöşüÇĞİÖŞÜƏə]/g, (match) => charMap[match])
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/\s+/g, '')
			.toLowerCase();
	}

	// clear input on escape
	function handleKeydown(event: any) {
		symptoms.set([]);
		if (event.key === 'Escape') {
			searchQuery.set('');
		}
	}
</script>

<div class="w-100 pt-0" style="max-width: 100dvw; overflow: hidden; height: 100dvh;">
	<div
		class="input-group input-group-lg mb-3"
		style="padding: .5rem;
        background: var(--primaryColor);"
	>
		<span
			class="input-group-text d-flex align-items-center"
			style="position: absolute;
                background: unset;
                border: 0px;
                color: white;
                left: 0;
                top: 10px
            "
		>
			<span class="material-symbols-outlined" style=" font-size: 20px;"> search </span></span
		>
		<input
			type="search"
			class="form-control searchBox"
			aria-label="Sizing example input"
			aria-describedby="inputGroup-sizing-sm"
			placeholder={$_('home.search')}
			bind:value={$searchQuery}
			bind:this={inputElement}
			on:keydown={handleKeydown}
		/>

		<button
			class="input-group-text"
			style="background: unset;
                border: 0;
                font-size: small;
                height: 42px;
                color: #404040"
			on:click={() => {
				searchQuery.set('');
				history.back();
			}}>Ləğv et</button
		>
		<span
			class="input-group-text pcOnly"
			style="background: var(--primaryColor);
    color: white;"><span class="material-symbols-outlined"> search </span></span
		>
	</div>
	<div class="h-100 pb-3">
		{#if $searchQuery}
			<div
				class="d-flex flex-column row-gap-3 pb-3"
				style="position: absolute;
                    top: 58px;
                    z-index: 99;
                    padding-top: 1rem;
                    width: 100%;"
			>
				{#if filteredResults.length}
					{#if ($symptoms.length && !selection.doctors && !selection.branches && !selection.diseases && !selection.symptoms) || selection.symptoms}
						<div
							class="d-flex column-gap-1 p-3 align-items-center"
							style="width: 100%;
								overflow-x: hidden;
								background: rgba(236, 236, 236, 0.47);
								border-bottom: 1px solid rgb(221, 221, 221);
								flex-flow: row wrap;
								max-height: 120px;
								margin-top: -1rem"
						>
							<!-- <span>{$_('home.symptoms')}: </span> -->
							{#each $symptoms as val}
								<button
									on:click={() => {
										selectedSymptoms.set([...$selectedSymptoms, val]);
										searchQuery.set('');
										goto(`./diseases`);
									}}
									class="symptom card flex-1"
									style="text-wrap: nowrap; border: none">{val}</button
								>
							{/each}
						</div>
					{/if}
					{#each filteredResults as item, index}
						{#if (item.type === 'doctor' && !selection.doctors && !selection.branches && !selection.diseases && !selection.symptoms) || selection.doctors}
							<a class="d-flex gap-3 hover card mx-3" href="/doctors/{item.slug}">
								<div class="d-flex align-items-center">
									<img
										style="height:80px; border-radius: 6px"
										src={item.img
											? item.img
											: 'https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/docplaceholder.jpg'}
										alt={item.name}
									/>
									<h4 style="margin-bottom:0px; margin-inline: auto">{item.name}</h4>
								</div>
								<div
									style="max-height: 80px;
                                        overflow-y: hidden;
                                        display: flex;
                                        flex-direction: column;
                                        text-align: left;"
								>
									<p>{@html item.details}</p>
								</div>
							</a>
						{:else if item.type === 'disease'}
							<a
								on:click={() => selectedBranch.set({ value: item.id })}
								href="/doctors"
								class="hover card mx-3"
								style="display: inline-block;"
							>
								<div style="text-align: left;">
									<h4 class="ps-1 mb-0">{item.name}</h4>
									{#if Object.entries(item.filteredConditions).length}
										<ul
											class="list-group list-group-flush pt-1"
											style="list-style-type: inherit;
											margin-bottom: 0px;"
										>
											{#each Object.entries(item.filteredConditions).slice(0, 3) as [key, val]}
												<li class="list-group-item">{key}</li>
											{/each}
										</ul>
									{/if}
									<!-- <div class="mt-2 d-flex column-gap-1 flex-wrap">
										{#each Object.entries(item.filteredConditions) as [key, val]}
											<span class="symptom">{val}</span>
										{/each}
									</div> -->
								</div>
							</a>
						{/if}
						<!-- {#if index < filteredResults.length - 1}
							<hr style="margin:0" />
						{/if} -->
					{/each}
				{:else}
					<div style="padding:1rem">Nəticə tapılmadı ...</div>
				{/if}
			</div>
		{:else if !$searchQuery}
			<div class="d-flex justify-content-center align-items-center w-100 mt-5">
				<!-- <span
					>{$_('nav.docs')}, {$_('nav.branches')}, {$_('nav.diseases')}, {$_('home.symptoms')}</span
				> -->
				<BranchSlider />
			</div>
			<!-- <div class="d-flex flex-wrap gap-2 px-3 mt-4 justify-content-center">
				<button
					class="card py-2 align-items-center"
					style="color: gray;"
					on:click={() => {
						selection.doctors = !selection.doctors;
					}}
					class:active={selection.doctors}
				>
					{$_('nav.docs')}
				</button>
				<button
					class="card py-2 align-items-center"
					on:click={() => {
						selection.branches = !selection.branches;
					}}
					class:active={selection.branches}
					style="color: gray;">{$_('nav.branches')}</button
				>
				<button
					class="card py-2 align-items-center"
					on:click={() => {
						selection.diseases = !selection.diseases;
					}}
					class:active={selection.diseases}
					style="color: gray;">{$_('nav.diseases')}</button
				>
				<button
					class="card py-2 align-items-center"
					on:click={() => {
						selection.symptoms = !selection.symptoms;
					}}
					class:active={selection.symptoms}
					style="color: gray;">{$_('home.symptoms')}</button
				>
			</div> -->
		{/if}
	</div>
</div>

<style>
	.hover {
		text-decoration: none;
		color: black;
		padding: 1rem;
	}
	.hover:hover {
		background-color: #dedede69;
	}
	.symptom {
		padding: 5px 10px;
		margin: 5px;
		margin-top: 10px;
		background-color: white;
		align-items: normal;
		overflow-x: hidden;
		min-width: fit-content;
	}
	.searchBox {
		background: #00000017;
		border: 0 !important;
		color: white;
		border-radius: 8px !important;
		border: 0;
		border-bottom: 1px solid #ececec;
		height: 42px;
		padding-left: 2.2rem;
		font-size: 16px;
	}
	.searchBox::placeholder {
		font-size: 16px;
		color: rgb(236, 236, 236);
	}
	.searchBox:focus {
		box-shadow: unset !important;
	}
	.active {
		border-radius: 20px !important;
	}
</style>
