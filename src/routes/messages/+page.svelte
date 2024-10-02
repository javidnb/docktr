<script lang="ts">
	import Messages from '$lib/components/chat/Messages.svelte';
	import Chat from '$lib/components/chat/Chat.svelte';
	import { _ } from 'svelte-i18n';
	import {
		selectedUser,
		hideNav,
		mobile,
		dataLoading,
		loginModal,
		appointmentsLoading
	} from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';

	onMount(() => {
		if ($mobile == false) hideNav.set(true);
		return () => {
			selectedUser.set(null);
			hideNav.set(false);
		};
	});

	$: if ($selectedUser) {
		hideNav.set(true);
	} else if ($mobile) {
		hideNav.set(false);
	}

	$: if (!$appointmentsLoading && !$session.user) {
		loginModal.set(true);
	} else loginModal.set(false);

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
	{#if !$selectedUser && $mobile}
		<button
			class="btn btnBack mobileOnly"
			style="position: absolute;
					top: 8px!important;
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
	{/if}
	<div
		class="jumbotron jumboHeader mobile-left-padding {$hideNav ? 'd-none' : ''}"
		style="padding-block: 1rem; background-color: #e2e9ef"
	>
		<h1 class="display-4 mb-0">{$_('nav.messages')}</h1>
	</div>
</section>

<section class="pb-3 pt-2" style="background-color: #f8f8f8;">
	<div class="container">
		<div class="row msgRow justify-content-center">
			{#if $session.user}
				<div class="col-md-4 col-lg-3 {$selectedUser ? 'pcOnly' : ''}">
					<div style="height: 100%; border-right: 1px solid #ececec; padding-right: .5rem">
						<div class="d-flex" style="position: relative">
							<span
								class="pcOnly"
								style="font-size: larger;
								 border-bottom: 1px solid #ececec; 
								 padding: 10px; 
								 margin-bottom: 1rem;
								 width: 100%;"
							>
								{$_('nav.messages')}
							</span>
							<!-- {#if $dataLoading}
								<div
									class="loader"
									style="background-color: var(--primaryColor); top: 10px; right: 10px"
								></div>
							{/if} -->
						</div>
						<Messages />
					</div>
				</div>
				<div class="col-md-8 col-lg-9">
					{#if $selectedUser && animate}
						<div in:scaleFade>
							<Chat />
						</div>
					{:else}
						<div class="d-flex h-100 align-items-center justify-content-center pcOnly">
							<img
								src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
								alt="Sehiyye logo"
								style="width: 150px;"
							/>
						</div>
					{/if}
				</div>
			{:else if $dataLoading}
				<div class="d-flex justify-content-center">
					<div class="lds-ellipsis" style="position: fixed; top: 50%; transform: translateY(-50%)">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			{:else}
				<div class="container">
					<button
						class="btn btn-outline-primary w-100"
						on:click={() => {
							loginModal.set(true);
						}}>{$_('login.login_header')}</button
					>
				</div>

				<div
					class="d-flex w-100 h-100 align-items-center justify-content-center"
					style="min-height: calc(100dvh - 300px);"
				>
					<h6 style="color: gray;">Sehiyye.online</h6>
				</div>
			{/if}
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
