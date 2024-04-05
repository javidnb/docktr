<script lang="ts">
	import { diseases } from '$lib/diseases';
	function handleSubmit(e: SubmitEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(data);
		let profession = diseases.find((d) => d.name == data.profession);
		console.log(profession?.id);
	}
</script>

<h3 class="p-3">Admin Panel</h3>

<div class="container-fluid">
	<div class="row mt-3 justify-content-center">
		<div class="col-md-5">
			<h5>Həkim əlavə et</h5>
			<hr />
		</div>
	</div>
	<div class="row justify-content-center">
		<div class="col-md-5">
			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
					<label for="name">Adı Soyad</label>
					<input
						name="name"
						type="text"
						class="form-control"
						id="name"
						placeholder="Ad Soyad"
						required
					/>
				</div>
				<div class="form-group">
					<label for="profession">Uzmanlık</label>
					<input
						name="profession"
						class="form-control"
						list="professions"
						id="profession"
						required
					/>
					<datalist id="professions">
						{#each diseases as item}
							<option value={item.name} data-value={item.id}></option>
						{/each}
					</datalist>
				</div>
				<div class="form-group">
					<label for="details">Məlumat</label>
					<textarea name="details" class="form-control" id="details" rows="3"></textarea>
				</div>
				<button type="submit" class="btn btn-primary">Əlavə et</button>
				<!-- formaction="?/register" -->
			</form>
		</div>
	</div>
</div>
