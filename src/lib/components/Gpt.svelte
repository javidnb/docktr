<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { _ } from 'svelte-i18n';

	let newMessage: string = '';
	const MODEL = 'gpt-3.5-turbo';
	let messages = writable<{ role: string; content: string }[]>([]);
	let awaitingResponse = writable(false);

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
	});

	async function sendMessage() {
		// Update the store with the new user message
		messages.update((msgs) => [...msgs, { role: 'user', content: newMessage }]);
		newMessage = '';
		await getChatGPTResponse();
	}

	async function getChatGPTResponse() {
		awaitingResponse.set(true);
		const currentMessages = get(messages);

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

		const data = await response.json();

		// Update the store with the assistant's response
		messages.update((msgs) => [
			...msgs,
			{ role: 'assistant', content: data.choices[0].message.content }
		]);

		localStorage.setItem('assistant', JSON.stringify($messages));

		awaitingResponse.set(false);
		return data.choices[0].message.content.trim();
	}
</script>

<div class="container" style="background-color: #efefef;">
	<div class="row py-3 px-2" style="min-width: min(90dvw, 550px);">
		<div class="col">
			<div
				class="chatBox py-3 px-2 d-flex flex-column"
				style="min-height: 300px; border: 1px solid #ececec; background: white; border-radius: 8px; position: relative"
			>
				{#if $messages.length}
					{#each $messages as msg}
						<span class="message {msg.role == 'user' ? 'sent' : 'received'}">{msg.content}</span>
					{/each}
					<button
						class="btn btn-outline-primary"
						on:click={() => {
							messages.set([]);
							localStorage.removeItem('assistant');
						}}
						style="padding: 2px 25px;
						width: fit-content;
						align-self: center;
						border-radius: 0;
						position: absolute;
						bottom: 0px;
						left: 50%;
						transform: translateX(-50%);">Təmizlə</button
					>
				{:else}
					<div class="d-flex w-100 h-100 align-items-center justify-content-center my-auto">
						<img
							src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/logo.png"
							alt="Sehiyye logo"
							style="width: 150px; margin-top: 1rem"
						/>
					</div>
				{/if}
			</div>
			<div class="input-group mt-3">
				<input
					bind:value={newMessage}
					type="text"
					class="form-control"
					placeholder={$_('gpt.ask_anything')}
				/>

				<button
					style="min-width: 60px;"
					class="btn btn-primary d-flex align-items-center justify-content-center"
					on:click={sendMessage}
					disabled={$awaitingResponse}
				>
					{#if !$awaitingResponse}
						<span class="material-symbols-outlined"> send </span>
					{:else}
						<div class="loader" style="right: 20px"></div>
					{/if}
				</button>
			</div>
		</div>
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
</style>
