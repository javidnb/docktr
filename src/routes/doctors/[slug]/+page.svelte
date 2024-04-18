<script lang="ts">
	import { page } from '$app/stores';
	import { doctors } from '$lib/store/dataStore';
	import { diseases } from '$lib/store/diseases';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import Appointment from '$lib/components/Appointment.svelte';
	import Modal from '$lib/helpers/Modal.svelte';
	import { dataLoading } from '$lib/store/dataStore';

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);
	// $: console.log('brenc: ', doctor?.branches);
	let btnCommentText: string = 'Göndər';
	let btnCommentDisabled: boolean = false;
	let truncate: boolean = true;
	let selectedStarPoint: number = 0;
	let showModal: boolean = false;
	let comments: any = [];
	let alreadyCommented: boolean = false; // to allow commenting only once

	onMount(async () => {
		getComments();
	});

	async function getComments() {
		try {
			let time = new Date().getTime();
			const response = await fetch(
				`https://tekoplast.az/docktr/api/?comments&doctor=${doctor?.id}&t=${time}`
			);
			const result = await response.json();
			comments = result;
			if (comments.find((c: any) => c.userId == $session.user?.uid)) alreadyCommented = true;
			console.log('comments: ', result);
		} catch (error) {
			console.error(error);
		}
	}

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}

	function getBranchSlug(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.slug;
	}

	function truncateString(str: string, maxLength: number) {
		return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
	}

	async function postComment(e: SubmitEvent) {
		dataLoading.set(true);
		btnCommentText = 'Gözləyin';
		btnCommentDisabled = true;
		const formData = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		let postData = {
			userId: $session.user?.uid,
			doctorId: doctor?.id,
			comment: data.comment,
			star: selectedStarPoint
		};

		let dataToPost = { table: 'comments', data: { ...postData } };
		const response = await fetch('https://tekoplast.az/docktr/api/?postData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...dataToPost }),
			cache: 'no-cache'
		});

		if (response.ok) {
			console.log('Success');
			btnCommentText = 'Uğurlu! Şərhiniz təsdiq gözləyir..';
			dataLoading.set(false);
		} else {
			console.log('error');
			btnCommentText = 'Xəta :(';
			dataLoading.set(false);
		}
	}
</script>

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">{doctor?.name || ''}</h1>
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<Modal bind:showModal>
	<h4 slot="header">Randevu</h4>

	<ol class="px-0">
		<Appointment />
	</ol>
</Modal>

<section class="my-3">
	<div class="container">
		<div class="row">
			<div class="col-12">
				<div class="row">
					<div class="col-3 col-md-2">
						<img
							src={doctor?.img}
							alt={doctor?.name}
							style="width: max(100%);
							aspect-ratio: 1/1;
							object-fit: cover;
							object-position: top;
							border-radius: 100%;"
						/>
					</div>
					<div class="col-9 col-md-10 d-flex flex-column align-items-center">
						<button
							class="btn btn-outline-primary d-flex justify-content-center align-items-center btnRandevu"
							on:click={() => (showModal = true)}
							><span class="material-symbols-outlined">local_library</span><span
								style="margin-inline: auto;">Randevu Al</span
							></button
						>
						{#if doctor?.branches}
							<div class="branch d-flex flex-wrap column-gap-3 justify-content-center">
								{#each doctor.branches as br}
									<a style="color: var(--primaryColor)" href="../branches/{getBranchSlug(br)}"
										>{getBranchName(br)}</a
									>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div class="row mt-3">
					<div class="card p-3">
						<div class="card-title">Həkim haqqında</div>
						<div class="card-body d-flex flex-column">
							{#if doctor?.details}
								{truncate ? truncateString(doctor?.details, 400) : doctor?.details}
								{#if doctor?.details.length > 400}
									<button
										class="btn btn-outline-primary mt-3 d-flex justify-content-center align-items-center"
										style="max-width: 200px;"
										on:click={() => {
											truncate = !truncate;
										}}
										>{@html truncate
											? `<span class="material-symbols-outlined">expand_all</span><span style='margin-inline:auto'>Daha çox</span>`
											: `<span class="material-symbols-outlined">collapse_all</span><span style='margin-inline:auto'>Azalt</span>`}</button
									>
								{/if}
							{/if}
						</div>
					</div>
				</div>
				<div class="row mt-3">
					<div class="card p-3">
						<div class="card-title">Şərhlər</div>
						{#if $session.loggedIn && !alreadyCommented}
							<div class="col-12 col-md-8">
								<form class="d-flex flex-column" on:submit|preventDefault={postComment}>
									<span
										>{$session.user?.displayName ||
											$session.user?.email ||
											$session.user?.phoneNumber}</span
									>
									<div class="d-flex">
										{#each [1, 2, 3, 4, 5] as star, index}
											<button
												on:click|preventDefault={() => (selectedStarPoint = index + 1)}
												class="material-symbols-outlined star"
												class:icon-fill={selectedStarPoint >= star}
											>
												star
											</button>
										{/each}
									</div>
									<label for="comment">Şərhiniz</label>
									<textarea class="form-control" name="comment" id="comment" />
									<button
										class="btn btn-outline-primary mt-3"
										type="submit"
										disabled={btnCommentDisabled || selectedStarPoint == 0}>{btnCommentText}</button
									>
								</form>
							</div>
						{/if}
						<div class="card-body">
							{#each comments as comment}
								<div class="card p-3">
									<p>{comment.userId} - {comment.star}*</p>
									<p>{comment.comment}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.card {
		cursor: auto;
		min-height: auto;
	}
	.star {
		border: 0px;
		background: none;
		color: var(--primaryColor);
	}
	.btnRandevu {
		min-width: 250px;
		border-radius: 20px;
		font-size: large;
		margin-block: auto;
		background: white;
		padding-inline: 2rem;
		padding-block: 1rem;
	}
	.btnRandevu:hover {
		background-color: var(--primaryColor);
	}
	@media screen and (max-width: 992px) {
		.btnRandevu {
			padding-block: 0.5rem;
		}
	}
</style>
