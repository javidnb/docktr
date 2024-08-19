<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('usage.header')}</h1>
	</div>
</section>

<div class="container">
	<div class="col">
		<div class="row my-3">
			<div class="d-flex flex-column">
				<div class="fw-500">{$_('usage.register')}</div>
				<div>{$_('usage.register_details')}</div>
				<div class="fw-500">{$_('usage.get_appointment')}</div>
				<div>{$_('usage.get_appointment_details')}</div>
				<div class="fw-500">{$_('usage.payment')}</div>
				<div>{$_('usage.payment_details')}</div>
				<div class="fw-500">{$_('usage.join_appointment')}</div>
				<div>{$_('usage.join_appointment_details')}</div>
				<div class="fw-500">{$_('usage.check_appointment')}</div>
				<div>{$_('usage.check_appointment_details')}</div>
			</div>
		</div>
		<div class="row mt-3 mb-5">
			<span
				>Nəzərinizə çatdırırıq ki, pasientlər və həkimlərin arasında olan bütün dialoq və
				məlumatların ötürülməsi konfidensialdır. Həkimlərin yazdığı dərman vasitələri və müalicə
				üsulları onların öz məsuliyyətindədir. Şirkətimiz bu müalicə üsulları və dərmanların
				təsirinə və ya təsirsizliyinə görə hər hansı məsuliyyət daşımamaqdadır.</span
			>
		</div>
	</div>
</div>

<style>
	.fw-500 {
		font-weight: 500;
		margin-top: 1rem;
	}
</style>
