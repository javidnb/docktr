<script lang="ts">
	import { diseases } from '$lib/store/diseases';
	import type { Doctor } from '$lib/interfaces/doctor.interface';
	export let props: Doctor;

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}

	function truncateString(str: string, maxLength: number) {
		return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
	}
</script>

<a href="/doctors/{props.slug}" class="card h-100" style="text-decoration: none;">
	<div class="card-body d-flex flex-column align-items-center">
		<div class="row">
			<div class="col-5 d-flex flex-column">
				<img src={props.img} alt="Some Doc" style="max-width: max(150px,100%)" />
				<div
					style="color: #rgb(99 141 88)"
					class="d-flex flex-column justify-content-center align-items-center mt-1"
				>
					<!-- DOCTOR POINT / STARS-->
					<div class="d-flex">
						{#each Array.from({ length: props.star }) as _}
							<span class="material-symbols-outlined icon-fill star"> star </span>
						{/each}
						{#each Array.from({ length: 5 - props.star }) as _}
							<span class="material-symbols-outlined star"> star </span>
						{/each}
					</div>
					<span class="text-secondary" style="font-size: small">{props.comments || 0} Şərh</span>
				</div>
			</div>
			<div class="col-7 text-center d-flex flex-column">
				<span
					style="text-decoration: none;
                    text-align: center;
                    margin-block: 10px 5px;
                    font-size: large;
                    font-weight: 600;">{props.name}</span
				>
				<p class="docDetails" style="font-size: medium;">{truncateString(props.details, 100)}</p>
			</div>
		</div>

		<div class="row w-100" style="margin-top: auto">
			<div class="col">
				<div class="branch">
					{#each props.branches as br}
						<span>{getBranchName(br)}</span>
					{/each}
				</div>
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
		column-gap: 10px;
		color: #444444;
		font-size: small;
		flex-wrap: wrap;
	}
	.star {
		color: var(--primaryColor);
	}
</style>
