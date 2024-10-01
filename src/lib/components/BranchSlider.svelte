<script lang="ts">
	import { goto } from '$app/navigation';
	import { diseases } from '$lib/store/diseases';
	import { doctors, selectedBranch } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';

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
				style="max-width: 140px"
			>
				<div class="card-body d-flex flex-column align-items-center">
					{#if item.icon}
						<img style="width: 55px;" src="{item.icon}?tr=w-100" alt="icon" />
					{:else}
						<span
							class="material-symbols-outlined"
							style="
								color: var(--primaryText); height: 3rem;
								display: flex;
								align-items: center;"
						>
							biotech
						</span>
					{/if}
					<span
						class="card-link"
						style="text-decoration: none; text-align: center;
                margin-block: auto; color: black; font-weight: 500; color: var(--primaryText); font-family: Montserrat, sans-serif; line-height: 1.2"
						>{item.name}</span
					>
					<span
						class="btn btn-primary btnBranch"
						style="	background-color: white;
						border: 0px;
						box-shadow: 0px 0px 6px #a1c3986e;
						color: var(--primaryText);"
					>
						{item.doctorCount}
						{$_('home.doctor')}
					</span>
				</div>
			</button>
		{/if}
	{/each}
</div>
