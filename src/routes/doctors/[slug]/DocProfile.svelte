<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		cancelAppointment,
		doctors,
		mobile,
		selectedBranch,
		selectedUser
	} from '$lib/store/dataStore';
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
	import { toast } from '@zerodevx/svelte-toast';
	import Editor from '@tinymce/tinymce-svelte';

	$: doctor = $doctors.find((d) => d.id == $session.user?.doctor);

	let existingAppointment: any;
	let editMode: boolean = false;

	$: if (doctor?.id)
		existingAppointment = $appointments.find(
			(ap) => ap.doctorId == doctor.id && new Date(ap.startTime) > new Date()
		);

	let showModal: boolean = false;
	let commentsLoading: boolean = true;
	let comments: any = writable<any>([]);
	export const alreadyCommented = writable<boolean>(false);

	let docName: string | null;
	let docDetails: string | null;

	$: showModal = !!$appointmentModal;
	$: if (showModal == false) appointmentModal.set(false);

	onMount(async () => {
		if (doctor) {
			docName = doctor.name;
			docDetails = doctor.details;

			if (!doctor?.userComments) {
				getComments();
			} else {
				comments.set(doctor.userComments);
				commentsLoading = false;
			}
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

	function changeDateFormat(dateString: string) {
		const parts = dateString.split('-');
		return `${parts[2]}-${parts[1]}-${parts[0]}`;
	}

	async function pay() {
		dataLoading.set(true);

		let order_id = existingAppointment.id;

		let body = {
			public_key: import.meta.env.VITE_EPOINT_KEY,
			amount: existingAppointment.amount,
			currency: 'AZN',
			language: 'az',
			order_id: order_id
		};
		// amount: parseFloat((doc.price + $comission).toFixed(2)),

		const response = await fetch('https://tekoplast.az/docktr/api/?sendPaymentRequest', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const result = await response.json();
		if (result.status == 'success') {
			window.location.href = result.redirect_url;
		} else {
			toast.push('Xəta! Zəhmət olmasa yenidən cəhd edin.', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(176 24 24)',
					'--toastBarBackground': '#5b1010'
				}
			});
		}
	}

	async function removeAppointment() {
		dataLoading.set(true);
		let result = await cancelAppointment(existingAppointment.id, $session.user?.uid);
		if (result.status == 'success') {
			appointments.set($appointments.filter((item) => item.id !== existingAppointment.id));
			dataLoading.set(false);
		} else {
			toast.push('Xəta! Zəhmət olmasa yenidən cəhd edin.', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(176 24 24)',
					'--toastBarBackground': '#5b1010'
				}
			});
		}
	}

	let conf = {
		height: 250,
		menubar: false,
		statusbar: false,
		plugins: [
			'advlist',
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'anchor',
			'searchreplace',
			'visualblocks',
			'code',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'preview',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | blocks | ' +
			'bold italic forecolor | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'removeformat | help'
	};
</script>

<button
	on:click={() => {
		history.back();
	}}
	class="btnBack mobileOnly btn"
	type="button"
	style="position: absolute;
		top: 10px;
		left: 5px;
		color: rgb(41 71 41);
		border: none;
		text-align: center;
		width: 56px;
		padding-left: 20px;
		height: 40px;"
>
	<span class="material-symbols-outlined"> arrow_back_ios </span>
</button>

<div style="position: relative">
	{#if doctor}
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
									});min-height:100px`}
								>
									<img
										src={doctor?.img
											? doctor.img
											: 'https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/docplaceholder.jpg'}
										alt={doctor?.name}
										style="max-height: 130px;
                                        aspect-ratio: 1/1;
                                        object-fit: cover;
                                        object-position: center;
                                        border-radius: 100%;
                                        box-shadow: 0px 0px 6px #0000000a"
									/>
								</div>
							</div>

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

									<h3 style="color: var(--primaryText)">{$_('titles.' + doctor?.title)} {doctor?.name || ''}</h3>

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
						</div>
						{#if $mobile}
							<div
								class="row p-3 mt-2"
								style="position: sticky; top: 0; background: #f9f9f9; z-index: 99; margin-bottom: -2rem"
							>
								{#if !existingAppointment}
									{#if !doctor.disableAppointments}
										<!-- <button
                                            class="btn btn-outline-primary d-flex justify-content-center align-items-center btnRandevu w-100"
                                            on:click={() => {
                                                goto('/book/' + doctor.slug);
                                            }}
                                            ><span class="material-symbols-outlined">local_library</span><span
                                                style="margin-inline: auto;">{$_('appointment.get')}</span
                                            ></button
                                        > -->
									{/if}
								{:else}
									<div
										class="card p-4 mt-auto"
										style="max-height: 250px;
                                min-width: min(100%, 350px);
                                border-radius: 8px;
                                align-self: baseline"
									>
										<span style="font-size: small;">{$_('appointment.planned')}: </span>
										<span class="my-auto"
											>{formatDate(new Date(existingAppointment.startTime))}</span
										>

										{#if existingAppointment.purchased}
											<button
												class="btn btn-outline-primary mt-2 d-flex align-items-center"
												on:click={() => {
													goto('../appointments');
												}}
											>
												<span class="material-symbols-outlined"> info </span>
												<span class="mx-auto">{$_('actions.details')}</span>
											</button>
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
										{:else}
											<button
												class="btn btn-outline-primary mt-2 d-flex align-items-center"
												disabled={$dataLoading}
												on:click={pay}
											>
												<span class="material-symbols-outlined"> shopping_cart </span>
												<span class="mx-auto">{$_('actions.pay')}</span>
											</button>
											<button
												class="btn btn-outline-primary mt-3 d-flex align-items-center"
												disabled={$dataLoading}
												on:click={removeAppointment}
											>
												<span class="material-symbols-outlined"> cancel </span>
												<span class="mx-auto">{$_('actions.cancel_appointment')}</span>
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
												{#if editMode}
													<Editor
														licenseKey="93fkaai35581b9yg7s333g4s65y6ckgbhvlc1abz90od47x9"
														scriptSrc="tinymce/tinymce.min.js"
														id="details"
														bind:value={docDetails}
														{conf}
														required
													/>
												{:else}
													{@html doctor?.details}
												{/if}
											</div>
										</div>
									{/if}
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
									{#if doctor?.education}
										<div class="card p-3 mt-3" style="color: #54744c">
											<div class="d-flex align-items-center gap-1">
												<span class="material-symbols-outlined"> school </span>
												<h6 class="mb-0">{$_('doctor.education')}</h6>
											</div>

											<ul class="list-group list-group-flush mt-1">
												{#each JSON.parse(doctor?.education) as edu}
													<li class="list-group-item">{edu}</li>
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
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-4">
						{#if !$mobile}
							<div class="row px-3">
								{#if !existingAppointment}
									{#if !doctor.disableAppointments}
										<!-- <button
                                            class="btn btn-outline-primary d-flex justify-content-center align-items-center btnRandevu w-100"
                                            on:click={openModal}
                                            ><span class="material-symbols-outlined">local_library</span><span
                                                style="margin-inline: auto;">{$_('appointment.get')}</span
                                            ></button
                                        > -->
									{/if}
								{:else}
									<div
										class="card p-4 mt-auto"
										style="max-height: 250px;
                                min-width: min(100%, 350px);
                                border-radius: 8px;
                                align-self: baseline"
									>
										<span style="font-size: small;">{$_('appointment.planned')}: </span>
										<span class="my-auto"
											>{formatDate(new Date(existingAppointment.startTime))}</span
										>

										{#if existingAppointment.purchased}
											<button
												class="btn btn-outline-primary mt-2 d-flex align-items-center"
												on:click={() => {
													goto('../appointments');
												}}
											>
												<span class="material-symbols-outlined"> info </span>
												<span class="mx-auto">{$_('actions.details')}</span>
											</button>
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
										{:else}
											<button
												class="btn btn-outline-primary mt-3 py-2 d-flex align-items-center"
												disabled={$dataLoading}
												on:click={pay}
											>
												<span class="material-symbols-outlined"> shopping_cart </span>
												<span class="mx-auto">{$_('actions.pay')}</span>
											</button>
											<button
												class="btn btn-outline-primary mt-3 d-flex align-items-center"
												disabled={$dataLoading}
												on:click={removeAppointment}
											>
												<span class="material-symbols-outlined"> cancel </span>
												<span class="mx-auto">{$_('actions.cancel_appointment')}</span>
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
									<!-- {#if $session.loggedIn && !$alreadyCommented}
                                        <div class="col-12">
                                            <form class="d-flex flex-column" on:submit|preventDefault={postComment}>					
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
                                    {/if} -->
									<!-- COMMENTS -->
									<div
										class="d-flex flex-column gap-3 mt-2 pt-3"
										style="border-top: 1px solid #ececec;"
									>
										{#each $comments as comment}
											{#if comment.status == null && comment.userId == $session.user?.uid}
												<div
													class="card commentCard p-3"
													style="background-color: rgb(243 243 243);"
												>
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
															<div class="d-flex gap-2 commentor">
																<span
																	>{comment.displayName ||
																		comment.email ||
																		'Adsız İstifadəçi'}</span
																>
																<div class="d-flex">
																	{#each Array.from({ length: comment.star }) as _}
																		<span class="material-symbols-outlined icon-fill star">
																			star
																		</span>
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
																	>{comment.displayName ||
																		comment.email ||
																		'Adsız İstifadəçi'}</span
																>
																<div class="d-flex">
																	{#each Array.from({ length: comment.star }) as _}
																		<span class="material-symbols-outlined icon-fill star">
																			star
																		</span>
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
	{:else}
		<div class="d-flex flex-column align-items-center mt-5">
			<span>Həkim tapılmadı</span>
			<button
				class="btn btn-primary mt-3"
				on:click={() => {
					goto('/doctors');
				}}
			>
				Həkimlər
			</button>
		</div>
	{/if}

	<div class="d-flex gap-2" style="position: fixed!important; bottom: 1rem; right: 1rem ">
		{#if editMode}
			<button
				on:click={() => {
					editMode = false;
				}}
				class="btn btn-danger d-flex align-items-center justify-content-center"
				style="height: 40px; width: 50px;"
				><span class="material-symbols-outlined icon-fill"> close </span></button
			>
			<button
				on:click={() => {
					editMode = false;
				}}
				class="btn btn-primary d-flex align-items-center justify-content-center"
				style="height: 40px; width: 50px;"
				><span class="material-symbols-outlined icon-fill"> check </span></button
			>
		{:else}
			<button
				on:click={() => {
					editMode = true;
				}}
				class="btn btn-primary d-flex align-items-center justify-content-center"
				style="height: 40px; width: 50px;"
				><span class="material-symbols-outlined icon-fill"> edit </span></button
			>
		{/if}
	</div>
</div>

<style>
	.branch button {
		color: var(--primaryText);
	}
	.branch button:hover {
		color: white;
	}
</style>
