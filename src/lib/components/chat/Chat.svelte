<script lang="ts">
	import { onMount } from 'svelte';
	import {
		collection,
		addDoc,
		query,
		where,
		onSnapshot,
		orderBy,
		Timestamp
	} from 'firebase/firestore';
	import { db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { selectedUser } from '$lib/store/dataStore';
	import { timestamp } from '$lib/helpers/dateFormatter';

	let messages: any = [];
	let newMessage = '';
	let currentUser = $session.user?.uid;
	export let user = $selectedUser ?? '1TgHpEOspfZmDhanm8m1XLgm29u1';

	const messagesCollection = collection(db, 'messages');

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
			console.log(messages);
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

<main class="d-flex flex-column h-100">
	<h1>{user}</h1>
	<div class="chat mb-3">
		{#each messages as message}
			<div
				class="message d-flex flex-column {message.fromUser === currentUser ? 'sent' : 'received'}"
			>
				{message.message}
				<span style="font-size: smaller; color: gray">{timestamp(message.timestamp)}</span>
			</div>
		{/each}
	</div>
	<div class="input-group d-flex mt-auto">
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
