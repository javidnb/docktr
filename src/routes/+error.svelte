<script>
	import { goto } from '$app/navigation';
	import { postData } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	onMount(() => {
		postData('errors', { error: JSON.stringify($page.error) });
	});
</script>

<div class="d-flex flex-column align-items-center justify-content-center p-3 mt-3">
	<h5>Xəta baş verdi</h5>

	<div class="d-flex gap-3 mt-3">
		<button
			class="btn btn-outline-primary"
			on:click={() => {
				history.back();
			}}>Geri</button
		>
		<button
			class="btn btn-outline-primary"
			on:click={() => {
				goto('/');
			}}>Ana Səhifəyə Qayıt</button
		>
	</div>
</div>
