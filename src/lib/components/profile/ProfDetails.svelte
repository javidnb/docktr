<script lang="ts">
	import { session } from '$lib/session';
	import { dataLoading, loginModal, putData } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { _ } from 'svelte-i18n';
	import Confirm from '$lib/helpers/Confirm.svelte';
	import { auth } from '$lib/firebase.client';
	import { updateProfile } from 'firebase/auth';

	let file: any;
	let uploadAfterSelect: boolean = false;
	let uploadProgress = 0;
	let uploading = false;
	let disabled = false;
	let showModal: boolean = false;
	let displayName: any = null;
	let photoURL: any = null;
	let dataRetrieved: boolean = false;

	$: userData = $session;

	$: if ($session.user) {
		if ($session.user?.email?.endsWith('@sehiyye.online')) {
			let us = userData.user;
			us = {
				...us,
				email: '',
				phoneNumber: $session.user?.email.substring(0, $session.user?.email.length - 15)
			};
			userData = { ...userData, user: us };
		}
		if (!dataRetrieved) {
			photoURL = $session.user.photoURL;
			displayName = $session.user.displayName;
			dataRetrieved = true;
		}
	}

	$: if (!$session.user) {
		loginModal.set(true);
	} else loginModal.set(false);

	let fileInput, avatar: any;

	const onFileSelected = (e: any) => {
		let image = e.target.files[0];
		file = image;
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = async (e) => {
			if (e.target) {
				avatar = e.target.result;
				const formData = new FormData();
				formData.append('file', image);
			}
		};
	};

	async function updateProf() {
		let result;
		disabled = true;
		if (file) {
			await uploadFile();
		}
		if (userData.user?.uid) {
			result = await putData('users', 'uid', userData.user?.uid, { displayName, photoURL }, true);
		}
		if (result) {
			if (auth.currentUser) {
				await updateProfile(auth.currentUser, {
					displayName: displayName,
					photoURL: photoURL ?? null
				});
			}
			$session.user = { ...$session.user, displayName, photoURL };
			toast.push($_('actions.success'), {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(91 144 77)',
					'--toastBarBackground': '#1d5b3c'
				}
			});
			disabled = false;
		}
		// FIRESTORE
		// if ($session.user?.uid) {
		// 	const docRef = doc(db, 'users', $session.user?.uid);
		// 	const docSnap = await getDoc(docRef);

		// 	if (docSnap.exists()) {
		// 		let usrData = {
		// 			...docSnap.data(),
		// 			displayName: displayName,
		// 			photoURL: photoURL ?? null
		// 		};
		// 		await setDoc(docRef, usrData);
		// 		session.set({
		// 			user: usrData,
		// 			loggedIn: true,
		// 			loading: false
		// 		});

		// 		toast.push($_('actions.success'), {
		// 			duration: 2000,
		// 			theme: {
		// 				'--toastColor': 'mintcream',
		// 				'--toastBackground': 'rgb(91 144 77)',
		// 				'--toastBarBackground': '#1d5b3c'
		// 			}
		// 		});
		// 		disabled = false;
		// 	}
		// }
	}

	async function uploadFile() {
		if (!file) {
			alert('Please select a file');
			return;
		}

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response: any = await new Promise((resolve, reject) => {
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
					file = null;
				});

				xhr.onreadystatechange = () => {
					if (xhr.readyState === XMLHttpRequest.DONE) {
						if (xhr.status === 200) {
							resolve(JSON.parse(xhr.responseText));
						} else {
							reject(new Error('File upload failed: ' + xhr.statusText));
						}
					}
				};

				xhr.open('POST', 'https://tekoplast.az/docktr/api/?upload');
				xhr.send(formData);
			});

			if (response.status === 'success') {
				photoURL = `https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/${response.filename}`;
			} else {
				console.log('File upload failed: ' + response.message);
			}
		} catch (error) {
			console.error(error);
		}
	}

	// remove profile picture
	async function modalConfirmed() {
		showModal = false;
		file = null;
		photoURL = null;
		avatar = null;
		updateProf();
	}
</script>

