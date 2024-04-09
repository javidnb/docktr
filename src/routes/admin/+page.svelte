<script lang="ts">
	import { diseases } from '$lib/store/diseases';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';

	if (!$session.loggedIn) {
		goto('./');
	}

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

<section>
	<div class="jumbotron" style="padding-top: 2rem; background-color: #e2e9ef">
		<h1 class="display-4">Admin Panel</h1>
		<!-- <p class="lead">We connect you to doctors around the world!</p> -->
		<hr />
		<!-- <p>
			It uses utility classes for typography and spacing to space content out within the larger
			container.
		</p> -->
		<!-- <a class="btn btn-primary btn-lg" href="#" role="button">Doktorlar</a> -->
	</div>
</section>

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
						placeholder="Uzmanlık"
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
