<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, where, getDocs, CollectionReference } from 'firebase/firestore';
	import { initializeFirebase, db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { createEventDispatcher } from 'svelte';
	import { selectedUser } from '$lib/store/dataStore';
	import { timestamp } from '$lib/helpers/dateFormatter';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let messagesCollection: CollectionReference;
	let messagesGroupedByUser: any = [];
	if (browser) {
		messagesGroupedByUser = localStorage.getItem('msgs')
			? JSON.parse(localStorage.getItem('msgs') || '')
			: [];
	}
	const dispatch = createEventDispatcher();
	$: curPage = $page.route.id;
	$: if ($session.user) getMsgs();

	onMount(async () => {
		await initializeFirebase();
		if (db) {
			messagesCollection = collection(db, 'messages');
			if ($session.user) getMsgs();
		}
	});

	async function getMsgs() {
		if (messagesCollection) {
			const q = query(
				messagesCollection,
				where('participants', 'array-contains', $session.user?.uid)
			);
			const querySnapshot = await getDocs(q);

			const groupedMessages: any = {};

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const fromUser = data.fromUser == $session.user?.uid ? data.toUser : data.fromUser;

				if (!groupedMessages[fromUser]) {
					groupedMessages[fromUser] = [];
				}

				groupedMessages[fromUser].push({
					id: doc.id,
					...data
				});
			});

			// Convert groupedMessages object to an array for easier rendering
			messagesGroupedByUser = Object.keys(groupedMessages).map((user) => ({
				user,
				messages: groupedMessages[user],
				lastMsgTime: groupedMessages[user][groupedMessages[user].length - 1].timestamp
			}));

			localStorage.setItem('msgs', JSON.stringify(messagesGroupedByUser));

			if (curPage == '/messages') {
				selectedUser.set(messagesGroupedByUser[0].user);
			}
		}
	}
</script>

{#if curPage != '/messages'}
	<div class="d-flex gap-3 mb-3">
		<h3>Mesajlar</h3>
		<span>{$session.user?.uid}</span>
	</div>
{/if}

<div class="d-flex gap-2 flex-column">
	{#each messagesGroupedByUser as { user, lastMsgTime }}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<button
			class={$selectedUser == user ? 'active' : ''}
			style="min-height: 60px; border-radius: 6px; border: 1px solid #ececec"
			on:click={() => {
				selectedUser.set(user);
				dispatch('changeValue', user);
			}}
		>
			<div class="d-flex align-items-center" style="overflow-x: hidden;">
				<span style="font-size: 30px;" class="material-symbols-outlined icon-fill s-KnlqTvvrWAx4"
					>account_circle</span
				>
				<div class="d-flex flex-column align-items-start">
					{user}
					<span style="font-size: smaller; color: gray">{timestamp(lastMsgTime)}</span>
				</div>
			</div>
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

<style>
	.active {
		background-color: var(--primaryColor);
		color: white;
	}
</style>
