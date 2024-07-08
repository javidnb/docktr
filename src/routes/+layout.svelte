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
	import { page } from '$app/stores';
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

	onMount(async () => {
		await data.getAuthUser();
	});

	$: if ($session.user?.lang) locale.set($session.user?.lang);
	$: curPage = $page.route.id;
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

	{#if curPage !== '/messages'}
		<section
			class="py-3 footer pcOnly"
			style="border-top: 1px solid rgb(236, 236, 236);
				background: var(--primaryColor);
				color: white; margin-top: auto"
		>
			<div class="container">
				<div class="row align-items-center">
					<div class="col">
						<span>© Səhiyyə.online 2023-2024</span>
					</div>
				</div>
			</div>
		</section>
	{/if}
	<SvelteToast />
</div>

<style src="$lib/style/style.css"></style>
