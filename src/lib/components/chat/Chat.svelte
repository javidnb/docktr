<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
	import { db, initializeFirebase } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { selectedUser } from '$lib/store/dataStore';
	import { timestamp } from '$lib/helpers/dateFormatter';
	import { page } from '$app/stores';
	import { tooltip } from 'svooltip';
	import 'svooltip/styles.css';
	import { _ } from 'svelte-i18n';

	let messages: any = [];
	let newMessage = '';
	let currentUser = $session.user?.uid;
	let user: any;
	$: curPage = $page.route.id;

	$: if ($selectedUser) {
		user = $selectedUser;
		getMessages();
	}

	const messagesCollection = collection(db, 'messages');

	onMount(async () => {
		await initializeFirebase();
		getMessages();
	});

	afterUpdate(() => {
		scrollToBottom();
	});

	function getMessages() {
		const q = query(
			messagesCollection,
			where('participants', 'array-contains', currentUser),
			orderBy('timestamp')
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			messages = snapshot.docs
				.filter((doc) => doc.data().participants.includes(user))
				.map((doc) => doc.data());
			scrollToBottom();
		});

		return () => {
			unsubscribe();
			selectedUser.set(null);
		};
	}

	// Send a new message
	const sendMessage = async () => {
		if (newMessage.trim() !== '') {
			await addDoc(messagesCollection, {
				fromUser: currentUser,
				toUser: user,
				message: newMessage,
				participants: [currentUser, user],
				timestamp: new Date()
			});
			newMessage = '';
		}
	};

	// SCROLLS MESSAGES CONTAINER TO BOTTOM TO SHOW NEWER MSGS
	const scrollToBottom = () => {
		const container = document.getElementById('messages-container');
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	};
</script>

<button
	class="btn btn-outline-primary mobileOnly"
	style="position: absolute;
		top: 77px;
		left: 1rem;
		background: rgb(153 155 152);
		padding: 6px 0px 0px 8px;
		color: white;
		width: 3.5rem;"
	on:click={() => selectedUser.set(null)}
>
	<span class="material-symbols-outlined">arrow_back_ios</span>
</button>

<main class="d-flex flex-column h-100">
	{#if curPage != '/messages'}
		<h1>{user}</h1>
	{/if}
	<div
		class="chat mb-3 d-flex flex-column gap-1"
		id="messages-container"
		style="padding-right: .5rem;"
	>
		{#each messages as message}
			<div
				class="d-flex align-items-center w-75 {message.fromUser !== currentUser
					? 'flex-row'
					: 'flex-row-reverse align-self-end'}"
			>
				<span style="font-size: 30px; color: #628a57" class="material-symbols-outlined icon-fill"
					>account_circle</span
				>
				<div
					class="message d-flex flex-column flex-1 px-3 {message.fromUser === currentUser
						? 'sent'
						: 'received'}"
				>
					{message.message}
					<span style="font-size: smaller; color: gray">{timestamp(message.timestamp)}</span>
				</div>
			</div>
		{/each}
	</div>
	<div class="input-group d-flex mt-auto bg-white" id="msgContainer">
		<button
			style="min-width: 60px; border:1px solid rgb(222 226 230); border-right: none"
			class="btn btn-outline-secondary d-flex align-items-center justify-content-center"
			id="btnAttach"
			on:click={sendMessage}
			use:tooltip={{
				content: $_('actions.add_file'),
				placement: 'top-start'
			}}
		>
			<span class="material-symbols-outlined"> attach_file </span>
		</button>
		<input
			class="form-control"
			type="text"
			bind:value={newMessage}
			placeholder="Type a message..."
		/>
		<button
			style="min-width: 60px;"
			class="btn btn-primary d-flex align-items-center justify-content-center"
			on:click={sendMessage}><span class="material-symbols-outlined"> send </span></button
		>
	</div>
</main>

<style>
	.chat {
		max-height: 430px;
		overflow-y: auto;
	}
	.message {
		padding: 8px;
		margin: 4px;
		border-radius: 4px;
	}
	.sent {
		background-color: #daf8cb;
		text-align: right;
	}
	.received {
		background-color: #f1f0f0;
	}
</style>
