<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { getData } from '$lib/firebase.client';
	import { fade, slide } from 'svelte/transition';
	import Nav from '$lib/components/Nav.svelte';

	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';
	export let data: LayoutData;
	import { doctors } from '$lib/dataStore';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import type { Doctor } from '$lib/interfaces/doctor.interface';

	let dataLoading: boolean = true;

	let userr: any = null;

	onMount(async () => {
		if (browser) {
			userr = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? '') : null;
		}

		const user: any = await data.getAuthUser();
		const loggedIn = user ? true : false;

		session.update((cur: any) => {
			dataLoading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false
			};
		});

		if (!$doctors.length) {
			dataLoading = true;
			try {
				let docs: Doctor[] = (await getData('doctors')) ?? [];
				doctors.set(docs);
				dataLoading = false;
			} catch (error) {
				console.error('Error fetching data:', error);
				dataLoading = false;
			}
		}
	});
</script>

<Nav />

<section style="position: absolute; width: 100%; z-index: -1">
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">&#8203;</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

{#key data.url}
	<div in:fade={{ duration: 100, easing: cubicIn }}>
		<slot />
	</div>
{/key}
