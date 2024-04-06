<script lang="ts">
	import { diseases } from '$lib/diseases';
</script>

<section>
	<div class="jumbotron" style="padding-top: 3rem; background-color: #e2e9ef">
		<h1 class="display-4">Branşlar</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr class="my-4" />
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
									href="/branches/{item.slug}"
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
		border-radius: 20px;
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

	::-webkit-scrollbar-thumb {
		background-color: #71896b;
		border-radius: 5px;
		transition: 0.3s ease;
		height: 10px;
		width: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #394636;
	}
</style>
