<script lang="ts">
	import { diseases } from '$lib/store/diseases';
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.diseases')}</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>
<div class="container-fluid my-3">
	<div class="container d-flex flex-wrap" style="gap: 1rem">
		{#each diseases as item}
			<a
				class="card p-3"
				href="/branches/{item.slug}"
				style="min-width: max-content; text-decoration: none"
			>
				<h4>{item.name}</h4>
				{#each Object.entries(item.conditions) as [key, value]}
					<span>{key}</span>
				{/each}
			</a>
		{/each}
	</div>
</div>

<style type="text/css">
</style>
