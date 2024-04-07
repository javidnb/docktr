<script lang="ts">
	import { onMount } from 'svelte';
	export let data;
	let userEmail: any = '';

	onMount(async () => {
		const user: any = await data.getAuthUser();
		userEmail = user.email;
	});
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Hesabım</h1>
		<p class="lead">{userEmail}</p>
		<hr />
		<!-- <p>
				It uses utility classes for typography and spacing to space content out within the larger
				container.
			</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>
