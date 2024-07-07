<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, where, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { createEventDispatcher } from 'svelte';
	import { selectedUser } from '$lib/store/dataStore';
	import { timestamp } from '$lib/helpers/dateFormatter';

	const messagesCollection = collection(db, 'messages');
	let currentUser = 'HW50qLPCsBhdqW9LwQXXReN76JB2';
	let messagesGroupedByUser: any = [];
	const dispatch = createEventDispatcher();

	onMount(async () => {
		if ($session.user) {
			const q = query(messagesCollection, where('participants', 'array-contains', currentUser));
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
				toUser: groupedMessages[fromUser][0].toUser,
				messages: groupedMessages[fromUser],
				lastMsgTime: groupedMessages[fromUser][groupedMessages[fromUser].length - 1].timestamp
			}));
			console.log(messagesGroupedByUser);
		}
	});
</script>

<div class="d-flex gap-3 mb-3">
	<h3>Mesajlar</h3>
	<span>{$session.user?.uid}</span>
</div>

<div class="d-flex gap-3 flex-column">
	{#each messagesGroupedByUser as { fromUser, toUser, lastMsgTime }}
		<button
			class="d-flex flex-column justify-content-center ps-3"
			style="min-height: 60px; border-radius: 6px; border: 1px solid #ececec"
			on:click={() => {
				selectedUser.set(fromUser == $session.user?.uid ? toUser : fromUser);
				dispatch('changeValue', fromUser == $session.user?.uid ? toUser : fromUser);
			}}
		>
			{fromUser == $session.user?.uid ? toUser : fromUser}
			<span style="font-size: smaller; color: gray">{timestamp(lastMsgTime)}</span>
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
