<script lang="ts">
	import { appointments, doctors } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import DoctorCard from '../DoctorCard.svelte';

	let favourites: any = [];

	onMount(() => {
		let uids = Array.from(new Set($appointments.map((obj) => obj.doctorId)));
		console.log(uids);
		console.log($doctors);
		favourites = $doctors.filter((obj) => uids.includes(obj.id));
		console.log(favourites);
	});
</script>

<div class="d-flex flex-wrap gap-3">
	{#each favourites as doc}
		<DoctorCard props={doc} />
	{/each}
</div>
