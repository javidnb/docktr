<script lang="ts">
	import BranchSlider from '$lib/components/BranchSlider.svelte';
</script>

<section>
	<div
		class="jumbotron"
		style="padding-block: 3rem;
		background-color: #e2e9ef;
		background-image: url('https://tekoplast.az/img/docktrbg.png');
		background-size: cover;
		background-blend-mode: overlay;"
	>
		<div class="container">
			<div class="row justify-content-center">
				<div class="col col-md-8 d-flex align-items-center flex-column text-center">
					<h1 class="display-4">Sağlık Hizmetlerine Dijital Yaklaşım</h1>
					<p class="lead">
						Doktorunuzla İnternet Üzerinden Bağlantı Kurun, Sağlığınızı Şimdi Yönetin
					</p>
					<div class="col-12 col-md-10">
						<div class="input-group input-group-lg mb-3 mt-2">
							<input
								type="text"
								class="form-control"
								aria-label="Sizing example input"
								aria-describedby="inputGroup-sizing-sm"
								placeholder="Arama yap"
							/>
							<span
								class="input-group-text"
								style="background: var(--primaryColor);
						color: white;"><span class="material-symbols-outlined"> search </span></span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
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
	.jumbotron {
		padding-block: 3rem;
		background-color: #e2e9ef;
		background-image: url('https://tekoplast.az/img/docktrbg.png');
		background-size: cover;
		background-blend-mode: overlay;
	}
</style>
