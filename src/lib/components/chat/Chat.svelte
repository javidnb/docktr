<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
	import { db, initializeFirebase } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { selectedUser } from '$lib/store/dataStore';
	import { timestamp } from '$lib/helpers/dateFormatter';
	import { page } from '$app/stores';
	import { tooltip } from 'svooltip';
	import 'svooltip/styles.css';
	import { _ } from 'svelte-i18n';
	import { toast } from '@zerodevx/svelte-toast';

	let messages: any = [];
	let newMessage = '';
	let currentUser = $session.user?.uid || null;
	let user: any;
	$: curPage = $page.route.id;

	$: if ($selectedUser) {
		user = $selectedUser;
		getMessages();
	}

	const messagesCollection = collection(db, 'messages');

	onMount(async () => {
		await initializeFirebase();
		getMessages();
	});

	afterUpdate(() => {
		scrollToBottom();
	});

	function getMessages() {
		if (currentUser) {
			const q = query(
				messagesCollection,
				where('participants', 'array-contains', currentUser),
				orderBy('timestamp')
			);

			const unsubscribe = onSnapshot(q, (snapshot) => {
				messages = snapshot.docs
					.filter((doc) => doc.data().participants.includes(user))
					.map((doc) => doc.data());
				scrollToBottom();
			});

			return () => {
				unsubscribe();
				selectedUser.set(null);
			};
		}
	}

	// Send a new message
	const sendMessage = async () => {
		let file = null;
		if (selectedFile) {
			file = await uploadFile(selectedFile);
			console.log(file);
		}
		if (newMessage.trim() !== '' || file) {
			await addDoc(messagesCollection, {
				fromUser: currentUser,
				toUser: user,
				message: newMessage,
				participants: [currentUser, user],
				timestamp: new Date(),
				file
			});
			newMessage = '';
		}
	};

	// SCROLLS MESSAGES CONTAINER TO BOTTOM TO SHOW NEWER MSGS
	const scrollToBottom = () => {
		const container = document.getElementById('messages-container');
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	};

	// ADDING FILES
	let uploadProgress = 0;
	let uploading = false;
	let fileInput: any, avatar: any;
	let selectedFile: File | null = null;

	const allowedExtensions = [
		'jpg',
		'jpeg',
		'png',
		'gif',
		'bmp',
		'webp',
		'pdf',
		'doc',
		'docx',
		'xls',
		'xlsx',
		'ppt',
		'pptx',
		'txt',
		'zip',
		'tar',
		'gz'
	];

	const allowedMimeTypes = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/bmp',
		'image/webp',
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-powerpoint',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'text/plain',
		'application/zip',
		'application/x-tar',
		'application/gzip'
	];

	function getFileExtension(filename: string): string {
		return filename.split('.').pop()?.toLowerCase() ?? '';
	}

	const onFileSelected = (e: any) => {
		let file = e.target.files[0];
		if (file) {
			const fileExtension = getFileExtension(file.name);
			const fileType = file.type;

			if (!allowedMimeTypes.includes(fileType) || !allowedExtensions.includes(fileExtension)) {
				selectedFile = null;
				toast.push('Xəta! Fayl dəstəklənmir', {
					duration: 2000,
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgb(176 24 24)',
						'--toastBarBackground': '#5b1010'
					}
				});
			} else {
				selectedFile = file;
			}
		}

		if (selectedFile) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = async (e) => {
				if (e.target) {
					avatar = e.target.result;
					const formData = new FormData();
					formData.append('file', file);
				}
			};
		}
	};

	function uploadFile(file: File): Promise<{}> {
		return new Promise((resolve, reject) => {
			const formData = new FormData();
			formData.append('file', file);

			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					uploadProgress = (event.loaded / event.total) * 100;
				}
			});

			xhr.upload.addEventListener('loadstart', () => {
				uploading = true;
				uploadProgress = 0;
			});

			xhr.upload.addEventListener('loadend', () => {
				uploading = false;
				selectedFile = null;
			});

			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					const response = JSON.parse(xhr.responseText);

					if (xhr.status === 200 && response.status === 'success') {
						console.log('File uploaded successfully: ' + response.filename);
						let fileURL = `https://tekoplast.az/docktr/uploads/${response.filename}`;
						resolve({ url: fileURL, name: file.name });
					} else {
						console.log('File upload failed: ' + response.message);
						reject(new Error('File upload failed: ' + response.message));
					}
				}
			};

			xhr.open('POST', 'https://tekoplast.az/docktr/api/?upload');
			xhr.send(formData);
		});
	}
</script>

<button
	class="btn btn-outline-primary mobileOnly"
	style="position: absolute;
		top: 77px;
		left: 1rem;
		background: rgb(153 155 152);
		padding: 6px 0px 0px 8px;
		color: white;
		width: 3.5rem;"
	on:click={() => selectedUser.set(null)}
