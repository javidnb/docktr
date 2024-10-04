<script lang="ts">
	import { _ } from 'svelte-i18n';
	import ContactForm from './ContactForm.svelte';
	import { zoomIn } from '$lib/store/dataStore';
</script>

<section>
	<button
		class="btn btnBack mobileOnly"
		style="position: absolute;
				left: 5px;
				color: rgb(41 71 41);
				border: none;
				text-align: center;
				width: 56px;
				padding-left: 20px;
				height: 40px;"
		on:click={() => {
			history.back();
		}}><span class="material-symbols-outlined"> arrow_back_ios </span></button
	>
	<div
		class="jumbotron jumboHeader mobile-left-padding"
		style="padding-block: 1rem; background-color: #e2e9ef"
	>
		<h1 class="display-4">{$_('nav.contact')}</h1>
	</div>
</section>

<div class="container d-flex justify-content-center" in:zoomIn>
	<div class="col col-md-8">
		<div class="row mb-5">
			<div class="d-flex justify-content-center mt-3" style="height: 136px;">
				<img
					src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
					alt="Sehiyye logo"
					style="width: 150px;"
				/>
			</div>

			<ContactForm />
		</div>
	</div>
</div>
