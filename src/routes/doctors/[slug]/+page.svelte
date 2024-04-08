<script lang="ts">
	import { page } from '$app/stores';
	import { doctors } from '$lib/store/dataStore';

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{doctor?.name || ''}</h1>
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>