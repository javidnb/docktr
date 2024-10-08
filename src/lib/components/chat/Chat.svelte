<script lang="ts">
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import {
		collection,
		addDoc,
		query,
		where,
		onSnapshot,
		orderBy,
		deleteDoc,
		doc
	} from 'firebase/firestore';
	import { db, initializeFirebase } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import { selectedUser, users, mobile, doctors, sendNotification } from '$lib/store/dataStore';
	import { timestamp } from '$lib/helpers/dateFormatter';
	import { tooltip } from 'svooltip';
	import 'svooltip/styles.css';
	import { _ } from 'svelte-i18n';
	import { toast } from '@zerodevx/svelte-toast';
	import { writable } from 'svelte/store';
	import DocumentsByUser from '../DocumentsByUser.svelte';
	import Confirm from '$lib/helpers/Confirm.svelte';
	import Modal from '$lib/helpers/Modal.svelte';
	import Receipt from '../Receipt.svelte';

	let messages: any = [];
	let newMessage = '';
	let currentUser = $session.user?.uid || null;
	let userId: any;
	let user: any = writable({});
	let showDocs: boolean = false;
	let msgInput: HTMLElement;
	let files: any = [];
	let inputFocused: boolean = false;
	let mainContainer: HTMLDivElement | null = null;
	let doctor: boolean = false;
	let receiptForm: boolean = false;
	let receiptType: string | null = null;
	let receiptData: any = null;

	$: if ($selectedUser) {
		userId = $selectedUser;
		let doc = $doctors.find((u: any) => u.uid == $selectedUser);
		let usr: any = $users.find((u: any) => u.uid == userId);

		if ($session.user?.uid && $doctors.find((u: any) => u.uid == $session.user?.uid)) {
			doctor = true;
		}

		if (doc && usr) {
			usr.photoURL = doc.img;
			usr.displayName = doc.name;
		}
		user.set(usr);
		getMessages();
	}

	const messagesCollection = collection(db, 'messages');

	onMount(() => {
		mainContainer = document.querySelector('.mainContainer');
		if (window.visualViewport) {
			window.visualViewport.addEventListener('resize', resizeScreen);
		}
		(async () => {
			await initializeFirebase();
			getMessages();
		})();
	});

	onDestroy(() => {
		if (window.visualViewport) {
			window.visualViewport?.removeEventListener('resize', resizeScreen);
		}
	});

	function resizeScreen(event: any) {
		if (mainContainer && event?.target && $mobile) {
			if (event.target) {
				const viewportHeight = (event?.target as VisualViewport).height;
				mainContainer.style.height = `${viewportHeight - 30}px`;
			}
		}
	}

	afterUpdate(() => {
		// scrollToBottom();
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
					.filter((doc) => doc.data().participants.includes(userId))
					.map((doc) => ({
						id: doc.id, // Include document ID
						...doc.data() // Include other data
					}));
				scrollToBottom();
				files = messages.filter((m: any) => m.file);
			});

			return () => {
				unsubscribe();
				selectedUser.set(null);
			};
		}
	}

	// Send a new message
	const sendMessage = async () => {
		let msg = newMessage;
		newMessage = '';
		let file = null;
		if (selectedFile) {
			file = await uploadFile(selectedFile);
		}
		if (msg.trim() !== '' || file) {
			await addDoc(messagesCollection, {
				fromUser: currentUser,
				toUser: userId,
				message: msg,
				participants: [currentUser, userId].sort(),
				timestamp: new Date(),
				file
			});
			sendNotification(
				userId,
				$doctors.find((u: any) => u.uid == $session.user?.uid)
					? $doctors.find((u: any) => u.uid == $session.user?.uid)?.name
					: $session.user?.displayName || 'Yeni mesaj',
				msg,
				'https://sehiyye.net/messages'
			);
		}
	};

	// SCROLLS MESSAGES CONTAINER TO BOTTOM TO SHOW NEWER MSGS
	const scrollToBottom = () => {
		const container = document.getElementById('messages-container');
		setTimeout(() => {
			if (container) {
				container.scrollTop = container.scrollHeight;
			}
		}, 15);
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

	// check if file is an image to display thumbnails in chat
	function checkFileExtension(str: any) {
		const lastPart = str.split(',').pop().trim();
		return lastPart.endsWith('jpg') || lastPart.endsWith('png');
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
						let fileURL = `https://sehiyye.online/uploads/${response.filename}`;
						resolve({ url: fileURL, name: file.name });
					} else {
						reject(new Error('File upload failed: ' + response.message));
					}
				}
			};

			xhr.open('POST', 'https://tekoplast.az/docktr/api/?upload');
			xhr.send(formData);
		});
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			sendMessage();
		}
	}

	function downloadFile(url: string, filename: string) {
		fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = filename;
				link.click();
				URL.revokeObjectURL(link.href); // Clean up after download
			})
			.catch((error) => console.error('Download failed:', error));
	}

	let confirmDelete: any = null;

	async function deleteFile(id: string) {
		const docRef = doc(db, 'messages', id);
		await deleteDoc(docRef);
		confirmDelete = null;
	}
