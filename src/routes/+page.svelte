<script lang="ts">
	import { diseases } from '$lib/diseases';
</script>

<section>
	<div class="jumbotron" style="padding-block: 3rem; background-color: #e2e9ef">
		<h1 class="display-4">İnternet Üzerinden Doktor Randevuları</h1>
		<p class="lead">Sağlık Hizmetlerine Dijital Yaklaşım, Hemen Randevunuzu Alın</p>
		<div class="input-group input-group-lg mb-3 mt-2 w-50">
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
				<div class="branches">
					{#each diseases as item}
						<div class="card">
							<div class="card-body d-flex flex-column align-items-center">
								<span
									class="material-symbols-outlined"
									style="font-size: 60px; color: #a1c398;     height: 6rem;
								display: flex;
								align-items: center;"
								>
									biotech
								</span>
								<a
									class="card-link"
									href="./"
									style="text-decoration: none; text-align: center;
								margin-block: auto;">{item.name}</a
								>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<section class="faq py-5">
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
	.branches {
		display: flex;
		gap: 1rem;
		overflow-x: scroll;
		padding-block: 1rem;
		padding-left: 3px;
	}
	.card {
		flex: 1;
		min-width: 10rem;
		min-height: 10rem;
		border: 0px;
		box-shadow: 0px 0px 5px #00000012;
	}

	/* SCROLLBAR */
	::-webkit-scrollbar {
		width: 3px;
		background: transparent;
		transition: 0.3s ease;
		height: 6px;
	}

	::-webkit-scrollbar:hover {
		width: 3px;
	}

	.branches ::-webkit-scrollbar {
		display: block;
	}

	.ag-root-wrapper {
		border-radius: 6px;
	}

	::-webkit-scrollbar-thumb {
		background-color: #199298;
		border-radius: 5px;
		transition: 0.3s ease;
		height: 10px;
		width: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #21374e;
	}
</style>
