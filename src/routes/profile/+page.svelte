<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from '../$types';
	export let data: LayoutData;
	let userEmail: any = "";

	onMount(async () => {
		const user: any = await data.getAuthUser();
		userEmail = user.email;
	});
</script>

<div class="container-fluid mt-3">
	<h4>Hesabınız</h4>

	<p>{userEmail}</p>
</div>
