<script lang="ts">
	import { db, initializeFirebase } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { users, selectedUser, loginModal, doctors } from '$lib/store/dataStore';
	import { collection, getDocs, query, where, type CollectionReference } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import DocumentsByUser from '../DocumentsByUser.svelte';
	import { browser } from '$app/environment';

	let messagesCollection: CollectionReference;
	let messagesGroupedByUser: any = [];
	let selectedUserFiles: any = [];

	if (browser) {
		messagesGroupedByUser = localStorage.getItem('msgs')
			? JSON.parse(localStorage.getItem('msgs') || '')
			: [];
		if (localStorage.getItem('users')) users.set(JSON.parse(localStorage.getItem('users') || ''));
	}

	onMount(async () => {
		await initializeFirebase();
		if (db) {
			messagesCollection = collection(db, 'messages');
			if ($session.user) getMsgs();
		}
	});

	$: if (!$session.user) {
		loginModal.set(true);
	} else loginModal.set(false);

	async function getMsgs() {
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
				if (data.file) {
					const fromUser = data.fromUser == $session.user?.uid ? data.toUser : data.fromUser;

					uids.push(fromUser);

					if (!groupedMessages[fromUser]) {
						groupedMessages[fromUser] = [];
					}

					groupedMessages[fromUser].push({
						id: doc.id,
						...data
					});
				}
			});

			// GET USERS DATA
			uids = [...new Set(uids)];
			if ($selectedUser && !uids.find((u) => u == $selectedUser)) {
				uids.push($selectedUser.toString());
			}

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

			if ($selectedUser && !messagesGroupedByUser.find((m: any) => m.uid == $selectedUser)) {
				messagesGroupedByUser.push({
					uid: $selectedUser,
					messages: [],
					lastMsgTime: new Date()
				});
			}

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
		}
	}

	$: if ($selectedUser) {
		if (messagesGroupedByUser.find((msg: any) => msg.uid == $selectedUser))
			selectedUserFiles = messagesGroupedByUser.find(
				(msg: any) => msg.uid == $selectedUser
			).messages;
	}
</script>

{#if !$selectedUser}
	<div class="d-flex flex-column gap-2 mt-1">
		{#each messagesGroupedByUser as { user, uid }}
			<button
				class="btnUser"
				style="border-radius: 8px!important"
				on:click={() => {
					selectedUser.set(uid);
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
	</div>
{:else}
	<button
		class="btn btnClose btn-outline-primary d-flex align-items-center gap-1 ms-2"
		style="width: fit-content;"
		on:click={() => {
			selectedUser.set(null);
		}}><span class="material-symbols-outlined"> chevron_backward </span> Geri</button
	>

	{#if selectedUserFiles.length}
		<div class="mt-3">
			<DocumentsByUser files={selectedUserFiles} />
		</div>
	{/if}
{/if}

<style type="text/css">
	.btnUser {
		min-height: 60px;
		background: white;
		box-shadow: 0px 0px 5px #00000012;
		border-radius: 20px;
		border: none;
		transition-duration: 0.2s;
	}
	.btnUser:hover {
		background: var(--primaryColor);
		color: white;
	}
</style>
