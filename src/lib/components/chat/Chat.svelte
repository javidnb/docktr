<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { selectedUser } from '$lib/store/dataStore';
	import { timestamp } from '$lib/helpers/dateFormatter';
	import { page } from '$app/stores';

	let messages: any = [];
	let newMessage = '';
	let currentUser = $session.user?.uid;
	let user: any;
	$: curPage = $page.route.id;

	$: if ($selectedUser) {
		user = $selectedUser ?? '1TgHpEOspfZmDhanm8m1XLgm29u1';
		getMessages();
	}

	const messagesCollection = collection(db, 'messages');

	onMount(() => {
		getMessages();
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
</script>

<main class="d-flex flex-column h-100">
	{#if curPage != '/messages'}
		<h1>{user}</h1>
	{/if}
	<div class="chat mb-3 d-flex flex-column gap-1">
		{#each messages as message}
			<div
				class="d-flex align-items-center {message.fromUser !== currentUser
					? 'flex-row'
					: 'flex-row-reverse'}"
			>
				<span style="font-size: 30px;" class="material-symbols-outlined s-KnlqTvvrWAx4"
					>account_circle</span
				>
				<div
					class="message d-flex flex-column flex-1 {message.fromUser === currentUser
						? 'sent'
						: 'received'}"
				>
					{message.message}
					<span style="font-size: smaller; color: gray">{timestamp(message.timestamp)}</span>
				</div>
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
