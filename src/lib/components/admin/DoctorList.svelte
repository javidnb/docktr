<script lang="ts">
	import {
		dataLoading,
		doctors,
		putData,
		langs,
		nationality,
		postData,
		latinize
	} from '$lib/store/dataStore';
	import { writable, get } from 'svelte/store';
	import Select from 'svelte-select';
	import { diseases } from '$lib/store/diseases';
	import { onMount } from 'svelte';
	import Editor from '@tinymce/tinymce-svelte';
	import { _ } from 'svelte-i18n';

	let selectedDoc: any = writable(null);
	let selectedDoctor: any;
	let doctor: any = writable(null);

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

	let branches = diseases.map((d) => ({
		value: d.id,
		label: d.name
	}));

	let selectedBranches: any = [];
	let selectedDiseases: any = [];

	let selectedNationality: any;

	let selectedLangs: any = [];

	let details = '';
	let docName: string = '';
	let contact: string = '';
	let price: string = '';
	let appointmentDuration: string = '';
	let hospitals: any = [''];
	let certificates: any = [''];
	let hastalik: any = [];

	let titles = [
		{ value: 1, label: 'Dr' },
		{ value: 2, label: 'Doç' },
		{ value: 3, label: 'Asistan' }
	];

	let selectedTitle: any = 'Dr';

	$: if ($selectedDoc) {
		if (selectedDoctor !== get(doctors).find((doc) => doc.id == $selectedDoc)) {
			selectedDoctor = get(doctors).find((doc) => doc.id == $selectedDoc);
			console.log(selectedDoctor);
			if (selectedDoctor) {
				doctor.set({ ...$doctors.find((doc: any) => doc.id == $selectedDoc) });
				docName = selectedDoctor.name || '';
				contact = selectedDoctor.contact || '';
				details = selectedDoctor.details || '';
				selectedTitle =
					titles.find((t) => t.value == selectedDoctor.title) || titles.find((t) => t.value == 1);
				selectedNationality = nationality.find((n: any) => n.value == selectedDoctor.nationality);
				hospitals = selectedDoctor.hospital
					? JSON.parse(selectedDoctor.hospital) || selectedDoctor.hospital
					: [''];
				certificates = selectedDoctor.certificates ? JSON.parse(selectedDoctor.certificates) : [''];

				if (selectedDoctor.langs) {
					let dbLangs = JSON.parse(selectedDoctor.langs);
					if (dbLangs && dbLangs.length)
						selectedLangs = dbLangs
							.map((b: string) => langs.find((brr: { value: string }) => brr.value === b) ?? null)
							.filter((lang: any) => lang !== null);
				}

				if (selectedDoctor.diseases) {
					let dbDiseases = JSON.parse(selectedDoctor.diseases);
					if (dbDiseases && dbDiseases.length) {
						dbDiseases.forEach(
							(d: any) => (selectedDiseases = selectedDiseases.concat(dbDiseases))
						);
					} else selectedDiseases = null;
					// selectedLangs = dbLangs
					// 	.map((b: string) => langs.find((brr: { value: string }) => brr.value === b) ?? null)
					// 	.filter((lang: any) => lang !== null);
				}

				let br = selectedDoctor.branches;
				if (br && br.length)
					br.forEach((b: any) => {
						selectedBranches = [...selectedBranches, branches.find((brr) => brr.value == b)];
					});
			}
		}
	} else {
		doctor.set(null);
		selectedDoctor = null;
		selectedNationality = null;
		selectedBranches = [];
		selectedDiseases = [];
		selectedLangs = [];
		details = '';
		docName = '';
		contact = '';
		selectedTitle = titles.find((t) => t.value == 1);
		hospitals = [''];
		certificates = [''];
		hastalik = [];
		fileInput = null;
		avatar = null;
		file = null;
	}

	onMount(() => {
		if (diseases.length) {
			for (const category of diseases) {
				for (const [conditionName] of Object.entries(category.conditions)) {
					hastalik.push(conditionName);
				}
			}
			hastalik = Array.from(new Set(hastalik));
		}
	});

	async function handleSubmit(e: Event) {
		const formData: any = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		data.details = details;
		data.branches = selectedBranches.length
			? JSON.stringify(selectedBranches.map((sb: any) => sb.value))
			: null;
		data.title = selectedTitle.value;
		data.appointmentDuration = data.appointmentDuration ? parseInt(data.appointmentDuration) : null;
		data.price = data.price ? parseFloat(data.price) : null;
		data.diseases = selectedDiseases?.length
			? JSON.stringify(JSON.parse(data.diseases).map((dd: any) => dd.label))
			: null;
		data.hospital = hospitals.filter((str: string) => str !== '').length
			? JSON.stringify(hospitals.filter((str: string) => str !== ''))
			: null;
		data.certificates = certificates.filter((str: string) => str !== '').length
			? JSON.stringify(certificates.filter((str: string) => str !== ''))
			: null;
		data.langs = selectedLangs.length
			? JSON.stringify(selectedLangs.map((sb: any) => sb.value))
			: null;
		data.nationality = selectedNationality ? selectedNationality.value : null;

		console.log(data);

		if (avatar)
			data.img = 'https://ik.imagekit.io/d2nwsj0ktvh/docktr/uploads/' + (await uploadFile());

		let response: any;

		if ($doctor?.id) {
			response = await putData('doctors', 'id', $doctor.id, data);
		} else {
			dataLoading.set(true);
			data.slug = latinize(data.name);
			response = await postData('doctors', data);
		}

		if (response == 'ok') {
			selectedDoctor = { ...selectedDoctor, ...data };

			if ($doctor?.id) {
				doctors.update((items) => {
					return items.map((item) =>
						item.id === selectedDoctor.id
							? {
									...item,
									...selectedDoctor,
									branches: JSON.parse(selectedDoctor.branches),
									diseases: selectedDoctor.diseases,
									hospital: selectedDoctor.hospital,
									certificates: selectedDoctor.certificates,
									langs: selectedDoctor.langs
								}
							: item
					);
				});
			} else {
				doctors.set([
					...$doctors,
					{ ...selectedDoctor, branches: JSON.parse(selectedDoctor.branches) }
				]);
			}

			selectedDoc.set(null);
			dataLoading.set(false);
		}
	}

	let fileInput, avatar: any, file: any;
	let uploading: boolean;
	let uploadProgress = 0;

	const onFileSelected = (e: any) => {
		let image = e.target.files[0];
		file = image;
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = async (e) => {
			if (e.target) {
				avatar = e.target.result;
				const formData = new FormData();
				formData.append('file', image);
			}
		};
	};

	function uploadFile() {
		dataLoading.set(true);
		return new Promise((resolve, reject) => {
			if (!file) {
				alert('Please select a file');
				reject('No file selected');
				return;
			}

			const formData = new FormData();
			formData.append('file', file);

			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					uploadProgress = (event.loaded / event.total) * 100;
				}
			});

			xhr.upload.addEventListener('loadstart', () => {
				uploading = true;
				uploadProgress = 0;
			});

			xhr.upload.addEventListener('loadend', () => {
				uploading = false;
				file = null;
			});

			xhr.onreadystatechange = () => {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					const response = JSON.parse(xhr.responseText);

					if (xhr.status === 200 && response.status === 'success') {
						console.log('File uploaded successfully: ' + response.filename);
						resolve(response.filename);
					} else {
						console.log('File upload failed: ' + response.message);
						reject(response.message);
					}
				}
			};

			xhr.open('POST', 'https://tekoplast.az/docktr/api/?upload');
			xhr.send(formData);
		});
	}