{#if $session.user}
	<form class="d-flex flex-column gap-1 h-100" on:submit|preventDefault={updateProf}>
		<!-- USER PHOTO-->
		<div
			style="position: relative;
			justify-content: center;
			display: flex;"
		>
			{#if userData?.user?.photoURL || avatar}
				<div style="position: relative;">
					<img
						src={avatar ? avatar : userData?.user?.photoURL}
						alt="Profile Pic"
						style="max-width: 100px; border-radius: 100%; 
						aspect-ratio: 1/1; object-fit: cover; cursor: pointer"
						data-bs-toggle="dropdown"
					/>

					<div class="dropdown">
						<button
							class="btn btn-secondary"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							style="position: absolute; right: -5px; bottom: -5px;
							background: white; border: 1px solid #ececec;
							border-radius: 8px; padding: 5px; color: black;
							display: flex; justify-content: center;"
						>
							<span class="material-symbols-outlined icon-fill"> add </span>
						</button>
						<ul class="dropdown-menu">
							<li>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
								<label
									for="fileInput"
									on:click={() => {
										uploadAfterSelect = true;
									}}
									class="dropdown-item d-flex align-items-center gap-1"
									style="cursor: pointer;"
									><span class="material-symbols-outlined"> add </span>{$_('actions.add_pp')}</label
								>
							</li>
							<li>
								<a
									class="dropdown-item d-flex align-items-center gap-1"
									href={avatar ? avatar : userData?.user?.photoURL}
									target="_blank"
									><span class="material-symbols-outlined"> fullscreen </span>{$_(
										'actions.view_pp'
									)}</a
								>
							</li>
							<li>
								<button
									class="dropdown-item d-flex align-items-center gap-1"
									on:click|preventDefault={() => {
										showModal = true;
									}}
									><span class="material-symbols-outlined"> delete </span>{$_(
										'actions.remove_pp'
									)}</button
								>
							</li>
						</ul>
					</div>
				</div>
			{:else}
				<div
					style="width: 100px; 
				height: 100px;
				color: var(--primaryColor);
				border-radius: 100%;
				border: 3px solid var(--primaryColor);
				display: flex; align-items: center; justify-content: center; position: relative"
				>
					<span class="material-symbols-outlined icon-fill" style="font-size: 4rem!important">
						person
					</span>
					<span
						class="material-symbols-outlined icon-fill"
						style="position: absolute; right: -5px; bottom: -5px;
					background: white; border: 1px solid #ececec; border-radius: 8px; padding: 5px"
					>
						add
					</span>
				</div>
			{/if}
			<!-- <input
		name="photoURL"
		id="photoURL"
		type="text"
		class="form-control"
		value={userData?.user?.photoURL ?? ''}
	/> -->
			<label
				for="fileInput"
				style="
				position: absolute;
				top: -7px;
				right: -7px;
				color: var(--primaryColor);
				width: {userData?.user?.photoURL ? '10%' : '100%'};
				height: 100%;
				display: flex;
				justify-content: end;
				cursor: pointer"
			>
			</label>

			<input
				class="form-control d-none"
				id="fileInput"
				type="file"
				accept=".jpg, .jpeg, .png"
				on:change={(e) => onFileSelected(e)}
				bind:this={fileInput}
			/>
		</div>
		<!-- {#if file}
		<button class="btn btn-outline-primary" on:click={uploadFile}>Upload</button>
	{/if} -->

		<!-- END PHOTO-->
		<label for="displayName">{$_('login.name_surname')}</label>
		<input
			name="displayName"
			id="displayName"
			type="text"
			class="form-control"
			bind:value={displayName}
		/>
		{#if userData?.user?.email}
			<label for="email">{$_('login.email')}</label>
			<input
				name="email"
				id="email"
				type="email"
				class="form-control"
				value={userData?.user?.email}
				disabled
			/>
		{/if}
		{#if userData?.user?.phoneNumber}
			<label for="phone">{$_('login.mobile')}</label>
			<input
				name="phoneNumber"
				id="phone"
				type="text"
				class="form-control"
				value={userData?.user?.phoneNumber ?? ''}
				disabled
			/>
		{/if}
		<button class="btn btn-primary mt-3 btnLoader" {disabled}>
			<span>{$_('actions.update')}</span>
			{#if $dataLoading}
				<div class="loader"></div>
			{/if}
		</button>
		{#if uploading}
			<div
				class="progress mt-3"
				role="progressbar"
				aria-label="Upload percentage"
				aria-valuenow={uploadProgress}
				aria-valuemin="0"
				aria-valuemax="100"
			>
				<div class="progress-bar" style="width: {uploadProgress}%">
					{uploadProgress.toFixed(2)}%
				</div>
			</div>
		{/if}
	</form>
{:else}
	<!-- <button
		class="btn btn-outline-primary w-100 p-3 mt-5"
		on:click={() => {
			loginModal.set(true);
		}}>{$_('login.login_header')}</button
	> -->
	<div
		class="d-flex w-100 h-100 align-items-center justify-content-center s-i1Tk5jFGYwcs"
		style="min-height: calc(-300px + 100dvh);"
	>
		<h6 class="s-i1Tk5jFGYwcs" style="color: gray;">Sehiyye.online</h6>
	</div>
{/if}

{#if showModal}
	<Confirm
		message={$_('actions.remove_pp')}
		onConfirm={modalConfirmed}
		onCancel={() => {
			showModal = false;
		}}
	/>
{/if}

<style>
	/* section {
		height: 100%;
		background-color: white;
		width: 100%;
		border-radius: 10px;
		padding: 1rem;
	} */
	.progress .progress-bar {
		background-color: var(--primaryColor);
		position: relative;
	}
	.btn-primary:disabled {
		background-color: gray;
	}
</style>
