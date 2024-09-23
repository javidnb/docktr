<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Usage from './Usage.svelte';
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('usage.header')}</h1>
	</div>
</section>

<div class="container">
	<div class="col">
		<div class="row my-3">
			<Usage />
		</div>
		<div class="row mt-3 mb-5">
			<span
				>Nəzərinizə çatdırırıq ki, pasientlər və həkimlərin arasında olan bütün dialoq və
				məlumatların ötürülməsi konfidensialdır. Həkimlərin yazdığı dərman vasitələri və müalicə
				üsulları onların öz məsuliyyətindədir. Şirkətimiz bu müalicə üsulları və dərmanların
				təsirinə və ya təsirsizliyinə görə hər hansı məsuliyyət daşımamaqdadır.</span
			>
		</div>
	</div>
</div>
