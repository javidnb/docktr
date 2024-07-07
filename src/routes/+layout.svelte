<script lang="ts">
	import { onMount } from 'svelte';
	// import { fade } from 'svelte/transition';
	import Nav from '$lib/components/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { LayoutData } from './$types';
	import { doctors, putData } from '$lib/store/dataStore';
	import '../lib/i18n';
	import { locale, _ } from 'svelte-i18n';
	import { session } from '$lib/session';
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

	const changeLocale = async (newLocale: string) => {
		let local = $locale;
		locale.set(newLocale);
		if ($session.user?.uid && local != newLocale) {
			await putData('users', 'uid', $session.user?.uid, { lang: newLocale }, true);
		}
	};

	onMount(async () => {
		await data.getAuthUser();
	});

	$: if ($session.user?.lang) changeLocale($session.user?.lang);
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
		<!-- in:fade={{ duration: 100, easing: cubicIn }} -->
		<div>
			<slot />
		</div>
	{/key}

	<section
		class="py-3 footer"
		style="border-top: 1px solid rgb(236, 236, 236);
		background: var(--primaryColor);
		color: white; margin-top: auto"
	>
		<div class="container">
			<div class="row align-items-center">
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
							style="color: #d5e4d1"
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
