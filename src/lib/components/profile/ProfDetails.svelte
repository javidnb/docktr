<script lang="ts">
	import { session } from '$lib/session';
	import { getAuth, updateProfile } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { dataLoading } from '$lib/store/dataStore';

	$: userData = $session;
	let dialog: any; // Reference to the dialog tag
	onMount(() => {
		dialog = document.getElementById('confirmation-dialog');
	})

	function formSubmit(e: SubmitEvent) {
		dataLoading.set(true);
		const formData = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		const auth = getAuth();
		if (auth.currentUser) {
			updateProfile(auth.currentUser, {
				displayName: data.displayName,
				photoURL: data.photoURL
			}).then(
				() => {
					console.log('yo');
					dataLoading.set(false);
				},
				function (error) {
					console.log(error);
					dataLoading.set(false);
				}
			);
		}
	}
</script>

<form class="d-flex flex-column gap-1" on:submit|preventDefault={formSubmit}>
	<label for="displayName">Adınız</label>
	<input
		name="displayName"
		id="displayName"
		type="text"
		class="form-control"
		value={userData?.user?.displayName}
	/>
	<label for="email">Email</label>
	<input id="email" type="email" readonly class="form-control" value={userData?.user?.email} />
	<label for="phone">Tel</label>
	<input
		name="phone"
		id="phone"
		type="number"
		class="form-control"
		value={userData?.user?.phoneNumber}
	/>
	<label for="photoURL">Photo</label>
	{#if userData?.user?.photoURL}
		<img
			src={userData?.user?.photoURL}
			alt="Profile Pic"
			style="max-width: 100px; border-radius: 100%"
		/>
	{/if}
	<input
		name="photoURL"
		id="photoURL"
		type="text"
		class="form-control"
		value={userData?.user?.photoURL}
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
