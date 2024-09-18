<script lang="ts">
	import { showTermsModal, termsAccepted } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';

	export let termsOnly: boolean = false;
</script>

<div class="px-4 pb-3" class:px-0={termsOnly}>
	<div class="container">
		<div class="col">
			<div class="row mt-3 justify-content-center">
				{#if !termsOnly}
					<h4>{$_('legal.header')}</h4>
				{/if}

				<div
					class="d-flex flex-column mt-auto"
					style="width: fit-content; max-height: {termsOnly
						? 'unset'
						: '75dvh'}; overflow-y: scroll"
					class:px-10px={termsOnly}
				>
					<h6>{$_('legal.h1')}</h6>
					<span>{$_('legal.c1')}</span>
					<h6 class="mt-2">{$_('legal.h2')}</h6>
					<span>{$_('legal.c2')}</span>
					<h6 class="mt-2">{$_('legal.h3')}</h6>
					<span>{$_('legal.c3')}</span>
					<h6 class="mt-2">{$_('legal.h4')}</h6>
					<span>{$_('legal.c4')}</span>
					<h6 class="mt-2">{$_('legal.h5')}</h6>
					<span>{$_('legal.c5')}</span>
					<h6 class="mt-2">{$_('legal.h6')}</h6>
					<span>{$_('legal.c6')}</span>
					<h6 class="mt-2">{$_('legal.h7')}</h6>
					<span>{$_('legal.c7')}</span>
					<h6 class="mt-2">{$_('legal.h8')}</h6>
					<span>{$_('legal.c8')}</span>
				</div>
			</div>
		</div>
	</div>

	{#if !termsOnly}
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
	{/if}
</div>

<style>
	.px-0 {
		padding-inline: 0 !important;
	}
	.px-10px {
		padding-inline: 5px!important
	}
</style>
