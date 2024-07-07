<script lang="ts">
	import Messages from '$lib/components/chat/Messages.svelte';
	import Chat from '$lib/components/chat/Chat.svelte';
	import { _ } from 'svelte-i18n';
	import { selectedUser } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	onMount(() => {
		return selectedUser.set(null);
	});
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.messages')}</h1>
		<hr />
	</div>
</section>

<section class="pt-3 pb-5">
	<div class="container">
		<div class="row">
			<div class="col-md-4 col-lg-3">
				<div style="height: 100%; border-right: 1px solid #ececec; padding-right: .5rem">
					<Messages />
				</div>
			</div>
			<div class="col-md-8 col-lg-9">
				{#if $selectedUser}
					<Chat />
				{:else}
					<div class="d-flex h-100 align-items-center justify-content-center">
						<h6 style="color: gray">Select user</h6>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
