<script lang="ts">
	import { _ } from 'svelte-i18n';
	import ContactForm from './ContactForm.svelte';
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.contact')}</h1>
	</div>
</section>

<div class="container d-flex justify-content-center">
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
