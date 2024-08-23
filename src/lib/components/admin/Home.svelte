<script lang="ts">
	import { onMount } from 'svelte';
	import Contacts from './Contacts.svelte';
	import { limitDashboardData } from '$lib/store/dataStore';
	import AwaitingComments from './AwaitingComments.svelte';
	import Reviews from './Reviews.svelte';
	import Messages from '../chat/Messages.svelte';

	onMount(() => {
		limitDashboardData.set(true);
		return () => {
			limitDashboardData.set(false);
		};
	});
</script>

<div>
	<div class="row row-gap-3">
		<div class="col-12 col-md-4 h-100">
			<div class="card p-3">
				<h6 class="cardTitle">Gələn Mesajlar</h6>
				<Contacts />
			</div>
		</div>
		<div class="col-12 col-md-4 h-100">
			<div class="card p-3" style="max-height: 100%; overflow-y: scroll">
				<h6 class="cardTitle">Şərh Təsdiq</h6>
				<AwaitingComments />
			</div>
		</div>
		<div class="col-12 col-md-4 h-100 d-flex flex-column row-gap-3">
			<div class="card p-3">
                <h6 class="cardTitle">Mesajlar</h6>
				<Messages />
			</div>
			<div class="card p-3">
				<h6 class="cardTitle">Call Reviews</h6>
				<Reviews />
			</div>
		</div>
	</div>
</div>

<style>
	.cardTitle {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}
</style>
