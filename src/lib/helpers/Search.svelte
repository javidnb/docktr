<script lang="ts">
	import { diseases } from '$lib/store/diseases';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { doctors, selectedSymptoms, selectedBranch } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';

	const searchQuery = writable('');
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

	$: filteredResults = combineArrays($doctors, diseases).filter((item) => {
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

<div class="w-100">
	<div class="input-group input-group-lg mb-3 mt-2">
		<input
			type="text"
			class="form-control searchBox"
			aria-label="Sizing example input"
			aria-describedby="inputGroup-sizing-sm"
			placeholder="{$_('home.search')} ({$_('nav.docs')}, {$_('nav.branches')}, {$_(
				'nav.diseases'
			)}, {$_('home.symptoms')})"
			bind:value={$searchQuery}
			on:keydown={handleKeydown}
		/>
		{#if $searchQuery}
			<button class="input-group-text" on:click={() => searchQuery.set('')}
				><span class="material-symbols-outlined"> close </span></button
			>
		{/if}
		<span
			class="input-group-text"
			style="background: var(--primaryColor);
    color: white;"><span class="material-symbols-outlined"> search </span></span
		>
		{#if $searchQuery}
			<div
				style="background-color: white;
                    
                    position: absolute;
                    top: 3rem;
                    border-radius: 6px;
                    margin-left: 1px;
                    z-index: 99;
                    box-shadow: 0px 0px 3px #00000038;
                    width: 100%"
			>
				{#if filteredResults.length}
					{#if $symptoms.length}
						<div
							class="d-flex column-gap-1 p-3 align-items-center"
							style="width: 100%;
							overflow-x: scroll;
							background: #ececec78;
							border-bottom: 1px solid #dddddd;"
						>
							<span>{$_('home.symptoms')}: </span>
							{#each $symptoms as val}
								<button
									on:click={() => {
										selectedSymptoms.set([...$selectedSymptoms, val]);
										searchQuery.set('');
										goto(`./diseases`);
									}}
									class="symptom flex-1"
									style="text-wrap: nowrap; border: none">{val}</button
								>
							{/each}
						</div>
					{/if}
					{#each filteredResults as item, index}
						{#if item.type === 'doctor'}
							<a class="d-flex gap-3 hover" href="/doctors/{item.slug}">
								<div
									style="min-width: 100px; max-width: 100px; overflow: hidden;
                                display: flex; justify-content:center"
								>
									<img style="height:80px; border-radius: 6px" src={item.img} alt={item.name} />
								</div>
								<div
									style="max-height: 80px;
                                        overflow-y: hidden;
                                        display: flex;
                                        flex-direction: column;
                                        text-align: left;"
								>
									<h4 style="margin-bottom:0px">{item.name}</h4>
									<p>{@html item.details}</p>
								</div>
							</a>
						{:else if item.type === 'disease'}
							<a
								on:click={() => selectedBranch.set(item.id)}
								href="/doctors"
								class="hover"
								style="display: inline-block; width:100%"
							>
								<div style="text-align: left;">
									<h4>{item.name}</h4>
									<ul
										style="list-style-type: inherit;
											padding-left: 2rem;
											margin-bottom: 0px;"
									>
										{#each Object.entries(item.filteredConditions) as [key, val]}
											<li>{key}</li>
										{/each}
									</ul>
									<!-- <div class="mt-2 d-flex column-gap-1 flex-wrap">
										{#each Object.entries(item.filteredConditions) as [key, val]}
											<span class="symptom">{val}</span>
										{/each}
									</div> -->
								</div>
							</a>
						{/if}
						{#if index < filteredResults.length - 1}
							<hr style="margin:0" />
						{/if}
					{/each}
				{:else}
					<div style="padding:1rem">Nəticə tapılmadı ...</div>
				{/if}
			</div>
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
		padding: 5px;
		border-radius: 6px;
		margin: 5px;
		margin-top: 10px;
		box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.34);
		background-color: white;
	}
</style>
