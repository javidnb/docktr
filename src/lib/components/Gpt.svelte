<script lang="ts">
	import { browser } from '$app/environment';
	import { afterUpdate, onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { _ } from 'svelte-i18n';
	import { hideNav, mobile, postData, showGPT } from '$lib/store/dataStore';
	import { session } from '$lib/session';

	let newMessage: string = '';
	const MODEL = 'ft:gpt-4o-mini-2024-07-18:personal:sehiyye:9yEr2roV';
	const api_endpoint = 'https://api.openai.com/v1/chat/completions';
	let messages = writable<any[]>([]);
	let awaitingResponse = writable(false);
	let inputFocused: boolean = false;
	let clicked: boolean = false; // for hiding warning text

	onMount(() => {
		if (browser && localStorage.getItem('assistant')) {
			const assistantData = localStorage.getItem('assistant');
			if (assistantData) {
				try {
					const parsedData = JSON.parse(assistantData);
					if (Array.isArray(parsedData)) {
						messages.set(parsedData);
					}
				} catch (error) {
					console.error('Failed to parse assistant data from localStorage:', error);
				}
			}
		}
		if ($mobile) hideNav.set(true);
		// for (let i = 0; i < 10; i++) {
		// 	messages.update((msgs) => [
		// 		...msgs,
		// 		{
		// 			role: 'user',
		// 			content:
		// 				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		// 		}
		// 	]);
		// }
		return () => {
			hideNav.set(false);
		};
	});

	afterUpdate(() => {
		setTimeout(() => {
			scrollToBottom();
		}, 5);
	});

	function scrollToBottom() {
		const container = document.getElementById('messages-container');
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}

	async function sendMessage() {
		// Update the store with the new user message
		if (newMessage.length) {
			messages.update((msgs) => [...msgs, { role: 'user', content: newMessage }]);
			newMessage = '';
			clicked = true;
			await getChatGPTResponse();
		}
	}

	async function getChatGPTResponse() {
		awaitingResponse.set(true);
		const currentMessages = get(messages);

		const response = await fetch(api_endpoint, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_GPT_API}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: MODEL,
				messages: currentMessages,
				max_tokens: 150
			})
		});

		if (!response.ok) {
			messages.update((msgs) => [...msgs, { role: 'error', content: $_('gpt.error') }]);
			awaitingResponse.set(false);
			return;
		}

		const data = await response.json();

		// Update the store with the assistant's response
		if (data?.choices?.length) {
			messages.update((msgs) => [
				...msgs,
				{ role: 'assistant', content: data.choices[0].message.content }
			]);
		}

		localStorage.setItem('assistant', JSON.stringify($messages));

		awaitingResponse.set(false);

		let gptData: any = { userId: $session.user ? $session.user.uid : null };
		$messages.slice(-2).forEach((d) => {
			if (d.role == 'user') gptData = { ...gptData, user: d.content };
			if (d.role == 'assistant') gptData = { ...gptData, assistant: d.content };
		});

		postData('gpt', gptData);

		return data?.choices?.length ? data.choices[0].message.content.trim() : 'error';
	}
</script>

<div
	class="chatBoxContainer"
	style="background-color: #efefef;min-width: min(90dvw, 650px); max-width: 650px"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="chatBox pt-3 pb-2 px-2 d-flex flex-column h-100"
		class:d-none-mobile={inputFocused}
		class:top-padding={!clicked}
		id="messages-container"
		style="min-height: 300px; border: 1px solid #ececec; 
				background: white; border-radius: 8px; position: relative"
	>
		{#if $messages.length}
			{#each $messages as msg}
				<span class="message {msg.role == 'user' ? 'sent' : 'received'}">{msg.content}</span>
			{/each}
			<div class="d-flex justify-content-center gap-2 mt-auto">
				<button
					class="btn btn-outline-primary btnClear"
					on:click={() => {
						messages.set([]);
						localStorage.removeItem('assistant');
						newMessage = '';
					}}>{$_('gpt.clear')}</button
				>
				{#if $mobile}
					<button
						class="btn btn-outline-primary btnClose"
						on:click={() => {
							showGPT.set(false);
						}}>{$_('actions.close')}</button
					>
				{/if}
			</div>
		{:else}
			<div class="d-flex flex-column w-100 h-100 align-items-center justify-content-center my-auto">
				<img
					src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
					alt="Sehiyye logo"
					style="width: 150px;"
					class:mt-auto={!inputFocused}
				/>
				{#if $mobile}
					<button
						class="btn btn-outline-primary btnClose"
						class:mt-auto={!inputFocused}
						class:mt-3={inputFocused}
						on:click={() => {
							showGPT.set(false);
						}}>{$_('actions.close')}</button
					>
				{/if}
			</div>
		{/if}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span
			on:click={() => {
				clicked = true;
			}}
			class="message received warning my-3"
			style="font-size: small; width: fit-content"
			class:d-none={clicked}
			>Bu chat suni intellektdən istifadə edir. Sizə daha yaxşı xidmət göstərə bilmək üçün
			mesajlarınız qeydə alınır.</span
		>
	</div>
	<div class="input-group mt-3">
		<textarea
			bind:value={newMessage}
			class="form-control msgInput"
			placeholder={$_('gpt.ask_anything')}
			on:focus={() => {
				inputFocused = true;
			}}
			on:blur={() => {
				setTimeout(() => {
					inputFocused = false;
				}, 50);
			}}
			rows={inputFocused && $mobile ? 2 : 1}
		/>

		<button
			style="min-width: 60px;"
			class="btn btn-primary d-flex align-items-center justify-content-center"
			on:click={sendMessage}
			disabled={$awaitingResponse || !newMessage.length}
		>
			{#if !$awaitingResponse}
				<span class="material-symbols-outlined"> send </span>
			{:else}
				<div class="loader" style="right: 20px"></div>
			{/if}
		</button>
	</div>
</div>

<style>
	.message {
		padding: 8px;
		margin: 4px;
		border-radius: 4px;
		border: 1px solid #ececec;
		background-color: #efefef;
		width: 75%;
		box-shadow: 0px 0px 5px #00000012;
	}
	.sent {
		background-color: #65a3547d;
		text-align: right;
		align-self: end;
	}
	.received {
		background-color: #f1f0f0;
	}

	.btnClear,
	.btnClose {
		padding: 2px 25px;
		width: fit-content;
		align-self: center;
		border-radius: 6px;
	}

	.btnClear:not(:hover) {
		background: white;
	}
	.chatBox {
		overflow-y: scroll;
		transition-duration: 0.2s;
	}
	@media screen and (min-width: 992px) {
		.chatBoxContainer {
			padding: 1rem;
		}
		.chatBox {
			max-height: 70dvh;
		}
		.warning {
			position: absolute;
			top: -16px;
			left: 50%;
			transform: translateX(-50%);
			width: 90%!important;
			margin: 0;
			background: #e2e1e1;
			cursor: not-allowed;
		}
		.top-padding {
			padding-top: 4rem !important;
		}
	}
	@media screen and (max-width: 992px) {
		.chatBoxContainer {
			height: calc(100dvh - 120px);
			padding: 10px;
			transition-duration: 0.2s;
		}
		/* .minimizedHeight {
			max-height: 300px !important;
			height: unset !important;
			transition-duration: 0.2s;
		} */
		.msgInput {
			padding: 10px;
		}
		.d-none-mobile {
			min-height: unset!important;
			height: 200px!important
		}
	}
</style>
