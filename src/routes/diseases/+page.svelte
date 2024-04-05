<script lang="ts">
	import { diseases } from '$lib/diseases';
</script>

<div class="container-fluid mt-3">
	<h3>Hastalıklar</h3>
</div>
<div class="container-fluid mt-3">
	<ul class="nav nav-pills nav-fill" style="gap: 1rem">
		{#each diseases as item}
			<li class="nav-item"><a href="./">{item.name}</a></li>
		{/each}
	</ul>
</div>

<style type="text/css">
	.nav-item {
		flex: inherit;
	}
	.nav-item a {
		color: #68a557;
		font-size: large;
	}
</style>
