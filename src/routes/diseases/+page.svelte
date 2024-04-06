<script lang="ts">
	import { diseases } from '$lib/diseases';
</script>

<section>
	<div class="jumbotron" style="padding-top: 3rem; background-color: #e2e9ef">
		<h1 class="display-4">Hastalıklar</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr class="my-4" />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>
<div class="container-fluid mt-3">
	<ul class="nav nav-pills nav-fill" style="gap: 1rem">
		{#each diseases as item}
			<li class="nav-item"><a href="./">{item.name}</a></li>
		{/each}
	</ul>
</div>

<style type="text/css">
	.nav-item {
		flex: inherit;
	}
	.nav-item a {
		color: #68a557;
		font-size: large;
	}
</style>
