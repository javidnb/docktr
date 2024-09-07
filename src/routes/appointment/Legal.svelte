<script lang="ts">
	import { showTermsModal, termsAccepted } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';
</script>

<div class="px-4 pb-3" style="max-width: 700px;">
	<div class="container">
		<div class="col">
			<div class="row mt-3 justify-content-center">
				<h4>{$_('legal.header')}</h4>
				<div class="d-flex flex-column mt-auto" style="width: fit-content">
					<span style="color: #bc0000;">* {$_('legal.1')}</span>
					<span style="color: #bc0000;padding-left: 10px;">{$_('legal.2')}</span>
					<span>* {$_('legal.3')} </span>
					<span>* {$_('legal.4')}</span><span style="padding-left: 10px;">{$_('legal.5')}</span>
				</div>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 mt-3">
		<button
			class="btn btn-primary w-100 d-flex"
			on:click={() => {
				termsAccepted.set(true);
                showTermsModal.set(false);
			}}
			><span class="material-symbols-outlined"> check </span>
			<span class="mx-auto">{$_('legal.accept')}</span>
		</button>
	</div>
</div>
