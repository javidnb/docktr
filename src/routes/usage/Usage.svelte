<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<div class="d-flex flex-column">
	<div class="fw-500">{$_('usage.register')}</div>
	<ul>
		<li>{$_('usage.reg1')}</li>
		<li>{$_('usage.reg2')}</li>
		<li>{$_('usage.reg3')}</li>
		<li>{$_('usage.reg4')}</li>
	</ul>
	<div class="fw-500">{$_('usage.choose_doc')}</div>
	<ul>
		<li>{$_('usage.doc1')}</li>
		<li>{$_('usage.doc2')}</li>
		<li>{$_('usage.doc3')}</li>
	</ul>
	<div class="fw-500">{$_('usage.get_app')}</div>
	<ul>
		<li>{$_('usage.app1')}</li>
	</ul>
	<div class="fw-500">{$_('usage.pay')}</div>
	<ul>
		<li>{$_('usage.pay1')}</li>
		<li>{$_('usage.pay2')}</li>
		<li>{$_('usage.pay3')}</li>
	</ul>
	<div class="fw-500">{$_('usage.join_app')}</div>
	<ul>
		<li>{$_('usage.japp1')}</li>
		<li>{$_('usage.japp2')}</li>
	</ul>
	<div class="fw-500">{$_('usage.files')}</div>
	<ul>
		<li>{$_('usage.file1')}</li>
		<li>{$_('usage.file2')}</li>
	</ul>
	<div class="fw-500">{$_('usage.reapp')}</div>
	<ul>
		<li>{$_('usage.re1')}</li>
	</ul>
	<div class="fw-500">{$_('usage.check_info')}</div>
	<ul>
		<li>{$_('usage.check1')}</li>
	</ul>
</div>