</script>

<div class="d-flex flex-wrap align-items-center w-100 col-gap-5 row-gap-2">
	{#if !$selectedDoc}
		<button
			class="btn btn-outline-primary d-flex align-items-center wm-100"
			style="min-width: 200px;"
			on:click={() => {
				selectedDoc.set('0');
			}}
		>
			<span class="material-symbols-outlined"> add </span>
			<span class="mx-auto">Yeni Həkim</span>
		</button>
	{:else}
		<button
			class="btn btn-outline-primary d-flex align-items-center wm-100"
			style="min-width: 200px;"
			on:click={() => {
				selectedDoc.set(null);
			}}
		>
			<span class="material-symbols-outlined"> close </span>
			<span class="mx-auto">Bağla</span>
		</button>
	{/if}
</div>

<div class="container">
	<ul class="list-group list-group-flush mt-3">
		{#if !$selectedDoc}
			{#each $doctors as doc}
				<button
					class="list-group-item"
					style="text-align: left"
					on:click={() => selectedDoc.set(doc.id)}
				>
					{#if titles.find((t) => t.value == doc.title)}
						{titles.find((t) => t.value == doc.title)?.label + ' '}
					{/if}
					{doc.name}
				</button>
			{/each}
		{:else}
			<div class="pb-3">
				<!-- DOC PHOTO -->
				<div
					style="position: relative;
					justify-content: center;
					display: flex;"
				>
					{#if $doctor?.img || avatar}
						<div style="position: relative;">
							<img
								src={avatar ? avatar : $doctor?.img}
								alt="Profile Pic"
								style="max-width: 100px; border-radius: 100%; 
								aspect-ratio: 1/1; object-fit: cover; cursor: pointer"
								data-bs-toggle="dropdown"
							/>
							<div class="dropdown">
								<button
									class="btn btn-secondary"
									type="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
									style="position: absolute; right: -5px; bottom: -5px;
									background: white; border: 1px solid #ececec;
									border-radius: 8px; padding: 5px; color: black;
									display: flex; justify-content: center;"
								>
									<span class="material-symbols-outlined icon-fill"> add </span>
								</button>
								<ul class="dropdown-menu">
									<li>
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
										<label
											for="fileInput"
											class="dropdown-item d-flex align-items-center gap-1"
											style="cursor: pointer;"
											><span class="material-symbols-outlined"> add </span>{$_(
												'actions.add_pp'
											)}</label
										>
									</li>
									<li>
										<a
											class="dropdown-item d-flex align-items-center gap-1"
											href={$doctor?.img}
											target="_blank"
											><span class="material-symbols-outlined"> fullscreen </span>{$_(
												'actions.view_pp'
											)}</a
										>
									</li>
								</ul>
							</div>
						</div>
					{:else}
						<div
							style="width: 100px; 
						height: 100px;
						color: var(--primaryColor);
						border-radius: 100%;
						border: 3px solid var(--primaryColor);
						display: flex; align-items: center; justify-content: center; position: relative"
						>
							<span class="material-symbols-outlined icon-fill" style="font-size: 4rem">
								person
							</span>
							<span
								class="material-symbols-outlined icon-fill"
								style="position: absolute; right: -5px; bottom: -5px;
							background: white; border: 1px solid #ececec; border-radius: 8px; padding: 5px"
							>
								add
							</span>
						</div>
					{/if}
					<label
						for="fileInput"
						style="
						position: absolute;
						top: -7px;
						right: -7px;
						color: var(--primaryColor);
						width: {$doctor?.img ? '10%' : '100%'};
						height: 100%;
						display: flex;
						justify-content: end;
						cursor: pointer"
					>
					</label>

					<input
						class="form-control d-none"
						id="fileInput"
						type="file"
						accept=".jpg, .jpeg, .png"
						on:change={(e) => onFileSelected(e)}
						bind:this={fileInput}
					/>
				</div>

				<form on:submit|preventDefault={handleSubmit}>
					<div class="form-group">
						<label for="name" class="form-label"
							>Ad Soyad <span style="font-weight: 600; color: red">*</span></label
						>
						<div class="input-group">
							<Select
								class="form-control"
								items={titles}
								--width="150px"
								--border-radius="0px"
								--border-focused="1px solid var(--primaryColor)"
								--item-is-active-bg="var(--primaryColor)"
								--item-hover-bg="#d9e1d7"
								bind:value={selectedTitle}
								clearable={false}
							></Select>
							<input
								name="name"
								type="text"
								class="form-control"
								id="name"
								placeholder="Ad Soyad"
								value={docName}
								required
							/>
						</div>
					</div>

					<!-- BRANSLAR -->
					<div class="form-group mt-3">
						<label for="branchSelector" class="form-label"
							>Branşlar <span style="font-weight: 600; color: red">*</span></label
						>
						<Select
							class="form-control"
							items={branches}
							bind:value={selectedBranches}
							placeholder="Branşlar"
							multiple
							id="branchSelector"
							name="branches"
							--border-radius="8px"
							--border-focused="1px solid var(--primaryColor)"
							required
						>
							<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
								<span class="material-symbols-outlined"> category </span>
							</div>
						</Select>
					</div>

					<!-- DETAILS -->
					<div class="form-group mt-3">
						<label for="details" class="form-label">Məlumat</label>
						<Editor
							licenseKey="93fkaai35581b9yg7s333g4s65y6ckgbhvlc1abz90od47x9"
							scriptSrc="tinymce/tinymce.min.js"
							id="details"
							bind:value={details}
							{conf}
							required
						/>
					</div>

					<!-- ILGI ALANLARI -->
					<div class="form-group mt-3">
						<label for="branchSelector" class="form-label">Müalicə etdiyi xəstəliklər</label>
						<Select
							class="form-control"
							items={hastalik}
							bind:value={selectedDiseases}
							placeholder="Hastalıklar"
							multiple
							id="disSelector"
							name="diseases"
							--border-radius="8px"
							--border-focused="1px solid var(--primaryColor)"
						>
							<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
								<span class="material-symbols-outlined"> microbiology </span>
							</div>
						</Select>
					</div>
					<!-- NATIONALITY -->
					<div class="form-group mt-3">
						<label for="branchSelector" class="form-label">Milliyət</label>
						<Select
							class="form-control"
							items={nationality}
							placeholder="Milliyət"
							id="nationality"
							name="nationality"
							bind:value={selectedNationality}
							--border-radius="8px"
							--border-focused="1px solid var(--primaryColor)"
							--item-is-active-bg="var(--primaryColor)"
							--item-hover-bg="#d9e1d7"
						>
							<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
								<span class="material-symbols-outlined"> flag </span>
							</div>
						</Select>
					</div>
					<!-- KONUSTUGU DILLER -->
					<div class="form-group mt-3">
						<label for="branchSelector" class="form-label">Danışdığı dillər</label>
						<Select
							class="form-control"
							items={langs}
							bind:value={selectedLangs}
							multiple
							placeholder="Danışdığı dillər"
							id="langs"
							name="langs"
							--border-radius="8px"
							--border-focused="1px solid var(--primaryColor)"
						>
							<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
								<span class="material-symbols-outlined"> language </span>
							</div>
						</Select>
					</div>

					<!-- ÇALIŞTIĞI HASTANELER -->
					<div class="form-group mt-3">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<div class="d-flex gap-3 align-items-center">
							<label class="form-label">Çalıştığı hastaneler</label>
							<button
								on:click|preventDefault={() => {
									hospitals = [...hospitals, ''];
								}}
								class="btn btn-outline-primary">+ Add Hospital</button
							>
						</div>
						<ul class="list-group list-group-flush d-flex gap-3 mt-2">
							{#each hospitals as hospital, index}
								<div class="input-group">
									<input class="form-control" bind:value={hospital} placeholder="Xəstəxana Adı" />
									<button
										class="btn"
										on:click={() => {
											hospitals = [...hospitals.slice(0, index), ...hospitals.slice(index + 1)];
											if (!hospitals.length) {
												hospitals = [''];
											}
										}}>x</button
									>
								</div>
							{/each}
						</ul>
					</div>

					<!-- SERTIFIKALAR -->
					<div class="form-group mt-3">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<div class="d-flex gap-3 align-items-center">
							<label class="form-label">Sertifikalar</label>
							<button
								on:click|preventDefault={() => {
									certificates = [...certificates, ''];
								}}
								class="btn btn-outline-primary">+ Add Certificate</button
							>
						</div>
						<ul class="list-group list-group-flush d-flex gap-3 mt-2">
							{#each certificates as cert, index}
								<div class="input-group">
									<input class="form-control" bind:value={cert} placeholder="Sertifikat Adı" />
									<button
										class="btn"
										on:click={() => {
											certificates = [
												...certificates.slice(0, index),
												...certificates.slice(index + 1)
											];
											if (!certificates.length) {
												certificates = [''];
											}
										}}>x</button
									>
								</div>
							{/each}
						</ul>
					</div>

					<!-- APPOINTMENT DETAILS -->
					<div class="row">
						<div class="col col-md-6">
							<div class="form-group mt-3">
								<label for="appointmentDuration" class="form-label">Randevu süresi (dakika)</label>
								<input
									name="appointmentDuration"
									type="text"
									class="form-control"
									id="appointmentDuration"
									placeholder="30"
									value={appointmentDuration}
									required
								/>
							</div>
						</div>

						<div class="col col-md-6">
							<div class="form-group mt-3">
								<label for="price" class="form-label">Ücret</label>
								<input
									name="price"
									type="text"
									class="form-control"
									id="price"
									placeholder="9.99"
									value={price}
									required
								/>
							</div>
						</div>
					</div>

					<!-- CONTACT -->
					<div class="form-group mt-3">
						<label for="contact" class="form-label">İletişim (gizlidir)</label>
						<input
							name="contact"
							type="text"
							class="form-control"
							id="contact"
							placeholder="Mobile"
							value={contact}
						/>
					</div>

					<button type="submit" class="btn btn-primary mt-3 w-100" disabled={$dataLoading}
						>{$doctor && $doctor.id ? 'Yenilə' : 'Əlavə et'}</button
					>
				</form>
			</div>
		{/if}
	</ul>
</div>

<style>
	.btn-outline-primary:not(:hover) {
		background-color: white;
		color: #95af8e;
	}
	.list-group {
		border-radius: 6px;
	}
	.list-group-item:hover {
		background-color: #ececec;
		transition-duration: 0.2s;
	}
</style>
