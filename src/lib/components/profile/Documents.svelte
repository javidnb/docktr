<script lang="ts">
	import { db, initializeFirebase } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { dataLoading, users, selectedUser } from '$lib/store/dataStore';
	import { collection, getDocs, query, where, type CollectionReference } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let messagesCollection: CollectionReference;
	let messagesGroupedByUser: any = [];
	let selectedUserFiles: any = [];

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
			const q = query(messagesCollection, where('file', '!=', null));
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
			dataLoading.set(false);
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
	<div class="d-flex flex-column gap-2">
		{#each messagesGroupedByUser as { user, uid }}
			<button
				class="btnUser"
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
		class="btn btn-outline-primary d-flex align-items-center gap-1 pcOnly"
		on:click={() => {
			selectedUser.set(null);
		}}><span class="material-symbols-outlined"> chevron_backward </span> Geri</button
	>
	<div class="d-flex flex-wrap gap-3 mt-3">
		{#if selectedUserFiles.length}
			{#each selectedUserFiles as msg}
				<a class="fileCard" href={msg.file.url} target="_blank">
					<span style="font-size: 30px;" class="material-symbols-outlined my-auto">
						description
					</span>
					<span
						style="padding-inline: 5px;
                        font-size: smaller;
                        overflow-wrap: break-word;
                        max-height: 28px;
                        overflow-y: hidden;
                        line-height: normal;
                        text-decoration: none;
                        color: unset;
                        margin-bottom: 10px;
                        max-width: 80%"
					>
						{msg.file.name}
					</span>
				</a>
			{/each}
		{/if}
	</div>
{/if}

<style type="text/css">
	.fileCard {
		background: white;
		width: 80px;
		display: flex;
		flex-wrap: wrap;
		text-wrap: balance;
		text-align: center;
		justify-content: center;
		align-items: center;
		font-size: small;
		overflow-x: clip;
		height: 95px;
		border-radius: 6px;
		box-shadow: 0px 0px 5px #00000012;
		cursor: pointer;
		transition-duration: 0.2s;
		text-decoration: none;
		color: unset;
		width: min-content;
		flex-direction: column;
		flex: 1;
		min-width: 150px;
		max-width: 250px;
	}
	.fileCard:hover {
		background: var(--primaryColor);
		color: white;
	}
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
