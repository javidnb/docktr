<script lang="ts">
	export let showModal: boolean; // boolean
	let dialog: HTMLDialogElement; // HTMLDialogElement
	export let fullScreen: boolean = false;

	$: if (showModal) {
		if (dialog) dialog.showModal();
	} else {
		showModal = false;
		if (dialog) dialog.close();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => {
		showModal = false;
		dialog.close();
	}}
	on:click|self={() => {
		showModal = false;
		dialog.close();
	}}
	class:fullScreen
	style={fullScreen
		? 'position: absolute; top: 50%!important; max-width: 705px; transform: translateY(-50%)!important;'
		: ''}
>
	<!-- <button
		class="btn btn-outline-primary d-flex justify-content-center"
		style="position: absolute;
		right: 0;
		width: 40px !important;
		background: rgb(161 11 11);
		color: white;
		border-radius: 0px;
		border-bottom-left-radius: 0.2em"
		on:click={() => dialog.close()}><span class="material-symbols-outlined"> close </span></button
	> -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation style={fullScreen ? 'height:100%; width: 100%' : ''}>
		<slot name="header" />
		<slot />
		<!-- svelte-ignore a11y-autofocus -->
	</div>
</dialog>

<style>
	dialog {
		/* max-width: 32em; */
		border-radius: 0.2em;
		border: none;
		padding: 0;
		/* min-width: min(30em, 100%); */
		box-shadow: 0px 0px 8px #00000047;
		background-color: #f8f8f8;
	}
	dialog:not(.fullScreen)::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog.fullScreen {
		max-height: calc(100dvh - 130px);
		top: 50% !important;
		transform: translateY(-50%);
	}
	dialog.fullScreen::backdrop {
		background: transparent;
	}
	dialog > div {
		padding: 0em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	/* button {
		display: block;
	} */
</style>
