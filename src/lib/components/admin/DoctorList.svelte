<script lang="ts">
	import { dataLoading, doctors, putData } from '$lib/store/dataStore';
	import { writable, get } from 'svelte/store';
	import Select from 'svelte-select';
	import { diseases } from '$lib/store/diseases';
	import { onMount } from 'svelte';
	import Editor from '@tinymce/tinymce-svelte';

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

	let nationality: any = [
		{ value: 'aze', label: 'Azərbaycan' },
		{ value: 'turk', label: 'Türk' },
		{ value: 'iran', label: 'İran' }
	];

	let selectedNationality: any;

	let langs: any = [
		{ value: 'aze', label: 'Azərbaycanca' },
		{ value: 'eng', label: 'İngiliscə' },
		{ value: 'ru', label: 'Rusca' },
		{ value: 'turk', label: 'Türkcə' },
		{ value: 'iran', label: 'Farsca' }
	];

	let selectedLangs: any = [];

	let details = '';
	let docName: string = '';
	let contact: string = '';

	let hospitals: any = [''];

	let certificates: any = [''];

	let hastalik: any = [];

	$: if ($selectedDoc) {
		if (selectedDoctor !== get(doctors).find((doc) => doc.id == $selectedDoc)) {
			selectedDoctor = get(doctors).find((doc) => doc.id == $selectedDoc);
			console.log(selectedDoctor);
			if (selectedDoctor) {
				doctor.set({ ...$doctors.find((doc: any) => doc.id == $selectedDoc) });
				docName = selectedDoctor.name || '';
				contact = selectedDoctor.contact || '';
				details = selectedDoctor.details || '';
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
					}
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
		selectedLangs = [];
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
		data.diseases = data.diseases
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

		const response = await putData('doctors', 'id', $doctor.id, data);

		if (response == 'ok') {
			selectedDoctor = { ...selectedDoctor, ...data };
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
			selectedDoc.set(null);
		}
	}
</script>

<div class="d-flex align-items-center w-100">
	<h5 style="margin-bottom: 0; min-width: 150px">
		{$selectedDoc == 0 ? 'Yeni Həkim' : $selectedDoc ? 'Həkim haqqında' : 'Həkimlər'}
	</h5>
	{#if !$selectedDoc}
		<button
			class="btn btn-outline-primary d-flex align-items-center ms-4"
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
			class="btn btn-outline-primary d-flex align-items-center ms-4"
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

<ul class="list-group list-group-flush mt-3">
	{#if !$selectedDoc}
		{#each $doctors as doc}
			<button
				class="list-group-item"
				style="text-align: left"
				on:click={() => selectedDoc.set(doc.id)}>{doc.name}</button
			>
		{/each}
	{:else}
		<div class="pb-3">
			<div class="d-flex w-100 justify-content-center">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src={$doctor.img} style="height: 100px" alt="Doctor Photo" />
			</div>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
					<label for="name" class="form-label">Ad Soyad</label>
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
				<div class="form-group mt-3">
					<label for="details" class="form-label">Məlumat</label>
					<Editor
						licenseKey="93fkaai35581b9yg7s333g4s65y6ckgbhvlc1abz90od47x9"
						scriptSrc="tinymce/tinymce.min.js"
						id="details"
						bind:value={details}
						{conf}
					/>
				</div>
				<!-- BRANSLAR -->
				<div class="form-group mt-3">
					<label for="branchSelector" class="form-label">Branşlar</label>
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
					>
						<div slot="prepend" class="d-flex align-items-center" style="padding-right: 10px">
							<span class="material-symbols-outlined"> category </span>
						</div>
					</Select>
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
								<input class="form-control" bind:value={hospital} />
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
								<input class="form-control" bind:value={cert} />
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

<style>
	.list-group {
		border-radius: 6px;
	}
	.list-group-item:hover {
		background-color: #ececec;
		transition-duration: 0.2s;
	}
</style>