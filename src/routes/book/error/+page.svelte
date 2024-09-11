<script>
	import { session } from '$lib/session';
	import Appointments from '../../appointments/Appointments.svelte';
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.appointments')}</h1>
	</div>
</section>

{#if $session.loggedIn}
	<div class="container d-flex align-items-center flex-column mt-3">
		<div class="d-flex flex-column py-3 w-100 justify-content-center align-items-center gap-2">
			<span class="material-symbols-outlined" style="color: red; font-size: 3rem"> warning </span>
			<h5>Ödəniş baş tutmadı</h5>
		</div>
	</div>
{/if}
<Appointments showLatestAppointment />
