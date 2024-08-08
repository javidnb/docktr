<script lang="ts">
	import { goto } from '$app/navigation';
	import { diseases } from '$lib/store/diseases';
	import { doctors, selectedBranch } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';

	// function routeTo(id: any) {
	// 	console.log('yo');
	// }

	let branches = diseases
		.map((branch) => {
			const doctorCount = $doctors.filter((doctor) => doctor.branches.includes(branch.id)).length;
			return { ...branch, doctorCount };
		})
		.filter((b) => b.doctorCount > 0);

	branches.sort((a, b) => b.doctorCount - a.doctorCount);
</script>

<div class="branches" style="display: flex;">
	{#each branches as item}
		{#if item.id}
			<button
				on:click={() => {
					selectedBranch.set({ value: item.id });
					goto(`./doctors`);
				}}
				class="card align-items-center"
				style="flex: 1;
					min-width: 250px;
					min-height: 10rem;
					border: 0px;
					box-shadow: 0px 0px 5px #00000012;
					border-radius: 20px;
					cursor: auto;
					text-decoration:none;
					cursor: pointer; align-items-center"
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
					<span
						class="card-link"
						style="text-decoration: none; text-align: center;
                margin-block: auto; color: black; font-weight: 600">{item.name}</span
					>
					<span
						class="btn btn-primary btnBranch"
						style="	background-color: white;
						border: 0px;
						box-shadow: 0px 0px 6px #a1c3986e;
						color: var(--primaryColor);"
					>
						{item.doctorCount}
						{$_('home.doctor')}
					</span>
				</div>
			</button>
		{/if}
	{/each}
</div>
