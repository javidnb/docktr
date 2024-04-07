<script lang="ts">
	import { diseases } from '$lib/diseases';
	import type { Doctor } from '$lib/interfaces/doctor.interface';
	export let props: Doctor;

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}
</script>

<a href="/doctors/{props.slug}" class="card" style="text-decoration: none;">
	<div class="card-body d-flex flex-column align-items-center">
		<div class="row">
			<div class="col-5 d-flex flex-column">
				<img src={props.img} alt="Some Doc" />
				<span style="color: #rgb(99 141 88)" class="d-flex justify-content-center mt-2"
					>5 <span class="material-symbols-outlined"> star_rate </span> | 0 Yorum</span
				>
			</div>
			<div class="col-7 text-center d-flex flex-column">
				<span
					style="text-decoration: none;
                    text-align: center;
                    margin-block: 10px 5px;
                    font-size: large;
                    font-weight: 600;">{props.name}</span
				>
				<div class="branch">
					{#each props.branches as br}
						<span>{getBranchName(br)}</span>
					{/each}
				</div>
			</div>
		</div>

		<div class="row mt-2 w-100">
			<div class="col">
				<p>{props.details}</p>
			</div>
		</div>

		<div class="row w-100">
			<div class="col"></div>
		</div>
	</div>
</a>


<style>
	.card {
		min-width: 20rem;
		min-height: 10rem;
		border: 0px;
		box-shadow: 0px 0px 5px #00000012;
		border-radius: 20px;
		text-decoration: none;
	}
	.card:hover {
		box-shadow: 0px 0px 5px #00000032;
	}
	.card img {
		max-width: 100%;
		aspect-ratio: 2 / 1.5;
		object-fit: cover;
		object-position: top;
		border-radius: 10px;
	}
	.branch {
		display: flex;
		gap: 10px;
		color: #444444;
		font-size: small;
	}
</style>