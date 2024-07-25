<script lang="ts">
	let newMessage: string = '';
	let messages: any[] = [];
	const MODEL = "gpt-3.5-turbo";

	async function sendMessage() {
		messages = [...messages, { msg: newMessage, type: 'sent' }];
		let res = await getChatGPTResponse(newMessage);
		console.log(res);
		newMessage = '';
	}

	export async function getChatGPTResponse(prompt: string) {
		const response = await fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_GPT_API}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: MODEL,
				prompt: prompt,
				max_tokens: 150
			})
		});

		const data = await response.json();
		// return data.choices[0].text.trim();
		return data;
	}
</script>

<div class="container" style="background-color: #efefef;">
	<div class="row py-3 px-2" style="min-width: min(90dvw, 550px);">
		<div class="col">
			<h5 style="text-align: center;">How can we help?</h5>
			<div
				class="chatBox py-3 px-2 d-flex flex-column"
				style="min-height: 300px; border: 1px solid #ececec; background: white; border-radius: 8px"
			>
				{#if messages.length}
					{#each messages as msg}
						<span class="message {msg.type == 'sent' ? 'sent' : 'received'}">{msg.msg}</span>
					{/each}
				{:else}
					<div class="d-flex w-100 h-100 align-items-center justify-content-center my-auto">
						<h6>Sehiyye.online</h6>
					</div>
				{/if}
			</div>
			<div class="input-group mt-3">
				<input
					bind:value={newMessage}
					type="text"
					class="form-control"
					placeholder="Ask anything.."
				/>
				<button
					style="min-width: 60px;"
					class="btn btn-primary d-flex align-items-center justify-content-center"
					on:click={sendMessage}><span class="material-symbols-outlined"> send </span></button
				>
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
