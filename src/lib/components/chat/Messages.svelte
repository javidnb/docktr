<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, where, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { createEventDispatcher } from 'svelte';
	import { selectedUser } from '$lib/store/dataStore';

	const messagesCollection = collection(db, 'messages');
	let currentUser = 'HW50qLPCsBhdqW9LwQXXReN76JB2';
	let messagesGroupedByUser: any = [];
	const dispatch = createEventDispatcher();

	onMount(async () => {
		if ($session.user) {
			const q = query(messagesCollection, where('toUser', '==', currentUser));
			const querySnapshot = await getDocs(q);

			const groupedMessages: any = {};

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const fromUser = data.fromUser;

				if (!groupedMessages[fromUser]) {
					groupedMessages[fromUser] = [];
				}

				groupedMessages[fromUser].push({
					id: doc.id,
					...data
				});
			});

			// Convert groupedMessages object to an array for easier rendering
			messagesGroupedByUser = Object.keys(groupedMessages).map((fromUser) => ({
				fromUser,
				messages: groupedMessages[fromUser]
			}));
		}
	});
</script>

<div class="d-flex gap-3 mb-3">
	<h3>Mesajlar</h3>
	<span>{$session.user?.uid}</span>
</div>

<div class="d-flex gap-3 flex-column">
	{#each messagesGroupedByUser as { fromUser, messages }}
		<button
			class="d-flex align-items-center ps-3"
			style="min-height: 60px; border-radius: 6px; border: 1px solid #ececec"
			on:click={() => {
				selectedUser.set(fromUser);
				dispatch('changeValue', fromUser);
			}}
		>
			{fromUser}
		</button>
		<!-- <ul style="list-style-type: none;">
				{#each messages as message}
					<li>
						<p>{message.message}</p>
					</li>
				{/each}
			</ul> -->
	{/each}
</div>
