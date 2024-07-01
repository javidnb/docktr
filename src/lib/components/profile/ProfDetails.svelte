<script lang="ts">
	import { session } from '$lib/session';
	import { onMount } from 'svelte';
	import { dataLoading, postData } from '$lib/store/dataStore';
	import { putData } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';

	let file: any;
	let uploadProgress = 0;
	let uploading = false;
	let disabled = false;

	$: userData = $session;
	let dialog: any; // Reference to the dialog tag
	onMount(() => {
		dialog = document.getElementById('confirmation-dialog');
	});

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

	async function formSubmit(e: SubmitEvent) {
		dataLoading.set(true);
		disabled = true;

		if (file) {
			uploadFile(e);
			return;
		}
		let result;

		const formData: any = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		if (userData.user?.uid) result = await putData('users', 'uid', userData.user?.uid, { ...data });
		if (result) {
			toast.push('Uğurlu!', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(91 144 77)',
					'--toastBarBackground': '#1d5b3c'
				}
			});
			disabled = false;
		}
		$session.user = { ...$session.user, ...data };

		// const auth = getAuth();
		// if (auth.currentUser) {
		// 	updateProfile(auth.currentUser, {
		// 		displayName: data.displayName,
		// 		photoURL: data.photoURL
		// 	}).then(
		// 		() => {
		// 			console.log('yo');
		// 			dataLoading.set(false);
		// 		},
		// 		function (error) {
		// 			console.log(error);
		// 			dataLoading.set(false);
		// 		}
		// 	);
		// }
	}

	function uploadFile(e: SubmitEvent) {
		if (!file) {
			alert('Please select a file');
			return;
		}

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
			file = null;
			formSubmit(e);
		});

		xhr.onreadystatechange = async () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(xhr.responseText);

				if (xhr.status === 200 && response.status === 'success') {
					console.log('File uploaded successfully: ' + response.filename);
					if (userData.user?.uid) {
						let photoURL = `https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/${response.filename}`;
						await putData(
							'users',
							'uid',
							userData.user?.uid,
							{
								photoURL
							},
							true
						);
						userData.user.photoURL = photoURL;
						session.set({ ...userData });
					}
				} else {
					console.log('File upload failed: ' + response.message);
				}
			}
		};

		xhr.open('POST', 'https://tekoplast.az/docktr/api/?upload');
		xhr.send(formData);
	}
</script>

<form class="d-flex flex-column gap-1" on:submit|preventDefault={formSubmit}>
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
					style="max-width: 100px; border-radius: 100%; aspect-ratio: 1/1; object-fit: cover;"
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
						display: flex; justify-content: center"
					>
						<span class="material-symbols-outlined icon-fill"> add </span>
					</button>
					<ul class="dropdown-menu">
						<li><a class="dropdown-item" href="#">Action</a></li>
						<li><a class="dropdown-item" href="#">Another action</a></li>
						<li><a class="dropdown-item" href="#">Something else here</a></li>
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
				<span class="material-symbols-outlined icon-fill" style="font-size: 4rem"> person </span>
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
	<label for="displayName">Adınız</label>
	<input
		name="displayName"
		id="displayName"
		type="text"
		class="form-control"
		value={userData?.user?.displayName ?? ''}
	/>
	<label for="email">Email</label>
	<input id="email" type="email" readonly class="form-control" value={userData?.user?.email} />
	<label for="phone">Tel</label>
	<input
		name="phoneNumber"
		id="phone"
		type="text"
		class="form-control"
		value={userData?.user?.phoneNumber ?? ''}
	/>
	<button class="btn btn-primary mt-3" {disabled}>Yenilə</button>
	{#if uploading}
		<div
			class="progress mt-3"
			role="progressbar"
			aria-label="Upload percentage"
			aria-valuenow={uploadProgress}
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<div class="progress-bar" style="width: {uploadProgress}%">{uploadProgress.toFixed(2)}%</div>
		</div>
	{/if}
</form>

<dialog
	style="top: 1rem;
    width: max-content;
    left: 1rem;
    margin-left: auto;
    margin-right: 1rem;
    border: 0px;
    box-shadow: rgb(0 0 0 / 20%) 0px 0px 5px;
    border-radius: 14px;"
>
	This is an open dialog window
</dialog>

<style>
	/* section {
		height: 100%;
		background-color: white;
		width: 100%;
		border-radius: 10px;
		padding: 1rem;
	} */
	.progress-bar {
		background-color: var(--primaryColor);
	}
	.btn-primary:disabled {
		background-color: gray;
	}
</style>
