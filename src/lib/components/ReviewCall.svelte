<script lang="ts">
	import { ongoingAppointment, postData, reviewModal } from '$lib/store/dataStore';
	import { session } from '$lib/session';
	import { formatDate, jsDateToSQL } from '$lib/helpers/dateFormatter';
	import { toast } from '@zerodevx/svelte-toast';
	import { _ } from 'svelte-i18n';
	let callQuality: number = 0;
	let docStars: any;
	let comment: string = '';

	async function formSubmit(e: SubmitEvent) {
		const formData: any = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		let doctorComment = docStars
			? {
					userId: $session.user?.uid,
					doctorId: $ongoingAppointment.doctorId,
					comment: data.comment,
					star: docStars,
					date: formatDate(new Date(), true)
				}
			: null;

		console.log(doctorComment);

		let reviewData = {
			userId: $session.user?.uid,
			appointmentId: $ongoingAppointment.id,
			callQuality,
			message: data.message,
			date: jsDateToSQL(new Date())
		};

		console.log(reviewData);

		await Promise.all([postData('comments', doctorComment), postData('reviews', reviewData)]);

		toast.push($_('actions.thank_for_review'), {
			duration: 2000,
			theme: {
				'--toastColor': 'mintcream',
				'--toastBackground': 'rgb(91 144 77)',
				'--toastBarBackground': '#1d5b3c'
			}
		});

		reviewModal.set(false);
	}
</script>

<div class="container">
	<div class="col">
		<h5>Zəhmət olmasa baş tutan görüşü dəyərləndirin</h5>
	</div>

	<form class="d-flex flex-column gap-1 mt-3" on:submit|preventDefault={formSubmit}>
		<div>
			<label for="callQuality">Video görüntü keyfiyyəti</label>
			<div class="d-flex">
				{#each [1, 2, 3, 4, 5] as star, index}
					<button
						on:click|preventDefault={() => (callQuality = index + 1)}
						class="material-symbols-outlined star"
						class:icon-fill={callQuality >= star}
					>
						star
					</button>
				{/each}
			</div>
		</div>
		<div>
			<label for="docStars">Həkimi qiymətləndirin</label>
			<div class="d-flex">
				{#each [1, 2, 3, 4, 5] as star, index}
					<button
						on:click|preventDefault={() => (docStars = index + 1)}
						class="material-symbols-outlined star"
						class:icon-fill={docStars >= star}
					>
						star
					</button>
				{/each}
			</div>
		</div>
		<label class="form-label" for="message"
			>Həkim haqqında şərhiniz <span style="color: #6b6b6b; font-size: small"
				>(boş buraxa bilərsiniz)</span
			></label
		>
		<textarea class="form-control" name="comment" id="message" bind:value={comment}></textarea>
		<label class="form-label" for="message"
			>Bizə mesajınız <span style="color: #6b6b6b; font-size: small">(boş buraxa bilərsiniz)</span
			></label
		>
		<textarea class="form-control" name="message" id="message"></textarea>

		<button
			type="submit"
			class="btn btn-primary mt-3 d-flex"
			disabled={!callQuality || (!!comment.length && !docStars)}
		>
			<span class="material-symbols-outlined"> check </span>
			<span class="mx-auto">Göndər</span>
		</button>
		<button
			class="btn btn-secondary mt-1 d-flex"
			on:click|preventDefault={() => {
				reviewModal.set(false);
			}}
		>
			<span class="material-symbols-outlined"> close </span>
			<span class="mx-auto">Bağla</span>
		</button>
	</form>
</div>
