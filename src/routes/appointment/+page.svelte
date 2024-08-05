<script>
	import Appointments from './Appointments.svelte';
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.appointments')}</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<Appointments />
