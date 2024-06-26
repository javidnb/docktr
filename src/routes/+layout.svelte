<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { fade } from 'svelte/transition';
	import Nav from '$lib/components/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { LayoutData } from './$types';
	import { browser } from '$app/environment';
	import { doctors, appointments, dataLoading } from '$lib/store/dataStore';
	import { cubicIn } from 'svelte/easing';
	import '../lib/i18n';
	import { locale, _ } from 'svelte-i18n';
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

	const changeLocale = (newLocale: string) => {
		locale.set(newLocale);
	};

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
			console.log($doctors);
		}
	});
</script>

<div style="min-height: 100dvh; display: flex; flex-direction: column">
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

	<section
		class="py-3"
		style="border-top: 1px solid rgb(236, 236, 236);
		background: var(--primaryColor);
		color: white; margin-top: auto"
	>
		<div class="container">
			<div class="row">
				<div class="col">
					<span>© Səhiyyə.online 2023-2024</span>
				</div>
				<div class="col mobileOnly">
					<div class="dropdown">
						<button
							class="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-1 langSelector"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							style="#d5e4d1"
						>
							<span class="material-symbols-outlined"> globe </span>{$locale?.toUpperCase()}
						</button>
						<ul class="dropdown-menu">
							<li>
								<button class="dropdown-item" on:click={() => changeLocale('az')}
									><img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/img/az.png"
										alt="Azerbaijan Flag"
									/>Azərbaycan dili</button
								>
							</li>
							<li>
								<button class="dropdown-item" on:click={() => changeLocale('tr')}>
									<img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/turkey_dBbuCptvk.png?updatedAt=1719140350211"
										alt="Turkish Flag"
									/>Türkçe</button
								>
							</li>
							<li>
								<button class="dropdown-item" on:click={() => changeLocale('ru')}>
									<img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/img/ru.png"
										alt="Russian Flag"
									/>Русский</button
								>
							</li>
							<li>
								<button class="dropdown-item" on:click={() => changeLocale('en')}>
									<img
										style="width:20px;height:20px;margin-right:.5rem"
										src="https://ik.imagekit.io/d2nwsj0ktvh/img/en.png"
										alt="English Flag"
									/>English</button
								>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>
	<SvelteToast />
</div>

<style src="$lib/style/style.css"></style>
