<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
	import { diseases } from '$lib/store/diseases';
	import { doctors } from '$lib/store/dataStore';
	import { writable } from 'svelte/store';

	const searchQuery = writable('');

	$: filteredResults = combineArrays($doctors, diseases).filter((item) => {
		const query = latinize($searchQuery);
		if (item.type === 'doctor') {
			return latinize(item.name).includes(query);
		} else if (item.type === 'disease') {
			item.filteredConditions = item.conditions.filter((condition: any) =>
				latinize(condition).includes(query)
			);
			return latinize(item.name).includes(query) || item.filteredConditions.length > 0;
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
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
	}

	// clear input on escape
	function handleKeydown(event: any) {
		if (event.key === 'Escape') {
			searchQuery.set('');
		}
	}
</script>

<section>
	<div
		class="jumbotron"
		style="padding-block: 3rem;
		background-color: #e2e9ef;
		background-image: url('https://tekoplast.az/img/docktrbg.png');
		background-size: cover;
		background-blend-mode: overlay;"
	>
		<div class="container">
			<div class="row justify-content-center">
				<div class="col col-md-8 d-flex align-items-center flex-column text-center">
					<h1 class="display-4">Sağlık Hizmetlerine Dijital Yaklaşım</h1>
					<p class="lead">
						Doktorunuzla İnternet Üzerinden Bağlantı Kurun, Sağlığınızı Şimdi Yönetin
					</p>
					<div class="col-12 col-md-10">
						<div class="input-group input-group-lg mb-3 mt-2">
							<input
								type="text"
								class="form-control"
								aria-label="Sizing example input"
								aria-describedby="inputGroup-sizing-sm"
								placeholder="Axtarış"
								bind:value={$searchQuery}
								on:keydown={handleKeydown}
							/>
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
										{#each filteredResults as item, index}
											{#if item.type === 'doctor'}
												<a class="d-flex gap-3 hover" href="/doctors/{item.slug}">
													<div
														style="min-width: 100px; max-width: 100px; overflow: hidden;
													display: flex; justify-content:center"
													>
														<img
															style="height:80px; border-radius: 6px"
															src={item.img}
															alt={item.name}
														/>
													</div>
													<div
														style="max-height: 80px;
															overflow-y: hidden;
															display: flex;
															flex-direction: column;
															text-align: left;"
													>
														<h4 style="margin-bottom:0px">{item.name}</h4>
														<p>{item.details}</p>
													</div>
												</a>
											{:else if item.type === 'disease'}
												<a
													href="/branches/{item.slug}"
													class="hover"
													style="display: inline-block; width:100%"
												>
													<div style="text-align: left;">
														<h4>{item.name}</h4>
														{#if item.filteredConditions.length}
															<ul style="list-style-type: none;padding-left: 10px;">
																{#each item.filteredConditions as condition}
																	<li>{condition}</li>
																{/each}
															</ul>
														{/if}
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
				</div>
			</div>
		</div>
	</div>
</section>

<section class="categories py-5">
	<div class="container">
		<div class="row">
			<div class="col">
				<h5>Branşlar</h5>
				<BranchSlider />
			</div>
		</div>
	</div>
</section>

<section class="faq py-5" style="background-color: #f9f9f9;">
	<div class="container">
		<div class="row">
			<div class="col">
				<h5>Sıkça sorulan sorular</h5>
			</div>
		</div>
	</div>
</section>

<style>
	.categories {
		background-color: aliceblue;
	}
	.jumbotron {
		padding-block: 3rem;
		background-color: #e2e9ef;
		background-image: url('https://tekoplast.az/img/docktrbg.png');
		background-size: cover;
		background-blend-mode: overlay;
	}
	.hover {
		text-decoration: none;
		color: black;
		padding: 1rem;
	}
	.hover:hover {
		background-color: #dedede69;
	}
</style>
