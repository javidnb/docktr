<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { LayoutData } from './$types';
	import { appointmentsLoading, doctors, hideNav } from '$lib/store/dataStore';
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
		let usr = await data.getAuthUser();
		if (!usr) appointmentsLoading.set(false);
	});

	$: if ($session.user?.lang) locale.set($session.user?.lang);
	// $: if ($session.user?.doctor) goto('./doctor');
	$: curPage = $page.route.id;
</script>

<div style="min-height: 100dvh; display: flex; flex-direction: column">
	{#if curPage !== '/doctor' && curPage !== '/search'}
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
	{/if}

	{#key data.url}
		<!-- in:fade={{ duration: 100, easing: cubicIn }} -->
		<div>
			<slot />
		</div>
	{/key}

	{#if curPage !== '/messages' && curPage !== '/doctor' && curPage !== '/search'}
		<section
			class="py-3 footer pcOnly"
			style="border-top: 1px solid rgb(236, 236, 236);
				background: var(--primaryColor);
				color: white; margin-top: auto"
		>
			<div class="container">
				<div class="row align-items-center py-3">
					<div class="col-12 col-md-9">
						<div class="d-flex gap-3">
							<a class="footerLink" href="/legal">{$_('usage.header')}</a>
							<a class="footerLink" href="/contact">{$_('nav.about')}</a>
							<a class="footerLink" href="/contact">{$_('nav.contact')}</a>
						</div>
					</div>
					<div class="col-12 col-md-3">
						<div class="d-flex gap-2 align-items-center">
							<span>© Səhiyyə.online</span>
							<span>2023-{new Date().getFullYear()}</span>
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
