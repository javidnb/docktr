<script lang="ts">
	import { dataLoading } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';

	let errors: any = writable([]);

	onMount(() => {
		if (browser) {
			const errorsLS = localStorage.getItem('errors');
			errors.set(errorsLS ? JSON.parse(errorsLS) : []);
		}
		getData();
	});

	async function getData() {
		dataLoading.set(true);
		try {
			let response = await fetch(`https://tekoplast.az/docktr/api/?errors`);

			const result = await response.json();
			if (result) {
				let errs = result.map((r: any) => ({
					id: r.id,
					...JSON.parse(r.error)
				}));

				errors.set(errs);
				localStorage.setItem('errors', JSON.stringify(errs));
				dataLoading.set(false);
				return null;
			}
			dataLoading.set(false);
			return response;
		} catch (error) {
			dataLoading.set(false);
			return null;
		}
	}
</script>

<div class="d-flex gap-3 flex-wrap">
	{#each $errors as err}
		<div class="card p-3" style="min-width: fit-content;">
			<span style="font-weight: 500;">{err.message}</span>
			<span style="font-weight: 500;">{err.source}</span>
		</div>
	{/each}
</div>