</script>

{#if !showDocs && user}
	<button
		class="btn btnBack btn-outline-primary mobileOnly"
		style="position: absolute;
		top: 10px!important;
		left: 5px;
		color: rgb(41, 71, 41);
		border: none !important;
		text-align: center;
		width: 56px;
		padding-left: 20px;
		height: 40px;
		box-shadow: unset;
		z-index: 999;"
		on:click={() => selectedUser.set(null)}
	>
		<span class="material-symbols-outlined">arrow_back_ios</span>
	</button>
	<div
		class="d-flex flex-column mainContainer"
		style="position: relative"
		class:minimizedChat={inputFocused && !window.visualViewport}
	>
		<div
			class="chat mb-3 d-flex flex-column gap-1"
			id="messages-container"
			style="padding-right: .5rem; position: relative"
		>
			<!-- HEADER-->
			<div
				style="position: sticky;
				top: 0px;
				background: #f8f8f8;
				border-bottom: 1px solid #ececec; z-index:99"
			>
				<div class="d-flex align-items-center w-100 pt-1 py-2 mobile-left-padding">
					{#if $user?.displayName}
						{#if $user?.photoURL}
							<img
								src={$user?.photoURL}
								alt="PP"
								style="width: 35px;
							height: 35px;
							border-radius: 100%;
							margin-left: 10px;
							margin-right: 5px;
							object-fit: cover;
							object-position: center;"
							/>
						{/if}
						<h5
							class="flex-1 mb-0 msgRecipientTitle"
							style="max-width: 100%;
    					overflow-x: auto; overflow-y: hidden"
						>
							{$user?.displayName || ''}
						</h5>
					{:else}
						<div
							class="loader"
							style="background-color: var(--primaryColor);
							top: 0;
							right: 10px;
							position: relative;
							margin-inline: auto;"
						></div>
					{/if}

					<div class="d-flex gap-2 ml-auto" style="width: fit-content;">
						<!-- <button
						class="btn btn-outline-primary d-flex align-items-center gap-1"
						style="padding: 5px 15px"
						on:click={() => {
							hideNav.set(!$hideNav);
						}}
					>
						<span class="material-symbols-outlined">
							{$hideNav ? 'arrow_circle_down' : 'arrow_circle_up'}
						</span>
					</button> -->
						<button
							class="btn btn-outline-primary d-flex align-items-center gap-1"
							style="padding: 5px 15px"
							on:click={() => (showDocs = !showDocs)}
						>
							<span class="material-symbols-outlined"> draft </span>
							<span class="pcOnly">Dökümanlar</span>
						</button>
					</div>
				</div>
			</div>
			<!-- END HEADER-->
			{#each messages as message}
				<div
					class="d-flex msgBox align-items-center {message.fromUser !== currentUser
						? 'flex-row'
						: 'flex-row-reverse align-self-end'}"
					style="position: relative;"
				>
					{#if message.fromUser === currentUser}
						{#if $session.user?.photoURL}
							<img
								src={$session.user?.photoURL}
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
								style="font-size: 38px; color: #628a57"
								class="material-symbols-outlined icon-fill">account_circle</span
							>
						{/if}
					{:else if $user?.photoURL}
						<img
							src={$user?.photoURL}
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
							style="font-size: 38px; color: #628a57"
							class="material-symbols-outlined icon-fill">account_circle</span
						>
					{/if}
					<div
						class="message d-flex flex-column flex-1 px-3 {message.fromUser === currentUser
							? 'sent'
							: 'received'}"
						style="position: relative;"
						class:padding-3px={message.file}
					>
						{#if message.message}
							<span class:px-2={message.file} class:pb-2={message.file}>{message.message}</span>
						{/if}
						{#if message.file && message.file.type}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-missing-attribute -->
							<a
								class="fileCard"
								on:click={() => {
									receiptForm = true;
									receiptType = message.file.type;
									receiptData = message;
								}}
								target="_blank"
								class:mt-0={message.file}
							>
								<span
									style="font-size: 30px; color: #30552e"
									class="material-symbols-outlined my-auto"
								>
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
									{message.file.type == 'lab' ? 'Analiz Formu' : 'Resept Formu'}
								</span>
							</a>
						{/if}
						{#if message.file && !message.file.type}
							<a
								class="fileCard"
								class:h-200={checkFileExtension(message.file.name)}
								href={message.file.url}
								target="_blank"
								class:mt-0={message.file}
							>
								{#if checkFileExtension(message.file.name)}
									<div
										style="display: flex; align-items-center-justify-content-center; width: 100%; max-height: 400px; overflow: hidden"
									>
										<img
											style="width: 100%;
											object-fit: cover;
											object-position: center;
											border-radius: 6px"
											src="https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/{message.file.url
												.split('/')
												.pop()}?tr=h-400"
											alt="Attachment"
										/>
									</div>
								{:else}
									<span
										style="font-size: 30px; color: #30552e"
										class="material-symbols-outlined my-auto"
									>
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
										{message.file.name}
									</span>
								{/if}
							</a>
						{/if}
						{#if message.file && !message.file.type && checkFileExtension(message.file.name)}
							<div
								class="d-flex px-3"
								style="justify-content: space-between;
								align-items: center;
								padding-right: 10px;
								background: #00000061;
								border-radius: 7px;
								border-top-left-radius: 0px;
								border-top-right-radius: 0px;
								color: white !important;
								position: absolute;
								bottom: 8px;
								width: calc(100% - 10px);"
							>
								<div class="d-flex gap-1">
									<!-- svelte-ignore a11y-missing-attribute -->
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<!-- svelte-ignore a11y-interactive-supports-focus -->
									<a
										on:click={() => {
											downloadFile(
												`https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/${message.file.url
													.split('/')
													.pop()}`,
												message.file.name
											);
										}}
										class="btn"
										role="button"
									>
										<span class="material-symbols-outlined" style="color: white"> download </span>
									</a>
									<button
										class="btn"
										on:click={() => {
											confirmDelete = message.id;
										}}
									>
										<span class="material-symbols-outlined" style="color: white"> delete </span>
									</button>
								</div>

								<span
									class="msgTime"
									style="font-size: small; color: white!important; text-align: right;"
									>{@html timestamp(message.timestamp)}</span
								>
							</div>
						{:else}
							<span
								class="msgTime"
								style="font-size: small; color: gray!important; text-align: right;
								padding-bottom: 3px;">{@html timestamp(message.timestamp)}</span
							>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<div class="input-group d-flex mt-auto bg-white" id="msgContainer">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			{#if doctor}
				<button
					class="btn btn-outline-secondary d-flex align-items-center justify-content-center dropdown-toggle"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					style="min-width: 60px; border:1px solid rgb(222 226 230); border-right: none"
				>
					<span class="material-symbols-outlined"> attach_file </span>
				</button>
			{:else}
				<label
					for="fileInput"
					style="min-width: 60px; border:1px solid rgb(222 226 230); border-right: none"
					class="btn btn-outline-secondary d-flex align-items-center justify-content-center"
					id="btnAttach"
				>
					<span class="material-symbols-outlined"> attach_file </span>
				</label>
			{/if}
			<ul class="dropdown-menu px-3 py-2 d-flex gap-2 {$mobile ? 'flex-column w-100' : ''}">
				<label
					for="fileInput"
					style="min-width: 60px; border:1px solid rgb(222 226 230);"
					class="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-column w-100"
					id="btnAttach"
				>
					<span class="material-symbols-outlined"> attach_file </span>
					<span class="no-wrap">{$_('actions.send_file')}</span>
				</label>
				<button
					class="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-column w-100"
					style="min-width: 60px; border:1px solid rgb(222 226 230);"
					on:click={() => {
						receiptForm = true;
						receiptType = 'lab';
					}}
				>
					<span class="material-symbols-outlined"> science </span>
					<span class="no-wrap">Analiz Formu</span>
				</button>
				<button
					class="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-column w-100"
					style="min-width: 60px; border:1px solid rgb(222 226 230);"
					on:click={() => {
						receiptForm = true;
						receiptType = 'receipt';
					}}
				>
					<span class="material-symbols-outlined"> receipt_long </span>
					<span class="no-wrap">Resept Formu</span>
				</button>
			</ul>
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
					style="position: relative; width: 10em; min-height: 37.5px"
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
				on:keydown={handleKeyDown}
				bind:this={msgInput}
				on:focus={() => {
					inputFocused = true;
					setTimeout(() => {
						scrollToBottom();
					}, 200);
				}}
				on:blur={() => {
					setTimeout(() => {
						inputFocused = false;
					}, 50);
				}}
			/>
			<button
				style="min-width: 60px;"
				class="btn btn-primary d-flex align-items-center justify-content-center"
				disabled={uploading ? true : false}
				on:click={sendMessage}><span class="material-symbols-outlined"> send </span></button
			>
		</div>
		<button
			class="btn btn-outline-primary d-flex align-items-center"
			style="position: absolute; bottom: 3rem; right: 10px; border-radius: 20px"
			on:click={scrollToBottom}
		>
			<span class="material-symbols-outlined"> keyboard_double_arrow_down </span>
		</button>
	</div>
{:else}
	<div class="d-flex flex-column h-100">
		<button
			class="btn btn-outline-primary mb-3 px-3 d-flex"
			style="width: fit-content;"
			on:click={() => {
				showDocs = false;
			}}
			><span class="material-symbols-outlined"> arrow_back_ios </span>
			<span>{$_('actions.back')}</span></button
		>
		<DocumentsByUser {files} userId={$selectedUser} />
	</div>
{/if}

{#if confirmDelete}
	<Confirm
		message={$_('actions.delete_file')}
		no="İmtina et"
		onConfirm={() => {
			deleteFile(confirmDelete);
		}}
		onCancel={() => {
			confirmDelete = false;
		}}
	/>
{/if}

{#if receiptForm}
	<Modal bind:showModal={receiptForm} fullScreen>
		<Receipt {receiptType} {receiptData} bind:showModal={receiptForm} />
	</Modal>
{/if}

<style>
	.mainContainer {
		height: calc(100dvh - 85px);
	}
	.chat {
		max-height: calc(100dvh - 150px);
		overflow-y: auto;
	}
	.message {
		padding: 8px;
		margin: 4px;
		border-radius: 10px;
		max-width: calc(100dvw - 100px);
		background: #dddada;
		box-shadow: 0px 0px 5px #00000012;
		/* max-width: 0%; */
		color: #415e39;
	}
	.sent {
		background-color: #65a3547d;
		text-align: right;
	}
	.received {
		background-color: white;
	}
	.sent .msgTime {
		color: #f8f8f8 !important;
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
		text-align: center;
		justify-content: center;
		align-items: center;
		font-size: small;
		overflow-x: clip;
		height: 80px !important;
		min-height: 80px !important;
		border-radius: 6px;
		box-shadow: 0px 0px 5px #00000024;
		margin-block: 0.5rem;
		cursor: pointer;
		transition-duration: 0.2s;
		text-decoration: none;
		color: unset;
		width: 100%;
		flex-direction: column;
	}
	.dropdown-menu:not(.show) {
		display: none !important;
	}
	.sent .fileCard {
		align-self: end;
	}
	.padding-3px {
		padding: 5px 5px 0px 5px !important;
	}
	.fileCard:hover {
		background: #e6e6e6;
	}
	.msgRecipientTitle::-webkit-scrollbar {
		display: none;
	}
	.h-200 {
		height: 100% !important;
		max-height: 300px !important;
	}
	@media screen and (min-width: 992px) {
		.msgBox {
			width: 60% !important;
		}
	}
	@media screen and (max-width: 992px) {
		.mainContainer {
			height: calc(100dvh - 30px);
			transition-duration: 0.2s;
		}
		.chat {
			max-height: calc(100dvh - 80px) !important;
		}
		.minimizedChat {
			height: 50dvh !important;
			min-height: 50dvh !important;
		}
		.msgBox {
			width: 100% !important;
		}
		.mobile-left-padding {
			padding-left: 2rem !important;
		}
		/* #msgContainer {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		} */
	}
</style>
