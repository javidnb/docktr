<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { fade, slide } from 'svelte/transition';
	import Nav from '$lib/components/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';
	import { doctors, appointments, dataLoading } from '$lib/store/dataStore';
	import { cubicIn } from 'svelte/easing';
	export let data: LayoutData;

	if (data?.doctors?.length) {
		const dooc = data.doctors
			.map((item: any) => ({
				...item,
				branches: JSON.parse(item.branches)
			}))
			.sort((a: any, b: any) => b.star - a.star);
		doctors.set(dooc);
	}

	let userr: any = null;

	async function getUser(user: any) {
		try {
			let time = new Date().getTime();
			const response = await fetch(
				`https://tekoplast.az/docktr/api/?user&id=${user.uid}&t=${time}`
			);
			const result = await response.json();
			console.log('user: ', result);
			if (result) {
				getAppointments(result);

				session.set({
					user: { ...result, token: user.accessToken },
					loggedIn: true,
					loading: false
				});
				return null;
			}
			dataLoading.set(false);
			return response;
		} catch (error) {
			console.error(error);
			dataLoading.set(false);
			return null;
		}
	}

	async function getAppointments(user: any) {
		try {
			let time = new Date().getTime();
			let response;
			console.log('user doktor id: ', user.doctor);
			if (user.doctor) {
				response = await fetch(
					`https://tekoplast.az/docktr/api/?appointments&id=${user.doctor}&type=doctor&t=${time}`
				);
			} else {
				response = await fetch(
					`https://tekoplast.az/docktr/api/?appointments&id=${user.uid}&t=${time}`
				);
			}

			const result = await response.json();
			if (result) {
				console.log('appointments: ', result);
				appointments.set(result);
				dataLoading.set(false);
				return null;
			}
			return response;
		} catch (error) {
			console.error(error);
			dataLoading.set(false);
			return null;
		}
	}

	onMount(async () => {
		if (browser) {
			userr = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? '') : null;
		}

		const user: any = await data.getAuthUser();
		const loggedIn = user ? true : false;

		if (loggedIn) {
			dataLoading.set(true);
			getUser(user);
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

<SvelteToast />

{#key data.url}
	<div in:fade={{ duration: 100, easing: cubicIn }}>
		<slot />
	</div>
{/key}

<style src="$lib/style/style.css"></style>
