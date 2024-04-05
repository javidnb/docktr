<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from '../$types';
	export let data: LayoutData;
	let userEmail: any = '';

	onMount(async () => {
		const user: any = await data.getAuthUser();
		userEmail = user.email;
	});
</script>

<section>
	<div class="jumbotron" style="padding-top: 3rem; background-color: #e2e9ef">
		<h1 class="display-4">Hesabım</h1>
		<p class="lead">{userEmail}</p>
		<hr class="my-4" />
		<!-- <p>
				It uses utility classes for typography and spacing to space content out within the larger
				container.
			</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>
