<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, where, getDocs, CollectionReference } from 'firebase/firestore';
	import { initializeFirebase, db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { createEventDispatcher } from 'svelte';
	import { selectedUser, users } from '$lib/store/dataStore';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { _ } from 'svelte-i18n';

	let messagesCollection: CollectionReference;
	let messagesGroupedByUser: any = [];
	if (browser) {
		messagesGroupedByUser = localStorage.getItem('msgs')
			? JSON.parse(localStorage.getItem('msgs') || '')
			: [];
		if (localStorage.getItem('users')) users.set(JSON.parse(localStorage.getItem('users') || ''));
	}
	const dispatch = createEventDispatcher();
	$: curPage = $page.route.id;
	$: if ($session.user) getMsgs();
	let dataLoading = writable(false);

	onMount(async () => {
		await initializeFirebase();
		if (db) {
			messagesCollection = collection(db, 'messages');
			if ($session.user) getMsgs();
		}
	});

	async function getMsgs() {
		dataLoading.set(true);
		if (messagesCollection) {
			const q = query(
				messagesCollection,
				where('participants', 'array-contains', $session.user?.uid)
			);
			const querySnapshot = await getDocs(q);

			const groupedMessages: any = {};
			let uids: string[] = [];

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

			if (uids.length) {
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
			}

			// Convert groupedMessages object to an array for easier rendering
			messagesGroupedByUser = Object.keys(groupedMessages).map((user) => {
				const messages = groupedMessages[user];
				const lastMsgTime = Math.max(...messages.map((msg: any) => msg.timestamp.seconds));
				return {
					uid: user,
					messages,
					lastMsgTime
				};
			});

			// Sort by lastMsgTime in descending order
			messagesGroupedByUser.sort(
				(a: any, b: any) => (b.lastMsgTime as number) - (a.lastMsgTime as number)
			);

			let result: {}[] = [];
			messagesGroupedByUser.forEach((msg: any) => {
				let user = $users.find((u: any) => u.uid == msg.uid);
				result.push({ ...msg, user });
			});
			messagesGroupedByUser = result;
			console.log(result);
			localStorage.setItem('msgs', JSON.stringify(messagesGroupedByUser));
			dataLoading.set(false);
		}
	}
</script>

<div class="d-flex" style="position: relative">
	<span
		class="pcOnly"
		style="font-size: larger;
		 border-bottom: 1px solid #ececec; 
		 padding: 10px; 
		 margin-bottom: 1rem;
		 width: 100%;"
	>
		{$_('nav.messages')}
	</span>
	{#if $dataLoading}
		<div class="loader" style="background-color: var(--primaryColor); top: 10px; right: 10px"></div>
	{/if}
</div>

<div class="d-flex gap-2 flex-column">
	{#each messagesGroupedByUser as { user, uid }}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<button
			class={$selectedUser == uid ? 'active' : 'users'}
			style="min-height: 60px; border-radius: 8px; border: none"
			on:click={() => {
				selectedUser.set(uid);
				dispatch('changeValue', uid);
			}}
		>
			<div class="d-flex align-items-center" style="overflow: hidden;">
				{#if user?.photoURL}
					<img
						src={user.photoURL}
						alt="PP"
						style="width: 35px;
							height: 35px;
							border-radius: 100%;
							margin-left: 10px;
							margin-right: 5px;
							object-fit: cover;
    						object-position: center;"
					/>
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
		color: white;
		background-color: var(--primaryColor);
	}
	.users {
		background-color: white;
		border-radius: 8px!important;
		box-shadow: 0px 0px 5px #00000012;
		border: none;
	}
</style>
