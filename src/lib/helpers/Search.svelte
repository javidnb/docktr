<script lang="ts">
	import { diseases } from '$lib/store/diseases';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { doctors, selectedSymptoms, selectedBranch, mobile } from '$lib/store/dataStore';
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
	<div class="input-group input-group-lg mb-3 mt-2" style="position: relative;">
		<span
			class="input-group-text"
			style="background: unset; position: absolute; border: 0; z-index: 9; top: 50%;
    transform: translateY(-50%); color: gray; left: 0"
		>
			<span class="material-symbols-outlined" style="font-size: 20px;"> search </span>
		</span>
		<input
			type="search"
			class="form-control searchBox ps-5"
			aria-label="Sizing example input"
			aria-describedby="inputGroup-sizing-sm"
			placeholder="{$_('home.search')} ({$_('nav.docs')}, {$_('nav.branches')}, {$_(
				'nav.diseases'
			)}, {$_('home.symptoms')})"
			bind:value={$searchQuery}
			on:keydown={handleKeydown}
			on:click={() => {
				if ($mobile) goto('./search');
			}}
		/>
		<span
			class="mobileOnly"
			style="position: absolute;
					bottom: -22px;
					left: 2px;
					color: gray;
					background: transparent;
					text-wrap: nowrap;
					font-size: 16px;
					width: 100%;"
			>{$_('nav.docs')}, {$_('nav.branches')}, {$_('nav.diseases')}, {$_('home.symptoms')}</span
		>

		{#if $searchQuery}
			<div
				class="d-flex flex-column row-gap-3 pb-3 pt-3"
				style="background-color: rgb(250 250 250);                    
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
							border-bottom: 1px solid #dddddd;
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
									class="symptom flex-1"
									style="text-wrap: nowrap; border: none">{val}</button
								>
							{/each}
						</div>
					{/if}
					{#each filteredResults as item, index}
						{#if item.type === 'doctor'}
							<a class="d-flex gap-3 hover card mx-3 cursor-pointer" href="/doctors/{item.slug}">
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
								class="hover card mx-3 cursor-pointer"
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
		{/if}
	</div>
</div>

<style>
	.hover {
		text-decoration: none;
		color: black;
		padding: 1rem;
		transition-duration: .2s;
	}
	.symptom:hover {
		background-color: var(--primaryColor);
		color: white;
		transition-duration: .2s;
	}
	.hover:hover {
		box-shadow: 0px 0px 5px #0000004d !important;
	}
	.list-group-item {
		background-color: unset!important;
	}
	/* .hover:hover .list-group-item {
		background-color: transparent;
		color: white;
	} */
	.symptom {
		padding: 5px 10px;
		border-radius: 14px;
		margin: 5px;
		margin-top: 10px;
		background-color: white;
		box-shadow: 0px 0px 5px #00000012;
	}
	.searchBox {
		border-radius: 12px !important;
		box-shadow: 0px 0px 6px #0000000a;
	}
	.searchBox::placeholder {
		font-size: 16px;
		color: gray;
	}
	@media screen and (max-width: 992px) {
		.searchBox::placeholder {
			width: 4ch;
			overflow: hidden;
			white-space: nowrap;
		}
	}
</style>
