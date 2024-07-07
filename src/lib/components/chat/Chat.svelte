<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { selectedUser } from '$lib/store/dataStore';

	let messages: any = [];
	let newMessage = '';
	let currentUser = $session.user?.uid;
	export let user = $selectedUser;

	const messagesCollection = collection(db, 'messages');

	// Fetch and subscribe to messages in real-time
	onMount(() => {
		console.log(currentUser);
		const q = query(
			messagesCollection,
			where('participants', 'array-contains', currentUser),
			orderBy('timestamp')
		);
		console.log(q);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			messages = snapshot.docs
				.filter((doc) => doc.data().participants.includes(user))
				.map((doc) => doc.data());
		});

		return () => {
			unsubscribe();
			selectedUser.set(null);
		};
	});

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
</script>

<main>
	<h1>Chat with User {user}</h1>
	<div class="chat">
		{#each messages as message}
			<div class="message {message.fromUser === currentUser ? 'sent' : 'received'}">
				{message.message}
			</div>
		{/each}
	</div>
	<input type="text" bind:value={newMessage} placeholder="Type a message..." />
	<button on:click={sendMessage}>Send</button>
</main>

<style>
	.chat {
		max-height: 400px;
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
