<script lang="ts">
	import Messages from '$lib/components/chat/Messages.svelte';
	import Chat from '$lib/components/chat/Chat.svelte';
	import { _ } from 'svelte-i18n';
	import { selectedUser, hideNav, mobile } from '$lib/store/dataStore';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($mobile==false) hideNav.set(true);
		return () => {
			selectedUser.set(null);
			hideNav.set(false);
		};
	});

	$: if ($selectedUser) {
		hideNav.set(true);
	} else if($mobile) {
		hideNav.set(false);
	}

	let animate = true;
	function scaleFade(node: HTMLElement, { duration = 70 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => {
				const scale = 1.05 - 0.05 * t; // from 1.1 to 1
				const opacity = t; // from 0 to 1
				const x = -100 + 100 * t;
				return `
				 	transform: scale(${scale});					
                    opacity: ${opacity};
                `;
			}
		};
	}
</script>

<section>
	<div
		class="jumbotron {$hideNav ? 'd-none' : ''}"
		style="padding-block: 1rem; background-color: #e2e9ef"
	>
		<h1 class="display-4 mb-0">{$_('nav.messages')}</h1>
	</div>
</section>

<section class="py-3" style="background-color: white;">
	<div class="container">
		<div class="row msgRow justify-content-center">
			<div class="col-md-4 col-lg-3 {$selectedUser ? 'pcOnly' : ''}">
				<div style="height: 100%; border-right: 1px solid #ececec; padding-right: .5rem">
					<Messages
						on:changeValue={() => {
							// animate = false;
							// setTimeout(() => {
							// 	animate = true;
							// }, 5);
						}}
					/>
				</div>
			</div>
			<div class="col-md-8 col-lg-9">
				{#if $selectedUser && animate}
					<div in:scaleFade>
						<Chat />
					</div>
				{:else}
					<div class="d-flex h-100 align-items-center justify-content-center pcOnly">
						<h6 style="color: gray">Sehiyye.online</h6>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.msgRow {
		height: calc(100dvh - 250px);
	}

	@media screen and (max-width: 992px) {
		.msgRow {
			height: calc(-223px + 100dvh);
		}
	}
</style>
