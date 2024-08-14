<script lang="ts">
	import { db, initializeFirebase } from '$lib/firebase.client';
	import { session } from '$lib/session';
	import {
		addDoc,
		collection,
		getDocs,
		query,
		where,
		type CollectionReference
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	export let files: any = [];
	export let userId: any = null;
	export let newFile: boolean = false;
	let fileInput: any = null;
	let selectedFile: File | null = null;
	let uploadProgress = 0;
	let uploading = false;
	const messagesCollection = collection(db, 'messages');

	onMount(async () => {
		if (userId) {
			await initializeFirebase();
			if (db) {
				let messagesCollection: CollectionReference;
				let participants = [$session.user?.uid, userId].sort();
				messagesCollection = collection(db, 'messages');
				if ($session.user) {
					const q = query(messagesCollection, where('participants', '==', participants));
					const querySnapshot = await getDocs(q);
					querySnapshot.forEach((doc) => {
						const data = doc.data();
						if (data.file) {
							files = [...files, data];
						}
					});
				}
			}
		}
	});

	const onFileSelected = (e: any) => {
		let file = e.target.files[0];
		if (file) {
			const fileExtension = getFileExtension(file.name);
			const fileType = file.type;

			if (!allowedMimeTypes.includes(fileType) || !allowedExtensions.includes(fileExtension)) {
				selectedFile = null;
			} else {
				selectedFile = file;
			}
		}

		if (selectedFile) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = async (e) => {
				if (e.target) {
					const formData = new FormData();
					formData.append('file', file);
				}
			};
			sendFile();
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
						let fileURL = `https://sehiyye.online/uploads/${response.filename}`;
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

	const sendFile = async () => {
		let file = null;
		if (selectedFile) {
			file = await uploadFile(selectedFile);
		}
		await addDoc(messagesCollection, {
			fromUser: $session.user?.uid,
			toUser: userId,
			message: '',
			participants: [$session.user?.uid, userId].sort(),
			timestamp: new Date(),
			file
		});
		selectedFile = null;
	};

	function getFileExtension(filename: string): string {
		return filename.split('.').pop()?.toLowerCase() ?? '';
	}

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
</script>

<div
	style="display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); 
    gap: 1rem; max-height: 60dvh; overflow-y: scroll;
    padding: 5px"
>
	{#if files.length}
		{#each files as file}
			<a class="fileCard w-100" href={file.file.url} target="_blank">
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
					{file.file?.name || ''}
				</span>
			</a>
		{/each}
	{/if}
</div>

{#if newFile}
	{#if uploading}
		<div
			class="progress h-100 mt-3 mb-2"
			style="position: relative; max-width: 100%; min-height: 25px; margin-inline: 5px"
			role="progressbar"
			aria-label="Upload percentage"
			aria-valuenow={uploadProgress}
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<span
				class="progress-bar"
				style="display: flex;
						align-items: center;
						border: 1px solid #dee2e6;
						padding-inline: .5rem;
						position: relative;
						width: {uploadProgress}%"
			/>
		</div>
	{:else}
		<div class="d-flex mt-3 mb-2" style="margin-inline: 5px">
			<label
				for="fileInput"
				style="min-width: 60px; border:1px solid rgb(222 226 230); border-right: none; border-radius: 8px"
				class="btn btn-outline-primary d-flex align-items-center justify-content-center flex-column card cursor-pointer"
				id="btnAttach"
			>
				<span class="material-symbols-outlined"> attach_file </span>
				<span style="font-size: small; color: gray">{$_('actions.add_file')}</span>
			</label>
			<input
				class="form-control d-none"
				id="fileInput"
				type="file"
				accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.tar,.gz"
				on:change={(e) => onFileSelected(e)}
				bind:this={fileInput}
			/>
		</div>
	{/if}
{/if}

<style>
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
		width: 100%!important;
		flex-direction: column;
		flex: 1;
		min-width: unset;
		max-width: unset;
	}
	.fileCard:hover {
		background: var(--primaryColor);
		color: white;
	}
	.progress-bar {
		background-color: var(--primaryColor);
	}
</style>