>
	<span class="material-symbols-outlined">arrow_back_ios</span>
</button>

<main class="d-flex flex-column h-100">
	{#if curPage != '/messages'}
		<h4>{user == '1TgHpEOspfZmDhanm8m1XLgm29u1' ? 'Contact us' : user}</h4>
	{/if}
	<div
		class="chat mb-3 d-flex flex-column gap-1"
		id="messages-container"
		style="padding-right: .5rem;"
	>
		{#each messages as message}
			<div
				class="d-flex align-items-center w-75 {message.fromUser !== currentUser
					? 'flex-row'
					: 'flex-row-reverse align-self-end'}"
			>
				{#if message.fromUser === currentUser && $session.user?.photoURL}
					<img
						src={$session.user?.photoURL}
						alt="PP"
						style="width: 35px;
							height: 35px;
							border-radius: 100%;
							margin-left: 10px;
							margin-right: 5px;"
					/>
				{:else}
					<span style="font-size: 38px; color: #628a57" class="material-symbols-outlined icon-fill"
						>account_circle</span
					>
				{/if}
				<div
					class="message d-flex flex-column flex-1 px-3 {message.fromUser === currentUser
						? 'sent'
						: 'received'}"
				>
					{message.message}
					<span style="font-size: smaller; color: gray">{@html timestamp(message.timestamp)}</span>
					{#if message.file}
						<a
							class="fileCard"
							href={message.file.url}
							target="_blank"
							style="text-decoration: none; color: unset"
						>
							<span
								style="font-size: 30px; color: #30552e"
								class="material-symbols-outlined mt-auto"
							>
								description
							</span>
							<span
								style="padding-inline: 5px;
									font-size: smaller;
									overflow-wrap: break-word;
									max-height: 25px;
									overflow-y: hidden;
									line-height: normal;
									text-decoration: none; 
									color: unset"
							>
								{message.file.name}
							</span>
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div class="input-group d-flex mt-auto bg-white" id="msgContainer">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<label
			for="fileInput"
			style="min-width: 60px; border:1px solid rgb(222 226 230); border-right: none"
			class="btn btn-outline-secondary d-flex align-items-center justify-content-center"
			id="btnAttach"
			use:tooltip={{
				content: $_('actions.add_file'),
				placement: 'top-start'
			}}
		>
			<span class="material-symbols-outlined"> attach_file </span>
		</label>
		<input
			class="form-control d-none"
			id="fileInput"
			type="file"
			accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.tar,.gz"
			on:change={(e) => onFileSelected(e)}
			bind:this={fileInput}
		/>
		<!-- ADDING FILES-->
		{#if selectedFile}
			<div
				class="progress h-100"
				style="position: relative; width: 10em"
				role="progressbar"
				aria-label="Upload percentage"
				aria-valuenow={uploadProgress}
				aria-valuemin="0"
				aria-valuemax="100"
			>
				{#if uploading}
					<span
						class="progress-bar"
						style="display: flex;
						align-items: center;
						border: 1px solid #dee2e6;
						padding-inline: .5rem;
						position: relative;
						width: {uploadProgress}%"
					/>
				{/if}
				<div
					style="position: absolute;
						left: 0px;
						top: 50%;
						width: 100%;
						padding-left: 5px;
						transform: translateY(-50%);"
				>
					{selectedFile.name.slice(0, 15)}
					<button
						on:click={() => {
							selectedFile = null;
						}}
						class="btn"
						style="position: absolute;
							top: -2px;
							right: 5px;
							background-color: #bd2626;
							color: white;
							border-radius: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
							width: 23px;
							height: 23px;"
					>
						<span style="font-size: 15px" class="material-symbols-outlined"> close </span>
					</button>
				</div>
			</div>
		{/if}
		<!-- END FILES-->
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
		max-height: 430px;
		overflow-y: auto;
	}
	.message {
		padding: 8px;
		margin: 4px;
		border-radius: 4px;
	}
	.sent {
		background-color: #65a3547d;
		text-align: right;
	}
	.received {
		background-color: #f1f0f0;
	}
	.progress-bar {
		background-color: var(--primaryColor);
	}
	.fileCard {
		background: #ffffffb8;
		width: 80px;
		display: flex;
		flex-wrap: wrap;
		text-wrap: balance;
		justify-content: center;
		align-items: center;
		font-size: small;
		overflow-x: clip;
		height: 80px;
		border-radius: 6px;
		box-shadow: -2px 0px 4px rgba(0, 0, 0, 0.226);	
		align-self: end;
		margin-top: 1rem;
		cursor: pointer;
		transition-duration: .2s;
	}
	.fileCard:hover {
		background: #ffffffe3;
	}
</style>
