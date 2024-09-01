<script lang="ts">
	import { diseases } from '$lib/store/diseases';
	import type { Doctor } from '$lib/interfaces/doctor.interface';
	import { selectedBranch } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';
	export let props: Doctor;

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}

	function truncateString(str: string, maxLength: number) {
		return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
	}
</script>

<a href="/doctors/{props.slug}" class="card h-100 cursor-pointer" style="text-decoration: none;">
	<div class="card-body d-flex flex-column align-items-center">
		<div class="row">
			<div class="col-5 d-flex flex-column">
				<img
					src={props.img
						? props.img
						: 'https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/docplaceholder.jpg'}
					alt="Some Doc"
					style="max-width: max(150px,100%)"
				/>
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
					margin-block: 0px 5px;
					font-size: large;
					font-weight: 600;
					color: var(--primaryText);
					display: flex;
					flex-direction: column;
					line-height: 1;"
				>
					{#if props.title}
						<span style="font-size: small; font-weight: 400;">{$_('titles.' + props.title)}</span>
					{/if}
					<span>{props.name}</span>
				</span>
				<p
					class="docDetails"
					style="font-size: medium;
						line-height: 1.3;
						text-align: center;
						color: #575757; margin-bottom:0"
				>
					{@html truncateString(props.details, 120)}
				</p>
			</div>
		</div>

		<div class="row w-100 mt-2 align-items-center">
			{#if !$selectedBranch}
				<div class="branch w-50">
					{#each props.branches as br, i}
						<span style="min-width: max-content;">{getBranchName(br)}</span>
						{#if i !== props.branches.length - 1}
							,
						{/if}
					{/each}
				</div>
			{/if}
			<div
				class="d-flex justify-content-end gap-3 ms-auto w-auto"
				class:w-100={$selectedBranch}
				style="color: var(--primaryText);"
			>
				{#if props.appointmentDuration}
					<div
						class="d-flex align-items-center"
						style="border: 1px solid #ececec;
						border-radius: 8px;
						padding: 1px 10px;
						background: #f8f8f8"
					>
						<span class="material-symbols-outlined" style="font-size: small!important;">
							schedule
						</span>
						<span class="ms-1">{props.appointmentDuration}</span>
						<span style="font-size: small; padding-top: 3px">dq.</span>
					</div>
				{/if}
				{#if props.price}
					<div
						class="d-flex align-items-center gap-1"
						style="border: 1px solid #ececec;
						border-radius: 8px;
						padding: 1px 10px;
						background: #f8f8f8"
					>
						<span style="font-size: small;"> ₼ </span>
						<span>{(props.price + 15).toFixed(2)}</span>
					</div>
				{/if}
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
		column-gap: 3px;
		font-size: small;
		flex-wrap: nowrap;
		border: 1px solid #ececec;
		padding: 5px 10px;
		border-radius: 10px;
		color: var(--primaryText);
		overflow: hidden;
		margin-top: 0 !important;
		overflow-x: scroll;
		max-width: 45%;
		width: fit-content !important;
		background-color: #f8f8f8;
	}
	.star {
		color: var(--primaryColor) !important;
		background-color: unset !important;
	}
	.icon-fill {
		padding: 0;
	}
	.branch::-webkit-scrollbar {
		display: none;
	}
</style>
