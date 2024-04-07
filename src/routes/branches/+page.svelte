<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Branşlar</h1>
		<hr />
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
