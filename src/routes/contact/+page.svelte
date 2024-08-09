<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { dataLoading, postData } from '$lib/store/dataStore';
	import { jsDateToSQL } from '$lib/helpers/dateFormatter';
	import { toast } from '@zerodevx/svelte-toast';

	async function formSubmit(e: Event) {
		const formData: any = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		data.date = jsDateToSQL(new Date());

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
		}
	}
</script>

<section>
	<div class="jumbotron" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('nav.contact')}</h1>
	</div>
</section>

<div class="container d-flex justify-content-center">
	<div class="col col-md-8">
		<div class="row my-5">
			<form class="d-flex flex-column gap-1" on:submit|preventDefault={formSubmit}>
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

				<label class="form-label" for="message">{$_('login.message')}</label>
				<textarea id="message" name="message" class="form-control" rows="3" required></textarea>

				<button class="btn btn-primary mt-3 btnLoader" disabled={$dataLoading}>
					<span>{$_('actions.send')}</span>
					{#if $dataLoading}
						<div class="loader"></div>
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>

<style>
	.form-label {
		margin-bottom: 0;
	}
</style>
