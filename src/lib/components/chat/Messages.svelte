<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, query, where, getDocs, CollectionReference } from 'firebase/firestore';
	import { initializeFirebase, db } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { createEventDispatcher } from 'svelte';
	import { doctors, selectedUser, users } from '$lib/store/dataStore';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';

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
	let messagesUpdating = true;

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
					messagesUpdating = false;
					const data = await response.json();
					localStorage.setItem('users', JSON.stringify(data));
					users.set(data);
				} else {
					messagesUpdating = false;
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
				let user: any = $users.find((u: any) => u.uid == msg.uid);
				let doc = $doctors.find((u: any) => u.uid == msg.uid);
				if (doc && user) {
					user.photoURL = doc.img;
					user.displayName = doc.name;
				}
				if (msg.uid != $session.user?.uid) {
					result.push({ ...msg, user });
				}
			});
			messagesGroupedByUser = result;
			// messagesGroupedByUser = [];
			localStorage.setItem('msgs', JSON.stringify(messagesGroupedByUser));
			dataLoading.set(false);
		}
	}
</script>

<div class="d-flex gap-2 flex-column" style="position: relative;">
	{#if messagesUpdating}
		<div class="loader" style="background-color: var(--primaryColor); top: 1rem; right: 10px"></div>
	{/if}
	{#if messagesGroupedByUser.length}
		{#each messagesGroupedByUser as { user, uid }}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<button
				class={$selectedUser == uid ? 'active' : 'users'}
				style="min-height: 60px; border-radius: 8px; border: none"
				on:click={() => {
					selectedUser.set(uid);
					dispatch('changeValue', uid);
					if (curPage == '/admin') {
						goto('/messages');
					}
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
		{/each}
	{:else if $dataLoading}
		<div class="d-flex justify-content-center">
			<div class="lds-ellipsis" style="position: fixed; top: 50%; transform: translateY(-50%)">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	{:else}
		<span class="card p-3">{$_('other.no_msg')}</span>
	{/if}
</div>

<style>
	.active {
		color: white;
		background-color: var(--primaryColor);
	}
	.users {
		background-color: white;
		border-radius: 8px !important;
		box-shadow: 0px 0px 5px #00000012;
		border: none;
	}
</style>
