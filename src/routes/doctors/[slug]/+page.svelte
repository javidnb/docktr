<script lang="ts">
	import { page } from '$app/stores';
	import { doctors } from '$lib/store/dataStore';

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);
	$: console.log(doctor);
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

<section class="mt-3">
	<div class="container">
		<div class="row">
			<div class="col-md-8 d-flex gap-3">
				<img src={doctor?.img} alt={doctor?.name} style="max-width: 300px;" />
				<p style="width: auto;">{doctor?.details}</p>
			</div>
			<div class="col-md-4 h-100">
				<div class="card">
					<h4>Randevu al</h4>
				</div>
			</div>
		</div>
	</div>
</section>
