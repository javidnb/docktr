<script lang="ts">
	import { session } from '$lib/session';

	async function postData(userData: any) {
		let dataToPost = { table: 'users', data: { ...userData } };
		const response = await fetch('https://tekoplast.az/docktr/api/?postData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...dataToPost }),
			cache: 'no-cache'
		});

		if (response.ok) {
			session.update((cur: any) => {
				return {
					...cur,
					userData,
					loggedIn: true,
					loading: false
				};
			});
			console.log('Data posted successfully', response);
		} else {
			// Handle error response
			console.error('Failed to post data');
			session.update((cur: any) => {
				return {
					...cur,
					userData,
					loggedIn: true,
					loading: false
				};
			});
		}
	}

	function handleClick() {
		// postData({ uid: 1, displayName: 'Cavka' });
	}
</script>

<section>
	<h5>Hastalık Geçmişi</h5>
	<button class="btn btn-primary w-50" on:click={handleClick}>Post</button>
</section>
