<script lang="ts">
	import { diseases } from '$lib/diseases';
	import { page } from '$app/stores';

	let d = diseases.find((d) => d.slug == $page.params.slug);

	console.log($page);
</script>

<section>
	<div class="jumbotron" style="padding-top: 3rem; background-color: #e2e9ef">
		<h1 class="display-4">{$page.params.slug}</h1>
		<hr class="my-4" />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>
