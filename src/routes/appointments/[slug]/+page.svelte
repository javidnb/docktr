<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { appointments } from '$lib/store/dataStore';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($appointments.find((a) => a.id == $page.params.slug)) {
			console.log($appointments.find((a) => a.id == $page.params.slug));
		} else {
			goto('../appointments');
		}
	});
</script>
