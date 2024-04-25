<script lang="ts">
	import { page } from '$app/stores';
	import { doctors } from '$lib/store/dataStore';
	import { diseases } from '$lib/store/diseases';
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { dataLoading } from '$lib/store/dataStore';
	import { writable } from 'svelte/store';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import Appointment from '$lib/components/Appointment.svelte';
	import Modal from '$lib/helpers/Modal.svelte';

	export let data;
	const { ...commentss } = data;

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);
	const doc = writable<any>(doctor);
	// $: console.log('brenc: ', doctor?.branches);
	let btnCommentText: string = 'Göndər';
	let btnCommentDisabled: boolean = false;
	let truncate: boolean = true;
	let selectedStarPoint: number = 0;
	let showModal: boolean = false;
	let commentsLoading: boolean = true;
	let comments: any = writable<any>([]);
	export const alreadyCommented = writable<boolean>(false);

	const today = new Date();
	onMount(async () => {
		getComments();
	});

	$: {
		if ($comments.find((c: any) => c.userId == $session.user?.uid)) {
			alreadyCommented.set(true);
		}
	}

	async function getComments() {
		try {
			commentsLoading = true;
			let time = new Date().getTime();
			const response = await fetch(
				`https://tekoplast.az/docktr/api/?comments&doctor=${doctor?.id}&t=${time}`
			);
			const result = await response.json();
			comments.set(result);
			commentsLoading = false;

			//TODO yorumlari burdan cek, her defe fetch olunmamasi ucun
			doc.set({ ...doctor, userComments: result });
			console.log('doc: ', $doc);
		} catch (error) {
			commentsLoading = false;
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
			star: selectedStarPoint,
			date: formatDate(today, true)
		};

		console.log(postData);

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

	function changeDateFormat(dateString: string) {
		const parts = dateString.split('-');
		return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
	<h4 slot="header" class="px-3 pt-2">Randevu</h4>

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
					</div>
				</div>
				<div class="row mt-3">
					{#if doctor?.branches}
						<div class="branch d-flex flex-wrap gap-2">
							{#each doctor.branches as br}
								<a href="../branches/{getBranchSlug(br)}">{getBranchName(br)}</a>
							{/each}
						</div>
					{/if}
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

				<!-- COMMENTS CONTAINER -->
				<div class="row mt-3">
					<div class="card p-3">
						<div class="card-title">Şərhlər</div>

						{#if commentsLoading}
							<div class="d-flex mt-3 ps-5" style="color: var(--primaryColor)!important;">
								<div class="lds-roller">
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
						{:else}
							<!-- POST COMMENT -->
							{#if $session.loggedIn && !$alreadyCommented}
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
											disabled={btnCommentDisabled || selectedStarPoint == 0}
											>{btnCommentText}</button
										>
									</form>
								</div>
							{/if}
							<!-- COMMENTS -->
							<div class="d-flex flex-column gap-3 pt-3">
								{#each $comments as comment}
									{#if comment.status == null && comment.userId == $session.user?.uid}
										<div class="card commentCard p-3" style="background-color: rgb(243 243 243);">
											<div class="d-flex gap-3 align-items-center">
												<div>
													{#if comment?.photoURL}
														<img
															src={comment?.photoURL}
															alt="Profile Pic"
															style="max-width: 40px; border-radius: 100%; aspect-ratio: 1/1; object-fit: cover;"
														/>
													{:else}
														<div
															style="width: 40px; 
																	height: 40px;
																	color: var(--primaryColor);
																	border-radius: 100%;
																	border: 3px solid var(--primaryColor);
																	display: flex; align-items: center; 
																	justify-content: center;"
														>
															<span
																class="material-symbols-outlined icon-fill"
																style="font-size: 1.8rem"
															>
																person
															</span>
														</div>
													{/if}
												</div>
												<div>
													<div class="d-flex gap-2">
														<span>{comment.displayName || comment.email || 'Adsız İstifadəçi'}</span
														>
														<div class="d-flex">
															{#each Array.from({ length: comment.star }) as _}
																<span class="material-symbols-outlined icon-fill star"> star </span>
															{/each}
															{#each Array.from({ length: 5 - comment.star }) as _}
																<span class="material-symbols-outlined star"> star </span>
															{/each}
														</div>
													</div>

													<span class="text-secondary" style="font-size: small"
														>{changeDateFormat(comment.date)}</span
													>
												</div>
											</div>

											{#if comment.comment.length}
												<p style="margin-top: 1rem; padding-left: 3.5rem">
													{@html comment.comment}
												</p>
											{/if}
											<span style="font-style: italic; font-size: small"
												>Şərhiniz təsdiq gözləyir ..</span
											>
										</div>
									{/if}
									{#if comment.status !== null}
										<div class="card commentCard p-3">
											<div class="d-flex gap-3 align-items-center">
												<div>
													{#if comment?.photoURL}
														<img
															src={comment?.photoURL}
															alt="Profile Pic"
															style="max-width: 40px; border-radius: 100%;  aspect-ratio: 1/1; object-fit: cover;"
														/>
													{:else}
														<div
															style="width: 40px; 
																	height: 40px;
																	color: var(--primaryColor);
																	border-radius: 100%;
																	border: 3px solid var(--primaryColor);
																	display: flex; align-items: center; 
																	justify-content: center;"
														>
															<span
																class="material-symbols-outlined icon-fill"
																style="font-size: 1.8rem"
															>
																person
															</span>
														</div>
													{/if}
												</div>
												<div>
													<div class="d-flex gap-2">
														<span>{comment.displayName || comment.email || 'Adsız İstifadəçi'}</span
														>
														<div class="d-flex">
															{#each Array.from({ length: comment.star }) as _}
																<span class="material-symbols-outlined icon-fill star"> star </span>
															{/each}
															{#each Array.from({ length: 5 - comment.star }) as _}
																<span class="material-symbols-outlined star"> star </span>
															{/each}
														</div>
													</div>

													<span class="text-secondary" style="font-size: small"
														>{changeDateFormat(comment.date)}</span
													>
												</div>
											</div>

											{#if comment.comment.length}
												<p style="margin-top: 1rem; padding-left: 3.5rem">
													{@html comment.comment}
												</p>
											{/if}
										</div>
									{/if}
								{/each}
								{#if !$comments.length}
									<span>Həkim haqqında şərh yoxdur</span>
								{/if}
							</div>{/if}
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
	.commentCard {
		background-color: #fbfbfb;
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
	.branch a {
		color: var(--primaryColor);
		background: white;
		text-decoration: none;
		border-radius: 10px;
		padding: 3px 13px;
		border: 1px solid;
		font-size: small;
	}
	@media screen and (max-width: 992px) {
		.btnRandevu {
			padding-block: 0.5rem;
		}
	}

	.lds-roller,
	.lds-roller div,
	.lds-roller div:after {
		box-sizing: border-box;
	}
	.lds-roller {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-roller div {
		animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		transform-origin: 40px 40px;
	}
	.lds-roller div:after {
		content: ' ';
		display: block;
		position: absolute;
		width: 7.2px;
		height: 7.2px;
		border-radius: 50%;
		background: currentColor;
		margin: -3.6px 0 0 -3.6px;
	}
	.lds-roller div:nth-child(1) {
		animation-delay: -0.036s;
	}
	.lds-roller div:nth-child(1):after {
		top: 62.62742px;
		left: 62.62742px;
	}
	.lds-roller div:nth-child(2) {
		animation-delay: -0.072s;
	}
	.lds-roller div:nth-child(2):after {
		top: 67.71281px;
		left: 56px;
	}
	.lds-roller div:nth-child(3) {
		animation-delay: -0.108s;
	}
	.lds-roller div:nth-child(3):after {
		top: 70.90963px;
		left: 48.28221px;
	}
	.lds-roller div:nth-child(4) {
		animation-delay: -0.144s;
	}
	.lds-roller div:nth-child(4):after {
		top: 72px;
		left: 40px;
	}
	.lds-roller div:nth-child(5) {
		animation-delay: -0.18s;
	}
	.lds-roller div:nth-child(5):after {
		top: 70.90963px;
		left: 31.71779px;
	}
	.lds-roller div:nth-child(6) {
		animation-delay: -0.216s;
	}
	.lds-roller div:nth-child(6):after {
		top: 67.71281px;
		left: 24px;
	}
	.lds-roller div:nth-child(7) {
		animation-delay: -0.252s;
	}
	.lds-roller div:nth-child(7):after {
		top: 62.62742px;
		left: 17.37258px;
	}
	.lds-roller div:nth-child(8) {
		animation-delay: -0.288s;
	}
	.lds-roller div:nth-child(8):after {
		top: 56px;
		left: 12.28719px;
	}
	@keyframes lds-roller {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
