<script>
	import { zoomIn } from '$lib/store/dataStore';
	import Appointments from './Appointments.svelte';
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4" in:zoomIn>{$_('nav.appointments')}</h1>
	</div>
</section>

<Appointments />
