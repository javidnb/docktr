<script lang="ts">
	import { session } from '$lib/session';
	console.log($session);
	$: userData = $session;
</script>

<div>
	Email: {userData?.user?.email}
</div>

<style>
	/* section {
		height: 100%;
		background-color: white;
		width: 100%;
		border-radius: 10px;
		padding: 1rem;
	} */
</style>
