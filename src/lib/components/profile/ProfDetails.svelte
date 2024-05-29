<script lang="ts">
	import { session } from '$lib/session';
	import { onMount } from 'svelte';
	import { dataLoading } from '$lib/store/dataStore';
	import { putData } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';

	$: userData = $session;
	let dialog: any; // Reference to the dialog tag
	onMount(() => {
		dialog = document.getElementById('confirmation-dialog');
	});

	let fileInput, avatar: any;

	const onFileSelected = (e: any) => {
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			if (e.target) {
				avatar = e.target.result;
				console.log(avatar);
			}
		};
	};

	async function formSubmit(e: SubmitEvent) {
		let result;
		dataLoading.set(true);
		const formData = new FormData(e.target as HTMLFormElement);
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
</script>

<form class="d-flex flex-column gap-1" on:submit|preventDefault={formSubmit}>
	<!-- USER PHOTO-->
	<div
		style="position: relative;
    justify-content: center;
    display: flex;"
	>
		{#if userData?.user?.photoURL || avatar}
			<img
				src={avatar ? avatar : userData?.user?.photoURL}
				alt="Profile Pic"
				style="max-width: 100px; border-radius: 100%; aspect-ratio: 1/1; object-fit: cover;"
			/>
		{:else}
			<div
				style="width: 100px; 
				height: 100px;
				color: var(--primaryColor);
				border-radius: 100%;
				border: 3px solid var(--primaryColor);
				display: flex; align-items: center; justify-content: center;"
			>
				<span class="material-symbols-outlined icon-fill" style="font-size: 4rem"> person </span>
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
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: end;cursor: pointer"
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
	<button class="btn btn-primary mt-3">Yenilə</button>
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
</style>
