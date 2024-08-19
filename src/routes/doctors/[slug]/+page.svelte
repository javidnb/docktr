<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { doctors, mobile, selectedBranch, selectedUser } from '$lib/store/dataStore';
	import { diseases } from '$lib/store/diseases';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { session } from '$lib/session';
	import {
		dataLoading,
		selectedAppointmentDate,
		appointmentModal,
		appointments
	} from '$lib/store/dataStore';
	import { writable } from 'svelte/store';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import GetAppointment from '$lib/components/GetAppointment.svelte';
	import Modal from '$lib/helpers/Modal.svelte';

	$: doctor = $doctors.find((d) => d.slug == $page.params.slug);

	const doc = writable<any>(doctor);

	let existingAppointment: any;
	$: if (doctor?.id)
		existingAppointment = $appointments.find(
			(ap) => ap.doctorId == doctor.id && new Date(ap.startTime) > new Date()
		);

	$: btnCommentText = $_('actions.send');
	let btnCommentDisabled: boolean = false;
	let selectedStarPoint: number = 0;
	let showModal: boolean = false;
	let commentsLoading: boolean = true;
	let comments: any = writable<any>([]);
	export const alreadyCommented = writable<boolean>(false);

	$: showModal = !!$appointmentModal;
	$: if (showModal == false) appointmentModal.set(false);

	const today = new Date();
	onMount(async () => {
		if (!doctor?.userComments) {
			getComments();
		} else {
			comments.set(doctor.userComments);
			commentsLoading = false;
			console.log(doctor);
		}
	});

	$: {
		if ($comments.find((c: any) => c.userId == $session.user?.uid)) {
			alreadyCommented.set(true);
		}
	}

	async function getComments() {
		try {
			if (doctor) {
				// commentsLoading = true;
				let time = new Date().getTime();
				const response = await fetch(
					`https://tekoplast.az/docktr/api/?comments&doctor=${doctor?.id}&t=${time}`
				);
				let result = await response.json();
				result = result.filter((c: any) => c.status == 1 || c.userId == $session?.user?.uid);
				comments.set(result);
				commentsLoading = false;
				doctor.userComments = result;
			}
		} catch (error) {
			commentsLoading = false;
		}
	}

	function getBranchName(id: number) {
		let d = diseases.find((d) => d.id == id);
		return d?.name;
	}

	async function postComment(e: SubmitEvent) {
		dataLoading.set(true);
		btnCommentText = 'Gözləyin';
		btnCommentDisabled = true;
		const formData: any = new FormData(e.target as HTMLFormElement);
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
			getComments();
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

	function openModal() {
		appointmentModal.set(true);
		selectedAppointmentDate.set({ day: null, time: null, start: null, end: null });
	}
</script>

<button
	on:click={() => {
		history.back();
	}}
	class="btnBack mobileOnly btn"
	type="button"
	style="position: absolute;
    top: 10px;
    left: 12px;
    color: rgb(213, 228, 209);
    border: 1px solid rgba(255, 255, 255, 0.21) !important;
    text-align: center;
    width: 56px;
    height: 40px;
    align-items: center;
    justify-content: center;
    padding-left: 19px;
	border-radius: 6px!important"
>
	<span class="material-symbols-outlined"> arrow_back_ios </span>
</button>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{doctor?.name || ''}</h1>
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

<Modal bind:showModal>
	<!-- <h4 slot="header" class="px-3 pt-2">Görüş</h4> -->

	<ol class="px-0 mt-3">
		<GetAppointment doc={doctor} />
	</ol>
</Modal>

<section class="pt-3 pb-5" style="background-color: rgb(249 249 249);">
	<div class="container pb-3">
		<div class="row px-3">
			<div class="col-md-8">
				<div class="row ps-1">
					<div class="col-4 col-md-4 col-lg-2">
						<div
							class="docImageContainer h-100"
							style={`background-image: url(${
								doctor?.img
									? doctor.img
									: 'https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/docplaceholder.jpg'
							});`}
						>
							<img
								src={doctor?.img
									? doctor.img
									: 'https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/docplaceholder.jpg'}
								alt={doctor?.name}
								style="max-height: 130px;
									aspect-ratio: 1/1;
									object-fit: cover;
									object-position: top;
									border-radius: 100%;
									box-shadow: 0px 0px 6px #0000000a"
							/>
						</div>
					</div>
					{#if !$session?.user?.doctor}
						<div class="col-8 col-md-8 col-lg-10">
							<div class="d-flex flex-column h-100 ps-3">
								<!-- <div class="d-flex align-items-center gap-1 mt-2">
									<span
										style="color: var(--primaryColor)"
										class="material-symbols-outlined icon-fill"
									>
										science
									</span><span>17 il iş təcrübəsi</span>
								</div> -->

								{#if doctor?.hospital}
									<div class="d-flex align-items-center gap-1">
										<span
											style="color: var(--primaryColor)"
											class="material-symbols-outlined icon-fill"
										>
											home_health
										</span><span>{JSON.parse(doctor?.hospital)[0]}</span>
									</div>
								{/if}
								{#if doctor?.nationality}
									<div class="d-flex align-items-center gap-1">
										<span
											style="color: var(--primaryColor)"
											class="material-symbols-outlined icon-fill"
										>
											location_on
										</span><span>{$_(`nations.` + doctor?.nationality)}</span>
									</div>
								{/if}
								{#if doctor?.branches}
									<div class="branch d-flex flex-wrap gap-2 mt-auto">
										{#each doctor.branches as br}
											<button
												on:click={() => {
													selectedBranch.set({ value: br });
													goto(`../doctors`);
												}}>{getBranchName(br)}</button
											>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
				{#if $mobile}
					<div class="row px-3 mt-5">
						{#if !existingAppointment}
							<button
								class="btn btn-outline-primary d-flex justify-content-center align-items-center btnRandevu w-100"
								on:click={openModal}
								><span class="material-symbols-outlined">local_library</span><span
									style="margin-inline: auto;">{$_('appointment.get')}</span
								></button
							>
						{:else}
							<div
								class="card p-4 mt-auto"
								style="max-height: 250px;
							min-width: min(100%, 350px);
							border-radius: 8px;
							align-self: baseline"
							>
								<span style="font-size: small;">{$_('appointment.planned')}: </span>
								<span class="my-auto">{formatDate(new Date(existingAppointment.startTime))}</span>
								<button
									class="btn btn-outline-primary mt-2 d-flex align-items-center"
									on:click={() => {
										goto('../appointment');
									}}
								>
									<span class="material-symbols-outlined"> info </span>
									<span class="mx-auto">{$_('actions.details')}</span>
								</button>
								{#if existingAppointment.purchased}
									<button
										class="btn btn-outline-primary mt-3 w-100 d-flex"
										on:click={() => {
											selectedUser.set(doctor?.uid);
											goto('../messages');
										}}
									>
										<span class="material-symbols-outlined"> send </span>
										<span class="mx-auto">{$_('actions.send_msg')}</span>
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
				<div class="row mt-3">
					<div class="p-3">
						<div class="card-body d-flex flex-column">
							{#if doctor?.details}
								<div class="card p-3">
									<div class="d-flex align-items-center gap-1" style="color: #54744c">
										<span class="material-symbols-outlined"> info </span>
										<h6 class="mb-0">{$_('doctor.about')}</h6>
									</div>
									<div class="mt-3 ps-3">
										{@html doctor?.details}
									</div>
								</div>
								{#if doctor?.hospital}
									<div class="card p-3 mt-3" style="color: #54744c">
										<div class="d-flex align-items-center gap-1">
											<span class="material-symbols-outlined"> home_health </span>
											<h6 class="mb-0">{$_('doctor.hospitals')}</h6>
										</div>

										<ul class="list-group list-group-flush mt-1">
											{#each JSON.parse(doctor?.hospital) as hospital}
												<li class="list-group-item">{hospital}</li>
											{/each}
										</ul>
									</div>
								{/if}
								{#if doctor?.certificates}
									<div class="card p-3 mt-3" style="color: #54744c">
										<div class="d-flex align-items-center gap-1">
											<span class="material-symbols-outlined"> workspace_premium </span>
											<h6 class="mb-0">{$_('doctor.certificates')}</h6>
										</div>

										<ul class="list-group list-group-flush mt-1">
											{#each JSON.parse(doctor?.certificates) as hospital}
												<li class="list-group-item">{hospital}</li>
											{/each}
										</ul>
									</div>
								{/if}
								{#if doctor?.langs}
									<div class="card p-3 mt-3" style="color: #54744c">
										<div class="d-flex align-items-center gap-1">
											<span class="material-symbols-outlined"> language </span>
											<h6 class="mb-0">{$_('doctor.langs_spoken')}</h6>
										</div>

										<ul class="list-group list-group-flush mt-1">
											{#each JSON.parse(doctor?.langs) as hospital}
												<li class="list-group-item">{$_(`langs.` + hospital)}</li>
											{/each}
										</ul>
									</div>
								{/if}
								{#if doctor?.diseases}
									<div class="card p-3 mt-3" style="color: #54744c">
										<div class="d-flex align-items-center gap-1">
											<span class="material-symbols-outlined"> microbiology </span>
											<h6 class="mb-0">{$_('doctor.diseases')}</h6>
										</div>

										<ul class="list-group list-group-flush mt-1">
											{#each JSON.parse(doctor?.diseases) as hospital}
												<li class="list-group-item">{hospital}</li>
											{/each}
										</ul>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-4">
				{#if !$mobile}
					<div class="row px-3">
						{#if !existingAppointment}
							<button
								class="btn btn-outline-primary d-flex justify-content-center align-items-center btnRandevu w-100"
								on:click={openModal}
								><span class="material-symbols-outlined">local_library</span><span
									style="margin-inline: auto;">{$_('appointment.get')}</span
								></button
							>
						{:else}
							<div
								class="card p-4 mt-auto"
								style="max-height: 250px;
							min-width: min(100%, 350px);
							border-radius: 8px;
							align-self: baseline"
							>
								<span style="font-size: small;">{$_('appointment.planned')}: </span>
								<span class="my-auto">{formatDate(new Date(existingAppointment.startTime))}</span>
								<button
									class="btn btn-outline-primary mt-2 d-flex align-items-center"
									on:click={() => {
										goto('../appointment');
									}}
								>
									<span class="material-symbols-outlined"> info </span>
									<span class="mx-auto">{$_('actions.details')}</span>
								</button>
								{#if existingAppointment.purchased}
									<button
										class="btn btn-outline-primary mt-3 w-100 d-flex"
										on:click={() => {
											selectedUser.set(doctor?.uid);
											goto('../messages');
										}}
									>
										<span class="material-symbols-outlined"> send </span>
										<span class="mx-auto">{$_('actions.send_msg')}</span>
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
				<!-- COMMENTS CONTAINER -->
				<div class="row px-3 mt-3">
					<div class="card p-3 px-4" style="position: relative;">
						<span>{$_('doctor.comments')}</span>

						{#if commentsLoading}
							<div class="progress-bar">
								<div class="progress-animation"></div>
							</div>
						{:else}
							<!-- POST COMMENT -->
							{#if $session.loggedIn && !$alreadyCommented}
								<div class="col-12">
									<form class="d-flex flex-column" on:submit|preventDefault={postComment}>
										<!-- <span
											>{$session.user?.displayName ||
												$session.user?.email ||
												$session.user?.phoneNumber}</span
										> -->

										<div class="d-flex gap-3 align-items-center">
											<label style="font-size: small" for="comment"
												>{$_('doctor.your_comment')}</label
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
										</div>
										<textarea class="form-control mt-2" name="comment" id="comment" />
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
							<div
								class="d-flex flex-column gap-3 mt-2 pt-3"
								style="border-top: 1px solid #ececec;"
							>
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
												>{$_('doctor.await_confirmation')}</span
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
													<div class="d-flex gap-2 commentor">
														<span class="name"
															>{comment.displayName || comment.email || 'Adsız İstifadəçi'}</span
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
									<span>{$_('doctor.no_comments')}</span>
								{/if}
							</div>{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
