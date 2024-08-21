<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { dataLoading, postData, doctors } from '$lib/store/dataStore';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import { toast } from '@zerodevx/svelte-toast';
	import { writable } from 'svelte/store';
	import { session } from '$lib/session';

	let docData: any = null;

	$: if ($session.user && $doctors.length) {
		if ($doctors.find((d) => d.id == $session.user?.doctor)) {
			docData = $doctors.find((d) => d.id == $session.user?.doctor);
		}
	}

	let btnDisabled = writable(false);
	let btnText = $_('actions.send');

	async function formSubmit(e: Event) {
		const formData: any = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		data.date = jsDateToSQL(new Date());
		if (docData) {
			data.name = docData.name;
			data.contact = 'dr: ' + docData.id;
		}

		dataLoading.set(true);
		let res = await postData('contact', { ...data });
		if (res) {
			let toastMsg =
				$_('actions.message_sent') +
				'<br/><span style="font-size:14px">' +
				$_('actions.thank_for_contact') +
				'</span>';
			toast.push(toastMsg, {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(91 144 77)',
					'--toastBarBackground': '#1d5b3c'
				}
			});
			dataLoading.set(false);
			btnDisabled.set(true);
			btnText = $_('actions.success');
		}
	}
</script>

<form class="d-flex flex-column gap-1" on:submit|preventDefault={formSubmit}>
	{#if !docData}
		<label class="form-label" for="name">{$_('login.name_surname')}</label>
		<input name="name" id="name" type="text" class="form-control" required autocomplete="off" />

		<label class="form-label" for="contact">{$_('login.contact')}</label>
		<input
			name="contact"
			id="contact"
			type="text"
			class="form-control"
			placeholder="Mobil / email"
			required
			autocomplete="off"
		/>
	{/if}

	<label class="form-label" for="message">{$_('login.message')}</label>
	<textarea id="message" name="message" class="form-control" rows="3" required></textarea>

	<button class="btn btn-primary mt-3 btnLoader" disabled={$dataLoading || $btnDisabled}>
		<span>{btnText}</span>
		{#if $dataLoading}
			<div class="loader"></div>
		{/if}
	</button>
</form>

<style>
	.form-label {
		margin-bottom: 0;
	}
	input::placeholder {
		color: darkgray;
	}
</style>
