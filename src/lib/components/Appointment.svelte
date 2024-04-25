<script lang="ts">
	import { onMount } from 'svelte';

	const currentDate = new Date();
	currentDate.setDate(currentDate.getDate() + 1);
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');
	const tomorrow = `${year}-${month}-${day}`;

	onMount(async () => {
		console.log(tomorrow);
	});

	function handleSubmit(e: SubmitEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(data);
		// let profession = diseases.find((d) => d.name == data.profession);
		// console.log(profession?.id);
	}
</script>

<section>
	<div class="container-fluid">
		<div class="row">
			<div class="col">
				<form
					class="d-flex flex-column row-gap-3 p-3"
					on:submit|preventDefault={handleSubmit}
				>
					<label for="date">Tarix</label>
					<input
						name="date"
						class="form-control"
						type="date"
						id="date"
						value={tomorrow}
						min={tomorrow}
					/>
					<label for="time">Saat</label>
					<input name="time" class="form-control" type="time" id="time" min="09:00" max="21:00" />
					<button type="submit" class="btn btn-primary">Randevu al</button>
				</form>
			</div>
		</div>
	</div>
</section>
