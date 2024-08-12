<script lang="ts">
	export let message: string;
	export let no: string = $_('actions.close');
	export let yes: string = $_('actions.confirm');
	export let onConfirm: () => void;
	export let onCancel: () => void;
	import { _ } from 'svelte-i18n';

	function confirm() {
		onConfirm();
	}

	function cancel() {
		onCancel();
	}
</script>

<div class="modal">
	<div class="modal-content">
		<h5>{message}</h5>
		<div class="d-flex gap-2 mt-3">
			<button class="btn btn-secondary flex-1 d-flex align-items-center" on:click={cancel}>
				<span class="material-symbols-outlined"> close </span>
				<span class="mx-auto">{no}</span>
			</button>
			<button class="btn btn-primary flex-1 d-flex align-items-center" on:click={confirm}>
				<span class="material-symbols-outlined"> check </span>
				<span class="mx-auto">{yes}</span>
			</button>
		</div>
	</div>
</div>

<style>
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal-content {
		background: white;
		padding: 20px;
		border-radius: 5px;
		text-align: center;
		max-width: min(100%, 30em);
	}
</style>
