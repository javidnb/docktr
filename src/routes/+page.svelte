<script lang="ts">
	import BranchSlider from "$lib/components/BranchSlider.svelte";
</script>

<section>
	<div
		class="jumbotron"
		style="padding-block: 3rem; background-color: #e2e9ef; background-image: url('https://tekoplast.az/img/docktrbg.png');
    background-size: cover;
    background-blend-mode: overlay;"
	>
		<h1 class="display-4">Sağlık Hizmetlerine Dijital Yaklaşım</h1>
		<p class="lead">Doktorunuzla İnternet Üzerinden Bağlantı Kurun, Sağlığınızı Şimdi Yönetin</p>
		<div class="input-group input-group-lg mb-3 mt-2 w-md-50">
			<input
				type="text"
				class="form-control"
				aria-label="Sizing example input"
				aria-describedby="inputGroup-sizing-sm"
				placeholder="Arama yap"
			/>
			<span
				class="input-group-text"
				style="background: #a1c398;
			color: white;"><span class="material-symbols-outlined"> search </span></span
			>
		</div>
		<!-- <hr class="my-4" /> -->
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<section class="categories py-5">
	<div class="container">
		<div class="row">
			<div class="col">
				<h5>Branşlar</h5>
				<BranchSlider />
			</div>
		</div>
	</div>
</section>

<section class="faq py-5" style="background-color: #f9f9f9;">
	<div class="container">
		<div class="row">
			<div class="col">
				<h5>Sıkça sorulan sorular</h5>
			</div>
		</div>
	</div>
</section>

<style>
	.categories {
		background-color: aliceblue;
	}
</style>
