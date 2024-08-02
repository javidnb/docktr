<script lang="ts">
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import DoctorList from '$lib/components/admin/DoctorList.svelte';

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

{#if $session?.loggedIn && $session?.user?.admin}
	<section>
		<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
			<h1 class="display-4">Admin Panel</h1>
		</div>
	</section>
	<div class="container">
		<div class="row py-3">
			<div class="col-md-4 col-lg-3">
				<div class="d-flex align-items-start w-100 ps-3" style="height: 40px;">
					<h5 style="margin-bottom: 0">Admin Menu</h5>
				</div>
				<ul class="list-group list-group-flush px-2">
					<li class="list-group-item d-flex align-items-center">
						<span class="material-symbols-outlined">physical_therapy </span>
						<span class="ms-2">Həkimlər</span>
					</li>
				</ul>
			</div>
			<div class="col-md-8 col-lg-9">
				<svelte:component this={component} />
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
