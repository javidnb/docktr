<script>
	import Gpt from '$lib/components/Gpt.svelte';
</script>

<section class="mobileOnly w-100">
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
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4 mb-0 ps-5">Bizə Sual Ver</h1>
	</div>
</section>

<div class="d-flex justify-content-center align-items-center w-100 h-100">
	<Gpt />
</div>
