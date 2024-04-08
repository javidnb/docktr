<script lang="ts">
	import { session } from '$lib/session';
	console.log($session);
	$: userData = $session;
</script>

<section>
	<div class="container">
		<div class="row">
			<div class="col">
				Email: {userData?.user?.email}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		height: 100%;
		background-color: white;
		width: 100%;
		border-radius: 10px;
		padding: 1rem;
	}
</style>
