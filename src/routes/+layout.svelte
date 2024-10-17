<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { LayoutData } from './$types';
	import { appointments, appointmentsLoading, dataLoading, doctors } from '$lib/store/dataStore';
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

	if (data?.userData) {
		session.set({ user: data.userData, loggedIn: true });
	} else {
		dataLoading.set(false);
	}

	if (data?.appointments?.length) {
		appointments.set(data.appointments);
	}

	// if (browser) {
	// 	window.onerror = function (message, source, lineno, colno, error) {
	// 		postData('errors', { error: JSON.stringify({ message, source, lineno, colno, error }) });
	// 	};
	// }

	onMount(async () => {
		let usr = await data.getAuthUser();
		if (!usr) appointmentsLoading.set(false);
	});

	$: if ($session?.user?.lang) {
		locale.set($session.user?.lang);
	}
	// $: if ($session.user?.doctor) goto('./doctor');
	$: curPage = $page.route.id;
</script>

<div style="min-height: 100dvh; display: flex; flex-direction: column">
	{#if curPage !== '/doctor' && curPage !== '/search' && curPage !== '/admin' && !curPage?.includes('/appointments/')}
		<Nav />

		<!-- <section style="position: absolute; width: 100%; z-index: -1">
			<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
				<h1 class="display-4">&#8203;</h1>
				<hr />
			</div>
		</section> -->
	{/if}

	{#key data.url}
		<!-- in:fade={{ duration: 100, easing: cubicIn }} -->
		<div>
			<slot />
		</div>
	{/key}

	{#if curPage !== '/messages' && curPage !== '/doctor' && curPage !== '/search' && curPage !== '/admin' && !curPage?.includes('/appointments/')}
		<section
			class="py-3 footer pcOnly"
			style="border-top: 1px solid rgb(236, 236, 236);
				background: var(--primaryColor);
				color: white; margin-top: auto"
		>
			<div class="container">
				<div class="row align-items-center py-3">
					<div class="col-12 col-md-7">
						<div class="d-flex gap-3">
							<a class="footerLink" href="/usage">{$_('usage.header')}</a>
							<a class="footerLink" href="/about">{$_('nav.about')}</a>
							<a class="footerLink" href="/contact">{$_('nav.contact')}</a>
						</div>
						<div class="d-flex gap-2 align-items-center mt-2">
							<span>© Səhiyyə.online</span>
							<span>2023-{new Date().getFullYear()}</span>
						</div>
					</div>
					<div class="col-12 col-md-5">
						<div class="d-flex gap-2 align-items-center justify-content-end">
							<a href="tel:+994502803233" class="btn btn-primary d-flex gap-2 align-items-center"
								><img
									src="https://ik.imagekit.io/d2nwsj0ktvh/phone_VpGG5ckQl.png"
									style="width: 30px;"
									alt="Phone"
								/> <span>+994 50 280 3233</span></a
							>
							<a
								href="https://www.instagram.com/sehiyye.online/"
								target="_blank"
								class="btn btn-primary d-flex gap-2 align-items-center"
								><img
									src="https://ik.imagekit.io/d2nwsj0ktvh/instagram_v7_8wPhd2.png"
									style="width: 30px;"
									alt="Phone"
								/> <span>/sehiyye.online</span></a
							>
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}
	<SvelteToast />
</div>

<style>
	.footerLink {
		text-decoration: none;
		color: white;
	}
	.footerLink:hover {
		color: rgb(239, 239, 239);
	}
</style>
