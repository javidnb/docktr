<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, where, getDocs, CollectionReference } from 'firebase/firestore';
	import { initializeFirebase, db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { createEventDispatcher } from 'svelte';
	import { selectedUser } from '$lib/store/dataStore';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	let messagesCollection: CollectionReference;
	let messagesGroupedByUser: any = [];
	let uids: {}[] = [];
	let users = writable([]);
	if (browser) {
		messagesGroupedByUser = localStorage.getItem('msgs')
			? JSON.parse(localStorage.getItem('msgs') || '')
			: [];
		if (localStorage.getItem('users')) users.set(JSON.parse(localStorage.getItem('users') || ''));
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

				uids.push(fromUser);

				if (!groupedMessages[fromUser]) {
					groupedMessages[fromUser] = [];
				}

				groupedMessages[fromUser].push({
					id: doc.id,
					...data
				});
			});

			// GET USERS DATA
			uids = [...new Set(uids)];

			const response = await fetch('https://tekoplast.az/docktr/api/?usersByArray', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uids })
			});

			if (response.ok) {
				const data = await response.json();
				console.log('users data: ', data);
				localStorage.setItem('users', JSON.stringify(data));
				users.set(data);
			} else {
				console.error('Failed to fetch users data');
			}

			// Convert groupedMessages object to an array for easier rendering
			messagesGroupedByUser = Object.keys(groupedMessages).map((user) => ({
				uid: user,
				messages: groupedMessages[user],
				lastMsgTime: groupedMessages[user][groupedMessages[user].length - 1].timestamp
			}));


			let result: {}[] = [];
			messagesGroupedByUser.forEach((msg: any) => {
				let user = $users.find((u: any) => u.uid == msg.uid);
				result.push({ ...msg, user });
			});
			messagesGroupedByUser = result;
			console.log(result);
			localStorage.setItem('msgs', JSON.stringify(messagesGroupedByUser));


			// if (curPage == '/messages') {
			// 	selectedUser.set(messagesGroupedByUser[0].user);
			// }
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
	{#each messagesGroupedByUser as { user, uid }}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<button
			class={$selectedUser == uid ? 'active' : ''}
			style="min-height: 60px; border-radius: 6px; border: 1px solid #ececec"
			on:click={() => {
				selectedUser.set(uid);
				dispatch('changeValue', uid);
			}}
		>
			<div class="d-flex align-items-center" style="overflow: hidden;">
				{#if user?.photoURL}
					<img src={user.photoURL} alt="PP" 
						style="width: 35px;
							height: 35px;
							border-radius: 100%;
							margin-left: 10px;
							margin-right: 5px;" />
				{:else}
					<span
						style="font-size: 38px; padding-left: .5rem"
						class="material-symbols-outlined icon-fill s-KnlqTvvrWAx4">account_circle</span
					>
				{/if}
				<div
					class="d-flex flex-column align-items-start justify-content-center ps-2"
					style="height: 40px;"
				>
					{user ? user.displayName || user.email || user.phoneNumber || 'User' : 'loading'}
					<!-- <span style="font-size: smaller; color: gray">{timestamp(lastMsgTime)}</span> -->
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
		background-color: #596655;
		color: white;
	}
</style>
