<script lang="ts">
	import { goto } from '$app/navigation';
	import { diseases } from '$lib/store/diseases';
	import { doctors } from '$lib/store/dataStore';

	function routeTo(id: any) {
		console.log('yo');
	}

	let branches = diseases.map((branch) => {
		const doctorCount = $doctors.filter((doctor) => doctor.branches.includes(branch.id)).length;
		return { ...branch, doctorCount };
	});

	branches.sort((a, b) => b.doctorCount - a.doctorCount);
</script>

<div class="branches">
	{#each branches as item}
		{#if item.id}
			<div
				class="card"
				style="flex: 1;
					min-width: 10rem;
					min-height: 10rem;
					border: 0px;
					box-shadow: 0px 0px 5px #00000012;
					border-radius: 20px;
					cursor: auto;
					text-decoration:none"
			>
				<div class="card-body d-flex flex-column align-items-center">
					<span
						class="material-symbols-outlined"
						style="
						font-size: 45px; color: var(--primaryColor); height: 3rem;
						display: flex;
						align-items: center;"
					>
						biotech
					</span>
					<a
						class="card-link"
						href="/branches/{item.slug}"
						style="text-decoration: none; text-align: center;
                margin-block: auto; color: black; font-weight: 600">{item.name}</a
					>
					<button
						class="btn btn-primary btnBranch"
						style="	background-color: white;
						border: 1px solid var(--primaryColor);
						color: var(--primaryColor);"
						on:click={() => goto(`./branches/${item.slug}`)}
					>
						{item.doctorCount} həkim
					</button>
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.branches {
		display: flex;
		gap: 1rem;
		overflow-x: scroll;
		padding-block: 1rem;
		padding-left: 3px;
	}
	.btnBranch {
		background-color: white;
		border: 1px solid var(--primaryColor);
		color: var(--primaryColor);
		transition-duration: 0.2s;
	}
	.btnBranch:hover {
		background-color: var(--primaryColor) !important;
		color: white !important;
	}
	.card {
		flex: 1;
		min-width: 10rem;
		min-height: 10rem;
		border: 0px;
		box-shadow: 0px 0px 5px #00000012;
		border-radius: 20px;
	}

	.card:hover {
		box-shadow: 0px 0px 5px #00000032 !important;
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
