<script lang="ts">
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import DoctorList from '$lib/components/admin/DoctorList.svelte';
	import Contacts from '$lib/components/admin/Contacts.svelte';
	import AwaitingComments from '$lib/components/admin/AwaitingComments.svelte';
	import AiChat from '$lib/components/admin/AiChat.svelte';
	import { mobile } from '$lib/store/dataStore';

	// export let data;
	let component = DoctorList;

	onMount(async () => {
		if (!$session?.loggedIn || !$session.user?.admin) {
			goto('../');
		}
	});

	function handleSubmit(e: SubmitEvent) {
		const formData: any = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		// console.log(data);
		// let profession = diseases.find((d) => d.name == data.profession);
		// console.log(profession?.id);
	}
</script>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">Admin Panel</h1>
	</div>
</section>

{#if $session?.loggedIn && $session?.user?.admin}
	<div class="container">
		<div class="row py-3">
			<div class="col-md-4 col-lg-3">
				<button
					class="btn btn-outline-primary btnFilter d-flex w-100 mb-3"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#collapseExample"
					aria-expanded="false"
					aria-controls="collapseExample"
					style="position: relative;
						box-shadow: rgba(0, 0, 0, 0.07) 0px 0px 5px;
						border-radius: 14px;
						padding-block: 8px;"
				>
					<span class="material-symbols-outlined"> menu </span>
					<div class="mx-auto d-flex gap-1">
						<span>Menu</span>
					</div>
				</button>

				<ul
					class="list-group list-group-flush px-2 collapse filterCollapse"
					id="collapseExample"
					style="overflow: hidden; 
						border-radius: 10px; 
						box-shadow: 0px 0px 5px #00000012; 
						height: 400px!important;
						background: white"
				>
					<li
						class="list-group-item text-center pcOnly w-100"
						style="background-color: #52694b;
						color: white;
						font-weight: 600;
						border-bottom: 2px solid #00000042;"
					>
						Admin Menu
					</li>
					<button
						on:click={() => {
							component = DoctorList;
						}}
						class="list-group-item d-flex flex-row align-items-center w-100"
						class:active={component == DoctorList}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#collapseExample' : ''}
					>
						<span class="material-symbols-outlined" class:icon-fill={component == DoctorList}
							>physical_therapy
						</span>
						<span class="ms-2">Həkimlər</span>
					</button>
					<button
						on:click={() => {
							component = Contacts;
						}}
						class="list-group-item d-flex flex-row align-items-center w-100"
						class:active={component == Contacts}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#collapseExample' : ''}
					>
						<span class="material-symbols-outlined" class:icon-fill={component == Contacts}
							>dialpad</span
						>
						<span class="ms-2">Əlaqə</span>
					</button>
					<button
						on:click={() => {
							component = AwaitingComments;
						}}
						class="list-group-item d-flex flex-row align-items-center w-100"
						class:active={component == AwaitingComments}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#collapseExample' : ''}
					>
						<span class="material-symbols-outlined" class:icon-fill={component == AwaitingComments}
							>comment</span
						>
						<span class="ms-2">Şərh təsdiq</span>
					</button>
					<button
						on:click={() => {
							component = AiChat;
						}}
						class="list-group-item d-flex flex-row align-items-center w-100"
						class:active={component == AiChat}
						data-bs-toggle={$mobile ? 'collapse' : ''}
						data-bs-target={$mobile ? '#collapseExample' : ''}
					>
						<span class="material-symbols-outlined" class:icon-fill={component == AiChat}
							>comment</span
						>
						<span class="ms-2">GPT Chat</span>
					</button>
				</ul>
			</div>
			<div class="col-md-8 col-lg-9 mb-5">
				<div class="card p-3 h-100 mt-mobile">
					<svelte:component this={component} />
				</div>
				<!-- <form on:submit|preventDefault={handleSubmit}>
					<div class="form-group">
						<label for="name">Adı Soyad</label>
						<input
							name="name"
							type="text"
							class="form-control"
							id="name"
							placeholder="Ad Soyad"
							required
						/>
					</div>
					<div class="form-group">
						<label for="profession">Uzmanlık</label>
						<input
							name="profession"
							class="form-control"
							list="professions"
							id="profession"
							placeholder="Uzmanlık"
							required
						/>
						<datalist id="professions">
							{#each diseases as item}
								<option value={item.name} data-value={item.id}></option>
							{/each}
						</datalist>
					</div>
					<div class="form-group">
						<label for="details">Məlumat</label>
						<textarea name="details" class="form-control" id="details" rows="3"></textarea>
					</div>
					<button type="submit" class="btn btn-primary">Əlavə et</button>
					
				</form> -->
			</div>
		</div>
	</div>
{/if}

<style>
	.list-group {
		padding-inline: 0 !important;
	}
	.list-group-item {
		border-radius: 0;
	}
	.list-group-item:hover {
		color: white;
		background: var(--primaryColor);
	}
	.active {
		border-radius: 0;
		background-color: #7a9971 !important;
		border: 0;
	}

	.btnFilter:not(:hover) {
		background: white;
	}

	@media screen and (min-width: 768px) {
		.filterCollapse {
			display: block;
			height: auto !important;
			visibility: visible;
		}
		.btnFilter {
			display: none !important;
		}
	}
</style>
