<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
	import { _ } from 'svelte-i18n';
</script>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.branches')}</h1>
	</div>
</section>

<section class="categories py-5">
	<div class="container">
		<div class="row">
			<div class="col">
				<BranchSlider />
			</div>
		</div>
	</div>
</section>

<style>
	.categories {
		background-color: aliceblue;
	}
</style>
