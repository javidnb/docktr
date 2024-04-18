<script lang="ts">
	let date = new Date();
</script>

<section>
	<div class="container-fluid">
		<div class="row">
			<div class="col">
				<form class="d-flex flex-column row-gap-3">
					<label for="date">Tarix</label>
					<input class="form-control" type="date" id="date" value={date} />
					<label for="time">Saat</label>
					<input class="form-control" type="time" id="time" />
					<button class="btn btn-primary">Göndər</button>
				</form>
			</div>
		</div>
	</div>
</section>
