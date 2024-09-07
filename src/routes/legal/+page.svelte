<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Legal from '../appointment/Legal.svelte';
</script>

<section>
	<div class="jumbotron jumboHeader" style="padding-block: 1rem; background-color: #e2e9ef">
		<h1 class="display-4">{$_('legal.header')}</h1>
	</div>
</section>

<Legal />
